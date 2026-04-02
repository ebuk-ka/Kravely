import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function PearlsCuisine() {
  const [activeTab, setActiveTab] = useState("rice");
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  const addToCart = ({ id, name, price, size, emoji }) => {
    const logged = localStorage.getItem("kravely_logged_in") === "true";
    if (!logged) {
      navigate("/login");
      return;
    }

    const key = "kravely_cart";
    const current = localStorage.getItem(key);
    const cart = current ? JSON.parse(current) : [];
    const existing = cart.find(item => item.id === `${id}-${size}`);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: `${id}-${size}`, name: `${name} (${size})`, vendor: "Pearl's Cuisine", price, emoji, qty: 1 });
    }
    localStorage.setItem(key, JSON.stringify(cart));
    setToast(`${name} ( ${size} ) added to cart`);
    navigate("/order");
  };

  const menu = {
    rice: {
      label: "🍚 Rice",
      sizes: ["2L", "3L", "4L"],
      items: [
        { name: "Asun Rice",       prices: { "2L": 30000, "3L": 45000, "4L": 60000 } },
        { name: "Nigerian Jollof", prices: { "2L": 30000, "3L": 45000, "4L": 50000 } },
        { name: "Fried Rice",      prices: { "2L": 30000, "3L": 50000, "4L": 60000 } },
        { name: "Native Rice",     prices: { "2L": 30000, "3L": 45000, "4L": 50000 } },
        { name: "Coconut Rice",    prices: { "2L": 46000, "3L": 55000, "4L": 65000 } },
      ],
    },
    stew: {
      label: "🍖 Stew",
      sizes: ["2L", "3L", "4L"],
      items: [
        { name: "Chicken",   prices: { "2L": null,  "3L": 40500, "4L": 55000 } },
        { name: "Beef",      prices: { "2L": null,  "3L": 30000, "4L": 40000 } },
        { name: "Turkey",    prices: { "2L": null,  "3L": 45000, "4L": 55500 } },
        { name: "Goat Meat", prices: { "2L": null,  "3L": 40000, "4L": 47000 } },
        { name: "Fish Stew", prices: { "2L": null,  "3L": 35000, "4L": 40500 } },
      ],
    },
    pasta: {
      label: "🍝 Pasta",
      sizes: ["2L", "3L", "4L"],
      items: [
        { name: "Jollof Pasta",  prices: { "2L": 25000, "3L": 38500, "4L": 46500 } },
        { name: "Native Pasta",  prices: { "2L": 30000, "3L": 35000, "4L": 46500 } },
        { name: "Asun Pasta",    prices: { "2L": 38500, "3L": 45500, "4L": 50000 } },
        { name: "Special",       prices: { "2L": 45000, "3L": 50000, "4L": 63500 } },
      ],
    },
    soup: {
      label: "🍲 Soup",
      sizes: ["2L", "3L", "4L"],
      items: [
        { name: "Afang",                   prices: { "2L": 30000, "3L": 40000, "4L": 50000 } },
        { name: "Ofe Owerri",              prices: { "2L": 30000, "3L": 40000, "4L": 55000 } },
        { name: "Egusi",                   prices: { "2L": 30000, "3L": 40000, "4L": 50000 } },
        { name: "Okro",                    prices: { "2L": 20000, "3L": 30000, "4L": 40000 } },
        { name: "Banga",                   prices: { "2L": 35000, "3L": 45000, "4L": 60000 } },
        { name: "Fisherman Soup",          prices: { "2L": 55000, "3L": 80000, "4L": 120000 } },
        { name: "Vegetable/Edikaikong",    prices: { "2L": 30000, "3L": 40000, "4L": 50000 } },
        { name: "Oha",                     prices: { "2L": 30000, "3L": 40000, "4L": 50000 } },
        { name: "Nsala",                   prices: { "2L": 45000, "3L": 50000, "4L": 55000 } },
      ],
    },
    pepperSoup: {
      label: "🌶️ Pepper Soup",
      sizes: ["2L", "3L", "4L"],
      items: [
        { name: "Chicken",   prices: { "2L": 30000, "3L": 50000, "4L": 60000 } },
        { name: "Turkey",    prices: { "2L": 40000, "3L": 65500, "4L": 70500 } },
        { name: "Goat Meat", prices: { "2L": 40000, "3L": 50000, "4L": 60000 } },
        { name: "Catfish",   prices: { "2L": 40000, "3L": 50000, "4L": 60000 } },
        { name: "Assorted",  prices: { "2L": 35500, "3L": 45500, "4L": 60000 } },
      ],
    },
    specials: {
      label: "⭐ Specials & Extras",
      sizes: [],
      items: [
        { name: "Tapioca",            note: "Comes with milk, sugar and coconut", prices: { "Price": 3000 } },
        { name: "Plantain (Extras)",  note: "",                                   prices: { "Price": 2000 } },
        { name: "Coleslaw (Extras)",  note: "",                                   prices: { "Price": 1000 } },
      ],
    },
  };

  const fmt = (p) => `₦${Number(p).toLocaleString()}`;

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .pearl-anim { animation: fadeInUp 0.5s ease both; }
        .tab-btn { transition: all 0.2s ease; border: none; cursor: pointer; }
        .menu-row { transition: background 0.15s ease; }
        .menu-row:hover { background: rgba(255,255,255,0.04) !important; }
        .call-btn { transition: all 0.25s ease; }
        .call-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(139,0,0,0.4) !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(139,0,0,0.3); border-radius: 4px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080000" }}>

        {/* ===== NAVBAR ===== */}
        <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,0,0,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(139,0,0,0.2)", padding: "12px 20px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link to="/order" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, color: "#9ca3af", fontSize: 14, fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Back to vendors
            </Link>
            <Link to="/" style={{ textDecoration: "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 18, color: "#000" }}>K</span>
              </div>
            </Link>
          </div>
        </nav>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px 80px" }}>
          {toast && (
            <div style={{ marginBottom: 16, background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", padding: "10px 14px", borderRadius: 12, color: "#d9f99d", fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>
              {toast}
            </div>
          )}

          {/* ===== HERO BANNER ===== */}
          <div className="pearl-anim" style={{ borderRadius: 24, overflow: "hidden", marginBottom: 28, background: "linear-gradient(135deg, #1a0000 0%, #3d0505 50%, #1a0000 100%)", border: "1px solid rgba(139,0,0,0.4)", boxShadow: "0 0 60px rgba(139,0,0,0.12)", position: "relative" }}>

            {/* Background pattern */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
            <div style={{ position: "absolute", right: -30, top: -30, fontSize: 160, opacity: 0.04 }}>👑</div>

            <div style={{ padding: "28px 24px", position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>

                {/* Logo */}
                <div style={{ width: 88, height: 88, borderRadius: 20, background: "rgba(139,0,0,0.25)", border: "2px solid rgba(139,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, flexShrink: 0 }}>
                  👩‍🍳
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                    <h1 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(22px, 4vw, 34px)", letterSpacing: -1 }}>Pearl's Cuisine</h1>
                    <span style={{ background: "linear-gradient(135deg, #eab308, #ca8a04)", color: "#000", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>👑 Featured</span>
                  </div>
                  <p style={{ color: "#fca5a5", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontStyle: "italic", marginBottom: 14 }}>
                    "YOUR Daily dose of DELICIOUSNESS"
                  </p>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    {[["⭐", "4.9 Rating"], ["🍱", "Bulk Orders"], ["🕐", "30–60 mins"], ["📍", "FUTO Campus"]].map(([icon, text]) => (
                      <span key={text} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{icon} {text}</span>
                    ))}
                  </div>
                </div>

                {/* Removed direct contact info; order via cart flow */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  <span style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "8px 12px", borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
                    All ordering now happens through Kravely cart - no vendor calls.
                  </span>
                </div>
              </div>
            </div>

            {/* Important note */}
            <div style={{ background: "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(139,0,0,0.25)", padding: "12px 24px", display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
              <p style={{ color: "#fca5a5", fontSize: 13, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, margin: 0 }}>
                <strong>Important:</strong> All meals take <strong>3hrs</strong> to get ready. Orders within FUTO ends by <strong>3pm</strong> daily. Orders within Owerri ends by <strong>3pm</strong>.
              </p>
            </div>
          </div>

          {/* ===== MENU SECTION ===== */}
          <div className="pearl-anim" style={{ animationDelay: "0.1s" }}>
            <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 20, letterSpacing: -0.5 }}>
              📋 Full Price List
            </h2>

            {/* Tabs */}
            <div style={{ overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
              <div style={{ display: "flex", gap: 8, minWidth: "max-content" }}>
                {Object.entries(menu).map(([key, { label }]) => (
                  <button key={key} className="tab-btn" onClick={() => setActiveTab(key)} style={{
                    padding: "10px 18px", borderRadius: 50,
                    background: activeTab === key ? "linear-gradient(135deg, #991b1b, #7f1d1d)" : "rgba(255,255,255,0.05)",
                    color: activeTab === key ? "#fff" : "rgba(255,255,255,0.55)",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13,
                    boxShadow: activeTab === key ? "0 4px 16px rgba(139,0,0,0.35)" : "none",
                    transform: activeTab === key ? "scale(1.04)" : "scale(1)",
                    whiteSpace: "nowrap",
                    transition: "all 0.25s ease",
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu table */}
            <div style={{ background: "#0f0000", border: "1px solid rgba(139,0,0,0.25)", borderRadius: 20, overflow: "hidden" }}>

              {/* Table header */}
              <div style={{ background: "linear-gradient(135deg, #991b1b, #7f1d1d)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16 }}>
                  {menu[activeTab].label}
                </span>
                <div style={{ display: "flex", gap: 0 }}>
                  {Object.keys(menu[activeTab].items[0].prices).map((size) => (
                    <span key={size} style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, width: 92, textAlign: "center" }}>
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              {/* Items */}
              {menu[activeTab].items.map((item, i) => (
                <div key={item.name} className="menu-row" style={{
                  padding: "15px 20px",
                  borderBottom: i < menu[activeTab].items.length - 1 ? "1px solid rgba(139,0,0,0.1)" : "none",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}>
                  <div>
                    <span style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                    {item.note && (
                      <p style={{ color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 3 }}>{item.note}</p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    {Object.entries(item.prices).map(([size, price]) => (
                      <div key={size} style={{ width: 92, textAlign: "center", display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ color: price ? "#fca5a5" : "rgba(255,255,255,0.15)", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12 }}>
                          {size}
                        </span>
                        <span style={{ color: price ? "#fff" : "#6b7280", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13 }}>
                          {price ? fmt(price) : "—"}
                        </span>
                        {price ? (
                          <button onClick={() => addToCart({ id: item.name.replace(/\s+/g, "-"), name: item.name, price, size, emoji: "🍚" })} style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 44, padding: "4px 0", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                            Add
                          </button>
                        ) : (
                          <span style={{ color: "#4b5563", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>N/A</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            </div>

            {/* Size guide */}
            {activeTab !== "specials" && (
              <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
                {[["2L", "Feeds ~4–5 people"], ["3L", "Feeds ~7–8 people"], ["4L", "Feeds ~10–12 people"]].map(([size, desc]) => (
                  <div key={size} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 14px", display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: "#fca5a5", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>{size}</span>
                    <span style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{desc}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ===== ORDER CTA ===== */}
          <div className="pearl-anim" style={{ marginTop: 32, animationDelay: "0.2s", background: "linear-gradient(135deg, #1a0000, #2d0505)", border: "1px solid rgba(139,0,0,0.3)", borderRadius: 22, padding: "28px 24px", textAlign: "center" }}>
            <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 8, letterSpacing: -0.5 }}>
              Ready to order? 🍽️
            </h3>
            <p style={{ color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 24, lineHeight: 1.8, maxWidth: 420, margin: "0 auto 24px" }}>
              Place your order at least <strong style={{ color: "#fca5a5" }}>3 hours</strong> before you want it delivered. Orders close at <strong style={{ color: "#fca5a5" }}>3pm daily</strong>.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/order" className="call-btn" style={{ background: "#22c55e", color: "#000", textDecoration: "none", padding: "14px 32px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 20px rgba(34,197,94,0.3)" }}>
                🛒 Go to Cart
              </Link>
              <Link to="/login" className="call-btn" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", padding: "14px 32px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15 }}>
                🔐 Login to order
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default PearlsCuisine;
