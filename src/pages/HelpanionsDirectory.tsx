import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ChevronDown, ArrowRight, Linkedin, Instagram, Twitter } from "lucide-react";
import { useHelpanions } from '@/hooks/useHelpanions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AuthModal from "./AuthModal";

const PINE = '#01796F';

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

export default function HelpanionsDirectory() {
  const { helpanions, loading } = useHelpanions();
  const [searchParams] = useSearchParams();
  const [directorySearchTerm, setDirectorySearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  
  // Auth state matching WO Commune
  const [authOpen, setAuthOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Sync initial search from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch && !directorySearchTerm) setDirectorySearchTerm(urlSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch current user's profile (matching WO Commune)
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading profile:", error);
      } else {
        setProfile(data);
      }
    };

    loadProfile();
  }, [user]);

  // Unique categories from services
  const categories = useMemo(() => {
    const all = helpanions.flatMap(h => h.services.map(s => s.category).filter(Boolean));
    return ['all', ...Array.from(new Set(all))];
  }, [helpanions]);

  // Helpers
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const getMinPrice = (services: any[]) => {
    const prices = services.map(s => s.price_per_hour).filter((p: any) => p !== null && p !== undefined);
    return prices.length ? Math.min(...prices.map(Number)) : null;
  };

  // Filter + sort
  const filteredHelpanions = useMemo(() => {
    let filtered = helpanions.filter(h => {
      const q = directorySearchTerm.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        h.display_name?.toLowerCase().includes(q) ||
        h.bio?.toLowerCase().includes(q) ||
        h.services.some((s: any) =>
          s.title.toLowerCase().includes(q) ||
          (s.description?.toLowerCase() || '').includes(q)
        );

      const matchesCategory = selectedCategory === 'all' ||
        h.services.some((s: any) => s.category === selectedCategory);

      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'newest':
        filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price-low':
        filtered.sort((a: any, b: any) => {
          const aPrice = getMinPrice(a.services) ?? Number.POSITIVE_INFINITY;
          const bPrice = getMinPrice(b.services) ?? Number.POSITIVE_INFINITY;
          return aPrice - bPrice;
        });
        break;
      case 'price-high':
        filtered.sort((a: any, b: any) => {
          const aPrice = getMinPrice(a.services) ?? 0;
          const bPrice = getMinPrice(b.services) ?? 0;
          return bPrice - aPrice;
        });
        break;
    }

    return filtered;
  }, [helpanions, directorySearchTerm, selectedCategory, sortBy]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      setMenuOpen(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111]" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
      {/* ===== Header (matching WO Commune) ===== */}
      <header className="bg-[#FAF9F6] py-4">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/get-help" className="font-serif text-xl font-semibold text-[#111]" 
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            WO Commune
          </Link>

          {/* Navigation + User menu */}
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link to="/get-help" className="hover:text-gray-600">Home</Link>
              <Link to="/helpanions" className="text-[#01796F] font-semibold">Directory</Link>
              <Link to="/about" className="hover:text-gray-600">About</Link>
            </nav>

            {/* Auth section */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-sm font-medium hover:text-gray-600"
                >
                  <span>Hi, {deriveFirstName(profile, user)}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={handleSignOut}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
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

      {/* ===== Page Content ===== */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Page intro */}
        <div className="text-center pt-8 md:pt-10">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight" 
              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Discover Helpanions
          </h1>
          <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Find the right helpanion to guide you with practical experience and real-world advice.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-xl bg-white border border-neutral-200 p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                value={directorySearchTerm}
                onChange={(e) => setDirectorySearchTerm(e.target.value)}
                placeholder="Search helpanions, services, or skills…"
                className="pl-9 h-10 rounded-lg border-neutral-300 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-10 w-full md:w-52 rounded-lg border-neutral-300 focus:ring-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === 'all' ? 'All categories' : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="h-10 w-full md:w-48 rounded-lg border-neutral-300 focus:ring-0">
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

        {/* Results meta */}
        <div className="mt-4 mb-6">
          <p className="text-sm text-gray-600">
            {loading ? 'Loading…' : `${filteredHelpanions.length} helpanion${filteredHelpanions.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-600">Loading helpanions…</div>
        ) : filteredHelpanions.length === 0 ? (
          <div className="text-center py-16 text-gray-600">No helpanions found matching your criteria.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-12">
            {filteredHelpanions.map((h: any) => {
              const minPrice = getMinPrice(h.services);
              const slug = h.username || h.user_id;

              return (
                <Card
                  key={h.id}
                  className="border border-neutral-200 bg-white rounded-2xl hover:shadow-md hover:border-neutral-300 transition"
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-neutral-100 flex items-center justify-center shrink-0">
                        {h.avatar_url ? (
                          <img
                            src={h.avatar_url}
                            alt={`${h.display_name}'s avatar`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-sm font-semibold text-neutral-700">
                            {getInitials(h.display_name || 'Helper')}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base md:text-lg font-semibold truncate" 
                              style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            {h.display_name}
                          </h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {h.bio || 'Helping through shared experience and practical insights.'}
                        </p>
                        {minPrice !== null && (
                          <p className="mt-2 text-sm text-neutral-800">
                            From <span className="font-semibold">₹{minPrice}</span> / hour
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Categories */}
                    {h.services?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {h.services.slice(0, 3).map((s: any, i: number) =>
                          s?.category ? (
                            <Badge key={i} variant="outline" className="text-xs border-neutral-300 text-neutral-700">
                              {s.category}
                            </Badge>
                          ) : null
                        )}
                        {h.services.length > 3 && (
                          <Badge variant="outline" className="text-xs border-neutral-300 text-neutral-700">
                            +{h.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="mt-5 flex gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 h-9 rounded-lg border-neutral-800 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                      >
                        <Link to={`/p/${slug}`} aria-label={`View ${h.display_name}'s profile`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="flex-1 h-9 rounded-lg text-white hover:opacity-90"
                        style={{ backgroundColor: PINE }}
                      >
                        <Link to={`/p/${slug}`} aria-label={`Book a session with ${h.display_name}`}>
                          Book Session
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
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

      {/* Newsletter CTA */}
      <section className="bg-[#FAF9F6] py-12 border-t border-gray-200">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 text-center">
          <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Stay in the loop
          </h3>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Get stories, updates, and resources from WO Commune delivered directly to your inbox.
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

      {/* ------------------------ Footer (Figma style) ------------------------ */}
      <footer className="bg-[#FAF9F6] text-[#2B2B2B] border-t border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-12">
          {/* Footer grid: brand + 3 columns */}
          <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
            {/* Brand Column */}
            <div>
              <h5 className="text-xl font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                WALKER'S ODYSSEY
              </h5>
              <p className="text-sm text-gray-600 max-w-[320px] leading-relaxed">
                Your trusted companion for every step - connecting you with guidance, community, 
                and inspiration to walk your path with purpose.
              </p>
            </div>

            {/* Brand Links */}
            <div>
              <h6 className="font-semibold mb-3">Brand</h6>
              <ul className="space-y-3 text-sm text-gray-700">
                <li><Link to="/about" className="hover:underline">About</Link></li>
                <li><Link to="#" className="hover:underline">Brand Story</Link></li>
                <li><Link to="#" className="hover:underline">Vision</Link></li>
                <li><Link to="/about" className="hover:underline">About</Link></li>
              </ul>
            </div>

            {/* Commune Links */}
            <div>
              <h6 className="font-semibold mb-3">Commune</h6>
              <ul className="space-y-3 text-sm text-gray-700">
                <li><Link to="/get-help" className="hover:underline">Know Commune</Link></li>
                <li><Link to="/get-help" className="hover:underline">Join Commune</Link></li>
                <li><Link to="/helpanions" className="hover:underline">Become a Helpanion</Link></li>
                <li><Link to="#" className="hover:underline">Community Guidelines</Link></li>
              </ul>
            </div>

            {/* Get in touch */}
            <div>
              <h6 className="font-semibold mb-3">Get in touch</h6>
              <ul className="space-y-3 text-sm text-gray-700">
                <li><a href="mailto:commune@walkersodyssey.com" className="hover:underline">commune@walkersodyssey.com</a></li>
                <li><Link to="#" className="hover:underline">Contact Us</Link></li>
                <li><a href="#" className="hover:underline flex items-center gap-1"><Linkedin className="w-4 h-4" /> LinkedIn</a></li>
                <li><a href="#" className="hover:underline flex items-center gap-1"><Instagram className="w-4 h-4" /> Instagram</a></li>
                <li><a href="#" className="hover:underline flex items-center gap-1"><Twitter className="w-4 h-4" /> Twitter</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom row */}
          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
              <p>© {new Date().getFullYear()} Walker's Odyssey. All rights reserved.</p>
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5" />
                <Instagram className="w-5 h-5" />
                <Twitter className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth modal */}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
