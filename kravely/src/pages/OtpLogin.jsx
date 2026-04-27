import { useState } from "react";
import { supabase } from "../lib/supabase";
import {Mail, Loader2} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OtpLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const[step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    setStep("verify");
  };

  //Verification 
  const verifyCode = async(e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const {error} =  await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email"
    }); 
    if(error) {
      setError(error.message);
      return;
    }

    navigate("/order")
  };

    return (
        <div style={{ minHeight: "100vh", background: "#000", display: "grid", placeItems: "center", padding: 20 }}>
          <div style={{ width: "100%", maxWidth: 420, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 28 }}>
            
            <Mail size={28} color="#22c55e" />
    
            <h1 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 18 }}>
              {step === "email" ? "Login with Email" : "Enter Code"}
            </h1>
    
            {error && <p style={{ color: "#ef4444", marginTop: 14 }}>{error}</p>}
    
            {/* STEP 1 */}
            {step === "email" && (
              <form onSubmit={sendCode}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    marginTop: 20,
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#fff",
                  }}
                />
    
                <button
                  disabled={loading}
                  style={{
                    width: "100%",
                    marginTop: 18,
                    padding: 14,
                    borderRadius: 14,
                    background: "#22c55e",
                    color: "#000",
                    fontWeight: 800,
                  }}
                >
                  {loading ? "Sending..." : "Send Code"}
                </button>
              </form>
            )}
    
            {/* STEP 2 */}
            {step === "verify" && (
              <form onSubmit={verifyCode}>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    marginTop: 20,
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#fff",
                  }}
                />
    
                <button
                  disabled={loading}
                  style={{
                    width: "100%",
                    marginTop: 18,
                    padding: 14,
                    borderRadius: 14,
                    background: "#22c55e",
                    color: "#000",
                    fontWeight: 800,
                  }}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                
                </button>
              </form>
            )}
          </div>
        </div>
      );
    }
