// HomePage.tsx
// React + Tailwind responsive homepage for Walker's Odyssey
// - Uses real assets from src/assets
// - Newsletter CTA links to Substack as requested

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Newsletter } from '@/components/common/Newsletter';
import { Footer } from '@/components/common/Footer';
import GlobalHeader from '@/components/common/GlobalHeader';

/* ---------- Real images (from src/assets) ---------- */
import HERO_IMG from "../assets/hero-placeholder.jpg";
import ABOUT_IMG from "../assets/about-placeholder-portrait.jpg";
import EVENT_PLACEHOLDER from "../assets/event-placeholder.jpg";
import PODCAST_PLACEHOLDER from "../assets/podcast-placeholder.jpg";

/* ---------- Brand color tokens (used inline for clarity) ---------- */
const PINE = "#2C5F50"; // pine forest green
const GOLD = "#f2f2f2"; // accent gold

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = "Walker's Odyssey – Your trusted companion";
    // Make sure fonts are loaded globally in your index.html:
    // <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Source+Sans+Pro:wght@300;400;600&display=swap" rel="stylesheet">
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B]">
      {/* ------------------------ Global Header ------------------------ */}
      <GlobalHeader />

      {/* ------------------------ Hero Section ------------------------ */}
      <section
        className="relative w-full h-[85vh] sm:h-[90vh] md:h-screen mt-8 md:mt-10"
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
            className="text-white font-semibold leading-tight max-w-3xl text-[28px] sm:text-4xl md:text-5xl font-heading"
          >
            Your trusted companion for every step
          </h1>

          {/* small divider */}
          <div className="w-12 border-t-2 border-white my-4" />

          {/* Subtext */}
          <p
            className="text-white max-w-2xl text-base md:text-lg font-body"
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
            <h2 className="text-xl font-heading mb-4">
              Walking Beside You, Every Step of the Way
            </h2>
            <p className="text-base leading-relaxed mb-6 font-body">
              At Walker's Odyssey, we believe every journey is unique. Whether you're taking your first step
              or navigating an unfamiliar path, we're here to walk alongside you — offering guidance,
              inspiration, and a community that celebrates your pace, your way.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-sm font-medium text-[#444] hover:underline">
              Our Story →
            </Link>
          </div>

          {/* Right column: portrait image (3:4) */}
          <div className="px-2 flex justify-center md:justify-end">
            {/* Reduced by ~25% width and height */}
            <div className="w-[262px] sm:w-[315px] md:w-[390px] lg:w-[412px] h-[525px] rounded-md overflow-hidden shadow-sm">
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

      {/* ------------------------ Upcoming Event Strip ------------------------ */}
      <section className="bg-[#F3F2EE] py-6">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-left sm:text-left">
              <h3 className="font-semibold text-lg mb-1 text-[#333]">Upcoming Event</h3>
              <div className="text-gray-700">
                <div className="font-medium">Networking Dinner</div>
                <div className="text-sm text-gray-600">24 Aug 2025 — 7:00 PM • Cafe Veritas, Downtown</div>
                <div className="text-sm text-gray-600 mt-1">An evening of conversation and community.</div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link
                to="#"
                className="inline-block px-5 py-2 rounded-md font-semibold"
                style={{ backgroundColor: PINE, color: "white" }}
              >
                Learn More
              </Link>
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

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;