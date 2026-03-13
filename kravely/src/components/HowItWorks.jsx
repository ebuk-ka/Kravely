import { useEffect, useRef, useState } from "react";

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Browse Vendors",
      desc: "Explore all FUTO campus food vendors near your hostel or faculty. Filter by location, food type or rating and find exactly what you're craving.",
      tag: "🔍 Discover",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
      color: "#22c55e",
      glow: "rgba(34,197,94,0.15)",
    },
    {
      step: "02",
      title: "Pick Your Meal",
      desc: "Choose from jollof rice, pepper soup, suya, grills and more. Add items to cart and customise your order in seconds.",
      tag: "🍽️ Choose",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
      color: "#4ade80",
      glow: "rgba(74,222,128,0.15)",
    },
    {
      step: "03",
      title: "Pay Securely",
      desc: "Checkout fast and safely with Paystack. Pay with card, bank transfer or USSD — your money is always protected.",
      tag: "💳 Pay",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      color: "#86efac",
      glow: "rgba(134,239,172,0.15)",
    },
    {
      step: "04",
      title: "Fast Delivery",
      desc: "Your food is picked up and delivered hot straight to your hostel or faculty door. Track your order live on the app.",
      tag: "🏃 Delivered",
      image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&q=80",
      color: "#22c55e",
      glow: "rgba(34,197,94,0.15)",
    },
  ];

  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const totalProgress = Math.max(0, Math.min(1, scrolled / sectionHeight));

      setProgress(totalProgress);

      // Which step is active based on scroll progress
      const stepIndex = Math.min(
        Math.floor(totalProgress * steps.length),
        steps.length - 1
      );
      setActiveStep(stepIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const current = steps[activeStep];

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes imgZoom {
          from { transform: scale(1.05); opacity: 0.6; }
          to { transform: scale(1); opacity: 1; }
        }
        .step-content-anim {
          animation: fadeSlideIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .step-img-anim {
          animation: imgZoom 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
      `}</style>

      {/* Tall section to create scroll space */}
      <section
        ref={sectionRef}
        style={{ height: `${steps.length * 100}vh`, position: "relative" }}
      >
        {/* Sticky container */}
        <div style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          background: "#030303",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>

          {/* Background glow that changes color */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `radial-gradient(ellipse at 70% 50%, ${current.glow} 0%, transparent 60%)`,
            transition: "background 0.6s ease",
          }} />

          <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-16 lg:px-24">

            {/* Section label */}
            <div className="mb-10">
              <span className="text-green-500 text-xs font-semibold tracking-widest uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Simple Process
              </span>
              <h2 className="text-white font-black mt-2"
                style={{ fontSize: "clamp(28px, 4vw, 48px)", fontFamily: "'Syne', sans-serif", letterSpacing: -1 }}>
                How Kravely Works
              </h2>
            </div>

            {/* Main content — two columns */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

              {/* LEFT — Step info */}
              <div className="flex-1 max-w-lg" key={activeStep}>
                <div className="step-content-anim">

                  {/* Step counter */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                      style={{ background: current.color, color: "#000", fontFamily: "'Syne', sans-serif" }}>
                      {current.step}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: `${current.color}15`,
                        color: current.color,
                        border: `1px solid ${current.color}30`,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                      {current.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-black mb-4"
                    style={{ fontSize: "clamp(32px, 4vw, 56px)", fontFamily: "'Syne', sans-serif", letterSpacing: -1, lineHeight: 1.1 }}>
                    {current.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 leading-relaxed mb-8"
                    style={{ fontSize: 17, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8 }}>
                    {current.desc}
                  </p>

                  {/* Step dots */}
                  <div className="flex items-center gap-3">
                    {steps.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div style={{
                          width: i === activeStep ? "32px" : "8px",
                          height: "8px",
                          borderRadius: "4px",
                          background: i === activeStep ? current.color : i < activeStep ? `${current.color}50` : "rgba(255,255,255,0.1)",
                          transition: "all 0.4s ease",
                        }} />
                      </div>
                    ))}
                    <span className="text-gray-600 text-sm ml-2"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {activeStep + 1} / {steps.length}
                    </span>
                  </div>

                </div>
              </div>

              {/* RIGHT — Image */}
              <div className="flex-1 w-full max-w-md lg:max-w-lg" key={`img-${activeStep}`}>
                <div className="step-img-anim relative rounded-3xl overflow-hidden"
                  style={{
                    height: "clamp(280px, 40vh, 420px)",
                    boxShadow: `0 32px 80px ${current.glow}, 0 0 0 1px ${current.color}20`,
                  }}>
                  <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0"
                    style={{ background: `linear-gradient(135deg, ${current.glow} 0%, rgba(0,0,0,0.4) 100%)` }} />

                  {/* Step watermark */}
                  <div className="absolute bottom-4 right-6"
                    style={{
                      fontSize: 120, fontWeight: 900, color: "rgba(255,255,255,0.04)",
                      fontFamily: "'Syne', sans-serif", lineHeight: 1, userSelect: "none"
                    }}>
                    {current.step}
                  </div>
                </div>
              </div>

            </div>

            {/* Progress bar at bottom */}
            <div className="mt-10 w-full bg-white/5 rounded-full h-0.5">
              <div className="h-0.5 rounded-full transition-all duration-200"
                style={{
                  width: `${progress * 100}%`,
                  background: `linear-gradient(90deg, #22c55e, ${current.color})`,
                }} />
            </div>

            {/* Scroll hint — only on first step */}
            {activeStep === 0 && (
              <div className="mt-4 flex items-center gap-2 text-gray-600"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                <span>Scroll to explore</span>
                <span style={{ animation: "bounce 1s infinite" }}>↓</span>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}

export default HowItWorks;
