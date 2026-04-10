import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// ===================== DELIVERY LOCATIONS =====================
const DELIVERY_LOCATIONS = [
  { id: "umuchima",    label: "Umuchima",            zone: "Hostel"    },
  { id: "hostel-ab",  label: "Hostels A & B",        zone: "Hostel"    },
  { id: "hostel-cd",  label: "Hostels C & D",        zone: "Hostel"    },
  { id: "eziobodo",   label: "Eziobodo",             zone: "Off Campus"},
  { id: "ihiagwa",    label: "Ihiagwa",              zone: "Off Campus"},
  { id: "obinze",     label: "Obinze",               zone: "Off Campus"},
  { id: "backgate",   label: "Backgate Area",        zone: "Gate"      },
  { id: "maingate",   label: "Main Gate",            zone: "Gate"      },
  { id: "engineering",label: "Engineering Faculty",  zone: "Faculty"   },
  { id: "ict",        label: "ICT Building",         zone: "Faculty"   },
  { id: "saat",       label: "SAAT Faculty",         zone: "Faculty"   },
  { id: "library",    label: "FUTO Library",         zone: "Faculty"   },
];

const ZONE_COLORS = {
  "Hostel":     { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)"   },
  "Off Campus": { color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)"  },
  "Gate":       { color: "#f97316", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.25)"  },
  "Faculty":    { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
};

const ALL_MEALS = [
  { id: "m1", name: "Jumbo Rice Combo",      vendor: "Pearl's Cuisine",    price: 35000, emoji: "🍱", sponsored: true,  category: "combos" },
  { id: "m2", name: "Jollof Rice + Chicken", vendor: "Chrissy Cuisine",    price: 5500,  emoji: "🍚", sponsored: true,  category: "rice"   },
  { id: "m3", name: "Egusi Soup + Fufu",     vendor: "Mama Nkechi's",      price: 1500,  emoji: "🍲", sponsored: false, category: "soups"  },
  { id: "m4", name: "Suya Platter",          vendor: "Chukwu's Grill",     price: 2200,  emoji: "🔥", sponsored: false, category: "local"  },
  { id: "m5", name: "Pepper Soup",           vendor: "Pepper Soup Corner", price: 1200,  emoji: "🍜", sponsored: false, category: "soups"  },
  { id: "m6", name: "Chapman + Snacks",      vendor: "Campus Bites",       price: 1000,  emoji: "🥤", sponsored: false, category: "drinks" },
  { id: "m7", name: "Fried Rice + Turkey",   vendor: "Owerri Rice Palace", price: 2200,  emoji: "🍛", sponsored: false, category: "rice"   },
  { id: "m8", name: "Native Rice",           vendor: "Owerri Rice Palace", price: 2000,  emoji: "🍚", sponsored: false, category: "rice"   },
  { id: "m9", name: "Combo Box",             vendor: "Combo King",         price: 2500,  emoji: "🍱", sponsored: false, category: "combos" },
];

const ALL_VENDORS = [
  { id: 1, name: "Pearl's Cuisine",       tag: "Jumbo Orders · Bulk Delivery", rating: "4.9", time: "30–60 min", emoji: "👑", category: "combos", open: true,  featured: true  },
  { id: 2, name: "Chrissy Cuisine",       tag: "Daily Meals · Umuchima",       rating: "4.9", time: "15–30 min", emoji: "🍚", category: "rice",   open: true,  featured: true  },
  { id: 3, name: "Mama Nkechi's Kitchen", tag: "Local Delicacies",             rating: "4.8", time: "15–25 min", emoji: "🍲", category: "local",  open: true,  featured: false },
  { id: 4, name: "Chukwu's Grill Spot",  tag: "Grills & Suya",                rating: "4.6", time: "20–30 min", emoji: "🔥", category: "local",  open: true,  featured: false },
  { id: 5, name: "Campus Bites",          tag: "Snacks & Fast Food",           rating: "4.5", time: "10–15 min", emoji: "🥪", category: "snacks", open: true,  featured: false },
  { id: 6, name: "Owerri Rice Palace",    tag: "Rice Dishes",                  rating: "4.9", time: "25–35 min", emoji: "🍚", category: "rice",   open: true,  featured: false },
  { id: 7, name: "FreshJuice Hub",        tag: "Drinks & Smoothies",           rating: "4.7", time: "5–10 min",  emoji: "🥤", category: "drinks", open: false, featured: false },
  { id: 8, name: "Pepper Soup Corner",    tag: "Soups & Stews",                rating: "4.8", time: "20–30 min", emoji: "🍜", category: "soups",  open: true,  featured: false },
  { id: 9, name: "Combo King",            tag: "Combo Meals",                  rating: "4.5", time: "20–30 min", emoji: "🍱", category: "combos", open: true,  featured: false },
];

// ===================== LOGIN PROMPT =====================
function LoginPrompt({ onClose }) {
  return (
    <>
      <style>{`
        @keyframes popIn { from { opacity: 0; transform: scale(0.85) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes fadeOverlay { from { opacity: 0; } to { opacity: 1; } }
        .popup-overlay { animation: fadeOverlay 0.2s ease both; }
        .popup-card { animation: popIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>
      <div className="popup-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div className="popup-card" onClick={e => e.stopPropagation()} style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: "36px 32px", width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>🔐</div>
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 10 }}>Login to order food</h3>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            You need a Kravely account to place an order. Free and takes less than a minute!
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link to="/signup" style={{ background: "#22c55e", color: "#000", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 15, padding: "14px", borderRadius: 14, textDecoration: "none", display: "block" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#22c55e"; e.currentTarget.style.transform = "translateY(0)"; }}
            >Create Free Account </Link>
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

// ===================== LOCATION PICKER =====================
function LocationPicker({ isOpen, onClose, onSelect, selected }) {
  const [search, setSearch] = useState("");
  const filtered = DELIVERY_LOCATIONS.filter(l =>
    l.label.toLowerCase().includes(search.toLowerCase()) ||
    l.zone.toLowerCase().includes(search.toLowerCase())
  );
  const zones = [...new Set(DELIVERY_LOCATIONS.map(l => l.zone))];

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .loc-overlay { animation: fadeIn 0.2s ease both; }
        .loc-panel { animation: slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
        .loc-item { transition: all 0.15s ease; cursor: pointer; }
        .loc-item:hover { background: rgba(255,255,255,0.05) !important; }
        .loc-search { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 16px 12px 42px; color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; box-sizing: border-box; }
        .loc-search:focus { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.04); }
        .loc-search::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
      <div className="loc-overlay" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 160, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }} />
      <div className="loc-panel" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 161, background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px 24px 0 0", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} />
        </div>
        <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 2 }}>Where should we deliver?</h2>
              <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>Select your delivery location on FUTO campus</p>
            </div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 50, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input className="loc-search" placeholder="Search location..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "8px 0 20px" }}>
          {zones.map(zone => {
            const zoneItems = filtered.filter(l => l.zone === zone);
            if (zoneItems.length === 0) return null;
            const zStyle = ZONE_COLORS[zone];
            return (
              <div key={zone}>
                <div style={{ padding: "10px 20px 6px" }}>
                  <span style={{ color: zStyle.color, fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{zone}</span>
                </div>
                {zoneItems.map(loc => (
                  <div key={loc.id} className="loc-item" onClick={() => { onSelect(loc); onClose(); }} style={{ padding: "13px 20px", display: "flex", alignItems: "center", gap: 14, background: selected?.id === loc.id ? "rgba(34,197,94,0.06)" : "transparent", borderLeft: selected?.id === loc.id ? "2px solid #22c55e" : "2px solid transparent" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: zStyle.bg, border: `1px solid ${zStyle.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={zStyle.color} stroke="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#fff", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{loc.label}</p>
                      <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>{loc.zone} · FUTO Campus</p>
                    </div>
                    {selected?.id === loc.id && (
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ===================== CART SIDEBAR =====================
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
        @keyframes slideInCart { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeCartOverlay { from { opacity: 0; } to { opacity: 1; } }
        .cart-overlay-bg { animation: fadeCartOverlay 0.25s ease both; }
        .cart-panel { animation: slideInCart 0.35s cubic-bezier(0.22,1,0.36,1) both; }
        .qty-ctrl { transition: all 0.15s ease; }
        .qty-ctrl:hover { background: rgba(34,197,94,0.2) !important; color: #22c55e !important; }
        .checkout-btn { transition: all 0.25s ease; }
        .checkout-btn:hover { background: #16a34a !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(34,197,94,0.3); }
      `}</style>
      {isOpen && <div className="cart-overlay-bg" onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />}
      {isOpen && (
        <div className="cart-panel" style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 101, width: "clamp(300px, 90vw, 420px)", background: "#0a0a0a", borderLeft: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(0,0,0,0.5)" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 20, fontFamily: "'Syne', sans-serif" }}>Your Cart</h2>
              {totalItems > 0 && <span style={{ background: "#22c55e", color: "#000", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>{totalItems} item{totalItems > 1 ? "s" : ""}</span>}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {cart.length > 0 && (
                <button onClick={onClear} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontSize: 12, padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
                  onMouseEnter={e => { e.target.style.color = "#ef4444"; e.target.style.borderColor = "rgba(239,68,68,0.3)"; }}
                  onMouseLeave={e => { e.target.style.color = "#6b7280"; e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                >Clear all</button>
              )}
              <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
              >×</button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
            {cart.length === 0 ? (
              <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, paddingBottom: 80 }}>
                <div style={{ fontSize: 52 }}>🛒</div>
                <p style={{ color: "#4b5563", fontSize: 16, fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>Your cart is empty</p>
                <button onClick={onClose} style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "10px 24px", borderRadius: 50, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 14 }}>Browse Vendors →</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {cart.map(item => (
                  <div key={item.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", position: "relative" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                      <p style={{ color: "#6b7280", fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>{item.vendor}</p>
                      <p style={{ color: "#22c55e", fontWeight: 800, fontSize: 14, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>₦{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button className="qty-ctrl" onClick={() => onDecrease(item.id)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                      <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "'Syne', sans-serif", minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                      <button className="qty-ctrl" onClick={() => onIncrease(item.id)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: 5, background: "rgba(239,68,68,0.15)", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 }}
                      onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                      onMouseLeave={e => e.currentTarget.style.opacity = "0.6"}
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
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
                Checkout 🍔
              </button>
              <p style={{ textAlign: "center", color: "#374151", fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginTop: 12 }}>🔒 Secure payment via Paystack</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ===================== FLOATING CART =====================
function FloatingCartBtn({ count, onClick }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const h = () => setVisible(window.scrollY > 200);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!visible || count === 0) return null;
  return (
    <button onClick={onClick} style={{ position: "fixed", bottom: 28, right: 28, zIndex: 99, background: "#22c55e", border: "none", cursor: "pointer", borderRadius: 50, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(34,197,94,0.35)", transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.06)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(34,197,94,0.45)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(34,197,94,0.35)"; }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <span style={{ color: "#000", fontWeight: 800, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>{count} item{count > 1 ? "s" : ""} in cart</span>
      <span style={{ background: "#000", color: "#22c55e", fontSize: 11, fontWeight: 800, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif" }}>{count}</span>
    </button>
  );
}

// ===================== NAVBAR =====================
function AppNavbar({ cartCount, onCartClick, user, onSignOut, onLocationClick, location, searchQuery, onSearchChange }) {
  const zStyle = location ? ZONE_COLORS[location.zone] : null;

  return (
    <>
      <style>{`
        .app-search-input { width: 100%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 50px; padding: 11px 18px 11px 42px; color: #fff; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: all 0.2s ease; }
        .app-search-input:focus { border-color: rgba(34,197,94,0.4); background: rgba(34,197,94,0.04); }
        .app-search-input::placeholder { color: rgba(255,255,255,0.25); }
        .nav-icon-btn { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
        .nav-icon-btn:hover { background: rgba(34,197,94,0.1) !important; border-color: rgba(34,197,94,0.3) !important; }
        @media (max-width: 640px) { .nav-search-desktop { display: none !important; } .nav-search-mobile { display: flex !important; flex-direction: column; } .nav-loc-desktop { display: none !important; } .nav-back-mobile { display: flex !important; } }
        @media (min-width: 641px) { .nav-search-mobile { display: none !important; } .nav-back-mobile { display: none !important; } }
      `}</style>

      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>

          {/* Back arrow mobile */}
          <Link to="/" className="nav-back-mobile" style={{ textDecoration: "none", flexShrink: 0, display: "none" }}>
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

          {/* Location */}
          <button className="nav-loc-desktop" onClick={onLocationClick} style={{ display: "flex", alignItems: "center", gap: 6, background: location ? (zStyle?.bg || "rgba(34,197,94,0.08)") : "rgba(255,255,255,0.04)", border: `1px solid ${location ? (zStyle?.border || "rgba(34,197,94,0.25)") : "rgba(255,255,255,0.08)"}`, borderRadius: 50, padding: "7px 14px", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill={location ? (zStyle?.color || "#22c55e") : "#6b7280"} stroke="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: location ? (zStyle?.color || "#22c55e") : "#6b7280", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {location ? location.label : "Select location"}
            </span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={location ? (zStyle?.color || "#22c55e") : "#6b7280"} strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>

          {/* Search desktop */}
          <div className="nav-search-desktop" style={{ flex: 1, position: "relative" }}>
            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input className="app-search-input" placeholder="Search vendors, meals..." value={searchQuery} onChange={e => onSearchChange(e.target.value)} />
            {searchQuery && <button onClick={() => onSearchChange("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>}
          </div>

          {/* Cart */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button onClick={onCartClick} className="nav-icon-btn">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </button>
            <span style={{ position: "absolute", top: -4, right: -4, background: cartCount > 0 ? "#22c55e" : "#333", color: cartCount > 0 ? "#000" : "#666", fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", transition: "all 0.3s" }}>{cartCount}</span>
          </div>

          {/* ✅ AUTH BUTTON — shows user name if logged in, login button if not */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 50, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>
                {user.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}
              </div>
              <button onClick={onSignOut} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 50, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
              >Sign out</button>
            </div>
          ) : (
            <Link to="/login" style={{ textDecoration: "none", flexShrink: 0, background: "#22c55e", color: "#000", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, padding: "8px 16px", borderRadius: 50, whiteSpace: "nowrap", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#16a34a"}
              onMouseLeave={e => e.currentTarget.style.background = "#22c55e"}
            >Sign In</Link>
          )}
        </div>

        {/* Mobile search + location */}
        <div className="nav-search-mobile" style={{ display: "none", padding: "0 16px 12px", gap: 8 }}>
          <button onClick={onLocationClick} style={{ display: "flex", alignItems: "center", gap: 6, background: location ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${location ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.08)"}`, borderRadius: 50, padding: "8px 16px", cursor: "pointer", width: "fit-content" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill={location ? "#22c55e" : "#6b7280"} stroke="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <span style={{ color: location ? "#22c55e" : "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600 }}>{location ? location.label : "Select delivery location"}</span>
          </button>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input className="app-search-input" placeholder="Search vendors, meals..." value={searchQuery} onChange={e => onSearchChange(e.target.value)} />
            {searchQuery && <button onClick={() => onSearchChange("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>}
          </div>
        </div>
      </nav>
    </>
  );
}

// ===================== CATEGORIES =====================
function Categories({ active, setActive }) {
  const cats = [
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
        {cats.map(({ id, label, icon }) => (
          <button key={id} onClick={() => setActive(id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", transition: "all 0.25s ease", background: active === id ? "#22c55e" : "rgba(255,255,255,0.05)", color: active === id ? "#000" : "rgba(255,255,255,0.6)", boxShadow: active === id ? "0 4px 16px rgba(34,197,94,0.3)" : "none", transform: active === id ? "scale(1.04)" : "scale(1)" }}>
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
  const handleAdd = () => { onAddToCart(meal); setAdded(true); setTimeout(() => setAdded(false), 1500); };
  return (
    <div style={{ background: "#0a0a0a", border: `1px solid ${sponsored ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 18, overflow: "hidden", cursor: "pointer", transition: "all 0.3s ease", flexShrink: 0, width: 180 }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 32px rgba(34,197,94,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ height: 110, background: "linear-gradient(135deg, #0f1f0f, #1a2e1a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, position: "relative" }}>
        {emoji}
        {sponsored && <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(234,179,8,0.9)", color: "#000", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif" }}>⭐ Sponsored</span>}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{name}</p>
        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginBottom: 8 }}>{vendor}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13 }}>₦{price.toLocaleString()}</span>
          <button onClick={handleAdd} style={{ background: added ? "#16a34a" : "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "5px 12px", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.2s" }}>
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

// ===================== SEARCH RESULTS =====================
function SearchResults({ query, onAddToCart, onOrderClick }) {
  const q = query.toLowerCase();
  const matchedMeals = ALL_MEALS.filter(m => m.name.toLowerCase().includes(q) || m.vendor.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
  const matchedVendors = ALL_VENDORS.filter(v => v.name.toLowerCase().includes(q) || v.tag.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));

  if (matchedMeals.length === 0 && matchedVendors.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <p style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No results for "{query}"</p>
        <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Try searching for "jollof", "rice", "suya" or a vendor name</p>
      </div>
    );
  }
  return (
    <div style={{ animation: "fadeInUp 0.3s ease both" }}>
      <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 13, marginBottom: 24 }}>
        {matchedMeals.length + matchedVendors.length} results for "<span style={{ color: "#22c55e" }}>{query}</span>"
      </p>
      {matchedMeals.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 16 }}>🍔 Meals</h2>
          <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
            {matchedMeals.map(meal => <MealCard key={meal.id} meal={meal} onAddToCart={onAddToCart} />)}
          </div>
        </div>
      )}
      {matchedVendors.length > 0 && (
        <div>
          <h2 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 16 }}>🏪 Vendors</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {matchedVendors.map(vendor => <VendorCard key={vendor.id} vendor={vendor} onOrderClick={onOrderClick} />)}
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== FEATURED VENDOR BANNER =====================
function FeaturedBanner({ name, description, tags, link }) {
  return (
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
          <h3 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(20px, 3vw, 28px)", marginBottom: 6, letterSpacing: -0.5 }}>{name}</h3>
          <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginBottom: 8, maxWidth: 400 }}>{description}</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {tags.map(([icon, text]) => (
              <span key={text} style={{ color: "#eab308", fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{icon} {text}</span>
            ))}
          </div>
        </div>
        <Link to={link} style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.35)", color: "#eab308", textDecoration: "none", borderRadius: 50, padding: "12px 24px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(234,179,8,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(234,179,8,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >View Menu</Link>
      </div>
    </div>
  );
}

// ===================== MAIN PAGE =====================
function OrderNow() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  // ✅ REAL AUTH STATE — listen to Supabase session
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

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

  //  CHECKOUT — if logged in go straight to checkout, if not show login popup
  const handleCheckout = () => {
    if (!selectedLocation) {
      setCartOpen(false);
      setShowLocationPicker(true);
      return;
    }
    setCartOpen(false);
    if (user) {
      // TODO: Navigate to real checkout page when built
      alert(`✅ Order placed! Delivering to ${selectedLocation.label}`);
    } else {
      setShowLoginPrompt(true);
    }
  };

  // ✅ ORDER button on vendor card — if logged in go straight, if not show popup
  const handleOrderClick = () => {
    if (user) {
      if (!selectedLocation) {
        setShowLocationPicker(true);
      } else {
        setCartOpen(true);
      }
    } else {
      setShowLoginPrompt(true);
    }
  };

  const filtered = activeCategory === "all" ? ALL_VENDORS : ALL_VENDORS.filter(v => v.category === activeCategory);
  const isSearching = searchQuery.trim().length > 0;

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg, #22c55e, #16a34a)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 20, color: "#000" }}>K</span>
          </div>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Loading...</p>
        </div>
      </div>
    );
  }

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
        <LocationPicker isOpen={showLocationPicker} onClose={() => setShowLocationPicker(false)} onSelect={setSelectedLocation} selected={selectedLocation} />
        <CartSidebar cart={cart} isOpen={cartOpen} onClose={() => setCartOpen(false)} onIncrease={increaseQty} onDecrease={decreaseQty} onRemove={removeItem} onClear={clearCart} onCheckout={handleCheckout} />
        <FloatingCartBtn count={cartCount} onClick={() => setCartOpen(true)} />

        <AppNavbar
          cartCount={cartCount}
          onCartClick={() => setCartOpen(true)}
          user={user}
          onSignOut={handleSignOut}
          location={selectedLocation}
          onLocationClick={() => setShowLocationPicker(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Location prompt */}
        {!selectedLocation && (
          <div style={{ background: "rgba(34,197,94,0.06)", borderBottom: "1px solid rgba(34,197,94,0.15)", padding: "10px 20px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <p style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, margin: 0 }}>📍 Set your delivery location so we know where to bring your food!</p>
              <button onClick={() => setShowLocationPicker(true)} style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "7px 18px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Set Location →</button>
            </div>
          </div>
        )}

        {/* Location confirmed */}
        {selectedLocation && (
          <div style={{ background: "rgba(34,197,94,0.04)", borderBottom: "1px solid rgba(34,197,94,0.1)", padding: "8px 20px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ color: "#4b5563", fontFamily: "'DM Sans', sans-serif", fontSize: 12, margin: 0 }}>
                📍 Delivering to: <strong style={{ color: "#22c55e" }}>{selectedLocation.label}</strong> · {selectedLocation.zone}
              </p>
              <button onClick={() => setShowLocationPicker(true)} style={{ background: "none", border: "none", color: "#6b7280", fontFamily: "'DM Sans', sans-serif", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>Change</button>
            </div>
          </div>
        )}

        {/* ✅ Logged in greeting bar */}
        {user && (
          <div style={{ background: "rgba(34,197,94,0.05)", borderBottom: "1px solid rgba(34,197,94,0.08)", padding: "8px 20px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <p style={{ color: "#22c55e", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, margin: 0 }}>
                ✅ Logged in as <strong>{user.user_metadata?.full_name || user.email}</strong> — You can order directly!
              </p>
            </div>
          </div>
        )}

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px 100px" }}>

          {isSearching ? (
            <SearchResults query={searchQuery} onAddToCart={addToCart} onOrderClick={handleOrderClick} />
          ) : (
            <>
              {/* Greeting */}
              <div className="dash-anim" style={{ marginBottom: 24 }}>
                <p style={{ color: "#6b7280", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
                  Good day{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(" ")[0]}` : ""} 👋
                </p>
                <h1 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: "clamp(22px, 4vw, 34px)", letterSpacing: -1, marginTop: 4 }}>
                  What are you craving<br />
                  <span style={{ background: "linear-gradient(90deg, #22c55e, #4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>today?</span>
                </h1>
              </div>

              {/* Featured Banners */}
              <div className="flex gap-6">
                     <div className="dash-anim" style={{ marginBottom: 20, animationDelay: "0.05s", display: "flex", gap: 16, flexDirection: "column" }}>
                <FeaturedBanner
                  name="Pearl's Cuisine 🍽️"
                  description="FUTO's jumbo order vendor. Perfect for group orders, events and hostel bulk deliveries."
                  tags={[["🍱", "Bulk Orders"], ["🕐", "1-4hrs"], ["⭐", "4.9 Rating"], ["📍", "FUTO Campus"]]}
                  link="/pearls"
                />
                <FeaturedBanner
                  name="Chrissy Cuisine"
                  description="Perfect for day to day meals located at Umuchima. All delicacies available."
                  tags={[["🍱", "Meals"], ["🕐", "15-30 mins"], ["⭐", "4.9 Rating"], ["📍", "FUTO Campus"]]}
                  link="/chrissy"
                />
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
                  {!user && <button onClick={() => setShowLoginPrompt(true)} style={{ marginTop: 14, background: "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "8px 20px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Claim Offer →</button>}
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
                  {ALL_MEALS.map((meal, i) => (
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
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                    Filter
                  </button>
                </div>
                {filtered.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
                    {filtered.map((vendor, i) => (
                      <div key={vendor.id} style={{ animation: `fadeInUp 0.5s ease ${i * 0.06}s both` }}>
                        <VendorCard vendor={vendor} onOrderClick={handleOrderClick} />
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
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OrderNow;
