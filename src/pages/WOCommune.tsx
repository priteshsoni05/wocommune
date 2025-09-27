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
    <div className="min-h-screen bg-white text-[#222]">
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

      {/* ===== Main Content Container ===== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* ===== Hero Section ===== */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600 mb-6">
            <span>💡</span>
            <span>Our Community</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Help will always be given at 
            <br />
            <span className="text-[#193232]">WO COMMUNE</span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl">to those who ask for it</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Connect with our community of helpers for expert insights, support, and guidance to elevate your journey.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-16">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for help..."
                  className="w-full pl-12 pr-32 py-4 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#193232] focus:border-transparent bg-gray-50"
                  aria-label="Search query"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-[#193232] text-white font-medium rounded-xl hover:bg-[#193232]/90 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
            <span className="text-sm font-medium text-gray-500 mr-2">Top Picks</span>
            <CategoryTag active>All</CategoryTag>
            <CategoryTag>Personal Development</CategoryTag>
            <CategoryTag>Career</CategoryTag>
            <CategoryTag>Health & Wellness</CategoryTag>
            <CategoryTag>Relationships</CategoryTag>
          </div>
        </div>

        {/* ===== Featured Helpanions Grid ===== */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Helpanions</h2>
            <Link
              to="/helpanions"
              className="inline-flex items-center text-[#193232] font-medium hover:underline"
            >
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {fetching ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <FeaturedHelpanions helpanions={topHelpanions} />
          )}
        </div>

        {/* ===== Testimonials ===== */}
        <div className="mb-16">
          <TestimonialsSlider compact />
        </div>

        {/* ===== Community Activities ===== */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Community Activities</h2>
            <div className="flex gap-2">
              <CategoryTag active>Events</CategoryTag>
              <CategoryTag>Conversations</CategoryTag>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActivityCard
              image={EVENT_IMG}
              title="Dinner & Conversations — City Hub"
              description="Join like-minded walkers for an evening of meaningful conversation and food."
              buttonText="RSVP"
              type="event"
            />
            <ActivityCard
              image={CONVO_IMG}
              title="From Comparison to Contentment"
              description="A group conversation about stopping comparison and finding your own pace."
              buttonText="Join"
              type="conversation"
            />
            <ActivityCard
              image={PODCAST_IMG}
              title="You Give Up, Until You Decide Not To"
              description="Listen to inspiring journeys in short conversational episodes."
              buttonText="Listen"
              type="podcast"
            />
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
}

// Category Tag Component
function CategoryTag({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
      active 
        ? 'bg-[#193232] text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}>
      {children}
    </button>
  );
}

// Activity Card Component
function ActivityCard({ image, title, description, buttonText, type }: { 
  image: string; 
  title: string; 
  description: string; 
  buttonText: string;
  type: 'event' | 'conversation' | 'podcast';
}) {
  const typeColors = {
    event: 'bg-blue-100 text-blue-800',
    conversation: 'bg-green-100 text-green-800',
    podcast: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeColors[type]}`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <button className="w-full bg-[#193232] text-white py-2 px-4 rounded-xl font-medium hover:bg-[#193232]/90 transition-colors">
          {buttonText}
        </button>
      </div>
    </div>
  );
}