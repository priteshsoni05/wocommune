import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Role = "walker" | "helpanion";

export default function AuthModal({ open, onOpenChange }: Props) {
  const [tab, setTab] = useState<"signup" | "login">("signup");
  const [selectedRole, setSelectedRole] = useState<Role>("walker");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailOrUsername, setEmailOrUsername] = useState(""); // for helpanion login
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isUsernameTaken = async (u: string) => {
    const { data, error } = await supabase.from("profiles").select("id").eq("username", u).maybeSingle();
    if (error) {
      console.warn("username check error", error);
      return false;
    }
    return !!data;
  };

  const getRedirect = (r: Role) => (r === "helpanion" ? "/helpanion-dashboard" : "/walker-dashboard");

  // Signup flow (skips email verification — ensure Supabase confirm email is disabled)
  const handleSignup = async () => {
    setLoading(true);
    try {
      if (!email || !password || !name) {
        alert("Please fill name, email and password.");
        setLoading(false);
        return;
      }

      if (selectedRole === "helpanion") {
        if (!username) {
          alert("Please choose a username for your public profile.");
          setLoading(false);
          return;
        }
        const taken = await isUsernameTaken(username);
        if (taken) {
          alert("This username is already taken. Choose another one.");
          setLoading(false);
          return;
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            username: selectedRole === "helpanion" ? username : null,
            role: selectedRole,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        alert(error.message || "Signup failed");
        setLoading(false);
        return;
      }

      // With email verification disabled, we should have a session; finalize profile + role
      const userId = data?.user?.id;
      if (userId) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          user_id: userId,
          display_name: name,
          username: selectedRole === "helpanion" ? username : null,
          email,
          last_active_role: selectedRole,
          status: "active",
        });
        if (profileError) {
          console.error("Profile creation error:", profileError);
        }

        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: userId,
          role: selectedRole,
        });
        if (roleError && !/duplicate/i.test(roleError.message)) {
          console.error("Role creation error:", roleError);
        }
      }

      onOpenChange(false);
      navigate(getRedirect(selectedRole));
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
      let loginEmail = email;

      // Helpanion can use email or username
      if (selectedRole === "helpanion" && emailOrUsername && !emailOrUsername.includes("@")) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("email")
          .eq("username", emailOrUsername)
          .single();
        if (profileData?.email) {
          loginEmail = profileData.email;
        } else {
          alert("No account found with this username.");
          setLoading(false);
          return;
        }
      } else if (selectedRole === "helpanion") {
        loginEmail = emailOrUsername;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) {
        alert(error.message || "Login failed");
        setLoading(false);
        return;
      }

      // After login, route by chosen role; if user lacks the role, they can add it from dashboards
      navigate(getRedirect(selectedRole));
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "signup") {
      await handleSignup();
    } else {
      await handleLogin();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-lg">
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
          {/* Role select */}
          <div>
            <label className="text-xs text-gray-600 block mb-1">Choose role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role)}
              className="w-full border px-3 py-2 rounded-md text-sm"
            >
              <option value="walker">Walker</option>
              <option value="helpanion">Helpanion</option>
            </select>
          </div>

          {/* Signup fields */}
          {tab === "signup" && (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full border px-3 py-2 rounded-md text-sm"
              />
              {selectedRole === "helpanion" && (
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username (public)"
                  className="w-full border px-3 py-2 rounded-md text-sm"
                />
              )}
            </>
          )}

          {/* Email / password */}
          <input
            value={tab === "login" && selectedRole === "helpanion" ? emailOrUsername : email}
            onChange={(e) => (tab === "login" && selectedRole === "helpanion" ? setEmailOrUsername(e.target.value) : setEmail(e.target.value))}
            placeholder={tab === "login" && selectedRole === "helpanion" ? "Email or username" : "Email"}
            className="w-full border px-3 py-2 rounded-md text-sm"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 chars)"
            className="w-full border px-3 py-2 rounded-md text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[var(--pine,#01796F)] py-2 text-white text-sm disabled:opacity-60"
          >
            {loading ? "Please wait..." : tab === "signup" ? "Create account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
