import { useState } from "react";
import { Link } from "react-router-dom";

const SAMPLE_USERS = [
  { id: "USR-001", name: "Chidi Okafor", email: "chidi@example.com", role: "vendor", status: "active", joined: "Jan 2024", orders: 45 },
  { id: "USR-002", name: "Amaka Eze", email: "amaka@example.com", role: "customer", status: "active", joined: "Feb 2024", orders: 12 },
  { id: "USR-003", name: "Emeka Nwosu", email: "emeka@example.com", role: "vendor", status: "inactive", joined: "Mar 2024", orders: 28 },
];

const SAMPLE_VENDORS = [
  { id: "VEN-001", name: "Pearl's Cuisine", owner: "Chidi Okafor", rating: 4.9, orders: 145, revenue: 285000, status: "active" },
  { id: "VEN-002", name: "Jollof Hub", owner: "Amaka Eze", rating: 4.7, orders: 98, revenue: 192000, status: "active" },
  { id: "VEN-003", name: "Rice Palace", owner: "Emeka Nwosu", rating: 4.5, orders: 67, revenue: 134000, status: "inactive" },
];

const SAMPLE_ORDERS = [
  { id: "KRV-001", customer: "Chidi Okafor", vendor: "Pearl's Cuisine", items: 3, total: 3900, status: "delivered", time: "2 hrs ago" },
  { id: "KRV-002", customer: "Amaka Eze", vendor: "Jollof Hub", items: 2, total: 2300, status: "preparing", time: "12 mins ago" },
];

const SAMPLE_RIDERS = [
  { id: "RDR-001", name: "Adaeze Nwankwo" },
  { id: "RDR-002", name: "Tunde Bakare" },
  { id: "RDR-003", name: "Amir Bello" },
];

// ===================== SIDEBAR =====================
function AdminSidebar({ activeSection, setActiveSection }) {
  const sections = [
    { id: "dashboard", label: "Administrator Hub", icon: "[D]", desc: "System Overview" },
    { id: "users", label: "User Management", icon: "[U]", desc: "Account Control" },
    { id: "vendors", label: "Vendor Administration", icon: "[V]", desc: "Merchant Oversight" },
    { id: "orders", label: "Order Control", icon: "[O]", desc: "Transaction Management" },
    { id: "riders", label: "Rider Command", icon: "[R]", desc: "Track & Dispatch" },
    { id: "reports", label: "Analytics Center", icon: "[A]", desc: "Data Insights" },
    { id: "settings", label: "System Settings", icon: "[S]", desc: "Configuration" },
  ];

  return (
    <>
      <style>{`
        .sidebar-item {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 8px;
          position: relative;
          overflow: hidden;
          border: 1px solid transparent;
        }
        .sidebar-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(34,197,94,0.1), transparent);
          transition: left 0.5s;
        }
        .sidebar-item:hover::before { left: 100%; }
        .sidebar-item:hover {
          background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(59,130,246,0.1));
          border-color: rgba(34,197,94,0.3);
          transform: translateX(8px) scale(1.02);
          box-shadow: 0 8px 25px rgba(34,197,94,0.2);
        }
        .sidebar-item.active {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          border-color: #22c55e;
          color: #000 !important;
          transform: translateX(12px) scale(1.05);
          box-shadow: 0 12px 35px rgba(34,197,94,0.4);
          animation: pulse 2s infinite;
        }
        .sidebar-item.active span:first-child { animation: spin 3s linear infinite; }
        @keyframes pulse { 0%, 100% { transform: translateX(12px) scale(1.05); } 50% { transform: translateX(12px) scale(1.08); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .sidebar-container {
          width: 280px;
          background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
          border-right: 2px solid #22c55e;
          padding: 24px;
          position: fixed;
          height: 100vh;
          overflow-y: auto;
          box-shadow: inset -4px 0 20px rgba(34,197,94,0.1);
        }
        .sidebar-container::-webkit-scrollbar { width: 4px; }
        .sidebar-container::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .sidebar-container::-webkit-scrollbar-thumb { background: #22c55e; border-radius: 2px; }

        .main-content {
          margin-left: 280px;
          padding: 32px;
          min-height: 100vh;
          background: radial-gradient(circle at 20% 50%, rgba(34,197,94,0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(59,130,246,0.05) 0%, transparent 50%),
                      #000;
          position: relative;
        }
        .main-content::before {
          content: '';
          position: fixed;
          top: 0;
          left: 280px;
          right: 0;
          height: 100vh;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(34,197,94,0.03)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
          pointer-events: none;
          z-index: -1;
        }

        @media (max-width: 1024px) {
          .sidebar-container {
            width: 240px;
          }
          .main-content {
            margin-left: 240px;
            padding: 24px;
          }
        }
        @media (max-width: 768px) {
          .sidebar-container {
            width: 100%;
            height: auto;
            position: relative;
            border-right: none;
            border-bottom: 2px solid #22c55e;
            padding: 12px;
          }
          .sidebar-item {
            padding: 12px 16px;
            margin-bottom: 4px;
          }
          .sidebar-item:hover {
            transform: translateX(4px) scale(1);
          }
          .sidebar-item.active {
            transform: translateX(6px) scale(1.02);
          }
          .main-content {
            margin-left: 0;
            padding: 16px 12px;
          }
          .main-content::before { left: 0; }
        }
        @media (max-width: 640px) {
          .sidebar-item {
            padding: 10px 12px;
            margin-bottom: 2px;
          }
          .sidebar-item div {
            gap: 8px;
          }
          .main-content {
            padding: 12px 8px;
          }
        }
      `}</style>
      <div className="sidebar-container">
        <div style={{ marginBottom: 40, textAlign: "center" }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #22c55e, #16a34a, #059669)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 0 30px rgba(34,197,94,0.5)",
            animation: "glow 3s ease-in-out infinite alternate"
          }}>
            <span style={{ fontSize: 24, fontWeight: 900 }}>EB</span>
          </div>
          <h2 style={{
            color: "#fff",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            fontSize: 22,
            marginBottom: 4,
            textShadow: "0 0 20px rgba(34,197,94,0.5)"
          }}>EBUKA • ADMIN</h2>
          <p style={{
            color: "#22c55e",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>Supreme Authority</p>
        </div>

        <nav>
          {sections.map(section => (
            <div key={section.id} className={`sidebar-item ${activeSection === section.id ? 'active' : ''}`} onClick={() => setActiveSection(section.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 2 }}>
                <span style={{ fontSize: 20 }}>{section.icon}</span>
                <div>
                  <div style={{ color: activeSection === section.id ? "#000" : "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>
                    {section.label}
                  </div>
                  <div style={{ color: activeSection === section.id ? "#000" : "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>
                    {section.desc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </nav>

        <div style={{
          marginTop: 40,
          paddingTop: 20,
          borderTop: "1px solid rgba(34,197,94,0.3)",
          textAlign: "center"
        }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(34,197,94,0.1), rgba(59,130,246,0.1))",
            border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 12,
            padding: "16px",
            marginBottom: 16
          }}>
            <div style={{ color: "#22c55e", fontSize: 24, marginBottom: 8 }}>⚡</div>
            <div style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600 }}>
              System Status: OPTIMAL
            </div>
            <div style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 10 }}>
              All systems operational
            </div>
          </div>

          <Link to="/" style={{
            textDecoration: "none",
            color: "#6b7280",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderRadius: 8,
            transition: "all 0.3s",
            border: "1px solid transparent"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#22c55e";
            e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)";
            e.currentTarget.style.background = "rgba(34,197,94,0.05)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "#6b7280";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.background = "transparent";
          }}
          >
            <span>Return to Realm</span>
          </Link>
        </div>
      </div>
    </>
  );
}

// ===================== DASHBOARD SECTION =====================
function DashboardSection({ users, vendors, orders }) {
  const totalUsers = users.length;
  const activeVendors = vendors.filter(v => v.status === "active").length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((a, o) => a + o.total, 0);

  const stats = [
    { label: "Total Subjects", value: totalUsers, icon: "�", color: "#60a5fa", desc: "Under your command" },
    { label: "Active Merchants", value: activeVendors, icon: "🏰", color: "#22c55e", desc: "Loyal vassals" },
    { label: "Order Transactions", value: totalOrders, icon: "⚖️", color: "#eab308", desc: "Realm activity" },
    { label: "Empire Revenue", value: `₦${totalRevenue.toLocaleString()}`, icon: "💎", color: "#f97316", desc: "Your treasury" },
  ];

  return (
    <div>
      <div style={{ marginBottom: "clamp(24px, 5vw, 40px)", textAlign: "center" }}>
        <h1 style={{
          color: "#fff",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(24px, 6vw, 36px)",
          marginBottom: "clamp(6px, 2vw, 8px)",
          textShadow: "0 0 30px rgba(34,197,94,0.5)",
          background: "linear-gradient(135deg, #fff, #22c55e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>COMMAND CENTER</h1>
        <p style={{
          color: "#22c55e",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(13px, 4vw, 16px)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>Welcome, Supreme Administrator</p>
        <div style={{
          width: "clamp(60px, 12vw, 100px)",
          height: 4,
          background: "linear-gradient(90deg, #22c55e, #16a34a, #059669)",
          margin: "12px auto",
          borderRadius: 2,
          boxShadow: "0 0 20px rgba(34,197,94,0.5)"
        }}></div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(200px, 100%, 280px), 1fr))", gap: "clamp(16px, 4vw, 24px)", marginBottom: "clamp(32px, 8vw, 48px)" }}>
        {stats.map(({ label, value, icon, color, desc }) => (
          <div key={label} style={{
            background: "linear-gradient(135deg, rgba(10,10,10,0.9), rgba(26,26,26,0.9))",
            border: `2px solid ${color}40`,
            borderRadius: "clamp(16px, 3vw, 20px)",
            padding: "clamp(16px, 4vw, 28px)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = color;
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = `0 20px 40px ${color}30`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = `${color}40`;
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 80,
              height: 80,
              background: `radial-gradient(circle, ${color}20, transparent)`,
              borderRadius: "50%",
              transform: "translate(30px, -30px)"
            }}></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "clamp(12px, 2vw, 20px)", position: "relative", zIndex: 2 }}>
              <span style={{ fontSize: "clamp(28px, 6vw, 36px)" }}>{icon}</span>
              <span style={{ color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(20px, 5vw, 28px)" }}>{value}</span>
            </div>
            <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(13px, 3vw, 16px)", marginBottom: 8, position: "relative", zIndex: 2 }}>{label}</p>
            <p style={{ color: color, fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(10px, 2vw, 12px)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", position: "relative", zIndex: 2 }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{
        background: "linear-gradient(135deg, rgba(10,10,10,0.95), rgba(26,26,26,0.95))",
        border: "2px solid rgba(34,197,94,0.3)",
        borderRadius: "clamp(16px, 3vw, 20px)",
        padding: "clamp(16px, 4vw, 32px)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #22c55e, #16a34a, #059669)"
        }}></div>
        <h2 style={{
          color: "#fff",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: "clamp(18px, 5vw, 24px)",
          marginBottom: "clamp(16px, 3vw, 24px)",
          display: "flex",
          alignItems: "center",
          gap: 12
        }}>
          <span style={{ fontSize: 28, color: "#eab308" }}>•</span>
          Live Transaction Feed
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 3vw, 20px)", maxHeight: "clamp(300px, 60vh, 600px)", overflowY: "auto" }}>
          {orders.map(order => (
            <div key={order.id} style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "clamp(12px, 3vw, 20px)",
              gap: "12px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: 16,
              border: "1px solid rgba(34,197,94,0.2)",
              transition: "all 0.3s",
              cursor: "pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(34,197,94,0.05)";
              e.currentTarget.style.borderColor = "#22c55e";
              e.currentTarget.style.transform = "translateX(8px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              e.currentTarget.style.borderColor = "rgba(34,197,94,0.2)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
            >
              <div style={{ width: "100%" }}>
                <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(14px, 4vw, 18px)" }}>{order.id}</p>
                <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(11px, 3vw, 14px)", marginTop: "4px" }}>{order.customer} • {order.vendor}</p>
              </div>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(16px, 4vw, 20px)" }}>₦{order.total.toLocaleString()}</p>
                <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(10px, 2.5vw, 12px)" }}>{order.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== USERS SECTION =====================
function UsersSection({ users }) {
  const [filter, setFilter] = useState("all");

  const filteredUsers = filter === "all" ? users : users.filter(u => u.status === filter);

  return (
    <div>
      <div style={{ marginBottom: "clamp(24px, 5vw, 40px)", textAlign: "center" }}>
        <h1 style={{
          color: "#fff",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(24px, 6vw, 36px)",
          marginBottom: "clamp(6px, 2vw, 8px)",
          textShadow: "0 0 30px rgba(96,165,250,0.5)",
          background: "linear-gradient(135deg, #fff, #60a5fa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>USER EMPIRE</h1>
        <p style={{
          color: "#60a5fa",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(13px, 4vw, 16px)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>Control Your Subjects</p>
        <div style={{
          width: "clamp(60px, 12vw, 100px)",
          height: 4,
          background: "linear-gradient(90deg, #60a5fa, #3b82f6, #1d4ed8)",
          margin: "12px auto",
          borderRadius: 2,
          boxShadow: "0 0 20px rgba(96,165,250,0.5)"
        }}></div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "clamp(8px, 2vw, 12px)", marginBottom: 24, flexWrap: "wrap" }}>
        {["all", "active", "inactive"].map(status => (
          <button key={status} onClick={() => setFilter(status)} style={{
            padding: "clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)", borderRadius: 20, border: "none", cursor: "pointer", fontSize: "clamp(12px, 2.5vw, 14px)",
            background: filter === status ? "#22c55e" : "rgba(255,255,255,0.05)",
            color: filter === status ? "#000" : "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600
          }}>
            {status.charAt(0).toUpperCase() + status.slice(1)} ({status === "all" ? users.length : users.filter(u => u.status === status).length})
          </button>
        ))}
      </div>

      {/* Users List */}
      <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "clamp(12px, 3vw, 20px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(16px, 4vw, 18px)" }}>Users</h3>
        </div>
        <div style={{ maxHeight: "clamp(300px, 60vh, 600px)", overflowY: "auto" }}>
          {filteredUsers.map(user => (
            <div key={user.id} style={{ padding: "clamp(12px, 2.5vw, 16px) clamp(12px, 3vw, 20px)", borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ width: "100%" }}>
                <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "clamp(14px, 3.5vw, 16px)" }}>{user.name}</p>
                <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(11px, 2.5vw, 13px)", marginTop: "2px" }}>{user.email} • {user.role}</p>
              </div>
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ background: user.status === "active" ? "rgba(34,197,94,0.2)" : "rgba(107,114,128,0.2)", color: user.status === "active" ? "#22c55e" : "#6b7280", padding: "4px 12px", borderRadius: 12, fontSize: "clamp(10px, 2vw, 12px)", fontWeight: 600 }}>
                  {user.status}
                </span>
                <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(10px, 2vw, 12px)" }}>{user.orders} orders</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VendorsSection({ vendors }) {
  const [filter, setFilter] = useState("all");

  const filteredVendors = filter === "all" ? vendors : vendors.filter(v => v.status === filter);

  return (
    <div>
      <div style={{ marginBottom: "clamp(24px, 5vw, 40px)", textAlign: "center" }}>
        <h1 style={{
          color: "#fff",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: "clamp(24px, 6vw, 36px)",
          marginBottom: "clamp(6px, 2vw, 8px)",
          textShadow: "0 0 30px rgba(249,115,22,0.5)",
          background: "linear-gradient(135deg, #fff, #f97316)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>MERCHANT ALLIANCE</h1>
        <p style={{
          color: "#f97316",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "clamp(13px, 4vw, 16px)",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}>Your Loyal Vassals</p>
        <div style={{
          width: "clamp(60px, 12vw, 100px)",
          height: 4,
          background: "linear-gradient(90deg, #f97316, #ea580c, #c2410c)",
          margin: "12px auto",
          borderRadius: 2,
          boxShadow: "0 0 20px rgba(249,115,22,0.5)"
        }}></div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "clamp(8px, 2vw, 12px)", marginBottom: 24, flexWrap: "wrap" }}>
        {["all", "active", "inactive"].map(status => (
          <button key={status} onClick={() => setFilter(status)} style={{
            padding: "clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)", borderRadius: 20, border: "none", cursor: "pointer", fontSize: "clamp(12px, 2.5vw, 14px)",
            background: filter === status ? "linear-gradient(135deg, #f97316, #ea580c)" : "rgba(255,255,255,0.05)",
            color: filter === status ? "#000" : "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            transition: "all 0.3s",
            textShadow: filter === status ? "0 0 10px rgba(249,115,22,0.5)" : "none"
          }}
          onMouseEnter={e => {
            if (filter !== status) {
              e.currentTarget.style.background = "rgba(249,115,22,0.1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={e => {
            if (filter !== status) {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)} ({status === "all" ? vendors.length : vendors.filter(v => v.status === status).length})
          </button>
        ))}
      </div>

      {/* Vendors Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(250px, 100%, 350px), 1fr))", gap: "clamp(16px, 4vw, 24px)" }}>
        {filteredVendors.map(vendor => (
          <div key={vendor.id} style={{
            background: "linear-gradient(135deg, rgba(10,10,10,0.9), rgba(26,26,26,0.9))",
            border: `2px solid ${vendor.status === "active" ? "rgba(249,115,22,0.3)" : "rgba(107,114,128,0.3)"}`,
            borderRadius: "clamp(16px, 3vw, 20px)",
            padding: "clamp(16px, 4vw, 28px)",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = `0 20px 40px ${vendor.status === "active" ? "rgba(249,115,22,0.3)" : "rgba(107,114,128,0.3)"}`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 80,
              height: 80,
              background: `radial-gradient(circle, ${vendor.status === "active" ? "#f9731620" : "#6b728020"}, transparent)`,
              borderRadius: "50%",
              transform: "translate(30px, -30px)"
            }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px, 3vw, 16px)", marginBottom: "clamp(12px, 2vw, 20px)", position: "relative", zIndex: 2 }}>
              <div style={{
                width: "clamp(50px, 10vw, 60px)",
                height: "clamp(50px, 10vw, 60px)",
                borderRadius: 12,
                background: "linear-gradient(135deg, #f97316, #ea580c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "clamp(20px, 5vw, 28px)",
                flexShrink: 0
              }}>🏰</div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(16px, 4vw, 20px)", marginBottom: 4, overflowWrap: "break-word" }}>{vendor.name}</h3>
                <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(12px, 3vw, 14px)", marginTop: "2px" }}>{vendor.owner}</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 2, gap: "12px" }}>
              <div>
                <p style={{ color: "#f97316", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(18px, 4vw, 24px)" }}>₦{vendor.revenue.toLocaleString()}</p>
                <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(10px, 2.5vw, 12px)", marginTop: "2px" }}>{vendor.orders} transactions</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
                  <span style={{ color: "#eab308", fontSize: "clamp(14px, 3vw, 16px)" }}>⭐</span>
                  <span style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "clamp(14px, 3vw, 16px)" }}>{vendor.rating}</span>
                </div>
                <span style={{
                  background: vendor.status === "active" ? "rgba(249,115,22,0.2)" : "rgba(107,114,128,0.2)",
                  color: vendor.status === "active" ? "#f97316" : "#6b7280",
                  padding: "6px 16px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${vendor.status === "active" ? "#f97316" : "#6b7280"}`,
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  {vendor.status === "active" ? "Vassal" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== ORDERS SECTION =====================
function OrdersSection({ orders, riders, assignedRiders, setAssignedRiders }) {
  const [filter, setFilter] = useState("all");

  const filteredOrders = filter === "all" ? orders : orders.filter(o => o.status === filter);

  return (
    <div>
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <h1 style={{
          color: "#fff",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: 36,
          marginBottom: 8,
          textShadow: "0 0 30px rgba(234,179,8,0.5)",
          background: "linear-gradient(135deg, #fff, #eab308)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>TRANSACTION THRONE</h1>
        <p style={{
          color: "#eab308",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>Monitor the Flow of Wealth</p>
        <div style={{
          width: 100,
          height: 4,
          background: "linear-gradient(90deg, #eab308, #d97706, #b45309)",
          margin: "16px auto",
          borderRadius: 2,
          boxShadow: "0 0 20px rgba(234,179,8,0.5)"
        }}></div>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {["all", "pending", "preparing", "ready", "delivered"].map(status => (
          <button key={status} onClick={() => setFilter(status)} style={{
            padding: "10px 20px", borderRadius: 20, border: "none", cursor: "pointer",
            background: filter === status ? "linear-gradient(135deg, #eab308, #d97706)" : "rgba(255,255,255,0.05)",
            color: filter === status ? "#000" : "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            transition: "all 0.3s",
            textShadow: filter === status ? "0 0 10px rgba(234,179,8,0.5)" : "none",
            textTransform: "capitalize"
          }}
          onMouseEnter={e => {
            if (filter !== status) {
              e.currentTarget.style.background = "rgba(234,179,8,0.1)";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={e => {
            if (filter !== status) {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
          >
            {status === "all" ? "All Transactions" : status} ({status === "all" ? orders.length : orders.filter(o => o.status === status).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div style={{
        background: "linear-gradient(135deg, rgba(10,10,10,0.9), rgba(26,26,26,0.9))",
        border: "2px solid rgba(234,179,8,0.3)",
        borderRadius: 20,
        overflow: "hidden",
        position: "relative"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #eab308, #d97706, #b45309)"
        }}></div>
        <div style={{ padding: "20px", borderBottom: "1px solid rgba(234,179,8,0.2)" }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18 }}>Royal Transactions</h3>
        </div>
        <div style={{ maxHeight: "600px", overflowY: "auto" }}>
          {filteredOrders.map(order => (
            <div key={order.id} style={{
              padding: "20px",
              borderBottom: "1px solid rgba(255,255,255,0.03)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.3s",
              cursor: "pointer"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(234,179,8,0.05)";
              e.currentTarget.style.transform = "translateX(8px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "translateX(0)";
            }}
            >
              <div>
                <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16 }}>{order.id}</p>
                <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{order.customer} • {order.vendor} • {order.items} items</p>
              </div>
              <div style={{ textAlign: "right", display: "grid", gap: 8 }}>
                <p style={{ color: "#eab308", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>₦{order.total.toLocaleString()}</p>
                <span style={{
                  background: "rgba(249,115,22,0.2)",
                  color: "#f97316",
                  padding: "6px 16px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "1px solid #f97316",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  {order.status}
                </span>
                <label style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginTop: 4 }}>Assign Rider</label>
                <select value={assignedRiders[order.id] || ""} onChange={e => setAssignedRiders(prev => ({ ...prev, [order.id]: e.target.value }))} style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff"
                }}>
                  <option value="" disabled>Select a rider</option>
                  {riders.map(rider => (
                    <option key={rider.id} value={rider.name}>{rider.name}</option>
                  ))}
                </select>
                {assignedRiders[order.id] && (
                  <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600 }}>
                    Rider assigned: {assignedRiders[order.id]}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===================== RIDERS SECTION =====================
function RidersSection({ riders, setRiders, orders, assignedRiders, setAssignedRiders }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRiders = statusFilter === "all" ? riders : riders.filter(r => r.status === statusFilter);

  const assignedOrderMap = Object.entries(assignedRiders).reduce((acc, [orderId, riderName]) => {
    acc[riderName] = acc[riderName] ? acc[riderName].concat(orderId) : [orderId];
    return acc;
  }, {});

  const statusCycle = { available: "on-duty", "on-duty": "offline", offline: "available" };

  const toggleStatus = riderId => {
    setRiders(prev => prev.map(r => (r.id === riderId ? { ...r, status: statusCycle[r.status] || "available" } : r)));
  };

  return (
    <div>
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <h1 style={{
          color: "#fff",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: 36,
          marginBottom: 8,
          textShadow: "0 0 30px rgba(39, 194, 255, 0.5)",
          background: "linear-gradient(135deg, #fff, #22c55e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>RIDER COMMAND</h1>
        <p style={{
          color: "#22c55e",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>Track Team, Dispatch Assignments</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <label style={{ color: "#9ca3af", fontFamily: "'DM Sans', sans-serif" }}>Filter riders:</label>
        { ["all", "available", "on-duty", "offline"].map(s => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.2)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            background: statusFilter===s ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.05)",
            color: "#fff",
            cursor: "pointer"
          }}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ background: "rgba(15,15,15,0.95)", border: "2px solid rgba(34,197,94,0.25)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "14px", background: "rgba(255,255,255,0.03)", fontFamily: "'DM Sans', sans-serif", color: "#9ca3af", fontSize: 12, textTransform: "uppercase", letterSpacing: "1px" }}>
          <div>ID</div>
          <div>Name</div>
          <div>Status</div>
          <div>Assigned Orders</div>
          <div>Action</div>
        </div>
        {filteredRiders.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#9ca3af" }}>No riders at this status.</div>
        ) : filteredRiders.map(rider => (
          <div key={rider.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", padding: "14px", color: "#fff", fontFamily: "'DM Sans', sans-serif", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div>{rider.id}</div>
            <div>{rider.name}</div>
            <div>{rider.status}</div>
            <div>{(assignedOrderMap[rider.name] || []).join(", ") || "None"}</div>
            <div>
              <button onClick={() => toggleStatus(rider.id)} style={{
                width: "100%",
                padding: "6px 10px",
                borderRadius: 8,
                border: "none",
                background: "rgba(34,197,94,0.2)",
                color: "#fff",
                cursor: "pointer"
              }}>
                Next state
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: "20px", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16 }}>
        <h4 style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", marginBottom: 8 }}>Live Rider Dispatch</h4>
        <div style={{ color: "#d1d5db", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
          Assigned riders and orders are synced with the Orders page. Update order assignment there and watch Rider Command reflect your team status.
        </div>
      </div>
    </div>
  );
}

// ===================== REPORTS SECTION =====================
function ReportsSection({ users, vendors, orders }) {
  const totalRevenue = orders.reduce((a, o) => a + o.total, 0);
  const avgOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  const reports = [
    { title: "Empire Treasury", value: `₦${totalRevenue.toLocaleString()}`, description: "Total wealth accumulated", icon: "💰", color: "#eab308" },
    { title: "Average Tribute", value: `₦${avgOrderValue.toLocaleString()}`, description: "Mean transaction value", icon: "⚖️", color: "#f97316" },
    { title: "Loyal Subjects", value: users.filter(u => u.status === "active").length, description: "Active user population", icon: "👑", color: "#60a5fa" },
    { title: "Merchant Vassals", value: vendors.filter(v => v.status === "active").length, description: "Approved vendor allies", icon: "🏰", color: "#22c55e" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <h1 style={{
          color: "#fff",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: 36,
          marginBottom: 8,
          textShadow: "0 0 30px rgba(139,69,19,0.5)",
          background: "linear-gradient(135deg, #fff, #8b4513)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>ROYAL LEDGERS</h1>
        <p style={{
          color: "#8b4513",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>The Books of Power</p>
        <div style={{
          width: 100,
          height: 4,
          background: "linear-gradient(90deg, #8b4513, #a0522d, #654321)",
          margin: "16px auto",
          borderRadius: 2,
          boxShadow: "0 0 20px rgba(139,69,19,0.5)"
        }}></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 48 }}>
        {reports.map(report => (
          <div key={report.title} style={{
            background: "linear-gradient(135deg, rgba(10,10,10,0.9), rgba(26,26,26,0.9))",
            border: `2px solid ${report.color}40`,
            borderRadius: 20,
            padding: "28px",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            cursor: "pointer"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = report.color;
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = `0 20px 40px ${report.color}30`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = `${report.color}40`;
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 80,
              height: 80,
              background: `radial-gradient(circle, ${report.color}20, transparent)`,
              borderRadius: "50%",
              transform: "translate(30px, -30px)"
            }}></div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, position: "relative", zIndex: 2 }}>
              <span style={{ fontSize: 36 }}>{report.icon}</span>
              <div>
                <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{report.title}</h3>
                <p style={{ color: report.color, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{report.description}</p>
              </div>
            </div>
            <p style={{ color: report.color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 28, position: "relative", zIndex: 2 }}>{report.value}</p>
          </div>
        ))}
      </div>

      <div style={{
        background: "linear-gradient(135deg, rgba(10,10,10,0.95), rgba(26,26,26,0.95))",
        border: "2px solid rgba(139,69,19,0.3)",
        borderRadius: 20,
        padding: "32px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #8b4513, #a0522d, #654321)"
        }}></div>
        <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>📊</span>
          Imperial Analytics
        </h3>
        <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 16 }}>
          📈 Advanced charts and visualizations would be displayed here
        </div>
        <p style={{ color: "#8b4513", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, marginTop: 16 }}>
          Real-time insights into your domain's performance
        </p>
      </div>
    </div>
  );
}

// ===================== SETTINGS SECTION =====================
function SettingsSection() {
  return (
    <div>
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <h1 style={{
          color: "#fff",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          fontSize: 36,
          marginBottom: 8,
          textShadow: "0 0 30px rgba(168,85,247,0.5)",
          background: "linear-gradient(135deg, #fff, #a855f7)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>IMPERIAL DECREES</h1>
        <p style={{
          color: "#a855f7",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 16,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "2px"
        }}>Shape the Realm's Destiny</p>
        <div style={{
          width: 100,
          height: 4,
          background: "linear-gradient(90deg, #a855f7, #9333ea, #7c3aed)",
          margin: "16px auto",
          borderRadius: 2,
          boxShadow: "0 0 20px rgba(168,85,247,0.5)"
        }}></div>
      </div>

      <div style={{
        background: "linear-gradient(135deg, rgba(10,10,10,0.9), rgba(26,26,26,0.9))",
        border: "2px solid rgba(168,85,247,0.3)",
        borderRadius: 20,
        padding: "32px",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "linear-gradient(90deg, #a855f7, #9333ea, #7c3aed)"
        }}></div>
        <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 24, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>⚙️</span>
          Royal Configuration
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          <div style={{ position: "relative" }}>
            <label style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, display: "block", marginBottom: 12, fontSize: 16 }}>Empire Name</label>
            <input type="text" defaultValue="Kravley" style={{
              width: "100%",
              padding: "16px 20px",
              background: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(168,85,247,0.3)",
              borderRadius: 12,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              outline: "none",
              transition: "all 0.3s"
            }}
            onFocus={e => e.currentTarget.style.borderColor = "#a855f7"}
            onBlur={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"}
            />
          </div>
          <div style={{ position: "relative" }}>
            <label style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, display: "block", marginBottom: 12, fontSize: 16 }}>Royal Tax Rate (%)</label>
            <input type="number" defaultValue="10" style={{
              width: "100%",
              padding: "16px 20px",
              background: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(168,85,247,0.3)",
              borderRadius: 12,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              outline: "none",
              transition: "all 0.3s"
            }}
            onFocus={e => e.currentTarget.style.borderColor = "#a855f7"}
            onBlur={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"}
            />
          </div>
          <div style={{ position: "relative" }}>
            <label style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, display: "block", marginBottom: 12, fontSize: 16 }}>Imperial Support</label>
            <input type="email" defaultValue="support@kravley.com" style={{
              width: "100%",
              padding: "16px 20px",
              background: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(168,85,247,0.3)",
              borderRadius: 12,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              outline: "none",
              transition: "all 0.3s"
            }}
            onFocus={e => e.currentTarget.style.borderColor = "#a855f7"}
            onBlur={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"}
            />
          </div>
          <div style={{ position: "relative" }}>
            <label style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, display: "block", marginBottom: 12, fontSize: 16 }}>Realm Status</label>
            <select style={{
              width: "100%",
              padding: "16px 20px",
              background: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(168,85,247,0.3)",
              borderRadius: 12,
              color: "#fff",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 16,
              outline: "none",
              transition: "all 0.3s",
              cursor: "pointer"
            }}
            onFocus={e => e.currentTarget.style.borderColor = "#a855f7"}
            onBlur={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.3)"}
            >
              <option value="false" style={{ background: "#0a0a0a", color: "#fff" }}>Open for Business</option>
              <option value="true" style={{ background: "#0a0a0a", color: "#fff" }}>Under Royal Maintenance</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <button style={{
            padding: "16px 32px",
            background: "linear-gradient(135deg, #a855f7, #9333ea)",
            border: "none",
            borderRadius: 12,
            color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            transition: "all 0.3s",
            textTransform: "uppercase",
            letterSpacing: "1px",
            boxShadow: "0 8px 20px rgba(168,85,247,0.4)"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 12px 30px rgba(168,85,247,0.6)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(168,85,247,0.4)";
          }}
          >
            Enact Royal Decree
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== MAIN DASHBOARD =====================
function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users] = useState(SAMPLE_USERS);
  const [vendors] = useState(SAMPLE_VENDORS);
  const [orders] = useState(SAMPLE_ORDERS);
  const [riders, setRiders] = useState(SAMPLE_RIDERS);
  const [assignedRiders, setAssignedRiders] = useState({});

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardSection users={users} vendors={vendors} orders={orders} />;
      case "users": return <UsersSection users={users} />;
      case "vendors": return <VendorsSection vendors={vendors} />;
      case "orders": return <OrdersSection orders={orders} riders={riders} assignedRiders={assignedRiders} setAssignedRiders={setAssignedRiders} />;
      case "riders": return <RidersSection riders={riders} setRiders={setRiders} orders={orders} assignedRiders={assignedRiders} setAssignedRiders={setAssignedRiders} />;
      case "reports": return <ReportsSection users={users} vendors={vendors} orders={orders} />;
      case "settings": return <SettingsSection />;
      default: return <DashboardSection users={users} vendors={vendors} orders={orders} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#000" }}>
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content">
        {renderSection()}
      </div>
    </div>
  );
}

export default AdminDashboard;
