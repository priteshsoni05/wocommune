// HomePage.tsx
// React + Tailwind responsive homepage for Walker's Odyssey
// - Replace dummy images in the code with your real asset paths
// - Newsletter CTA links to your Substack as requested

import React, { useEffect } from "react";
import { Link } from "react-router-dom";

/* ---------- Dummy images (replace with your own) ---------- */
const HERO_IMG = "/assets/hero-placeholder.jpg";
const ABOUT_IMG = "/assets/about-placeholder-portrait.jpg";
const EVENT_PLACEHOLDER = "/assets/event-placeholder.jpg";
const PODCAST_PLACEHOLDER = "/assets/podcast-placeholder.jpg";
const SOCIAL_ICON = "/assets/social-placeholder-24.png";

/* ---------- Brand color tokens (used inline for clarity) ---------- */
const PINE = "#2C5F50"; // pine forest green
const GOLD = "#C7A76C"; // accent gold

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = "Walker's Odyssey – Your trusted companion";
    // Make sure fonts are loaded globally in your index.html:
    // <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet">
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B]">
      {/* ------------------------ Header / Nav ------------------------ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-[20px] font-semibold tracking-widest"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#333" }}
            aria-label="Walker’s Odyssey home"
          >
            WALKER'S ODYSSEY
          </Link>

          {/* Right side / simple menu */}
          <nav className="text-sm">
            <ul className="flex items-center gap-4">
              <li>
                <Link to="/about" className="hover:underline">About</Link>
              </li>
              <li>
                <Link to="/get-help" className="hover:underline">Commune</Link>
              </li>
              <li>
                <Link to="#" className="hidden md:inline hover:underline">Shop</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* ------------------------ Hero Section ------------------------ */}
      <section
        className="relative w-full h-[82vh] md:h-screen mt-16"
        aria-label="Hero: Your trusted companion"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${HERO_IMG})`,
          }}
          aria-hidden="true"
        />
        {/* Dark overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Hero content (centered) */}
        <div className="relative z-10 max-w-[1140px] mx-auto px-4 md:px-8 h-full flex flex-col items-center justify-center text-center">
          {/* Headline */}
          <h1
            className="text-white font-semibold leading-tight max-w-3xl text-[28px] sm:text-4xl md:text-5xl"
            style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
          >
            Your trusted companion for every step
          </h1>

          {/* small divider */}
          <div className="w-12 border-t-2 border-white my-4" />

          {/* Subtext */}
          <p
            className="text-white max-w-2xl text-base md:text-lg"
            style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
          >
            connecting you with guidance, community, and inspiration to walk your path with purpose.
          </p>

          {/* CTA buttons */}
          <div className="mt-6 flex gap-3">
            <Link
              to="/get-help"
              className="inline-block px-5 py-2 rounded-md font-semibold"
              style={{ backgroundColor: PINE, color: "white" }}
            >
              Start Your Journey
            </Link>
            <Link
              to="/get-help"
              className="inline-block px-5 py-2 rounded-md font-medium border border-white/60 text-white bg-white/10 hover:bg-white/20"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------ About Section (2-column) ------------------------ */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-12">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left column: text */}
          <div className="px-2">
            <h2 className="text-xl font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Walking Beside You, Every Step of the Way
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ fontFamily: "'Source Sans Pro', sans-serif" }}>
              At Walker’s Odyssey, we believe every journey is unique. Whether you’re taking your first step
              or navigating an unfamiliar path, we’re here to walk alongside you — offering guidance,
              inspiration, and a community that celebrates your pace, your way.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-sm font-medium text-[#444] hover:underline">
              Our Story →
            </Link>
          </div>

          {/* Right column: portrait image (3:4) */}
          <div className="px-2 flex justify-center md:justify-end">
            <div className="w-[350px] sm:w-[420px] md:w-[520px] lg:w-[550px] h-[700px] rounded-md overflow-hidden shadow-sm">
              <img
                src={ABOUT_IMG}
                alt="Two people walking on a forest path (symbolic, non-romantic)"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------ Helpanion Section (3 steps) ------------------------ */}
      <section className="bg-[#2C5F50] text-white py-12">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8">
          <h3 className="text-lg font-semibold mb-6">Find your helpanion in 3 steps</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white/8 rounded-md p-6">
              <h4 className="font-semibold mb-2">Discover Your Helpanion</h4>
              <p className="text-sm text-white/90">Search our network and find someone who understands your journey and goals.</p>
            </div>
            {/* Step 2 */}
            <div className="bg-white/8 rounded-md p-6">
              <h4 className="font-semibold mb-2">Schedule the meeting</h4>
              <p className="text-sm text-white/90">Check for availability, book an appointment and share your goals.</p>
            </div>
            {/* Step 3 */}
            <div className="bg-white/8 rounded-md p-6">
              <h4 className="font-semibold mb-2">Connect & Converse</h4>
              <p className="text-sm text-white/90">Get real advice and guidance that helps you take the next step.</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              to="/get-help"
              className="inline-block px-5 py-2 rounded-md font-semibold"
              style={{ backgroundColor: GOLD, color: "#111" }}
            >
              Find your helpanion →
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------ Community & Events ------------------------ */}
      <section className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
        <h3 className="text-lg font-semibold mb-4">Community & Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Upcoming events column */}
          <div className="col-span-1 md:col-span-1 bg-white rounded-md p-4 shadow-sm">
            <h4 className="font-medium mb-2">Upcoming Events</h4>
            <div className="text-sm text-gray-600">
              <div className="mb-4">
                <div className="font-semibold">Networking Dinner</div>
                <div className="text-xs text-gray-500">24 Aug 2025 — 7:00 PM</div>
                <div className="text-xs mt-2">Cafe Veritas — Downtown. An evening of conversation and community.</div>
              </div>
              <a className="text-sm text-pine-600" href="#">See all events →</a>
            </div>
          </div>

          {/* Events gallery placeholder */}
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-md overflow-hidden bg-gray-100 h-40">
              <img src={EVENT_PLACEHOLDER} alt="Past event" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-md overflow-hidden bg-gray-100 h-40">
              <img src={EVENT_PLACEHOLDER} alt="Past event" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------ Podcasts & Stories ------------------------ */}
      <section className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
        <h3 className="text-lg font-semibold mb-6">Podcasts & Stories</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Featured podcast / visual */}
          <article className="rounded-md overflow-hidden shadow-sm">
            <img src={PODCAST_PLACEHOLDER} alt="Podcast cover" className="w-full h-72 object-cover" />
            <div className="p-4 bg-white">
              <h4 className="font-semibold mb-2">You Give Up, Until You Decide Not To.</h4>
              <p className="text-sm text-gray-600">A conversation about persistence and small daily wins. Listen to our latest episode.</p>
            </div>
          </article>

          {/* Latest article / summary */}
          <aside className="bg-white rounded-md p-6 shadow-sm">
            <h4 className="font-semibold mb-2">The Latest Edit</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Short takes and stories about walking, learning, and the tiny steps that shape a life.
            </p>
            <div className="mt-4">
              <Link to="/about" className="text-sm font-medium" style={{ color: PINE }}>
                Our Story →
              </Link>
            </div>
          </aside>
        </div>
      </section>

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
                Your trusted companion for every step - connecting you with guidance, community, and inspiration to walk your path with purpose.
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
                <li><a href="#" className="hover:underline">LinkedIn</a></li>
                <li><a href="#" className="hover:underline">Instagram</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom row: divider + copyright + socials */}
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
    </div>
  );
};

export default HomePage;
