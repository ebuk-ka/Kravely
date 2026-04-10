// ============================================================
// src/hooks/useAuth.js
// Global auth hook — use this anywhere to get the current user
// ============================================================
// Usage:
//   const { user, profile, loading, signUp, signIn, signOut } = useAuth()
// ============================================================

import { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../lib/supabase";

// ===================== AUTH CONTEXT =====================
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);         // Supabase auth user
  const [profile, setProfile] = useState(null);   // Profile from profiles table
  const [loading, setLoading] = useState(true);

  // Fetch profile from profiles table
  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (!error) setProfile(data);
  };

  // Listen to auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    // Listen to login/logout events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ===== SIGN UP =====
  const signUp = async ({ fullName, email, phone, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) throw error;

    // Update phone in profile (trigger creates basic profile)
    if (data.user && phone) {
      await supabase
        .from("profiles")
        .update({ phone, full_name: fullName })
        .eq("id", data.user.id);
    }

    return data;
  };

  // ===== SIGN IN =====
  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // ===== GOOGLE SIGN IN =====
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/order`,
      },
    });
    if (error) throw error;
    return data;
  };

  // ===== SIGN OUT =====
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
  };

  // ===== FORGOT PASSWORD =====
  const forgotPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  // ===== UPDATE PROFILE =====
  const updateProfile = async (updates) => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select()
      .single();
    if (error) throw error;
    setProfile(data);
    return data;
  };

  const value = {
    user,
    profile,
    loading,
    isLoggedIn: !!user,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    forgotPassword,
    updateProfile,
    fetchProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth anywhere
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

export default useAuth;
