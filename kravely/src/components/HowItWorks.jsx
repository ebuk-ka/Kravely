import { useEffect, useRef, useState, useCallback } from "react";

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Browse Vendors",
      desc: "Explore all FUTO campus food vendors near your hostel or faculty. Filter by location, food type or rating.",
      tag: "🔍 Discover",
      color: "#22c55e",
      screen: {
        header: "Good Day 👋",
        subheader: "What are you craving?",
        content: "vendors",
      },
    },
    {
      step: "02",
      title: "Pick Your Meal",
      desc: "Choose from jollof rice, pepper soup, suya and more. Add to cart in seconds.",
      tag: "🍽️ Choose",
      color: "#4ade80",
      screen: {
        header: "Mama Nkechi's 🍲",
        subheader: "Local Delicacies",
        content: "menu",
      },
    },
    {
      step: "03",
      title: "Pay Securely",
      desc: "Checkout fast with Paystack. Card, bank transfer or USSD — always protected.",
      tag: "💳 Pay",
      color: "#86efac",
      screen: {
        header: "Checkout",
        subheader: "Secure payment",
        content: "checkout",
      },
    },
    {
      step: "04",
      title: "Fast Delivery",
      desc: "Your food arrives hot to your hostel or faculty. Track your order live.",
      tag: "🏃 Delivered",
      color: "#22c55e",
      screen: {
        header: "Order Tracking",
        subheader: "On the way!",
        content: "tracking",
      },
    },
  ];

  // Phone screen content per step
  function PhoneScreen({ step, color }) {
    const { screen } = step;

    if (screen.content === "vendors") {
      return (
        <div style={{ padding: "0 12px 12px" }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, opacity: 0.3 }}>🔍</span>
              <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}>Search vendors...</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10, overflow: "hidden" }}>
            {["All", "Rice", "Soup", "Grill"].map((c, i) => (
              <span key={c} style={{
                fontSize: 9, padding: "4px 10px", borderRadius: 50, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, whiteSpace: "nowrap",
                background: i === 0 ? color : "rgba(255,255,255,0.06)",
                color: i === 0 ? "#000" : "rgba(255,255,255,0.4)",
              }}>{c}</span>
            ))}
          </div>
          {[
            { name: "Mama Nkechi's", tag: "Local • ₦800+", icon: "🍲", rating: "4.8" },
            { name: "Chukwu's Grill", tag: "Grills • ₦1,200+", icon: "🔥", rating: "4.6" },
            { name: "Campus Bites", tag: "Snacks • ₦500+", icon: "🥪", rating: "4.5" },
          ].map(v => (
            <div key={v.name} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{v.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>{v.name}</p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 9, fontFamily: "'DM Sans', sans-serif" }}>{v.tag}</p>
              </div>
              <span style={{ color, fontSize: 9, fontWeight: 700 }}>⭐ {v.rating}</span>
            </div>
          ))}
        </div>
      );
    }

    if (screen.content === "menu") {
      return (
        <div style={{ padding: "0 12px 12px" }}>
          {[
            { name: "Jollof Rice + Chicken", price: "₦1,800", icon: "🍚" },
            { name: "Egusi Soup + Fufu", price: "₦1,500", icon: "🍲" },
            { name: "Fried Rice + Turkey", price: "₦2,000", icon: "🍛" },
            { name: "Pepper Soup", price: "₦1,200", icon: "🍜" },
          ].map((item, i) => (
            <div key={item.name} style={{ background: i === 0 ? `${color}15` : "rgba(255,255,255,0.04)", border: i === 0 ? `1px solid ${color}30` : "1px solid transparent", borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: "#fff", fontSize: 10, fontWeight: 600, fontFamily: "'Syne', sans-serif" }}>{item.name}</p>
                <p style={{ color, fontSize: 10, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{item.price}</p>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: 7, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#000", fontWeight: 800, cursor: "pointer" }}>+</div>
            </div>
          ))}
        </div>
      );
    }

    if (screen.content === "checkout") {
      return (
        <div style={{ padding: "0 12px 12px" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>Order Summary</p>
            {[["Jollof Rice + Chicken", "₦1,800"], ["Delivery fee", "₦300"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 9, fontFamily: "'DM Sans', sans-serif" }}>{k}</span>
                <span style={{ color: "#fff", fontSize: 9, fontFamily: "'DM Sans', sans-serif" }}>{v}</span>
              </div>
            ))}
            <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>Total</span>
              <span style={{ color, fontSize: 11, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>₦2,100</span>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "10px 12px", marginBottom: 8 }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "'DM Sans', sans-serif", marginBottom: 6 }}>Payment Method</p>
            <div style={{ display: "flex", gap: 6 }}>
              {["💳 Card", "🏦 Transfer", "📱 USSD"].map((m, i) => (
                <span key={m} style={{ fontSize: 8, padding: "5px 8px", borderRadius: 8, fontFamily: "'DM Sans', sans-serif", background: i === 0 ? `${color}20` : "rgba(255,255,255,0.05)", color: i === 0 ? color : "rgba(255,255,255,0.4)", border: i === 0 ? `1px solid ${color}40` : "1px solid transparent" }}>{m}</span>
              ))}
            </div>
          </div>
          <div style={{ background: color, borderRadius: 10, padding: "10px", textAlign: "center", cursor: "pointer" }}>
            <span style={{ color: "#000", fontSize: 11, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>Pay Now 🔒</span>
          </div>
        </div>
      );
    }

    if (screen.content === "tracking") {
      return (
        <div style={{ padding: "0 12px 12px" }}>
          <div style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 12, padding: "12px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <p style={{ color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "'Syne', sans-serif" }}>Jollof Rice + Chicken</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, fontFamily: "'DM Sans', sans-serif" }}>Mama Nkechi's</p>
              </div>
              <span style={{ color, fontSize: 9, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>₦1,800</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ color, fontSize: 9, fontFamily: "'DM Sans', sans-serif" }}>On the way 🏃</span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>12 min</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 4 }}>
              <div style={{ width: "70%", height: 4, borderRadius: 4, background: color, boxShadow: `0 0 6px ${color}` }} />
            </div>
          </div>
          {/* Map placeholder */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, height: 80, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(34,197,94,0.05) 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 20 }}>🗺️</span>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 8, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>Live tracking</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  // ===== CAROUSEL LOGIC =====
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const autoPlayRef = useRef(null);
  const containerRef = useRef(null);

  const CARD_WIDTH = 240;
  const CARD_GAP = 24;

  const next = useCallback(() => {
    setActiveIndex(prev => (prev + 1) % steps.length);
  }, [steps.length]);

  const prev = useCallback(() => {
    setActiveIndex(prev => (prev - 1 + steps.length) % steps.length);
  }, [steps.length]);

  // Auto play
  useEffect(() => {
    if (isPaused || isDragging) return;
    autoPlayRef.current = setInterval(next, 3000);
    return () => clearInterval(autoPlayRef.current);
  }, [isPaused, isDragging, next]);

  // Mouse drag handlers
  const onMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - dragStartX);
  };
  const onMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -60) next();
    else if (dragOffset > 60) prev();
    setDragOffset(0);
  };

  // Touch handlers
  const onTouchStart = (e) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
  };
  const onTouchMove = (e) => {
    if (!isDragging) return;
    setDragOffset(e.touches[0].clientX - dragStartX);
  };
  const onTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -60) next();
    else if (dragOffset > 60) prev();
    setDragOffset(0);
  };

  const getCardStyle = (i) => {
    const offset = i - activeIndex;
    const absOffset = Math.abs(offset);
    const isActive = offset === 0;

    let x = offset * (CARD_WIDTH + CARD_GAP) + dragOffset;
    let scale = isActive ? 1 : Math.max(0.82, 1 - absOffset * 0.09);
    let opacity = isActive ? 1 : Math.max(0.3, 1 - absOffset * 0.25);
    let zIndex = steps.length - absOffset;
    let blur = isActive ? 0 : Math.min(absOffset * 1.5, 4);

    return {
      transform: `translateX(${x}px) scale(${scale})`,
      opacity,
      zIndex,
      filter: blur > 0 ? `blur(${blur}px)` : "none",
      transition: isDragging
        ? "none"
        : "transform 0.5s cubic-bezier(0.34,1.2,0.64,1), opacity 0.5s ease, filter 0.5s ease",
    };
  };

  const current = steps[activeIndex];

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hiw-text-anim { animation: fadeInUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
        .phone-card { cursor: grab; }
        .phone-card:active { cursor: grabbing; }
      `}</style>

      <section className="bg-[#030303] py-24 overflow-hidden relative">

        {/* Top/bottom edge fades */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to bottom, #000, transparent)", pointerEvents: "none", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 120, background: "linear-gradient(to top, #000, transparent)", pointerEvents: "none", zIndex: 10 }} />

        {/* Background glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 50%, ${current.color}10 0%, transparent 65%)`,
          transition: "background 0.6s ease",
        }} />

        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 relative z-10">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-green-500 text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Simple Process
            </span>
            <h2 className="text-white font-black mt-3"
              style={{ fontSize: "clamp(32px, 5vw, 56px)", fontFamily: "'Syne', sans-serif", letterSpacing: -1 }}>
              How Kravely Works
            </h2>
          </div>

          {/* Two column layout */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

            {/* LEFT — Step info */}
            <div className="flex-1 max-w-md w-full lg:text-left text-center">
              <div key={activeIndex} className="hiw-text-anim">

                {/* Tag */}
                <div className="mb-5 lg:flex hidden">
                  <span style={{
                    background: `${current.color}15`,
                    border: `1px solid ${current.color}35`,
                    color: current.color,
                    padding: "6px 16px", borderRadius: 50,
                    fontSize: 13, fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{current.tag}</span>
                </div>

                {/* Step number */}
                <p className="text-green-500 font-bold mb-2"
                  style={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif", letterSpacing: 2 }}>
                  STEP {current.step}
                </p>

                {/* Title */}
                <h3 className="text-white font-black mb-4"
                  style={{ fontSize: "clamp(32px, 4vw, 52px)", fontFamily: "'Syne', sans-serif", letterSpacing: -1, lineHeight: 1.1 }}>
                  {current.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 mb-8"
                  style={{ fontSize: 16, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8 }}>
                  {current.desc}
                </p>

                {/* Step dots */}
                <div className="flex items-center gap-3 lg:justify-start justify-center">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      style={{
                        height: 8, borderRadius: 4,
                        width: i === activeIndex ? 28 : 8,
                        background: i === activeIndex ? current.color : "rgba(255,255,255,0.15)",
                        border: "none", cursor: "pointer",
                        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>

              </div>
            </div>

            {/* RIGHT — Phone carousel */}
            <div className="flex-1 flex items-center justify-center relative"
              style={{ height: 520 }}>

              {/* Carousel container */}
              <div
                ref={containerRef}
                className="phone-card"
                style={{
                  position: "relative",
                  width: CARD_WIDTH,
                  height: 480,
                  userSelect: "none",
                }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={() => { onMouseUp(); setIsPaused(false); }}
                onMouseEnter={() => setIsPaused(true)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {steps.map((step, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      top: 0, left: 0,
                      width: CARD_WIDTH,
                      ...getCardStyle(i),
                    }}
                  >
                    {/* iPhone frame */}
                    <div style={{
                      width: CARD_WIDTH,
                      borderRadius: 44,
                      background: "linear-gradient(160deg, #3a3a3c, #1c1c1e 40%, #2c2c2e 70%, #3a3a3c)",
                      padding: "2.5px",
                      boxShadow: i === activeIndex
                        ? `0 0 0 0.5px rgba(255,255,255,0.12), 0 0 40px ${step.color}25, 0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.18)`
                        : "0 0 0 0.5px rgba(255,255,255,0.06), 0 16px 32px rgba(0,0,0,0.4)",
                      transition: "box-shadow 0.5s ease",
                    }}>

                      {/* Side buttons */}
                      <div style={{ position: "absolute", left: -3, top: 88, width: 3, height: 22, background: "linear-gradient(180deg,#2a2a2c,#1a1a1c,#2a2a2c)", borderRadius: "2px 0 0 2px" }} />
                      <div style={{ position: "absolute", left: -3, top: 120, width: 3, height: 42, background: "linear-gradient(180deg,#2a2a2c,#1a1a1c,#2a2a2c)", borderRadius: "2px 0 0 2px" }} />
                      <div style={{ position: "absolute", left: -3, top: 172, width: 3, height: 42, background: "linear-gradient(180deg,#2a2a2c,#1a1a1c,#2a2a2c)", borderRadius: "2px 0 0 2px" }} />
                      <div style={{ position: "absolute", right: -3, top: 136, width: 3, height: 58, background: "linear-gradient(180deg,#2a2a2c,#1a1a1c,#2a2a2c)", borderRadius: "0 2px 2px 0" }} />

                      {/* Screen */}
                      <div style={{ borderRadius: 42, overflow: "hidden", background: "#050505" }}>

                        {/* Status bar */}
                        <div style={{ background: "#000", padding: "10px 20px 4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#fff", fontSize: 10, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>9:41</span>
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5 }}>
                              {[4, 6, 8, 10].map((h, j) => (
                                <div key={j} style={{ width: 2.5, borderRadius: 1, height: h, background: j < 3 ? "#fff" : "rgba(255,255,255,0.25)" }} />
                              ))}
                            </div>
                            <div style={{ width: 16, height: 8, border: "1px solid rgba(255,255,255,0.4)", borderRadius: 2, position: "relative" }}>
                              <div style={{ position: "absolute", left: 1.5, top: 1.5, bottom: 1.5, width: "65%", background: "#fff", borderRadius: 1 }} />
                            </div>
                          </div>
                        </div>

                        {/* Dynamic Island */}
                        <div style={{ background: "#000", display: "flex", justifyContent: "center", paddingBottom: 8 }}>
                          <div style={{
                            background: "#000",
                            borderRadius: 18, width: 100, height: 26,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: "1px solid rgba(255,255,255,0.05)",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.8)",
                          }}>
                            {i === activeIndex && (
                              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                <div style={{ width: 6, height: 6, borderRadius: "50%", background: step.color, boxShadow: `0 0 6px ${step.color}` }} />
                                <span style={{ color: step.color, fontSize: 8, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Kravely</span>
                              </div>
                            )}
                            <div style={{
                              position: "absolute", right: 12, width: 8, height: 8,
                              borderRadius: "50%", background: "#111",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }} />
                          </div>
                        </div>

                        {/* App header */}
                        <div style={{ padding: "4px 12px 8px", background: "#050505", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 9, fontFamily: "'DM Sans', sans-serif" }}>{step.screen.subheader}</p>
                          <p style={{ color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "'Syne', sans-serif" }}>{step.screen.header}</p>
                        </div>

                        {/* Screen content */}
                        <div style={{ background: "#050505", minHeight: 240 }}>
                          <PhoneScreen step={step} color={step.color} />
                        </div>

                        {/* Bottom nav */}
                        <div style={{ background: "#050505", borderTop: "1px solid rgba(255,255,255,0.04)", padding: "8px 16px", display: "flex", justifyContent: "space-around" }}>
                          {["🏠", "🔍", "🛒", "👤"].map((icon, j) => (
                            <span key={j} style={{ fontSize: 14, opacity: j === [0,0,2,0][i] ? 1 : 0.25 }}>{icon}</span>
                          ))}
                        </div>

                        {/* Home indicator */}
                        <div style={{ background: "#050505", display: "flex", justifyContent: "center", paddingBottom: 8 }}>
                          <div style={{ width: 80, height: 3, background: "rgba(255,255,255,0.25)", borderRadius: 2 }} />
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pause indicator */}
              {isPaused && (
                <div style={{
                  position: "absolute", bottom: 8,
                  background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 50, padding: "4px 12px",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: current.color }} />
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontFamily: "'DM Sans', sans-serif" }}>Paused</span>
                </div>
              )}

            </div>
          </div>

          {/* Drag hint */}
          <p className="text-center text-gray-600 mt-8 text-sm"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            ← Drag or hover to control · Click dots to jump →
          </p>

        </div>
      </section>
    </>
  );
}

export default HowItWorks;
