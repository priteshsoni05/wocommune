import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { useHelpanions } from "@/hooks/useHelpanions";
import { GetHelpMegaMenu } from "@/components/helpanion/GetHelpMegaMenu";
import { TestimonialsSlider } from "@/components/helpanion/TestimonialsSlider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const HERO_IMG = "/assets/hero-placeholder.jpg";
const EVENT_IMG = "/assets/event-placeholder.jpg";
const CONVO_IMG = "/assets/convo-placeholder.jpg";
const PODCAST_IMG = "/assets/podcast-placeholder.jpg";

const PINE = "#01796F";

export default function WOCommunePage(): JSX.Element {
  const { helpanions } = useHelpanions();
  const navigate = useNavigate();

  const [fetchedHelpanions, setFetchedHelpanions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, bio, avatar_url, created_at, username, user_id, price_min, average_rating, sessions_completed")
        .eq("status", "active");

      if (error) {
        console.error("Error fetching Helpanions:", error);
      } else {
        setFetchedHelpanions(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

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
      {/* ===== Header ===== */}
      <Header onLoginClick={() => navigate('/auth?mode=login&role=walker')} />

      <div className="h-16" />

      {/* ===== Sub-header ===== */}
      <SubHeader />

      {/* ===== Hero Section ===== */}
      <Hero />

      {/* ===== Testimonials ===== */}
      <TestimonialsSlider compact />

      {/* ===== Featured Helpanions ===== */}
      <FeaturedHelpanionsList helpanions={topHelpanions} loading={loading} />

      {/* ===== Events / Conversations / Podcasts ===== */}
      <section className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
        <div className="flex gap-4 items-center mb-6">
          <TabButton>Events</TabButton>
          <TabButton>Conversations</TabButton>
          <TabButton>Podcasts</TabButton>
          <div className="ml-auto text-sm text-gray-500">Showing featured picks</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            image={EVENT_IMG}
            title="Dinner & Conversations — City Hub"
            subtitle="Networking Dinner"
            desc="Join like-minded walkers for an evening of meaningful conversation and food."
            btnText="RSVP"
            primary
          />
          <Card
            image={CONVO_IMG}
            title="From Comparison to Contentment"
            subtitle="Community Talk"
            desc="A group conversation about stopping comparison and finding your own pace."
            btnText="Join"
            secondary
            footerNote="Online • Free"
          />
          <Card
            image={PODCAST_IMG}
            title="You Give Up, Until You Decide Not To"
            subtitle="Podcast"
            desc="Listen to inspiring journeys in short conversational episodes."
            btnText="Listen"
            secondary
            footerNote="20 min"
          />
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section className="bg-white py-10">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-8">
            <StatBlock number="500+" label="Walkers supported" />
            <StatBlock number="100+" label="Events hosted" />
            <StatBlock number="200+" label="1:1 sessions" />
          </div>
          <div className="text-sm text-gray-600">
            Trusted by walkers across cities — join the community today.
          </div>
        </div>
      </section>

      {/* ===== Podcasts & Stories ===== */}
      <PodcastsAndStories />

      {/* ===== Footer ===== */}
      <Footer />

    </div>
  );
}

/* ------------------ Components ------------------ */

function Header({ onLoginClick }: { onLoginClick: () => void }) {
  return (
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
  );
}

function SubHeader() {
  const navigate = useNavigate();
  return (
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
        <button
          onClick={() => navigate('/auth?mode=login&role=walker')}
          className="inline-block px-5 py-2 rounded-md font-semibold"
          style={{ backgroundColor: PINE, color: "#fff" }}
        >
          Login / Sign Up
        </button>
      </div>
    </div>
  );
}

function Hero() {
  return (
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
  );
}

function FeaturedHelpanionsList({ helpanions, loading }: { helpanions: any[]; loading: boolean }) {
  return (
    <section className="bg-white">
      <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-10">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpanions.map((h) => {
                const name: string = h?.display_name || h?.name || "Helpanion";
                const avatar: string = h?.avatar_url || h?.avatar || "/assets/default-avatar.jpg";
                const rate: number | string | undefined = h?.rate ?? h?.price_min;
                const bio: string = h?.bio || "";
                const slug: string | number = h?.username || h?.user_id || h?.id;
                const profileUrl = `/${encodeURIComponent(String(slug))}`;

                return (
                  <div key={h.id} className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col h-full p-4">
                    <div className="flex flex-col items-center text-center flex-1">
                      <img
                        src={avatar}
                        alt={name}
                        className="w-20 h-20 rounded-full object-cover mb-3"
                      />
                      <h3 className="font-semibold">{name}</h3>
                      {rate != null && rate !== "" && (
                        <p className="text-sm text-gray-500 mt-1">From ₹{rate}/hour</p>
                      )}
                      {bio && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{bio}</p>
                      )}
                    </div>
                    <div className="mt-auto flex gap-2 pt-4">
                      <Link
                        className="flex-1 px-4 py-2 rounded-md bg-black text-white text-sm text-center"
                        to={profileUrl}
                        aria-label={`View ${name} profile`}
                      >
                        View Profile
                      </Link>
                      <Link
                        className="flex-1 px-4 py-2 rounded-md text-sm text-center"
                        style={{ backgroundColor: PINE, color: "#fff" }}
                        to={profileUrl}
                        aria-label={`Book a session with ${name}`}
                      >
                        Book Session →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-8">
              <Button size="default" variant="brand" asChild>
                <Link to="/helpanions">Explore all Helpanions</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* --- Reusable UI elements --- */
function TabButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="px-3 py-1 text-sm rounded-md bg-white border border-gray-200 shadow-sm">
      {children}
    </button>
  );
}

function StatBlock({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-xl font-semibold">{number}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function Card({
  image,
  title,
  subtitle,
  desc,
  btnText,
  primary,
  secondary,
  footerNote,
}: {
  image: string;
  title: string;
  subtitle: string;
  desc: string;
  btnText: string;
  primary?: boolean;
  secondary?: boolean;
  footerNote?: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <img src={image} alt={title} className="w-full h-44 object-cover" />
      <div className="p-4">
        <div className="text-sm text-gray-500">{subtitle}</div>
        <h3 className="font-semibold mt-1">{title}</h3>
        <p className="text-sm text-gray-600 mt-2">{desc}</p>
        {secondary ? (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-xs text-gray-500">{footerNote}</div>
            <button className="px-3 py-1 rounded-md border border-gray-300">{btnText}</button>
          </div>
        ) : (
          <button
            className="px-4 py-2 rounded-md mt-3"
            style={{ backgroundColor: primary ? PINE : "#333", color: "#fff" }}
          >
            {btnText}
          </button>
        )}
      </div>
    </div>
  );
}

function PodcastsAndStories() {
  return (
    <section className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
      <div className="md:flex md:items-start md:gap-8">
        <div className="md:flex-1">
          <h2 className="text-2xl font-semibold mb-4">Podcasts & Stories</h2>
          <p className="text-gray-600 mb-6">
            Hear real stories from walkers, learn practical tips, and join the conversation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-md border">
                <div className="font-semibold">Episode {i} — Small Wins</div>
                <div className="text-sm text-gray-600 mt-1">
                  A short talk about how tiny daily wins compound into change.
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="mt-6 md:mt-0 md:w-[320px] p-6 bg-[#F3F2EE] rounded-md flex flex-col justify-between">
          <div>
            <h4
              className="text-lg font-serif mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Walk with us
            </h4>
            <p className="text-sm text-gray-700 mb-4">
              Stories, guidance, and events — straight to your inbox.
            </p>
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
  );
}

function Footer() {
  return (
    <footer className="bg-[#FAF9F6] border-t border-gray-200 mt-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5 className="text-xl font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              WALKER'S ODYSSEY
            </h5>
            <p className="text-sm text-gray-600 max-w-[320px]">
              Your trusted companion for every step — connecting you with guidance, community, and inspiration to walk your path with purpose.
            </p>
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
            <p>© {new Date().getFullYear()} Walker's Odyssey. All rights reserved. <span className="text-gray-400">• Pipeline ✓</span></p>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-200 rounded-sm" />
              <div className="w-6 h-6 bg-gray-200 rounded-sm" />
              <div className="w-6 h-6 bg-gray-200 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
