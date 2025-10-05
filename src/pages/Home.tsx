// HomePage.tsx
// React + Tailwind responsive homepage for Walker's Odyssey
// - Uses real assets from src/assets
// - Newsletter CTA links to Substack as requested

import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Newsletter } from '@/components/common/Newsletter';
import { Footer } from '@/components/common/Footer';
import GlobalHeader from '@/components/common/GlobalHeader';
import { useAuth } from "@/contexts/AuthContext";
import { useRolePersistence } from "@/hooks/useRolePersistence";
import { supabase } from "@/integrations/supabase/client";

/* ---------- Real images (from src/assets) ---------- */
import HERO_IMG from "../assets/hero-section-image.webp";
import ABOUT_IMG from "../assets/about-placeholder-portrait.jpg";
import EVENT_PLACEHOLDER from "../assets/event-placeholder.jpg";


/* ---------- Brand color tokens (used inline for clarity) ---------- */
const PINE = "#193232"; // pine forest green
const GOLD = "#f2f2f2"; // accent gold

// Helper function for clean first name
const titleCase = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

const deriveFirstName = (profile: any, user: any) => {
  const meta = user?.user_metadata || {};
  const candidates = [
    profile?.display_name,
    meta.given_name,
    meta.full_name || meta.name,
  ].filter(Boolean) as string[];

  if (candidates.length) {
    const first = String(candidates[0]).trim().split(/\s+/)[0];
    return titleCase(first);
  }

  if (user?.email) {
    const local = user.email.split("@")[0];
    const first = local.split(/[._-]+/)[0];
    return titleCase(first);
  }

  return "Friend";
};

type Profile = {
  id?: string;
  user_id?: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  status?: string | null;
  created_at?: string | null;
  role?: string | null;
  account_type?: string | null;
  user_type?: string | null;
  is_helpanion?: boolean | null;
  last_active_role?: string | null;
};

const HomePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const { role: activeRole, getDashboardPath, clearRoleData, hasValidRole } = useRolePersistence();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    document.title = "Walker's Odyssey – Your trusted companion";
  }, []);

  // Fetch current user's profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, user_id, display_name, avatar_url, role, account_type, user_type, is_helpanion, created_at, last_active_role"
        )
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching current user profile:", error);
        setProfile(null);
      } else {
        setProfile(data as Profile);
      }
    };

    loadProfile();
  }, [user]);

  // Clean first name for header
  const displayName = useMemo(() => deriveFirstName(profile, user), [profile, user]);

  // Avatar content (image or initial)
  const avatarContent = useMemo((): { type: "image" | "initial"; value: string } => {
    if (profile?.avatar_url) return { type: "image" as const, value: profile.avatar_url };
    const initial =
      (profile?.display_name?.[0] || user?.email?.[0] || "U").toUpperCase();
    return { type: "initial" as const, value: initial };
  }, [profile, user]);

  // Dynamic dashboard route based on stored role for persistence
  const dashboardPath = useMemo(() => {
    if (!user) return '/wo-commune';
    
    // Always try to get dashboard path for logged-in user
    // If no valid role found, default to helpanion dashboard
    if (!hasValidRole) {
      console.warn('No valid role found, defaulting to helpanion dashboard');
      return '/helpanion-dashboard';
    }
    
    return getDashboardPath();
  }, [user, hasValidRole, getDashboardPath]);

  return (
    <div className="min-h-screen bg-white text-[#2B2B2B]">
      {/* ------------------------ Global Header ------------------------ */}
      <GlobalHeader 
        user={user} 
        displayName={displayName} 
        avatarContent={avatarContent} 
        dashboardPath={dashboardPath} 
        clearRoleData={clearRoleData} 
        signOut={signOut} 
        navigate={navigate} 
      />

      {/* ------------------------ Hero Section ------------------------ */}
      <section
        className="relative w-full h-[85vh] sm:h-[90vh] md:h-screen mt-8 md:mt-10"
        aria-label="Hero: Your trusted companion"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-left md:bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${HERO_IMG})`,
          }}
          aria-hidden="true"
        />
        {/* Dark overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Hero content (centered) */}
        <div className="relative z-10 max-w-[1140px] mx-auto px-4 md:px-8 h-full flex flex-col items-start md:items-center justify-center text-left md:text-center">
          {/* Headline */}
          <h1 className="text-white text-hero max-w-3xl">
            Your trusted companion for every step
          </h1>

          {/* small divider */}
          <div className="w-12 border-t-2 border-white my-4 md:mx-auto" />

          {/* Subtext */}
          <p className="text-white max-w-2xl text-base md:text-lg leading-relaxed">
            connecting you with guidance, community, and inspiration to walk your path with purpose.
          </p>

          {/* CTA button */}
          <div className="mt-6">
            <Link
              to="/auth?mode=signup"
              className="inline-block px-5 py-2 rounded-md font-semibold"
              style={{ backgroundColor: PINE, color: "white" }}
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------ About Section ------------------------ */}
      <section className="py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-2xl p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">
                Walking Beside You, Every Step of the Way
              </h2>
              <p className="text-gray-700 leading-relaxed text-left">
                In a world that never stops comparing, we forget the truth: every journey has its own rhythm. We scroll past destinations without seeing the grind, the setbacks, the small steps that made them real. Walker's Odyssey was born from a simple belief: we don't just need goals to chase — we need people, places, and moments that remind us to enjoy the path along the way.
              </p>
            </div>
            
            {/* Three Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* WO Commune */}
              <div className="bg-white rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-2" style={{ color: PINE }}>WO Commune</h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify">
                  One-to-one connections that go beyond small talk. A living platform where people share experiences, stories, and wisdom through real conversations.
                </p>
              </div>
              
              {/* WO Experiences */}
              <div className="bg-white rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-2" style={{ color: PINE }}>WO Experiences</h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify">
                  From networking dinners to run clubs. Experiences designed to help people connect offline, move their bodies, and nurture their minds.
                </p>
              </div>
              
              {/* WO Essentials */}
              <div className="bg-white rounded-lg p-5">
                <h3 className="font-semibold text-lg mb-2" style={{ color: PINE }}>WO Essentials</h3>
                <p className="text-gray-700 text-sm leading-relaxed text-justify">
                  Everyday companions — journals, wearables, lifestyle tools — created to remind us of gratitude, action, and belonging.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link to="/about" className="inline-flex items-center gap-2 font-medium hover:underline" style={{ color: "#193232" }}>
                Our Story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------ WO Commune: Helpanion Section (3 steps) ------------------------ */}
      <section className="py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold tracking-widest mb-4" style={{ color: PINE }}>WO COMMUNE</h2>
          <div className="rounded-2xl p-6 md:p-8 text-white" style={{ backgroundColor: "#193232" }}>
            <div className="text-left md:text-center mb-8">
              <h3 className="text-xl font-bold mb-2">Find your helpanion in 3 steps</h3>
              <p className="text-white/80">Connect with guidance that understands your journey</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-lg font-bold mb-3 mx-auto">
                  1
                </div>
                <h4 className="font-semibold text-base mb-2">Discover Your Helpanion</h4>
                <p className="text-white/80 text-sm leading-relaxed">Search our network and find someone who understands your journey and goals.</p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-lg font-bold mb-3 mx-auto">
                  2
                </div>
                <h4 className="font-semibold text-base mb-2">Schedule the Meeting</h4>
                <p className="text-white/80 text-sm leading-relaxed">Check for availability, book an appointment and share your goals.</p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center text-lg font-bold mb-3 mx-auto">
                  3
                </div>
                <h4 className="font-semibold text-base mb-2">Connect & Converse</h4>
                <p className="text-white/80 text-sm leading-relaxed">Get real advice and guidance that helps you take the next step.</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/wo-commune"
                className="inline-flex items-center px-6 py-3 rounded-lg font-semibold bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-200"
              >
                Find your helpanion →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------ WO Experiences: Upcoming Event ------------------------ */}
      <section className="py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold tracking-widest mb-4" style={{ color: PINE }}>WO EXPERIENCES</h2>
          <div className="bg-gray-50 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-0">
              {/* Event Image - smaller ratio */}
              <div className="relative h-64 md:h-full md:min-h-[300px]">
                <img 
                  src={EVENT_PLACEHOLDER} 
                  alt="Networking Dinner Event" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* Event Details */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Upcoming Event</h3>
                <div className="space-y-2 mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Networking Dinner</h4>
                  <div className="text-gray-700 text-sm space-y-1">
                    <div>📅 24 Aug 2025 — 7:00 PM</div>
                    <div>📍 Cafe Veritas, Downtown</div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    An evening of conversation and community. Join like-minded walkers for meaningful connections.
                  </p>
                </div>
                <div>
                  <Link
                    to="#"
                    className="inline-flex items-center px-5 py-2.5 rounded-lg font-semibold transition-colors hover:opacity-90 text-sm"
                    style={{ backgroundColor: PINE, color: "white" }}
                  >
                    RSVP Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ------------------------ WO Essentials ------------------------ */}
      <section className="py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-sm font-semibold tracking-widest mb-4" style={{ color: PINE }}>WO ESSENTIALS</h2>
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h3>
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Everyday companions — journals, wearables, lifestyle tools — created to remind us of gratitude, action, and belonging. Stay tuned for updates.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;