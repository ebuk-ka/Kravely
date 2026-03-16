import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function OrderCTA() {
  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          50% { box-shadow: 0 0 0 20px rgba(34,197,94,0); }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .order-btn {
          animation: pulse-glow 2s infinite;
          transition: all 0.25s ease;
        }
        .order-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 16px 40px rgba(34,197,94,0.4) !important;
        }
        .float-badge {
          animation: floatUp 3s ease-in-out infinite;
        }
        .float-badge-2 {
          animation: floatUp 3s ease-in-out infinite 1.5s;
        }
        .shimmer-text {
          background: linear-gradient(90deg, #22c55e, #4ade80, #22c55e);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        @keyframes thumbPump {
           0%   { transform: translateY(0) rotate(0deg) scale(1); }
           20%  { transform: translateY(-12px) rotate(-10deg) scale(1.2); }
           40%  { transform: translateY(0) rotate(0deg) scale(1); }
           60%  { transform: translateY(-6px) rotate(-5deg) scale(1.1); }
           80%  { transform: translateY(0) rotate(0deg) scale(1); }
           100% { transform: translateY(0) rotate(0deg) scale(1); }
}
  .thumbs-up {
  display: inline-block;
  animation: thumbPump 2s ease-in-out infinite;
  transform-origin: bottom center;
  filter: hue-rotate(85deg) saturate(2) brightness(0.6);
}
      `}</style>

      <section className="bg-black py-28 px-6 md:px-16 lg:px-24 relative overflow-hidden">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 65%)" }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />

        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)" }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal>
            <div className="text-center">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-1.5 mb-8">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                <span className="text-green-500 text-sm font-medium"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  FUTO Campus · Fast Delivery
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-white font-black mb-6"
                style={{
                  fontSize: "clamp(40px, 7vw, 88px)",
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: -2,
                  lineHeight: 1.0,
                }}>
                Hungry right now?<br />
                <span className="shimmer-text">We got you.</span><span className="thumbs-up">👍</span>
              </h2>
              {/* Subtext */}
              <p className="text-gray-400 max-w-lg mx-auto mb-10"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, lineHeight: 1.8 }}>
                Hot food from your favourite FUTO vendors,
                delivered straight to your hostel or faculty door.
                Order now in seconds.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link
                  to="/signup"
                  className="order-btn inline-block bg-green-500 text-black font-extrabold px-12 py-5 rounded-full text-lg"
                  style={{ fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}
                >
                  Order Food Now 
                </Link>
                <Link
                  to="/vendors"
                  className="inline-block bg-transparent text-white font-bold px-12 py-5 rounded-full text-lg border border-white/20"
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    textDecoration: "none",
                    transition: "all 0.25s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#22c55e"; e.currentTarget.style.color = "#22c55e"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
                >
                  Browse Vendors →
                </Link>
              </div>

              {/* Floating trust badges */}
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  {  text: "Fast Delivery" },
                  {  text: "Secure Payments" },
                  {  text: "Fresh Food" },
                  {  text: "FUTO Campus Only" },
                ].map(({ icon, text }, i) => (
                  <div
                    key={text}
                    className={i % 2 === 0 ? "float-badge" : "float-badge-2"}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 50,
                      padding: "8px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>{icon}</span>
                    <span className="text-gray-400 text-sm font-medium"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </Reveal>
        </div>

      </section>
    </>
  );
}

export default OrderCTA;
