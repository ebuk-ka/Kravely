import { useEffect, useMemo, useState } from "react";

export default function SummaryDashboard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const summaryData = useMemo(() => ({
    users: 182,
    vendors: 38,
    activeOrders: 26,
    totalRevenue: 1265000,
    riders: 14,
    riderOnline: 9,
    pendingApprovals: 7,
    ordersInQueue: 18,
    revenueChange: "+3.4%",
  }), []);

  const sectionStyle = {
    background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.9) 100%)",
    border: "1px solid rgba(34,197,94,0.3)",
    borderRadius: 16,
    padding: 20,
    minWidth: 240,
    color: "#e2e8f0",
    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "default",
  };

  const hoverStyle = {
    transform: "translateY(-4px)",
    boxShadow: "0 20px 60px rgba(34,197,94,0.2)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%)", color: "#fff", padding: "clamp(16px, 4vw, 32px) clamp(12px, 3vw, 28px)", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        @keyframes slideInUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 20px rgba(34,197,94,0.1); } 50% { box-shadow: 0 0 32px rgba(34,197,94,0.5); } 100% { box-shadow: 0 0 20px rgba(34,197,94,0.1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .shimmer-header { background: linear-gradient(90deg, #22c55e, #4ade80, #22c55e); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 4s linear infinite; }
        .section-card { animation: slideInUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .section-card:nth-child(1) { animation-delay: 0.1s; }
        .section-card:nth-child(2) { animation-delay: 0.2s; }
        .section-card:nth-child(3) { animation-delay: 0.3s; }
        .section-card:nth-child(4) { animation-delay: 0.4s; }
        .section-card:nth-child(5) { animation-delay: 0.5s; }
        .section-card:nth-child(6) { animation-delay: 0.6s; }
        .section-card:nth-child(7) { animation-delay: 0.7s; }
        .section-card:nth-child(8) { animation-delay: 0.8s; }
        .section-card:nth-child(9) { animation-delay: 0.9s; }
        .pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 24px 72px rgba(34,197,94,0.3); }
        .progress-bar { background: rgba(34,197,94,0.2); border-radius: 4px; height: 8px; margin-top: 8px; overflow: hidden; }
        .progress-fill { background: linear-gradient(90deg, #22c55e, #4ade80); height: 100%; border-radius: 4px; transition: width 1s ease; }
      `}</style>

      <header style={{ marginBottom: "clamp(20px, 5vw, 32px)", padding: "clamp(16px, 3vw, 28px)", borderRadius: "clamp(16px, 3vw, 20px)", border: "2px solid rgba(34,197,94,0.4)", boxShadow: "0 18px 50px rgba(0,0,0,0.6)", background: "linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(15,23,42,0.8) 100%)", display: "flex", flexDirection: "column", gap: "clamp(16px, 3vw, 24px)", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(12px, 3vw, 16px)", width: "100%" }}>
          <img src="/src/assets/images/kravely.logo.png" alt="Kravely Logo" style={{ height: "clamp(40px, 8vw, 60px)", marginRight: "clamp(8px, 2vw, 16px)", flexShrink: 0, filter: "drop-shadow(0 0 10px rgba(34,197,94,0.5))" }} />
          <div style={{ minWidth: 0 }}>
            <h1 style={{ margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: "clamp(24px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.1, wordWrap: "break-word" }}>Kravely <span className="shimmer-header">Executive</span> Insight</h1>
            <p style={{ margin: "4px 0 0 0", color: "#22c55e", fontFamily: "'Inter', sans-serif", fontSize: "clamp(12px, 3vw, 16px)", fontWeight: 500 }}>Nimi's Strategic Overview</p>
          </div>
        </div>
        <div style={{ width: "100%", textAlign: "left" }}>
          <p style={{ margin: 0, color: "#cbd5e1", fontFamily: "'Inter', sans-serif", fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 400 }}>Real-time Performance Monitor</p>
          <p style={{ margin: "4px 0 0 0", color: "#22c55e", fontFamily: "'Inter', sans-serif", fontSize: "clamp(12px, 2.5vw, 14px)", fontWeight: 500 }}>{`Refreshed: ${now.toLocaleTimeString()}`}</p>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(180px, 100%, 260px), 1fr))", gap: "clamp(12px, 3vw, 20px)", marginBottom: "clamp(20px, 5vw, 32px)" }}>
        <Card className="section-card pulse-glow card-hover" title="👥 Total Users" value={summaryData.users} color="#38bdf8" style={sectionStyle} />
        <Card className="section-card card-hover" title="🏪 Vendors" value={summaryData.vendors} color="#22c55e" style={sectionStyle} />
        <Card className="section-card card-hover" title="📦 Active Orders" value={summaryData.activeOrders} color="#facc15" style={sectionStyle} />
        <Card className="section-card card-hover" title="💰 Revenue (₦)" value={`₦${summaryData.totalRevenue.toLocaleString()}`} color="#fb7185" style={sectionStyle} />
        <Card className="section-card card-hover" title="🏍️ Riders Total" value={summaryData.riders} color="#a78bfa" style={sectionStyle} />
        <Card className="section-card card-hover" title="🟢 Riders Online" value={summaryData.riderOnline} color="#22c55e" style={sectionStyle} progress={(summaryData.riderOnline / summaryData.riders) * 100} />
        <Card className="section-card card-hover" title="⏳ Pending Approvals" value={summaryData.pendingApprovals} color="#f97316" style={sectionStyle} />
        <Card className="section-card card-hover" title="📋 Orders In Queue" value={summaryData.ordersInQueue} color="#38bdf8" style={sectionStyle} />
        <Card className="section-card card-hover" title="📈 Revenue Velocity" value={summaryData.revenueChange} color="#34d399" style={sectionStyle} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(240px, 100%, 500px), 1fr))", gap: "clamp(16px, 4vw, 24px)" }}>
        <section style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "clamp(12px, 3vw, 16px)", padding: "clamp(16px, 3vw, 24px)", boxShadow: "0 12px 36px rgba(0,0,0,0.4)", animation: "fadeIn 1s ease" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", color: "#22c55e", marginBottom: "clamp(12px, 2vw, 16px)", fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 600 }}>Live Market Highlights</h2>
          <ul style={{ margin: 0, paddingLeft: "clamp(16px, 3vw, 20px)", color: "#cbd5e1", fontFamily: "'Inter', sans-serif", lineHeight: 1.8, fontSize: "clamp(13px, 2.5vw, 15px)" }}>
            <li>✅ New vendor approved: "Mama Suya Spot" (22m ago)</li>
            <li>📈 24h order volume spike: +8% (09:00–10:00)</li>
            <li>🏍️ Rider availability: 9/14 online, 5 on break</li>
            <li>⚡ System SLA: 92% delivered within 30m</li>
          </ul>
        </section>

        <section style={{ background: "linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: "clamp(12px, 3vw, 16px)", padding: "clamp(16px, 3vw, 24px)", boxShadow: "0 12px 36px rgba(0,0,0,0.4)", animation: "fadeIn 1s ease" }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", color: "#22c55e", marginBottom: "clamp(12px, 2vw, 16px)", fontSize: "clamp(18px, 4vw, 24px)", fontWeight: 600 }}>Key Performance Indicators</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 2.5vw, 16px)" }}>
            <div>
              <p style={{ margin: 0, color: "#cbd5e1", fontFamily: "'Inter', sans-serif", fontSize: "clamp(12px, 2.5vw, 14px)" }}>Rider Utilization</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(summaryData.riderOnline / summaryData.riders) * 100}%` }}></div>
              </div>
              <p style={{ margin: "4px 0 0 0", color: "#22c55e", fontSize: "clamp(10px, 2vw, 12px)" }}>{summaryData.riderOnline}/{summaryData.riders} active</p>
            </div>
            <div>
              <p style={{ margin: 0, color: "#cbd5e1", fontFamily: "'Inter', sans-serif", fontSize: "clamp(12px, 2.5vw, 14px)" }}>Order Fulfillment Rate</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: "92%" }}></div>
              </div>
              <p style={{ margin: "4px 0 0 0", color: "#22c55e", fontSize: "clamp(10px, 2vw, 12px)" }}>92% within 30min</p>
            </div>
          </div>
        </section>
      </div>

      <footer style={{ marginTop: "clamp(20px, 5vw, 32px)", textAlign: "center", color: "#94a3b8", fontFamily: "'Inter', sans-serif", fontSize: "clamp(11px, 2.5vw, 14px)", fontWeight: 400 }}>
        <p style={{ margin: 0 }}>Executive Read-Only Dashboard • Nimi's Strategic View • Auto-refresh every minute</p>
      </footer>
    </div>
  );
}

function Card({ title, value, color, style, progress }) {
  return (
    <div style={{ ...style, borderColor: color }} className="card-hover">
      <h3 style={{ margin: "0 0 clamp(6px, 2vw, 10px) 0", color, fontFamily: "'Poppins', sans-serif", fontSize: "clamp(12px, 3vw, 16px)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: "clamp(20px, 5vw, 32px)", fontWeight: 800, color: "#fff", fontFamily: "'Poppins', sans-serif" }}>{value}</p>
      {progress !== undefined && (
        <div className="progress-bar" style={{ marginTop: 12 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
}