import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const hasRun = useRef(false);

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const setUpSession = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            setError(error.message);
            setReady(true);
            return;
          }
        }

        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          setError("Session expired. Request a new reset link.");
        }
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setReady(true);
      }
    };

    setUpSession();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters!");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      setError(err.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div style={{ minHeight: "100vh", background: "#000", display: "grid", placeItems: "center" }}>
        <Loader2 size={28} color="#22c55e" />
      </div>
    );
  }
   if (success) {
  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "grid", placeItems: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "#0a0a0a", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 24, padding: 30, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(34,197,94,0.1)", display: "grid", placeItems: "center", margin: "0 auto 18px" }}>
          <Lock size={28} color="#22c55e" />
        </div>

        <h1 style={{ color: "#fff", fontFamily: "'Syne', sans-serif", fontSize: 26 }}>
          Password Updated
        </h1>

        <p style={{ color: "#9ca3af", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7, marginTop: 10 }}>
          Your password has been changed successfully. Redirecting you to login...
        </p>
      </div>
    </div>
  );
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
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>

    
  );
}