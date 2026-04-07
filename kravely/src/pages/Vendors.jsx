import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Vendor data - easy to add more later
const VENDORS_DATA = [
  { id: 1, name: "Pearl's Cuisine", category: "Jumbo Orders", orders: 89, revenue: 412000, rating: 4.9, status: "active", featured: true, joinDate: "Jan 2025", image: "🍽️", route: "/pearls" },
  { id: 2, name: "Chrissy Cuisine", category: "Rice and Dishes", orders: 76, revenue: 182400, rating: 4.8, status: "active", featured: true, joinDate: "Feb 2025", image: "🥘", route: "/chrissy" },
  { id: 3, name: "Chukwu's Grill Spot", category: "Grills & Suya", orders: 54, revenue: 162000, rating: 4.6, status: "active", featured: false, joinDate: "Feb 2025", image: "🔥", route: null },
  { id: 4, name: "Campus Bites", category: "Snacks", orders: 43, revenue: 86000, rating: 4.5, status: "active", featured: false, joinDate: "Mar 2025", image: "🍿", route: null },
  { id: 5, name: "Owerri Rice Palace", category: "Rice Dishes", orders: 38, revenue: 114000, rating: 4.9, status: "active", featured: false, joinDate: "Mar 2025", image: "🍚", route: null },
  { id: 6, name: "Pepper Soup Corner", category: "Soups", orders: 29, revenue: 72500, rating: 4.8, status: "active", featured: false, joinDate: "Apr 2025", image: "🍲", route: null },
  { id: 7, name: "FreshJuice Hub", category: "Drinks", orders: 9, revenue: 18000, rating: 4.7, status: "inactive", featured: false, joinDate: "Apr 2025", image: "🥤", route: null },
  { id: 8, name: "Combo King", category: "Combos", orders: 4, revenue: 9600, rating: 4.5, status: "pending", featured: false, joinDate: "May 2025", image: "🍔", route: null },
];

const STATUS_COLORS = {
  active: { color: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.3)" },
  inactive: { color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)" },
  pending: { color: "#f97316", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.3)" },
};

function VendorCard({ vendor }) {
  const statusStyle = STATUS_COLORS[vendor.status] || STATUS_COLORS.pending;
  
  return (
    <div style={{
      background: "#0a0a0a",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 16,
      padding: 20,
      transition: "all 0.3s ease",
      cursor: "pointer"
    }} onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)";
      e.currentTarget.style.boxShadow = "0 0 20px rgba(34,197,94,0.1)";
    }} onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
      e.currentTarget.style.boxShadow = "none";
    }}>
      
      {/* Header with image and featured badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={{ fontSize: 48, marginRight: 12 }}>{vendor.image}</div>
        {vendor.featured && (
          <div style={{
            background: "rgba(34,197,94,0.2)",
            color: "#22c55e",
            padding: "4px 12px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif"
          }}>
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Vendor name */}
      <h3 style={{
        color: "#fff",
        fontSize: 18,
        fontWeight: 700,
        fontFamily: "'Syne', sans-serif",
        margin: "0 0 4px 0"
      }}>
        {vendor.name}
      </h3>

      {/* Category */}
      <p style={{
        color: "#9ca3af",
        fontSize: 13,
        fontFamily: "'DM Sans', sans-serif",
        margin: "0 0 16px 0"
      }}>
        {vendor.category}
      </p>

      {/* Status badge */}
      <div style={{
        display: "inline-block",
        background: statusStyle.bg,
        border: `1px solid ${statusStyle.border}`,
        color: statusStyle.color,
        padding: "6px 12px",
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        marginBottom: 16,
        textTransform: "capitalize"
      }}>
        {vendor.status}
      </div>

      {/* Stats grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 16,
        paddingTop: 16,
        borderTop: "1px solid rgba(255,255,255,0.05)"
      }}>
        <div>
          <p style={{ color: "#6b7280", fontSize: 11, fontFamily: "'DM Sans', sans-serif", margin: "0 0 4px 0" }}>Orders</p>
          <p style={{ color: "#fff", fontSize: 20, fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0 }}>
            {vendor.orders}
          </p>
        </div>
        <div>
          <p style={{ color: "#6b7280", fontSize: 11, fontFamily: "'DM Sans', sans-serif", margin: "0 0 4px 0" }}>Revenue</p>
          <p style={{ color: "#fff", fontSize: 20, fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0 }}>
            ₦{(vendor.revenue / 1000).toFixed(0)}k
          </p>
        </div>
        <div>
          <p style={{ color: "#6b7280", fontSize: 11, fontFamily: "'DM Sans', sans-serif", margin: "0 0 4px 0" }}>Rating</p>
          <p style={{ color: "#fff", fontSize: 20, fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: 0 }}>
            ⭐ {vendor.rating}
          </p>
        </div>
        <div>
          <p style={{ color: "#6b7280", fontSize: 11, fontFamily: "'DM Sans', sans-serif", margin: "0 0 4px 0" }}>Joined</p>
          <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
            {vendor.joinDate}
          </p>
        </div>
      </div>

      {/* Action button */}
      {vendor.status === "active" && vendor.route ? (
        <Link
          to={vendor.route}
          style={{
            width: "100%",
            background: "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: 50,
            padding: "10px 16px",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            cursor: "pointer",
            opacity: 1,
            transition: "all 0.3s ease",
            display: "block",
            textAlign: "center",
            textDecoration: "none"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#16a34a";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#22c55e";
          }}
        >
          View Menu
        </Link>
      ) : (
        <button style={{
          width: "100%",
          background: "#64748b",
          color: "#fff",
          border: "none",
          borderRadius: 50,
          padding: "10px 16px",
          fontSize: 14,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          cursor: "not-allowed",
          opacity: 0.5,
          transition: "all 0.3s ease"
        }}>
          Coming Soon
        </button>
      )}
    </div>
  );
}

export default function Vendors() {
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredVendors = filterStatus === "all" 
    ? VENDORS_DATA 
    : VENDORS_DATA.filter(v => v.status === filterStatus);

  const stats = {
    total: VENDORS_DATA.length,
    active: VENDORS_DATA.filter(v => v.status === "active").length,
    featured: VENDORS_DATA.filter(v => v.featured).length,
    totalRevenue: VENDORS_DATA.reduce((sum, v) => sum + v.revenue, 0)
  };

  return (
    <>
      <Navbar />
      
      {/* Hero section */}
      <section style={{ background: "#000", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1 style={{
            fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 900,
            fontFamily: "'Syne', sans-serif",
            color: "#fff",
            margin: "0 0 16px 0",
            letterSpacing: -2
          }}>
            Our Amazing Vendors
          </h1>
          <p style={{
            fontSize: "clamp(16px, 2vw, 20px)",
            color: "#9ca3af",
            fontFamily: "'DM Sans', sans-serif",
            margin: 0,
            maxWidth: 600,
            marginLeft: "auto",
            marginRight: "auto",
            lineHeight: 1.6
          }}>
            Quality food from trusted partners across Owerri. We carefully onboard vendors to ensure the best experience for our customers.
          </p>
        </div>
      </section>

      {/* Stats section */}
      <section style={{ background: "#0a0a0a", padding: "40px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20
          }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "0 0 8px 0" }}>Total Vendors</p>
              <p style={{ color: "#22c55e", fontSize: 32, fontWeight: 900, fontFamily: "'Syne', sans-serif", margin: 0 }}>{stats.total}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "0 0 8px 0" }}>Active</p>
              <p style={{ color: "#22c55e", fontSize: 32, fontWeight: 900, fontFamily: "'Syne', sans-serif", margin: 0 }}>{stats.active}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "0 0 8px 0" }}>Featured</p>
              <p style={{ color: "#22c55e", fontSize: 32, fontWeight: 900, fontFamily: "'Syne', sans-serif", margin: 0 }}>{stats.featured}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans', sans-serif", margin: "0 0 8px 0" }}>Total Revenue</p>
              <p style={{ color: "#22c55e", fontSize: 32, fontWeight: 900, fontFamily: "'Syne', sans-serif", margin: 0 }}>₦{(stats.totalRevenue / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter section */}
      <section style={{ background: "#000", padding: "40px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["all", "active", "inactive", "pending"].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  padding: "10px 20px",
                  borderRadius: 50,
                  border: `2px solid ${filterStatus === status ? "#22c55e" : "rgba(255,255,255,0.2)"}`,
                  background: filterStatus === status ? "rgba(34,197,94,0.1)" : "transparent",
                  color: filterStatus === status ? "#22c55e" : "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  textTransform: "capitalize"
                }}
              >
                {status === "all" ? "All Vendors" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Vendors grid */}
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24
          }}>
            {filteredVendors.map(vendor => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>

          {filteredVendors.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <p style={{ fontSize: 16, color: "#6b7280", fontFamily: "'DM Sans', sans-serif" }}>No vendors found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
