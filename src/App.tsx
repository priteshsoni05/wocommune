import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Auth from "./pages/Auth";

import PublicProfile from "./pages/PublicProfile";
import WOCommune from "./pages/WOCommune";
import HelpanionsDirectory from "./pages/HelpanionsDirectory";
import WalkerDashboard from "./pages/WalkerDashboard";
import HelpanionDashboard from "./pages/HelpanionDashboard";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import About from "./pages/About";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

/**
 * Back-compat redirect:
 * - Handles older links like /profile/:id (where :id is the auth.user.id)
 * - Looks up username by user_id and navigates to /:username
 */
function ProfileIdRedirect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const go = async () => {
      if (!id) {
        navigate("/", { replace: true });
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", id)
        .maybeSingle();

      if (!isMounted) return;

      if (data?.username) {
        navigate(`/${encodeURIComponent(data.username)}`, { replace: true });
      } else {
        // Fallback home if we can't resolve
        navigate("/", { replace: true });
      }
    };

    void go();
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Static routes first */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            
            <Route path="/wo-commune" element={<WOCommune />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/helpanions" element={<HelpanionsDirectory />} />
            {/* User-specific dashboard routes */}
            <Route path="/walker/:userId" element={<WalkerDashboard />} />
            <Route path="/helpanion/:userId" element={<HelpanionDashboard />} />
            
            {/* Legacy dashboard routes (redirect to user-specific) */}
            <Route path="/walker-dashboard" element={<WalkerDashboard />} />
            <Route path="/helpanion-dashboard" element={<HelpanionDashboard />} />

            {/* Legacy /profile/:id links get redirected to /:username */}
            <Route path="/profile/:id" element={<ProfileIdRedirect />} />

            {/* Top-level username profile route */}
            <Route path="/:username" element={<PublicProfile />} />

            {/* Keep catch-all at the end */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
