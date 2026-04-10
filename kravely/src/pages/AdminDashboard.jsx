import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const ORDER_STATUS = {
  delivered: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)" },
  preparing: { color: "#eab308", bg: "rgba(234,179,8,0.1)", border: "rgba(234,179,8,0.3)" },
  pending: { color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)" },
  confirmed: { color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.3)" },
  ready: { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.3)" },
  cancelled: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" },
  inactive: { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)" },
};

const RIDERS = [
  { id: 1, name: "Chukwu Okoro", phone: "+234 812 345 6789", status: "active", deliveries: 45, rating: 4.8 },
  { id: 2, name: "Amina Adeleke", phone: "+234 823 456 7890", status: "active", deliveries: 38, rating: 4.9 },
  { id: 3, name: "Tunde Okonkwo", phone: "+234 834 567 8901", status: "active", deliveries: 52, rating: 4.7 },
];

function koboToNaira(value) {
  return Number(value || 0) / 100;
}

function formatMoney(value) {
  return `₦${Number(value || 0).toLocaleString()}`;
}

function timeAgo(dateString) {
  if (!dateString) return "—";
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const nav = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "orders", label: "All Orders", icon: "📦" },
    { id: "riders", label: "Riders", icon: "🏍️" },
    { id: "vendors", label: "Vendors", icon: "🏪" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "revenue", label: "Revenue", icon: "💰" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <>
      <style>{`
        .sidebar-nav-btn { transition: all 0.2s ease; cursor: pointer; border: none; width: 100%; text-align: left; }
        .sidebar-nav-btn:hover { background: rgba(34,197,94,0.08) !important; }
      `}</style>
      <div
        style={{
          width: collapsed ? 64 : 240,
          flexShrink: 0,
          background: "#030303",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s cubic-bezier(0.22,1,0.36,1)",
          overflow: "hidden",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            padding: collapsed ? "20px 0" : "20px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
        >
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
              }}
            >
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 18, color: "#000" }}>K</span>
            </div>
          </Link>
          {!collapsed && (
            <div>
              <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 16 }}>Kravely</p>
              <p style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>ADMIN</p>
            </div>
          )}
        </div>

        <div style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
          {nav.map((item) => (
            <button
              key={item.id}
              className="sidebar-nav-btn"
              onClick={() => setActiveTab(item.id)}
              style={{
                padding: collapsed ? "12px 0" : "12px 14px",
                borderRadius: 12,
                background: activeTab === item.id ? "rgba(34,197,94,0.12)" : "none",
                border: activeTab === item.id ? "1px solid rgba(34,197,94,0.25)" : "1px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: 12,
                justifyContent: collapsed ? "center" : "flex-start",
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{ color: activeTab === item.id ? "#22c55e" : "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            margin: "12px 8px",
            padding: "10px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#6b7280",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {collapsed ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
          </svg>
        </button>
      </div>
    </>
  );
}

function TopBar({ activeTab }) {
  const titles = {
    overview: "Dashboard Overview",
    orders: "All Orders",
    riders: "Riders",
    vendors: "Vendor Management",
    users: "User Management",
    revenue: "Revenue & Earnings",
    settings: "Settings",
  };

  return (
    <div
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 5,
      }}
    >
      <div>
        <h1 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22 }}>{titles[activeTab]}</h1>
        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginTop: 2 }}>
          {new Date().toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", borderRadius: 50, padding: "6px 14px" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>Live</span>
        </div>
        <Link to="/" style={{ textDecoration: "none", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "8px 16px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>
          ← Back to Site
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color = "#22c55e" }) {
  return (
    <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "22px 24px" }}>
      <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 8 }}>{label}</p>
      <p style={{ color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 28 }}>{value}</p>
      {sub && <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 6 }}>{sub}</p>}
    </div>
  );
}

function OverviewTab({ summary, todayStats, orders, vendors, users }) {
  const topVendors = [...vendors].sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0)).slice(0, 5);
  const recentOrders = orders.slice(0, 5);

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #0a1f0a, #0f2d0f)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 22, padding: "28px 32px", marginBottom: 28 }}>
        <p style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Good day, CTO</p>
        <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(22px, 3vw, 32px)", marginBottom: 12 }}>
          Kravely is growing fast.
        </h2>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div><p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20 }}>{formatMoney(koboToNaira(summary?.total_kravely_revenue))}</p><p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>30-day Kravely revenue</p></div>
          <div><p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20 }}>{formatMoney(koboToNaira(todayStats?.today_kravely_revenue))}</p><p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Today&apos;s earnings</p></div>
          <div><p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20 }}>{summary?.total_orders || 0} orders</p><p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Last 30 days</p></div>
          <div><p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20 }}>{summary?.delivery_rate || 0}%</p><p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>Delivery success rate</p></div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total GMV (30 days)" value={formatMoney(koboToNaira(summary?.total_gmv))} />
        <StatCard label="Today's GMV" value={formatMoney(koboToNaira(todayStats?.today_gmv))} color="#4ade80" />
        <StatCard label="Total Orders (30 days)" value={summary?.total_orders || 0} color="#60a5fa" />
        <StatCard label="Today's Orders" value={todayStats?.today_orders || 0} color="#a78bfa" />
        <StatCard label="Users Loaded" value={users.length} color="#f97316" />
        <StatCard label="Vendors Loaded" value={vendors.length} color="#eab308" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px 24px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 16 }}>🔴 Live Orders</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentOrders.map((order) => {
              const s = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
              return (
                <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div>
                    <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>{order.student_name || "Unknown user"}</p>
                    <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{order.vendor_name || "Unknown vendor"} · {timeAgo(order.placed_at)}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>{formatMoney(koboToNaira(order.total_amount))}</p>
                    <span style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}`, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 50 }}>{order.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px 24px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 16 }}>🏆 Top Vendors</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topVendors.map((vendor, i) => (
              <div key={vendor.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ color: i === 0 ? "#eab308" : "#4b5563", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 14, width: 20 }}>#{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>{vendor.name}</p>
                  <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{vendor.total_orders || 0} orders</p>
                </div>
                <p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>{formatMoney(koboToNaira(vendor.total_revenue))}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ orders }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];
  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 18px",
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              background: filter === f ? "#22c55e" : "rgba(255,255,255,0.05)",
              color: filter === f ? "#000" : "rgba(255,255,255,0.6)",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 120px 120px", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
          {["Order ID", "Customer", "Vendor", "Amount", "Status"].map((h) => (
            <span key={h} style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>{h}</span>
          ))}
        </div>

        {filtered.map((order, i) => {
          const s = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
          return (
            <div
              key={order.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 120px 120px",
                padding: "14px 20px",
                borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                alignItems: "center",
              }}
            >
              <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{order.order_number}</span>
              <div>
                <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{order.student_name || "Unknown user"}</p>
                <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{timeAgo(order.placed_at)}</p>
              </div>
              <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{order.vendor_name || "Unknown vendor"}</span>
              <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14 }}>{formatMoney(koboToNaira(order.total_amount))}</span>
              <span style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}`, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 50, display: "inline-block", width: "fit-content" }}>
                {order.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function VendorsTab({ vendors }) {
  const statusText = (vendor) => {
    if (!vendor.is_active) return "inactive";
    if (!vendor.is_approved) return "pending";
    return "active";
  };

  const statusColors = { active: "#22c55e", inactive: "#6b7280", pending: "#f97316" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
          {vendors.filter((v) => v.is_active).length} active vendors · {vendors.filter((v) => !v.is_approved).length} pending approval
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {vendors.map((vendor) => {
          const status = statusText(vendor);
          return (
            <div key={vendor.id} style={{ background: "#0a0a0a", border: `1px solid ${vendor.is_featured ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 18, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>{vendor.name}</p>
                  {vendor.is_featured && <span style={{ background: "rgba(234,179,8,0.15)", color: "#eab308", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 50 }}>👑 Featured</span>}
                  <span style={{ color: statusColors[status], fontSize: 10, fontWeight: 700 }}>● {status}</span>
                </div>
                <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
                  {vendor.category} · {vendor.delivery_time || "—"} · {new Date(vendor.created_at).toLocaleDateString()}
                </p>
              </div>

              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                {[["Orders", vendor.total_orders || 0], ["Revenue", formatMoney(koboToNaira(vendor.total_revenue))], ["Rating", `⭐ ${vendor.rating || 0}`]].map(([label, value]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14 }}>{value}</p>
                    <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UsersTab({ users }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>{users.length} loaded users</p>
      </div>

      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 80px 100px", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", minWidth: 600 }}>
          {["Name / Email", "Joined", "Orders", "Status"].map((h) => (
            <span key={h} style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>{h}</span>
          ))}
        </div>

        {users.map((user, i) => (
          <div key={user.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 80px 100px", padding: "14px 20px", borderBottom: i < users.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center", minWidth: 600 }}>
            <div>
              <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>{user.full_name}</p>
              <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{user.email}</p>
            </div>
            <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
            </span>
            <span style={{ color: "#60a5fa", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14 }}>{user.total_orders || 0}</span>
            <span style={{ color: "#22c55e", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 50, width: "fit-content" }}>
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RevenueTab({ summary, todayStats, vendors }) {
  const totalRevenueNaira = koboToNaira(summary?.total_gmv);
  const vendorRows = [...vendors]
    .filter((v) => Number(v.total_revenue || 0) > 0)
    .sort((a, b) => Number(b.total_revenue || 0) - Number(a.total_revenue || 0));

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 28 }}>
        <StatCard label="Total GMV" value={formatMoney(totalRevenueNaira)} />
        <StatCard label="Kravely Revenue" value={formatMoney(koboToNaira(summary?.total_kravely_revenue))} color="#eab308" />
        <StatCard label="Today's GMV" value={formatMoney(koboToNaira(todayStats?.today_gmv))} color="#60a5fa" />
        <StatCard label="Today's Cut" value={formatMoney(koboToNaira(todayStats?.today_kravely_revenue))} color="#a78bfa" />
        <StatCard label="Avg Order Value" value={formatMoney(koboToNaira(summary?.avg_order_value))} color="#f97316" />
        <StatCard label="Delivery Rate" value={`${summary?.delivery_rate || 0}%`} color="#4ade80" />
      </div>

      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "24px" }}>
        <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 24 }}>Revenue by Vendor</h3>
        {vendorRows.map((vendor) => {
          const vendorRevenue = koboToNaira(vendor.total_revenue);
          const pct = totalRevenueNaira > 0 ? Math.round((vendorRevenue / totalRevenueNaira) * 100) : 0;
          return (
            <div key={vendor.id} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{vendor.name}</span>
                <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>
                  {formatMoney(vendorRevenue)} ({pct}%)
                </span>
              </div>
              <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: vendor.is_featured ? "linear-gradient(90deg, #eab308, #ca8a04)" : "linear-gradient(90deg, #22c55e, #4ade80)", borderRadius: 3 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RidersTab() {
  return (
    <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "22px 24px" }}>
      <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 16 }}>🏍️ Riders</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {RIDERS.map((rider) => (
          <div key={rider.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 50, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏍️</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>{rider.name}</p>
              <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{rider.phone}</p>
            </div>
            <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>⭐ {rider.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsTab() {
  const [commission, setCommission] = useState(15);
  const [deliveryFee, setDeliveryFee] = useState(300);

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "12px 16px",
    color: "#fff",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "22px 24px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>💰 Commission Rate</h3>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginBottom: 16 }}>Percentage Kravely takes from each order</p>
          <input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} style={inputStyle} min="1" max="50" />
        </div>

        <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18, padding: "22px 24px" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>🚚 Delivery Fee</h3>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginBottom: 16 }}>Fee charged to students per order</p>
          <input type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} style={inputStyle} />
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [todayStats, setTodayStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      const [
        ordersRes,
        vendorsRes,
        usersRes,
        summaryRes,
        todayStatsRes,
      ] = await Promise.all([
        supabase.from("order_details").select("*").order("placed_at", { ascending: false }),
        supabase.from("vendors").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("revenue_summary").select("*").single(),
        supabase.from("today_stats").select("*").single(),
      ]);

      if (ordersRes.error) console.log("orders error:", ordersRes.error);
      if (vendorsRes.error) console.log("vendors error:", vendorsRes.error);
      if (usersRes.error) console.log("users error:", usersRes.error);
      if (summaryRes.error) console.log("summary error:", summaryRes.error);
      if (todayStatsRes.error) console.log("today stats error:", todayStatsRes.error);

      setOrders(ordersRes.data || []);
      setVendors(vendorsRes.data || []);
      setUsers(usersRes.data || []);
      setSummary(summaryRes.data || {});
      setTodayStats(todayStatsRes.data || {});
      setLoading(false);
    };

    loadDashboardData();
  }, []);

  const currentTab = useMemo(() => {
    if (activeTab === "overview") return <OverviewTab summary={summary} todayStats={todayStats} orders={orders} vendors={vendors} users={users} />;
    if (activeTab === "orders") return <OrdersTab orders={orders} />;
    if (activeTab === "vendors") return <VendorsTab vendors={vendors} />;
    if (activeTab === "users") return <UsersTab users={users} />;
    if (activeTab === "revenue") return <RevenueTab summary={summary} todayStats={todayStats} vendors={vendors} />;
    if (activeTab === "riders") return <RidersTab />;
    if (activeTab === "settings") return <SettingsTab />;
    return <OverviewTab summary={summary} todayStats={todayStats} orders={orders} vendors={vendors} users={users} />;
  }, [activeTab, orders, vendors, users, summary, todayStats]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .tab-content { animation: fadeInUp 0.4s ease both; }
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
        <div className="admin-mobile-bar" style={{ display: "none", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#030303", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 16, color: "#000" }}>K</span>
            </div>
            <span style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15 }}>Admin</span>
          </div>
          <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px", color: "#fff", cursor: "pointer", fontSize: 18 }}>☰</button>
        </div>

        {mobileSidebarOpen && (
          <div onClick={() => setMobileSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 99, backdropFilter: "blur(4px)" }} />
        )}

        <div className="admin-layout" style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div className={`admin-sidebar ${mobileSidebarOpen ? "open" : ""}`} style={{ display: "flex" }}>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto", minWidth: 0 }}>
            <TopBar activeTab={activeTab} />
            <div style={{ padding: "24px 20px 80px", flex: 1 }}>
              <div className="tab-content" key={activeTab}>
                {currentTab}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;