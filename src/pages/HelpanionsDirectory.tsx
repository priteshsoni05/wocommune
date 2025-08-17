import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import { useHelpanions } from "@/hooks/useHelpanions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "./AuthModal";

const PINE = "#2C5F50";
const SOCIALS = [
  { name: "LinkedIn", href: "https://linkedin.com" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "Twitter", href: "https://twitter.com" },
];

// ------------ Helpers ------------
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
};

export default function HelpanionsDirectory() {
  const { helpanions, loading } = useHelpanions();
  const [searchParams] = useSearchParams();
  const [directorySearchTerm, setDirectorySearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest");

  const [authOpen, setAuthOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Fetch current user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (data) setProfile(data);
    };
    loadProfile();
  }, [user]);

  const getInitials = (name: string) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "H";

  const getMinPrice = (services: any[]) => {
    const prices = services.map((s) => s.price_per_hour).filter(Boolean);
    return prices.length ? Math.min(...prices.map(Number)) : null;
  };

  // Filters
  const filteredHelpanions = useMemo(() => {
    let filtered = helpanions.filter((h) => {
      const q = directorySearchTerm.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        h.display_name?.toLowerCase().includes(q) ||
        h.bio?.toLowerCase().includes(q);
      return matchesSearch;
    });

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "price-low":
        filtered.sort(
          (a: any, b: any) =>
            (getMinPrice(a.services) ?? Infinity) -
            (getMinPrice(b.services) ?? Infinity)
        );
        break;
      case "price-high":
        filtered.sort(
          (a: any, b: any) =>
            (getMinPrice(b.services) ?? 0) -
            (getMinPrice(a.services) ?? 0)
        );
        break;
    }
    return filtered;
  }, [helpanions, directorySearchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111]" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
      {/* ===== Main Header ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 flex items-center justify-between h-16">
          <Link
            to="/"
            className="text-[20px] font-semibold tracking-widest"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#333" }}
            aria-label="Walker's Odyssey home"
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
          </div>

          <div className="flex-1 hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search helpanions..."
                value={directorySearchTerm}
                onChange={(e) => setDirectorySearchTerm(e.target.value)}
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
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                  style={{ backgroundColor: PINE }}
                  aria-hidden
                >
                  {(profile?.display_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                </div>

                {/* Greeting */}
                <div className="hidden sm:flex flex-col items-start leading-4">
                  <span className="text-xs text-gray-500">Hi</span>
                  <span className="text-sm font-medium">
                    {deriveFirstName(profile, user)}
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
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 
            className="text-3xl md:text-5xl font-semibold leading-tight"
            style={{ fontFamily: "'Source Sans Pro', sans-serif", color: "#333" }}
          >
            Discover Helpanions
          </h1>
          
          {/* small divider */}
          <div className="w-12 border-t-2 border-[#01796F] mx-auto my-4" />
          
          <p 
            className="text-base md:text-xl text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
          >
            Find the right helpanion to guide you with real-world advice and practical experience.
          </p>
        </div>
      </section>

      {/* ===== Filters ===== */}
      <div className="max-w-[1140px] mx-auto px-4 md:px-8">
        <div className="rounded-xl bg-white border p-4 md:p-5 mb-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                value={directorySearchTerm}
                onChange={(e) => setDirectorySearchTerm(e.target.value)}
                placeholder="Search helpanions…"
                className="pl-9 h-10 rounded-lg border-neutral-300"
              />
            </div>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="h-10 w-full md:w-48 rounded-lg border-neutral-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ===== Grid ===== */}
      <div className="max-w-[1140px] mx-auto px-4 md:px-8 pb-12">
        {loading ? (
          <div className="text-center py-16 text-gray-600">Loading helpanions…</div>
        ) : filteredHelpanions.length === 0 ? (
          <div className="text-center py-16 text-gray-600">No helpanions found.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredHelpanions.map((h: any) => {
              const slug = h.username || h.user_id;
              const minPrice = getMinPrice(h.services);

              return (
                <Card
                  key={h.id}
                  className="border bg-white rounded-2xl hover:shadow-md transition"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
                        {h.avatar_url ? (
                          <img
                            src={h.avatar_url}
                            alt={h.display_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-semibold">{getInitials(h.display_name || "H")}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {h.display_name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {h.bio || "Helping through shared experience."}
                        </p>
                        {minPrice && (
                          <p className="mt-1 text-sm">
                            From <span className="font-semibold">₹{minPrice}</span> / hr
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 h-9 rounded-lg border-neutral-800"
                      >
                        <Link to={`/p/${slug}`}>View Profile</Link>
                      </Button>
                      <Button
                        asChild
                        className="flex-1 h-9 rounded-lg text-white"
                        style={{ backgroundColor: PINE }}
                      >
                        <Link to={`/p/${slug}`}>
                          Book Session <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------------ Newsletter CTA (below podcasts & stories) ------------------------ */}
      <section className="bg-[#F3F2EE] py-10">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Walk with us
            </h4>
            <p className="text-sm text-gray-700">Stories, guidance, and events — straight to your inbox.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            {/* Newsletter link directs to Substack as requested */}
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
      <footer className="bg-[#FAF9F6] text-[#2B2B2B] border-t border-gray-200 mt-8">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            <div>
              <h5 className="text-xl font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
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
            </div>
          </div>
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
