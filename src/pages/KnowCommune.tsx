// KnowCommunePage.tsx
// Page explaining what WO Commune is, its purpose, and the roles of helpers and helpanions

import React from "react";
import { Link } from "react-router-dom";
import { Newsletter } from '@/components/common/Newsletter';
import { Footer } from '@/components/common/Footer';
import GlobalHeader from '@/components/common/GlobalHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const PINE = "#193232"; // Pine forest green
const GOLD = "#C7A76C"; // Accent gold

const KnowCommunePage: React.FC = () => {
  return (
    <div className="bg-white text-[#2B2B2B] min-h-screen">
      {/* ------------------------ Global Header ------------------------ */}
      <GlobalHeader />

      {/* ------------------------ Hero / Intro ------------------------ */}
      <section className="pt-20 pb-16 text-center max-w-[900px] mx-auto px-4">
        <h1 className="text-hero font-bold mb-6" style={{ color: PINE }}>
          Know WO Commune
        </h1>
        <div className="w-12 border-t-2 border-[#193232] mx-auto my-4" />
        <p className="text-base md:text-lg leading-relaxed">
          A living platform where meaningful one-to-one connections happen through real conversations, 
          shared experiences, and authentic human support.
        </p>
      </section>

      {/* ------------------------ What is WO Commune ------------------------ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle style={{ color: PINE }}>What is WO Commune?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                WO Commune is more than just a platform — it's a movement toward deeper, more meaningful human connections. In a world dominated by superficial interactions and endless scrolling, WO Commune brings back the art of real conversation and genuine support.
              </p>
              <p className="leading-relaxed">
                It's a space where people come together to share their journeys, learn from one another, and grow through authentic one-to-one connections. Whether you're seeking guidance, offering your expertise, or simply wanting to connect with someone who understands your path, WO Commune creates the space for that to happen.
              </p>
              <p className="leading-relaxed">
                Today, it manifests as video calls and scheduled sessions. Tomorrow, it evolves into a new kind of social network — one built on depth, not noise; on presence, not performance; on wisdom shared, not attention sought.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ------------------------ The Purpose ------------------------ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle style={{ color: PINE }}>Why WO Commune Exists</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="leading-relaxed">
                We live in an age of constant connection, yet many feel more isolated than ever. The paradox of modern life is that we're always online, but rarely truly present with one another.
              </p>
              <p className="leading-relaxed">
                WO Commune exists to bridge this gap. It's built on the belief that real growth, healing, and transformation happen through genuine human connection — through being seen, heard, and supported by someone who's walked a similar path or overcome similar challenges.
              </p>
              <p className="leading-relaxed">
                Our purpose is simple: to create a space where people can find the guidance they need, offer the wisdom they've gained, and build meaningful relationships that transcend the transactional nature of modern interactions.
              </p>
              <p className="leading-relaxed font-semibold" style={{ color: PINE }}>
                Because every journey is easier when you're not walking alone.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ------------------------ Roles: Helpanion & Walker ------------------------ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: PINE }}>
            The WO Commune Community
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Helpanion */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle style={{ color: PINE }}>Helpanion</CardTitle>
                <CardDescription className="text-base">The Guide • The Mentor • The Expert</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  A <strong>Helpanion</strong> is someone who has walked the path, gained valuable experience, and is now ready to share their knowledge and insights with others. They are the mentors, coaches, advisors, and guides within the WO Commune.
                </p>
                <p className="leading-relaxed">
                  Helpanions offer their time, expertise, and support to those who seek it. Whether it's career advice, life coaching, skill development, or simply being a compassionate listener, Helpanions create safe spaces for growth and transformation.
                </p>
                <div className="pt-2">
                  <p className="font-semibold mb-2" style={{ color: PINE }}>A Helpanion might be:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>A career coach helping someone navigate a job transition</li>
                    <li>A wellness guide supporting someone's mental health journey</li>
                    <li>A business mentor sharing startup wisdom</li>
                    <li>A life advisor offering perspective on personal challenges</li>
                    <li>An expert in any field willing to share their knowledge</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Walker (Help Seeker) */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle style={{ color: PINE }}>Walker</CardTitle>
                <CardDescription className="text-base">The Seeker • The Explorer • The Learner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  A <strong>Walker</strong> is anyone on their journey who seeks guidance, support, or simply a conversation with someone who understands. They are the explorers, the learners, the seekers of wisdom and connection.
                </p>
                <p className="leading-relaxed">
                  Walkers come to WO Commune to find Helpanions who can offer perspective, advice, or simply a listening ear. They're not looking for quick fixes or superficial tips — they're seeking real conversations that lead to real growth.
                </p>
                <div className="pt-2">
                  <p className="font-semibold mb-2" style={{ color: PINE }}>A Walker might be:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Someone navigating a career change and seeking clarity</li>
                    <li>An entrepreneur looking for business guidance</li>
                    <li>Anyone facing personal challenges and needing support</li>
                    <li>A student wanting to learn from someone's lived experience</li>
                    <li>Someone seeking meaningful conversation and connection</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ------------------------ How It Works ------------------------ */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle style={{ color: PINE }}>How WO Commune Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2" style={{ color: PINE }}>For Walkers:</h4>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Browse Helpanions by expertise, experience, or area of life</li>
                  <li>Book a session at a time that works for you</li>
                  <li>Connect over video for a real, meaningful conversation</li>
                  <li>Gain insights, clarity, and support for your journey</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2" style={{ color: PINE }}>For Helpanions:</h4>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Create your profile and share your expertise</li>
                  <li>Set your availability and session offerings</li>
                  <li>Connect with Walkers seeking your guidance</li>
                  <li>Make a meaningful impact while building your practice</li>
                </ol>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="leading-relaxed italic">
                  Note: Anyone can be both a Walker and a Helpanion. We all have areas where we seek guidance and areas where we can offer wisdom. WO Commune celebrates this duality.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ------------------------ Call to Action ------------------------ */}
      <section className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold mb-4" style={{ color: PINE }}>
            Ready to Join the Commune?
          </h3>
          <p className="text-lg leading-relaxed mb-6">
            Whether you're seeking guidance or ready to share your wisdom, WO Commune welcomes you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/helpanions"
              className="inline-block px-8 py-3 rounded-md font-semibold text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: PINE }}
            >
              Find a Helpanion
            </Link>
            <Link
              to="/auth"
              className="inline-block px-8 py-3 rounded-md font-semibold bg-transparent border-2 hover:bg-gray-50 transition-colors"
              style={{ borderColor: PINE, color: PINE }}
            >
              Become a Helpanion
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default KnowCommunePage;
