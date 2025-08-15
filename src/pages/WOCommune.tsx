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
    const local = user.email.split("@")[0];   // "pritesh.soni03"
    const first = local.split(/[._-]+/)[0];   // "pritesh"
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

  // Dynamic dashboard route (no universal /dashboard route in this app)
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
    <div className="min-h-screen bg-[#FAF9F6] text-[#222]">
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
                placeholder="Search events, help topics or podcasts..."
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

      {/* ===== Hero Section ===== */}
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
            <div className="mt-6 w-full max-w-[700px] mx-auto md:mx-0">
              <div className="flex items-center gap-3 bg-white rounded-md px-3 py-2 shadow">
                <input
                  placeholder="Search 'career advice', 'run club', 'networking'..."
                  className="flex-1 text-sm outline-none"
                />
                <button
                  className="px-4 py-2 rounded-md"
                  style={{ backgroundColor: PINE, color: "#fff" }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="w-full md:w-[420px] lg:w-[520px] rounded-md overflow-hidden shadow-lg border border-white/20">
            <img
              src={HERO_IMG}
              alt="Walking path visual"
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <TestimonialsSlider compact />

      {/* ===== Featured Helpanions ===== */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-8 text-center">Featured Helpanions</h1>
        {fetching ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          // The FeaturedHelpanions component already uses equal-height cards.
          <FeaturedHelpanions helpanions={topHelpanions} />
        )}
      </div>

      {/* ===== Tabs Section (equal-height cards) ===== */}
      <section className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
        <div className="flex gap-4 items-center mb-6">
          <TabButton>Events</TabButton>
          <TabButton>Conversations</TabButton>
          <TabButton>Podcasts</TabButton>
          <div className="ml-auto text-sm text-gray-500">Showing featured picks</div>
        </div>

        {/* Make grid items stretch so each card fills same height */}
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

      {/* ===== Impact Metrics ===== */}
      <section className="bg-white py-10">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-8">
            <StatBlock number="500+" label="Walkers supported" />
            <StatBlock number="100+" label="Events hosted" />
            <StatBlock number="200+" label="1:1 sessions" />
          </div>
          <div className="text-sm text-gray-600">Trusted by walkers across cities — join the community today.</div>
        </div>
      </section>

      {/* ===== Podcasts & Stories ===== */}
      <section className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
        <div className="md:flex md:items-start md:gap-8">
          <div className="md:flex-1">
            <h2 className="text-2xl font-semibold mb-4">Podcasts & Stories</h2>
            <p className="text-gray-600 mb-6">Hear real stories from walkers, learn practical tips, and join the conversation.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-md border">
                  <div className="font-semibold">Episode {i} — Small Wins</div>
                  <div className="text-sm text-gray-600 mt-1">A short talk about how tiny daily wins compound into change.</div>
                </div>
              ))}
            </div>
          </div>
          <aside className="mt-6 md:mt-0 md:w-[320px] p-6 bg-[#F3F2EE] rounded-md flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-serif mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Walk with us</h4>
              <p className="text-sm text-gray-700 mb-4">Stories, guidance, and events — straight to your inbox.</p>
            </div>
            <a
              href="https://wocommune.substack.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-block text-center px-4 py-2 rounded-md font-medium"
              style={{ backgroundColor: PINE, color: "#fff" }}
            >
              Subscribe on Substack
            </a>
          </aside>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-[#FAF9F6] border-t border-gray-200 mt-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-xl font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>WALKER'S ODYSSEY</h5>
              <p className="text-sm text-gray-600 max-w-[320px]">Your trusted companion for every step — connecting you with guidance, community, and inspiration to walk your path with purpose.</p>
            </div>
            <div>
              <h6 className="font-semibold mb-3">Brand</h6>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><Link to="/about" className="hover:underline">About</Link></li>
                <li><Link to="/brand-story" className="hover:underline">Brand Story</Link></li>
                <li><Link to="/vision" className="hover:underline">Vision</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-3">Commune</h6>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><Link to="/events" className="hover:underline">Events</Link></li>
                <li><Link to="/conversations" className="hover:underline">Conversations</Link></li>
                <li><Link to="/helpanions" className="hover:underline">Find Helpanion</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-3">Get in touch</h6>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="mailto:commune@walkersodyssey.com" className="hover:underline">commune@walkersodyssey.com</a></li>
                <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
                <li><a href="#" className="hover:underline">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <p>© {new Date().getFullYear()} Walker's Odyssey. All rights reserved.</p>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gray-200 rounded-sm" />
                <div className="w-6 h-6 bg-gray-200 rounded-sm" />
                <div className="w-6 h-6 bg-gray-200 rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}

// Small Tab button
function TabButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-3 py-1 text-sm rounded-md bg-white border border-gray-200 shadow-sm">
      {children}
    </button>
  );
}

// Stat block
function StatBlock({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-xl font-semibold">{number}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

// Card Component for tabs (equal-height)
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
        <h3 className="font-semibold mt-1 text-2xl">{title}</h3>
        <p className="text-sm text-gray-600 mt-3">
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
              className="px-5 py-2.5 rounded-md"
              style={{ backgroundColor: PINE, color: "#fff" }}
            >
              {btn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}