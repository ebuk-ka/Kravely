// ============================================================
// src/hooks/useKravelyData.js
// Shared data layer for ALL dashboards + OrderNow
// Columns match the actual Supabase schema exactly
// ============================================================
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

// ─── FORMAT HELPERS ──────────────────────────────────────────
export const fmt = {
  kobo: (k) => `₦${Math.round((k || 0) / 100).toLocaleString("en-NG")}`,
  naira: (n) => `₦${Math.round(n || 0).toLocaleString("en-NG")}`,
  time: (iso) => {
    if (!iso) return "—";
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(iso).toLocaleDateString("en-NG");
  },
};

// ─── STATUS STYLES ───────────────────────────────────────────
export const STATUS_STYLE = {
  pending: { color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.35)" },
  confirmed: { color: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.35)" },
  preparing: { color: "#eab308", bg: "rgba(234,179,8,0.12)", border: "rgba(234,179,8,0.35)" },
  ready: { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.35)" },
  delivered: { color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.35)" },
  cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)" },
  active: { color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.35)" },
  inactive: { color: "#6b7280", bg: "rgba(107,114,128,0.12)", border: "rgba(107,114,128,0.35)" },
};

// ─── APP SETTINGS (localStorage) ─────────────────────────────
export function useAppSettings() {
  const [settings, setSettings] = useState({
    deliveryFee: parseInt(localStorage.getItem("kravely_delivery_fee") || "300"),
    commissionRate: parseFloat(localStorage.getItem("kravely_commission") || "15"),
    siteStatus: localStorage.getItem("kravely_site_status") || "open",
  });

  const save = (key, val) => {
    localStorage.setItem(`kravely_${key}`, val);
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  return { settings, save };
}

// ─── LIVE STATS (admin + CEO) ────────────────────────────────
export function useStats() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    kravelyCut: 0,
    todayCut: 0,
    totalUsers: 0,
    newUsersToday: 0,
    totalVendors: 0,
    activeVendors: 0,
    deliveryRate: 0,
    avgOrderValue: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const today = new Date().toISOString().split("T")[0];

    const [oRes, uRes, vRes] = await Promise.all([
      supabase.from("orders").select("id,total_amount,subtotal,kravely_cut,status,placed_at"),
      supabase.from("profiles").select("id,created_at"),
      supabase.from("vendors").select("id,is_active,is_approved"),
    ]);

    const all = oRes.data || [];
    const users = uRes.data || [];
    const vends = vRes.data || [];
    const todayO = all.filter((o) => (o.placed_at || "").startsWith(today));
    const deliv = all.filter((o) => o.status === "delivered");
    const active = all.filter((o) =>
      ["pending", "confirmed", "preparing", "ready"].includes(o.status)
    );

    const totalRev = all.reduce((s, o) => s + (o.total_amount || 0), 0);
    const todayRev = todayO.reduce((s, o) => s + (o.total_amount || 0), 0);
    const kCut = all.reduce((s, o) => s + (o.kravely_cut || 0), 0);
    const todayCut = todayO.reduce((s, o) => s + (o.kravely_cut || 0), 0);

    setStats({
      totalOrders: all.length,
      todayOrders: todayO.length,
      activeOrders: active.length,
      totalRevenue: totalRev,
      todayRevenue: todayRev,
      kravelyCut: kCut,
      todayCut,
      totalUsers: users.length,
      newUsersToday: users.filter((u) => (u.created_at || "").startsWith(today)).length,
      totalVendors: vends.length,
      activeVendors: vends.filter((v) => v.is_active && v.is_approved).length,
      deliveryRate: all.length ? Math.round((deliv.length * 1000) / all.length) / 10 : 0,
      avgOrderValue: all.length ? Math.round(totalRev / all.length) : 0,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();

    const ch = supabase
      .channel("stats-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetch)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "profiles" }, fetch)
      .on("postgres_changes", { event: "*", schema: "public", table: "vendors" }, fetch)
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, [fetch]);

  return { stats, loading, refetch: fetch };
}

// ─── ALL ORDERS (admin + CEO) ────────────────────────────────
export function useAllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const { data: rawOrders, error } = await supabase
      .from("orders")
      .select("*")
      .order("placed_at", { ascending: false })
      .limit(300);

    if (error) {
      console.error("orders error:", error);
      setLoading(false);
      return;
    }

    if (!rawOrders?.length) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const studentIds = [...new Set(rawOrders.map((o) => o.student_id).filter(Boolean))];
    const vendorIds = [...new Set(rawOrders.map((o) => o.vendor_id).filter(Boolean))];

    const [profRes, vendRes] = await Promise.all([
      studentIds.length
        ? supabase.from("profiles").select("id,full_name,phone,email").in("id", studentIds)
        : { data: [] },
      vendorIds.length
        ? supabase.from("vendors").select("id,name,phone").in("id", vendorIds)
        : { data: [] },
    ]);

    const profMap = Object.fromEntries((profRes.data || []).map((p) => [p.id, p]));
    const vendMap = Object.fromEntries((vendRes.data || []).map((v) => [v.id, v]));

    setOrders(
      rawOrders.map((o) => ({
        ...o,
        student: profMap[o.student_id] || null,
        vendor: vendMap[o.vendor_id] || null,
      }))
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();

    const ch = supabase
      .channel("admin-orders-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, fetch)
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, [fetch]);

  return { orders, loading, refetch: fetch };
}

// ─── ALL VENDORS (admin) ─────────────────────────────────────
export function useAllVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("total_revenue", { ascending: false });

    if (error) console.error("vendors error:", error);

    setVendors(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();

    const ch = supabase
      .channel("vendors-rt")
      .on("postgres_changes", { event: "*", schema: "public", table: "vendors" }, fetch)
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, [fetch]);

  const toggleFeatured = async (id, val) => {
    await supabase
      .from("vendors")
      .update({ is_featured: val, updated_at: new Date().toISOString() })
      .eq("id", id);
    fetch();
  };

  const toggleActive = async (id, val) => {
    await supabase
      .from("vendors")
      .update({ is_active: val, updated_at: new Date().toISOString() })
      .eq("id", id);
    fetch();
  };

  const approveVendor = async (id) => {
    await supabase
      .from("vendors")
      .update({ is_approved: true, updated_at: new Date().toISOString() })
      .eq("id", id);
    fetch();
  };

  const addVendor = async (data) => {
    const { data: v, error } = await supabase.from("vendors").insert(data).select().single();
    if (error) throw error;
    fetch();
    return v;
  };

  return {
    vendors,
    loading,
    toggleFeatured,
    toggleActive,
    approveVendor,
    addVendor,
    refetch: fetch,
  };
}

// ─── ALL USERS (admin) ───────────────────────────────────────
export function useAllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setUsers(data || []);
        setLoading(false);
      });
  }, []);

  return { users, loading };
}

// ─── PUBLIC VENDORS (OrderNow) ───────────────────────────────
export function usePublicVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const { data, error } = await supabase
      .from("vendors")
      .select("*")
      .eq("is_active", true)
      .eq("is_approved", true)
      .order("is_featured", { ascending: false });

    if (error) {
      console.error("public vendors error:", error);
      setVendors([]);
    } else {
      setVendors(data || []);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();

    const ch = supabase
      .channel("public-vendors-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vendors" },
        fetch
      )
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, [fetch]);

  return { vendors, loading };
}

// ─── PUBLIC MENU ITEMS (OrderNow) ────────────────────────────
export function usePopularItems(limit = 12) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*, vendors(id, name, is_active, is_approved)")
      .eq("is_available", true)
      .order("total_orders", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("popular items error:", error);
      setItems([]);
    } else {
      const filtered = (data || []).filter(
        (i) => i.vendors?.is_active && i.vendors?.is_approved
      );
      setItems(filtered);
    }

    setLoading(false);
  }, [limit]);

  useEffect(() => {
    fetch();

    const ch = supabase
      .channel("menu-items-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "menu_items" },
        fetch
      )
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, [fetch]);

  return { items, loading };
}

// ─── VENDOR OWN ORDERS ───────────────────────────────────────
export function useVendorOwnOrders(vendorId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!vendorId) return;

    const { data: rawOrders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("placed_at", { ascending: false });

    if (error) {
      console.error("vendor orders error:", error);
      setLoading(false);
      return;
    }

    if (!rawOrders?.length) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const studentIds = [...new Set(rawOrders.map((o) => o.student_id).filter(Boolean))];
    const orderIds = rawOrders.map((o) => o.id);

    const [profRes, itemsRes] = await Promise.all([
      studentIds.length
        ? supabase.from("profiles").select("id,full_name,phone").in("id", studentIds)
        : { data: [] },
      supabase.from("order_items").select("*").in("order_id", orderIds),
    ]);

    const profMap = Object.fromEntries((profRes.data || []).map((p) => [p.id, p]));
    const itemsMap = (itemsRes.data || []).reduce((acc, item) => {
      if (!acc[item.order_id]) acc[item.order_id] = [];
      acc[item.order_id].push(item);
      return acc;
    }, {});

    setOrders(
      rawOrders.map((o) => ({
        ...o,
        student: profMap[o.student_id] || null,
        order_items: itemsMap[o.id] || [],
      }))
    );

    setLoading(false);
  }, [vendorId]);

  useEffect(() => {
    fetch();
    if (!vendorId) return;

    const ch = supabase
      .channel(`vendor-orders-${vendorId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `vendor_id=eq.${vendorId}`,
        },
        fetch
      )
      .subscribe();

    return () => supabase.removeChannel(ch);
  }, [vendorId, fetch]);

  const updateStatus = async (orderId, newStatus) => {
    const ts = new Date().toISOString();

    const extra =
      {
        confirmed: { confirmed_at: ts },
        preparing: { confirmed_at: ts },
        ready: { prepared_at: ts },
        delivered: { delivered_at: ts },
        cancelled: { cancelled_at: ts },
      }[newStatus] || {};

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, ...extra, updated_at: ts })
      .eq("id", orderId);

    if (error) console.error("updateStatus error:", error);
    else fetch();
  };

  return { orders, loading, updateStatus, refetch: fetch };
}

// ─── VENDOR MENU ─────────────────────────────────────────────
export function useVendorMenu(vendorId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!vendorId) {
  setItems([]);
  setLoading(false);
  return;
}

    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });

    if (error) console.error("menu error:", error);

    setItems(data || []);
    setLoading(false);
  }, [vendorId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const toggleAvailability = async (id, val) => {
    await supabase
      .from("menu_items")
      .update({ is_available: val, updated_at: new Date().toISOString() })
      .eq("id", id);
    fetch();
  };

  const addItem = async (item) => {
    const { data, error } = await supabase
      .from("menu_items")
      .insert({ ...item, vendor_id: vendorId })
      .select()
      .single();

    if (error) throw error;

    fetch();
    return data;
  };

  const deleteItem = async (id) => {
    await supabase.from("menu_items").delete().eq("id", id);
    fetch();
  };

  return { items, loading, toggleAvailability, addItem, deleteItem, refetch: fetch };
}