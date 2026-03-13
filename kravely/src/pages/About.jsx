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

function About() {
  const founders = [
    {
      name: "Nimi George",
      role: "CEO & Co-founder",
      desc: "The vision behind Kravely. Nimi leads the business side — from signing vendors to making sure every student has a seamless experience.",
      initial: "N",
      gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
    },
    {
      name: "Ebuka Okolo",
      role: "CTO & Co-founder",
      desc: "The brain behind the build. Ebuka architects and builds every part of the Kravely platform — from the first line of code to deployment.",
      initial: "E",
      gradient: "linear-gradient(135deg, #4ade80, #22c55e)",
    },
  ];

  const values = [
    { icon: "⚡", title: "Speed", desc: "We know you're hungry. Every part of Kravely is built to get food to you as fast as possible." },
    { icon: "🔒", title: "Trust", desc: "Your payments are secure, your orders are tracked and your vendors are verified." },
    { icon: "🤝", title: "Community", desc: "Kravely isn't just an app — it's a bridge between students and the campus vendors who feed them every day." },
  ];

  return (
    <>
      <style>{`
        .founder-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .founder-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 60px rgba(34,197,94,0.12);
          border-color: rgba(34,197,94,0.25) !important;
        }
        .value-card {
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .value-card:hover {
          transform: translateY(-4px);
          border-color: rgba(34,197,94,0.25) !important;
        }
      `}</style>

      {/* Hero */}
      <section className="bg-black min-h-screen relative overflow-hidden flex items-center">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(34,197,94,0.07) 0%, transparent 60%)" }} />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #22c55e 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-16 py-32 text-center">
          <Reveal>
            <span className="text-green-500 text-xs font-semibold tracking-widest uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Our Story
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-white font-black mt-4 mb-6"
              style={{
                fontSize: "clamp(40px, 7vw, 80px)",
                fontFamily: "'Syne', sans-serif",
                letterSpacing: -2,
                lineHeight: 1.05
              }}>
              We built Kravely<br />
              <span style={{
                background: "linear-gradient(90deg, #22c55e, #4ade80)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                because we were hungry.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-gray-400 max-w-2xl mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, lineHeight: 1.9 }}>
              Literally. As FUTO students, we knew the struggle — long walks to find food,
              vendors with no online presence, no way to order ahead. So instead of complaining,
              we built the solution. Kravely is our answer to a problem every student on this campus faces every single day.
            </p>
          </Reveal>
        </div>

      </section>

      {/* Mission */}
      <section className="bg-[#030303] py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="rounded-3xl p-10 md:p-14 text-center relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(0,0,0,0) 100%)",
                border: "1px solid rgba(34,197,94,0.12)"
              }}>
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent)" }} />
              <p className="text-white font-black"
                style={{
                  fontSize: "clamp(22px, 3.5vw, 38px)",
                  fontFamily: "'Syne', sans-serif",
                  lineHeight: 1.5, letterSpacing: -0.5
                }}>
                "Every FUTO student deserves hot food,<br className="hidden md:block" />
                <span style={{ color: "#22c55e" }}> fast — without the stress."</span>
              </p>
              <p className="text-gray-600 mt-5 text-sm"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                — The Kravely Mission
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-black py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-green-500 text-xs font-semibold tracking-widest uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                What We Stand For
              </span>
              <h2 className="text-white font-black mt-3"
                style={{ fontSize: "clamp(28px, 4vw, 44px)", fontFamily: "'Syne', sans-serif", letterSpacing: -1 }}>
                Our Values
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map(({ icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 120}>
                <div className="value-card rounded-2xl p-7 border border-white/5"
                  style={{ background: "#0a0a0a" }}>
                  <span className="text-3xl mb-4 block">{icon}</span>
                  <h3 className="text-white font-bold text-lg mb-2"
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
        </div>
      </section>

      {/* Founders */}
      <section className="bg-[#030303] py-20 px-6 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-green-500 text-xs font-semibold tracking-widest uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                The People Behind It
              </span>
              <h2 className="text-white font-black mt-3"
                style={{ fontSize: "clamp(28px, 4vw, 44px)", fontFamily: "'Syne', sans-serif", letterSpacing: -1 }}>
                Meet the Founders
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {founders.map(({ name, role, desc, initial, gradient }, i) => (
              <Reveal key={name} delay={i * 150}>
                <div className="founder-card rounded-3xl p-8 border border-white/5 relative overflow-hidden"
                  style={{ background: "#0a0a0a" }}>

                  {/* Watermark */}
                  <div className="absolute -bottom-6 -right-4 font-black select-none pointer-events-none"
                    style={{
                      fontSize: 140, fontFamily: "'Syne', sans-serif",
                      background: gradient, WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent", opacity: 0.05, lineHeight: 1,
                    }}>
                    {initial}
                  </div>

                  <div className="relative z-10">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0"
                        style={{ background: gradient, color: "#000", fontFamily: "'Syne', sans-serif" }}>
                        {initial}
                      </div>
                      <div>
                        <h4 className="text-white font-black text-lg"
                          style={{ fontFamily: "'Syne', sans-serif" }}>
                          {name}
                        </h4>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full mt-1 inline-block"
                          style={{
                            background: "rgba(34,197,94,0.08)",
                            color: "#22c55e",
                            border: "1px solid rgba(34,197,94,0.2)",
                            fontFamily: "'DM Sans', sans-serif",
                          }}>
                          {role}
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px mb-5"
                      style={{ background: "linear-gradient(90deg, rgba(34,197,94,0.3), transparent)" }} />

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed"
                      style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8 }}>
                      {desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Bottom line */}
          <Reveal delay={300}>
            <p className="text-center text-green-500 font-bold mt-14"
              style={{ fontFamily: "'Syne', sans-serif", fontSize: 16 }}>
              Built at FUTO with code & jollof rice. 🍚🇳🇬
            </p>
            <p className="text-center text-gray-600 text-sm mt-2"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Founded 2025 · Federal University of Technology Owerri
            </p>
          </Reveal>

        </div>
      </section>
    </>
  );
}

export default About;
