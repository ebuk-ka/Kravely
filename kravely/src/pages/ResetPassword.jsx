import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState("");
    const [error,  setError] = useState("");

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError("");

        if(password.length < 6) {
            setError("Passeord must be at least 6 characters!");
            return;
        }
        if (password !== confirm) {
            setError("Psswords do not match!");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password,
        });

        if (error) {
            setError(error.message);
        }else {
            navigate("/login");
        }
        setLoading(false);
    }

        return (
          <div style={{ minHeight: "100vh", background: "#000", display: "grid", placeItems: "center", padding: 20 }}>
            <form onSubmit={handleUpdate} style={{ width: "100%", maxWidth: 420, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 28 }}>
              <Lock size={28} color="#22c55e" />
      
              <h1 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", marginTop: 18 }}>
                Reset Password
              </h1>
      
              <p style={{ color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontSize: 14, marginTop: 8 }}>
                Enter your new password.
              </p>
      
              {error && <p style={{ color: "#ef4444", marginTop: 14 }}>{error}</p>}
      
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
      
             <input
               type="password"
               placeholder="Confirm password"
               value={confirm}
               onChange={(e) => setConfirm(e.target.value)}
               required
               style={{
                 width: "100%",
                 marginTop: 12,
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
               {loading ? <Loader2 size={18} /> : "Update Password"}
             </button>
           </form>
         </div>
    
            
   );
}
