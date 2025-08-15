import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import AuthModal from "./AuthModal";
import { useHelpanions } from "@/hooks/useHelpanions";
import { GetHelpMegaMenu } from "@/components/helpanion/GetHelpMegaMenu";
import { TestimonialsSlider } from "@/components/helpanion/TestimonialsSlider";
import { default as FeaturedHelpanions } from "@/components/helpanion/FeaturedHelpanions";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const HERO_IMG = "/assets/hero-placeholder.jpg";
const EVENT_IMG = "/assets/event-placeholder.jpg";
const CONVO_IMG = "/assets/convo-placeholder.jpg";
const PODCAST_IMG = "/assets/podcast-placeholder.jpg";

const PINE = "#01796F";

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
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  status?: string | null;
  created_at?: string | null;
  role?: string | null;
  account_type?: string | null;
  user_type?: string | null;
  is_helpanion?: boolean | null;
};

export default function WOCommune(): JSX.Element {
  const [authOpen, setAuthOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { helpanions } = useHelpanions();

  const [fetchedHelpanions, setFetchedHelpanions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchHelpanions = async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, bio, avatar_url, created_at")
        .eq("status", "active");

      if (error) {
        console.error("Error fetching Helpanions:", error);
      } else {
        setFetchedHelpanions(data || []);
      }
      setFetching(false);
    };

    fetchHelpanions();
  }, []);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, display_name, avatar_url, role, account_type, user_type, is_helpanion, created_at"
        )
        .eq("id", user.id)
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

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const roleLabel = useMemo(() => {
    const src =
      profile?.role ||
      profile?.account_type ||
      profile?.user_type ||
      (profile?.is_helpanion ? "helpaNion" : "");
    if (!src) return "Walker";
    const val = String(src).toLowerCase();
    if (val.includes("help")) return "Helpanion";
    if (val.includes("walker")) return "Walker";
    return val.charAt(0).toUpperCase() + val.slice(1);
  }, [profile]);

  const displayName = useMemo(() => deriveFirstName(profile, user), [profile, user]);

  const avatarContent = useMemo(() => {
    if (profile?.avatar_url) return { type: "image", value: profile.avatar_url };
    const initial =
      (profile?.display_name?.[0] || user?.email?.[0] || "U").toUpperCase();
    return { type: "initial", value: initial };
  }, [profile, user]);

  const dashboardPath =
    roleLabel === "Helpanion" ? "/helpanion-dashboard" : "/walker-dashboard";

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
    <div className="min-h-screen bg-[#FAF9F6] text-[#222]">
      {/* ===== Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-[20px] font-semibold tracking-widest"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#333" }}
          >
            WALKER'S ODYSSEY
          </Link>
          <nav className="text-sm">
            <ul className="flex items-center gap-4">
              <li><Link to="/about" className="hover:underline">About</Link></li>
              <li><Link to="/get-help" className="hover:underline">Commune</Link></li>
              <li><Link to="#" className="hidden md:inline hover:underline">Shop</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="h-16" />

      {/* ===== Sub-header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link
              to="/get-help"
              className="font-semibold tracking-widest text-[15px]"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#333" }}
            >
              WO COMMUNE
            </Link>
            <GetHelpMegaMenu />
          </div>

          <div className="flex-1 hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search events, help topics or podcasts..."
                className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {user ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-gray-50"
              >
                {avatarContent.type === "image" ? (
                  <img
                    src={avatarContent.value}
                    alt={`${displayName} avatar`}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                    style={{ backgroundColor: PINE }}
                  >
                    {avatarContent.value}
                  </div>
                )}
                <div className="hidden sm:flex flex-col items-start leading-4">
                  <span className="text-xs text-gray-500">Hi</span>
                  <span className="text-sm font-medium">
                    {displayName} ({roleLabel})
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <Link
                    to={dashboardPath}
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="inline-block px-5 py-2 rounded-md font-semibold"
              style={{ backgroundColor: PINE, color: "#fff" }}
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>

      {/* ===== Hero */}
      <section
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative max-w-[1140px] mx-auto px-4 md:px-8 py-20 md:py-28 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-white text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
              Your trusted companion for every step
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl">
              A community of events, conversations, and 1:1 guidance that helps
              you take meaningful steps — at your pace.
            </p>
          </div>
        </div>
      </section>

      {/* ===== Testimonials */}
      <TestimonialsSlider compact />

      {/* ===== Featured Helpanions */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1
          className="text-2xl font-bold mb-8 text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Featured Helpanions
        </h1>
        {fetching ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            <FeaturedHelpanions helpanions={topHelpanions} />
            <div className="flex justify-center mt-8">
              <Link
                to="/helpanions-directory"
                className="px-6 py-3 rounded-md font-medium text-white text-lg transition hover:opacity-90"
                style={{
                  backgroundColor: PINE,
                  fontFamily: "'Cormorant Garamond', serif",
                }}
              >
                Explore all helpanions
              </Link>
            </div>
          </>
        )}
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
