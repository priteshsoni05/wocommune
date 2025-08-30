import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowRight } from "lucide-react";
import { useHelpanions } from "@/hooks/useHelpanions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Newsletter } from "@/components/common/Newsletter";
import { Footer } from "@/components/common/Footer";
import GlobalHeader from "@/components/common/GlobalHeader";
import WOCommuneSlate from "@/components/common/WOCommuneSlate";


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

  const { user, signOut } = useAuth();
  const navigate = useNavigate();
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
      {/* ===== Global Header (same as home page) ===== */}
      <GlobalHeader 
        user={user}
        displayName={deriveFirstName(profile, user)}
        avatarContent={{
          type: profile?.avatar_url ? 'image' : 'initial',
          value: profile?.avatar_url || getInitials(deriveFirstName(profile, user))
        }}
        dashboardPath="/helpanion-dashboard"
        clearRoleData={() => {}}
        signOut={signOut}
        navigate={navigate}
      />

      {/* ===== WO Commune Slate ===== */}
      <WOCommuneSlate />

      <div className="h-8 md:h-10" />

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
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredHelpanions.map((h: any) => {
              const slug = h.username || h.user_id;
              const minPrice = getMinPrice(h.services);

              return (
                <Card
                  key={h.id}
                  className="border bg-white rounded-2xl hover:shadow-md transition-all duration-200 h-full flex flex-col"
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Header with avatar and basic info */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center flex-shrink-0">
                        {h.avatar_url ? (
                          <img
                            src={h.avatar_url}
                            alt={h.display_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-semibold text-neutral-600">
                            {getInitials(h.display_name || "H")}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-xl truncate mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {h.display_name}
                        </h3>
                        {minPrice && (
                          <p className="text-sm font-medium" style={{ color: PINE }}>
                            From ₹{minPrice}/hr
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bio section */}
                    <div className="flex-1 mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {h.bio || "Helping through shared experience and practical guidance."}
                      </p>
                    </div>

                    {/* Skills/Services count */}
                    {h.services && h.services.length > 0 && (
                      <div className="mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {h.services.length} service{h.services.length !== 1 ? 's' : ''} available
                        </Badge>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3 mt-auto">
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 h-10 rounded-lg border-neutral-300 hover:border-neutral-400"
                      >
                        <Link to={`/p/${slug}`}>View Profile</Link>
                      </Button>
                      <Button
                        asChild
                        className="flex-1 h-10 rounded-lg text-white hover:opacity-90"
                        style={{ backgroundColor: PINE }}
                      >
                        <Link to={`/p/${slug}`}>
                          Book Now <ArrowRight className="ml-1 h-4 w-4" />
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

      <Newsletter />
      <Footer />

      
    </div>
  );
}
