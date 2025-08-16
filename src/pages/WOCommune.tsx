import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import AuthModal from "./AuthModal";
import { useHelpanions } from "@/hooks/useHelpanions";
import { GetHelpMegaMenu } from "@/components/helpanion/GetHelpMegaMenu";
import { TestimonialsSlider } from "@/components/helpanion/TestimonialsSlider";
import { default as FeaturedHelpanions } from "@/components/helpanion/FeaturedHelpanions";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const SOCIAL_ICON = "/assets/social-placeholder-24.png";
const PINE = "#2C5F50"; // unify brand pine

// ------------ Helpers for clean first name ------------
const titleCase = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";

const deriveFirstName = (profile: any, user: any) => {
  const meta = user?.user_metadata || {};
  const candidates = [
    profile?.display_name,         // e.g., "Pritesh Soni"
    meta.given_name,               // OAuth given_name
    meta.full_name || meta.name,   // OAuth name
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

  // Current user's profile (for avatar/name/role)
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Fetch active helpanions for "Featured Helpanions"
  useEffect(() => {
    const fetchHelpanions = async () => {
      setFetching(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, bio, avatar_url, created_at, username")
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

  // Close user menu on outside click
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

  // Role label derivation
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

  // Clean first name for header
  const displayName = useMemo(() => deriveFirstName(profile, user), [profile, user]);

  // Avatar content (image or initial)
  const avatarContent = useMemo(() => {
    if (profile?.avatar_url) return { type: "image", value: profile.avatar_url };
    const initial =
      (profile?.display_name?.[0] || user?.email?.[0] || "U").toUpperCase();
    return { type: "initial", value: initial };
  }, [profile, user]);

  // Dynamic dashboard route
  const dashboardPath =
    roleLabel === "Helpanion" ? "/helpanion-dashboard" : "/walker-dashboard";

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
    <div className="min-h-screen bg-[#FAF9F6] text-[#222]" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
      {/* ===== Main Header ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-[20px] font-semibold tracking-widest"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#333" }}
            aria-label="Walker’s Odyssey home"
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

      {/* ===== Sub-header ===== */}
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
                placeholder="Search events, help topics or conversations..."
                className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Right side: Auth */}
          {user ? (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-3 px-2 py-1 rounded-full hover:bg-gray-50"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                {/* Avatar */}
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
                    aria-hidden
                  >
                    {avatarContent.value}
                  </div>
                )}

                {/* Greeting */}
                <div className="hidden sm:flex flex-col items-start leading-4">
                  <span className="text-xs text-gray-500">Hi</span>
                  <span className="text-sm font-medium">
                    {displayName} ({roleLabel})
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown */}
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-50"
                >
                  <Link
                    to={dashboardPath}
                    className="block px-4 py-2 text-sm hover:bg-gray-50"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    role="menuitem"
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

      {/* ===== Removed long Hero & Podcasts/Stories to keep page SaaS-like ===== */}

      {/* ===== Testimonials (emotion) ===== */}
      <TestimonialsSlider compact />

      {/* ===== Featured Helpanions ===== */}
      <section className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
        <h2
          className="text-2xl font-bold mb-8 text-center"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Featured Helpanions
        </h2>

        {fetching ? (
          <p className="text-center text-gray-500">Loading...</p>
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
      </section>

      {/* ===== Events & Conversations (no Podcasts) ===== */}
      <section className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
        <div className="flex gap-4 items-center mb-6">
          <TabButton>Events</TabButton>
          <TabButton>Conversations</TabButton>
          <div className="ml-auto text-sm text-gray-500">Showing featured picks</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <Card
            image="/assets/event-placeholder.jpg"
            title="Dinner & Conversations — City Hub"
            desc="Join like-minded walkers for an evening of meaningful conversation and food."
            btn="RSVP"
          />
          <Card
            image="/assets/convo-placeholder.jpg"
            title="From Comparison to Contentment"
            desc="A group conversation about stopping comparison and finding your own pace."
            btn="Join"
            secondary
          />
        </div>
      </section>

      {/* ===== Newsletter CTA (kept simple, consistent) ===== */}
      <section className="bg-[#F3F2EE] py-12">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Walk with us
            </h4>
            <p className="text-sm text-gray-700">Stories, guidance, and events — straight to your inbox.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <a
              href="https://wocommune.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2 rounded-md font-semibold"
              style={{ backgroundColor: PINE, color: "#fff" }}
            >
              Subscribe on Substack
            </a>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-[#FAF9F6] text-[#2B2B2B] border-t border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            <div>
              <h5 className="text-xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                WALKER'S ODYSSEY
              </h5>
              <p className="text-sm text-gray-600 max-w-[320px] leading-relaxed">
                Your trusted companion for every step - connecting you with guidance, community, and inspiration to walk your path with purpose.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-3">Brand</h6>
              <ul className="space-y-3 text-sm text-gray-700">
                <li><Link to="/about" className="hover:underline">About</Link></li>
                <li><Link to="#" className="hover:underline">Brand Story</Link></li>
                <li><Link to="#" className="hover:underline">Vision</Link></li>
                <li><Link to="/about" className="hover:underline">About</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-3">Commune</h6>
              <ul className="space-y-3 text-sm text-gray-700">
                <li><Link to="/get-help" className="hover:underline">Know Commune</Link></li>
                <li><Link to="/get-help" className="hover:underline">Join Commune</Link></li>
                <li><Link to="/helpanions" className="hover:underline">Become a Helpanion</Link></li>
                <li><Link to="#" className="hover:underline">Community Guidelines</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-3">Get in touch</h6>
              <ul className="space-y-3 text-sm text-gray-700">
                <li><a href="mailto:commune@walkersodyssey.com" className="hover:underline">commune@walkersodyssey.com</a></li>
                <li><Link to="#" className="hover:underline">Contact Us</Link></li>
                <li><a href="#" className="hover:underline">LinkedIn</a></li>
                <li><a href="#" className="hover:underline">Instagram</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
              <p>© {new Date().getFullYear()} Walker's Odyssey. All rights reserved.</p>
              <div className="flex items-center gap-3">
                <img src={SOCIAL_ICON} alt="social-1" className="w-5 h-5" />
                <img src={SOCIAL_ICON} alt="social-2" className="w-5 h-5" />
                <img src={SOCIAL_ICON} alt="social-3" className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}

function TabButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50"
      style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
    >
      {children}
    </button>
  );
}

function Card({
  image,
  title,
  desc,
  btn,
  secondary,
}: {
  image: string;
  title: string;
  desc: string;
  btn: string;
  secondary?: boolean;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col h-full min-h-[420px]">
      <img src={image} alt={title} className="w-full h-44 object-cover" />
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-semibold mt-1 text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{title}</h3>
        <p className="text-sm text-gray-600 mt-3" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
          {desc}
        </p>

        {secondary ? (
          <div className="mt-auto flex items-center justify-between pt-4">
            <div className="text-xs text-gray-500">Online • Free</div>
            <button className="px-4 py-2 rounded-md border border-gray-300">
              {btn}
            </button>
          </div>
        ) : (
          <div className="mt-auto pt-4">
            <button
              className="px-5 py-2.5 rounded-md text-white font-medium"
              style={{ backgroundColor: PINE }}
            >
              {btn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
