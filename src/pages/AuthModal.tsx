// WOCommunePage.tsx
// Updated: main header kept, added WOCommune sub-header that triggers mega menu on Get Help click
// Uses AuthModal component (separate file) which accepts props: open, onOpenChange, role?, initialTab?

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Menu as MenuIcon, X, Search } from "lucide-react";
import AuthModal from "./AuthModal"; // updated modal file (see below)

// Dummy assets (replace with your own)
const HERO_IMG = "/assets/hero-placeholder.jpg";
const EVENT_IMG = "/assets/event-placeholder.jpg";
const CONVO_IMG = "/assets/convo-placeholder.jpg";
const PODCAST_IMG = "/assets/podcast-placeholder.jpg";

const PINE = "#01796F";

export default function WOCommunePage(): JSX.Element {
  // Auth modal state
  const [authOpen, setAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<"walker" | "helpanion" | null>(null);
  const [authInitialTab, setAuthInitialTab] = useState<"signup" | "login">("signup");

  // Sub-header mega menu (desktop) open state
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const helpMenuRef = useRef<HTMLDivElement | null>(null);

  // Mobile sub-menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // For mobile accordion sections inside the mobile menu
  const [mobileMegaOpen, setMobileMegaOpen] = useState<string | null>(null);
  const mobileMegaRef = useRef<HTMLDivElement | null>(null);

  // Close help menu if click outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (helpMenuRef.current && !helpMenuRef.current.contains(e.target as Node)) {
        setHelpMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Close mobile mega if click outside
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (mobileMegaRef.current && !mobileMegaRef.current.contains(e.target as Node)) {
        setMobileMegaOpen(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Helper: open auth modal pre-set for sign-up as walker/helpanion
  const openSignupAs = (role: "walker" | "helpanion") => {
    setAuthRole(role);
    setAuthInitialTab("signup");
    setAuthOpen(true);
  };

  // Helper: open login modal
  const openLogin = () => {
    setAuthRole(null);
    setAuthInitialTab("login");
    setAuthOpen(true);
  };

  // The mega-menu columns (used for desktop dropdown and mobile lists)
  const menuCols = [
    {
      title: "By College Life",
      items: ["Freshers", "Final Years", "Campus Leaders", "Alumni Networking"],
    },
    {
      title: "By Profession",
      items: ["Early Career", "Mid-Career", "Freelancers", "Career Switchers"],
    },
    {
      title: "Events & Meetups",
      items: ["Run Club", "Expert Sessions", "Movie Screenings", "Networking Dinners"],
    },
    {
      title: "Podcasts & Stories",
      items: ["BYJM Podcast", "Beginner's Talk", "Member Stories"],
    },
    {
      title: "Get Help",
      items: ["Book 1:1", "Ask the Community", "Join as Helpanion"],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#222]">
      {/* ================= Main Header (keep unchanged from your site) ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-[18px] md:text-[20px] font-semibold tracking-widest"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#222" }}
          >
            WALKER'S ODYSSEY
          </Link>

          {/* NOTE: removed top-level mega-menu here per the new structure
              (we're keeping this header visually the same as the rest of the site) */}

          {/* Right: header search (desktop) & auth CTA */}
          <div className="flex items-center gap-3">
            {/* Desktop search */}
            <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-md px-3 py-1 shadow-sm">
              <input
                aria-label="Search help topics"
                placeholder="Search help topics, events, podcasts..."
                className="outline-none w-56 text-sm placeholder:text-gray-400"
              />
            </div>

            {/* Auth Buttons */}
            <button
              onClick={() => {
                setAuthInitialTab("login");
                setAuthRole(null);
                setAuthOpen(true);
              }}
              className="text-sm px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              Login
            </button>

            <button
              onClick={() => {
                setAuthInitialTab("signup");
                setAuthRole(null);
                setAuthOpen(true);
              }}
              className="text-sm px-4 py-1 rounded-md font-medium"
              style={{
                backgroundColor: PINE,
                color: "#fff",
              }}
            >
              Sign Up
            </button>

            {/* Mobile menu toggle (we will show mobile submenu under the sub-header) */}
            <button
              className="lg:hidden ml-1"
              onClick={() => setMobileMenuOpen((s) => !s)}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to account for fixed header */}
      <div className="h-16" />

      {/* ================= WO Commune Sub-header (ONLY ON WO COMMUNE PAGE) ================= */}
      <div className="bg-white border-b">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 flex items-center gap-4 h-14">
          {/* Left: WO COMMUNE label */}
          <Link to="/commune" className="text-lg font-semibold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            WO COMMUNE
          </Link>

          {/* Get Help button (opens click-based mega menu) */}
          <div className="relative" ref={helpMenuRef}>
            <button
              onClick={() => setHelpMenuOpen((s) => !s)}
              className="px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1"
              style={{ backgroundColor: PINE, color: "#fff" }}
            >
              Get Help
              <ChevronRight size={14} className={`transition-transform ${helpMenuOpen ? "rotate-90" : ""}`} />
            </button>

            {/* Desktop mega menu panel (click-based) */}
            {helpMenuOpen && (
              <div className="absolute left-0 top-full mt-2 z-50 w-[760px] bg-white border rounded-md shadow-lg p-6 grid grid-cols-3 gap-6">
                {menuCols.slice(0, 3).map((col) => (
                  <div key={col.title}>
                    <h4 className="font-medium mb-2 text-gray-800">{col.title}</h4>
                    <ul className="space-y-1 text-sm">
                      {col.items.map((it) => (
                        <li key={it}>
                          <a href="#" className="text-gray-700 hover:text-gray-900">
                            {it}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="col-span-1">
                  {/* another column of items */}
                  <h4 className="font-medium mb-2 text-gray-800">{menuCols[3].title}</h4>
                  <ul className="space-y-1 text-sm">
                    {menuCols[3].items.map((it) => (
                      <li key={it}>
                        <a href="#" className="text-gray-700 hover:text-gray-900">
                          {it}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-gray-800">{menuCols[4].title}</h4>
                    <ul className="space-y-1 text-sm">
                      {menuCols[4].items.map((it) => (
                        <li key={it}>
                          <a href="#" className="text-gray-700 hover:text-gray-900">
                            {it}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search bar (center) */}
          <div className="flex items-center bg-white border border-gray-200 rounded-md px-3 py-1 ml-4 w-full max-w-[640px]">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              placeholder="Search events, help topics or podcasts..."
              className="flex-1 text-sm outline-none"
            />
          </div>

          {/* Right CTAs */}
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => openSignupAs("walker")}
              className="px-3 py-1 text-sm rounded-md"
              style={{ backgroundColor: PINE, color: "#fff" }}
            >
              Join as Walker
            </button>

            <button
              onClick={() => openSignupAs("helpanion")}
              className="px-3 py-1 text-sm rounded-md"
              style={{ backgroundColor: PINE, color: "#fff" }}
            >
              Join as Helpanion
            </button>

            <button
              onClick={() => {
                setAuthInitialTab("login");
                setAuthRole(null);
                setAuthOpen(true);
              }}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md"
            >
              Login
            </button>
          </div>
        </div>

        {/* Mobile panel: when mobileMenuOpen is true show mobile-friendly list under the subheader */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 w-full px-4 py-4" ref={mobileMegaRef}>
            {/* Mobile search */}
            <div className="mb-3">
              <input
                aria-label="Mobile search"
                placeholder="Search..."
                className="w-full text-sm border border-gray-200 rounded-md px-3 py-2"
              />
            </div>

            {/* Mobile accordion groups */}
            <MobileMegaItem title="By College Life" id="college" openKey={mobileMegaOpen} setOpenKey={setMobileMegaOpen}>
              <MobileMegaList items={menuCols[0].items} />
            </MobileMegaItem>

            <MobileMegaItem title="By Profession" id="profession" openKey={mobileMegaOpen} setOpenKey={setMobileMegaOpen}>
              <MobileMegaList items={menuCols[1].items} />
            </MobileMegaItem>

            <MobileMegaItem title="Events & Meetups" id="events" openKey={mobileMegaOpen} setOpenKey={setMobileMegaOpen}>
              <MobileMegaList items={menuCols[2].items} />
            </MobileMegaItem>

            <MobileMegaItem title="Podcasts & Stories" id="podcasts" openKey={mobileMegaOpen} setOpenKey={setMobileMegaOpen}>
              <MobileMegaList items={menuCols[3].items} />
            </MobileMegaItem>

            <MobileMegaItem title="Get Help" id="help" openKey={mobileMegaOpen} setOpenKey={setMobileMegaOpen}>
              <MobileMegaList items={menuCols[4].items} />
            </MobileMegaItem>

            {/* Mobile Auth CTAs */}
            <div className="mt-4 flex gap-3">
              <button onClick={() => { setAuthInitialTab("login"); setAuthRole(null); setAuthOpen(true); }} className="flex-1 border border-gray-300 rounded-md py-2">
                Login
              </button>
              <button onClick={() => openSignupAs("walker")} className="flex-1 rounded-md py-2" style={{ backgroundColor: PINE, color: "#fff" }}>
                Join
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= Hero Section ================= */}
      <section
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_IMG})` }}
        aria-label="WO Commune hero"
      >
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative max-w-[1140px] mx-auto px-4 md:px-8 py-20 md:py-28 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-white text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
              Your trusted companion for every step
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl">
              A community of events, conversations, and 1:1 guidance that helps you take meaningful steps — at your pace.
            </p>

            <div className="mt-6 w-full max-w-[700px] mx-auto md:mx-0">
              <div className="flex items-center gap-3 bg-white rounded-md px-3 py-2 shadow">
                <input aria-label="Search topics" placeholder="Search 'career advice', 'run club', 'networking'..." className="flex-1 text-sm outline-none" />
                <button className="px-4 py-2 rounded-md" style={{ backgroundColor: PINE, color: "#fff" }}>
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[420px] lg:w-[520px] rounded-md overflow-hidden shadow-lg border border-white/20">
            <img src={HERO_IMG} alt="Walking path visual" className="w-full h-64 md:h-80 object-cover" />
          </div>
        </div>
      </section>

      {/* ================= Tabs: Events / Conversations / Podcasts (keeps your existing content) ================= */}
      <section className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
        <div className="flex gap-4 items-center mb-6">
          <TabButton>Events</TabButton>
          <TabButton>Conversations</TabButton>
          <TabButton>Podcasts</TabButton>
          <div className="ml-auto text-sm text-gray-500">Showing featured picks</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Featured Event Card */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <img src={EVENT_IMG} alt="Event" className="w-full h-44 object-cover" />
            <div className="p-4">
              <div className="text-sm text-gray-500">Networking Dinner</div>
              <h3 className="font-semibold mt-1">Dinner & Conversations — City Hub</h3>
              <p className="text-sm text-gray-600 mt-2">Join like-minded walkers for an evening of meaningful conversation and food.</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">24 Aug • 7pm</div>
                <button className="px-3 py-1 rounded-md text-white" style={{ backgroundColor: PINE }}>
                  RSVP
                </button>
              </div>
            </div>
          </div>

          {/* Community Conversation Card */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <img src={CONVO_IMG} alt="Conversation" className="w-full h-44 object-cover" />
            <div className="p-4">
              <div className="text-sm text-gray-500">Community Talk</div>
              <h3 className="font-semibold mt-1">From Comparison to Contentment</h3>
              <p className="text-sm text-gray-600 mt-2">A group conversation about stopping comparison and finding your own pace.</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">Online • Free</div>
                <button className="px-3 py-1 rounded-md border border-gray-300">Join</button>
              </div>
            </div>
          </div>

          {/* Podcast Card */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <img src={PODCAST_IMG} alt="Podcast" className="w-full h-44 object-cover" />
            <div className="p-4">
              <div className="text-sm text-gray-500">Podcast</div>
              <h3 className="font-semibold mt-1">You Give Up, Until You Decide Not To</h3>
              <p className="text-sm text-gray-600 mt-2">Listen to inspiring journeys in short conversational episodes.</p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">20 min</div>
                <button className="px-3 py-1 rounded-md border border-gray-300">Listen</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Impact Metrics, Podcasts & Stories, Footer (unchanged from your original layout) ================= */}
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

      <section className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
        <div className="md:flex md:items-start md:gap-8">
          <div className="md:flex-1">
            <h2 className="text-2xl font-semibold mb-4">Podcasts & Stories</h2>
            <p className="text-gray-600 mb-6">Hear real stories from walkers, learn practical tips, and join the conversation.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1,2,3,4].map((i) => (
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
            <a href="https://wocommune.substack.com/" target="_blank" rel="noreferrer noopener" className="inline-block text-center px-4 py-2 rounded-md font-medium" style={{ backgroundColor: PINE, color: "#fff" }}>
              Subscribe on Substack
            </a>
          </aside>
        </div>
      </section>

      {/* Footer */}
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

      {/* Auth Modal (wired with initial role/tab) */}
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} role={authRole ?? undefined} initialTab={authInitialTab} />
    </div>
  );
}

/* ================= Helper components ================= */

// Mobile mega menu item component
function MobileMegaItem({
  title,
  id,
  openKey,
  setOpenKey,
  children,
}: {
  title: string;
  id: string;
  openKey: string | null;
  setOpenKey: (k: string | null) => void;
  children: React.ReactNode;
}) {
  const isOpen = openKey === id;
  return (
    <div className="border-b border-gray-100 py-3">
      <button
        onClick={() => setOpenKey(isOpen ? null : id)}
        className="w-full flex items-center justify-between text-left text-sm font-medium"
      >
        <span>{title}</span>
        <ChevronRight className={`transform ${isOpen ? "rotate-90" : "rotate-0"}`} />
      </button>
      {isOpen && <div className="mt-3 pl-3">{children}</div>}
    </div>
  );
}

function MobileMegaList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((it) => (
        <li key={it}>
          <a href="#" className="text-gray-700 hover:underline">
            {it}
          </a>
        </li>
      ))}
    </ul>
  );
}

// Small tab button used above
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
