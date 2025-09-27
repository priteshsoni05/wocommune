// src/pages/WOCommune.tsx - Minimal navigation implementation
import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Instagram, Linkedin } from "lucide-react";

import { useHelpanions } from "@/hooks/useHelpanions";
import { TestimonialsSlider } from "@/components/helpanion/TestimonialsSlider";
import { default as FeaturedHelpanions } from "@/components/helpanion/FeaturedHelpanions";
import { useAuth } from "@/contexts/AuthContext";
import { useRolePersistence } from "@/hooks/useRolePersistence";
import { supabase } from "@/integrations/supabase/client";
import { Newsletter } from "@/components/common/Newsletter";
import { Footer } from "@/components/common/Footer";

import GlobalHeader from "@/components/common/GlobalHeader";
import WOCommuneSlate from "@/components/common/WOCommuneSlate";

import heroImage from "@/assets/wo-commune-hero-1920x1080.jpg";
const HERO_IMG = heroImage;
const EVENT_IMG = "/assets/event-placeholder.jpg";
const CONVO_IMG = "/assets/convo-placeholder.jpg";
const PODCAST_IMG = "/assets/podcast-placeholder.jpg";

const PINE = "#2C5F50";

// ------------ Helpers for clean first name ------------
const titleCase = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

const deriveFirstName = (profile: any, user: any) => {
  const meta = user?.user_metadata || {};
  const candidates = [
    profile?.display_name, // e.g., "Pritesh Soni"
    meta.given_name, // OAuth given_name
    meta.full_name || meta.name, // OAuth name
  ].filter(Boolean) as string[];

  if (candidates.length) {
    const first = String(candidates[0]).trim().split(/\s+/)[0];
    return titleCase(first);
  }

  if (user?.email) {
    const local = user.email.split("@")[0]; // "pritesh.soni03"
    const first = local.split(/[._-]+/)[0]; // "pritesh"
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

export default function WOCommune(): JSX.Element {
  const { user, signOut } = useAuth();
  const { role: activeRole, getDashboardPath, clearRoleData, handleCorruptedData, hasValidRole } = useRolePersistence();
  const { helpanions } = useHelpanions();
  const navigate = useNavigate();

  const [fetchedHelpanions, setFetchedHelpanions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  // Current user's profile (for avatar/name/role)
  const [profile, setProfile] = useState<Profile | null>(null);

  // Simple search state + handler for hero
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(`/wo-commune?query=${encodeURIComponent(q)}`);
  };

  // Fetch active helpanions for "Featured Helpanions"
  useEffect(() => {
    const fetchHelpanions = async () => {
      setFetching(true);
      console.log('WOCommune: Starting to fetch helpanions...');
      
      try {
        // Get active profiles
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select(`
            id, 
            user_id,
            display_name, 
            short_bio,
            bio, 
            avatar_url, 
            created_at, 
            username,
            skills
          `)
          .eq("status", "active")
          .not("username", "is", null)
          .not("username", "eq", "");

        console.log('WOCommune: Profile query result:', { profiles, profilesError });

        if (profilesError) {
          console.error("Error fetching Helpanions:", profilesError);
          setFetchedHelpanions([]);
          return;
        }

        if (!profiles || profiles.length === 0) {
          console.log('WOCommune: No profiles found');
          setFetchedHelpanions([]);
          return;
        }

        // Check which profiles have the helpanion role
        const profileUserIds = profiles.map(p => p.user_id);
        const { data: helpanionRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'helpanion')
          .in('user_id', profileUserIds);

        console.log('WOCommune: Roles query result:', { helpanionRoles, rolesError });

        const helpanionUserIds = helpanionRoles?.map(role => role.user_id) || [];
        
        // Get services for helpanion users
        console.log('WOCommune: Fetching services for user IDs:', helpanionUserIds);
        
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .in('helper_id', helpanionUserIds)
          .eq('is_active', true);

        console.log('WOCommune: Services query result:', { services, servicesError });

        if (servicesError) {
          console.error('WOCommune: Error fetching services:', servicesError);
          // Continue anyway but log the error  
        }

        // Filter profiles to only include those with helpanion role and active services
        const helpanionProfiles = profiles.filter(profile => {
          const hasRole = helpanionUserIds.includes(profile.user_id);
          const hasActiveServices = services?.some(s => s.helper_id === profile.user_id);
          console.log(`WOCommune: Profile ${profile.display_name} - hasRole: ${hasRole}, hasActiveServices: ${hasActiveServices}`);
          return hasRole && hasActiveServices;
        });

        console.log('WOCommune: Final helpanions:', helpanionProfiles);
        setFetchedHelpanions(helpanionProfiles || []);
      } catch (error) {
        console.error('WOCommune: Error fetching helpanions:', error);
        setFetchedHelpanions([]);
      }
      
      setFetching(false);
    };

    fetchHelpanions();
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

  // Featured Helpanions (top 3)
  const topHelpanions = useMemo(() => {
    const list = fetchedHelpanions.length > 0 ? fetchedHelpanions : helpanions;
    const hasRating = list.some((h: any) => h.average_rating || h.rating);
    const sorted = [...list].sort((a: any, b: any) => {
      const ra = a.average_rating ?? a.rating ?? 0;
      const rb = b.average_rating ?? b.rating ?? 0;
      return hasRating
        ? rb - ra
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return sorted.slice(0, 3);
  }, [helpanions, fetchedHelpanions]);


  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#222] font-body">
      {/* ===== Global Header ===== */}
      <GlobalHeader 
        user={user} 
        displayName={displayName} 
        avatarContent={avatarContent} 
        dashboardPath={dashboardPath} 
        clearRoleData={clearRoleData} 
        signOut={signOut} 
        navigate={navigate} 
      />

      <div className="h-8 md:h-10" />

      {/* ===== WO COMMUNE Active Slate ===== */}
      <WOCommuneSlate />

      {/* ===== HERO — With background image like home page ===== */}
      <section className="relative w-full h-[85vh] sm:h-[90vh] md:h-screen">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${HERO_IMG})`,
          }}
          aria-hidden="true"
        />
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black/45" />
        
        <div className="relative z-10 max-w-[1140px] mx-auto px-4 md:px-8 h-full flex flex-col items-center justify-center text-center">
          <p className="text-2xl md:text-4xl leading-tight mb-8 text-white font-sans">
            Help will always be given at WO COMMUNE
            <br />
            <span className="text-base md:text-xl">to those who ask for it</span>
          </p>
          
          <div className="w-full max-w-[600px] mx-auto">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 bg-white rounded-md px-4 py-2 shadow-sm border">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask for help here"
                className="flex-1 text-sm outline-none"
                aria-label="Search query"
              />
              <button
                type="submit"
                className="px-6 py-2 rounded-md text-white font-medium"
                style={{ backgroundColor: "#193232" }}
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <TestimonialsSlider compact />

      {/* ===== Featured Helpanions ===== */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="mb-8 text-center">
          Featured Helpanions
        </h2>
        {fetching ? (
          <p className="text-center text-secondary">Loading...</p>
        ) : (
          <FeaturedHelpanions helpanions={topHelpanions} />
        )}

        {/* Right-aligned CTA below grid */}
        <div className="mt-6 flex justify-end">
          <Link
            to="/helpanions"
            className="inline-flex items-center px-4 py-2 rounded-md font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: PINE }}
          >
            Explore all helpanions
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* ===== Tabs Section (events & conversations) ===== */}
      <section className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
        <div className="flex gap-4 items-center mb-6">
          <TabButton>Events</TabButton>
          <TabButton>Conversations</TabButton>
          <div className="ml-auto text-sm text-gray-500">Showing featured picks</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          <Card
            image={EVENT_IMG}
            title="Dinner & Conversations — City Hub"
            desc="Join like-minded walkers for an evening of meaningful conversation and food."
            btn="RSVP"
          />
          <Card
            image={CONVO_IMG}
            title="From Comparison to Contentment"
            desc="A group conversation about stopping comparison and finding your own pace."
            btn="Join"
            secondary
          />
          <Card
            image={PODCAST_IMG}
            title="You Give Up, Until You Decide Not To"
            desc="Listen to inspiring journeys in short conversational episodes."
            btn="Listen"
            secondary
          />
        </div>
      </section>


      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Small Tab button
function TabButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-3 py-1 text-sm rounded-md bg-white border border-gray-200 shadow-sm font-body">
      {children}
    </button>
  );
}

// Stat block
function StatBlock({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-xl font-semibold font-heading">{number}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

// Card component used in tabs (equal-height)
function Card({ image, title, desc, btn, secondary }: { image: string; title: string; desc: string; btn: string; secondary?: boolean; }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col h-full min-h-[420px]">
      <img src={image} alt={title} className="w-full h-44 object-cover" loading="lazy" />
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-semibold mt-1 text-2xl font-heading">{title}</h3>
        <p className="text-sm text-gray-600 mt-3 font-body">{desc}</p>

        {secondary ? (
          <div className="mt-auto flex items-center justify-between pt-4">
            <div className="text-xs text-gray-500">Online • Free</div>
            <button className="px-4 py-2 rounded-md border border-gray-300">{btn}</button>
          </div>
        ) : (
          <div className="mt-auto pt-4">
            <button className="px-5 py-2.5 rounded-md text-white font-medium" style={{ backgroundColor: PINE }}>{btn}</button>
          </div>
        )}
      </div>
    </div>
  );
}