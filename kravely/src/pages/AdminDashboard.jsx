import { useState } from "react";
import { Link } from "react-router-dom";

// ===================== SAMPLE DATA =====================
const STATS = {
  totalRevenue: 1847500,
  todayRevenue: 284300,
  totalOrders: 342,
  todayOrders: 47,
  totalUsers: 1284,
  newUsersToday: 23,
  totalVendors: 8,
  activeVendors: 6,
  kravelyCut: 276825, // 15% of total
  todayCut: 42645,
  avgOrderValue: 5400,
  deliveryRate: 98.2,
};

const VENDORS = [
  { id: 1, name: "Pearl's Cuisine", category: "Jumbo Orders", orders: 89, revenue: 412000, rating: 4.9, status: "active", featured: true, joinDate: "Jan 2025" },
  { id: 2, name: "Chrissy cuisine", category: "Local Meals", orders: 76, revenue: 182400, rating: 4.8, status: "active", featured: true, joinDate: "Feb 2025" },
  { id: 3, name: "Chukwu's Grill Spot", category: "Grills & Suya", orders: 54, revenue: 162000, rating: 4.6, status: "active", featured: false, joinDate: "Feb 2025" },
  { id: 4, name: "Campus Bites", category: "Snacks", orders: 43, revenue: 86000, rating: 4.5, status: "active", featured: false, joinDate: "Mar 2025" },
  { id: 5, name: "Owerri Rice Palace", category: "Rice Dishes", orders: 38, revenue: 114000, rating: 4.9, status: "active", featured: false, joinDate: "Mar 2025" },
  { id: 6, name: "Pepper Soup Corner", category: "Soups", orders: 29, revenue: 72500, rating: 4.8, status: "active", featured: false, joinDate: "Apr 2025" },
  { id: 7, name: "FreshJuice Hub", category: "Drinks", orders: 9, revenue: 18000, rating: 4.7, status: "inactive", featured: false, joinDate: "Apr 2025" },
  { id: 8, name: "Combo King", category: "Combos", orders: 4, revenue: 9600, rating: 4.5, status: "pending", featured: false, joinDate: "May 2025" },
];

const RECENT_ORDERS = [
  { id: "KRV-047", customer: "Chidi Okafor", vendor: "Pearl's Cuisine", amount: 10500, status: "delivered", time: "2 min ago" },
  { id: "KRV-046", customer: "Amaka Eze", vendor: "Mama Nkechi's", amount: 2100, status: "preparing", time: "8 min ago" },
  { id: "KRV-045", customer: "Emeka Nwosu", vendor: "Chukwu's Grill", amount: 3300, status: "pending", time: "15 min ago" },
  { id: "KRV-044", customer: "Ngozi Obi", vendor: "Campus Bites", amount: 1300, status: "delivered", time: "22 min ago" },
  { id: "KRV-043", customer: "Kelechi Ibe", vendor: "Owerri Rice Palace", amount: 4200, status: "delivered", time: "31 min ago" },
  { id: "KRV-042", customer: "Adaeze Uche", vendor: "Pearl's Cuisine", amount: 35000, status: "delivered", time: "45 min ago" },
];

const USERS = [
  { id: 1, name: "Chidi Okafor", email: "chidi@futo.edu.ng", orders: 12, spent: 48600, joined: "Jan 2025", status: "active" },
  { id: 2, name: "Amaka Eze", email: "amaka@futo.edu.ng", orders: 8, spent: 22400, joined: "Feb 2025", status: "active" },
  { id: 3, name: "Emeka Nwosu", email: "emeka@futo.edu.ng", orders: 6, spent: 18900, joined: "Feb 2025", status: "active" },
  { id: 4, name: "Ngozi Obi", email: "ngozi@futo.edu.ng", orders: 4, spent: 9200, joined: "Mar 2025", status: "active" },
  { id: 5, name: "Kelechi Ibe", email: "kelechi@futo.edu.ng", orders: 15, spent: 67500, joined: "Jan 2025", status: "active" },
];

const ORDER_STATUS = {
  delivered: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)" },
  preparing: { color: "#eab308", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.3)" },
  pending:   { color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)" },
  inactive:  { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)" },
};

const RIDERS = [
  { id: 1, name: "Chukwu Okoro", phone: "+234 812 345 6789", status: "active", deliveries: 45, rating: 4.8, joinDate: "Jan 2025" },
  { id: 2, name: "Amina Adeleke", phone: "+234 823 456 7890", status: "active", deliveries: 38, rating: 4.9, joinDate: "Feb 2025" },
  { id: 3, name: "Tunde Okonkwo", phone: "+234 834 567 8901", status: "active", deliveries: 52, rating: 4.7, joinDate: "Jan 2025" },
  { id: 4, name: "Zainab Ibrahim", phone: "+234 845 678 9012", status: "assigned", deliveries: 21, rating: 4.6, joinDate: "Mar 2025" },
  { id: 5, name: "Chisom Nwosu", phone: "+234 856 789 0123", status: "inactive", deliveries: 8, rating: 4.4, joinDate: "Apr 2025" },
];

const PENDING_DELIVERIES = [
  { id: "KRV-047", customer: "Chidi Okafor", vendor: "Pearl's Cuisine", destination: "FUTO Campus", amount: 10500, status: "pending", isAssigned: false },
  { id: "KRV-045", customer: "Emeka Nwosu", vendor: "Chukwu's Grill", destination: "Owerri City Center", amount: 3300, status: "pending", isAssigned: false },
  { id: "KRV-044", customer: "Ngozi Obi", vendor: "Campus Bites", destination: "Federal Polytechnic", amount: 1300, status: "ready", isAssigned: false },
];

// ===================== SIDEBAR =====================
function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const nav = [
    { id: "overview", label: "Overview" },
    { id: "orders",   label: "All Orders" },
    { id: "riders",   label: "Riders" },
    { id: "vendors",  label: "Vendors" },
    { id: "users",    label: "Users" },
    { id: "revenue",  label: "Revenue" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <>
      <style>{`
        .sidebar-nav-btn { transition: all 0.2s ease; cursor: pointer; border: none; width: 100%; text-align: left; }
        .sidebar-nav-btn:hover { background: rgba(34,197,94,0.08) !important; }
      `}</style>
      <div style={{
        width: collapsed ? 64 : 240, flexShrink: 0,
        background: "#030303", borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden", position: "relative", zIndex: 10,
      }}>

        {/* Logo */}
        <div style={{ padding: collapsed ? "20px 0" : "20px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.06)", justifyContent: collapsed ? "center" : "flex-start" }}>
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 18, color: "#000" }}>K</span>
            </div>
          </Link>
          {!collapsed && (
            <div>
              <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 16, letterSpacing: -0.5 }}>Kravely</p>
              <p style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>ADMIN</p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          {nav.map(item => (
            <button key={item.id} className="sidebar-nav-btn" onClick={() => setActiveTab(item.id)} style={{
              padding: collapsed ? "12px 0" : "12px 14px",
              borderRadius: 12,
              background: activeTab === item.id ? "rgba(34,197,94,0.12)" : "none",
              border: activeTab === item.id ? "1px solid rgba(34,197,94,0.25)" : "1px solid transparent",
              display: "flex", alignItems: "center", gap: 12,
              justifyContent: collapsed ? "center" : "flex-start",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{ color: activeTab === item.id ? "#22c55e" : "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>{item.label}</span>
              )}
            </button>
          ))}
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)} style={{
          margin: "12px 8px", padding: "10px", borderRadius: 10,
          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
          color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#6b7280"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
          </svg>
        </button>

        {/* Admin profile */}
        {!collapsed && (
          <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 50, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>👑</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Ebuka Okolo</p>
              <p style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>Chief Technology Officer</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ===================== TOP BAR =====================
function TopBar({ activeTab }) {
  const titles = {
    overview: "Dashboard Overview",
    orders: "All Orders",
    vendors: "Vendor Management",
    users: "User Management",
    revenue: "Revenue & Earnings",
    settings: "Settings",
  };

  return (
    <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 5 }}>
      <div>
        <h1 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>{titles[activeTab]}</h1>
        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginTop: 2 }}>
          {new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Live indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 50, padding: "6px 14px" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>Live</span>
        </div>
        <Link to="/" style={{ textDecoration: "none", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "8px 16px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>
          ← Back to Site
        </Link>
        <Link to="/summary/dashboard" style={{ textDecoration: "none", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "8px 16px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>
          Summary Dashboard
        </Link>
      </div>
    </div>
  );
}

// ===================== STAT CARD =====================
function StatCard({ icon, label, value, sub, color, subColor }) {
  return (
    <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "22px 24px", transition: "all 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 16px 40px ${color}10`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        {sub && <span style={{ color: subColor || "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, background: `${subColor || "#22c55e"}15`, padding: "3px 8px", borderRadius: 50 }}>{sub}</span>}
      </div>
      <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 8 }}>{label}</p>
      <p style={{ color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 28, letterSpacing: -1 }}>{value}</p>
    </div>
  );
}

// ===================== OVERVIEW TAB =====================
function OverviewTab() {
  return (
    <div>
      {/* CEO Welcome */}
      <div style={{ background: "linear-gradient(135deg, #0a1f0a, #0f2d0f)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 22, padding: "28px 32px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, fontSize: 120, opacity: 0.04 }}>👑</div>
        <p style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Good day, CTO </p>
        <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(22px, 3vw, 32px)", letterSpacing: -1, marginBottom: 12 }}>
          Kravely is growing fast.<br />
          <span style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Here's your empire. 🚀</span>
        </h2>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          {[["₦" + STATS.kravelyCut.toLocaleString(), "Your 15% cut (total)"], ["₦" + STATS.todayCut.toLocaleString(), "Today's earnings"], [STATS.totalOrders + " orders", "All time"], [STATS.deliveryRate + "%", "Delivery success rate"]].map(([v, l]) => (
            <div key={l} style={{ minWidth: 170, flex: "1 1 auto", overflow: "hidden" }}>
              <p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard  label="Total Revenue" value={`₦${STATS.totalRevenue.toLocaleString()}`} sub="All time" color="#22c55e" />
        <StatCard  label="Today's Revenue" value={`₦${STATS.todayRevenue.toLocaleString()}`} sub="+12% ↑" color="#4ade80" />
        <StatCard  label="Total Orders" value={STATS.totalOrders} sub={`${STATS.todayOrders} today`} color="#60a5fa" />
        <StatCard  label="Total Users" value={STATS.totalUsers.toLocaleString()} sub={`+${STATS.newUsersToday} today`} color="#a78bfa" />
        <StatCard  label="Active Vendors" value={STATS.activeVendors} sub={`of ${STATS.totalVendors}`} color="#f97316" />
        <StatCard  label="Your Cut (15%)" value={`₦${STATS.kravelyCut.toLocaleString()}`} sub="Total earned" color="#eab308" />
      </div>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>

        {/* Recent orders */}
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px 24px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 16 }}>🔴 Live Orders</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {RECENT_ORDERS.slice(0, 5).map(order => {
              const s = ORDER_STATUS[order.status];
              return (
                <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>{order.customer}</p>
                    <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{order.vendor} · {order.time}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>₦{order.amount.toLocaleString()}</p>
                    <span style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}`, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>{order.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top vendors */}
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px 24px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 16 }}>🏆 Top Vendors</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {VENDORS.slice(0, 5).map((vendor, i) => (
              <div key={vendor.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ color: i === 0 ? "#eab308" : i === 1 ? "#9ca3af" : i === 2 ? "#cd7c2f" : "#4b5563", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 14, width: 20 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>{vendor.name}</p>
                  <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{vendor.orders} orders</p>
                </div>
                <p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>₦{vendor.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ===================== ORDERS TAB =====================
function OrdersTab() {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "pending", "preparing", "delivered"];
  const filtered = filter === "all" ? RECENT_ORDERS : RECENT_ORDERS.filter(o => o.status === filter);

  return (
    <div>
      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 18px", borderRadius: 50, border: "none", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
            background: filter === f ? "#22c55e" : "rgba(255,255,255,0.05)",
            color: filter === f ? "#000" : "rgba(255,255,255,0.6)",
            transition: "all 0.2s",
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 100px 120px", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          {["Order ID", "Customer", "Vendor", "Amount", "Status"].map(h => (
            <span key={h} style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</span>
          ))}
        </div>
        {filtered.map((order, i) => {
          const s = ORDER_STATUS[order.status];
          return (
            <div key={order.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 100px 120px", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}
            >
              <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{order.id}</span>
              <div>
                <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{order.customer}</p>
                <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{order.time}</p>
              </div>
              <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{order.vendor}</span>
              <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>₦{order.amount.toLocaleString()}</span>
              <span style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", display: "inline-block" }}>{order.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================== VENDORS TAB =====================
function VendorsTab() {
  const [vendors, setVendors] = useState(VENDORS);

  const toggleFeatured = (id) => setVendors(prev => prev.map(v => v.id === id ? { ...v, featured: !v.featured } : v));
  const toggleStatus  = (id) => setVendors(prev => prev.map(v => v.id === id ? { ...v, status: v.status === "active" ? "inactive" : "active" } : v));

  const statusColors = { active: "#22c55e", inactive: "#6b7280", pending: "#f97316" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>{vendors.filter(v => v.status === "active").length} active vendors · {vendors.filter(v => v.status === "pending").length} pending approval</p>
        <button style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          + Add Vendor
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {vendors.map(vendor => (
          <div key={vendor.id} style={{ background: "#0a0a0a", border: `1px solid ${vendor.featured ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 18, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", transition: "all 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = vendor.featured ? "rgba(234,179,8,0.5)" : "rgba(34,197,94,0.2)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = vendor.featured ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.06)"}
          >
            {/* Info */}
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>{vendor.name}</p>
                {vendor.featured && <span style={{ background: "rgba(234,179,8,0.15)", color: "#eab308", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>👑 Featured</span>}
                <span style={{ color: statusColors[vendor.status], fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>● {vendor.status}</span>
              </div>
              <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{vendor.category} · Joined {vendor.joinDate}</p>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[["Orders", vendor.orders], ["Revenue", "₦" + vendor.revenue.toLocaleString()], ["Rating", "⭐ " + vendor.rating]].map(([label, value]) => (
                <div key={label} style={{ textAlign: "center", minWidth: 0 }}>
                  <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
                  <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => toggleFeatured(vendor.id)} style={{ background: vendor.featured ? "rgba(234,179,8,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${vendor.featured ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.1)"}`, color: vendor.featured ? "#eab308" : "#6b7280", padding: "7px 14px", borderRadius: 50, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12, transition: "all 0.2s" }}>
                {vendor.featured ? "👑 Featured" : "Set Featured"}
              </button>
              <button onClick={() => toggleStatus(vendor.id)} style={{ background: vendor.status === "active" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", border: `1px solid ${vendor.status === "active" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, color: vendor.status === "active" ? "#ef4444" : "#22c55e", padding: "7px 14px", borderRadius: 50, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 12, transition: "all 0.2s" }}>
                {vendor.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== USERS TAB =====================
function UsersTab() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>{STATS.totalUsers.toLocaleString()} total registered users</p>
      </div>

      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 80px 120px 100px", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", minWidth: 600 }}>
          {["Name / Email", "Joined", "Orders", "Total Spent", "Status"].map(h => (
            <span key={h} style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</span>
          ))}
        </div>
        {USERS.map((user, i) => (
          <div key={user.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 80px 120px 100px", padding: "14px 20px", borderBottom: i < USERS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center", minWidth: 600, transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <div>
              <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>{user.name}</p>
              <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{user.email}</p>
            </div>
            <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{user.joined}</span>
            <span style={{ color: "#60a5fa", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14 }}>{user.orders}</span>
            <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>₦{user.spent.toLocaleString()}</span>
            <span style={{ color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>Active</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== REVENUE TAB =====================
function RevenueTab() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenues = [120000, 185000, 240000, 310000, 428000, 564500];
  const maxRev = Math.max(...revenues);

  return (
    <div>
      {/* Revenue summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,px-10 minmax(240px, 1fr))", gap: 20, marginBottom: 28 }}>
        {[
          { label: "Total GMV", value: `₦${STATS.totalRevenue.toLocaleString()}`, desc: "Gross merchandise value", color: "#22c55e" },
          { label: "Kravely Revenue (15%)", value: `₦${STATS.kravelyCut.toLocaleString()}`, desc: "Your commission cut", color: "#eab308" },
          { label: "Today's GMV", value: `₦${STATS.todayRevenue.toLocaleString()}`, desc: "Revenue today", color: "#60a5fa" },
          { label: "Today's Cut", value: `₦${STATS.todayCut.toLocaleString()}`, desc: "Your cut today", color: "#a78bfa" },
          { label: "Avg Order Value", value: `₦${STATS.avgOrderValue.toLocaleString()}`, desc: "Per order", color: "#f97316" },
          { label: "Delivery Rate", value: `${STATS.deliveryRate}%`, desc: "Success rate", color: "#4ade80" },
        ].map(({ label, value, desc, color }) => (
          <div key={label} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "20px 22px" }}>
            <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 8 }}>{label}</p>
            <p style={{ color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 4, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
            <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "24px" }}>
        <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 24 }}>Revenue Growth (2025)</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180, paddingBottom: 28, position: "relative" }}>
          {/* Y axis lines */}
          {[0, 25, 50, 75, 100].map(pct => (
            <div key={pct} style={{ position: "absolute", left: 0, right: 0, bottom: `${pct * 1.44 + 28}px`, height: 1, background: "rgba(255,255,255,0.04)" }} />
          ))}
          {revenues.map((rev, i) => {
            const height = (rev / maxRev) * 140;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
                <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700 }}>₦{(rev / 1000).toFixed(0)}k</span>
                <div style={{ width: "100%", height, background: `linear-gradient(to top, #22c55e, #4ade80)`, borderRadius: "6px 6px 0 0", transition: "height 0.5s ease", boxShadow: "0 0 20px rgba(34,197,94,0.2)" }} />
                <span style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{months[i]}</span>
              </div>
            );
          })}
        </div>

        {/* Vendor revenue breakdown */}
        <div style={{ marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24 }}>
          <h4 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Revenue by Vendor</h4>
          {VENDORS.map(vendor => {
            const pct = Math.round((vendor.revenue / STATS.totalRevenue) * 100);
            return (
              <div key={vendor.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{vendor.name}</span>
                  <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>₦{vendor.revenue.toLocaleString()} ({pct}%)</span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: vendor.featured ? "linear-gradient(90deg, #eab308, #ca8a04)" : "linear-gradient(90deg, #22c55e, #4ade80)", borderRadius: 3, transition: "width 0.8s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===================== RIDERS TAB =====================
function RidersTab() {
  const [riders] = useState(RIDERS);
  const [assignments, setAssignments] = useState({});

  const assignRider = (deliveryId, riderId) => {
    setAssignments(prev => ({ ...prev, [deliveryId]: riderId }));
  };

  const activeRiders = riders.filter(r => r.status === "active");
  const totalDeliveries = PENDING_DELIVERIES.length;
  const assignedDeliveries = PENDING_DELIVERIES.filter(d => assignments[d.id]).length;

  return (
    <div>
      {/* Riders summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "18px 20px" }}>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 8 }}>Total Riders</p>
          <p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 24 }}>{riders.length}</p>
          <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 4 }}>{activeRiders.length} active</p>
        </div>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "18px 20px" }}>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 8 }}>Pending Deliveries</p>
          <p style={{ color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 24 }}>{totalDeliveries - assignedDeliveries}</p>
          <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 4 }}>{assignedDeliveries} assigned</p>
        </div>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "18px 20px" }}>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 8 }}>Avg Rating</p>
          <p style={{ color: "#eab308", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 24 }}>⭐ 4.7</p>
          <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 4 }}>Overall performance</p>
        </div>
      </div>

      {/* Assignment section */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, marginBottom: 28 }}>
        
        {/* Pending deliveries */}
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "22px 24px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 16 }}>📦 Pending Deliveries</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PENDING_DELIVERIES.map(delivery => (
              <div key={delivery.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{delivery.id}</p>
                    <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{delivery.customer}</p>
                  </div>
                  <span style={{ color: delivery.status === "ready" ? "#22c55e" : "#eab308", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, background: delivery.status === "ready" ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)", padding: "3px 8px", borderRadius: 50 }}>{delivery.status}</span>
                </div>
                <p style={{ color: "#c084fc", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginBottom: 8 }}>📍 {delivery.destination}</p>
                <p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12, marginBottom: 10 }}>₦{delivery.amount.toLocaleString()}</p>
                <select 
                  value={assignments[delivery.id] || ""} 
                  onChange={(e) => assignRider(delivery.id, e.target.value)}
                  style={{
                    width: "100%", padding: "8px 10px", borderRadius: 8,
                    background: "rgba(34,197,94,0.1)", color: "#fff", border: "1px solid rgba(34,197,94,0.25)",
                    fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: "pointer"
                  }}
                >
                  <option value="">Assign rider...</option>
                  {activeRiders.map(rider => (
                    <option key={rider.id} value={rider.id}>{rider.name}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Available riders */}
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "22px 24px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 16 }}>🏍️ Available Riders</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {activeRiders.map(rider => {
              const assignedCount = Object.values(assignments).filter(v => v == rider.id).length;
              return (
                <div key={rider.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>{rider.name}</p>
                      <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{rider.phone}</p>
                    </div>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: "#22c55e", flexShrink: 0 }}>⭐ {rider.rating}</span>
                  </div>
                  <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 11, color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>
                    <span>📦 {rider.deliveries} total</span>
                    <span>🎯 {assignedCount} assigned</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* All riders management */}
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "22px 24px" }}>
        <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 16 }}>👥 All Riders</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {riders.map((rider) => {
            const statusColors = { active: "#22c55e", assigned: "#60a5fa", inactive: "#6b7280" };
            return (
              <div key={rider.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
              >
                <div style={{ width: 40, height: 40, borderRadius: 50, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏍️</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>{rider.name}</p>
                  <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{rider.phone}</p>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 12 }}>{rider.deliveries}</p>
                    <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}>deliveries</p>
                  </div>
                  <span style={{ color: statusColors[rider.status], background: `${statusColors[rider.status]}20`, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>● {rider.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===================== SETTINGS TAB =====================
function SettingsTab() {
  const [commission, setCommission] = useState(15);
  const [deliveryFee, setDeliveryFee] = useState(300);

  const inputStyle = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "12px 16px", color: "#fff",
    fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none", width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {[
          {
            title: "💰 Commission Rate",
            desc: "Percentage Kravely takes from each order",
            content: (
              <div>
                <label style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, display: "block", marginBottom: 8 }}>Commission % (currently {commission}%)</label>
                <input type="number" value={commission} onChange={e => setCommission(e.target.value)} style={inputStyle} min="1" max="50" />
                <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginTop: 6 }}>
                  At {commission}%, on a ₦2,000 order you earn ₦{(2000 * commission / 100).toLocaleString()}
                </p>
              </div>
            )
          },
          {
            title: "🚚 Delivery Fee",
            desc: "Fee charged to students per order",
            content: (
              <div>
                <label style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, display: "block", marginBottom: 8 }}>Delivery fee (₦)</label>
                <input type="number" value={deliveryFee} onChange={e => setDeliveryFee(e.target.value)} style={inputStyle} />
              </div>
            )
          },
          {
            title: "🌐 Site Status",
            desc: "Control whether Kravely is open for orders",
            content: (
              <div style={{ display: "flex", gap: 12 }}>
                {["Open", "Maintenance", "Closed"].map((s, i) => (
                  <button key={s} style={{ padding: "10px 20px", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, background: i === 0 ? "#22c55e" : "rgba(255,255,255,0.05)", color: i === 0 ? "#000" : "rgba(255,255,255,0.5)", transition: "all 0.2s" }}>
                    {s}
                  </button>
                ))}
              </div>
            )
          },
        ].map(({ title, desc, content }) => (
          <div key={title} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "22px 24px" }}>
            <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{title}</h3>
            <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginBottom: 16 }}>{desc}</p>
            {content}
          </div>
        ))}

        <button style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "14px 32px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, cursor: "pointer", alignSelf: "flex-start", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Save Changes ✓
        </button>

      </div>
    </div>
  );
}

// ===================== MAIN ADMIN DASHBOARD =====================
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .tab-content { animation: fadeInUp 0.4s ease both; }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .admin-layout { flex-direction: column !important; }
          .admin-sidebar { display: none !important; }
          .admin-sidebar.open { display: flex !important; position: fixed; inset: 0; z-index: 100; width: 240px !important; }
          .admin-mobile-bar { display: flex !important; }
        }
        @media (min-width: 769px) {
          .admin-mobile-bar { display: none !important; }
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column" }}>

        {/* Mobile top bar */}
        <div className="admin-mobile-bar" style={{ display: "none", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#030303", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 16, color: "#000" }}>K</span>
            </div>
            <span style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15 }}>Admin</span>
          </div>
          <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px", color: "#fff", cursor: "pointer", fontSize: 18 }}>☰</button>
        </div>

        {/* Mobile sidebar overlay */}
        {mobileSidebarOpen && (
          <div onClick={() => setMobileSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 99, backdropFilter: "blur(4px)" }} />
        )}

        <div className="admin-layout" style={{ display: "flex", flex: 1, overflow: "hidden" }}>

          {/* Sidebar */}
          <div className={`admin-sidebar ${mobileSidebarOpen ? "open" : ""}`} style={{ display: "flex" }}>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => { setActiveTab(tab); setMobileSidebarOpen(false); }}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
          </div>

          {/* Main content */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minWidth: 0 }}>
            <TopBar activeTab={activeTab} />
            <div style={{ padding: "24px 20px 80px", flex: 1 }}>
              <div className="tab-content" key={activeTab}>
                {activeTab === "overview"  && <OverviewTab />}
                {activeTab === "orders"    && <OrdersTab />}
                {activeTab === "riders"    && <RidersTab />}
                {activeTab === "vendors"   && <VendorsTab />}
                {activeTab === "users"     && <UsersTab />}
                {activeTab === "revenue"   && <RevenueTab />}
                {activeTab === "settings"  && <SettingsTab />}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
