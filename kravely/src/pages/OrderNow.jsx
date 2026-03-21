import { useState } from "react";
import { Link } from "react-router-dom";

// ===================== LOGIN PROMPT POPUP =====================
function LoginPrompt({ onClose }) {
  return (
    <>
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .popup-overlay { animation: fadeInOverlay 0.2s ease both; }
        .popup-card { animation: popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      {/* Overlay */}
      <div
        className="popup-overlay"
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }}
      >
        {/* Card */}
        <div
          className="popup-card"
          onClick={e => e.stopPropagation()}
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 28, padding: "36px 32px",
            width: "100%", maxWidth: 400,
            textAlign: "center",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.1)",
          }}
        >
          {/* Icon */}
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px", fontSize: 28,
          }}>🔐</div>

          {/* Text */}
          <h3 style={{
            color: "#fff", fontFamily: "'Syne', sans-serif",
            fontWeight: 900, fontSize: 22, marginBottom: 10, letterSpacing: -0.5,
          }}>
            Login to order food
          </h3>
          <p style={{
            color: "#6b7280", fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, lineHeight: 1.7, marginBottom: 28,
          }}>
            You need a Kravely account to place an order. It's free and takes less than a minute!
          </p>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link
              to="/signup"
              style={{
                background: "#22c55e", color: "#000",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 800,
                fontSize: 15, padding: "14px", borderRadius: 14,
                textDecoration: "none", display: "block",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Create Free Account 🚀
            </Link>
            <Link
              to="/login"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: 15, padding: "14px",
                borderRadius: 14, textDecoration: "none", display: "block",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)"; e.currentTarget.style.color = "#22c55e"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
            >
              Sign In →
            </Link>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", color: "#4b5563",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13,
              cursor: "pointer", marginTop: 20, transition: "color 0.2s",
            }}
            onMouseEnter={e => e.target.style.color = "#fff"}
            onMouseLeave={e => e.target.style.color = "#4b5563"}
          >
            Maybe later
          </button>

        </div>
      </div>
    </>
  );
}

// ===================== TOP NAVBAR =====================
function AppNavbar({ onOrderClick }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(0,0,0,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      padding: "12px 20px",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 900,
            fontSize: 22, letterSpacing: -1,
            background: "linear-gradient(90deg, #22c55e, #4ade80)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Kravely</span>
        </Link>

        {/* Location */}
        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer",
          color: "#d1fae5", flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>FUTO Campus</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>

        {/* Search */}
        <div style={{ flex: 1, position: "relative" }}>
          <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
            width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            style={{
              width: "100%", background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 50,
              padding: "10px 18px 10px 42px", color: "#fff",
              fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: "none",
            }}
            placeholder="Search vendors, meals..."
            onFocus={e => { e.target.style.borderColor = "rgba(34,197,94,0.4)"; e.target.style.background = "rgba(34,197,94,0.04)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
          />
        </div>

        {/* Cart */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            onClick={onOrderClick}
            style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.1)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
          </button>
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "#22c55e", color: "#000", fontSize: 9, fontWeight: 800,
            width: 16, height: 16, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', sans-serif",
          }}>0</span>
        </div>

        {/* Profile */}
        <button
          onClick={onOrderClick}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(34,197,94,0.1)"; e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>

      </div>
    </nav>
  );
}

// ===================== CATEGORIES =====================
function Categories({ active, setActive }) {
  const categories = [
    { id: "all", label: "All", icon: "🍽️" },
    { id: "local", label: "Local Meals", icon: "🍲" },
    { id: "rice", label: "Rice Dishes", icon: "🍚" },
    { id: "soups", label: "Soups", icon: "🍜" },
    { id: "snacks", label: "Snacks", icon: "🥪" },
    { id: "drinks", label: "Drinks", icon: "🥤" },
    { id: "combos", label: "Combos", icon: "🍱" },
  ];

  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <div style={{ display: "flex", gap: 10, minWidth: "max-content", padding: "0 4px" }}>
        {categories.map(({ id, label, icon }) => (
          <button key={id} onClick={() => setActive(id)} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 18px", borderRadius: 50, border: "none",
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 13, whiteSpace: "nowrap",
            transition: "all 0.25s ease",
            background: active === id ? "#22c55e" : "rgba(255,255,255,0.05)",
            color: active === id ? "#000" : "rgba(255,255,255,0.6)",
            boxShadow: active === id ? "0 4px 16px rgba(34,197,94,0.3)" : "none",
            transform: active === id ? "scale(1.04)" : "scale(1)",
          }}>
            <span style={{ fontSize: 15 }}>{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===================== PROMO BANNERS =====================
function PromoBanners({ onOrderClick }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
      {[
        { title: "Free delivery today!", subtitle: "On your first order 🎉", bg: "linear-gradient(135deg, #14532d, #166634, #15803d)", emoji: "🍔", accent: "#22c55e" },
        { title: "Vendor of the week", subtitle: "Mama Nkechi's Kitchen 🍲", bg: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)", emoji: "⭐", accent: "#60a5fa" },
      ].map(({ title, subtitle, bg, emoji, accent }) => (
        <div key={title} style={{
          background: bg, borderRadius: 20, padding: "24px 28px",
          position: "relative", overflow: "hidden", cursor: "pointer",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          <div style={{ position: "absolute", right: -10, top: -10, fontSize: 80, opacity: 0.15 }}>{emoji}</div>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 6 }}>{title}</h3>
          <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>{subtitle}</p>
          <button onClick={onOrderClick} style={{
            marginTop: 16, background: accent, color: "#000",
            border: "none", borderRadius: 50, padding: "8px 20px",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: 13, cursor: "pointer",
          }}>Order Now →</button>
        </div>
      ))}
    </div>
  );
}

// ===================== VENDOR CARD =====================
function VendorCard({ vendor, onOrderClick }) {
  const { name, tag, rating, time, emoji, open } = vendor;

  return (
    <div style={{
      background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 20, overflow: "hidden", cursor: "pointer",
      transition: "all 0.3s ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(34,197,94,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Image */}
      <div style={{
        height: 140, background: "linear-gradient(135deg, #0f1f0f, #1a2e1a)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 56, position: "relative",
      }}>
        {emoji}
        {!open && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, background: "rgba(0,0,0,0.8)", padding: "4px 12px", borderRadius: 50 }}>Closed</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>{name}</h3>
          <span style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "3px 8px", borderRadius: 50, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", flexShrink: 0, marginLeft: 8 }}>⭐ {rating}</span>
        </div>
        <p style={{ color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>{tag}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#4b5563", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>🕐 {time}</span>
          {/* ✅ ORDER BUTTON → triggers login popup */}
          <button
            onClick={() => open && onOrderClick()}
            style={{
              background: open ? "#22c55e" : "rgba(255,255,255,0.06)",
              color: open ? "#000" : "#4b5563",
              border: "none", borderRadius: 50, padding: "7px 16px",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
              fontSize: 12, cursor: open ? "pointer" : "default",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (open) e.currentTarget.style.background = "#16a34a"; }}
            onMouseLeave={e => { if (open) e.currentTarget.style.background = "#22c55e"; }}
          >
            {open ? "Order" : "Closed"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== MAIN ORDER NOW PAGE =====================
function OrderNow() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const vendors = [
    { id: 1, name: "Mama Nkechi's Kitchen", tag: "Local Delicacies", rating: "4.8", time: "15–25 min", emoji: "🍲", category: "local", open: true },
    { id: 2, name: "Chukwu's Grill Spot", tag: "Grills & Suya", rating: "4.6", time: "20–30 min", emoji: "🔥", category: "local", open: true },
    { id: 3, name: "Campus Bites", tag: "Snacks & Fast Food", rating: "4.5", time: "10–15 min", emoji: "🥪", category: "snacks", open: true },
    { id: 4, name: "Owerri Rice Palace", tag: "Rice Dishes", rating: "4.9", time: "25–35 min", emoji: "🍚", category: "rice", open: true },
    { id: 5, name: "FreshJuice Hub", tag: "Drinks & Smoothies", rating: "4.7", time: "5–10 min", emoji: "🥤", category: "drinks", open: false },
    { id: 6, name: "Pepper Soup Corner", tag: "Soups & Stews", rating: "4.8", time: "20–30 min", emoji: "🍜", category: "soups", open: true },
    { id: 7, name: "Combo King", tag: "Combo Meals", rating: "4.5", time: "20–30 min", emoji: "🍱", category: "combos", open: true },
    { id: 8, name: "Jollof Junction", tag: "Rice & Stew", rating: "4.7", time: "15–20 min", emoji: "🍛", category: "rice", open: true },
  ];

  const filtered = activeCategory === "all" ? vendors : vendors.filter(v => v.category === activeCategory);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dash-anim { animation: fadeInUp 0.5s ease both; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.2); border-radius: 4px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#000" }}>

        {/* Login popup */}
        {showLoginPrompt && <LoginPrompt onClose={() => setShowLoginPrompt(false)} />}

        {/* Navbar */}
        <AppNavbar onOrderClick={() => setShowLoginPrompt(true)} />

        {/* Content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px 80px" }}>

          {/* Greeting */}
          <div className="dash-anim" style={{ marginBottom: 28 }}>
            <p style={{ color: "#6b7280", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Good day 👋</p>
            <h1 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(24px, 4vw, 36px)", letterSpacing: -1, marginTop: 4 }}>
              What are you craving<br />
              <span style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>today?</span>
            </h1>
          </div>

          {/* Promo banners */}
          <div className="dash-anim" style={{ marginBottom: 32, animationDelay: "0.1s" }}>
            <PromoBanners onOrderClick={() => setShowLoginPrompt(true)} />
          </div>

          {/* Categories */}
          <div className="dash-anim" style={{ marginBottom: 28, animationDelay: "0.2s" }}>
            <Categories active={activeCategory} setActive={setActiveCategory} />
          </div>

          {/* Vendors heading */}
          <div className="dash-anim" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, animationDelay: "0.3s" }}>
            <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>
              {activeCategory === "all" ? "All Vendors" : `${filtered.length} Vendor${filtered.length !== 1 ? "s" : ""} found`}
            </h2>
            <button style={{
              background: "none", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 50, padding: "6px 16px", color: "#6b7280",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; e.currentTarget.style.color = "#22c55e"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#6b7280"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filter
            </button>
          </div>

          {/* Vendor grid */}
          {filtered.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
              {filtered.map((vendor, i) => (
                <div key={vendor.id} style={{ animation: `fadeInUp 0.5s ease ${i * 0.06}s both` }}>
                  <VendorCard vendor={vendor} onOrderClick={() => setShowLoginPrompt(true)} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
              <p style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif", fontSize: 16 }}>No vendors in this category yet</p>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default OrderNow;
