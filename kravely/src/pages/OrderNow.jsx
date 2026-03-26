import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ===================== LOGIN PROMPT =====================
function LoginPrompt({ onClose }) {
  return (
    <>
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
        .popup-overlay { animation: fadeOverlay 0.2s ease both; }
        .popup-card { animation: popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>
      <div className="popup-overlay" onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}>
        <div className="popup-card" onClick={e => e.stopPropagation()} style={{
          background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 28, padding: "36px 32px", width: "100%", maxWidth: 400,
          textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.1)",
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>🔐</div>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 10 }}>Login to order food</h3>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            You need a Kravely account to place an order. Free and takes less than a minute!
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link to="/signup" style={{ background: "#22c55e", color: "#000", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, padding: "14px", borderRadius: 14, textDecoration: "none", display: "block" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; }}
            >Create Free Account</Link>
            <Link to="/login" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15, padding: "14px", borderRadius: 14, textDecoration: "none", display: "block" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.4)"; e.currentTarget.style.color = "#22c55e"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
            >Sign In →</Link>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4b5563", fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer", marginTop: 20 }}
            onMouseEnter={e => e.target.style.color = "#fff"}
            onMouseLeave={e => e.target.style.color = "#4b5563"}
          >Maybe later</button>
        </div>
      </div>
    </>
  );
}

// ===================== PEARL'S MENU MODAL =====================
function PearlsMenuModal({ isOpen, onClose, onAddToCart }) {
  const pearlsMenu = [
    { id: "pearls-jumbo-rice", name: "Jumbo Rice Combo", description: "Large portion of jollof rice with chicken, plantain & salad", price: 3500, emoji: "🍱", popular: true },
    { id: "pearls-bulk-rice", name: "Bulk Rice (10+ servings)", description: "Perfect for events and group gatherings", price: 25000, emoji: "🍚", popular: false },
    { id: "pearls-fried-rice", name: "Fried Rice + Chicken", description: "Vegetable fried rice with grilled chicken", price: 2200, emoji: "🍚", popular: false },
    { id: "pearls-jollof-rice", name: "Jollof Rice + Chicken", description: "Classic Nigerian jollof rice with chicken", price: 1800, emoji: "🍚", popular: false },
    { id: "pearls-egusi", name: "Egusi Soup + Fufu", description: "Melon seed soup with pounded yam", price: 2000, emoji: "🍲", popular: false },
    { id: "pearls-okra", name: "Okra Soup + Fufu", description: "Draw soup with pounded yam", price: 1900, emoji: "🍲", popular: false },
    { id: "pearls-suya", name: "Suya Platter", description: "Grilled spiced beef with onions & pepper", price: 2800, emoji: "🔥", popular: false },
    { id: "pearls-chicken", name: "Grilled Chicken", description: "Spicy grilled chicken with sides", price: 2400, emoji: "🍗", popular: false },
    { id: "pearls-plantain", name: "Dodo (Fried Plantain)", description: "Sweet fried plantain", price: 800, emoji: "🍌", popular: false },
    { id: "pearls-salad", name: "Fresh Salad", description: "Mixed vegetable salad", price: 600, emoji: "🥗", popular: false },
  ];

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes menuSlideIn {
          from { transform: translateY(50px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes menuFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .menu-overlay { animation: menuFadeIn 0.3s ease both; }
        .menu-panel { animation: menuSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .menu-item { transition: all 0.2s ease; }
        .menu-item:hover { background: rgba(255,255,255,0.04) !important; transform: translateX(4px); }
        .add-btn { transition: all 0.2s ease; }
        .add-btn:hover { background: #16a34a !important; transform: translateY(-1px); }
      `}</style>

      {/* Overlay */}
      <div className="menu-overlay" onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 150,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
      }} />

      {/* Modal */}
      <div className="menu-panel" onClick={e => e.stopPropagation()} style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 151,
        background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "24px 24px 0 0", maxHeight: "80vh", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>

        {/* Header */}
        <div style={{ padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 24, marginBottom: 4 }}>Pearl's Cuisine Menu</h2>
            <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>FUTO's #1 jumbo order specialists</p>
          </div>
          <button onClick={onClose} style={{
            width: 40, height: 40, borderRadius: 50, background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer",
            fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          >×</button>
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pearlsMenu.map((item) => (
              <div key={item.id} className="menu-item" style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 16, padding: "16px", display: "flex", alignItems: "center", gap: 14,
                position: "relative"
              }}>
                {item.popular && (
                  <span style={{
                    position: "absolute", top: 8, right: 8,
                    background: "linear-gradient(135deg, #eab308, #ca8a04)",
                    color: "#000", fontSize: 9, fontWeight: 800, padding: "2px 8px",
                    borderRadius: 50, fontFamily: "'DM Sans', sans-serif"
                  }}>⭐ Popular</span>
                )}

                {/* Emoji */}
                <div style={{
                  width: 50, height: 50, borderRadius: 12,
                  background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24,
                  flexShrink: 0
                }}>
                  {item.emoji}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{item.name}</h4>
                  <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginBottom: 6, lineHeight: 1.4 }}>{item.description}</p>
                  <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 16 }}>₦{item.price.toLocaleString()}</span>
                </div>

                {/* Add Button */}
                <button
                  className="add-btn"
                  onClick={() => {
                    onAddToCart({ id: item.id, name: item.name, vendor: "Pearl's Cuisine", price: item.price, emoji: item.emoji });
                    onClose();
                  }}
                  style={{
                    background: "#22c55e", color: "#000", border: "none", borderRadius: 50,
                    padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                    fontSize: 13, cursor: "pointer", flexShrink: 0
                  }}
                >
                  Add +
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.5)" }}>
          <p style={{ textAlign: "center", color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
            📍 Delivery within FUTO Campus • 🕐 30-60 mins • ⭐ 4.9 Rating
          </p>
        </div>
      </div>
    </>
  );
}
function CartSidebar({ cart, isOpen, onClose, onIncrease, onDecrease, onRemove, onClear, onCheckout }) {
  const totalItems = cart.reduce((a, i) => a + i.qty, 0);
  const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const delivery = 300;
  const total = subtotal + delivery;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <style>{`
        @keyframes slideInCart {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeCartOverlay { from { opacity: 0; } to { opacity: 1; } }
        .cart-overlay-bg { animation: fadeCartOverlay 0.25s ease both; }
        .cart-panel { animation: slideInCart 0.35s cubic-bezier(0.22,1,0.36,1) both; }
        .cart-item-row { transition: background 0.2s ease; }
        .cart-item-row:hover { background: rgba(255,255,255,0.04) !important; }
        .qty-ctrl { transition: all 0.15s ease; }
        .qty-ctrl:hover { background: rgba(34,197,94,0.2) !important; color: #22c55e !important; }
        .checkout-btn { transition: all 0.25s ease; }
        .checkout-btn:hover { background: #16a34a !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(34,197,94,0.3); }
      `}</style>

      {/* Overlay */}
      {isOpen && (
        <div className="cart-overlay-bg" onClick={onClose} style={{
          position: "fixed", inset: 0, zIndex: 100,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        }} />
      )}

      {/* Panel */}
      {isOpen && (
        <div className="cart-panel" style={{
          position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 101,
          width: "clamp(300px, 90vw, 420px)",
          background: "#0a0a0a",
          borderLeft: "1px solid rgba(255,255,255,0.08)",
          display: "flex", flexDirection: "column",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
        }}>

          {/* Header */}
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 20, fontFamily: "'Syne', sans-serif" }}>Your Cart</h2>
              {totalItems > 0 && (
                <span style={{ background: "#22c55e", color: "#000", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>
                  {totalItems} item{totalItems > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {cart.length > 0 && (
                <button onClick={onClear} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontSize: 12, padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.color = "#ef4444"; e.target.style.borderColor = "rgba(239,68,68,0.3)"; }}
                  onMouseLeave={e => { e.target.style.color = "#6b7280"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >Clear all</button>
              )}
              <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              >×</button>
            </div>
          </div>

          {/* Items */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
            {cart.length === 0 ? (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, paddingBottom: 80 }}>
                <p style={{ color: "#4b5563", fontSize: 16, fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>Your cart is empty</p>
                <p style={{ color: "#374151", fontSize: 14, textAlign: "center", fontFamily: "'DM Sans', sans-serif", maxWidth: 220 }}>
                  Browse vendors and add your favourite meals to get started
                </p>
                <button onClick={onClose} style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "10px 24px", borderRadius: 50, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>
                  Browse Vendors →
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {cart.map(item => (
                  <div key={item.id} className="cart-item-row" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", position: "relative" }}>
                    {/* Emoji */}
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                      {item.emoji}
                    </div>
                    {/* Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                      <p style={{ color: "#6b7280", fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{item.vendor}</p>
                      <p style={{ color: "#22c55e", fontWeight: 800, fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                        ₦{(item.price * item.qty).toLocaleString()}
                      </p>
                    </div>
                    {/* Qty controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button className="qty-ctrl" onClick={() => onDecrease(item.id)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "'Syne', sans-serif", minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                      <button className="qty-ctrl" onClick={() => onIncrease(item.id)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                    {/* Remove */}
                    <button onClick={() => onRemove(item.id)} style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: 5, background: "rgba(239,68,68,0.15)", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6, transition: "opacity 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Subtotal</span>
                <span style={{ color: "#fff", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>₦{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Delivery fee</span>
                <span style={{ color: "#22c55e", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>₦{delivery.toLocaleString()}</span>
              </div>
              <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "'Syne', sans-serif" }}>Total</span>
                <span style={{ color: "#22c55e", fontWeight: 800, fontSize: 18, fontFamily: "'Syne', sans-serif" }}>₦{total.toLocaleString()}</span>
              </div>
              <button className="checkout-btn" onClick={onCheckout} style={{ width: "100%", background: "#22c55e", color: "#000", fontWeight: 800, fontSize: 16, padding: "16px", borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                Checkout
              </button>
              <p style={{ textAlign: "center", color: "#374151", fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginTop: 12 }}>
                Secure payment via Paystack
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ===================== FLOATING CART BUTTON =====================
function FloatingCartBtn({ count, onClick }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible || count === 0) return null;

  return (
    <button onClick={onClick} style={{
      position: "fixed", bottom: 28, right: 28, zIndex: 99,
      background: "#22c55e", border: "none", cursor: "pointer",
      borderRadius: 50, padding: "14px 20px",
      display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 8px 32px rgba(34,197,94,0.35)",
      transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      animation: "floatCartIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.06)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(34,197,94,0.45)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(34,197,94,0.35)"; }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <span style={{ color: "#000", fontWeight: 800, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
        {count} item{count > 1 ? "s" : ""} in cart
      </span>
      <span style={{ background: "#000", color: "#22c55e", fontSize: 11, fontWeight: 800, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif" }}>
        {count}
      </span>
    </button>
  );
}

// ===================== NAVBAR =====================
function AppNavbar({ cartCount, onCartClick, onLoginClick }) {
  return (
    <>
      <style>{`
        .app-search-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 50px; padding: 11px 18px 11px 42px; color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s ease; }
        .app-search-input:focus { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.04); }
        .app-search-input::placeholder { color: rgba(255,255,255,0.25); }
        .nav-icon-btn { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
        .nav-icon-btn:hover { background: rgba(34,197,94,0.1) !important; border-color: rgba(34,197,94,0.3) !important; }
        @keyframes floatCartIn { from { opacity: 0; transform: translateY(20px) scale(0.8); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (max-width: 640px) { .nav-location { display: none !important; } .nav-search-desktop { display: none !important; } .nav-search-mobile { display: block !important; } .nav-back-mobile { display: flex !important; } }
        @media (min-width: 641px) { .nav-search-mobile { display: none !important; } .nav-back-mobile { display: none !important; } }
      `}</style>

      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>

          {/* Back arrow mobile */}
          <Link to="/" className="nav-back-mobile" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            </div>
          </Link>

          {/* K Logo */}
          <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, color: "#000" }}>K</span>
            </div>
          </Link>

          {/* Location desktop */}
          <button className="nav-location" style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#d1fae5", flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>FUTO Campus</span>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>

          {/* Search desktop */}
          <div className="nav-search-desktop" style={{ flex: 1, position: "relative" }}>
            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input className="app-search-input" placeholder="Search vendors, meals..." />
          </div>

          <div style={{ flex: 1 }} className="nav-location" />

          {/* Cart with live count */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button onClick={onCartClick} className="nav-icon-btn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </button>
            <span style={{ position: "absolute", top: -4, right: -4, background: cartCount > 0 ? "#22c55e" : "#333", color: cartCount > 0 ? "#000" : "#666", fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", transition: "all 0.3s" }}>
              {cartCount}
            </span>
          </div>

          {/* Profile */}
          <button onClick={onLoginClick} className="nav-icon-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>

        {/* Search mobile */}
        <div className="nav-search-mobile" style={{ padding: "0 16px 12px" }}>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input className="app-search-input" placeholder="Search vendors, meals..." />
          </div>
        </div>
      </nav>
    </>
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
            display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 50, border: "none",
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap",
            transition: "all 0.25s ease",
            background: active === id ? "#22c55e" : "rgba(255,255,255,0.05)",
            color: active === id ? "#000" : "rgba(255,255,255,0.6)",
            boxShadow: active === id ? "0 4px 16px rgba(34,197,94,0.3)" : "none",
            transform: active === id ? "scale(1.04)" : "scale(1)",
          }}>
            <span style={{ fontSize: 15 }}>{icon}</span>{label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===================== MEAL CARD =====================
function MealCard({ meal, onAddToCart }) {
  const { name, vendor, price, emoji, sponsored } = meal;
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(meal);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{ background: "#0a0a0a", border: `1px solid ${sponsored ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 18, overflow: "hidden", cursor: "pointer", transition: "all 0.3s ease", flexShrink: 0, width: 180 }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 32px rgba(34,197,94,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ height: 110, background: "linear-gradient(135deg, #0f1f0f, #1a2e1a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, position: "relative" }}>
        {emoji}
        {sponsored && (
          <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(234,179,8,0.9)", color: "#000", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>⭐ Sponsored</span>
        )}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{name}</p>
        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginBottom: 8 }}>{vendor}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>₦{price.toLocaleString()}</span>
          <button onClick={handleAdd} style={{
            background: added ? "#16a34a" : "#22c55e", color: "#000", border: "none",
            borderRadius: 50, padding: "5px 12px", fontSize: 11,
            fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.2s",
          }}>
            {added ? "✓ Added" : "Add +"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== VENDOR CARD =====================
function VendorCard({ vendor, onOrderClick }) {
  const { name, tag, rating, time, emoji, open, featured } = vendor;
  return (
    <div style={{ background: "#0a0a0a", border: `1px solid ${featured ? "rgba(234,179,8,0.4)" : "rgba(255,255,255,0.06)"}`, borderRadius: 20, overflow: "hidden", cursor: "pointer", transition: "all 0.3s ease" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = featured ? "rgba(234,179,8,0.6)" : "rgba(34,197,94,0.3)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 40px ${featured ? "rgba(234,179,8,0.1)" : "rgba(34,197,94,0.08)"}`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = featured ? "rgba(234,179,8,0.4)" : "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ height: 140, background: featured ? "linear-gradient(135deg, #1a1200, #2a1f00)" : "linear-gradient(135deg, #0f1f0f, #1a2e1a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, position: "relative" }}>
        {emoji}
        {featured && (
          <div style={{ position: "absolute", top: 10, left: 10, background: "linear-gradient(135deg, #eab308, #ca8a04)", borderRadius: 50, padding: "4px 12px", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 10 }}>👑</span>
            <span style={{ color: "#000", fontSize: 10, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>Featured</span>
          </div>
        )}
        {!open && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, background: "rgba(0,0,0,0.8)", padding: "4px 12px", borderRadius: 50 }}>Closed</span>
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15 }}>{name}</h3>
          <span style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "3px 8px", borderRadius: 50, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", flexShrink: 0, marginLeft: 8 }}>⭐ {rating}</span>
        </div>
        <p style={{ color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>{tag}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#4b5563", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>🕐 {time}</span>
          <button onClick={() => open && onOrderClick()} style={{ background: open ? "#22c55e" : "rgba(255,255,255,0.06)", color: open ? "#000" : "#4b5563", border: "none", borderRadius: 50, padding: "7px 16px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, cursor: open ? "pointer" : "default", transition: "all 0.2s" }}
            onMouseEnter={e => { if (open) e.currentTarget.style.background = "#16a34a"; }}
            onMouseLeave={e => { if (open) e.currentTarget.style.background = open ? "#22c55e" : "rgba(255,255,255,0.06)"; }}
          >{open ? "Order" : "Closed"}</button>
        </div>
      </div>
    </div>
  );
}

// ===================== MAIN PAGE =====================
function OrderNow() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showPearlsMenu, setShowPearlsMenu] = useState(false);

  // Cart actions
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const increaseQty = (id) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  const decreaseQty = (id) => setCart(prev => prev.map(i => i.id === id ? i.qty === 1 ? null : { ...i, qty: i.qty - 1 } : i).filter(Boolean));
  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((a, i) => a + i.qty, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    setShowLoginPrompt(true);
  };

  const meals = [
    { id: "m1", name: "Jumbo Rice Combo", vendor: "Pearl's Cuisine", price: 3500, emoji: "🍱", sponsored: true },
    { id: "m2", name: "Jollof Rice + Chicken", vendor: "Mama Nkechi's", price: 1800, emoji: "🍚", sponsored: false },
    { id: "m3", name: "Egusi Soup + Fufu", vendor: "Mama Nkechi's", price: 1500, emoji: "🍲", sponsored: false },
    { id: "m4", name: "Suya Platter", vendor: "Chukwu's Grill", price: 2200, emoji: "🔥", sponsored: false },
    { id: "m5", name: "Pepper Soup", vendor: "Pepper Soup Corner", price: 1200, emoji: "🍜", sponsored: false },
    { id: "m6", name: "Chapman + Snacks", vendor: "Campus Bites", price: 1000, emoji: "🥤", sponsored: false },
  ];

  const vendors = [
    { id: 1, name: "Pearl's Cuisine", tag: "Jumbo Orders · Bulk Delivery", rating: "4.9", time: "2-4 hrs", emoji: "👑", category: "combos", open: true, featured: true },
    { id: 2, name: "Mama Nkechi's Kitchen", tag: "Local Delicacies", rating: "4.8", time: "15–25 min", emoji: "🍲", category: "local", open: true, featured: false },
    { id: 3, name: "Chukwu's Grill Spot", tag: "Grills & Suya", rating: "4.6", time: "20–30 min", emoji: "🔥", category: "local", open: true, featured: false },
    { id: 4, name: "Campus Bites", tag: "Snacks & Fast Food", rating: "4.5", time: "10–15 min", emoji: "🥪", category: "snacks", open: true, featured: false },
    { id: 5, name: "Owerri Rice Palace", tag: "Rice Dishes", rating: "4.9", time: "25–35 min", emoji: "🍚", category: "rice", open: true, featured: false },
    { id: 6, name: "FreshJuice Hub", tag: "Drinks & Smoothies", rating: "4.7", time: "5–10 min", emoji: "🥤", category: "drinks", open: false, featured: false },
    { id: 7, name: "Pepper Soup Corner", tag: "Soups & Stews", rating: "4.8", time: "20–30 min", emoji: "🍜", category: "soups", open: true, featured: false },
    { id: 8, name: "Combo King", tag: "Combo Meals", rating: "4.5", time: "20–30 min", emoji: "🍱", category: "combos", open: true, featured: false },
  ];

  const filtered = activeCategory === "all" ? vendors : vendors.filter(v => v.category === activeCategory);

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .dash-anim { animation: fadeInUp 0.5s ease both; }
        .meals-scroll::-webkit-scrollbar { display: none; }
        .meals-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#000" }}>

        {showLoginPrompt && <LoginPrompt onClose={() => setShowLoginPrompt(false)} />}

        <PearlsMenuModal
          isOpen={showPearlsMenu}
          onClose={() => setShowPearlsMenu(false)}
          onAddToCart={addToCart}
        />

        <CartSidebar
          cart={cart}
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          onIncrease={increaseQty}
          onDecrease={decreaseQty}
          onRemove={removeItem}
          onClear={clearCart}
          onCheckout={handleCheckout}
        />

        <FloatingCartBtn count={cartCount} onClick={() => setCartOpen(true)} />

        <AppNavbar
          cartCount={cartCount}
          onCartClick={() => setCartOpen(true)}
          onLoginClick={() => setShowLoginPrompt(true)}
        />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px 100px" }}>

          {/* Greeting */}
          <div className="dash-anim" style={{ marginBottom: 24 }}>
            <p style={{ color: "#6b7280", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>Good day 👋</p>
            <h1 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(22px, 4vw, 34px)", letterSpacing: -1, marginTop: 4 }}>
              What are you craving<br />
              <span style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>today?</span>
            </h1>
          </div>

          {/* Pearl's Cuisine Featured Banner */}
          <div className="dash-anim" style={{ marginBottom: 20, animationDelay: "0.05s" }}>
            <div style={{ borderRadius: 22, padding: "24px 28px", background: "linear-gradient(135deg, #1a1200 0%, #2d1f00 40%, #1a1200 100%)", border: "1px solid rgba(234,179,8,0.35)", position: "relative", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 0 40px rgba(234,179,8,0.08)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(234,179,8,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(234,179,8,0.08)"; }}
            >
              <div style={{ position: "absolute", right: -20, top: -20, fontSize: 120, opacity: 0.08 }}>👑</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ background: "rgba(234,179,8,0.2)", border: "1px solid rgba(234,179,8,0.4)", color: "#eab308", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>👑 FEATURED VENDOR</span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}>Sponsored</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(20px, 3vw, 28px)", marginBottom: 6, letterSpacing: -0.5 }}>Pearl's Cuisine 🍽️</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 8, maxWidth: 400 }}>
                    FUTO's #1 jumbo order vendor. Perfect for group orders, events and hostel bulk deliveries.
                  </p>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {[["🍱", "Bulk Orders"], ["🕐", "30–60 mins"], ["⭐", "4.9 Rating"], ["📍", "FUTO Campus"]].map(([icon, text]) => (
                      <span key={text} style={{ color: "#eab308", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{icon} {text}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setShowPearlsMenu(true)} style={{ background: "linear-gradient(135deg, #eab308, #ca8a04)", color: "#000", border: "none", borderRadius: 50, padding: "12px 28px", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 14, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", boxShadow: "0 4px 16px rgba(234,179,8,0.3)" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(234,179,8,0.4)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(234,179,8,0.3)"; }}
                >View Menu →</button>
              </div>
            </div>
          </div>

          {/* Free delivery banner */}
          <div className="dash-anim" style={{ marginBottom: 28, animationDelay: "0.1s" }}>
            <div style={{ borderRadius: 18, padding: "20px 24px", background: "linear-gradient(135deg, #14532d, #166634, #15803d)", position: "relative", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ position: "absolute", right: -10, top: -10, fontSize: 80, opacity: 0.12 }}>🍔</div>
              <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Free delivery on your first order! 🎉</h3>
              <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>Sign up now and enjoy free delivery on your very first Kravely order.</p>
              <button onClick={() => setShowLoginPrompt(true)} style={{ marginTop: 14, background: "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "8px 20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Claim Offer →</button>
            </div>
          </div>

          {/* Categories */}
          <div className="dash-anim" style={{ marginBottom: 28, animationDelay: "0.15s" }}>
            <Categories active={activeCategory} setActive={setActiveCategory} />
          </div>

          {/* Popular Meals */}
          <div className="dash-anim" style={{ marginBottom: 36, animationDelay: "0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>🍔 Popular Meals</h2>
              <span style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>Tap to add to cart</span>
            </div>
            <div className="meals-scroll" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
              {meals.map((meal, i) => (
                <div key={meal.id} style={{ animation: `fadeInUp 0.5s ease ${i * 0.06}s both` }}>
                  <MealCard meal={meal} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          </div>

          {/* Vendors */}
          <div className="dash-anim" style={{ animationDelay: "0.25s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>🏪 Browse Vendors</h2>
              <button style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 50, padding: "6px 16px", color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(34,197,94,0.3)"; e.currentTarget.style.color = "#22c55e"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#6b7280"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filter
              </button>
            </div>
            {filtered.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
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
      </div>
    </>
  );
}

export default OrderNow;
