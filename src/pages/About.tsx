// AboutPage.tsx
// Responsive About page for Walker's Odyssey
// Follows the same theme/colors as HomePage.tsx

import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Linkedin, Twitter } from "lucide-react";

const PINE = "#2C5F50"; // Pine forest green
const GOLD = "#C7A76C"; // Accent gold

const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#FAF9F6] text-[#2B2B2B] min-h-screen">
      {/* ------------------------ Header ------------------------ */}
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
              <li>
                <Link to="/about" className="hover:underline">
                  About
                </Link>
              </li>
              <li>
                <Link to="/get-help" className="hover:underline">
                  Commune
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hidden md:inline hover:underline">
                  Shop
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* ------------------------ Hero / Intro ------------------------ */}
      <section className="pt-24 pb-16 text-center max-w-[900px] mx-auto px-4">
        <h1
          className="text-3xl sm:text-4xl font-serif mb-6"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          About Us
        </h1>
        <p
          className="text-base text-gray-700 leading-relaxed"
          style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
        >
          Walker's Odyssey helps each walker and explorer find a sense of fulfilment in their path,
          whether chosen or still being discovered.
        </p>
      </section>

      {/* ------------------------ Mission & Vision ------------------------ */}
      <section className="bg-[#F3F2EE] py-12">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div>
            <h2 className="text-xl font-serif mb-3" style={{ color: PINE }}>
              Our Mission
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              To equip individuals with our products and services offerings, take their first step
              or continue walking on their unique path.
            </p>
          </div>
          {/* Vision */}
          <div>
            <h2 className="text-xl font-serif mb-3" style={{ color: PINE }}>
              Our Vision
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              To be the trusted companion empowering and supporting walkers as they navigate their
              unique paths to fulfilment.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------ Our Story ------------------------ */}
      <section className="py-12">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8">
          <h2 className="text-xl font-serif mb-4" style={{ color: PINE }}>
            Our Story
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            In a world where social media often pressures us to rush and compare our lives with
            others, we wanted to create a space where individuals can embrace their own pace, cherish
            their unique paths, and uncover joy in every step of their journey.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            At Walker's Odyssey, we rise above being just a brand. We aim to build a community of
            like-minded individuals who recognize that every step—whether success or setbacks—is a
            vital part of growth. Failure isn’t a setback; it emerges only when we measure our
            progress against others. What may appear as failure is, in truth, a curve of learning and
            growth.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            To support you along your journey, we offer meticulously crafted fashion and lifestyle
            products and services that are not only practical and functional but also serve as a
            source of inspiration—a testament to your individuality and resilience.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Join us at Walker's Odyssey and discover how our products can be your trusted companions
            on your journey. Let's keep walking together and celebrate every step along the way.
          </p>
        </div>
      </section>

      {/* ------------------------ Philosophy ------------------------ */}
      <section className="bg-[#F3F2EE] py-12">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8">
          <h2 className="text-xl font-serif mb-4" style={{ color: PINE }}>
            Our Philosophy
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 leading-relaxed">
            <li>We’re ready when you are. Without delay.</li>
            <li>Practical designs always comes first. Even if it’s challenging.</li>
            <li>Companionship and camaraderie matters.</li>
            <li>No fake promises. No empty gestures.</li>
            <li>Because we are a lifestyle brand. But what we really offer is support.</li>
          </ul>
          <p className="mt-4 text-sm font-semibold" style={{ color: PINE }}>
            Keep striving. Keep Walking!
          </p>
        </div>
      </section>

      {/* ------------------------ Tagline ------------------------ */}
      <section className="py-12 text-center">
        <h3
          className="text-2xl font-serif"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
        >
          Keep Walking
        </h3>
      </section>

      {/* ------------------------ Newsletter CTA (same as HomePage) ------------------------ */}
      <section className="bg-[#F3F2EE] py-10">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-xl font-serif" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
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

      {/* ------------------------ Footer (same as HomePage) ------------------------ */}
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

          {/* Bottom row */}
          <div className="border-t border-gray-200 mt-8 pt-6">
            <div className="max-w-[1140px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
              <p>© {new Date().getFullYear()} Walker's Odyssey. All rights reserved.</p>
              <div className="flex items-center gap-3">
                <a href="#" aria-label="Twitter" className="text-[#2B2B2B] hover:text-black">
                  <Twitter size={20} />
                </a>
                <a href="#" aria-label="LinkedIn" className="text-[#2B2B2B] hover:text-black">
                  <Linkedin size={20} />
                </a>
                <a href="#" aria-label="Instagram" className="text-[#2B2B2B] hover:text-black">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
