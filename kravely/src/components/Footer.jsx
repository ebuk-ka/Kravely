import { Link } from "react-router-dom";
import logo from "../assets/images/kravely.logo.png";
import playstorelogo from "../assets/images/playstore.png";
import appstorelogo from "../assets/images/appstore.png";

function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    {
      title: "Platform",
      items: [
        { label: "Browse Vendors", to: "/vendors" },
        { label: "How It Works", to: "/#how-it-works" },
        { label: "Order Tracking", to: "/tracking" },
        { label: "Student Signup", to: "/signup" },
      ],
    },
    {
      title: "Vendors",
      items: [
        { label: "Join as Vendor", to: "/vendor/signup" },
        { label: "Vendor Dashboard", to: "/vendor/dashboard" },
        { label: "Vendor Support", to: "/support" },
      ],
    },
    {
      title: "Company",
      items: [
        { label: "About Us", to: "/about" },
        { label: "Contact", to: "/contact" },
        { label: "Privacy Policy", to: "/privacy" },
        { label: "Terms of Service", to: "/terms" },
      ],
    },
  ];

  const socials = [
    {
      name: "Instagram",
      href: "#",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "#",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: "#",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.522 5.854L.057 23.5l5.793-1.44A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.502-5.2-1.38l-.374-.217-3.876.964.981-3.782-.244-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        .footer-link {
          color: #6b7280;
          text-decoration: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          transition: color 0.2s ease, transform 0.2s ease;
          display: inline-block;
        }
        .footer-link:hover {
          color: #22c55e;
          transform: translateX(4px);
        }
        .social-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: all 0.2s ease;
          cursor: pointer;
          text-decoration: none;
        }
        .social-btn:hover {
          background: rgba(34,197,94,0.1);
          border-color: rgba(34,197,94,0.3);
          color: #22c55e;
          transform: translateY(-3px);
        }
        .store-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .store-btn:hover {
          border-color: rgba(34,197,94,0.3);
          background: rgba(34,197,94,0.05);
        }
      `}</style>

      <footer className="bg-[#030303] relative overflow-hidden">

        {/* Top border */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(34,197,94,0.3), transparent)" }} />

        {/* Background dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: "radial-gradient(circle, #22c55e 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }} />

        <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 relative z-10">

          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16">

            {/* Brand column */}
            <div className="lg:col-span-2">

              {/* Logo */}
              <Link to="/" className="flex items-center flex-shrink-0 z-10">
                <img
                  src={logo}
                  alt="Kravely"
                  className="object-contain"
                  style={{ height: "100px", width: "auto", maxWidth: "160px", marginLeft: "-10px" }}
                />
              </Link>

              <p className="text-gray-500 mt-4 max-w-xs leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.8 }}>
                The fastest way to order food on FUTO campus. Hot meals delivered to your hostel or faculty in minutes.
              </p>

              {/* Socials */}
              <div className="flex gap-3 mt-8">
                {socials.map(({ name, href, icon }) => (
                  <a key={name} href={href} className="social-btn" title={name}>
                    {icon}
                  </a>
                ))}
              </div>

              {/* App store badges */}
             <div style={{ position: "relative", display: "inline-block" }}>
              <a href="#" className="store-btn" style={{ opacity: 0.5, cursor: "not-allowed", filter: "grayscale(0.3)" }}>
                <img src={appstorelogo} alt="App Store"
                  style={{ height: "28px", width: "auto", objectFit: "contain" }} />
              </a>
              <span style={{
                position: "absolute", top: "-10px", right: "-8px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "#000", fontSize: 9, fontWeight: 800,
                fontFamily: "'DM Sans', sans-serif",
                padding: "2px 7px", borderRadius: 50,
                letterSpacing: "0.5px", textTransform: "uppercase",
                boxShadow: "0 2px 8px rgba(34,197,94,0.4)",
                whiteSpace: "nowrap",
              }}>Soon</span>
            </div>
            
            <div style={{ position: "relative", display: "inline-block" }}>
              <a href="#" className="store-btn" style={{ opacity: 0.5, cursor: "not-allowed", filter: "grayscale(0.3)" }}>
                <img src={playstorelogo} alt="Google Play"
                  style={{ height: "28px", width: "auto", objectFit: "contain" }} />
              </a>
              <span style={{
                position: "absolute", top: "-10px", right: "-8px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                color: "#000", fontSize: 9, fontWeight: 800,
                fontFamily: "'DM Sans', sans-serif",
                padding: "2px 7px", borderRadius: 50,
                letterSpacing: "0.5px", textTransform: "uppercase",
                boxShadow: "0 2px 8px rgba(34,197,94,0.4)",
                whiteSpace: "nowrap",
              }}>Soon</span>
            </div>
            </div>

            {/* Links columns */}
            {links.map(({ title, items }) => (
              <div key={title}>
                <h4 className="text-white font-bold mb-5 text-sm"
                  style={{ fontFamily: "'Syne', sans-serif", letterSpacing: 0.5 }}>
                  {title}
                </h4>
                <div className="flex flex-col gap-3">
                  {items.map(({ label, to }) => (
                    <Link key={label} to={to} className="footer-link">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

            <p className="text-gray-600 text-sm text-center md:text-left"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              © {currentYear} Kravely Technologies. All rights reserved.
            </p>

            <div className="flex gap-5">
              {["Privacy Policy", "Terms of Service"].map(item => (
                <Link key={item} to="#"
                  className="text-gray-600 text-sm hover:text-green-500 transition-colors duration-200"
                  style={{ fontFamily: "'DM Sans', sans-serif", textDecoration: "none" }}>
                  {item}
                </Link>
              ))}
            </div>

          </div>

        </div>
      </footer>
    </>
  );
}

export default Footer;
