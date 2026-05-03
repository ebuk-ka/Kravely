import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, ShieldCheck, Store } from "lucide-react";
import { supabase } from "../lib/supabase";


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:#000}
.vendor-login{min-height:100vh;background:radial-gradient(circle at top,rgba(34,197,94,.16),transparent 32%),#000;color:#fff;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;padding:20px}
.syne{font-family:'Syne',sans-serif}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
.spin{animation:spin 1s linear infinite}
`;

export default function VendorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const checkVendorAccess = async (userId) => {
  try {
    const { data: vendor, error } = await supabase
      .from("vendors")
      .select("id, name, is_approved, owner_id")
      .eq("owner_id", userId)
      .eq("is_approved", true)
      .maybeSingle();

    if (error) {
      console.log("Vendor check error:", error.message);
      return false;
    }

    if (vendor) {
      navigate("/vendor/dashboard", { replace: true });
      return true;
    }

    return false;
  } catch (err) {
    console.log("Unexpected error:", err.message);
    return false;
  }
};
  useEffect(() => {
  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        await checkVendorAccess(session.user.id);
      }
    } catch (err) {
      console.log("Session error:", err.message);
    } finally {
      setCheckingSession(false); 
    }
  };

  checkSession();
}, []);

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter your vendor email first.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("OTP sent. Check your email and enter the code.");
    setStep("code");
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!code.trim()) {
      setError("Enter the OTP code sent to your email.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: "email",
    });

    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    const userId = data?.user?.id;

    if (!userId) {
      setLoading(false);
      setError("Login worked, but no user was returned. Try again.");
      return;
    }

    const hasAccess = await checkVendorAccess(userId);

    setLoading(false);

    if (!hasAccess) {
      setError("This email is not linked to an approved vendor yet. Contact Ebuka to activate your vendor dashboard.");
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(255,255,255,.1)",
    color: "#fff",
    borderRadius: 14,
    padding: "14px 16px",
    fontSize: 15,
    outline: "none",
    fontFamily: "'DM Sans',sans-serif",
  };

  if (checkingSession) {
    return (
      <>
        <style>{CSS}</style>
        <div className="vendor-login">
          <div style={{ textAlign: "center" }}>
            <Loader2 className="spin" size={34} color="#22c55e" />
            <p style={{ color: "#6b7280", marginTop: 12 }}>Checking vendor session...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="vendor-login">
        <div style={{ width: "100%", maxWidth: 430 }}>
          <Link to="/" style={{ color: "#9ca3af", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 18, fontWeight: 700 }}>
            <ArrowLeft size={16} /> Back to Kravely
          </Link>

          <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,.08)", borderRadius: 26, padding: "30px 24px", boxShadow: "0 24px 80px rgba(0,0,0,.55)" }}>
            <div style={{ width: 58, height: 58, borderRadius: 18, background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.25)", display: "grid", placeItems: "center", marginBottom: 18 }}>
              <Store size={26} color="#22c55e" />
            </div>

            <h1 className="syne" style={{ fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>Vendor Login</h1>
            <p style={{ color: "#9ca3af", lineHeight: 1.7, fontSize: 14, marginBottom: 22 }}>
              Login with your vendor email. After OTP verification, Kravely will open your dashboard if your account has been approved.
            </p>

            {error && (
              <div style={{ background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.25)", color: "#ef4444", padding: "12px 14px", borderRadius: 14, fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>
                {error}
              </div>
            )}

            {message && (
              <div style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.25)", color: "#22c55e", padding: "12px 14px", borderRadius: 14, fontSize: 13, marginBottom: 14, lineHeight: 1.5 }}>
                {message}
              </div>
            )}

            {step === "email" ? (
              <form onSubmit={sendOtp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", color: "#6b7280", fontSize: 12, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 7 }}>Vendor Email</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={17} color="rgba(255,255,255,.35)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vendor@email.com"
                      style={{ ...inputStyle, paddingLeft: 43 }}
                    />
                  </div>
                </div>

                <button disabled={loading} style={{ width: "100%", background: "#22c55e", color: "#000", border: "none", borderRadius: 14, padding: 15, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .65 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {loading ? <Loader2 className="spin" size={17} /> : <ShieldCheck size={17} />}
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", color: "#6b7280", fontSize: 12, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 7 }}>OTP Code</label>
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter code"
                    style={inputStyle}
                  />
                </div>

                <button disabled={loading} style={{ width: "100%", background: "#22c55e", color: "#000", border: "none", borderRadius: 14, padding: 15, fontWeight: 900, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? .65 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {loading ? <Loader2 className="spin" size={17} /> : <ShieldCheck size={17} />}
                  {loading ? "Checking..." : "Open Dashboard"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError("");
                    setMessage("");
                  }}
                  style={{ background: "transparent", border: "none", color: "#9ca3af", cursor: "pointer", fontWeight: 700 }}
                >
                  Use another email
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
