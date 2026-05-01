import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  MapPin,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Store,
  Truck,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#070707}
.vs{min-height:100vh;background:#070707;color:#fff;font-family:'DM Sans',sans-serif}
.syne{font-family:'Syne',sans-serif}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%,100%{opacity:.35}50%{opacity:.7}}
.fadeUp{animation:fadeUp .35s ease both}
.cardHover{transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}
.cardHover:hover{transform:translateY(-3px);border-color:rgba(34,197,94,.22)!important;box-shadow:0 18px 45px rgba(0,0,0,.35)}
@media(max-width:760px){.storeHero{grid-template-columns:1fr!important}.menuGrid{grid-template-columns:1fr!important}.topNav{flex-wrap:wrap}.searchBox{order:3;width:100%}}
`;

function formatNaira(koboOrNaira = 0) {
  const value = koboOrNaira > 1000 ? Math.round(koboOrNaira / 100) : koboOrNaira;
  return `₦${value.toLocaleString("en-NG")}`;
}

function Skeleton({ h = 20, r = 12, style = {} }) {
  return (
    <div
      style={{
        height: h,
        borderRadius: r,
        background: "rgba(255,255,255,.07)",
        animation: "shimmer 1.3s ease infinite",
        ...style,
      }}
    />
  );
}

function CartDrawer({ open, cart, onClose, onInc, onDec, onRemove, onCheckout }) {
  const fee = Number(localStorage.getItem("kravely_delivery_fee") || "300");
  const subtotal = cart.reduce((sum, item) => sum + item.priceNaira * item.qty, 0);
  const total = subtotal + fee;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 80,
          background: "rgba(0,0,0,.7)",
          backdropFilter: "blur(5px)",
        }}
      />
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          zIndex: 90,
          width: "min(420px, 92vw)",
          background: "#0e0e0f",
          borderLeft: "1px solid rgba(255,255,255,.08)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: 20, borderBottom: "1px solid rgba(255,255,255,.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="syne" style={{ fontSize: 24, fontWeight: 800 }}>Your Cart</h2>
          <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.05)", color: "#fff", cursor: "pointer" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
          {cart.length === 0 ? (
            <div style={{ height: "100%", display: "grid", placeItems: "center", textAlign: "center", color: "#6b7280" }}>
              <div>
                <ShoppingBag size={38} color="#22c55e" />
                <p style={{ marginTop: 10 }}>Your cart is empty</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cart.map((item) => (
                <div key={item.cartId} style={{ background: "rgba(255,255,255,.035)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: 14, display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(34,197,94,.1)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Package size={17} color="#22c55e" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 800, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                    <p className="syne" style={{ color: "#22c55e", fontWeight: 800, fontSize: 17, marginTop: 3 }}>₦{(item.priceNaira * item.qty).toLocaleString()}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <button onClick={() => onDec(item.cartId)} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.05)", color: "#fff", cursor: "pointer" }}><Minus size={12} /></button>
                    <span style={{ fontWeight: 800 }}>{item.qty}</span>
                    <button onClick={() => onInc(item.cartId)} style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.05)", color: "#fff", cursor: "pointer" }}><Plus size={12} /></button>
                  </div>
                  <button onClick={() => onRemove(item.cartId)} style={{ width: 26, height: 26, borderRadius: 8, border: "none", background: "rgba(239,68,68,.12)", color: "#ef4444", cursor: "pointer" }}><X size={12} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: 20, borderTop: "1px solid rgba(255,255,255,.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#9ca3af" }}>
              <span>Subtotal</span><span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, color: "#9ca3af" }}>
              <span>Delivery fee</span><span>₦{fee.toLocaleString()}</span>
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,.08)", marginBottom: 14 }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span className="syne" style={{ fontSize: 20, fontWeight: 800 }}>Total</span>
              <span className="syne" style={{ color: "#22c55e", fontSize: 23, fontWeight: 800 }}>₦{total.toLocaleString()}</span>
            </div>
            <button onClick={onCheckout} style={{ width: "100%", border: "none", borderRadius: 14, padding: 15, background: "#22c55e", color: "#000", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <ShoppingBag size={17} /> Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default function VendorStore() {
  const { vendorId } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const loadStore = async () => {
      setLoading(true);

      const { data: vendorData, error: vendorError } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", vendorId)
        .eq("is_approved", true)
        .single();

      if (vendorError) {
        console.error("Vendor fetch error:", vendorError.message);
        setVendor(null);
        setItems([]);
        setLoading(false);
        return;
      }

      const { data: menuData, error: menuError } = await supabase
        .from("menu_items")
        .select("*")
        .eq("vendor_id", vendorId)
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      if (menuError) {
        console.error("Menu fetch error:", menuError.message);
      }

      setVendor(vendorData);
      setItems(menuData || []);
      setLoading(false);
    };

    if (vendorId) loadStore();
  }, [vendorId]);

  const filteredItems = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) =>
      item.name?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  }, [items, q]);

  const addToCart = (item) => {
    const priceNaira = item.price > 1000 ? Math.round(item.price / 100) : item.price;

    const cartItem = {
      cartId: item.id,
      id: item.id,
      name: item.name,
      priceNaira,
      priceKobo: priceNaira * 100,
      vendorId: vendor.id,
      vendorName: vendor.name,
      qty: 1,
    };

    setCart((prev) => {
      const existing = prev.find((i) => i.cartId === item.id);
      if (existing) {
        return prev.map((i) => i.cartId === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, cartItem];
    });

    setCartOpen(true);
  };

  const inc = (id) => setCart((prev) => prev.map((item) => item.cartId === id ? { ...item, qty: item.qty + 1 } : item));
  const dec = (id) => setCart((prev) => prev.map((item) => item.cartId === id ? (item.qty === 1 ? null : { ...item, qty: item.qty - 1 }) : item).filter(Boolean));
  const remove = (id) => setCart((prev) => prev.filter((item) => item.cartId !== id));

  const checkout = () => {
    navigate("/checkout", {
      state: {
        cart,
        vendor,
      },
    });
  };

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div className="vs" style={{ padding: 18 }}>
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <Skeleton h={58} r={16} style={{ marginBottom: 18 }} />
            <Skeleton h={280} r={26} style={{ marginBottom: 20 }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 14 }}>
              {[1,2,3,4].map((n) => <Skeleton key={n} h={250} r={22} />)}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!vendor) {
    return (
      <>
        <style>{CSS}</style>
        <div className="vs" style={{ display: "grid", placeItems: "center", padding: 20 }}>
          <div style={{ textAlign: "center", maxWidth: 420 }}>
            <Store size={46} color="#22c55e" />
            <h1 className="syne" style={{ marginTop: 14, fontSize: 28, fontWeight: 800 }}>Vendor not found</h1>
            <p style={{ color: "#9ca3af", marginTop: 8, lineHeight: 1.7 }}>This vendor is either not approved yet or does not exist.</p>
            <Link to="/order-now" style={{ marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8, background: "#22c55e", color: "#000", padding: "13px 20px", borderRadius: 999, textDecoration: "none", fontWeight: 900 }}>
              <ArrowLeft size={16} /> Back to vendors
            </Link>
          </div>
        </div>
      </>
    );
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const heroBg = vendor.logo_url || vendor.image_url || "";

  return (
    <>
      <style>{CSS}</style>
      <div className="vs">
        <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(7,7,7,.94)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
          <div className="topNav" style={{ maxWidth: 1180, margin: "0 auto", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => navigate(-1)} style={{ width: 42, height: 42, borderRadius: 12, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.05)", color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}>
              <ArrowLeft size={18} />
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p className="syne" style={{ fontWeight: 900, fontSize: 19, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{vendor.name}</p>
              <p style={{ color: vendor.is_open ? "#22c55e" : "#ef4444", fontSize: 12, fontWeight: 800 }}>{vendor.is_open ? "Open for orders" : "Closed right now"}</p>
            </div>

            <div className="searchBox" style={{ position: "relative", width: 310, maxWidth: "100%" }}>
              <Search size={16} color="rgba(255,255,255,.35)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search menu..."
                style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", color: "#fff", borderRadius: 14, padding: "12px 14px 12px 40px", outline: "none" }}
              />
            </div>

            <button onClick={() => setCartOpen(true)} style={{ position: "relative", height: 42, minWidth: 58, borderRadius: 14, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.05)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <ShoppingBag size={18} />
              <span style={{ fontWeight: 900 }}>{cartCount}</span>
            </button>
          </div>
        </nav>

        <main style={{ maxWidth: 1180, margin: "0 auto", padding: "22px 18px 90px" }}>
          <section className="storeHero fadeUp" style={{ display: "grid", gridTemplateColumns: "1.4fr .8fr", gap: 16, marginBottom: 24 }}>
            <div style={{ minHeight: 280, borderRadius: 28, border: "1px solid rgba(255,255,255,.08)", overflow: "hidden", background: heroBg ? `linear-gradient(90deg, rgba(0,0,0,.82), rgba(0,0,0,.32)), url(${heroBg}) center/cover` : "linear-gradient(135deg,#09220f,#0f0f10)", padding: 28, display: "flex", alignItems: "flex-end" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(34,197,94,.13)", border: "1px solid rgba(34,197,94,.25)", color: "#22c55e", borderRadius: 999, padding: "7px 12px", fontSize: 11, fontWeight: 900, marginBottom: 14 }}>
                  <Store size={13} /> VENDOR STORE
                </div>
                <h1 className="syne" style={{ fontSize: "clamp(38px, 7vw, 66px)", lineHeight: .95, letterSpacing: -2, fontWeight: 900 }}>{vendor.name}</h1>
                <p style={{ maxWidth: 560, color: "rgba(255,255,255,.72)", marginTop: 12, lineHeight: 1.7 }}>{vendor.description || "Fresh meals available for order on Kravely."}</p>
              </div>
            </div>

            <div style={{ background: "#0f0f10", border: "1px solid rgba(255,255,255,.08)", borderRadius: 28, padding: 22, display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#d4d4d8" }}><MapPin size={17} color="#22c55e" /> {vendor.location || "FUTO"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#d4d4d8" }}><Clock3 size={17} color="#22c55e" /> {vendor.delivery_time || "20 - 30 min"}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#d4d4d8" }}><Star size={17} color="#facc15" fill="#facc15" /> {vendor.rating || "New"} rating</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#d4d4d8" }}><Truck size={17} color="#60a5fa" /> Delivery handled by Kravely</div>
            </div>
          </section>

          <section className="fadeUp" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <div>
              <h2 className="syne" style={{ fontSize: 26, fontWeight: 900 }}>Menu</h2>
              <p style={{ color: "#9ca3af", marginTop: 4 }}>{filteredItems.length} available item{filteredItems.length === 1 ? "" : "s"}</p>
            </div>
            {!vendor.is_open && (
              <span style={{ background: "rgba(239,68,68,.12)", border: "1px solid rgba(239,68,68,.25)", color: "#ef4444", borderRadius: 999, padding: "8px 14px", fontWeight: 900, fontSize: 12 }}>
                Store closed
              </span>
            )}
          </section>

          {filteredItems.length === 0 ? (
            <div style={{ border: "1px solid rgba(255,255,255,.08)", background: "#0f0f10", borderRadius: 24, padding: "60px 20px", textAlign: "center" }}>
              <Package size={42} color="#22c55e" />
              <h3 className="syne" style={{ marginTop: 14, fontSize: 24, fontWeight: 900 }}>No menu items yet</h3>
              <p style={{ color: "#9ca3af", marginTop: 8 }}>When this vendor adds food from their dashboard, it will show here automatically.</p>
            </div>
          ) : (
            <div className="menuGrid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
              {filteredItems.map((item) => {
                const priceNaira = item.price > 1000 ? Math.round(item.price / 100) : item.price;
                return (
                  <div key={item.id} className="cardHover" style={{ background: "#0f0f10", border: "1px solid rgba(255,255,255,.07)", borderRadius: 22, overflow: "hidden" }}>
                    <div style={{ height: 150, background: item.image_url ? `url(${item.image_url}) center/cover` : "linear-gradient(135deg,rgba(34,197,94,.16),rgba(255,255,255,.04))", display: "grid", placeItems: "center" }}>
                      {!item.image_url && <span style={{ fontSize: 46 }}>{item.emoji || "🍽️"}</span>}
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", justifyContent: "space-between" }}>
                        <div>
                          <h3 className="syne" style={{ fontSize: 17, fontWeight: 800 }}>{item.name}</h3>
                          <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.5, marginTop: 5 }}>{item.description || item.category || "Fresh meal"}</p>
                        </div>
                        <span style={{ fontSize: 24 }}>{item.emoji || "🍽️"}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                        <p className="syne" style={{ color: "#22c55e", fontWeight: 900, fontSize: 22 }}>{formatNaira(item.price)}</p>
                        <button
                          disabled={!vendor.is_open}
                          onClick={() => addToCart(item)}
                          style={{
                            width: 42,
                            height: 42,
                            borderRadius: 999,
                            border: "none",
                            background: vendor.is_open ? "#22c55e" : "rgba(255,255,255,.08)",
                            color: vendor.is_open ? "#000" : "#6b7280",
                            display: "grid",
                            placeItems: "center",
                            cursor: vendor.is_open ? "pointer" : "not-allowed",
                          }}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <CartDrawer
          open={cartOpen}
          cart={cart}
          onClose={() => setCartOpen(false)}
          onInc={inc}
          onDec={dec}
          onRemove={remove}
          onCheckout={checkout}
        />
      </div>
    </>
  );
}
