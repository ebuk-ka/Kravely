// src/pages/AdminDashboard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Banknote,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Crown,
  Hourglass,
  LayoutDashboard,
  Loader2,
  Menu,
  Moon,
  Package,
  Plus,
  Radio,
  Rocket,
  Settings as SettingsIcon,
  ShoppingCart,
  Store,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import {
  useStats, useAllOrders, useAllVendors, useAllUsers, useAppSettings,
  fmt, STATUS_STYLE,
} from "../hooks/useKravelyData";

function Badge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.inactive;
  return (
    <span style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}`, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = "#22c55e", pulse }) {
  return (
    <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "18px 20px", position: "relative", transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color + "40"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {pulse && <div style={{ position: "absolute", top: 12, right: 12, width: 7, height: 7, borderRadius: "50%", background: color, animation: "pulse 2s infinite" }} />}
      <div style={{ display: "block", marginBottom: 10 }}>
        <Icon size={22} color={color} />
      </div>
      <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginBottom: 5 }}>{label}</p>
      <p style={{ color, fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(18px,2.5vw,24px)", letterSpacing: -1 }}>{value}</p>
      {sub && <p style={{ color: "#374151", fontFamily: "'DM Sans',sans-serif", fontSize: 11, marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function AddVendorModal({ onClose, onSave }) {
  const INIT = { name: "", description: "", category: "local", phone: "", tiktok_handle: "", location: "FUTO Campus", delivery_time: "20–30 min", commission_rate: 15 };
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inp = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box" };

  const save = async () => {
    if (!form.name.trim() || !form.phone.trim()) return setError("Name and phone are required");
    setLoading(true); setError("");
    try {
      await onSave({ ...form, is_open: true, is_active: true, is_approved: true, is_featured: false, rating: 0, total_orders: 0, total_revenue: 0 });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: "26px", width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Store size={20} color="#22c55e" />
            <h2 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, margin: 0 }}>Add Vendor</h2>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        {error && <p style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>{error}</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[["Vendor Name *","name","Pearl's Cuisine"],["Phone *","phone","09068987178"],["Description","description","About this vendor"],["TikTok","tiktok_handle","@handle"],["Location","location","Umuchima"],["Delivery Time","delivery_time","15–30 min"]].map(([l, k, ph]) => (
            <div key={k}>
              <label style={{ color: "#6b7280", fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>{l}</label>
              {k === "description"
                ? <textarea value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={ph} style={{ ...inp, minHeight: 70, resize: "vertical" }} />
                : <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={ph} style={inp} />}
            </div>
          ))}
          <div>
            <label style={{ color: "#6b7280", fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...inp, cursor: "pointer" }}>
              {["local","rice","soups","snacks","drinks","combos"].map(c => <option key={c} value={c} style={{ background: "#111" }}>{c[0].toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: "#6b7280", fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>Commission %</label>
            <input type="number" value={form.commission_rate} onChange={e => setForm({ ...form, commission_rate: parseFloat(e.target.value) || 15 })} style={inp} min="1" max="50" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "13px", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14 }}>Cancel</button>
          <button onClick={save} disabled={loading} style={{ flex: 2, background: "#22c55e", color: "#000", border: "none", padding: "13px", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 14, opacity: loading ? 0.6 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
            {loading ? "Adding…" : "Add Vendor"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, pendingCount }) {
  const nav = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "orders", icon: ShoppingCart, label: "Live Orders" },
    { id: "vendors", icon: Store, label: "Vendors" },
    { id: "users", icon: Users, label: "Users" },
    { id: "revenue", icon: Wallet, label: "Revenue" },
    { id: "settings", icon: SettingsIcon, label: "Settings" },
  ];
  return (
    <div style={{ width: collapsed ? 64 : 240, flexShrink: 0, background: "#030303", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", transition: "width 0.3s", overflow: "hidden" }}>
      <div style={{ padding: collapsed ? "20px 0" : "20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.06)", justifyContent: collapsed ? "center" : "flex-start" }}>
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 18, color: "#000" }}>K</span>
          </div>
        </Link>
        {!collapsed && <div><p style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 16, margin: 0 }}>Kravely</p><p style={{ color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1, margin: 0 }}>ADMIN</p></div>}
      </div>

      <div style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        {nav.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{ padding: collapsed ? "12px 0" : "12px 14px", borderRadius: 12, background: activeTab === item.id ? "rgba(34,197,94,0.12)" : "transparent", border: activeTab === item.id ? "1px solid rgba(34,197,94,0.25)" : "1px solid transparent", display: "flex", alignItems: "center", gap: 12, justifyContent: collapsed ? "center" : "flex-start", cursor: "pointer", width: "100%", position: "relative", transition: "all 0.15s" }}>
              <Icon size={18} color={activeTab === item.id ? "#22c55e" : "rgba(255,255,255,0.55)"} style={{ flexShrink: 0 }} />
              {!collapsed && <span style={{ color: activeTab === item.id ? "#22c55e" : "rgba(255,255,255,0.55)", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14 }}>{item.label}</span>}
              {item.id === "orders" && pendingCount > 0 && (
                <span style={{ position: "absolute", top: 8, right: collapsed ? 4 : 12, background: "#f97316", color: "#fff", fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{pendingCount > 9 ? "9+" : pendingCount}</span>
              )}
            </button>
          );
        })}
      </div>

      <button onClick={() => setCollapsed(!collapsed)} style={{ margin: "12px 8px", padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {!collapsed && (
        <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Crown size={16} color="#000" />
          </div>
          <div><p style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, margin: 0 }}>Ebuka Okolo</p><p style={{ color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontSize: 11, margin: 0 }}>CTO & Admin</p></div>
        </div>
      )}
    </div>
  );
}

function OverviewTab({ stats, orders, vendors }) {
  const N = v => fmt.kobo(v);
  const top = [...vendors].sort((a, b) => b.total_revenue - a.total_revenue).slice(0, 5);
  const recent = orders.slice(0, 7);
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#0a1f0a,#0f2d0f)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 22, padding: "22px 26px", marginBottom: 22, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 18, top: 18, opacity: 0.08 }}>
          <Rocket size={64} color="#22c55e" />
        </div>
        <p style={{ color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
          <Radio size={13} />
          Live data · Supabase realtime
        </p>
        <h2 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(18px,3vw,28px)", letterSpacing: -1, marginBottom: 14 }}>Kravely is live.</h2>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[[N(stats.kravelyCut),"Your 15% cut"],[stats.totalOrders+" orders","All time"],[stats.deliveryRate+"%","Success rate"],[stats.activeOrders+" active","Right now"]].map(([v,l]) => (
            <div key={l}><p style={{ color: "#22c55e", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 17, margin: 0 }}>{v}</p><p style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans',sans-serif", fontSize: 12, margin: 0 }}>{l}</p></div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(165px,1fr))", gap: 12, marginBottom: 22 }}>
        <StatCard icon={Banknote} label="Total Revenue" value={N(stats.totalRevenue)} color="#22c55e" pulse />
        <StatCard icon={BarChart3} label="Today Revenue" value={N(stats.todayRevenue)} sub={`${stats.todayOrders} orders`} color="#4ade80" pulse />
        <StatCard icon={CircleDollarSign} label="Our Cut (15%)" value={N(stats.kravelyCut)} color="#eab308" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} sub={`${stats.todayOrders} today`} color="#60a5fa" />
        <StatCard icon={Activity} label="Active Now" value={stats.activeOrders} color="#f97316" pulse />
        <StatCard icon={Users} label="Users" value={stats.totalUsers} sub={`+${stats.newUsersToday} today`} color="#a78bfa" />
        <StatCard icon={Store} label="Active Vendors" value={`${stats.activeVendors}/${stats.totalVendors}`} color="#22c55e" />
        <StatCard icon={Package} label="Delivery Rate" value={`${stats.deliveryRate}%`} color="#4ade80" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 16 }}>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "18px 20px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><Radio size={16} color="#f97316" />Live Orders</h3>
          {recent.length === 0 ? <p style={{ color: "#4b5563", fontSize: 13, fontFamily: "'DM Sans',sans-serif", textAlign: "center", padding: "20px 0" }}>No orders yet</p> : recent.map(o => (
            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 8 }}>
              <div><p style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, margin: 0 }}>{o.student?.full_name || "Student"}</p><p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 11, margin: 0 }}>{o.vendor?.name || "—"} · {fmt.time(o.placed_at)}</p></div>
              <div style={{ textAlign: "right" }}><p style={{ color: "#22c55e", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, margin: "0 0 3px" }}>{N(o.total_amount)}</p><Badge status={o.status} /></div>
            </div>
          ))}
        </div>

        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "18px 20px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><Trophy size={16} color="#eab308" />Top Vendors</h3>
          {top.length === 0 ? <p style={{ color: "#4b5563", fontSize: 13, fontFamily: "'DM Sans',sans-serif", textAlign: "center", padding: "20px 0" }}>No vendors yet</p> : top.map((v, i) => (
            <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 8 }}>
              <span style={{ color: i === 0 ? "#eab308" : i === 1 ? "#9ca3af" : "#cd7c2f", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 13, width: 22 }}>#{i+1}</span>
              <div style={{ flex: 1 }}><p style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, margin: 0 }}>{v.name}</p><p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 11, margin: 0 }}>{v.total_orders} orders</p></div>
              <p style={{ color: "#22c55e", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, margin: 0 }}>{N(v.total_revenue)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ orders }) {
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? orders : orders.filter(o => o.status === filter);
  const N = v => fmt.kobo(v);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {["all","pending","confirmed","preparing","ready","delivered","cancelled"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: "7px 14px", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, background: filter === f ? "#22c55e" : "rgba(255,255,255,0.06)", color: filter === f ? "#000" : "rgba(255,255,255,0.6)", transition: "all 0.2s" }}>
            {f[0].toUpperCase()+f.slice(1)}{f !== "all" && ` (${orders.filter(o => o.status === f).length})`}
          </button>
        ))}
      </div>
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "auto" }}>
        <div style={{ minWidth: 680 }}>
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 100px 120px 110px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            {["Order #","Customer","Vendor","Amount","Location","Status"].map(h => <span key={h} style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{h}</span>)}
          </div>
          {shown.length === 0
            ? <p style={{ color: "#4b5563", textAlign: "center", padding: "30px 0", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>No orders</p>
            : shown.map((o, i) => (
              <div key={o.id} style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 100px 120px 110px", padding: "12px 16px", borderBottom: i < shown.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <span style={{ color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12 }}>{o.order_number}</span>
                <div><p style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13, margin: 0 }}>{o.student?.full_name || "—"}</p><p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 11, margin: 0 }}>{fmt.time(o.placed_at)}</p></div>
                <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>{o.vendor?.name || "—"}</span>
                <span style={{ color: "#22c55e", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13 }}>{N(o.total_amount)}</span>
                <span style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>{o.delivery_location || "—"}</span>
                <Badge status={o.status} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function VendorsTab({ vendors, toggleFeatured, toggleActive, approveVendor, addVendor }) {
  const [showAdd, setShowAdd] = useState(false);
  const N = v => fmt.kobo(v);
  return (
    <div>
      {showAdd && <AddVendorModal onClose={() => setShowAdd(false)} onSave={addVendor} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <span style={{ color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Check size={14} />{vendors.filter(v => v.is_approved && v.is_active).length} active</span>
          <span style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}><Moon size={14} />{vendors.filter(v => v.is_approved && !v.is_active).length} inactive</span>
          {vendors.filter(v => !v.is_approved).length > 0 && <span style={{ color: "#f97316", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}><Hourglass size={14} />{vendors.filter(v => !v.is_approved).length} pending</span>}
        </div>
        <button onClick={() => setShowAdd(true)} style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "10px 20px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={14} />
          Add Vendor
        </button>
      </div>
      {vendors.length === 0
        ? <div style={{ textAlign: "center", padding: "60px 0" }}><Store size={44} color="#4b5563" style={{ marginBottom: 10 }} /><p style={{ color: "#4b5563", fontFamily: "'DM Sans',sans-serif", fontSize: 15 }}>No vendors yet</p></div>
        : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {vendors.map(v => (
              <div key={v.id} style={{ background: "#0a0a0a", border: `1px solid ${v.is_featured ? "rgba(234,179,8,0.3)" : !v.is_approved ? "rgba(249,115,22,0.25)" : "rgba(255,255,255,0.06)"}`, borderRadius: 18, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", transition: "all 0.2s" }}>
                <div style={{ flex: 1, minWidth: 130 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap", marginBottom: 3 }}>
                    <p style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, margin: 0 }}>{v.name}</p>
                    {v.is_featured && <span style={{ background: "rgba(234,179,8,0.15)", color: "#eab308", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: 4 }}><Crown size={11} />Featured</span>}
                    {!v.is_approved && <span style={{ background: "rgba(249,115,22,0.15)", color: "#f97316", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: 4 }}><Hourglass size={11} />Pending</span>}
                    {v.is_approved && !v.is_active && <span style={{ background: "rgba(107,114,128,0.15)", color: "#6b7280", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", display: "flex", alignItems: "center", gap: 4 }}><Moon size={11} />Inactive</span>}
                  </div>
                  <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 12, margin: 0 }}>{v.category} · {v.phone || "No phone"} · {v.commission_rate || 15}% commission</p>
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {[["Orders", v.total_orders || 0],["Revenue", N(v.total_revenue)],["Rating", v.rating || 0]].map(([l, val]) => (
                    <div key={l} style={{ textAlign: "center" }}><p style={{ color: "#22c55e", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14, margin: 0 }}>{val}</p><p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 11, margin: 0 }}>{l}</p></div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                  {!v.is_approved && <button onClick={() => approveVendor(v.id)} style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "7px 13px", borderRadius: 50, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}><Check size={12} />Approve</button>}
                  <button onClick={() => toggleFeatured(v.id, !v.is_featured)} style={{ background: v.is_featured ? "rgba(234,179,8,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${v.is_featured ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.1)"}`, color: v.is_featured ? "#eab308" : "#6b7280", padding: "7px 13px", borderRadius: 50, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
                    <Crown size={12} />
                    {v.is_featured ? "Featured" : "Set Featured"}
                  </button>
                  <button onClick={() => toggleActive(v.id, !v.is_active)} style={{ background: v.is_active ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", border: `1px solid ${v.is_active ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, color: v.is_active ? "#ef4444" : "#22c55e", padding: "7px 13px", borderRadius: 50, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12 }}>
                    {v.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

function UsersTab({ users }) {
  return (
    <div>
      <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginBottom: 16 }}>{users.length} registered students</p>
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "auto" }}>
        <div style={{ minWidth: 520 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 70px 110px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
            {["Name / Email","Joined","Orders","Status"].map(h => <span key={h} style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{h}</span>)}
          </div>
          {users.length === 0
            ? <p style={{ color: "#4b5563", textAlign: "center", padding: "30px 0", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>No users yet</p>
            : users.map((u, i) => (
              <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 70px 110px", padding: "12px 16px", borderBottom: i < users.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}
              >
                <div><p style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, margin: 0 }}>{u.full_name || "—"}</p><p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 11, margin: 0 }}>{u.email}</p></div>
                <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>{new Date(u.created_at).toLocaleDateString("en-NG")}</span>
                <span style={{ color: "#60a5fa", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 14 }}>{u.total_orders || 0}</span>
                <Badge status="active" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function RevenueTab({ stats, vendors }) {
  const N = v => fmt.kobo(v);
  const totalGMV = Math.round((stats.totalRevenue || 0) / 100);
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 12, marginBottom: 22 }}>
        {[["Total GMV",N(stats.totalRevenue),"#22c55e","All vendor sales"],["Kravely Cut",N(stats.kravelyCut),"#eab308","Our 15% commission"],["Today GMV",N(stats.todayRevenue),"#60a5fa","Today's sales"],["Today Cut",N(stats.todayCut),"#4ade80","Today's commission"],["Avg Order",N(stats.avgOrderValue),"#f97316","Per order"],["Delivery Rate",`${stats.deliveryRate}%`,"#a78bfa","Success rate"]].map(([l,v,c,d]) => (
          <div key={l} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px 18px" }}>
            <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginBottom: 5 }}>{l}</p>
            <p style={{ color: c, fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 20, marginBottom: 3 }}>{v}</p>
            <p style={{ color: "#374151", fontFamily: "'DM Sans',sans-serif", fontSize: 11 }}>{d}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px 22px" }}>
        <h3 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Revenue by Vendor</h3>
        {vendors.length === 0
          ? <p style={{ color: "#4b5563", fontFamily: "'DM Sans',sans-serif" }}>No vendor data yet</p>
          : vendors.map(v => {
            const rev = Math.round((v.total_revenue || 0) / 100);
            const pct = totalGMV > 0 ? Math.round(rev * 100 / totalGMV) : 0;
            return (
              <div key={v.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, flexWrap: "wrap", gap: 4 }}>
                  <span style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>{v.name}</span>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700 }}>{N(v.total_revenue)}</span>
                    <span style={{ color: "#eab308", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700 }}>+{N(Math.round(v.total_revenue * (v.commission_rate || 15) / 100))} ours</span>
                  </div>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.max(pct, 2)}%`, background: v.is_featured ? "linear-gradient(90deg,#eab308,#ca8a04)" : "linear-gradient(90deg,#22c55e,#4ade80)", borderRadius: 3, transition: "width 0.6s ease" }} />
                </div>
                <p style={{ color: "#374151", fontFamily: "'DM Sans',sans-serif", fontSize: 11, marginTop: 3 }}>{pct}% · {v.total_orders} orders</p>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function SettingsTab() {
  const { settings, save } = useAppSettings();
  const [fee, setFee] = useState(settings.deliveryFee);
  const [comm, setComm] = useState(settings.commissionRate);
  const [status, setStatus] = useState(settings.siteStatus);
  const [saved, setSaved] = useState(false);
  const inp = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", width: "100%", boxSizing: "border-box" };

  const handleSave = () => {
    save("delivery_fee", fee); save("commission", comm); save("site_status", status);
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "18px 20px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><Banknote size={16} color="#22c55e" />Delivery Fee (₦)</h3>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginBottom: 12 }}>Flat fee charged to students per order. Reflects on the OrderNow cart.</p>
          <input type="number" value={fee} onChange={e => setFee(Number(e.target.value))} style={inp} min="0" />
          <p style={{ color: "#374151", fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginTop: 6 }}>Currently ₦{fee} per order</p>
        </div>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "18px 20px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><BarChart3 size={16} color="#60a5fa" />Commission Rate (%)</h3>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginBottom: 12 }}>Kravely's cut from each order.</p>
          <input type="number" value={comm} onChange={e => setComm(Number(e.target.value))} style={inp} min="1" max="50" step="0.5" />
          <p style={{ color: "#374151", fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginTop: 6 }}>On ₦2,000 order → you earn ₦{Math.round(2000 * comm / 100).toLocaleString()}</p>
        </div>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "18px 20px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}><SettingsIcon size={16} color="#a78bfa" />Site Status</h3>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginBottom: 12 }}>Controls whether Kravely accepts new orders.</p>
          <div style={{ display: "flex", gap: 10 }}>
            {["open","maintenance","closed"].map(s => (
              <button key={s} onClick={() => setStatus(s)} style={{ padding: "9px 18px", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, background: status === s ? "#22c55e" : "rgba(255,255,255,0.06)", color: status === s ? "#000" : "rgba(255,255,255,0.5)" }}>
                {s[0].toUpperCase()+s.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleSave} style={{ background: saved ? "#16a34a" : "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "13px 30px", fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer", alignSelf: "flex-start", transition: "background 0.3s", display: "flex", alignItems: "center", gap: 8 }}>
          {saved ? <Check size={16} /> : <SettingsIcon size={16} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { stats, loading: sL } = useStats();
  const { orders, loading: oL } = useAllOrders();
  const { vendors, loading: vL, toggleFeatured, toggleActive, approveVendor, addVendor } = useAllVendors();
  const { users, loading: uL } = useAllUsers();

  const loading = sL || oL || vL || uL;
  const pendingCount = Array.isArray(orders)
    ? orders.filter(o => o.status === "pending").length
    : 0;

  const TAB_TITLES = { overview: "Dashboard", orders: "Live Orders", vendors: "Vendors", users: "Users", revenue: "Revenue", settings: "Settings" };

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .tab-content { animation: fadeInUp 0.35s ease both; }
        .spin { animation: spin 1s linear infinite; }
        @media(max-width:768px){ .adm-sidebar{display:none!important} .adm-sidebar.open{display:flex!important;position:fixed;inset:0;z-index:100;width:240px!important} .adm-mob{display:flex!important} }
        @media(min-width:769px){ .adm-mob{display:none!important} }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column" }}>
        <div className="adm-mob" style={{ display: "none", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#030303", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 16, color: "#000" }}>K</span>
            </div>
            <span style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15 }}>Admin</span>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Menu size={18} /></button>
        </div>

        {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 99, backdropFilter: "blur(4px)" }} />}

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div className={`adm-sidebar ${mobileOpen ? "open" : ""}`} style={{ display: "flex" }}>
            <Sidebar activeTab={activeTab} setActiveTab={t => { setActiveTab(t); setMobileOpen(false); }} collapsed={collapsed} setCollapsed={setCollapsed} pendingCount={pendingCount} />
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minWidth: 0 }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 5, flexWrap: "wrap", gap: 10 }}>
              <div>
                <h1 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 19, letterSpacing: -0.5, margin: 0 }}>{TAB_TITLES[activeTab]}</h1>
                <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 12, margin: "2px 0 0" }}>
                  {loading ? "Fetching live data…" : `${orders.length} orders · ${vendors.length} vendors · ${users.length} users`}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 50, padding: "5px 12px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
                  <span style={{ color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700 }}>LIVE</span>
                </div>
                <Link to="/" style={{ textDecoration: "none", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "6px 14px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  <ArrowLeft size={13} />
                  Site
                </Link>
              </div>
            </div>

            <div style={{ padding: "20px 16px 80px", flex: 1 }}>
              {loading
                ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0", flexDirection: "column", gap: 12 }}>
                    <Loader2 size={32} color="#22c55e" className="spin" />
                    <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>Connecting to Supabase…</p>
                  </div>
                : <div className="tab-content" key={activeTab}>
                    {activeTab === "overview" && <OverviewTab stats={stats} orders={orders} vendors={vendors} />}
                    {activeTab === "orders" && <OrdersTab orders={orders} />}
                    {activeTab === "vendors" && <VendorsTab vendors={vendors} toggleFeatured={toggleFeatured} toggleActive={toggleActive} approveVendor={approveVendor} addVendor={addVendor} />}
                    {activeTab === "users" && <UsersTab users={users} />}
                    {activeTab === "revenue" && <RevenueTab stats={stats} vendors={vendors} />}
                    {activeTab === "settings" && <SettingsTab />}
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
