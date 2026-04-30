import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useVendorOwnOrders, useVendorMenu, fmt, STATUS_STYLE } from "../hooks/useKravelyData";

function Badge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.inactive;
  return <span style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}`, fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif", whiteSpace: "nowrap" }}>{status}</span>;
}

const NEXT = { pending: { status: "confirmed", label: "Confirm Order" }, confirmed: { status: "preparing", label: "Start Preparing" }, preparing: { status: "ready", label: "Mark as Ready" }, ready: { status: "delivered", label: "Mark Delivered ✓" } };

// ─── ADD ITEM MODAL ──────────────────────────────────────────
function AddItemModal({ onClose, onSave }) {
  const [form, setForm]       = useState({ name: "", description: "", price: "", emoji: "🍽️", category: "local" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const inp = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: "none", boxSizing: "border-box" };

  const save = async () => {
    if (!form.name.trim()) return setError("Name is required");
    if (!form.price || parseFloat(form.price) <= 0) return setError("Valid price is required");
    setLoading(true); setError("");
    try {
      await onSave({ name: form.name.trim(), description: form.description.trim() || null, price: Math.round(parseFloat(form.price) * 100), emoji: form.emoji || "🍽️", category: form.category, is_available: true });
      onClose();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 22, padding: "24px", width: "100%", maxWidth: 440 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, margin: 0 }}>Add Menu Item</h2>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#fff", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
        {error && <p style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontFamily: "'DM Sans',sans-serif", marginBottom: 14 }}>{error}</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[["Item Name *","name","Jollof Rice + Chicken"],["Emoji","emoji","🍽️"],["Price (₦) *","price","1800"],["Description","description","What's in this meal"]].map(([l,k,ph]) => (
            <div key={k}>
              <label style={{ color: "#6b7280", fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>{l}</label>
              <input value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })} placeholder={ph} type={k === "price" ? "number" : "text"} style={inp} />
            </div>
          ))}
          <div>
            <label style={{ color: "#6b7280", fontSize: 11, fontFamily: "'DM Sans',sans-serif", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ ...inp, cursor: "pointer" }}>
              {["local","rice","soups","snacks","drinks","combos","protein"].map(c => <option key={c} value={c} style={{ background: "#111" }}>{c[0].toUpperCase()+c.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "12px", borderRadius: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14 }}>Cancel</button>
          <button onClick={save} disabled={loading} style={{ flex: 2, background: "#22c55e", color: "#000", border: "none", padding: "12px", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 14, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Saving…" : "Add Item ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN EXPORT ─────────────────────────────────────────────
export default function VendorDashboard() {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const [tab,          setTab]          = useState("orders");
  const [showAddItem,  setShowAddItem]  = useState(false);
  const [user,         setUser]         = useState(null);
  const [vendor,       setVendor]       = useState(null);
  const [authLoading,  setAuthLoading]  = useState(true);
  const [shopToggling, setShopToggling] = useState(false);

  useEffect(() => {
    const loadVendor = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/login");
        return;
      }

      setUser(session.user);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setVendor(null);
        setAuthLoading(false);
        return;
      }

      let query = supabase
        .from("vendors")
        .select("*")
        .eq("is_approved", true);

      if (profile?.role === "admin" && vendorId) {
        query = query.eq("id", vendorId);
      } else {
        query = query.eq("owner_id", session.user.id);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Error fetching vendor:", error);
        setVendor(null);
      } else {
        setVendor(data || null);
      }

      setAuthLoading(false);
    };

    loadVendor();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate, vendorId]);

  const { orders, loading: oL, updateStatus }         = useVendorOwnOrders(vendor?.id);
  const { items,  loading: mL, toggleAvailability, addItem, deleteItem } = useVendorMenu(vendor?.id);

  const handleSignOut = async () => { await supabase.auth.signOut(); navigate("/"); };

  const toggleShop = async () => {
    if (!vendor || shopToggling) return;
    setShopToggling(true);
    const { error } = await supabase.from("vendors").update({ is_open: !vendor.is_open }).eq("id", vendor.id);
    if (!error) setVendor(v => ({ ...v, is_open: !v.is_open }));
    setShopToggling(false);
  };

  const today       = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter(o => (o.placed_at || "").startsWith(today));
  const todayRev    = todayOrders.reduce((s, o) => s + (o.subtotal || 0), 0);
  const pending     = orders.filter(o => o.status === "pending").length;
  const totalRev    = orders.filter(o => o.status === "delivered").reduce((s, o) => s + (o.subtotal || 0), 0);

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 20, color: "#000" }}>K</span>
          </div>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <p style={{ fontSize: 52, marginBottom: 16 }}>🏪</p>
          <h2 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 10 }}>No vendor account found</h2>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.7, marginBottom: 22 }}>
            Your account isn't linked to a vendor yet. Contact Ebuka to set it up — he'll update your vendor row with your user ID in Supabase.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/" style={{ background: "#22c55e", color: "#000", textDecoration: "none", borderRadius: 50, padding: "11px 24px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14 }}>Back to Kravely</Link>
            <button onClick={handleSignOut} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7280", borderRadius: 50, padding: "11px 24px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14 }}>Sign Out</button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [{ id: "orders", icon: "🛒", label: "Orders" }, { id: "menu", icon: "🍽️", label: "Menu" }, { id: "stats", icon: "📊", label: "Stats" }];

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .tc { animation: fadeInUp 0.35s ease both; }
        .oc:hover { border-color: rgba(34,197,94,0.2) !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#000" }}>
        {/* Navbar */}
        <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 18, color: "#000" }}>K</span>
              </div>
            </Link>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, margin: 0 }}>{vendor.name}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: vendor.is_open ? "#22c55e" : "#6b7280", animation: vendor.is_open ? "pulse 2s infinite" : "none" }} />
                <span style={{ color: vendor.is_open ? "#22c55e" : "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700 }}>{vendor.is_open ? "Open for orders" : "Shop closed"}</span>
                {pending > 0 && <span style={{ background: "#f97316", color: "#fff", fontSize: 10, fontWeight: 800, padding: "1px 7px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif" }}>{pending} new</span>}
              </div>
            </div>
            <button onClick={toggleShop} disabled={shopToggling} style={{ background: vendor.is_open ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", border: `1px solid ${vendor.is_open ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, color: vendor.is_open ? "#ef4444" : "#22c55e", padding: "7px 14px", borderRadius: 50, cursor: shopToggling ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12, opacity: shopToggling ? 0.6 : 1 }}>
              {shopToggling ? "…" : vendor.is_open ? "Close Shop" : "Open Shop"}
            </button>
            <button onClick={handleSignOut} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", padding: "7px 14px", borderRadius: 50, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 12 }}>Sign Out</button>
          </div>

          {/* Tab bar */}
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 10px", display: "flex", gap: 6, overflowX: "auto" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "8px 18px", borderRadius: 50, border: tab === t.id ? "1px solid rgba(34,197,94,0.25)" : "1px solid transparent", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, background: tab === t.id ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)", color: tab === t.id ? "#22c55e" : "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, transition: "all 0.2s", position: "relative" }}>
                {t.icon} {t.label}
                {t.id === "orders" && pending > 0 && <span style={{ background: "#f97316", color: "#fff", fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{pending > 9 ? "9+" : pending}</span>}
              </button>
            ))}
          </div>
        </nav>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px 80px" }}>

          {/* ── ORDERS ── */}
          {tab === "orders" && (
            <div className="tc">
              <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                {[["🛒","Today's Orders",todayOrders.length,"#60a5fa"],["⏳","Pending",pending,"#f97316"],["💰","Today Revenue",fmt.kobo(todayRev),"#22c55e"],["📦","Delivered",orders.filter(o=>o.status==="delivered").length,"#4ade80"]].map(([icon,l,v,c]) => (
                  <div key={l} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "13px 18px", flex: 1, minWidth: 120 }}>
                    <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginBottom: 4 }}>{icon} {l}</p>
                    <p style={{ color: c, fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 20, margin: 0 }}>{v}</p>
                  </div>
                ))}
              </div>

              {oL ? <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 14, textAlign: "center", padding: "40px 0" }}>Loading orders…</p>
                : orders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <p style={{ fontSize: 52, marginBottom: 14 }}>📭</p>
                    <p style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No orders yet</p>
                    <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>Orders will appear here in real time when students order from your shop.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {orders.map(order => {
                      const next = NEXT[order.status];
                      return (
                        <div key={order.id} className="oc" style={{ background: "#0a0a0a", border: `1px solid ${order.status === "pending" ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.06)"}`, borderRadius: 20, padding: "18px 20px", transition: "border-color 0.2s" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14 }}>{order.order_number}</span>
                                <Badge status={order.status} />
                                {order.status === "pending" && <span style={{ color: "#f97316", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, animation: "pulse 2s infinite" }}>🔴 NEW</span>}
                              </div>
                              <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginTop: 4 }}>
                                {order.student?.full_name || "Student"}
                                {order.student?.phone ? ` · ${order.student.phone}` : ""}
                                {" · "}{fmt.time(order.placed_at)}
                              </p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <p style={{ color: "#22c55e", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 18, margin: 0 }}>{fmt.kobo(order.subtotal)}</p>
                              {order.vendor_payout > 0 && <p style={{ color: "#374151", fontFamily: "'DM Sans',sans-serif", fontSize: 11, margin: 0 }}>Your cut: {fmt.kobo(order.vendor_payout)}</p>}
                            </div>
                          </div>

                          {/* Items */}
                          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
                            <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Items</p>
                            {(order.order_items || []).length === 0
                              ? <p style={{ color: "#4b5563", fontFamily: "'DM Sans',sans-serif", fontSize: 12 }}>No items data</p>
                              : (order.order_items || []).map((item, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: idx < order.order_items.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                                  <span style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>{item.emoji || "🍽️"} {item.name} ×{item.quantity}</span>
                                  <span style={{ color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13 }}>{fmt.kobo(item.price * item.quantity)}</span>
                                </div>
                              ))}
                          </div>

                          {/* Delivery */}
                          <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
                            <span style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>📍 {order.delivery_location || "No location"}</span>
                            {order.delivery_notes && <span style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>📝 {order.delivery_notes}</span>}
                          </div>

                          {/* Actions */}
                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {next && (
                              <button onClick={() => updateStatus(order.id, next.status)} style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "10px 22px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer", flex: 1, minWidth: 130, transition: "background 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "#16a34a"}
                                onMouseLeave={e => e.currentTarget.style.background = "#22c55e"}
                              >{next.label} →</button>
                            )}
                            {order.status === "pending" && (
                              <button onClick={() => { if (window.confirm("Cancel this order?")) updateStatus(order.id, "cancelled"); }} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: 50, padding: "10px 20px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                                Cancel
                              </button>
                            )}
                            {(order.status === "delivered" || order.status === "cancelled") && (
                              <span style={{ color: "#4b5563", fontFamily: "'DM Sans',sans-serif", fontSize: 13, padding: "10px 0" }}>
                                {order.status === "delivered" ? "✅ Completed" : "❌ Cancelled"}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          )}

          {/* ── MENU ── */}
          {tab === "menu" && (
            <div className="tc">
              {showAddItem && <AddItemModal onClose={() => setShowAddItem(false)} onSave={addItem} />}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
                <div>
                  <h2 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, margin: 0 }}>Your Menu</h2>
                  <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginTop: 3 }}>{items.filter(i => i.is_available).length} available · {items.filter(i => !i.is_available).length} hidden</p>
                </div>
                <button onClick={() => setShowAddItem(true)} style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "10px 20px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>+ Add Item</button>
              </div>

              {mL ? <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 14, textAlign: "center", padding: "40px 0" }}>Loading menu…</p>
                : items.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <p style={{ fontSize: 52, marginBottom: 14 }}>🍽️</p>
                    <p style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Menu is empty</p>
                    <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 14, marginBottom: 20 }}>Add your first item to start getting orders.</p>
                    <button onClick={() => setShowAddItem(true)} style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "12px 28px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Add First Item</button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: 14 }}>
                    {items.map(item => (
                      <div key={item.id} style={{ background: "#0a0a0a", border: `1px solid ${item.is_available ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)"}`, borderRadius: 18, padding: "16px", opacity: item.is_available ? 1 : 0.6, transition: "all 0.2s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <span style={{ fontSize: 28 }}>{item.emoji || "🍽️"}</span>
                            <div>
                              <p style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, margin: 0 }}>{item.name}</p>
                              <p style={{ color: "#22c55e", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13, margin: 0 }}>{fmt.kobo(item.price)}</p>
                            </div>
                          </div>
                          {/* Toggle switch */}
                          <button onClick={() => toggleAvailability(item.id, !item.is_available)} style={{ width: 44, height: 24, borderRadius: 12, background: item.is_available ? "#22c55e" : "rgba(255,255,255,0.1)", border: "none", cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s" }}>
                            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: item.is_available ? 23 : 3, transition: "left 0.2s ease", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
                          </button>
                        </div>
                        {item.description && <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginBottom: 10, lineHeight: 1.5 }}>{item.description}</p>}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: item.is_available ? "#22c55e" : "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700 }}>
                            {item.is_available ? "Available" : "Hidden"} · {item.total_orders || 0} sold
                          </span>
                          <button onClick={() => { if (window.confirm(`Delete "${item.name}"?`)) deleteItem(item.id); }} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontSize: 11 }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* ── STATS ── */}
          {tab === "stats" && (
            <div className="tc">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 13, marginBottom: 22 }}>
                {[["💰","Total Revenue",fmt.kobo(totalRev),"#22c55e"],["📈","Today Revenue",fmt.kobo(todayRev),"#4ade80"],["🛒","Total Orders",orders.length,"#60a5fa"],["✅","Delivered",orders.filter(o=>o.status==="delivered").length,"#22c55e"],["⏳","Pending",pending,"#f97316"],["⭐","Rating",vendor.rating || "None yet","#eab308"],["🍽️","Menu Items",items.length,"#a78bfa"],["✓","Available",items.filter(i=>i.is_available).length,"#22c55e"]].map(([icon,l,v,c]) => (
                  <div key={l} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "16px 18px" }}>
                    <span style={{ fontSize: 22, display: "block", marginBottom: 10 }}>{icon}</span>
                    <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 12, marginBottom: 4 }}>{l}</p>
                    <p style={{ color: c, fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(15px,2.5vw,20px)", margin: 0 }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Vendor profile */}
              <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px 22px" }}>
                <h3 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 17, marginBottom: 16 }}>Your Profile</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 12 }}>
                  {[["Name", vendor.name],["Category", vendor.category],["Phone", vendor.phone || "—"],["TikTok", vendor.tiktok_handle || "—"],["Location", vendor.location || "—"],["Delivery Time", vendor.delivery_time || "—"],["Commission", `${vendor.commission_rate || 15}%`],["Status", vendor.is_active ? "Active ✅" : "Inactive"]].map(([l, v]) => (
                    <div key={l} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 14px" }}>
                      <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{l}</p>
                      <p style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, margin: 0 }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        
        </div>
      </div>
    </>
  );
}
