import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import pearlsImage from "../assets/images/pearlslogo.jpeg";
import chrissyLogo from "../assets/images/chrissylogo.jpeg";
import {
  Search,
  MapPin,
  ShoppingBag,
  User,
  ChevronDown,
  X,
  Plus,
  Minus,
  Clock3,
  Star,
  Filter,
  Sparkles,
  Truck,
  Package,
  CookingPot,
  Salad,
  Soup,
  Sandwich,
  CupSoda,
  LayoutGrid,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
  ArrowRight,
  Heart,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { usePublicVendors, usePopularItems } from "../hooks/useKravelyData";

const DELIVERY_LOCATIONS = [
  { id: "umuchima", label: "Umuchima", zone: "Hostel" },
  { id: "hostel-ab", label: "Hostels A & B", zone: "Hostel" },
  { id: "hostel-cd", label: "Hostels C & D", zone: "Hostel" },
  { id: "eziobodo", label: "Eziobodo", zone: "Off Campus" },
  { id: "ihiagwa", label: "Ihiagwa", zone: "Off Campus" },
  { id: "obinze", label: "Obinze", zone: "Off Campus" },
  { id: "backgate", label: "Backgate Area", zone: "Gate" },
  { id: "maingate", label: "Main Gate", zone: "Gate" },
  { id: "engineering", label: "Engineering Faculty", zone: "Faculty" },
  { id: "ict", label: "ICT Building", zone: "Faculty" },
  { id: "saat", label: "SAAT Faculty", zone: "Faculty" },
  { id: "library", label: "FUTO Library", zone: "Faculty" },
];

const ZONE_META = {
  Hostel: { color: "#22c55e", bg: "rgba(34,197,94,0.12)", border: "rgba(34,197,94,0.28)" },
  "Off Campus": { color: "#60a5fa", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.28)" },
  Gate: { color: "#f97316", bg: "rgba(249,115,22,0.12)", border: "rgba(249,115,22,0.28)" },
  Faculty: { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.28)" },
};

const CATS = [
  { id: "all", label: "Browse All", Icon: LayoutGrid },
  { id: "local", label: "Local Meals", Icon: CookingPot },
  { id: "rice", label: "Rice Dishes", Icon: Salad },
  { id: "soups", label: "Soups", Icon: Soup },
  { id: "snacks", label: "Snacks", Icon: Sandwich },
  { id: "drinks", label: "Drinks", Icon: CupSoda },
  { id: "combos", label: "Combos", Icon: Package },
];

const STATIC_DISHES = [
  { name: "Jollof Rice & Chicken", vendorName: "Pearl's Cuisine", price: 2500, image: "https://images.unsplash.com/photo-1512058556646-c4da40fba323?w=900&q=80", category: "rice", time: "26 - 36 mins" },
  { name: "Pounded Yam & Egusi", vendorName: "Chrissy Cuisine", price: 2800, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=80", category: "soups", time: "25 - 35 mins" },
  { name: "Fried Rice & Chicken", vendorName: "Pearl's Cuisine", price: 2400, image: "https://images.unsplash.com/photo-1604908176997-431af5e3c6f0?w=900&q=80", category: "rice", time: "27 - 37 mins" },
  { name: "Chicken Noodles", vendorName: "Chrissy Cuisine", price: 2200, image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=900&q=80", category: "snacks", time: "15 - 25 mins" },
  { name: "Beans Porridge", vendorName: "Pearl's Cuisine", price: 2200, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=80", category: "local", time: "20 - 30 mins" },
  { name: "Ofada Rice & Stew", vendorName: "Pearl's Cuisine", price: 2600, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80", category: "rice", time: "25 - 35 mins" },
  { name: "Efo Riro & Pounded Yam", vendorName: "Chrissy Cuisine", price: 2700, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=900&q=80", category: "soups", time: "25 - 35 mins" },
  { name: "Ayamase & White Rice", vendorName: "Chrissy Cuisine", price: 2500, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=900&q=80", category: "rice", time: "25 - 35 mins" },
  { name: "Pepper Soup", vendorName: "Chrissy Cuisine", price: 2300, image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=900&q=80", category: "soups", time: "15 - 25 mins" },
  { name: "Suya & Plantain", vendorName: "Pearl's Cuisine", price: 2400, image: "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=900&q=80", category: "snacks", time: "20 - 30 mins" },
];

const FEATURED_SLIDES = [
  {
    id: "pearls",
    name: "Pearl's Cuisine",
    image:pearlsImage,
    desc: "Delicious meals made with love and quality.",
    time: "20 - 30 min",
    link: "/pearls",
  },
  {
    id: "chrissy",
    name: "Chrissy Cuisine",
    desc: "Fresh local delicacies prepared daily at Umuchima.",
    image: chrissyLogo,
    time: "25 - 35 min",
    link: "/chrissy",
  },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#070707}
:root{
  --bg:#070707;
  --bg2:#0e0e0f;
  --bg3:#121214;
  --line:rgba(255,255,255,.08);
  --soft:rgba(255,255,255,.05);
  --text:#fff;
  --muted:#9ca3af;
  --green:#22c55e;
  --green2:#16a34a;
}
.kv{font-family:'DM Sans',sans-serif;background:var(--bg);min-height:100vh;color:var(--text)}
.syne{font-family:'Syne',sans-serif}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%,100%{opacity:.35}50%{opacity:.68}}
@keyframes live{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes mobileDrop{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
.pageIn{animation:fadeUp .48s ease both}
.sh::-webkit-scrollbar{display:none}
.sh{overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
.srch{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:15px 18px 15px 46px;color:#fff;font-family:'DM Sans',sans-serif;font-size:15px;outline:none}
.srch::placeholder{color:rgba(255,255,255,.26)}
.srch:focus{border-color:rgba(34,197,94,.4);background:rgba(34,197,94,.03)}
.lsrch{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:12px 16px 12px 42px;color:#fff;font-size:14px;font-family:'DM Sans',sans-serif;outline:none}
.lsrch::placeholder{color:rgba(255,255,255,.25)}
.cardHover{transition:transform .24s ease, box-shadow .24s ease, border-color .24s ease}
.cardHover:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.45)}
@media (max-width: 1024px){.hero-grid{grid-template-columns:1fr!important}.top-grid{grid-template-columns:1fr!important}}
@media (max-width: 820px){.desktop-nav{display:none!important}.mobile-nav{display:flex!important}.filters-row{display:none!important}.food-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.vendor-grid{grid-template-columns:1fr!important}}
@media (max-width: 560px){.food-grid{grid-template-columns:1fr!important}.hero-content{padding:22px!important}.featured-copy{max-width:100%!important}.topbar-grid{grid-template-columns:1fr!important}}
`;

function Skeleton({ w = "100%", h = 20, r = 12, style = {} }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: "rgba(255,255,255,.06)", animation: "shimmer 1.4s ease infinite", ...style }} />;
}

function KLogo({ size = 40 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 12, background: "var(--green)", display: "grid", placeItems: "center", flexShrink: 0 }}>
      <span className="syne" style={{ color: "#000", fontWeight: 800, fontSize: size * 0.55, lineHeight: 1 }}>K</span>
    </div>
  );
}

function TopNav({ user, cartCount, onCart, onLoc, location, q, setQ, cat, setCat, onSignOut, navigate  }) {
  const [showCompactMobile, setShowCompactMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerWidth > 768) {
        setShowCompactMobile(false);
        return;
      }
      setShowCompactMobile(window.scrollY > 110);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    
    <nav style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(7,7,7,.96)", backdropFilter: "blur(14px)", borderBottom: "1px solid var(--line)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 18px" }}>
        <div className="desktop-nav topbar-grid" style={{ display: "grid", gridTemplateColumns: "auto 260px 1fr auto auto", gap: 12, alignItems: "center" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <KLogo />
            <span className="syne" style={{ color: "#fff", fontWeight: 800, fontSize: 25, letterSpacing: -1 }}>Kravely</span>
          </Link>

          <button onClick={onLoc} style={{ background: "var(--soft)", border: "1px solid var(--line)", borderRadius: 18, minHeight: 62, padding: "0 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <MapPin size={18} color={location ? "#22c55e" : "#9ca3af"} />
            <div style={{ textAlign: "left", minWidth: 0, flex: 1 }}>
              <div style={{ color: "#6b7280", fontSize: 10, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>Delivery to</div>
              <div style={{ color: location ? "#22c55e" : "#fff", fontSize: 14, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{location ? location.label : "Set your location"}</div>
            </div>
            <ChevronDown size={16} color={location ? "#22c55e" : "#9ca3af"} />
          </button>

          <div style={{ position: "relative" }}>
            <Search size={18} color="rgba(255,255,255,.3)" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }} />
            <input className="srch" placeholder="Food, drinks, groceries etc" value={q} onChange={(e) => setQ(e.target.value)} />
            {q && (
              <button onClick={() => setQ("")} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                <X size={16} />
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
             onClick={() => {
               if (!user) {
                 alert("Please login to view your favourites");
                 return;
               }
           
               navigate("/favourites");
             }}
             style={{
               width: 54,
               height: 54,
               borderRadius: "999px",
               border: "1px solid var(--line)",
               background: "var(--soft)",
               color: "#fff",
               display: "grid",
               placeItems: "center",
               cursor: "pointer",
             }}
             >
               <Heart size={21} />
             </button>
            <button onClick={onCart} style={{ position: "relative", width: 70, height: 54, borderRadius: "999px", border: "1px solid var(--line)", background: "var(--soft)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
              <ShoppingBag size={20} />
              <span className="syne" style={{ fontWeight: 700, fontSize: 17 }}>{cartCount}</span>
            </button>
          </div>

          {user ? (
            <div style={{ minWidth: 170, height: 56, borderRadius: "999px", background: "#0b5d39", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "0 12px 0 10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#f4d7df", color: "#0b5d39", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14 }}>
                  {user.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>Profile</span>
              </div>
              <button
                onClick={onSignOut}
                title="Sign out"
                style={{ background: "none", border: "none", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer" }}
              >
                <X size={20} color="#fff" />
              </button>
            </div>
          ) : (
            <Link to="/otpLogin" style={{ textDecoration: "none", minWidth: 130, height: 56, borderRadius: "999px", background: "#0b5d39", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 700 }}> 
              <User size={16} /> Sign In
            </Link>
          )}
        </div>

        <div className="mobile-nav" style={{ display: "none", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link to="/" style={{ textDecoration: "none" }}><KLogo size={36} /></Link>

            {!showCompactMobile && (
              <button onClick={onLoc} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--soft)", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 12px", cursor: "pointer" }}>
                <MapPin size={14} color={location ? "#22c55e" : "#9ca3af"} />
                <span style={{ flex: 1, textAlign: "left", color: location ? "#22c55e" : "#fff", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{location ? location.label : "Set location"}</span>
                <ChevronDown size={14} color="#9ca3af" />
              </button>
            )}

            {showCompactMobile && (
              <div style={{ position: "relative", flex: 1, animation: "mobileDrop .28s ease both" }}>
                <Search size={16} color="rgba(255,255,255,.3)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input className="srch" style={{ padding: "12px 14px 12px 42px", width: "100%" }} placeholder="Search meals or vendors" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
            )}

            <button onClick={onCart} style={{ position: "relative", width: 42, height: 42, borderRadius: 12, border: "1px solid var(--line)", background: "var(--soft)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}>
              <ShoppingBag size={18} />
              {cartCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, minWidth: 16, height: 16, borderRadius: "999px", background: "var(--green)", color: "#000", display: "grid", placeItems: "center", fontSize: 9, fontWeight: 800 }}>{cartCount}</span>}
            </button>

            {user ? (
              <button onClick={onSignOut} title="Sign out" style={{ minWidth: showCompactMobile ? 112 : 98, height: 42, borderRadius: "999px", background: "#0b5d39", border: "1px solid rgba(255,255,255,.08)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "0 10px 0 8px", cursor: "pointer", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f4d7df", color: "#0b5d39", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12 }}>
                    {user.user_metadata?.full_name?.[0]?.toUpperCase() || "U"}
                  </div>
                  {!showCompactMobile && <span style={{ fontWeight: 700, fontSize: 12, color: "#fff" }}>Profile</span>}
                </div>
                <User size={15} color="#fff" />
              </button>
            ) : (
              <Link to="/login" style={{ textDecoration: "none", minWidth: showCompactMobile ? 46 : 96, height: 42, borderRadius: "999px", background: "#0b5d39", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 700, fontSize: 12, padding: showCompactMobile ? "0" : "0 12px", flexShrink: 0 }}>
                <User size={15} />
                {!showCompactMobile && "Profile"}
              </Link>
            )}
          </div>

          {!showCompactMobile && (
            <div style={{ position: "relative" }}>
              <Search size={16} color="rgba(255,255,255,.3)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input className="srch" style={{ padding: "12px 14px 12px 42px" }} placeholder="Search meals or vendors" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          )}
        </div>

        <div className="sh" style={{ display: "flex", gap: 18, overflowX: "auto", marginTop: 14, paddingBottom: 4 }}>
          {CATS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setCat(id)} style={{ display: "inline-flex", alignItems: "center", gap: 9, background: "none", border: "none", borderBottom: cat === id ? "3px solid var(--green)" : "3px solid transparent", color: cat === id ? "#fff" : "#b4b4b8", padding: "12px 2px", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", cursor: "pointer" }}>
              <Icon size={18} color={cat === id ? "#22c55e" : "#b4b4b8"} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function LocationPicker({ open, onClose, onSelect, selected }) {
  const [q, setQ] = useState("");
  if (!open) return null;
  const zones = ["Hostel", "Off Campus", "Gate", "Faculty"];
  const filtered = DELIVERY_LOCATIONS.filter((l) => l.label.toLowerCase().includes(q.toLowerCase()) || l.zone.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,.72)", backdropFilter: "blur(6px)", animation: "fadeIn .25s ease both" }} />
      <div style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 101, background: "#0e0e0f", borderTop: "1px solid var(--line)", borderRadius: "22px 22px 0 0", maxHeight: "82vh", display: "flex", flexDirection: "column", animation: "fadeUp .28s ease both" }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}><div style={{ width: 38, height: 4, borderRadius: 2, background: "rgba(255,255,255,.15)" }} /></div>
        <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <p className="syne" style={{ fontSize: 22, color: "#fff", fontWeight: 800 }}>Where should we deliver?</p>
              <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>Select your FUTO campus location</p>
            </div>
            <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: "999px", background: "var(--soft)", border: "1px solid var(--line)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer" }}><X size={16} /></button>
          </div>
          <div style={{ position: "relative" }}>
            <Search size={15} color="rgba(255,255,255,.3)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input className="lsrch" placeholder="Search location…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
          </div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, paddingBottom: 24 }}>
          {zones.map((zone) => {
            const items = filtered.filter((l) => l.zone === zone);
            if (!items.length) return null;
            const meta = ZONE_META[zone];
            return (
              <div key={zone}>
                <div style={{ padding: "12px 20px 6px", color: meta.color, fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{zone}</div>
                {items.map((loc) => (
                  <button key={loc.id} onClick={() => { onSelect(loc); onClose(); }} style={{ width: "100%", background: selected?.id === loc.id ? "rgba(34,197,94,.06)" : "transparent", border: "none", borderLeft: `2px solid ${selected?.id === loc.id ? "#22c55e" : "transparent"}`, display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", textAlign: "left", cursor: "pointer" }}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: meta.bg, border: `1px solid ${meta.border}`, display: "grid", placeItems: "center", flexShrink: 0 }}><MapPin size={14} color={meta.color} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{loc.label}</div>
                      <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 2 }}>{loc.zone} · FUTO Campus</div>
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function LoginModal({ onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 120, background: "rgba(0,0,0,.82)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#0f0f0f", border: "1px solid var(--line)", borderRadius: 22, padding: "32px 28px", width: "100%", maxWidth: 360, textAlign: "center", animation: "fadeUp .28s ease both" }}>
        <div style={{ width: 54, height: 54, borderRadius: 16, background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.18)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}><User size={22} color="#22c55e" /></div>
        <p className="syne" style={{ color: "#fff", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Login to order food</p>
        <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.7, marginBottom: 22 }}>You need a Kravely account to order. Free and takes under a minute.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link to="/signup" onClick={onClose} style={{ background: "#22c55e", color: "#000", padding: "13px", borderRadius: 12, textDecoration: "none", fontWeight: 800 }}>Create Free Account</Link>
          <Link to="/login" onClick={onClose} style={{ background: "rgba(255,255,255,.05)", border: "1px solid var(--line)", color: "#fff", padding: "13px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>Sign In</Link>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7280", marginTop: 14, cursor: "pointer" }}>Maybe later</button>
      </div>
    </div>
  );
}

function CartSidebar({ cart, open, onClose, onInc, onDec, onRemove, onClear, onCheckout }) {
  const fee = parseInt(localStorage.getItem("kravely_delivery_fee") || "300");
  const subtotal = cart.reduce((a, i) => a + i.priceNaira * i.qty, 0);
  const total = subtotal + fee;
  const count = cart.reduce((a, i) => a + i.qty, 0);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 130, background: "rgba(0,0,0,.65)", backdropFilter: "blur(5px)", animation: "fadeIn .2s ease both" }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 131, width: "clamp(290px,90vw,420px)", background: "#0f0f0f", borderLeft: "1px solid var(--line)", display: "flex", flexDirection: "column", animation: "slideIn .28s ease both" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <p className="syne" style={{ color: "#fff", fontSize: 24, fontWeight: 800 }}>Your Cart</p>
            {count > 0 && <span style={{ background: "#22c55e", color: "#000", fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999 }}>{count}</span>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {cart.length > 0 && <button onClick={onClear} style={{ background: "rgba(255,255,255,.05)", border: "1px solid var(--line)", color: "#9ca3af", fontSize: 12, padding: "6px 11px", borderRadius: 8, cursor: "pointer" }}>Clear all</button>}
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,.06)", border: "1px solid var(--line)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer" }}><X size={15} /></button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 22px" }}>
          {cart.length === 0 ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
              <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.14)", display: "grid", placeItems: "center" }}><ShoppingBag size={24} color="#22c55e" /></div>
              <p style={{ color: "#6b7280", fontSize: 14 }}>Your cart is empty</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cart.map((item) => (
                <div key={item.cartId} style={{ background: "rgba(255,255,255,.03)", border: "1px solid var(--line)", borderRadius: 14, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(34,197,94,.08)", display: "grid", placeItems: "center" }}><Package size={16} color="#22c55e" /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                    <p style={{ color: "#9ca3af", fontSize: 11, marginTop: 2 }}>{item.vendorName}</p>
                    <p className="syne" style={{ color: "#22c55e", fontSize: 16, fontWeight: 800, marginTop: 3 }}>₦{(item.priceNaira * item.qty).toLocaleString()}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => onDec(item.cartId)} style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(255,255,255,.06)", border: "1px solid var(--line)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer" }}><Minus size={12} /></button>
                    <span style={{ color: "#fff", fontWeight: 700, minWidth: 16, textAlign: "center", fontSize: 14 }}>{item.qty}</span>
                    <button onClick={() => onInc(item.cartId)} style={{ width: 26, height: 26, borderRadius: 8, background: "rgba(255,255,255,.06)", border: "1px solid var(--line)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer" }}><Plus size={12} /></button>
                  </div>
                  <button onClick={() => onRemove(item.cartId)} style={{ width: 22, height: 22, borderRadius: 7, background: "rgba(239,68,68,.12)", border: "none", color: "#ef4444", display: "grid", placeItems: "center", cursor: "pointer" }}><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: "18px 22px", borderTop: "1px solid var(--line)" }}>
            {[ ["Subtotal", `₦${subtotal.toLocaleString()}`, "#fff"], ["Delivery fee", `₦${fee.toLocaleString()}`, "#22c55e"] ].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#9ca3af", fontSize: 13 }}>{l}</span>
                <span style={{ color: c, fontSize: 13, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: "var(--line)", margin: "10px 0 14px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span className="syne" style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>Total</span>
              <span className="syne" style={{ color: "#22c55e", fontSize: 22, fontWeight: 800 }}>₦{total.toLocaleString()}</span>
            </div>
            <button onClick={onCheckout} style={{ width: "100%", background: "#22c55e", color: "#000", border: "none", borderRadius: 14, padding: "14px", fontWeight: 800, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <ShoppingBag size={16} /> Checkout
            </button>
            <p style={{ textAlign: "center", color: "#52525b", fontSize: 11, marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><ShieldCheck size={12} /> Secure payment via Paystack</p>
          </div>
        )}
      </div>
    </>
  );
}

function FeaturedSlider({ vendors }) {
  const slides = useMemo(() => {
    const base = FEATURED_SLIDES.map((slide) => {
      const live = vendors.find((v) => slide.name.toLowerCase().includes(v.name.toLowerCase().split(" ")[0].toLowerCase()) || v.name.toLowerCase().includes(slide.name.toLowerCase().split(" ")[0].toLowerCase()));
      return live ? { ...slide, rating: live.rating || slide.rating, time: live.delivery_time || slide.time } : slide;
    });
    return base;
  }, [vendors]);

  const [idx, setIdx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => setIdx((p) => (p + 1) % slides.length), 4500);
    return () => clearInterval(intervalRef.current);
  }, [slides.length]);

  const current = slides[idx];

  return (
    <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", minHeight: 420, border: "1px solid rgba(255,255,255,.08)", background: "#0b0b0c" }}>
      {slides.map((slide, i) => (
        <div key={slide.id} style={{ position: "absolute", inset: 0, backgroundImage: `url(${slide.image})`, backgroundSize: "cover", backgroundPosition: "center", opacity: i === idx ? 1 : 0, transition: "opacity .7s ease" }} />
      ))}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,.55) 45%, rgba(0,0,0,.18) 100%)" }} />
      <div className="hero-content" style={{ position: "relative", zIndex: 2, padding: 36, height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div className="featured-copy" style={{ maxWidth: 420 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, background: "rgba(34,197,94,.14)", border: "1px solid rgba(34,197,94,.24)", marginBottom: 16 }}>
            <Sparkles size={12} color="#22c55e" />
            <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 800, letterSpacing: ".08em" }}>FEATURED VENDOR</span>
          </div>
          <h1 className="syne" style={{ fontSize: "clamp(42px,5vw,64px)", lineHeight: .95, letterSpacing: -2, fontWeight: 800, marginBottom: 12 }}>
            {current.name.split(" ")[0]}<br />
            <span style={{ color: "#22c55e" }}>{current.name.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,.72)", fontSize: 16, lineHeight: 1.75, marginBottom: 18 }}>{current.desc}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.08)", borderRadius: 999, padding: "7px 12px", fontSize: 13 }}><Star size={14} color="#facc15" fill="#facc15" /> {current.rating} ({current.reviews})</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.08)", borderRadius: 999, padding: "7px 12px", fontSize: 13 }}><Clock3 size={14} /> {current.time}</span>
          </div>
          <Link to={current.link} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#22c55e", color: "#000", borderRadius: 14, padding: "14px 22px", textDecoration: "none", fontWeight: 800 }}>
            Order Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <button onClick={() => setIdx((p) => (p - 1 + slides.length) % slides.length)} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "999px", background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer", zIndex: 3 }}><ChevronLeft size={22} /></button>
      <button onClick={() => setIdx((p) => (p + 1) % slides.length)} style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "999px", background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer", zIndex: 3 }}><ChevronRight size={22} /></button>
      <div style={{ position: "absolute", left: "50%", bottom: 18, transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 3 }}>
        {slides.map((_, i) => <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 24 : 8, height: 8, borderRadius: 999, background: i === idx ? "#22c55e" : "rgba(255,255,255,.35)", border: "none", cursor: "pointer" }} />)}
      </div>
    </div>
  );
}

function MealCard({ item, onAdd, fallback, onFavourite, favourites = [] }) {
  const [added, setAdded] = useState(false);

  const name = item.name || fallback.name;
  const vendorName = item.vendors?.name || item.vendorName || fallback.vendorName;
  const image = item.image_url || item.image || fallback.image;
  const time = item.time || fallback.time;

  const priceNaira = item.priceNaira
    ? item.priceNaira
    : item.priceKobo
    ? Math.round(item.priceKobo / 100)
    : item.price
    ? item.price > 1000
      ? item.price
      : Math.round(item.price / 100)
    : fallback.price;

  const itemId = item.id || `${name}-${vendorName}`;

  const isLiked = favourites.some(
    (fav) => fav.item_id === itemId && fav.item_type === "meal"
  );

  const handleAdd = () => {
    onAdd({
      cartId: itemId,
      id: itemId,
      name,
      priceNaira,
      priceKobo: priceNaira * 100,
      vendorName,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleFavouriteClick = () => {
    console.log("Heart clicked:", name);

    if (typeof onFavourite !== "function") {
      console.log("onFavourite is not connected");
      return;
    }

    onFavourite(
      {
        ...item,
        id: itemId,
        name,
        vendorName,
        image_url: image,
        priceNaira,
      },
      "meal"
    );
  };

  return (
    <div className="cardHover" style={{ background: "#0f0f10", border: "1px solid rgba(255,255,255,.07)", borderRadius: 22, overflow: "hidden" }}>
      <div style={{ position: "relative", height: 190, overflow: "hidden" }}>
        <img src={image} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(0,0,0,.65) 0%,transparent 45%)" }} />

        <button
          onClick={handleFavouriteClick}
          title={isLiked ? "Remove from favourites" : "Add to favourites"}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 38,
            height: 38,
            borderRadius: "999px",
            background: "rgba(255,255,255,.9)",
            border: "none",
            color: isLiked ? "red" : "#0b5d39",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            zIndex: 5,
          }}
        >
          <Heart size={18} fill={isLiked ? "red" : "none"} />
        </button>

        <button onClick={handleAdd} style={{ position: "absolute", right: 12, bottom: 12, width: 42, height: 42, borderRadius: "999px", background: "#0b8f4a", border: "2px solid rgba(255,255,255,.65)", color: "#fff", display: "grid", placeItems: "center", cursor: "pointer" }}>
          <Plus size={18} />
        </button>
      </div>
      <div style={{ padding: "14px 14px 16px" }}>
        <div className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{name}</div>
        <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 10 }}>{vendorName}</div>
        <div className="syne" style={{ color: "#22c55e", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>₦{priceNaira.toLocaleString()}</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", color: "#b4b4b8", fontSize: 12 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock3 size={13} /> {time}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#8b5cf6" }}><Truck size={13} /> No Delivery Fee</span>
        </div>
      </div>
    </div>
  );
}

function VendorCard({ vendor, fallbackImage, onOrder }) {
  const lowerName = vendor.name?.toLowerCase?.() || "";
  const image = vendor.logo_url || (lowerName.includes("pearl") ? pearlsImage : lowerName.includes("chrissy") ? chrissyLogo : fallbackImage);
  return (
    <div className="cardHover" style={{ background: "#0f0f10", border: `1px solid ${vendor.is_featured ? 'rgba(234,179,8,.24)' : 'rgba(255,255,255,.07)'}`, borderRadius: 22, overflow: "hidden" }}>
      <div style={{ position: "relative", height: 210 }}>
        <img src={image} alt={vendor.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg,rgba(0,0,0,.72) 0%,transparent 46%)" }} />
        {vendor.is_featured && <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(34,197,94,.14)", border: "1px solid rgba(34,197,94,.24)", borderRadius: 999, padding: "6px 10px", color: "#22c55e", fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 6 }}><Sparkles size={12} /> FEATURED</div>}
        <button style={{ position: "absolute", top: 12, right: 12, width: 38, height: 38, borderRadius: "999px", background: "rgba(255,255,255,.92)", border: "none", color: "#0b5d39", display: "grid", placeItems: "center", cursor: "pointer" }}><Heart size={18} /></button>
      </div>
      <div style={{ padding: 16 }}>
        <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{vendor.name}</div>
        <div style={{ color: "#9ca3af", fontSize: 13, marginBottom: 10 }}>{vendor.category?.[0]?.toUpperCase() + vendor.category?.slice(1) || 'Local Meals'} · {vendor.location || 'FUTO'}</div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 14, color: "#d4d4d8", fontSize: 13 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Star size={14} color="#facc15" fill="#facc15" /> {vendor.rating || 4.6}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><Clock3 size={14} /> {vendor.delivery_time || '20 - 30 min'}</span>
        </div>
        <button onClick={() => onOrder(vendor)} style={{ width: "100%", background: vendor.is_open === false ? "rgba(255,255,255,.08)" : "#0b5d39", color: vendor.is_open === false ? "#6b7280" : "#fff", border: "none", borderRadius: 999, padding: "12px 16px", fontWeight: 700, cursor: vendor.is_open === false ? "not-allowed" : "pointer" }} disabled={vendor.is_open === false}>
          {vendor.is_open === false ? 'Closed' : 'Order Now'}
        </button>
      </div>
    </div>
  );
}

export default function OrderNow() {
  const navigate = useNavigate();

    //Sign Out
    const handleSignOut = async () => {
      const { error } = await supabase.auth.signOut();

      if(error) {
        console.log("Error signing out:", error.message);
      } else {
        navigate("/order");
      } 
    };
    


  

  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLoc, setShowLoc] = useState(false);
  const [location, setLocation] = useState(null);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [favourites, setFavourites] = useState([]);


  const { vendors, loading: vL } = usePublicVendors();
  const { items: meals, loading: mL } = usePopularItems(12);

  useEffect(() => {
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
     useEffect(() => {
    const loadFavourites = async () => {
      if (!user) {
        setFavourites([]);
        return;
      }

      const { data, error } = await supabase
        .from("favourites")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.log("Favourite load error:", error.message);
        return;
      }

      setFavourites(data || []);
    };

    loadFavourites();
  }, [user]);

   const toggleFavourite = async (item, type) => {
    console.log("toggleFavourite running:", item, type, user);

    if (!user) {
      setShowLogin(true);
      return;
    }

    const itemId = item.id || item.name;

    const alreadyLiked = favourites.find(
      (fav) => fav.item_id === itemId && fav.item_type === type
    );

    if (alreadyLiked) {
      setFavourites((prev) => prev.filter((fav) => fav.id !== alreadyLiked.id));

      const { error } = await supabase
        .from("favourites")
        .delete()
        .eq("id", alreadyLiked.id);

      if (error) {
        console.log("Remove favourite error:", error.message);
        setFavourites((prev) => [...prev, alreadyLiked]);
      }

      return;
    }

    const newFavourite = {
      user_id: user.id,
      item_id: itemId,
      item_type: type,
      item_name: item.name,
      vendor_name: item.vendorName || item.vendors?.name || item.name,
      image_url: item.image_url || item.logo_url || item.image,
      price_naira: item.priceNaira || item.price || null,
    };

    const temporaryFavourite = {
      id: `temp-${itemId}`,
      ...newFavourite,
    };

    setFavourites((prev) => [...prev, temporaryFavourite]);

    const { data, error } = await supabase
      .from("favourites")
      .insert(newFavourite)
      .select()
      .single();

    if (error) {
      console.log("Add favourite error:", error.message);
      setFavourites((prev) => prev.filter((fav) => fav.id !== temporaryFavourite.id));
      return;
    }

    setFavourites((prev) =>
      prev.map((fav) => (fav.id === temporaryFavourite.id ? data : fav))
    );
  };
 
  const addToCart = (item) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.cartId === item.cartId);
      if (ex) return prev.map((i) => i.cartId === item.cartId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };
  const inc = (id) => setCart((prev) => prev.map((i) => i.cartId === id ? { ...i, qty: i.qty + 1 } : i));
  const dec = (id) => setCart((prev) => prev.map((i) => i.cartId === id ? (i.qty === 1 ? null : { ...i, qty: i.qty - 1 }) : i).filter(Boolean));
  const rem = (id) => setCart((prev) => prev.filter((i) => i.cartId !== id));
  const clr = () => setCart([]);
  const cartCount = cart.reduce((a, i) => a + i.qty, 0);

  const handleCheckout = () => {
    if (!location) {
      setCartOpen(false);
      setShowLoc(true);
      return;
    }
    if (!user) {
      setCartOpen(false);
      setShowLogin(true);
      return;
    }
    navigate("/checkout", { state: { cart, location } });
  };

  const handleOrderVendor = (vendor) => {
    if (!user) { setShowLogin(true); return; }
    if (!location) { setShowLoc(true); return; }
    navigate(vendor.name.toLowerCase().includes("pear") ? "/pearls" : vendor.name.toLowerCase().includes("chrissy") ? "/chrissy" : "/checkout", { state: { vendor } });
  };

  const qLower = q.toLowerCase().trim();
  const mealPool = meals.length ? meals : STATIC_DISHES.map((d, i) => ({ id: `static-${i}`, ...d, priceNaira: d.price }));
  const vendorPool = vendors.length ? vendors : [
    { id: 'p1', name: "Pearl's Cuisine", rating: 4.7, delivery_time: '20 - 30 min', is_featured: true, is_open: true, category: 'local', location: 'FUTO' },
    { id: 'c1', name: 'Chrissy Cuisine', rating: 4.8, delivery_time: '25 - 35 min', is_featured: true, is_open: true, category: 'soups', location: 'FUTO' },
  ];

  const filteredMeals = mealPool.filter((item, index) => {
    const fallback = STATIC_DISHES[index % STATIC_DISHES.length];
    const mealCat = item.category || fallback.category;
    const matchCat = cat === 'all' || mealCat === cat;
    const matchSearch = !qLower || (item.name || fallback.name).toLowerCase().includes(qLower) || (item.vendors?.name || item.vendorName || fallback.vendorName).toLowerCase().includes(qLower);
    return matchCat && matchSearch;
  });

  const filteredVendors = vendorPool.filter((vendor) => {
    const matchCat = cat === 'all' || vendor.category === cat;
    const matchSearch = !qLower || vendor.name.toLowerCase().includes(qLower) || (vendor.description || '').toLowerCase().includes(qLower);
    return matchCat && matchSearch;
  });


  return (
    <>
      <style>{CSS}</style>
      <div className="kv">
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        <LocationPicker open={showLoc} onClose={() => setShowLoc(false)} onSelect={setLocation} selected={location} />
        <CartSidebar cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onInc={inc} onDec={dec} onRemove={rem} onClear={clr} onCheckout={handleCheckout} />

        <TopNav user={user} cartCount={cartCount} onCart={() => setCartOpen(true)} onLoc={() => setShowLoc(true)} location={location} q={q} setQ={setQ} cat={cat} setCat={setCat} onSignOut={handleSignOut} navigate={navigate} />
        
        <main style={{ maxWidth: 1280, margin: '0 auto', padding: '26px 18px 100px' }}>
          <div className="filters-row sh pageIn" style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 24 }}>
            {[
              ['All Filters', Filter, false],
              ['Discounts', Sparkles, true],
              ['Delivery fee', Truck, false],
              ['Open now', Clock3, false],
              ['Pickup', Package, false],
              ['Ratings 4+', Star, false],
              ['Under 30 mins', Flame, false],
            ].map(([label, Icon, active]) => (
              <button key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '13px 18px', border: active ? '1px solid transparent' : '1px solid var(--line)', background: active ? '#0b8f4a' : 'rgba(255,255,255,.04)', color: active ? '#fff' : '#f3f4f6', fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', cursor: 'pointer' }}>
                <Icon size={16} /> {label}
              </button>
            ))}
          </div>
          

          <section className="hero-grid pageIn" style={{ display: 'grid', gridTemplateColumns: '1.65fr 1fr', gap: 18, marginBottom: 30 }}>
            {vL ? <Skeleton h={420} r={28} /> : <FeaturedSlider vendors={vendorPool} />}
            <div className="top-grid" style={{ display: 'grid', gap: 14 }}>
              <div style={{ background: '#0f0f10', border: '1px solid var(--line)', borderRadius: 22, padding: 20 }}>
                <div style={{ color: '#9ca3af', fontSize: 12, marginBottom: 8 }}>{authReady && user?.user_metadata?.full_name ? `Good day, ${user.user_metadata.full_name.split(' ')[0]}` : 'Welcome to Kravely'}</div>
                <div className="syne" style={{ fontSize: 28, lineHeight: 1.05, fontWeight: 800, marginBottom: 10 }}>Let the food<br />do the talking</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><div style={{ width: 7, height: 7, borderRadius: 999, background: '#22c55e', animation: 'live 2s infinite' }} /><span style={{ color: '#22c55e', fontSize: 12, fontWeight: 700 }}>Delivering now</span></div>
              </div>

              <button onClick={() => setShowLoc(true)} style={{ background: location ? 'rgba(34,197,94,.08)' : '#0f0f10', border: `1px solid ${location ? 'rgba(34,197,94,.18)' : 'var(--line)'}`, borderRadius: 22, padding: 18, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: location ? 'rgba(34,197,94,.14)' : 'rgba(255,255,255,.06)', display: 'grid', placeItems: 'center' }}><MapPin size={18} color={location ? '#22c55e' : '#9ca3af'} /></div>
                <div>
                  <div style={{ color: '#6b7280', fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Delivering to</div>
                  <div style={{ color: location ? '#22c55e' : '#fff', fontSize: 15, fontWeight: 700, marginTop: 4 }}>{location ? location.label : 'Set your location'}</div>
                  <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 3 }}>{location ? `${location.zone} zone` : 'Tap to set your location'}</div>
                </div>
              </button>

              <button onClick={() => setCartOpen(true)} style={{ background: '#0f0f10', border: '1px solid var(--line)', borderRadius: 22, padding: 18, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(34,197,94,.12)', display: 'grid', placeItems: 'center' }}><ShoppingBag size={18} color="#22c55e" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#6b7280', fontSize: 10, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Your cart</div>
                  <div style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginTop: 4 }}>{cartCount ? `${cartCount} item${cartCount > 1 ? 's' : ''} ready` : 'Empty — add something'}</div>
                </div>
                {cartCount > 0 && <span style={{ width: 24, height: 24, borderRadius: 999, background: '#22c55e', color: '#000', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 800 }}>{cartCount}</span>}
              </button>
            </div>
          </section>
          
          <section className="pageIn" style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, gap: 14, flexWrap: 'wrap' }}>
              <div>
                <div className="syne" style={{ fontSize: 38, fontWeight: 800, lineHeight: 1 }}>Popular Meals</div>
                <div style={{ color: '#9ca3af', fontSize: 14, marginTop: 4 }}>Less talk, more food. Fresh picks from Pearl’s and Chrissy.</div>
              </div>
              <button style={{ background: 'none', border: 'none', color: '#22c55e', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>See all</button>
            </div>

            <div className="food-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: 18 }}>
              {(filteredMeals.length ? filteredMeals.slice(0, 10) : STATIC_DISHES).map((item, i) => (
              <MealCard
                key={item.id || i}
                item={item}
                fallback={STATIC_DISHES[i % STATIC_DISHES.length]}
                onAdd={addToCart}
                onFavourite={toggleFavourite}
                favourites={favourites}
              />
              ))}
            </div>
          </section>

          <section className="pageIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, gap: 14, flexWrap: 'wrap' }}>
              <div>
                <div className="syne" style={{ fontSize: 38, fontWeight: 800, lineHeight: 1 }}>Top Vendors</div>
                <div style={{ color: '#9ca3af', fontSize: 14, marginTop: 4 }}>Image-first marketplace layout inspired by the reference screenshot, rebuilt in dark mode with Syne for headings.</div>
              </div>
              <button style={{ background: 'none', border: 'none', color: '#22c55e', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>See all</button>
            </div>

            {vL ? (
              <div className="vendor-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 18 }}>
                {[...Array(3)].map((_, i) => <Skeleton key={i} h={330} r={22} />)}
              </div>
            ) : (
              <div className="vendor-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 18 }}>
                {filteredVendors.slice(0, 6).map((vendor, i) => (
                  <VendorCard
                    key={vendor.id || i}
                    vendor={vendor}
                    fallbackImage={vendor.name?.toLowerCase?.().includes("pearl")
                      ? pearlsImage
                      : vendor.name?.toLowerCase?.().includes("chrissy")
                      ? chrissyLogo
                      : STATIC_DISHES[i % STATIC_DISHES.length].image}
                    onOrder={handleOrderVendor}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}