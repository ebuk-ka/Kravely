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
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

export default function Contact() {
  return (
    <div className="bg-black min-h-screen text-white">
      <section className="max-w-6xl mx-auto px-6 md:px-16 py-24">
        <Reveal>
          <h1 className="text-4xl md:text-6xl font-black mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
            Contact Kravely
          </h1>
        </Reveal>

        <Reveal delay={80}>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            We are committed to making food delivery on campus easy, fast, and reliable.
            If you have questions, feedback, vendor interest or support requests, send us a message below.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Reveal delay={160}>
            <div className="p-6 border border-green-500/20 rounded-2xl bg-[#0a0a0a]">
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Get in Touch</h2>
              <ul className="space-y-3 text-gray-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <li><strong>Email:</strong> kravelyhelp@gmail.com</li>
                <li><strong>Phone:</strong> 09038704821</li>
                <li><strong>Instagram:</strong>@kravely_ng</li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <div className="p-6 border border-green-500/20 rounded-2xl bg-[#0a0a0a]">
              <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Need help?</h2>
              <p className="text-gray-300 leading-relaxed mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                For quicker support, include:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <li>Your name and student ID</li>
                <li>Order number (if applicable)</li>
                <li>What happened and what you expected</li>
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={320}>
          <div className="mt-10 p-6 border border-white/10 rounded-2xl bg-[#0f0f0f]">
            <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Syne', sans-serif" }}>Send us a message</h3>
            <form className="space-y-4">
              <input type="text" name="name" placeholder="Your Name" className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white outline-none" />
              <input type="email" name="email" placeholder="Email Address" className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white outline-none" />
              <textarea name="message" rows={5} placeholder="How can we help?" className="w-full bg-[#141414] border border-white/10 rounded-lg px-4 py-3 text-white outline-none" />
              <button type="submit" className="bg-green-500 hover:bg-green-600 text-black font-bold px-6 py-3 rounded-full transition">Send Message</button>
            </form>
          </div>
        </Reveal>

      </section>
    </div>
  );
}
