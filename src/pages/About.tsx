// AboutPage.tsx
// Responsive About page for Walker's Odyssey
// Follows the same theme/colors as HomePage.tsx

import React from "react";
import { Link } from "react-router-dom";
import { Newsletter } from '@/components/common/Newsletter';
import { Footer } from '@/components/common/Footer';
import GlobalHeader from '@/components/common/GlobalHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle style={{ color: PINE }}>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">
                To create spaces — digital and physical — where people feel seen, supported, and inspired to keep moving forward, one step at a time.
              </p>
            </CardContent>
          </Card>
          {/* Vision */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle style={{ color: PINE }}>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">
                A global ecosystem of belonging. A world where human connection, shared experiences, and mindful action fuel growth — not just for ourselves, but for the communities we build together.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ------------------------ Our Story ------------------------ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle style={{ color: PINE }}>Our Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                In a world where social media often pressures us to rush and compare our lives with others, we wanted to create a space where individuals can embrace their own pace, cherish their unique paths, and uncover joy in every step of their journey.
              </p>
              <p className="leading-relaxed">
                At Walker's Odyssey, we rise above being just a brand. We aim to build a community of like-minded individuals who recognize that every step—whether success or setbacks—is a vital part of growth. Failure isn't a setback; it emerges only when we measure our progress against others. What may appear as failure is, in truth, a curve of learning and growth.
              </p>
              <p className="leading-relaxed">
                To support you along your journey, we are building
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ------------------------ WO Offerings ------------------------ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* WO Commune */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle style={{ color: PINE }}>WO Commune</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">
                One-to-one connections that go beyond small talk. A living platform where people share experiences, stories, and wisdom through real conversations. Today, it's video calls. Tomorrow, it becomes a new kind of social network — one built on depth, not noise.
              </p>
            </CardContent>
          </Card>
          
          {/* WO Experiences */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle style={{ color: PINE }}>WO Experiences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">
                From networking dinners to run clubs. From storytelling nights to music, art, and sport. From yoga studios to community cafés. Experiences designed to help people connect offline, move their bodies, and nurture their minds.
              </p>
            </CardContent>
          </Card>
          
          {/* WO Essentials */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle style={{ color: PINE }}>WO Essentials</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">
                Everyday companions — journals, wearables, lifestyle tools — created to remind us of gratitude, action, and belonging. Carry a piece of the Odyssey with you, wherever you go.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ------------------------ Call to Action ------------------------ */}
      <section className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg leading-relaxed" style={{ color: PINE }}>
            Join us at Walker's Odyssey and Let's keep walking together and celebrate every step along the way.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;