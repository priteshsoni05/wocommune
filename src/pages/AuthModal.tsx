import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { X } from "lucide-react";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const PINE = "#01796F";

export default function AuthModal({
  open,
  onOpenChange,
  role,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  role?: "walker" | "helpanion" | null;
}) {
  const [tab, setTab] = useState<"signup" | "login">("signup");
  const [selectedRole, setSelectedRole] = useState(role || "walker");
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });

  const handleOAuth = async (provider: "google" | "linkedin") => {
    await supabase.auth.signInWithOAuth({ provider });
  };

  const handleSubmit = async () => {
    if (tab === "signup") {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            name: form.name,
            username: form.username,
            role: selectedRole,
          },
        },
      });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
      if (error) alert(error.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg relative">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 text-gray-500"
        >
          <X size={20} />
        </button>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              tab === "signup" ? "border-b-2 border-[var(--pine)]" : ""
            }`}
            onClick={() => setTab("signup")}
          >
            Join the Commune
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              tab === "login" ? "border-b-2 border-[var(--pine)]" : ""
            }`}
            onClick={() => setTab("login")}
          >
            Already a member
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {tab === "signup" && (
            <>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="w-full border px-3 py-2 rounded-md text-sm"
              >
                <option value="walker">Join as a Walker</option>
                <option value="helpanion">Join as a Helpanion</option>
              </select>
              <input
                placeholder="Full Name"
                className="w-full border px-3 py-2 rounded-md text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Username"
                className="w-full border px-3 py-2 rounded-md text-sm"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border px-3 py-2 rounded-md text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border px-3 py-2 rounded-md text-sm"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </>
          )}

          {tab === "login" && (
            <>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                className="w-full border px-3 py-2 rounded-md text-sm"
              >
                <option value="walker">Login as Walker</option>
                <option value="helpanion">Login as Helpanion</option>
              </select>
              <input
                type="email"
                placeholder="Email"
                className="w-full border px-3 py-2 rounded-md text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full border px-3 py-2 rounded-md text-sm"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full py-2 rounded-md font-medium"
            style={{ backgroundColor: PINE, color: "#fff" }}
          >
            {tab === "signup" ? "Sign Up" : "Login"}
          </button>

          {/* OAuth */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOAuth("google")}
              className="flex-1 border px-3 py-2 rounded-md text-sm"
            >
              Continue with Google
            </button>
            <button
              onClick={() => handleOAuth("linkedin")}
              className="flex-1 border px-3 py-2 rounded-md text-sm"
            >
              Continue with LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
