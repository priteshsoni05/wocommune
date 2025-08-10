import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Auth from "./pages/Auth";
import PublicProfile from "./pages/PublicProfile";
import Helpanion from "./pages/Helpanion";
import HelpanionsDirectory from "./pages/HelpanionsDirectory";
import WalkerDashboard from "./pages/WalkerDashboard";
import HelpanionDashboard from "./pages/HelpanionDashboard";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/get-help" element={<Helpanion />} />
            <Route path="/helpanion" element={<Helpanion />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/helpanions" element={<HelpanionsDirectory />} />
            <Route path="/walker-dashboard" element={<WalkerDashboard />} />
            <Route path="/helpanion-dashboard" element={<HelpanionDashboard />} />
            <Route path="/:username" element={<PublicProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
