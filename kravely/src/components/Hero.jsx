import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

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
        We deliver to
      </span>
      <div className="bg-green-500/10 border border-green-500/25 rounded-xl px-5 overflow-hidden flex items-center justify-center h-10 min-w-[140px]">
        <span style={{
          transform: getTransform(),
          opacity: stage === "visible" ? 1 : 0,
          transition: stage === "visible"
            ? "transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease"
            : "transform 0.35s cubic-bezier(0.4,0,1,1), opacity 0.2s ease",
          display: "inline-block",
          fontFamily: "'Syne', sans-serif",
        }} className="text-green-500 text-base font-bold">
          {locations[current]}
        </span>
      </div>
    </div>
  );
}

// ===================== IPHONE MOCKUP =====================
function PhoneMockup() {
  const [activeOrder, setActiveOrder] = useState(0);
  const [islandExpanded, setIslandExpanded] = useState(false);

  const orders = [
    { name: "Jollof Rice + Chicken", vendor: "Mama Nkechi's", price: "₦1,800", status: "On the way", time: "12 min", progress: "75%" },
    { name: "Suya Platter", vendor: "Chukwu's Grill", price: "₦2,200", status: "Being prepared", time: "8 min", progress: "45%" },
    { name: "Pepper Soup", vendor: "Pepper Soup Corner", price: "₦1,500", status: "Delivered", time: "Just now", progress: "100%" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOrder((prev) => (prev + 1) % orders.length);
      setIslandExpanded(true);
      setTimeout(() => setIslandExpanded(false), 2000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute w-80 h-80 rounded-full border border-green-500/10 animate-ping" style={{ animationDuration: "3s" }} />
      <div className="absolute w-96 h-96 rounded-full border border-green-500/5" style={{ animation: "spin 12s linear infinite" }} />
      <div className="absolute w-64 h-64 rounded-full blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.25) 0%, transparent 70%)" }} />

      <div className="relative z-10 rounded-[52px] border border-white/20 overflow-hidden"
        style={{
          width: "260px", background: "#0a0a0a",
          boxShadow: "0 0 60px rgba(34,197,94,0.15), 0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.15)",
          animation: "phoneFloat 4s ease-in-out infinite"
        }}>

        <div className="absolute -left-[3px] top-24 w-[3px] h-8 bg-white/20 rounded-l-full" />
        <div className="absolute -left-[3px] top-36 w-[3px] h-12 bg-white/20 rounded-l-full" />
        <div className="absolute -left-[3px] top-52 w-[3px] h-12 bg-white/20 rounded-l-full" />
        <div className="absolute -right-[3px] top-36 w-[3px] h-16 bg-white/20 rounded-r-full" />

        <div className="relative overflow-hidden rounded-[52px]" style={{ background: "#050505" }}>

          <div className="flex justify-between items-center px-6 pt-4 pb-1">
            <span className="text-white text-xs font-semibold" style={{ fontFamily: "'DM Sans', sans-serif" }}>9:41</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-end gap-0.5">
                {[3, 5, 7, 9].map((h, i) => (
                  <div key={i} className="w-1 bg-white rounded-sm" style={{ height: `${h}px`, opacity: i < 3 ? 1 : 0.3 }} />
                ))}
              </div>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M7 8.5C7.55 8.5 8 8.95 8 9.5S7.55 10.5 7 10.5 6 10.05 6 9.5 6.45 8.5 7 8.5Z" fill="white"/>
                <path d="M4.5 6.5C5.3 5.7 6.1 5.3 7 5.3S8.7 5.7 9.5 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                <path d="M2.5 4.5C3.8 3.2 5.3 2.5 7 2.5S10.2 3.2 11.5 4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5"/>
              </svg>
              <div className="flex items-center gap-0.5">
                <div className="border border-white/60 rounded-sm relative" style={{ width: 20, height: 10 }}>
                  <div className="absolute left-0.5 top-0.5 bottom-0.5 bg-white rounded-sm" style={{ width: "70%" }} />
                </div>
                <div className="w-0.5 h-1.5 bg-white/40 rounded-r-sm" />
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-2">
            <div className="relative flex items-center justify-center overflow-hidden"
              style={{
                background: "#000",
                borderRadius: islandExpanded ? "24px" : "20px",
                width: islandExpanded ? "200px" : "120px",
                height: islandExpanded ? "56px" : "32px",
                transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.06)"
              }}>
              {!islandExpanded && (
                <>
                  <div className="absolute right-3 w-2.5 h-2.5 rounded-full"
                    style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a2e] m-auto mt-0.5"
                      style={{ boxShadow: "0 0 3px rgba(100,149,237,0.6)" }} />
                  </div>
                  <div className="absolute left-3 w-2 h-2 rounded-full bg-green-500"
                    style={{ animation: "pulse-glow-sm 2s infinite" }} />
                </>
              )}
              {islandExpanded && (
                <div className="flex items-center gap-2 px-3 w-full">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">K</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-bold truncate" style={{ fontFamily: "'Syne', sans-serif" }}>Kravely</p>
                    <p className="text-green-400 text-xs truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>{orders[activeOrder].status}</p>
                  </div>
                  <span className="text-white/40 text-xs flex-shrink-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>{orders[activeOrder].time}</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="flex justify-between items-center py-2 mb-3">
              <div>
                <p className="text-white/40 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Good Day </p>
                <p className="text-white font-bold text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>User</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-green-500 text-xs font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>K</span>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl px-3 py-2 flex items-center gap-2 mb-3">
              <span className="text-white/30 text-xs">Search</span>
              <span className="text-white/30 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Search vendors, meals...</span>
            </div>

            <div className="flex gap-2 mb-3 overflow-hidden">
              {["All", "Rice", "Soup", "Grill"].map((cat, i) => (
                <span key={cat} style={{ fontFamily: "'DM Sans', sans-serif" }}
                  className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${i === 0 ? "bg-green-500 text-black" : "bg-white/5 text-white/50"}`}>{cat}</span>
              ))}
            </div>

            <p className="text-white/40 text-xs mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Popular near you</p>
            <div className="flex flex-col gap-2 mb-3">
              {[
                { name: "Mama Nkechi's", tag: "Local • ₦800+", rating: "4.8", icon: "" },
                { name: "Chukwu's Grill", tag: "Grills • ₦1,200+", rating: "4.6", icon: "" },
              ].map((v) => (
                <div key={v.name} className="bg-white/5 rounded-xl p-2.5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center text-xs">{v.icon}</div>
                    <div>
                      <p className="text-white text-xs font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>{v.name}</p>
                      <p className="text-white/40 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{v.tag}</p>
                    </div>
                  </div>
                  <span className="text-green-500 text-xs font-bold">{v.rating}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl p-3 border border-green-500/20" style={{ background: "rgba(34,197,94,0.05)" }}>
              <div className="flex justify-between items-start mb-1">
                <p className="text-white text-xs font-bold leading-tight max-w-[110px]" style={{ fontFamily: "'Syne', sans-serif" }}>{orders[activeOrder].name}</p>
                <span className="text-green-500 text-xs font-bold">{orders[activeOrder].price}</span>
              </div>
              <p className="text-white/40 text-xs mb-1">{orders[activeOrder].vendor}</p>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-green-400 text-xs">{orders[activeOrder].status}</span>
                <span className="text-white/30 text-xs">{orders[activeOrder].time}</span>
              </div>
              <div className="bg-white/10 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full transition-all duration-700" style={{ width: orders[activeOrder].progress }} />
              </div>
            </div>
          </div>

          <div className="flex justify-center pb-2">
            <div className="w-24 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
      </div>

      <div className="absolute -right-4 top-16 bg-black border border-green-500/30 rounded-2xl px-3 py-2 shadow-xl z-20"
        style={{ animation: "floatBadge 3s ease-in-out infinite" }}>
        <p className="text-white text-xs font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>Order confirmed!</p>
        <p className="text-white/40 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>Est. 15 mins</p>
      </div>

      <div className="absolute -left-6 bottom-20 bg-black border border-green-500/30 rounded-2xl px-3 py-2 shadow-xl z-20"
        style={{ animation: "floatBadge 3s ease-in-out infinite 1.5s" }}>
        <p className="text-green-500 text-xs font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>FUTO Campus</p>
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
        @keyframes pulse-glow-sm {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
          50% { box-shadow: 0 0 0 4px rgba(34,197,94,0); }
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

        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-24 xl:gap-32">

          {/* LEFT */}
          <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left w-full lg:max-w-lg xl:max-w-xl">

            <div className="slide-up-1 flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-7">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
              <span className="text-green-500 text-sm font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Coming soon to FUTO Campus
              </span>
            </div>

            <h1 className="slide-up-2 font-black text-white leading-tight mb-6"
              style={{ fontSize: "clamp(44px, 5vw, 80px)", letterSpacing: -3, fontFamily: "'Syne', sans-serif", lineHeight: 1.05 }}>
              Campus food,<br />
              <span className="shimmer-text">delivered fast.</span>
            </h1>

            <div className="slide-up-3 flex justify-center lg:justify-start w-full">
              <FlipLocation />
            </div>

            <p className="slide-up-4 text-gray-400 leading-relaxed mb-10 max-w-md"
              style={{ fontSize: 17, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8 }}>
              Order from your favourite FUTO vendors and get hot food
              delivered straight to your hostel or faculty. No stress.
            </p>

            
            <div className="slide-up-5 flex gap-4 flex-wrap justify-center lg:justify-start">
              <Link
                to="/order"
                className="pulse-btn inline-block bg-green-500 text-black font-extrabold px-9 py-4 rounded-full text-base transition-all duration-200 hover:bg-green-600 hover:-translate-y-1 hover:scale-105"
                style={{ fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
              >
                Order Food Now
              </Link>
              <a
                href="https://chat.whatsapp.com/Htvsu1kFSdg8TXOIuHqS9k"
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-transparent text-white font-bold px-9 py-4 rounded-full text-base border border-white/20 transition-all duration-200 hover:border-green-500 hover:text-green-500 hover:-translate-y-1"
                style={{ fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
              >
                Join as Vendor →
              </a>
            </div>

            <div className="slide-up-6 mt-12 flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
              <p className="text-gray-400 text-sm text-left" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Launching at FUTO very soon —{" "}
                <span className="text-green-400 font-semibold">be the first to order!</span>
              </p>
            </div>

          </div>

          {/* RIGHT — iPhone */}
          <div className="slide-right lg:flex flex-1 items-center justify-center xl:justify-end">
            <PhoneMockup />
          </div>

        </div>
      </section>
    </>
  );
}

export default Hero;
