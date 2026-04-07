import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
//import chrissyLogo from "..assets/images/chrissylogo.jpeg"

function ChrissyCuisine() {
  const [activeTab, setActiveTab] = useState("rice");
  const [toast, setToast] = useState("");
  const [qtyMap, setQtyMap] = useState({});
  const navigate = useNavigate();

  // Handle toast messages
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  // Increase quantity
  const increaseQty = (id) => {
    setQtyMap(prev => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  // Decrease quantity
  const decreaseQty = (id) => {
    setQtyMap(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) - 1) }));
  };

  // Add to cart
  const addToCart = ({ id, name, price, size, emoji, qty = 1 }) => {
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
      existing.qty += qty;
    } else {
      cart.push({ id: `${id}-${size}`, name: `${name} (${size})`, vendor: "Chrissy Cuisine", price, emoji, qty });
    }
    localStorage.setItem(key, JSON.stringify(cart));
    setToast(`${name} ( ${size} ) added to cart`);
    navigate("/order");
  };

  const menu = {
    rice: {
      label: " Rice",
      items: [
        { name: "Party Jollof Rice", price: 4500 },
        { name: "Asun Rice", price: 6500 },
        { name: "Fried Rice", price: 5000 },
        { name: "Native Rice", price: 6500 },
        { name: "White Rice/Beans/Egg", price: 5500 },
      ],
    },
    Beans: {
      label: "Beans",
      items: [
        { name: "Agonyin Beans", price: 4000 },
      ],
    },
    pasta: {
      label: " Pasta",
      items: [
        { name: "Jollof Pasta", price: 4500 },
        { name: "Native Pasta", price: 6000 },
        { name: "Asun Pasta", price: 6000 },
        { name: "Stir Fry Pasta", price: 5000 },
      ],
    },
    soup: {
      label: " Soup",
      items: [
        { name: "Egusi & Swallow", price: 6000 },
        { name: "Okro & Swallow", price: 7000 },
        { name: "Eforiro & Swallow", price: 5500 },
      ],
    },
    pepperSoup: {
      label: " Pepper Soup",
      items: [
        { name: " Peppered Soup Catfish  ", price: 8000 },
        { name: " Peppered Soup Goat Meat ", price: 8000 },
        { name: " Peppered Soup Meat ", price: 8000 },
        { name: " Peppered Soup Turkey", price: 8000 },
      ],
    },
    Extras: {
      label: "Extras",
      items: [
        { name: "Semo (Extras)", price: 1000 },
        { name: "Eba (Extras)", price: 1000 },
        { name: "Poundo (Extras)", price: 2000 },
        { name: "Wheat (Extras)", price: 1000 },
        { name: "Fried PLantain (Extras)", note: "Per portion 1000", price: 1000 }
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

        {/* NAVBAR */}
        <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(8,0,0,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(139,0,0,0.2)", padding: "12px 20px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link to="/vendors" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, color: "#9ca3af", fontSize: 14, fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}
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

          {/* HERO BANNER */}
              <div className="pearl-anim" style={{ borderRadius: 24, overflow: "hidden", marginBottom: 28, background: "linear-gradient(135deg, #1a0000 0%, #3d0505 50%, #1a0000 100%)", border: "1px solid rgba(139,0,0,0.4)", boxShadow: "0 0 60px rgba(139,0,0,0.12)", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
              <div style={{ position: "absolute", right: -30, top: -30, fontSize: 160, opacity: 0.04 }}>👑</div>
              <div style={{ padding: "28px 24px", position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
               {/* Logo */}
               {/* <div className="w-30">
                 <img src={chrissyLogo} alt="Chrissy Logo"  className="flex items-center rounded-2xl h-50 w-auto" />
                </div>
                 */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                    <h1 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(22px, 4vw, 34px)", letterSpacing: -1 }}>Chrissy Cuisine</h1>
                    <span style={{ background: "linear-gradient(135deg, #eab308, #ca8a04)", color: "#000", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>👑 Featured</span>
                  </div>
                  <p style={{ color: "#fca5a5", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontStyle: "italic", marginBottom: 14 }}>
                    "We offer executive servisces and dishes"
                  </p>
                  <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    {[["⭐", "4.9 Rating"], ["Normal Day to day meals"], [ "30–60 mins"], [ "FUTO Campus"]].map(([icon, text]) => (
                      <span key={text} style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{icon} {text}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MENU */}
          <div className="pearl-anim" style={{ animationDelay: "0.1s" }}>
            <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 20, letterSpacing: -0.5 }}>
              📋 Full Price List
            </h2>

            <div style={{ background: "#0f0000", border: "1px solid rgba(139,0,0,0.25)", borderRadius: 20, overflow: "hidden" }}>
              {/* Table header */}
              <div style={{ background: "linear-gradient(135deg, #991b1b, #7f1d1d)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16 }}>{menu[activeTab].label}</span>
                <span style={{ color: "#fff" }}>Price</span>
              </div>

              {/* Menu Items */}
              {menu[activeTab].items.map((item, i) => {
                const itemId = item.name.replace(/\s+/g, "-");
                const qty = qtyMap[itemId] || 1;

                return (
                  <div key={item.name} className="menu-row" style={{
                    padding: "15px 20px",
                    borderBottom: i < menu[activeTab].items.length - 1 ? "1px solid rgba(139,0,0,0.1)" : "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                  }}>
                    <div>
                      <span style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>{item.name}</span>
                      {item.note && (
                        <p style={{ color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 3 }}>{item.note}</p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                      <button onClick={() => decreaseQty(itemId)} style={{ background: "#991b1b", color: "#fff", border: "none", borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontWeight: 700 }}>-</button>
                      <span style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", width: 24, textAlign: "center" }}>{qty}</span>
                      <button onClick={() => increaseQty(itemId)} style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 8, padding: "4px 8px", cursor: "pointer", fontWeight: 700 }}>+</button>
                      <button onClick={() => addToCart({ id: itemId, name: item.name, price: item.price, size: "Regular", emoji: "🍚", qty })}
                        style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 44, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", marginLeft: 6 }}>Add</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ORDER CTA */}
          <div className="pearl-anim" style={{ marginTop: 32, animationDelay: "0.2s", background: "linear-gradient(135deg, #1a0000, #2d0505)", border: "1px solid rgba(139,0,0,0.3)", borderRadius: 22, padding: "28px 24px", textAlign: "center" }}>
            <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 8, letterSpacing: -0.5 }}>
              Ready to order? 
            </h3>
            <p style={{ color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 24, lineHeight: 1.8, maxWidth: 420, margin: "0 auto 24px" }}>
              You <strong style={{ color: "#fca5a5" }}> Crave</strong> We Deliver
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/order" className="call-btn" style={{ background: "#22c55e", color: "#000", textDecoration: "none", padding: "14px 32px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 20px rgba(34,197,94,0.3)" }}>
                Go to Cart
              </Link>
              <Link to="/login" className="call-btn" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", textDecoration: "none", padding: "14px 32px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                Login to order
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default ChrissyCuisine;