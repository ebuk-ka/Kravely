// src/pages/OrderNow.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { usePublicVendors, usePopularItems } from "../hooks/useKravelyData";

const DELIVERY_LOCATIONS = [
  { id: "umuchima",    label: "Umuchima",           zone: "Hostel"     },
  { id: "hostel-ab",  label: "Hostels A & B",       zone: "Hostel"     },
  { id: "hostel-cd",  label: "Hostels C & D",       zone: "Hostel"     },
  { id: "eziobodo",   label: "Eziobodo",            zone: "Off Campus" },
  { id: "ihiagwa",    label: "Ihiagwa",             zone: "Off Campus" },
  { id: "obinze",     label: "Obinze",              zone: "Off Campus" },
  { id: "backgate",   label: "Backgate Area",       zone: "Gate"       },
  { id: "maingate",   label: "Main Gate",           zone: "Gate"       },
  { id: "engineering",label: "Engineering Faculty", zone: "Faculty"    },
  { id: "ict",        label: "ICT Building",        zone: "Faculty"    },
  { id: "saat",       label: "SAAT Faculty",        zone: "Faculty"    },
  { id: "library",    label: "FUTO Library",        zone: "Faculty"    },
];

const ZONE_COLOR = {
  Hostel:     { color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.25)"   },
  "Off Campus":{ color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.25)"  },
  Gate:       { color: "#f97316", bg: "rgba(249,115,22,0.1)",  border: "rgba(249,115,22,0.25)"  },
  Faculty:    { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
};

const CATS = [
  { id: "all",    label: "All",        icon: "🍽️" },
  { id: "local",  label: "Local Meals",icon: "🍲" },
  { id: "rice",   label: "Rice Dishes",icon: "🍚" },
  { id: "soups",  label: "Soups",      icon: "🍜" },
  { id: "snacks", label: "Snacks",     icon: "🥪" },
  { id: "drinks", label: "Drinks",     icon: "🥤" },
  { id: "combos", label: "Combos",     icon: "🍱" },
];

// ─── SKELETON LOADER ────────────────────────────────────────
function Skeleton({ w, h, r = 10 }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: "rgba(255,255,255,0.06)", animation: "shimmer 1.4s ease infinite", flexShrink: 0 }} />;
}

// ─── LOGIN PROMPT ────────────────────────────────────────────
function LoginPrompt({ onClose }) {
  return (
    <>
      <style>{`@keyframes popIn{from{opacity:0;transform:scale(0.88) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div onClick={e => e.stopPropagation()} style={{ animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: "36px 32px", width: "100%", maxWidth: 400, textAlign: "center", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>🔐</div>
          <h3 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 10 }}>Login to order food</h3>
          <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>You need a Kravely account to order. Free and takes under a minute!</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Link to="/signup" onClick={onClose} style={{ background: "#22c55e", color: "#000", fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: 15, padding: "14px", borderRadius: 14, textDecoration: "none", display: "block" }}>Create Free Account →</Link>
            <Link to="/login"  onClick={onClose} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 15, padding: "14px", borderRadius: 14, textDecoration: "none", display: "block" }}>Sign In →</Link>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4b5563", fontFamily: "'DM Sans',sans-serif", fontSize: 13, cursor: "pointer", marginTop: 18 }}>Maybe later</button>
        </div>
      </div>
    </>
  );
}

// ─── LOCATION PICKER ────────────────────────────────────────
function LocationPicker({ isOpen, onClose, onSelect, selected }) {
  const [search, setSearch] = useState("");
  if (!isOpen) return null;
  const zones = ["Hostel","Off Campus","Gate","Faculty"];
  const filtered = DELIVERY_LOCATIONS.filter(l => l.label.toLowerCase().includes(search.toLowerCase()) || l.zone.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}} .loc-inp{width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px 16px 12px 42px;color:#fff;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;box-sizing:border-box}.loc-inp:focus{border-color:rgba(34,197,94,0.4)}.loc-inp::placeholder{color:rgba(255,255,255,0.25)}`}</style>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 160, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }} />
      <div style={{ animation: "slideUp 0.35s cubic-bezier(0.22,1,0.36,1) both", position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 161, background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px 24px 0 0", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}><div style={{ width: 40, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.15)" }} /></div>
        <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div><h2 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, margin: 0 }}>Where should we deliver?</h2><p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 13, margin: "4px 0 0" }}>Select your FUTO campus location</p></div>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 50, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input className="loc-inp" placeholder="Search location…" value={search} onChange={e => setSearch(e.target.value)} autoFocus />
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "8px 0 20px" }}>
          {zones.map(zone => {
            const zItems = filtered.filter(l => l.zone === zone);
            if (!zItems.length) return null;
            const zc = ZONE_COLOR[zone];
            return (
              <div key={zone}>
                <div style={{ padding: "10px 20px 6px" }}><span style={{ color: zc.color, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>{zone}</span></div>
                {zItems.map(loc => (
                  <div key={loc.id} onClick={() => { onSelect(loc); onClose(); }} style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 14, cursor: "pointer", background: selected?.id === loc.id ? "rgba(34,197,94,0.06)" : "transparent", borderLeft: selected?.id === loc.id ? "2px solid #22c55e" : "2px solid transparent", transition: "background 0.15s" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: zc.bg, border: `1px solid ${zc.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={zc.color} stroke="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14, margin: 0 }}>{loc.label}</p>
                      <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 12, margin: 0 }}>{loc.zone} · FUTO Campus</p>
                    </div>
                    {selected?.id === loc.id && <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg></div>}
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

// ─── CART SIDEBAR ────────────────────────────────────────────
function CartSidebar({ cart, isOpen, onClose, onIncrease, onDecrease, onRemove, onClear, onCheckout }) {
  const deliveryFee = parseInt(localStorage.getItem("kravely_delivery_fee") || "300");
  const totalItems  = cart.reduce((a, i) => a + i.qty, 0);
  const subtotal    = cart.reduce((a, i) => a + i.priceNaira * i.qty, 0);
  const total       = subtotal + deliveryFee;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <>
      <style>{`@keyframes slideInCart{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}} @keyframes fadeCartBg{from{opacity:0}to{opacity:1}}`}</style>
      <div onClick={onClose} style={{ animation: "fadeCartBg 0.25s ease both", position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
      <div style={{ animation: "slideInCart 0.35s cubic-bezier(0.22,1,0.36,1) both", position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 101, width: "clamp(300px,90vw,420px)", background: "#0a0a0a", borderLeft: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", boxShadow: "-20px 0 60px rgba(0,0,0,0.5)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 20, fontFamily: "'Syne',sans-serif", margin: 0 }}>Your Cart</h2>
            {totalItems > 0 && <span style={{ background: "#22c55e", color: "#000", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif" }}>{totalItems}</span>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {cart.length > 0 && <button onClick={onClear} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontSize: 12, padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>Clear all</button>}
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", cursor: "pointer", fontSize: 18, lineHeight: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, paddingBottom: 80 }}>
              <span style={{ fontSize: 52 }}>🛒</span>
              <p style={{ color: "#4b5563", fontSize: 16, fontWeight: 600, fontFamily: "'Syne',sans-serif" }}>Your cart is empty</p>
              <button onClick={onClose} style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", padding: "10px 24px", borderRadius: 50, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 14 }}>Browse Vendors →</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cart.map(item => (
                <div key={item.cartId} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 16px", display: "flex", gap: 12, alignItems: "center", position: "relative" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "'Syne',sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{item.name}</p>
                    <p style={{ color: "#6b7280", fontSize: 12, fontFamily: "'DM Sans',sans-serif", margin: "2px 0 0" }}>{item.vendorName}</p>
                    <p style={{ color: "#22c55e", fontWeight: 800, fontSize: 13, fontFamily: "'DM Sans',sans-serif", margin: "3px 0 0" }}>₦{(item.priceNaira * item.qty).toLocaleString()}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => onDecrease(item.cartId)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "'Syne',sans-serif", minWidth: 18, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => onIncrease(item.cartId)} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                  <button onClick={() => onRemove(item.cartId)} style={{ position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: 5, background: "rgba(239,68,68,0.15)", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {[["Subtotal", `₦${subtotal.toLocaleString()}`, "#fff"],["Delivery fee", `₦${deliveryFee.toLocaleString()}`, "#22c55e"]].map(([l,v,c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{l}</span>
                <span style={{ color: c, fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "8px 0 16px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "'Syne',sans-serif" }}>Total</span>
              <span style={{ color: "#22c55e", fontWeight: 800, fontSize: 18, fontFamily: "'Syne',sans-serif" }}>₦{total.toLocaleString()}</span>
            </div>
            <button onClick={onCheckout} style={{ width: "100%", background: "#22c55e", color: "#000", fontWeight: 800, fontSize: 16, padding: "15px", borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#16a34a"}
              onMouseLeave={e => e.currentTarget.style.background = "#22c55e"}
            >Checkout 🍔</button>
            <p style={{ textAlign: "center", color: "#374151", fontSize: 12, fontFamily: "'DM Sans',sans-serif", marginTop: 10 }}>🔒 Secure payment via Paystack</p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── FLOATING CART BUTTON ────────────────────────────────────
function FloatingCart({ count, onClick }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const h = () => setVis(window.scrollY > 180);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  if (!vis || count === 0) return null;
  return (
    <button onClick={onClick} style={{ position: "fixed", bottom: 28, right: 28, zIndex: 99, background: "#22c55e", border: "none", cursor: "pointer", borderRadius: 50, padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(34,197,94,0.35)", transition: "all 0.25s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.05)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(34,197,94,0.45)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(34,197,94,0.35)"; }}
    >
      <span style={{ fontSize: 18 }}>🛒</span>
      <span style={{ color: "#000", fontWeight: 800, fontSize: 14, fontFamily: "'DM Sans',sans-serif" }}>{count} item{count > 1 ? "s" : ""} in cart</span>
      <span style={{ background: "#000", color: "#22c55e", fontSize: 11, fontWeight: 800, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{count}</span>
    </button>
  );
}

// ─── MEAL CARD ───────────────────────────────────────────────
function MealCard({ item, onAdd }) {
  const [added, setAdded] = useState(false);
  const priceNaira = Math.round((item.price || 0) / 100);
  const handleAdd = () => {
    onAdd({ cartId: item.id, id: item.id, name: item.name, emoji: item.emoji || "🍽️", priceNaira, priceKobo: item.price, vendorName: item.vendors?.name || "" });
    setAdded(true); setTimeout(() => setAdded(false), 1400);
  };
  return (
    <div style={{ background: "#0a0a0a", border: `1px solid ${item.is_sponsored ? "rgba(234,179,8,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 18, overflow: "hidden", flexShrink: 0, width: 178, transition: "all 0.3s ease", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 16px 32px rgba(34,197,94,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ height: 108, background: "linear-gradient(135deg,#0f1f0f,#1a2e1a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 46, position: "relative" }}>
        {item.emoji || "🍽️"}
        {item.is_sponsored && <span style={{ position: "absolute", top: 8, left: 8, background: "rgba(234,179,8,0.9)", color: "#000", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif" }}>⭐ Sponsored</span>}
      </div>
      <div style={{ padding: "10px 12px" }}>
        <p style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{item.name}</p>
        <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 11, marginBottom: 8 }}>{item.vendors?.name || ""}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#22c55e", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 13 }}>₦{priceNaira.toLocaleString()}</span>
          <button onClick={handleAdd} style={{ background: added ? "#16a34a" : "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "5px 11px", fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", cursor: "pointer", transition: "background 0.2s" }}>
            {added ? "✓ Added" : "Add +"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VENDOR CARD ─────────────────────────────────────────────
function VendorCard({ vendor, onOrder }) {
  const isOpen = vendor.is_open;
  return (
    <div style={{ background: "#0a0a0a", border: `1px solid ${vendor.is_featured ? "rgba(234,179,8,0.4)" : "rgba(255,255,255,0.06)"}`, borderRadius: 20, overflow: "hidden", transition: "all 0.3s ease", cursor: "pointer" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = vendor.is_featured ? "rgba(234,179,8,0.6)" : "rgba(34,197,94,0.3)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 40px ${vendor.is_featured ? "rgba(234,179,8,0.1)" : "rgba(34,197,94,0.08)"}`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = vendor.is_featured ? "rgba(234,179,8,0.4)" : "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ height: 140, background: vendor.is_featured ? "linear-gradient(135deg,#1a1200,#2a1f00)" : "linear-gradient(135deg,#0f1f0f,#1a2e1a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 54, position: "relative" }}>
        <span>🍽️</span>
        {vendor.is_featured && (
          <div style={{ position: "absolute", top: 10, left: 10, background: "linear-gradient(135deg,#eab308,#ca8a04)", borderRadius: 50, padding: "4px 12px", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 10 }}>👑</span>
            <span style={{ color: "#000", fontSize: 10, fontWeight: 800, fontFamily: "'DM Sans',sans-serif" }}>Featured</span>
          </div>
        )}
        {!isOpen && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 700, background: "rgba(0,0,0,0.8)", padding: "4px 14px", borderRadius: 50 }}>Closed</span>
          </div>
        )}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 15, margin: 0 }}>{vendor.name}</h3>
          {vendor.rating > 0 && <span style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "3px 8px", borderRadius: 50, fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif", flexShrink: 0, marginLeft: 8 }}>⭐ {vendor.rating}</span>}
        </div>
        <p style={{ color: "#6b7280", fontSize: 13, fontFamily: "'DM Sans',sans-serif", marginBottom: 12 }}>{vendor.description || (vendor.category[0].toUpperCase()+vendor.category.slice(1)+" · "+vendor.location)}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#4b5563", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>🕐 {vendor.delivery_time || "20–30 min"}</span>
          <button onClick={() => isOpen && onOrder(vendor)} disabled={!isOpen} style={{ background: isOpen ? "#22c55e" : "rgba(255,255,255,0.06)", color: isOpen ? "#000" : "#4b5563", border: "none", borderRadius: 50, padding: "7px 16px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12, cursor: isOpen ? "pointer" : "not-allowed", transition: "background 0.2s" }}
            onMouseEnter={e => { if (isOpen) e.currentTarget.style.background = "#16a34a"; }}
            onMouseLeave={e => { if (isOpen) e.currentTarget.style.background = "#22c55e"; }}
          >{isOpen ? "Order Now" : "Closed"}</button>
        </div>
      </div>
    </div>
  );
}

// ─── FEATURED BANNER ─────────────────────────────────────────
function FeaturedBanner({ vendor }) {
  const link = vendor.name.toLowerCase().includes("pearl") ? "/pearls" : vendor.name.toLowerCase().includes("chrissy") ? "/chrissy" : "#";
  return (
    <div style={{ borderRadius: 22, padding: "22px 26px", background: "linear-gradient(135deg,#1a1200,#2d1f00,#1a1200)", border: "1px solid rgba(234,179,8,0.35)", position: "relative", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 0 40px rgba(234,179,8,0.06)" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(234,179,8,0.14)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 40px rgba(234,179,8,0.06)"; }}
    >
      <div style={{ position: "absolute", right: -20, top: -20, fontSize: 120, opacity: 0.07 }}>👑</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ background: "rgba(234,179,8,0.2)", border: "1px solid rgba(234,179,8,0.4)", color: "#eab308", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 50, fontFamily: "'DM Sans',sans-serif" }}>👑 FEATURED VENDOR</span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'DM Sans',sans-serif" }}>Sponsored</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
        <div>
          <h3 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(18px,3vw,26px)", marginBottom: 5, letterSpacing: -0.5 }}>{vendor.name}</h3>
          <p style={{ color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans',sans-serif", fontSize: 14, marginBottom: 8, maxWidth: 400 }}>{vendor.description || "Fresh meals available daily"}</p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[["🕐", vendor.delivery_time || "20–30 min"],["⭐", vendor.rating || "New"],["📍","FUTO Campus"]].map(([icon, text]) => (
              <span key={text} style={{ color: "#eab308", fontSize: 12, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>{icon} {text}</span>
            ))}
          </div>
        </div>
        <Link to={link} style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.35)", color: "#eab308", textDecoration: "none", borderRadius: 50, padding: "11px 22px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(234,179,8,0.2)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(234,179,8,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >View Menu →</Link>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────
export default function OrderNow() {
  const navigate = useNavigate();
  const [category,       setCategory]       = useState("all");
  const [searchQuery,    setSearchQuery]     = useState("");
  const [cart,           setCart]            = useState([]);
  const [cartOpen,       setCartOpen]        = useState(false);
  const [showLogin,      setShowLogin]       = useState(false);
  const [showLocPicker,  setShowLocPicker]   = useState(false);
  const [location,       setLocation]        = useState(null);
  const [user,           setUser]            = useState(null);
  const [authReady,      setAuthReady]       = useState(false);

  // Real data from Supabase
  const { vendors, loading: vL } = usePublicVendors();
  const { items: menuItems, loading: mL } = usePopularItems(12);

  useEffect(() => {
    // Get session once — don't block page render
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Cart actions
  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(i => i.cartId === item.cartId);
      if (ex) return prev.map(i => i.cartId === item.cartId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };
  const increase = (cartId) => setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, qty: i.qty + 1 } : i));
  const decrease = (cartId) => setCart(prev => prev.map(i => i.cartId === cartId ? i.qty === 1 ? null : { ...i, qty: i.qty - 1 } : i).filter(Boolean));
  const remove   = (cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId));
  const clear    = ()        => setCart([]);
  const cartCount = cart.reduce((a, i) => a + i.qty, 0);

  const handleCheckout = () => {
    if (!location) { setCartOpen(false); setShowLocPicker(true); return; }
    setCartOpen(false);
    if (user) { navigate("/checkout", { state: { cart, location } }); }
    else { setShowLogin(true); }
  };

  const handleOrderVendor = (vendor) => {
    if (!user) { setShowLogin(true); return; }
    if (!location) { setShowLocPicker(true); return; }
    setCartOpen(true);
  };

  // Filtered vendors
  const q = searchQuery.toLowerCase().trim();
  const filteredVendors = vendors.filter(v => {
    const matchCat = category === "all" || v.category === category;
    const matchSearch = !q || v.name.toLowerCase().includes(q) || (v.description || "").toLowerCase().includes(q) || v.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });
  const filteredItems = !q ? menuItems : menuItems.filter(i => i.name.toLowerCase().includes(q) || (i.vendors?.name || "").toLowerCase().includes(q));
  const featuredVendors = vendors.filter(v => v.is_featured);

  const isSearching = q.length > 0;

  // No full-page auth block — page renders immediately, auth resolves quietly

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .anim { animation: fadeInUp 0.5s ease both; }
        .meals-scroll::-webkit-scrollbar { display: none; }
        .meals-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .srch { width:100%;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);border-radius:50px;padding:11px 18px 11px 42px;color:#fff;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:all 0.2s; }
        .srch:focus { border-color:rgba(34,197,94,0.4);background:rgba(34,197,94,0.04); }
        .srch::placeholder { color:rgba(255,255,255,0.25); }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#000" }}>
        {showLogin && <LoginPrompt onClose={() => setShowLogin(false)} />}
        <LocationPicker isOpen={showLocPicker} onClose={() => setShowLocPicker(false)} onSelect={setLocation} selected={location} />
        <CartSidebar cart={cart} isOpen={cartOpen} onClose={() => setCartOpen(false)} onIncrease={increase} onDecrease={decrease} onRemove={remove} onClear={clear} onCheckout={handleCheckout} />
        <FloatingCart count={cartCount} onClick={() => setCartOpen(true)} />

        {/* ── NAV ── */}
        <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(0,0,0,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px" }}>
            <Link to="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#22c55e,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(34,197,94,0.3)" }}>
                <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: 20, color: "#000" }}>K</span>
              </div>
            </Link>

            {/* Location pill */}
            <button onClick={() => setShowLocPicker(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: location ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${location ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.08)"}`, borderRadius: 50, padding: "7px 14px", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill={location ? "#22c55e" : "#6b7280"} stroke="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: location ? "#22c55e" : "#6b7280", maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{location ? location.label : "Set location"}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={location ? "#22c55e" : "#6b7280"} strokeWidth="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </button>

            {/* Search */}
            <div style={{ flex: 1, position: "relative" }}>
              <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input className="srch" placeholder="Search vendors, meals…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              {searchQuery && <button onClick={() => setSearchQuery("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>}
            </div>

            {/* Cart */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <button onClick={() => setCartOpen(true)} style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              </button>
              <span style={{ position: "absolute", top: -4, right: -4, background: cartCount > 0 ? "#22c55e" : "#333", color: cartCount > 0 ? "#000" : "#666", fontSize: 9, fontWeight: 800, width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne',sans-serif", transition: "all 0.3s" }}>{cartCount}</span>
            </div>

            {/* Auth */}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                  {user.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}
                </div>
                <button onClick={async () => { await supabase.auth.signOut(); setUser(null); }} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 50, cursor: "pointer" }}>
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/login" style={{ textDecoration: "none", flexShrink: 0, background: "#22c55e", color: "#000", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, padding: "8px 16px", borderRadius: 50, whiteSpace: "nowrap" }}>Sign In</Link>
            )}
          </div>
        </nav>

        {/* Location banner */}
        {!location && (
          <div style={{ background: "rgba(34,197,94,0.06)", borderBottom: "1px solid rgba(34,197,94,0.15)", padding: "10px 20px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <p style={{ color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, margin: 0 }}>📍 Set your delivery location so we know where to bring your food!</p>
              <button onClick={() => setShowLocPicker(true)} style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "7px 18px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Set Location →</button>
            </div>
          </div>
        )}

        {location && (
          <div style={{ background: "rgba(34,197,94,0.04)", borderBottom: "1px solid rgba(34,197,94,0.1)", padding: "7px 20px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ color: "#4b5563", fontFamily: "'DM Sans',sans-serif", fontSize: 12, margin: 0 }}>📍 Delivering to: <strong style={{ color: "#22c55e" }}>{location.label}</strong> · {location.zone}</p>
              <button onClick={() => setShowLocPicker(true)} style={{ background: "none", border: "none", color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>Change</button>
            </div>
          </div>
        )}

        {authReady && user && (
          <div style={{ background: "rgba(34,197,94,0.04)", borderBottom: "1px solid rgba(34,197,94,0.08)", padding: "7px 20px" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <p style={{ color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, margin: 0 }}>
                ✅ Logged in as <strong>{user.user_metadata?.full_name || user.email}</strong> — Ready to order!
              </p>
            </div>
          </div>
        )}

        {/* ── CONTENT ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 16px 100px" }}>

          {/* SEARCH RESULTS */}
          {isSearching && (
            <div className="anim">
              <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginBottom: 22 }}>
                {filteredVendors.length + filteredItems.length} results for "<span style={{ color: "#22c55e" }}>{searchQuery}</span>"
              </p>
              {filteredItems.length > 0 && (
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 14 }}>🍔 Meals</h2>
                  <div className="meals-scroll" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
                    {filteredItems.map(item => <MealCard key={item.id} item={item} onAdd={addToCart} />)}
                  </div>
                </div>
              )}
              {filteredVendors.length > 0 && (
                <div>
                  <h2 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 14 }}>🏪 Vendors</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
                    {filteredVendors.map(v => <VendorCard key={v.id} vendor={v} onOrder={handleOrderVendor} />)}
                  </div>
                </div>
              )}
              {filteredVendors.length === 0 && filteredItems.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0" }}>
                  <p style={{ fontSize: 48, marginBottom: 14 }}>🔍</p>
                  <p style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>No results for "{searchQuery}"</p>
                  <p style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 14 }}>Try "jollof", "rice", "suya" or a vendor name</p>
                </div>
              )}
            </div>
          )}

          {/* MAIN VIEW */}
          {!isSearching && (
            <>
              {/* Greeting */}
              <div className="anim" style={{ marginBottom: 22 }}>
                <p style={{ color: "#6b7280", fontSize: 14, fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
                  {authReady && user?.user_metadata?.full_name ? `Good day, ${user.user_metadata.full_name.split(" ")[0]} 👋` : "Good day 👋"}
                </p>
                <h1 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 900, fontSize: "clamp(22px,4vw,34px)", letterSpacing: -1, marginTop: 4 }}>
                  What are you craving<br />
                  <span style={{ background: "linear-gradient(90deg,#22c55e,#4ade80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>today?</span>
                </h1>
              </div>

              {/* Featured Banners */}
              {vL ? (
                <div className="anim" style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                  <Skeleton w="100%" h={160} r={22} />
                  <Skeleton w="100%" h={160} r={22} />
                </div>
              ) : featuredVendors.length > 0 ? (
                <div className="anim" style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                  {featuredVendors.map(v => <FeaturedBanner key={v.id} vendor={v} />)}
                </div>
              ) : null}

              {/* Free delivery promo */}
              {(!authReady || !user) && (
                <div className="anim" style={{ marginBottom: 26 }}>
                  <div style={{ borderRadius: 18, padding: "18px 22px", background: "linear-gradient(135deg,#14532d,#166634,#15803d)", position: "relative", overflow: "hidden", cursor: "pointer", transition: "transform 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div style={{ position: "absolute", right: -10, top: -10, fontSize: 80, opacity: 0.1 }}>🍔</div>
                    <h3 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Free delivery on your first order! 🎉</h3>
                    <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'DM Sans',sans-serif", fontSize: 13, marginBottom: 14 }}>Sign up now and enjoy free delivery on your very first Kravely order.</p>
                    <button onClick={() => setShowLogin(true)} style={{ background: "#22c55e", color: "#000", border: "none", borderRadius: 50, padding: "8px 20px", fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Claim Offer →</button>
                  </div>
                </div>
              )}

              {/* Category filter */}
              <div className="anim" style={{ marginBottom: 26, overflowX: "auto", paddingBottom: 4 }}>
                <div style={{ display: "flex", gap: 10, minWidth: "max-content" }}>
                  {CATS.map(({ id, label, icon }) => (
                    <button key={id} onClick={() => setCategory(id)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 50, border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", background: category === id ? "#22c55e" : "rgba(255,255,255,0.05)", color: category === id ? "#000" : "rgba(255,255,255,0.6)", boxShadow: category === id ? "0 4px 16px rgba(34,197,94,0.3)" : "none", transform: category === id ? "scale(1.04)" : "scale(1)", transition: "all 0.25s" }}>
                      <span style={{ fontSize: 15 }}>{icon}</span>{label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Meals */}
              <div className="anim" style={{ marginBottom: 34 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h2 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, margin: 0 }}>🍔 Popular Meals</h2>
                  <span style={{ color: "#22c55e", fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600 }}>Tap to add to cart</span>
                </div>
                <div className="meals-scroll" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8 }}>
                  {mL ? (
                    Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} w={178} h={200} r={18} />)
                  ) : menuItems.length === 0 ? (
                    <p style={{ color: "#4b5563", fontFamily: "'DM Sans',sans-serif", fontSize: 14, padding: "20px 0" }}>No menu items yet — check back soon!</p>
                  ) : (
                    menuItems.map((item, i) => (
                      <div key={item.id} style={{ animation: `fadeInUp 0.5s ease ${i * 0.06}s both` }}>
                        <MealCard item={item} onAdd={addToCart} />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Vendors */}
              <div className="anim">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h2 style={{ color: "#fff", fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, margin: 0 }}>🏪 Browse Vendors</h2>
                  <span style={{ color: "#6b7280", fontFamily: "'DM Sans',sans-serif", fontSize: 13 }}>{vL ? "Loading…" : `${filteredVendors.length} vendors`}</span>
                </div>
                {vL ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} w="100%" h={240} r={20} />)}
                  </div>
                ) : filteredVendors.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <p style={{ fontSize: 48, marginBottom: 14 }}>🍽️</p>
                    <p style={{ color: "#4b5563", fontFamily: "'DM Sans',sans-serif", fontSize: 16 }}>{vendors.length === 0 ? "No vendors available yet" : "No vendors in this category"}</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
                    {filteredVendors.map((v, i) => (
                      <div key={v.id} style={{ animation: `fadeInUp 0.5s ease ${i * 0.06}s both` }}>
                        <VendorCard vendor={v} onOrder={handleOrderVendor} />
                      </div>
                    ))}
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
