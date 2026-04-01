import { useState } from "react";
import { Link } from "react-router-dom";

const SAMPLE_ORDERS = [
  { id: "KRV-001", customer: "Chidi Okafor", items: [{ name: "Jollof Rice + Chicken", qty: 2, price: 1800 }], total: 3900, status: "pending", time: "2 mins ago", location: "Hostel B, Room 14" },
  { id: "KRV-002", customer: "Amaka Eze", items: [{ name: "Egusi Soup + Fufu", qty: 1, price: 1500 }, { name: "Fried Plantain", qty: 1, price: 500 }], total: 2300, status: "preparing", time: "12 mins ago", location: "Faculty of Engineering" },
  { id: "KRV-003", customer: "Emeka Nwosu", items: [{ name: "Jumbo Rice Combo", qty: 3, price: 3500 }], total: 10800, status: "ready", time: "25 mins ago", location: "Hostel D, Room 7" },
  { id: "KRV-004", customer: "Ngozi Obi", items: [{ name: "Pepper Soup", qty: 2, price: 1200 }], total: 2700, status: "delivered", time: "1 hr ago", location: "ICT Building" },
  { id: "KRV-005", customer: "Kelechi Ibe", items: [{ name: "Native Rice", qty: 4, price: 2000 }], total: 8300, status: "delivered", time: "2 hrs ago", location: "Hostel A, Room 32" },
];

const SAMPLE_MENU = [
  { id: "mn1", name: "Jollof Rice + Chicken", price: 1800, category: "Rice", emoji: "🍚", available: true },
  { id: "mn2", name: "Fried Rice + Turkey", price: 2200, category: "Rice", emoji: "🍚", available: true },
  { id: "mn3", name: "Egusi Soup + Fufu", price: 1500, category: "Soup", emoji: "🍲", available: true },
  { id: "mn4", name: "Okra Soup + Fufu", price: 1400, category: "Soup", emoji: "🍲", available: false },
  { id: "mn5", name: "Jumbo Rice Combo", price: 3500, category: "Combos", emoji: "🍱", available: true },
  { id: "mn6", name: "Pepper Soup", price: 1200, category: "Soup", emoji: "🌶️", available: true },
];

const STATUS = {
  pending:   { label: "Pending",   color: "#f97316", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.3)",  next: "preparing", nextLabel: "Start Preparing" },
  preparing: { label: "Preparing", color: "#eab308", bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.3)",   next: "ready",     nextLabel: "Mark as Ready" },
  ready:     { label: "Ready ✓",   color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.3)",   next: "delivered", nextLabel: "Mark Delivered" },
  delivered: { label: "Delivered", color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)", next: null,        nextLabel: null },
};

// ===================== NAVBAR =====================
function VendorNavbar({ vendorName, activeTab, setActiveTab, pendingCount }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "orders",   label: "Orders",   icon: "🛒" },
    { id: "menu",     label: "Menu",     icon: "🍽️" },
    { id: "history",  label: "History",  icon: "📋" },
  ];

  return (
    <>
      <style>{`
        .vd-tab { transition: all 0.2s ease; cursor: pointer; white-space: nowrap; }
        .vd-tab:hover { color: #22c55e !important; border-color: rgba(34,197,94,0.3) !important; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .mobile-tabs { animation: slideDown 0.25s ease both; }
      `}</style>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>

          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 17, color: "#000" }}>K</span>
              </div>
            </Link>
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
            <div>
              <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}>Vendor Dashboard</p>
              <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>{vendorName}</p>
            </div>
          </div>

          {/* Desktop tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }} className="desktop-tabs">
            {tabs.map(tab => (
              <button key={tab.id} className="vd-tab" onClick={() => setActiveTab(tab.id)} style={{
                background: activeTab === tab.id ? "rgba(34,197,94,0.1)" : "none",
                border: activeTab === tab.id ? "1px solid rgba(34,197,94,0.3)" : "1px solid transparent",
                color: activeTab === tab.id ? "#22c55e" : "rgba(255,255,255,0.5)",
                padding: "7px 14px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 5,
                position: "relative",
              }}>
                {tab.icon} {tab.label}
                {tab.id === "orders" && pendingCount > 0 && (
                  <span style={{ background: "#f97316", color: "#fff", fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", top: -4, right: -4 }}>{pendingCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* Right — profile + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 50, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 16 }}>👩‍🍳</span>
            </div>
            {/* Hamburger — mobile only */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none" }} className="mobile-hamburger">
              <div style={{ width: 22, height: 2, background: "#fff", borderRadius: 2, marginBottom: 5, transition: "all 0.3s", transform: mobileMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
              <div style={{ width: 22, height: 2, background: "#fff", borderRadius: 2, marginBottom: 5, opacity: mobileMenuOpen ? 0 : 1, transition: "all 0.3s" }} />
              <div style={{ width: 22, height: 2, background: "#fff", borderRadius: 2, transition: "all 0.3s", transform: mobileMenuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
            </button>
          </div>
        </div>

        {/* Mobile tab bar — always visible on mobile */}
        <div style={{ overflowX: "auto", padding: "0 16px 10px", display: "flex", gap: 8, borderTop: "1px solid rgba(255,255,255,0.04)" }} className="mobile-tab-bar">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              background: activeTab === tab.id ? "rgba(34,197,94,0.1)" : "none",
              border: activeTab === tab.id ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.06)",
              color: activeTab === tab.id ? "#22c55e" : "rgba(255,255,255,0.5)",
              padding: "7px 14px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", gap: 5,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, position: "relative",
              transition: "all 0.2s",
            }}>
              {tab.icon} {tab.label}
              {tab.id === "orders" && pendingCount > 0 && (
                <span style={{ background: "#f97316", color: "#fff", fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", top: -4, right: -4 }}>{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .desktop-tabs { display: flex !important; }
          .mobile-tab-bar { display: none !important; }
          .mobile-hamburger { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-tabs { display: none !important; }
          .mobile-tab-bar { display: flex !important; }
        }
      `}</style>
    </>
  );
}

// ===================== ORDER CARD =====================
function OrderCard({ order, onStatusChange }) {
  const s = STATUS[order.status];
  return (
    <div style={{ background: "#0a0a0a", border: `1px solid ${s.border}`, borderRadius: 16, padding: "16px", transition: "all 0.2s" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14 }}>{order.id}</span>
            <span style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>{s.label}</span>
          </div>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>👤 {order.customer}</p>
          <p style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginTop: 2 }}>📍 {order.location} · 🕐 {order.time}</p>
        </div>
        <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 18 }}>₦{order.total.toLocaleString()}</span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "8px 12px", marginBottom: s.next ? 12 : 0 }}>
        {order.items.map((item, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < order.items.length - 1 ? 4 : 0 }}>
            <span style={{ color: "#d1fae5", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>x{item.qty} {item.name}</span>
            <span style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>₦{(item.price * item.qty).toLocaleString()}</span>
          </div>
        ))}
      </div>
      {s.next && onStatusChange && (
        <button onClick={() => onStatusChange(order.id, s.next)} style={{ width: "100%", background: s.color, color: "#000", border: "none", borderRadius: 10, padding: "11px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        >✓ {s.nextLabel}</button>
      )}
    </div>
  );
}

// ===================== OVERVIEW =====================
function OverviewTab({ orders }) {
  const todayRevenue = orders.reduce((a, o) => a + o.total, 0);
  const pending = orders.filter(o => o.status === "pending").length;
  const delivered = orders.filter(o => o.status === "delivered").length;

  const stats = [
    { label: "Today's Revenue", value: `₦${todayRevenue.toLocaleString()}`, icon: "💰", color: "#22c55e" },
    { label: "Total Orders", value: orders.length, icon: "🛒", color: "#60a5fa" },
    { label: "Pending", value: pending, icon: "⏳", color: "#f97316" },
    { label: "Rating", value: "4.9 ⭐", icon: "🌟", color: "#eab308" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 28 }}>
        {stats.map(({ label, value, icon, color }) => (
          <div key={label} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
            <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginBottom: 4 }}>{label}</p>
            <p style={{ color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(20px, 3vw, 28px)" }}>{value}</p>
          </div>
        ))}
      </div>
      <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 14 }}>🔴 Active Orders</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {orders.filter(o => o.status !== "delivered").map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
        {orders.filter(o => o.status !== "delivered").length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#4b5563", fontFamily: "'DM Sans', sans-serif" }}>No active orders right now 🎉</div>
        )}
      </div>
    </div>
  );
}

// ===================== ORDERS TAB =====================
function OrdersTab({ orders, onStatusChange }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "pending", "preparing", "ready", "delivered"];
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
        {filters.map(f => {
          const count = f === "all" ? orders.length : orders.filter(o => o.status === f).length;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", background: filter === f ? "#22c55e" : "rgba(255,255,255,0.05)", color: filter === f ? "#000" : "rgba(255,255,255,0.6)", transition: "all 0.2s" }}>
              {f.charAt(0).toUpperCase() + f.slice(1)} ({count})
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.map(order => <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />)}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif" }}>No {filter} orders</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== MENU TAB =====================
function MenuTab({ menu, setMenu }) {
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "Rice", emoji: "🍽️" });

  const toggleAvailable = (id) => setMenu(prev => prev.map(item => item.id === id ? { ...item, available: !item.available } : item));
  const deleteItem = (id) => setMenu(prev => prev.filter(item => item.id !== id));
  const addItem = () => {
    if (!newItem.name || !newItem.price) return;
    setMenu(prev => [...prev, { ...newItem, id: `mn${Date.now()}`, price: parseInt(newItem.price), available: true }]);
    setNewItem({ name: "", price: "", category: "Rice", emoji: "🍽️" });
    setShowForm(false);
  };

  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "11px 14px", color: "#fff", fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", boxSizing: "border-box" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>Menu Items</h2>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginTop: 4 }}>{menu.filter(m => m.available).length}/{menu.length} available</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; }}
        >+ Add Item</button>
      </div>

      {showForm && (
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 18, padding: "20px", marginBottom: 20 }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Add New Item</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 14 }}>
            <div>
              <label style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11, display: "block", marginBottom: 5 }}>Item Name</label>
              <input style={inputStyle} placeholder="e.g. Jollof Rice" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
            </div>
            <div>
              <label style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11, display: "block", marginBottom: 5 }}>Price (₦)</label>
              <input style={inputStyle} type="number" placeholder="e.g. 1800" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
            </div>
            <div>
              <label style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11, display: "block", marginBottom: 5 }}>Category</label>
              <select style={{ ...inputStyle, cursor: "pointer" }} value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                {["Rice", "Soup", "Pasta", "Combos", "Drinks", "Snacks"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11, display: "block", marginBottom: 5 }}>Emoji</label>
              <input style={inputStyle} placeholder="e.g. 🍚" value={newItem.emoji} onChange={e => setNewItem({ ...newItem, emoji: e.target.value })} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={addItem} style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 10, padding: "11px 24px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Add ✓</button>
            <button onClick={() => setShowForm(false)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", borderRadius: 10, padding: "11px 24px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {menu.map(item => (
          <div key={item.id} style={{ background: "#0a0a0a", border: `1px solid ${item.available ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)"}`, borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, opacity: item.available ? 1 : 0.5 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
              <div style={{ display: "flex", gap: 10, marginTop: 3 }}>
                <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>₦{item.price.toLocaleString()}</span>
                <span style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{item.category}</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {/* Toggle */}
              <div onClick={() => toggleAvailable(item.id)} style={{ width: 40, height: 22, borderRadius: 50, cursor: "pointer", position: "relative", background: item.available ? "#22c55e" : "rgba(255,255,255,0.1)", transition: "all 0.3s", flexShrink: 0 }}>
                <div style={{ position: "absolute", top: 3, left: item.available ? 21 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "all 0.3s" }} />
              </div>
              {/* Delete */}
              <button onClick={() => deleteItem(item.id)} style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.2)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
              >🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== HISTORY TAB =====================
function HistoryTab({ orders }) {
  const delivered = orders.filter(o => o.status === "delivered");
  const totalEarned = delivered.reduce((a, o) => a + o.total, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Earned", value: `₦${totalEarned.toLocaleString()}`, color: "#22c55e" },
          { label: "Completed", value: delivered.length, color: "#60a5fa" },
          { label: "Avg Order", value: delivered.length ? `₦${Math.round(totalEarned / delivered.length).toLocaleString()}` : "₦0", color: "#eab308" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px" }}>
            <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginBottom: 6 }}>{label}</p>
            <p style={{ color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(18px, 3vw, 24px)" }}>{value}</p>
          </div>
        ))}
      </div>
      <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 14 }}>Completed Orders</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {delivered.map(order => (
          <div key={order.id} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>{order.id}</span>
                <span style={{ color: "#22c55e", background: "rgba(34,197,94,0.1)", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>✓ Delivered</span>
              </div>
              <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>👤 {order.customer} · {order.items.map(i => `${i.qty}x ${i.name}`).join(", ")}</p>
              <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 2 }}>🕐 {order.time}</p>
            </div>
            <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 16 }}>₦{order.total.toLocaleString()}</span>
          </div>
        ))}
        {delivered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <p style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif" }}>No completed orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ===================== MAIN DASHBOARD =====================
function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState(SAMPLE_ORDERS);
  const [menu, setMenu] = useState(SAMPLE_MENU);
  const pendingCount = orders.filter(o => o.status === "pending").length;

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .tab-content { animation: fadeInUp 0.4s ease both; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#000" }}>
        <VendorNavbar vendorName="Pearl's Cuisine" activeTab={activeTab} setActiveTab={setActiveTab} pendingCount={pendingCount} />

        {/* Pending alert */}
        {pendingCount > 0 && (
          <div style={{ background: "rgba(249,115,22,0.08)", borderBottom: "1px solid rgba(249,115,22,0.2)", padding: "10px 20px", textAlign: "center" }}>
            <span style={{ color: "#f97316", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>
              🔔 {pendingCount} new order{pendingCount > 1 ? "s" : ""} waiting!{" "}
              <button onClick={() => setActiveTab("orders")} style={{ background: "none", border: "none", color: "#f97316", cursor: "pointer", fontWeight: 800, textDecoration: "underline", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>View now →</button>
            </span>
          </div>
        )}

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 16px 80px" }}>
          <div className="tab-content" key={activeTab}>
            {activeTab === "overview" && <OverviewTab orders={orders} />}
            {activeTab === "orders"   && <OrdersTab orders={orders} onStatusChange={handleStatusChange} />}
            {activeTab === "menu"     && <MenuTab menu={menu} setMenu={setMenu} />}
            {activeTab === "history"  && <HistoryTab orders={orders} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorDashboard;
