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

const PINE = "#01796F";
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
      {/* ===== Header ===== */}
      <header className="bg-[#FAF9F6] py-4 border-b border-gray-200">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link
            to="/get-help"
            className="font-serif text-xl font-semibold text-[#111]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            WO Commune
          </Link>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/get-help">Home</Link>
              <Link to="/helpanions" className="text-[#01796F] font-semibold">
                Directory
              </Link>
              <Link to="/about">About</Link>
            </nav>
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  Hi, {deriveFirstName(profile, user)}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={async () => {
                        await signOut();
                        setMenuOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="px-4 py-2 rounded-md font-medium text-white"
                style={{ backgroundColor: PINE }}
              >
                Join / Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ===== Hero Text (Header + Subheader) ===== */}
      <div className="max-w-3xl mx-auto text-center py-10 px-4">
        <h1 className="text-3xl md:text-4xl font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
          Discover Helpanions
        </h1>
        <p className="mt-3 text-base md:text-lg text-gray-600">
          Find the right helpanion to guide you with real-world advice and practical experience.
        </p>
      </div>

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

      {/* ===== Newsletter CTA ===== */}
      <section className="bg-white border-t py-12">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl font-semibold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Stay connected with Walker’s Odyssey
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Subscribe to our newsletter for stories, guidance, and community updates.
          </p>
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
      </section>

      {/* ===== Footer ===== */}
      <footer className="bg-[#FAF9F6] text-[#2B2B2B] border-t">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5 className="text-xl font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              WALKER'S ODYSSEY
            </h5>
            <p className="text-sm text-gray-600">
              Your trusted companion for every step – connecting you with guidance, community, and inspiration.
            </p>
          </div>
          <div>
            <h6 className="font-semibold mb-3">Brand</h6>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link to="/about">About</Link></li>
              <li><Link to="#">Brand Story</Link></li>
              <li><Link to="#">Vision</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-3">Commune</h6>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link to="/get-help">Know Commune</Link></li>
              <li><Link to="/get-help">Join Commune</Link></li>
              <li><Link to="/helpanions">Become a Helpanion</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-semibold mb-3">Get in touch</h6>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><a href="mailto:commune@walkersodyssey.com">commune@walkersodyssey.com</a></li>
              {SOCIALS.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">{s.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t mt-6 pt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Walker's Odyssey. All rights reserved.
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
