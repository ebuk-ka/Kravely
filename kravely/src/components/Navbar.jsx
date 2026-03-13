import { useState, useEffect } from "react";
import logo from "../assets/images/kravely.logo.png";

// ===================== FLIP LINK =====================
function FlipLink({ href, children }) {
  return (
    <>
      <style>{`
        .flip-link {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          flex-direction: column;
          height: 20px;
          text-decoration: none;
        }
        .flip-top {
          display: block;
          color: #d1fae5;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          white-space: nowrap;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .flip-bottom {
          display: block;
          color: #22c55e;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          white-space: nowrap;
          position: absolute;
          top: 100%;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .flip-link:hover .flip-top { transform: translateY(-100%); }
        .flip-link:hover .flip-bottom { transform: translateY(-100%); }
      `}</style>
      <a href={href} className="flip-link">
        <span className="flip-top">{children}</span>
        <span className="flip-bottom">{children}</span>
      </a>
    </>
  );
}

// ===================== NAVBAR =====================
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes logoWobble {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(-8deg); }
          30% { transform: rotate(6deg); }
          45% { transform: rotate(-4deg); }
          60% { transform: rotate(2deg); }
          75% { transform: rotate(-1deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .logo-wobble { animation: logoWobble 1s ease 0.5s 1; }
        .mobile-menu-anim { animation: slideDown 0.3s ease; }
        .ham-line {
          display: block;
          width: 24px;
          height: 2px;
          background: white;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .is-open .ham-line1 { transform: translateY(8px) rotate(45deg); }
        .is-open .ham-line2 { opacity: 0; }
        .is-open .ham-line3 { transform: translateY(-8px) rotate(-45deg); }
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-md border-b border-white/10"
          : "bg-transparent"
      }`}>
        <div className="relative max-w-7xl mx-auto flex items-center justify-between px-8 md:px-12"
          style={{ height: "72px" }}>

          {/* LOGO */}
          <a href="#" className="flex items-center flex-shrink-0 z-10">
            <img
              src={logo}
              alt="Kravely"
              className="logo-wobble object-contain"
              style={{ height: "100px", width: "auto", maxWidth: "180px mr-20px"  }}
            />
          </a>

          {/* NAV LINKS — perfectly centered */}
          <div className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <FlipLink href="#">Home</FlipLink>
            <FlipLink href="#">Vendors</FlipLink>
            <FlipLink href="#">How It Works</FlipLink>
            <FlipLink href="#">About</FlipLink>
          </div>

          {/* ORDER NOW — right side */}
          <div className="hidden md:flex items-center z-10">
            <a
              href="#"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="bg-green-500 text-black font-bold text-sm px-6 py-2.5 rounded-full transition-all duration-200 hover:bg-green-600 hover:scale-105 no-underline"
            >
              Order Now
            </a>
          </div>

          {/* HAMBURGER */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1 z-10 ${menuOpen ? "is-open" : ""}`}
          >
            <span className="ham-line ham-line1" />
            <span className="ham-line ham-line2" />
            <span className="ham-line ham-line3" />
          </button>

        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu-anim fixed top-[72px] left-0 right-0 z-40 bg-black/98 backdrop-blur-md border-b border-white/10 flex flex-col gap-6 px-10 pt-6 pb-8 md:hidden">
          {["Home", "Vendors", "How It Works", "About"].map(link => (
            <a
              key={link}
              href="#"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              className="text-green-100 text-lg font-semibold border-b border-white/10 pb-4 transition-colors duration-200 hover:text-green-500 no-underline"
            >
              {link}
            </a>
          ))}
          <a
            href="#"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="bg-green-500 text-black font-bold text-base text-center py-3.5 rounded-full no-underline hover:bg-green-600 transition-colors duration-200"
          >
            Order Now
          </a>
        </div>
      )}
    </>
  );
}

export default Navbar;
