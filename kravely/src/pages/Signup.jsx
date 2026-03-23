import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert("Passwords don't match!");
    if (!agreed) return alert("Please agree to the terms");
    setLoading(true);
    // TODO: connect to backend
    setTimeout(() => {
      setLoading(false);
      navigate("/order");
    }, 2000);
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Too short", color: "#ef4444", width: "25%" };
    if (p.length < 8) return { label: "Weak", color: "#f97316", width: "50%" };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Medium", color: "#eab308", width: "75%" };
    return { label: "Strong 💪", color: "#22c55e", width: "100%" };
  };

  const strength = passwordStrength();

  return (
    <>
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .signup-anim { animation: slideInUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 15px 18px;
          color: #fff;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.2s ease;
        }
        .input-field:focus {
          border-color: rgba(34,197,94,0.5);
          background: rgba(34,197,94,0.04);
          box-shadow: 0 0 0 3px rgba(34,197,94,0.08);
        }
        .input-field::placeholder { color: rgba(255,255,255,0.2); }
        .signup-btn {
          width: 100%;
          background: #22c55e;
          color: #000;
          font-weight: 800;
          font-size: 16px;
          font-family: 'DM Sans', sans-serif;
          padding: 16px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .signup-btn:hover {
          background: #16a34a;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(34,197,94,0.3);
        }
        .signup-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .shimmer-logo {
          background: linear-gradient(90deg, #22c55e, #4ade80, #22c55e);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .social-btn {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 13px;
          color: #fff;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s ease;
        }
        .social-btn:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.15);
        }
        input[type="checkbox"] { accent-color: #22c55e; }
      `}</style>

      <div className="min-h-screen bg-black flex">

        {/* LEFT — Visual panel (hidden on mobile) */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center"
          style={{ background: "#050505", borderRight: "1px solid rgba(255,255,255,0.05)" }}>

          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(34,197,94,0.1) 0%, transparent 65%)" }} />
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

          <div className="relative z-10 text-center px-12">
            <div className="text-8xl mb-8">🚀</div>
            <h3 className="text-white font-black text-4xl mb-4"
              style={{ fontFamily: "'Syne', sans-serif", letterSpacing: -1 }}>
              Join thousands<br />
              <span style={{
                background: "linear-gradient(90deg, #22c55e, #4ade80)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>of FUTO students.</span>
            </h3>
            <p className="text-gray-500 text-lg max-w-xs mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7 }}>
              Sign up free and start ordering hot food from your favourite campus vendors.
            </p>

            {/* Steps preview */}
            <div className="flex flex-col gap-3 mt-10 max-w-xs mx-auto">
              {[
                { step: "01", text: "Create your free account" },
                { step: "02", text: "Browse FUTO vendors" },
                { step: "03", text: "Order and enjoy! 🍔" },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-3 text-left"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 16px" }}>
                  <span className="font-black text-xs flex-shrink-0"
                    style={{ color: "#22c55e", fontFamily: "'Syne', sans-serif" }}>{step}</span>
                  <span className="text-gray-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-y-auto">

          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(34,197,94,0.05) 0%, transparent 60%)" }} />
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle, #22c55e 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

          <div className="relative z-10 w-full max-w-md signup-anim">

            {/* Logo */}
            <Link to="/" style={{ textDecoration: "none" }}>
              <h1 className="shimmer-logo font-black text-3xl mb-2"
                style={{ fontFamily: "'Syne', sans-serif", letterSpacing: -1 }}>
                Kravely
              </h1>
            </Link>
            <p className="text-gray-500 text-sm mb-8"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Campus food delivery at FUTO 🎓
            </p>

            <h2 className="text-white font-black mb-2"
              style={{ fontSize: "clamp(26px, 4vw, 36px)", fontFamily: "'Syne', sans-serif", letterSpacing: -1 }}>
              Create your account
            </h2>
            <p className="text-gray-500 mb-7"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>
              Join Kravely and order food on FUTO campus
            </p>

            {/* Google signup */}
            <button className="social-btn mb-5">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-gray-600 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>or sign up with email</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 mb-5">

                {/* Full name */}
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>Full Name</label>
                  <input className="input-field" type="text" name="fullName"
                    value={form.fullName} onChange={handleChange}
                    placeholder="e.g. Ebuka Okolo" required />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>Email Address</label>
                  <input className="input-field" type="email" name="email"
                    value={form.email} onChange={handleChange}
                    placeholder="you@example.com" required />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>Phone Number</label>
                  <input className="input-field" type="tel" name="phone"
                    value={form.phone} onChange={handleChange}
                    placeholder="080XXXXXXXX" required />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>Password</label>
                  <div className="relative">
                    <input className="input-field" type={showPassword ? "text" : "password"}
                      name="password" value={form.password} onChange={handleChange}
                      placeholder="Create a strong password" required style={{ paddingRight: 50 }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18 }}>
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {/* Password strength */}
                  {strength && (
                    <div className="mt-2">
                      <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: 2, transition: "all 0.3s ease" }} />
                      </div>
                      <p style={{ color: strength.color, fontSize: 11, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-gray-400 text-xs font-semibold mb-2 uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>Confirm Password</label>
                  <input className="input-field" type="password" name="confirmPassword"
                    value={form.confirmPassword} onChange={handleChange}
                    placeholder="Repeat your password" required
                    style={{ borderColor: form.confirmPassword && form.password !== form.confirmPassword ? "rgba(239,68,68,0.5)" : "" }} />
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p style={{ color: "#ef4444", fontSize: 11, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                      Passwords don't match
                    </p>
                  )}
                </div>

              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  I agree to Kravely's{" "}
                  <Link to="/terms" className="text-green-500 hover:text-green-400" style={{ textDecoration: "none" }}>Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-green-500 hover:text-green-400" style={{ textDecoration: "none" }}>Privacy Policy</Link>
                </span>
              </label>

              {/* Submit */}
              <button type="submit" className="signup-btn" disabled={loading || !agreed}>
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.3)" strokeWidth="3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#000" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Creating account...
                  </span>
                ) : "Create Account 🚀"}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center text-gray-500 text-sm mt-6"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Already have an account?{" "}
              <Link to="/login" className="text-green-500 font-bold hover:text-green-400 transition-colors"
                style={{ textDecoration: "none" }}>Sign in</Link>
            </p>

            {/* Vendor link */}
            <p className="text-center text-gray-600 text-xs mt-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Are you a vendor?{" "}
              <Link to="/vendor/signup" className="text-green-500 hover:text-green-400 transition-colors"
                style={{ textDecoration: "none" }}>Register here →</Link>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}

export default Signup;
