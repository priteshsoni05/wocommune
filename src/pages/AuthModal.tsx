// AuthModal.tsx
// Simple tab-based Login/Sign Up modal using TailwindCSS
// You can plug your own auth logic (Supabase/Firebase/Custom API) inside handleSubmit.

import React, { useState } from "react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "login") {
      console.log("Logging in with", email, password);
      // TODO: Add login logic here
    } else {
      console.log("Signing up with", email, password);
      // TODO: Add signup logic here
    }
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              tab === "login" ? "border-b-2 border-green-700 text-green-700" : "text-gray-500"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium ${
              tab === "signup" ? "border-b-2 border-green-700 text-green-700" : "text-gray-500"
            }`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-md text-white"
            style={{ backgroundColor: "#01796F" }}
          >
            {tab === "login" ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Footer note */}
        <p className="mt-4 text-xs text-gray-500 text-center">
          By continuing, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
