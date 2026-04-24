import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  Activity,
  BarChart3,
  Building2,
  Crown,
  Eye,
  Loader2,
  RefreshCw,
  ShoppingCart,
  Users,
  Wallet,
  Clock3,
  CircleDot,
  Package,
  TrendingUp,
  BadgeDollarSign,
  Store,
  Trophy,
} from "lucide-react";
import { useStats, useAllOrders, useAllVendors, fmt, STATUS_STYLE } from "../hooks/useKravelyData";

// ─── CEO SUMMARY ACCESS CONTROL ──────────────────────────────
// Put the emails or Supabase auth user IDs of people allowed to view this page.
// Recommended: use user IDs for stronger control, but emails are okay for quick setup.

const ALLOWED_SUMMARY_USER_IDS = [
  "okoloebuka756@gmail.com",
  "nimigeorge400@gmail.com"
];

function canViewSummary(user) {
  const email = user?.email?.toLowerCase();
  const id = user?.id;

  return (
    ALLOWED_SUMMARY_EMAILS.map((e) => e.toLowerCase()).includes(email) ||
    ALLOWED_SUMMARY_USER_IDS.includes(id)
  );
}


function Badge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.inactive;
  return (
    <span
      style={{
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        fontSize: 10,
        fontWeight: 700,
        padding: "3px 9px",
        borderRadius: 50,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, pulse }) {
  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 18,
        padding: "18px 20px",
        position: "relative",
      }}
    >
      {pulse && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: color,
            animation: "livePulse 2s infinite",
          }}
        />
      )}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
          background: `${color}16`,
          border: `1px solid ${color}26`,
        }}
      >
        <Icon size={20} color={color} />
      </div>
      <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 5 }}>{label}</p>
      <p style={{ color, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(16px, 3vw, 24px)", letterSpacing: -1 }}>{value}</p>
      {sub && <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 3 }}>{sub}</p>}
    </div>
  );
}

function SummaryDashboardContent() {
  const [activeSection, setActiveSection] = useState("overview");
  const [countdown, setCountdown] = useState(60);

  const { stats, loading: sL, refetch: refetchStats } = useStats();
  const { orders, loading: oL, refetch: refetchOrders } = useAllOrders();
  const { vendors, loading: vL } = useAllVendors();

  const loading = sL || oL || vL;
  const toN = (v) => fmt.naira(Math.round((v || 0) / 100));

  useEffect(() => {
    const countInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refetchStats();
          refetchOrders();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countInterval);
  }, [refetchStats, refetchOrders]);

  const sections = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "orders", label: "Live Orders", icon: ShoppingCart },
    { id: "vendors", label: "Vendors", icon: Building2 },
    { id: "revenue", label: "Revenue", icon: Wallet },
  ];

  const topVendors = [...vendors].sort((a, b) => (b.total_revenue || 0) - (a.total_revenue || 0)).slice(0, 6);
  const totalGMV = Math.round((stats.totalRevenue || 0) / 100);

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes livePulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        @keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
        .sec-content { animation: fadeInUp 0.35s ease both; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#000" }}>
        <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 18, color: "#000" }}>K</span>
              </div>
            </Link>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15 }}>Kravely</p>
              <p style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>CEO SUMMARY · READ ONLY</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 50, padding: "5px 12px" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "livePulse 2s infinite" }} />
                <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700 }}>LIVE</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 50, padding: "5px 12px" }}>
                <Clock3 size={12} color="#6b7280" />
                <span style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>Refreshes in {countdown}s</span>
              </div>
              <button onClick={() => { refetchStats(); refetchOrders(); setCountdown(60); }} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 50, padding: "6px 14px", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: 50, background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Crown size={16} color="#fff" />
              </div>
              <div>
                <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13 }}>Nimi George</p>
                <p style={{ color: "#7c3aed", fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700 }}>CEO & Co-founder</p>
              </div>
            </div>
          </div>

          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 10px", display: "flex", gap: 6, overflowX: "auto" }}>
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ padding: "8px 16px", borderRadius: 50, border: activeSection === s.id ? "1px solid rgba(34,197,94,0.25)" : "1px solid transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, background: activeSection === s.id ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.03)", color: activeSection === s.id ? "#22c55e" : "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, transition: "all 0.2s" }}>
                  <Icon size={14} /> {s.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div style={{ background: "rgba(124,58,237,0.08)", borderBottom: "1px solid rgba(124,58,237,0.2)", padding: "8px 20px", textAlign: "center" }}>
          <span style={{ color: "#a78bfa", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}><Eye size={13} /> View-only mode — This dashboard is for monitoring only. Contact Ebuka to make changes.</span>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "22px 20px 80px" }}>
          <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 18, textAlign: "right", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 6 }}>
            {loading ? <><RefreshCw size={12} /> Fetching live data from Supabase...</> : `Last updated: ${new Date().toLocaleTimeString("en-NG")}`}
          </p>

          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0", flexDirection: "column", gap: 12 }}>
              <Loader2 size={32} color="#6b7280" style={{ animation: "spin 1s linear infinite" }} />
              <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Loading live data...</p>
            </div>
          ) : (
            <div className="sec-content" key={activeSection}>
              {activeSection === "overview" && (
                <div>
                  <div style={{ background: "linear-gradient(135deg, #0d0d1a, #13103d)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 22, padding: "24px 26px", marginBottom: 22, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", right: -20, top: -20, opacity: 0.06 }}><Crown size={96} color="#fff" /></div>
                    <p style={{ color: "#a78bfa", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}><Crown size={14} /> Good day, Nimi</p>
                    <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(18px, 3vw, 28px)", letterSpacing: -1, marginBottom: 14 }}>
                      Here's how Kravely is doing <span style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>right now.</span>
                    </h2>
                    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                      {[[toN(stats.kravelyCut), "Total Kravely earnings"], [toN(stats.todayCut), "Earned today"], [stats.totalOrders + " orders", "All time"], [stats.deliveryRate + "%", "Success rate"]].map(([v, l]) => (
                        <div key={l}><p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 18 }}>{v}</p><p style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{l}</p></div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 13, marginBottom: 22 }}>
                    <StatCard icon={Wallet} label="Total Revenue" value={toN(stats.totalRevenue)} color="#22c55e" pulse />
                    <StatCard icon={TrendingUp} label="Today Revenue" value={toN(stats.todayRevenue)} sub={`${stats.todayOrders} orders`} color="#4ade80" pulse />
                    <StatCard icon={BadgeDollarSign} label="Our Cut (15%)" value={toN(stats.kravelyCut)} color="#eab308" />
                    <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} sub={`${stats.todayOrders} today`} color="#60a5fa" />
                    <StatCard icon={Activity} label="Active Now" value={stats.activeOrders} color="#f97316" pulse />
                    <StatCard icon={Users} label="Total Users" value={stats.totalUsers} sub={`+${stats.newUsersToday} today`} color="#a78bfa" />
                    <StatCard icon={Store} label="Active Vendors" value={`${stats.activeVendors}/${stats.totalVendors}`} color="#22c55e" />
                    <StatCard icon={Package} label="Delivery Rate" value={`${stats.deliveryRate}%`} color="#4ade80" />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
                    <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "18px 20px" }}>
                      <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><CircleDot size={15} color="#f97316" /> Latest Orders</h3>
                      {orders.slice(0, 5).map((o) => (
                        <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 8 }}>
                          <div><p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>{o.student?.full_name || "Student"}</p><p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{o.vendor?.name || "—"} · {fmt.time(o.placed_at)}</p></div>
                          <div style={{ textAlign: "right" }}><p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>{toN(o.total_amount)}</p><Badge status={o.status} /></div>
                        </div>
                      ))}
                      {orders.length === 0 && <p style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center", padding: "16px 0" }}>No orders yet</p>}
                    </div>

                    <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "18px 20px" }}>
                      <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 15, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><Trophy size={15} color="#eab308" /> Vendor Leaderboard</h3>
                      {topVendors.map((v, i) => (
                        <div key={v.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 8 }}>
                          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 14, color: i === 0 ? "#eab308" : i === 1 ? "#9ca3af" : "#cd7c2f", width: 22 }}>#{i + 1}</span>
                          <div style={{ flex: 1 }}><p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13 }}>{v.name}</p><p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{v.total_orders} orders · {v.rating || 0} rating</p></div>
                          <p style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>{toN(v.total_revenue)}</p>
                        </div>
                      ))}
                      {topVendors.length === 0 && <p style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center", padding: "16px 0" }}>No vendors yet</p>}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "orders" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 13, marginBottom: 22 }}>
                    {[["Active Now", stats.activeOrders, "#f97316"], ["Today's Orders", stats.todayOrders, "#60a5fa"], ["Today Revenue", toN(stats.todayRevenue), "#22c55e"], ["Today's Cut", toN(stats.todayCut), "#eab308"]].map(([l, v, c]) => (
                      <div key={l} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 18px", flex: 1, minWidth: 130 }}>
                        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 5 }}>{l}</p>
                        <p style={{ color: c, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20 }}>{v}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, overflow: "auto" }}>
                    <div style={{ minWidth: 560 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 100px 100px", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                        {["Order #", "Customer", "Vendor", "Amount", "Status"].map((h) => <span key={h} style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{h}</span>)}
                      </div>
                      {orders.length === 0 ? <p style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center", padding: "30px 0" }}>No orders yet</p> : orders.map((o, i) => (
                        <div key={o.id} style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 100px 100px", padding: "12px 16px", borderBottom: i < orders.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
                          <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12 }}>{o.order_number}</span>
                          <div><p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{o.student?.full_name || "—"}</p><p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{fmt.time(o.placed_at)}</p></div>
                          <span style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{o.vendor?.name || "—"}</span>
                          <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>{toN(o.total_amount)}</span>
                          <Badge status={o.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "vendors" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 13, marginBottom: 22 }}>
                    {[["Active", stats.activeVendors, "#22c55e"], ["Total", stats.totalVendors, "#6b7280"], ["Top Vendor", vendors[0]?.name?.split("'")[0] || "—", "#eab308"]].map(([l, v, c]) => (
                      <div key={l} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 16px" }}>
                        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 6 }}>{l}</p>
                        <p style={{ color: c, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {vendors.map((v, i) => (
                      <div key={v.id} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 15, color: i === 0 ? "#eab308" : "#374151", width: 26 }}>#{i + 1}</span>
                        <div style={{ flex: 1, minWidth: 120 }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                            <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14 }}>{v.name}</p>
                            {v.is_featured && <span style={{ background: "rgba(234,179,8,0.15)", color: "#eab308", fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>Featured</span>}
                          </div>
                          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{v.category} · {v.rating || 0} rating · {v.is_active ? "Active" : "Inactive"}</p>
                        </div>
                        <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                          {[["Orders", v.total_orders], ["Revenue", toN(v.total_revenue)], ["Our Cut", toN(Math.round((v.total_revenue || 0) * ((v.commission_rate || 15) / 100))) ]].map(([l, val]) => (
                            <div key={l} style={{ textAlign: "center" }}><p style={{ color: l === "Our Cut" ? "#eab308" : "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14 }}>{val}</p><p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{l}</p></div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {vendors.length === 0 && <p style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center", padding: "30px 0" }}>No vendors yet</p>}
                  </div>
                </div>
              )}

              {activeSection === "revenue" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 13, marginBottom: 22 }}>
                    {[["Total GMV", toN(stats.totalRevenue), "#22c55e", "All vendor sales"], ["Kravely (15%)", toN(stats.kravelyCut), "#eab308", "Our commission"], ["Today GMV", toN(stats.todayRevenue), "#60a5fa", "Today's sales"], ["Today's Cut", toN(stats.todayCut), "#4ade80", "Today's commission"], ["Avg Order", toN(stats.avgOrderValue), "#f97316", "Per order"], ["Delivery Rate", `${stats.deliveryRate}%`, "#a78bfa", "Success rate"]].map(([l, v, c, d]) => (
                      <div key={l} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "16px 18px" }}>
                        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginBottom: 6 }}>{l}</p>
                        <p style={{ color: c, fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, marginBottom: 3 }}>{v}</p>
                        <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 11 }}>{d}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "20px 22px" }}>
                    <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Revenue by Vendor</h3>
                    {vendors.length === 0 ? <p style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif" }}>No data yet</p> : vendors.map((v) => {
                      const rev = Math.round((v.total_revenue || 0) / 100);
                      const pct = totalGMV > 0 ? Math.round((rev / totalGMV) * 100) : 0;
                      return (
                        <div key={v.id} style={{ marginBottom: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, flexWrap: "wrap", gap: 4 }}>
                            <span style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{v.name}</span>
                            <div style={{ display: "flex", gap: 10 }}>
                              <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700 }}>{toN(v.total_revenue)}</span>
                              <span style={{ color: "#eab308", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700 }}>+{toN(Math.round((v.total_revenue || 0) * ((v.commission_rate || 15) / 100)))} ours</span>
                            </div>
                          </div>
                          <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${Math.max(pct, 2)}%`, background: v.is_featured ? "linear-gradient(90deg, #eab308, #ca8a04)" : "linear-gradient(90deg, #22c55e, #4ade80)", borderRadius: 3 }} />
                          </div>
                          <p style={{ color: "#374151", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 3 }}>{pct}% · {v.total_orders} orders</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}


export default function SummaryDashboard() {
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let alive = true;

    async function checkAccess() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!alive) return;

      if (!session?.user) {
        setAuthLoading(false);
        navigate("/login");
        return;
      }

      const permitted = canViewSummary(session.user);
      setAllowed(permitted);
      setAuthLoading(false);

      if (!permitted) {
        navigate("/");
      }
    }

    checkAccess();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        navigate("/login");
        return;
      }

      const permitted = canViewSummary(session.user);
      setAllowed(permitted);

      if (!permitted) {
        navigate("/");
      }
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ textAlign: "center" }}>
          <Loader2 size={32} color="#22c55e" style={{ animation: "spin 1s linear infinite", marginBottom: 14 }} />
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
            Checking access…
          </p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return <SummaryDashboardContent />;
}
