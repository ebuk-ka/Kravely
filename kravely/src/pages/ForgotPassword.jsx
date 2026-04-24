import { useState } from "react";
import { supabase } from "../lib/supabase";
import {Mali, Loader2} from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] =useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleReset =async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("")


        const {error} = await supabase.auth.resetPaswordForEmail(email,{
            redirectTo:`${window.location.origin}/reset-password`
        });

        if(error) {
            setError(error.message);
        } else {
            setMessage("Password reset link sent, Check your email.");
        }

        setLoading(false);
    };
    
    return (
        <div style={{minHeight:"100vh", background : "#000", display:"grid", placeItems: "center", padding:20}}>
          <form onSubmit={handleReset} style={{ width: "100%", maxWidth: 420, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 28 }}>
            <Mail size={28} color="#22c55e"/>

            <h1 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 18 }}>
              Forgot Password
            </h1>
            <p style={{ color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginTop: 8 }}>
              Enter your email and we’ll send you a reset link.
           </p>
           {message && <p style={{ color: "#22c55e", marginTop: 14 }}>{message}</p>}
           {error && <p style ={{color:"#ef4444", marginTop: 14}}>{error}</p>}

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
                 outline: "none",
          }}
        />
           <button
              disabled={loading}
              style={{
                width: "100%",
                marginTop: 18,
                padding: 14,
                borderRadius: 14,
                border: "none",
                background: "#22c55e",
                color: "#000",
                fontWeight: 800,
                cursor: loading ? "not-allowed" : "pointer",
          }}
        >
            {loading ? <Loader2 size={18} /> : "Send Reset Link"}
        </button>
          </form>
        </div>
    )
}