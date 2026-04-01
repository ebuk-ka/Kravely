import { useState } from "react";
import { Link } from "react-router-dom";

const SAMPLE_RIDERS = [
  { id: "RDR-001", name: "Adaeze Nwankwo", status: "available", location: "Ikeja" },
  { id: "RDR-002", name: "Tunde Bakare", status: "on-duty", location: "Gbagada" },
  { id: "RDR-003", name: "Amir Bello", status: "offline", location: "Magodo" },
];

const SAMPLE_ASSIGNMENTS = [
  { orderId: "KRV-001", customer: "Chidi Okafor", vendor: "Pearl's Cuisine", total: 3900, eta: "15 min", status: "picked" },
  { orderId: "KRV-002", customer: "Amaka Eze", vendor: "Jollof Hub", total: 2300, eta: "23 min", status: "pending" },
];

export default function RiderDashboard() {
  const [riders, setRiders] = useState(SAMPLE_RIDERS);
  const [assignments, setAssignments] = useState(SAMPLE_ASSIGNMENTS);
  const [selectedRider, setSelectedRider] = useState(riders[0].id);

  const updateRiderStatus = (riderId, nextStatus) => {
    setRiders(prev => prev.map(r => r.id === riderId ? { ...r, status: nextStatus } : r));
  };

  const assignToRider = (orderId, riderId) => {
    const rider = riders.find(r => r.id === riderId);
    if (!rider) return;

    setAssignments(prev => prev.map(item => (item.orderId === orderId ? { ...item, rider: rider.name } : item)));
  };

  const activeRider = riders.find(r => r.id === selectedRider);

  return (
    <div style={{ minHeight: "100vh", background: "#050505", color: "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(148,163,184,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: 28 }}>Rider Dashboard</h1>
        <Link to="/admin/dashboard" style={{ textDecoration: "none", color: "#22c55e", fontWeight: 600 }}>Back to Admin</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "16px", padding: "20px" }}>
        <div style={{ gridColumn: "span 4", background: "rgba(15,23,42,0.75)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 14, padding: 16 }}>
          <h2 style={{ margin: "0 0 12px 0", color: "#22c55e" }}>Rider Fleet</h2>
          <select value={selectedRider} onChange={e => setSelectedRider(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "1px solid rgba(148,163,184,0.25)", background: "#0b1120", color: "#fff" }}>
            {riders.map(r => <option key={r.id} value={r.id}>{r.name} ({r.status})</option>)}
          </select>

          <div style={{ marginTop: "18px" }}>
            <p style={{ margin: "0 0 8px 0", color: "#94a3b8" }}>Status</p>
            <p style={{ margin: 0, fontWeight: 700 }}>{activeRider?.status || "unassigned"}</p>
            <p style={{ margin: "4px 0 0 0", color: "#94a3b8" }}>Location: {activeRider?.location || "Unknown"}</p>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            { ["available", "on-duty", "offline"].map(s => (
              <button key={s} onClick={() => updateRiderStatus(selectedRider, s)} style={{ flex: 1, padding: 8, borderRadius: 8, border: "none", background: activeRider?.status === s ? "#22c55e" : "rgba(148,163,184,0.15)", color: "#fff", cursor: "pointer" }}>{s}</button>
            )) }
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3 style={{ margin: "0 0 10px 0", color: "#38bdf8" }}>Quick Rider Stats</h3>
            <ul style={{ margin: 0, paddingLeft: "18px", color: "#cbd5e1" }}>
              <li>Fleet size: {riders.length}</li>
              <li>Available: {riders.filter(r => r.status === "available").length}</li>
              <li>On duty: {riders.filter(r => r.status === "on-duty").length}</li>
              <li>Offline: {riders.filter(r => r.status === "offline").length}</li>
            </ul>
          </div>
        </div>

        <div style={{ gridColumn: "span 8", background: "rgba(15,23,42,0.75)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 14, padding: 16 }}>
          <h2 style={{ margin: "0 0 14px 0", color: "#22c55e" }}>Assigned Orders</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {assignments.map(order => (
              <div key={order.orderId} style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(148,163,184,0.25)", borderRadius: 12, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h4 style={{ margin: 0, fontFamily: "'Syne', sans-serif", fontSize: 16 }}>{order.orderId}</h4>
                  <span style={{ color: order.status === "picked" ? "#22c55e" : "#f97316", fontWeight: 700 }}>{order.status}</span>
                </div>
                <p style={{ margin: "4px 0 2px 0", color: "#94a3b8" }}>{order.customer} → {order.vendor}</p>
                <p style={{ margin: "0 0 6px 0", color: "#cbd5e1" }}>ETA: {order.eta} • ₦{order.total}</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <select value={order.rider || ""} onChange={e => assignToRider(order.orderId, e.target.value)} style={{ flex: 1, padding: "8px", borderRadius: 8, background: "#0f172a", color: "#fff", border: "1px solid rgba(148,163,184,0.2)" }}>
                    <option value="">Assign rider</option>
                    {riders.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                  <button onClick={() => assignToRider(order.orderId, selectedRider)} style={{ padding: "8px 12px", background: "#22c55e", color: "#000", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>Push to {activeRider?.name}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
