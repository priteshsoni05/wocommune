// AuthModal.tsx
// Supabase-ready modal supporting Email/Password + Google + LinkedIn
// Props:
//  - open: boolean
//  - onOpenChange: (open:boolean) => void
//  - role?: 'walker' | 'helpanion'  (preselect signup role when opening)
//  - initialTab?: 'signup' | 'login'  (open modal on signup or login tab)

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client"; // adjust path if different

const PINE = "#01796F";

type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  role?: "walker" | "helpanion";
  initialTab?: "signup" | "login";
};

export default function AuthModal({ open, onOpenChange, role, initialTab }: Props) {
  const [tab, setTab] = useState<"signup" | "login">(initialTab ?? "signup");
  const [selectedRole, setSelectedRole] = useState<"walker" | "helpanion">(role ?? "walker");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // When modal opens with props, sync local states
  useEffect(() => {
    if (open) {
      setTab(initialTab ?? "signup");
      setSelectedRole(role ?? "walker");
      // clear sensitive fields
      setPassword("");
    }
  }, [open, role, initialTab]);

  // Helper: check username unique
  const isUsernameTaken = async (u: string) => {
    if (!u) return false;
    const { data, error } = await supabase.from("profiles").select("id").eq("username", u).maybeSingle();
    if (error) {
      console.warn("username check error", error);
      return false;
    }
    return !!data;
  };

  // Signup flow
  const handleSignup = async () => {
    setLoading(true);
    try {
      // For helponion and walker we still require username (public id)
      if (!email || !password || !name || !username) {
        alert("Please fill name, username, email and password.");
        setLoading(false);
        return;
      }

      // check username uniqueness
      const taken = await isUsernameTaken(username);
      if (taken) {
        alert("This username is already taken. Choose another one.");
        setLoading(false);
        return;
      }

      // Sign up via Supabase; store minimal metadata in auth user and also create profile row
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            username,
            role: selectedRole,
          },
        },
      });

      if (error) {
        alert(error.message || "Signup failed");
        setLoading(false);
        return;
      }

      // If user object returned, upsert profile row
      const userId = data?.user?.id;
      if (userId) {
        // create profiles row (if you use separate table)
        await supabase.from("profiles").upsert({
          id: userId,
          name,
          username,
          role: selectedRole,
        });
      }

      alert("Signup successful — check your email to verify (if required).");
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Login flow
  const handleLogin = async () => {
    setLoading(true);
    try {
      if (!email || !password) {
        alert("Enter email and password.");
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message || "Login failed.");
        setLoading(false);
        return;
      }

      // Optionally verify roles here by querying profiles / user_roles
      // For now we just close modal and allow app to route based on roles
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  // OAuth
  const handleOAuth = async (provider: "google" | "linkedin") => {
    setLoading(true);
    try {
      // redirectTo could be adjusted per role (e.g. helponion dashboard)
      const redirectTo = window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
      });
      if (error) {
        alert(error.message || "OAuth failed");
      }
      // Note: supabase will redirect the page; we keep loading state until redirect
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "OAuth error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (tab === "signup") await handleSignup();
    else await handleLogin();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <div className="text-lg font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {tab === "signup" ? "Join the Commune" : "Welcome back"}
            </div>
            <div className="text-xs text-gray-600">{tab === "signup" ? (selectedRole === "walker" ? "Seek guidance, find your people." : "Share your path, guide others.") : "Sign in to continue"}</div>
          </div>
          <button className="text-gray-500" onClick={() => onOpenChange(false)}><X /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 text-sm ${tab === "signup" ? "border-b-2 border-[var(--pine,#01796F)] text-[var(--pine,#01796F)]" : "text-gray-600"}`}
            onClick={() => setTab("signup")}
          >
            Sign up
          </button>
          <button
            className={`flex-1 py-2 text-sm ${tab === "login" ? "border-b-2 border-[var(--pine,#01796F)] text-[var(--pine,#01796F)]" : "text-gray-600"}`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {/* Role select (visible both in signup & login to choose how to login) */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Choose role</label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value as any)} className="w-full border px-3 py-2 rounded-md text-sm">
              <option value="walker">Walker</option>
              <option value="helpanion">Helpanion</option>
            </select>
          </div>

          {/* Signup fields */}
          {tab === "signup" && (
            <>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full border px-3 py-2 rounded-md text-sm" />
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username (public)" className="w-full border px-3 py-2 rounded-md text-sm" />
            </>
          )}

          {/* Email / password */}
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email address" className="w-full border px-3 py-2 rounded-md text-sm" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full border px-3 py-2 rounded-md text-sm" />

          {/* Primary action */}
          <button type="submit" disabled={loading} className="w-full py-2 rounded-md text-white font-medium" style={{ backgroundColor: PINE }}>
            {loading ? "Please wait..." : tab === "signup" ? "Create account" : "Sign in"}
          </button>

          {/* OAuth buttons */}
          <div className="flex gap-2">
            <button type="button" onClick={() => handleOAuth("google")} className="flex-1 border px-3 py-2 rounded-md text-sm">Continue with Google</button>
            <button type="button" onClick={() => handleOAuth("linkedin")} className="flex-1 border px-3 py-2 rounded-md text-sm">Continue with LinkedIn</button>
          </div>

          {/* Small note + toggle */}
          <div className="text-xs text-gray-500 text-center">
            {tab === "signup" ? (
              <>Already a member? <button type="button" onClick={() => setTab("login")} className="text-[var(--pine,#01796F)] underline">Login</button></>
            ) : (
              <>New here? <button type="button" onClick={() => setTab("signup")} className="text-[var(--pine,#01796F)] underline">Create account</button></>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
