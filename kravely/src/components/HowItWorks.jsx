import { useEffect, useRef, useState } from "react";

function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Browse Vendors",
      desc: "Explore all FUTO campus food vendors near your hostel or faculty.",
      tag: "🔍 Discover",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=90",
      color: "#22c55e",
      glow: "rgba(34,197,94,0.35)",
    },
    {
      step: "02",
      title: "Pick Your Meal",
      desc: "Choose from jollof rice, pepper soup, suya, grills and more.",
      tag: "🍽️ Choose",
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1400&q=90",
      color: "#4ade80",
      glow: "rgba(74,222,128,0.35)",
    },
    {
      step: "03",
      title: "Pay Securely",
      desc: "Checkout fast and safely with Paystack. Card, transfer or USSD.",
      tag: "💳 Pay",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=90",
      color: "#86efac",
      glow: "rgba(134,239,172,0.35)",
    },
    {
      step: "04",
      title: "Fast Delivery",
      desc: "Your food arrives hot straight to your hostel or faculty door.",
      tag: "🏃 Delivered",
      image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1400&q=90",
      color: "#22c55e",
      glow: "rgba(34,197,94,0.35)",
    },
  ];

  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const rawProgressRef = useRef(0);
  const animFrameRef = useRef(null);

  // Smooth lerp animation
  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      setSmoothProgress(prev => {
        const diff = rawProgressRef.current - prev;
        if (Math.abs(diff) < 0.0001) return rawProgressRef.current;
        return lerp(prev, rawProgressRef.current, 0.08); // 0.08 = smoothness
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [steps.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const totalProgress = Math.max(0, Math.min(1, scrolled / sectionHeight));

      rawProgressRef.current = totalProgress;

      const stepFloat = totalProgress * steps.length;
      const stepIndex = Math.min(Math.floor(stepFloat), steps.length - 1);
      setActiveStep(stepIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const current = steps[activeStep];

  // Smooth local progress within each step
  const stepFloat = smoothProgress * steps.length;
  const stepLocalProgress = stepFloat - Math.floor(Math.min(stepFloat, steps.length - 0.001));
  const curtainPercent = stepLocalProgress * 100;

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tagPop {
          from { opacity: 0; transform: translateY(10px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
        .step-text-anim {
          animation: fadeInUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .tag-anim {
          animation: tagPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.15s both;
        }
        .scroll-hint {
          animation: scrollBounce 2s ease-in-out infinite;
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{ height: `${steps.length * 100}vh`, position: "relative" }}
      >
        <div style={{
          position: "sticky", top: 0,
          height: "100vh", overflow: "hidden",
        }}>

          {/* ===== NEXT IMAGE — always underneath ===== */}
          {steps.map((step, i) => (
            <div
              key={`bg-${i}`}
              style={{
                position: "absolute", inset: 0,
                backgroundImage: `url(${step.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: i === Math.min(activeStep + 1, steps.length - 1) ? 1 : 0,
                transition: "opacity 0.3s ease",
              }}
            />
          ))}

          {/* ===== CURRENT IMAGE — slides up like a curtain ===== */}
          <div style={{
            position: "absolute", inset: 0,
            clipPath: `inset(${curtainPercent}% 0 0 0)`,
          }}>
            {steps.map((step, i) => (
              <div
                key={`cur-${i}`}
                style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url(${step.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: i === activeStep ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              />
            ))}
          </div>

          {/* Dark gradient */}
          {/* Dark gradient */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.82) 100%)",
          }} />
          
          {/* Top fade — blends into section above */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: "180px", pointerEvents: "none",
            background: "linear-gradient(to bottom, #000 0%, transparent 100%)",
          }} />
          
          {/* Bottom fade — blends into section below */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "180px", pointerEvents: "none",
            background: "linear-gradient(to top, #000 0%, transparent 100%)",
          }} />

          {/* Color tint */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: `radial-gradient(ellipse at 15% 85%, ${current.glow} 0%, transparent 50%)`,
            transition: "background 0.7s ease",
          }} />

          {/* ===== UI CONTENT ===== */}
          <div className="relative z-10 h-full flex flex-col justify-between"
            style={{ padding: "36px clamp(20px, 5vw, 80px) 56px" }}>

            {/* Top bar */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: 11, fontWeight: 600,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  How It Works
                </span>
                <div style={{ width: 36, height: 1, background: "rgba(255,255,255,0.2)" }} />
              </div>

              {/* Step dots */}
              <div className="flex items-center gap-2">
                {steps.map((_, i) => (
                  <div key={i} style={{
                    height: 3, borderRadius: 2,
                    width: i === activeStep ? 28 : 8,
                    background: i === activeStep
                      ? current.color
                      : i < activeStep
                        ? "rgba(255,255,255,0.45)"
                        : "rgba(255,255,255,0.18)",
                    transition: "all 0.5s cubic-bezier(0.22,1,0.36,1)",
                  }} />
                ))}
                <span style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 12, marginLeft: 8,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {activeStep + 1}/{steps.length}
                </span>
              </div>
            </div>

            {/* Bottom content */}
            <div key={activeStep} className="step-text-anim" style={{ maxWidth: 680 }}>

              {/* Tag */}
              <div className="tag-anim" style={{ marginBottom: 20 }}>
                <span style={{
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: `1px solid ${current.color}45`,
                  color: current.color,
                  padding: "7px 18px",
                  borderRadius: 50,
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {current.tag}
                </span>
              </div>

              {/* Title */}
              <h2 style={{
                color: "#fff",
                fontWeight: 900,
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(42px, 7.5vw, 96px)",
                lineHeight: 1.0,
                letterSpacing: -2,
                marginBottom: 18,
              }}>
                {current.title}
              </h2>

              {/* Description */}
              <p style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "clamp(15px, 1.8vw, 18px)",
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.75,
                maxWidth: 460,
                marginBottom: 32,
              }}>
                {current.desc}
              </p>

              {/* Progress bar */}
              <div style={{
                width: 160, height: 2,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 2, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", borderRadius: 2,
                  width: `${stepLocalProgress * 100}%`,
                  background: `linear-gradient(90deg, ${current.color}, #fff)`,
                  transition: "none",
                  boxShadow: `0 0 8px ${current.color}`,
                }} />
              </div>

            </div>

            {/* Watermark number */}
            <div style={{
              position: "absolute",
              bottom: 32, right: "clamp(20px, 5vw, 80px)",
              fontSize: "clamp(110px, 17vw, 210px)",
              fontWeight: 900,
              color: "rgba(255,255,255,0.035)",
              fontFamily: "'Syne', sans-serif",
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
              transition: "color 0.4s ease",
            }}>
              {current.step}
            </div>

            {/* Scroll hint */}
            {activeStep === 0 && stepLocalProgress < 0.12 && (
              <div className="scroll-hint" style={{
                position: "absolute", bottom: 28, left: "50%",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 5,
                color: "rgba(255,255,255,0.3)",
                fontFamily: "'DM Sans', sans-serif", fontSize: 12,
              }}>
                <span>Scroll to explore</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}

export default HowItWorks;
