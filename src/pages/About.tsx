// AboutPage.tsx
// Responsive About page for Walker's Odyssey
// Follows the same theme/colors as HomePage.tsx

import React from "react";
import { Link } from "react-router-dom";
import { Newsletter } from '@/components/common/Newsletter';
import { Footer } from '@/components/common/Footer';
import GlobalHeader from '@/components/common/GlobalHeader';

const PINE = "#193232"; // Pine forest green
const GOLD = "#C7A76C"; // Accent gold

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white text-[#2B2B2B] min-h-screen">
      {/* ------------------------ Global Header ------------------------ */}
      <GlobalHeader />

      {/* ------------------------ Hero / Intro ------------------------ */}
      <section className="pt-20 pb-16 text-center max-w-[900px] mx-auto px-4">
        <h1 className="font-logo mb-6">
          About Us
        </h1>
        <p className="leading-relaxed">
          Walker's Odyssey helps each walker and explorer find a sense of fulfilment in their path,
          whether chosen or still being discovered.
        </p>
      </section>

      {/* ------------------------ Mission & Vision ------------------------ */}
      <section className="bg-[#F3F2EE] py-12">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div>
            <h3 style={{ color: PINE }}>
              Our Mission
            </h3>
            <p className="text-secondary leading-relaxed">
              To equip individuals with our products and services offerings, take their first step
              or continue walking on their unique path.
            </p>
          </div>
          {/* Vision */}
          <div>
            <h3 style={{ color: PINE }}>
              Our Vision
            </h3>
            <p className="text-secondary leading-relaxed">
              To be the trusted companion empowering and supporting walkers as they navigate their
              unique paths to fulfilment.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------ Our Story ------------------------ */}
      <section className="py-12">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8">
          <h3 className="font-normal" style={{ color: "#193232" }}>
            Our Story
          </h3>
          <p className="leading-relaxed mb-4 font-normal" style={{ color: "#193232" }}>
            In a world where social media often pressures us to rush and compare our lives with
            others, we wanted to create a space where individuals can embrace their own pace, cherish
            their unique paths, and uncover joy in every step of their journey.
          </p>
          <p className="leading-relaxed mb-4 font-normal" style={{ color: "#193232" }}>
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
        <h2 className="font-logo" style={{ color: GOLD }}>
          Keep Walking
        </h2>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;
