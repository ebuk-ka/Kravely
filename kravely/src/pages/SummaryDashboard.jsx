import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ===================== LIVE DATA SIMULATION =====================
// When backend is ready, replace these with real API calls
function useLiveData() {
  const [data, setData] = useState({
    totalRevenue: 1847500,
    todayRevenue: 284300,
    kravelyCut: 276825,
    todayCut: 42645,
    totalOrders: 342,
    todayOrders: 47,
    activeOrders: 3,
    totalUsers: 1284,
    newUsersToday: 23,
    activeVendors: 6,
    totalVendors: 8,
    deliveryRate: 98.2,
    avgOrderValue: 5400,
    topVendor: "Pearl's Cuisine",
    topVendorRevenue: 412000,
    lastUpdated: new Date(),
  });

  const [countdown, setCountdown] = useState(60);
  const [refreshing, setRefreshing] = useState(false);

  // Auto refresh every 60 seconds
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) return 60;
        return prev - 1;
      });
    }, 1000);

    const refreshInterval = setInterval(() => {
      setRefreshing(true);
      setTimeout(() => {
        // Simulate slight data changes (replace with real API call)
        setData(prev => ({
          ...prev,
          todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 5000),
          todayCut: prev.todayCut + Math.floor(Math.random() * 750),
          todayOrders: prev.todayOrders + Math.floor(Math.random() * 3),
          activeOrders: Math.floor(Math.random() * 6),
          newUsersToday: prev.newUsersToday + Math.floor(Math.random() * 2),
          lastUpdated: new Date(),
        }));
        setRefreshing(false);
      }, 800);
    }, 60000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(refreshInterval);
    };
  }, []);

  const manualRefresh = () => {
    setRefreshing(true);
    setCountdown(60);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 3000),
        todayCut: prev.todayCut + Math.floor(Math.random() * 450),
        lastUpdated: new Date(),
      }));
      setRefreshing(false);
    }, 800);
  };

  return { data, countdown, refreshing, manualRefresh };
}

// ===================== RECENT ORDERS (read only) =====================
const RECENT_ORDERS = [
  { id: "KRV-047", customer: "Chidi Okafor",  vendor: "Pearl's Cuisine",      amount: 10500, status: "delivered", time: "2 min ago" },
  { id: "KRV-046", customer: "Amaka Eze",      vendor: "Mama Nkechi's",        amount: 2100,  status: "preparing", time: "8 min ago" },
  { id: "KRV-045", customer: "Emeka Nwosu",    vendor: "Chukwu's Grill",       amount: 3300,  status: "pending",   time: "15 min ago" },
  { id: "KRV-044", customer: "Ngozi Obi",      vendor: "Campus Bites",         amount: 1300,  status: "delivered", time: "22 min ago" },
  { id: "KRV-043", customer: "Kelechi Ibe",    vendor: "Owerri Rice Palace",   amount: 4200,  status: "delivered", time: "31 min ago" },
  { id: "KRV-042", customer: "Adaeze Uche",    vendor: "Pearl's Cuisine",      amount: 35000, status: "delivered", time: "45 min ago" },
];

const VENDORS = [
  { name: "Pearl's Cuisine",       orders: 89, revenue: 412000, rating: 4.9, status: "active"   },
  { name: "Mama Nkechi's Kitchen", orders: 76, revenue: 182400, rating: 4.8, status: "active"   },
  { name: "Chukwu's Grill Spot",   orders: 54, revenue: 162000, rating: 4.6, status: "active"   },
  { name: "Campus Bites",          orders: 43, revenue: 86000,  rating: 4.5, status: "active"   },
  { name: "Owerri Rice Palace",    orders: 38, revenue: 114000, rating: 4.9, status: "active"   },
  { name: "Pepper Soup Corner",    orders: 29, revenue: 72500,  rating: 4.8, status: "active"   },
  { name: "FreshJuice Hub",        orders: 9,  revenue: 18000,  rating: 4.7, status: "inactive" },
  { name: "Combo King",            orders: 4,  revenue: 9600,   rating: 4.5, status: "pending"  },
];

const STATUS_STYLE = {
  delivered: { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)"  },
  preparing: { color: "#eab308", bg: "rgba(234,179,8,0.1)",   border: "rgba(234,179,8,0.25)"  },
  pending:   { color: "#f97316", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.25)" },
  active:    { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)"  },
  inactive:  { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.25)"},
  pending2:  { color: "#f97316", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.25)" },
};

// ===================== STAT CARD =====================
function StatCard({ icon, label, value, sub, color, pulse }) {
  return (
    <div style={{
      background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 20, padding: "20px 22px", position: "relative", overflow: "hidden",
    }}>
      {pulse && (
        <div style={{ position: "absolute", top: 14, right: 14, width: 8, height: 8, borderRadius: "50%", background: color, animation: "livePulse 2s infinite" }} />
      )}
      <span style={{ fontSize: 26, display: "block", marginBottom: 12 }}>{icon}</span>
      <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 6 }}>{label}</p>
      <p style={{ color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(20px, 3vw, 28px)", letterSpacing: -1 }}>{value}</p>
      {sub && <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

// ===================== SECTION HEADER =====================
function SectionHeader({ title }) {
  return (
    <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 16, letterSpacing: -0.5 }}>
      {title}
    </h2>
  );
}

// ===================== MAIN DASHBOARD =====================
function SummaryDashboard() {
  const { data, countdown, refreshing, manualRefresh } = useLiveData();
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview",    icon: "📊" },
    { id: "orders",   label: "Live Orders", icon: "🛒" },
    { id: "vendors",  label: "Vendors",     icon: "🏪" },
    { id: "revenue",  label: "Revenue",     icon: "💰" },
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenues = [120000, 185000, 240000, 310000, 428000, 564500];
  const maxRev = Math.max(...revenues);

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes livePulse { 0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 currentColor; } 50% { opacity: 0.7; transform: scale(1.2); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        .section-content { animation: fadeInUp 0.4s ease both; }
        .read-only-badge { pointer-events: none !important; user-select: none !important; }

        /* Mobile nav */
        .mobile-nav-btn { transition: all 0.2s ease; cursor: pointer; border: none; flex: 1; }
        .mobile-nav-btn:hover { background: rgba(255,255,255,0.06) !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column" }}>

        {/* ===== TOP NAVBAR ===== */}
        <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>

            {/* Logo + title */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 200 }}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 18, color: "#000" }}>K</span>
                </div>
              </Link>
              <div>
                <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15 }}>Kravely</p>
                <p style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>CEO SUMMARY · READ ONLY</p>
              </div>
            </div>

            {/* Refresh + countdown */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

              {/* Live badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 50, padding: "6px 12px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "livePulse 2s infinite" }} />
                <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700 }}>LIVE</span>
              </div>

              {/* Countdown */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 50, padding: "6px 12px" }}>
                {refreshing ? (
                  <svg style={{ animation: "spin 1s linear infinite" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                )}
                <span style={{ color: refreshing ? "#22c55e" : "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600 }}>
                  {refreshing ? "Updating..." : `Refreshes in ${countdown}s`}
                </span>
              </div>

              {/* Manual refresh */}
              <button onClick={manualRefresh} disabled={refreshing} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50, padding: "7px 14px", color: "#fff", cursor: refreshing ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, opacity: refreshing ? 0.5 : 1, transition: "all 0.2s" }}
                onMouseEnter={e => { if (!refreshing) e.currentTarget.style.background = "rgba(34,197,94,0.1)"; }}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              >
                ↻ Refresh
              </button>

            </div>

            {/* Nimi's profile */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: 50, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>👩🏾‍💼</div>
              <div>
                <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>Nimi George</p>
                <p style={{ color: "#7c3aed", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700 }}>CEO & Co-founder</p>
              </div>
            </div>

          </div>

          {/* Section tabs */}
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px", display: "flex", gap: 4, overflowX: "auto", paddingBottom: 10 }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                padding: "8px 18px", borderRadius: 50, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                background: activeSection === s.id ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
                color: activeSection === s.id ? "#22c55e" : "rgba(255,255,255,0.45)",
                border: activeSection === s.id ? "1px solid rgba(34,197,94,0.25)" : "1px solid transparent",
                display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
                transition: "all 0.2s",
              }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </nav>

        {/* ===== READ ONLY BANNER ===== */}
        <div style={{ background: "rgba(124,58,237,0.08)", borderBottom: "1px solid rgba(124,58,237,0.2)", padding: "8px 20px", textAlign: "center" }}>
          <span style={{ color: "#a78bfa", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600 }}>
            👁️ View-only mode — This dashboard is for monitoring only. Contact Ebuka to make changes.
          </span>
        </div>

        {/* ===== CONTENT ===== */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px 80px", width: "100%" }}>

          {/* Last updated */}
          <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 20, textAlign: "right" }}>
            {refreshing ? (
              <span style={{ color: "#22c55e", animation: "shimmer 1s infinite" }}>⟳ Updating data...</span>
            ) : (
              `Last updated: ${data.lastUpdated.toLocaleTimeString("en-NG")}`
            )}
          </p>

          <div className="section-content" key={activeSection}>

            {/* ===== OVERVIEW ===== */}
            {activeSection === "overview" && (
              <div>
                {/* Welcome banner */}
                <div style={{ background: "linear-gradient(135deg, #0d0d1a, #13103d)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 22, padding: "26px 28px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", right: -20, top: -20, fontSize: 100, opacity: 0.05 }}>👑</div>
                  <p style={{ color: "#a78bfa", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Good day, Nimi 👩🏾‍💼</p>
                  <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(20px, 3vw, 30px)", letterSpacing: -1, marginBottom: 16 }}>
                    Here's how Kravely is doing<br />
                    <span style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>right now. 🚀</span>
                  </h2>
                  <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                    {[
                      [`₦${data.kravelyCut.toLocaleString()}`, "Total Kravely earnings"],
                      [`₦${data.todayCut.toLocaleString()}`, "Earned today"],
                      [`${data.totalOrders} orders`, "All time"],
                      [`${data.deliveryRate}%`, "Success rate"],
                    ].map(([v, l]) => (
                      <div key={l}>
                        <p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20 }}>{v}</p>
                        <p style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{l}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
                  <StatCard icon="💰" label="Total Revenue (GMV)" value={`₦${data.totalRevenue.toLocaleString()}`} color="#22c55e" pulse />
                  <StatCard icon="📈" label="Today's Revenue" value={`₦${data.todayRevenue.toLocaleString()}`} color="#4ade80" pulse />
                  <StatCard icon="💸" label="Our Cut (15%)" value={`₦${data.kravelyCut.toLocaleString()}`} color="#eab308" />
                  <StatCard icon="🛒" label="Total Orders" value={data.totalOrders} sub={`${data.todayOrders} today`} color="#60a5fa" />
                  <StatCard icon="🔴" label="Active Orders Now" value={data.activeOrders} color="#f97316" pulse />
                  <StatCard icon="👥" label="Total Users" value={data.totalUsers.toLocaleString()} sub={`+${data.newUsersToday} today`} color="#a78bfa" />
                  <StatCard icon="🏪" label="Active Vendors" value={`${data.activeVendors}/${data.totalVendors}`} color="#22c55e" />
                  <StatCard icon="⭐" label="Top Vendor" value="Pearl's" sub={`₦${data.topVendorRevenue.toLocaleString()}`} color="#eab308" />
                </div>

                {/* Quick snapshot — orders + vendors side by side */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>

                  {/* Recent orders */}
                  <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px 22px" }}>
                    <SectionHeader title="🔴 Latest Orders" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {RECENT_ORDERS.slice(0, 4).map(order => {
                        const s = STATUS_STYLE[order.status];
                        return (
                          <div key={order.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12 }}>
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

                  {/* Vendor leaderboard */}
                  <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px 22px" }}>
                    <SectionHeader title="🏆 Vendor Leaderboard" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {VENDORS.slice(0, 5).map((v, i) => (
                        <div key={v.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12 }}>
                          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 15, color: i === 0 ? "#eab308" : i === 1 ? "#9ca3af" : i === 2 ? "#cd7c2f" : "#374151", width: 22, textAlign: "center" }}>#{i+1}</span>
                          <div style={{ flex: 1 }}>
                            <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>{v.name}</p>
                            <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{v.orders} orders · ⭐ {v.rating}</p>
                          </div>
                          <p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>₦{v.revenue.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ===== LIVE ORDERS ===== */}
            {activeSection === "orders" && (
              <div>
                {/* Active orders count */}
                <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
                  {[
                    { label: "Active Orders", value: data.activeOrders, color: "#f97316" },
                    { label: "Today's Orders", value: data.todayOrders, color: "#60a5fa" },
                    { label: "Today's Revenue", value: `₦${data.todayRevenue.toLocaleString()}`, color: "#22c55e" },
                    { label: "Today's Cut (15%)", value: `₦${data.todayCut.toLocaleString()}`, color: "#eab308" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 20px", flex: 1, minWidth: 130 }}>
                      <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 6 }}>{label}</p>
                      <p style={{ color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22 }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Orders table */}
                <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "auto" }}>
                  <div style={{ minWidth: 560 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.2fr 100px 110px", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                      {["Order", "Customer", "Vendor", "Amount", "Status"].map(h => (
                        <span key={h} style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{h}</span>
                      ))}
                    </div>
                    {RECENT_ORDERS.map((order, i) => {
                      const s = STATUS_STYLE[order.status];
                      return (
                        <div key={order.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.2fr 100px 110px", padding: "13px 20px", borderBottom: i < RECENT_ORDERS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}
                        >
                          <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>{order.id}</span>
                          <div>
                            <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{order.customer}</p>
                            <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{order.time}</p>
                          </div>
                          <span style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{order.vendor}</span>
                          <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14 }}>₦{order.amount.toLocaleString()}</span>
                          <span style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}`, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", display: "inline-block" }}>{order.status}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ===== VENDORS ===== */}
            {activeSection === "vendors" && (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
                  {[
                    { label: "Active Vendors", value: `${data.activeVendors}`, color: "#22c55e" },
                    { label: "Inactive", value: "1", color: "#6b7280" },
                    { label: "Pending Approval", value: "1", color: "#f97316" },
                    { label: "Top Vendor", value: "Pearl's", color: "#eab308" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px 18px" }}>
                      <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 8 }}>{label}</p>
                      <p style={{ color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 24 }}>{value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {VENDORS.map((vendor, i) => {
                    const sKey = vendor.status === "pending" ? "pending2" : vendor.status;
                    const s = STATUS_STYLE[sKey] || STATUS_STYLE.inactive;
                    return (
                      <div key={vendor.name} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={e => e.currentTarget.style.background = "#0a0a0a"}
                      >
                        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 16, color: i === 0 ? "#eab308" : "#374151", width: 26 }}>#{i+1}</span>
                        <div style={{ flex: 1, minWidth: 120 }}>
                          <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14 }}>{vendor.name}</p>
                          <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                            <span style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}`, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>{vendor.status}</span>
                            <span style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>⭐ {vendor.rating}</span>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                          {[["Orders", vendor.orders], ["Revenue", `₦${vendor.revenue.toLocaleString()}`]].map(([label, val]) => (
                            <div key={label} style={{ textAlign: "center" }}>
                              <p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15 }}>{val}</p>
                              <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{label}</p>
                            </div>
                          ))}
                        </div>
                        {/* Kravely cut per vendor */}
                        <div style={{ textAlign: "center" }}>
                          <p style={{ color: "#eab308", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15 }}>₦{Math.round(vendor.revenue * 0.15).toLocaleString()}</p>
                          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>Our 15%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ===== REVENUE ===== */}
            {activeSection === "revenue" && (
              <div>
                {/* Revenue cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 28 }}>
                  {[
                    { label: "Total GMV", value: `₦${data.totalRevenue.toLocaleString()}`, color: "#22c55e", desc: "All vendor sales" },
                    { label: "Kravely Total (15%)", value: `₦${data.kravelyCut.toLocaleString()}`, color: "#eab308", desc: "Our commission" },
                    { label: "Today GMV", value: `₦${data.todayRevenue.toLocaleString()}`, color: "#60a5fa", desc: "Today's sales" },
                    { label: "Today's Cut", value: `₦${data.todayCut.toLocaleString()}`, color: "#4ade80", desc: "Today's commission" },
                    { label: "Avg Order Value", value: `₦${data.avgOrderValue.toLocaleString()}`, color: "#f97316", desc: "Per order" },
                    { label: "Delivery Success", value: `${data.deliveryRate}%`, color: "#a78bfa", desc: "Orders delivered" },
                  ].map(({ label, value, color, desc }) => (
                    <div key={label} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "18px 20px" }}>
                      <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 8 }}>{label}</p>
                      <p style={{ color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 4 }}>{value}</p>
                      <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{desc}</p>
                    </div>
                  ))}
                </div>

                {/* Revenue bar chart */}
                <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "24px", marginBottom: 20 }}>
                  <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 24 }}>📈 Monthly Revenue Growth</h3>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 160, paddingBottom: 28, position: "relative" }}>
                    {[0, 25, 50, 75, 100].map(pct => (
                      <div key={pct} style={{ position: "absolute", left: 0, right: 0, bottom: `${pct * 1.32 + 28}px`, height: 1, background: "rgba(255,255,255,0.04)" }} />
                    ))}
                    {revenues.map((rev, i) => {
                      const height = (rev / maxRev) * 120;
                      return (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 9, fontWeight: 700 }}>₦{(rev/1000).toFixed(0)}k</span>
                          <div style={{ width: "100%", height, background: "linear-gradient(to top, #22c55e, #4ade80)", borderRadius: "5px 5px 0 0", boxShadow: "0 0 16px rgba(34,197,94,0.2)" }} />
                          <span style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{months[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vendor breakdown */}
                <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "22px 24px" }}>
                  <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 20 }}>Revenue by Vendor</h3>
                  {VENDORS.map(vendor => {
                    const pct = Math.round((vendor.revenue / data.totalRevenue) * 100);
                    return (
                      <div key={vendor.name} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 4 }}>
                          <span style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{vendor.name}</span>
                          <div style={{ display: "flex", gap: 12 }}>
                            <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>₦{vendor.revenue.toLocaleString()}</span>
                            <span style={{ color: "#eab308", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>+₦{Math.round(vendor.revenue * 0.15).toLocaleString()} ours</span>
                          </div>
                        </div>
                        <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.max(pct, 2)}%`, background: vendor.name === "Pearl's Cuisine" ? "linear-gradient(90deg, #eab308, #ca8a04)" : "linear-gradient(90deg, #22c55e, #4ade80)", borderRadius: 3 }} />
                        </div>
                        <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 3 }}>{pct}% of total revenue</p>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default SummaryDashboard;
