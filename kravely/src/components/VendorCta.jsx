import { useEffect, useRef, useState } from "react";

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

function VendorCTA() {
  const perks = [
    {  title: "Your Own Dashboard", desc: "Manage your menu, track orders and see your earnings all in one place." },
    {  title: "Reach More Students", desc: "Get discovered by hundreds of hungry FUTO students every single day." },
    {  title: "Grow Your Revenue", desc: "More visibility means more orders. Kravely helps your business grow on campus." },
    {  title: "Free to Join", desc: "No setup fees. Sign up, list your menu and start receiving orders immediately." },
  ];

  return (
    <>
      <style>{`
        .perk-card {
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .perk-card:hover {
          transform: translateY(-6px);
          border-color: rgba(34,197,94,0.3) !important;
          box-shadow: 0 20px 40px rgba(34,197,94,0.08);
        }
        .vendor-btn {
          transition: all 0.25s ease;
        }
        .vendor-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 12px 32px rgba(34,197,94,0.3);
        }
      `}</style>

      <section className="bg-[#030303] py-24 px-6 md:px-16 lg:px-24 relative overflow-hidden">

        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)" }} />

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(34,197,94,0.06) 0%, transparent 60%)" }} />

        <div className="max-w-6xl mx-auto relative z-10">

          {/* Header */}
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-green-500 text-xs font-semibold tracking-widest uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                For Vendors
              </span>
              <h2 className="text-white font-black mt-3"
                style={{
                  fontSize: "clamp(32px, 5vw, 60px)",
                  fontFamily: "'Syne', sans-serif",
                  letterSpacing: -1,
                  lineHeight: 1.1
                }}>
                Want to become a<br />
                <span style={{
                  background: "linear-gradient(90deg, #22c55e, #4ade80, #22c55e)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  Kravely Vendor?
                </span>
              </h2>
              <p className="text-gray-400 mt-5 max-w-xl mx-auto"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, lineHeight: 1.8 }}>
                Join the fastest growing campus food platform at FUTO.
                List your menu, receive orders and grow your business — all from one simple dashboard.
              </p>
            </div>
          </Reveal>

          {/* Perks grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {perks.map(({ icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="perk-card rounded-2xl p-6 border border-white/5 h-full"
                  style={{ background: "#0a0a0a" }}>
                  <span className="text-3xl mb-4 block">{icon}</span>
                  <h3 className="text-white font-bold text-base mb-2"
                    style={{ fontFamily: "'Syne', sans-serif" }}>
                    {title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed"
                    style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA Banner */}
          <Reveal delay={200}>
            <div className="rounded-3xl p-10 md:p-14 relative overflow-hidden text-center"
              style={{
                background: "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(0,0,0,0) 100%)",
                border: "1px solid rgba(34,197,94,0.2)"
              }}>

              {/* Top shine */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.5), transparent)" }} />

              {/* Big background K watermark */}
              <div className="absolute -right-8 -bottom-8 font-black select-none pointer-events-none"
                style={{
                  fontSize: 220, fontFamily: "'Syne', sans-serif",
                  color: "rgba(34,197,94,0.03)", lineHeight: 1
                }}>K</div>

              <div className="relative z-10">
                <h3 className="text-white font-black mb-3"
                  style={{
                    fontSize: "clamp(24px, 4vw, 42px)",
                    fontFamily: "'Syne', sans-serif",
                    letterSpacing: -1
                  }}>
                  Ready to grow your business?
                </h3>
                <p className="text-gray-400 mb-8 max-w-lg mx-auto"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, lineHeight: 1.7 }}>
                  We're still growing and carefully onboarding vendors to maintain quality.
                </p>

                {/* Locked state banner */}
                <div style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1.5px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: 16,
                  padding: "16px 20px",
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  justifyContent: "center"
                }}>
                  <span style={{ fontSize: 20 }}>🔒</span>
                  <div>
                    <p style={{
                      color: "#60a5fa",
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 700,
                      fontSize: 14,
                      margin: 0
                    }}>
                      Vendor Registration Temporarily Closed
                    </p>
                    <p style={{
                      color: "#94a3b8",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      margin: "4px 0 0 0"
                    }}>
                      We're not accepting new vendors right now. Check back soon!
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">

                  {/* WhatsApp Waitlist button */}
                  <a
                    href="https://chat.whatsapp.com/Htvsu1kFSdg8TXOIuHqS9k"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: "#22c55e",
                      color: "#fff",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 700,
                      padding: "14px 40px",
                      borderRadius: 50,
                      fontSize: 16,
                      border: "1px solid #22c55e",
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "inline-block",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#16a34a";
                      e.target.style.borderColor = "#16a34a";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "#22c55e";
                      e.target.style.borderColor = "#22c55e";
                    }}
                  >
                    Join Our Waitlist on WhatsApp
                  </a>

                </div>

                <div style={{ marginTop: 12, padding: "14px 18px", border: "1px dashed rgba(148,163,184,0.5)", borderRadius: 18, background: "rgba(15, 23, 42, 0.6)" }}>
                  <p style={{ margin: 0, color: "#cbd5e1", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6 }}>
                    Interested in joining later? Send your interest to <strong style={{ color: "#22c55e" }}>vendors@kravely.com</strong> and we’ll follow up when we can onboard more high-quality partners.
                  </p>
                </div>

                <p className="text-gray-600 text-xs mt-6"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  �� Premium applicants are reviewed in weekly batches.
                </p>
              </div>

            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}

export default VendorCTA;
