import { useState, useEffect } from "react";

// ===================== FLIP LOCATION =====================
function FlipLocation() {
  const locations = ["Umuchima", "Eziobodo", "Hostels", "Backgate", "Obinze", "Ihiagwa"];
  const [current, setCurrent] = useState(0);
  const [stage, setStage] = useState("visible");

  useEffect(() => {
    const interval = setInterval(() => {
      setStage("exit");
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % locations.length);
        setStage("enter");
        setTimeout(() => setStage("visible"), 50);
      }, 350);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const getTransform = () => {
    if (stage === "exit") return "translateY(110%)";
    if (stage === "enter") return "translateY(-110%)";
    return "translateY(0)";
  };

  return (
    <div className="flex items-center gap-3 mb-8">
      <span style={{ fontFamily: "'DM Sans', sans-serif" }} className="text-gray-400 text-base font-medium">
        📍 We deliver to
      </span>
      <div className="bg-green-500/10 border border-green-500/25 rounded-xl px-5 overflow-hidden flex items-center justify-center h-10 min-w-[140px]">
        <span
          style={{
            transform: getTransform(),
            opacity: stage === "visible" ? 1 : 0,
            transition:
              stage === "visible"
                ? "transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease"
                : "transform 0.35s cubic-bezier(0.4,0,1,1), opacity 0.2s ease",
            display: "inline-block",
            fontFamily: "'Syne', sans-serif",
          }}
          className="text-green-500 text-base font-bold"
        >
          {locations[current]}
        </span>
      </div>
    </div>
  );
}

// ===================== PHONE MOCKUP =====================
function PhoneMockup() {
  const [activeOrder, setActiveOrder] = useState(0);

  const orders = [
    { name: "Jollof Rice + Chicken", vendor: "Mama Nkechi's", price: "₦1,800", status: "On the way 🏃", time: "12 min", progress: "75%" },
    { name: "Suya Platter", vendor: "Chukwu's Grill", price: "₦2,200", status: "Being prepared 👨‍🍳", time: "8 min", progress: "45%" },
    { name: "Pepper Soup", vendor: "Pepper Soup Corner", price: "₦1,500", status: "Delivered ✅", time: "Just now", progress: "100%" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOrder((prev) => (prev + 1) % orders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow rings */}
      <div className="absolute w-80 h-80 rounded-full border border-green-500/10 animate-ping"
        style={{ animationDuration: "3s" }} />
      <div className="absolute w-96 h-96 rounded-full border border-green-500/5"
        style={{ animation: "spin 12s linear infinite" }} />

      {/* Glow blob */}
      <div className="absolute w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)" }} />

      {/* Phone */}
      <div className="relative z-10 w-64 rounded-[40px] border-2 border-white/10 overflow-hidden"
        style={{
          background: "#0a0a0a",
          boxShadow: "0 0 60px rgba(34,197,94,0.15), 0 40px 80px rgba(0,0,0,0.6)",
          animation: "phoneFloat 4s ease-in-out infinite"
        }}>

        {/* Notch */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-20 h-1.5 bg-white/20 rounded-full" />
        </div>

        {/* Screen */}
        <div className="px-4 pb-6">

          {/* Header */}
          <div className="flex justify-between items-center py-3 border-b border-white/5 mb-4">
            <div>
              <p className="text-white/40 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Good Day </p>
              <p className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>User</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-green-500 text-xs font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>E</span>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white/5 rounded-xl px-3 py-2 flex items-center gap-2 mb-4">
            <span className="text-white/30 text-xs">🔍</span>
            <span className="text-white/30 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Search vendors, meals...</span>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4 overflow-hidden">
            {["All", "Rice", "Soup", "Grill"].map((cat, i) => (
              <span key={cat} style={{ fontFamily: "'DM Sans', sans-serif" }}
                className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                  i === 0 ? "bg-green-500 text-black" : "bg-white/5 text-white/50"
                }`}>{cat}</span>
            ))}
          </div>

          {/* Vendors */}
          <p className="text-white/40 text-xs mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Popular near you</p>
          <div className="flex flex-col gap-2 mb-4">
            {[
              { name: "Mama Nkechi's", tag: "Local • ₦800+", rating: "4.8", icon: "🍲" },
              { name: "Chukwu's Grill", tag: "Grills • ₦1,200+", rating: "4.6", icon: "🔥" },
            ].map((v) => (
              <div key={v.name} className="bg-white/5 rounded-xl p-2.5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-sm">{v.icon}</div>
                  <div>
                    <p className="text-white text-xs font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>{v.name}</p>
                    <p className="text-white/40 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{v.tag}</p>
                  </div>
                </div>
                <span className="text-green-500 text-xs font-bold" style={{ fontFamily: "'DM Sans', sans-serif" }}>⭐ {v.rating}</span>
              </div>
            ))}
          </div>

          {/* Live order */}
          <div className="rounded-xl p-3 border border-green-500/20"
            style={{ background: "rgba(34,197,94,0.05)" }}>
            <div className="flex justify-between items-start mb-1.5">
              <p className="text-white text-xs font-bold leading-tight max-w-[120px]"
                style={{ fontFamily: "'Syne', sans-serif" }}>{orders[activeOrder].name}</p>
              <span className="text-green-500 text-xs font-bold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>{orders[activeOrder].price}</span>
            </div>
            <p className="text-white/40 text-xs mb-1.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>{orders[activeOrder].vendor}</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-green-400 text-xs"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>{orders[activeOrder].status}</span>
              <span className="text-white/30 text-xs"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>{orders[activeOrder].time}</span>
            </div>
            <div className="bg-white/10 rounded-full h-1">
              <div className="bg-green-500 h-1 rounded-full transition-all duration-700"
                style={{ width: orders[activeOrder].progress }} />
            </div>
          </div>

        </div>

        {/* Bottom nav */}
        <div className="flex justify-around items-center px-4 py-3 border-t border-white/5">
          {["🏠", "🔍", "🛒", "👤"].map((icon, i) => (
            <span key={i} className={`text-base ${i === 0 ? "opacity-100" : "opacity-30"}`}>{icon}</span>
          ))}
        </div>

      </div>

      {/* Floating pills */}
      <div className="absolute -right-4 top-16 bg-black border border-green-500/30 rounded-2xl px-3 py-2 shadow-xl z-20"
        style={{ animation: "floatBadge 3s ease-in-out infinite" }}>
        <p className="text-white text-xs font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Order confirmed! ✅</p>
        <p className="text-white/40 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Est. 15 mins</p>
      </div>

      <div className="absolute -left-6 bottom-20 bg-black border border-green-500/30 rounded-2xl px-3 py-2 shadow-xl z-20"
        style={{ animation: "floatBadge 3s ease-in-out infinite 1.5s" }}>
        <p className="text-green-500 text-xs font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>FUTO Campus 🎓</p>
        <p className="text-white/40 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Fast delivery</p>
      </div>

    </div>
  );
}

// ===================== HERO =====================
function Hero() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50% { box-shadow: 0 0 0 16px rgba(34,197,94,0); }
        }
        @keyframes phoneFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-16px); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #22c55e, #4ade80, #22c55e);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .slide-up-1 { animation: slideInUp 0.7s ease 0.1s both; }
        .slide-up-2 { animation: slideInUp 0.7s ease 0.2s both; }
        .slide-up-3 { animation: slideInUp 0.7s ease 0.3s both; }
        .slide-up-4 { animation: slideInUp 0.7s ease 0.4s both; }
        .slide-up-5 { animation: slideInUp 0.7s ease 0.5s both; }
        .slide-up-6 { animation: slideInUp 0.7s ease 0.7s both; }
        .slide-right { animation: slideInRight 0.9s ease 0.4s both; }
        .pulse-btn { animation: pulse-glow 2s infinite 1s; }
      `}</style>

      <section className="relative min-h-screen bg-black flex items-center overflow-hidden px-6 md:px-20 lg:px-32 pt-24 pb-12">

        {/* Background glow */}
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)" }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-24 xl:gap-32">

          {/* LEFT — Text */}
          <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left w-full lg:max-w-lg xl:max-w-xl">

            {/* Badge */}
            <div className="slide-up-1 flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-7">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
              <span className="text-green-500 text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Coming soon to FUTO Campus 🎓
              </span>
            </div>

            {/* Headline */}
            <h1 className="slide-up-2 font-black text-white leading-tight mb-6 mr-200px"
              style={{
                fontSize: "clamp(44px, 5vw, 80px)",
                letterSpacing: -3,
                fontFamily: "'Syne', sans-serif",
                lineHeight: 1.05
              }}>
              Campus food,<br />
              <span className="shimmer-text">delivered fast.</span>
            </h1>

            {/* Flip location */}
            <div className="slide-up-3 flex justify-center lg:justify-start w-full">
              <FlipLocation />
            </div>

            {/* Subheading */}
            <p className="slide-up-4 text-gray-400 leading-relaxed mb-10 max-w-md"
              style={{ fontSize: 17, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8 }}>
              Order from your favourite FUTO vendors and get hot food
              delivered straight to your hostel or faculty. No stress.
            </p>

            {/* Buttons */}
            <div className="slide-up-5 flex gap-4 flex-wrap justify-center lg:justify-start">
              <button
                className="pulse-btn bg-green-500 text-black font-extrabold px-9 py-4 rounded-full text-base transition-all duration-200 hover:bg-green-600 hover:-translate-y-1 hover:scale-105"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Order Food Now 🍔
              </button>
              <button
                className="bg-transparent text-white font-bold px-9 py-4 rounded-full text-base border border-white/20 transition-all duration-200 hover:border-green-500 hover:text-green-500 hover:-translate-y-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Join as Vendor →
              </button>
            </div>

            {/* Honest launch message instead of fake stats */}
            <div className="slide-up-6 mt-12 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
              <span className="text-2xl"></span>
              <p className="text-gray-400 text-sm text-left" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Launching at FUTO very soon —{" "}
                <span className="text-green-400 font-semibold">be the first to order!</span>
              </p>
            </div>

          </div>

          {/* RIGHT — Phone (hidden on mobile) */}
          <div className="slide-right lg:flex flex-1 items-center justify-center xl:justify-end">
            <PhoneMockup />
          </div>

        </div>

      </section>
    </>
  );
}

export default Hero;
