import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import GlobalHeader from '@/components/common/GlobalHeader';
import { Footer } from '@/components/common/Footer';
import { ArrowRight, Users, Calendar, Heart, Star, Coffee } from 'lucide-react';

/* Brand colors matching home page */
const PINE = "#193232";

export default function WOCommune() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalHeader />
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[80vh] mt-16 flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-gray-900"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/src/assets/hero-placeholder.jpg')`,
          }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            WO COMMUNE
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Connecting walkers with helpanions in a community built on guidance, 
            support, and shared journeys.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth?mode=signup">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 font-medium px-8 py-3"
              >
                Join as Walker
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black font-medium px-8 py-3"
              >
                Become a Helpanion
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Walking Beside You, Every Step of the Way
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
            At WO Commune, we believe every journey is unique. Whether you're taking your first step 
            or navigating an unfamiliar path, we're here to walk alongside you — offering guidance, 
            inspiration, and a community that celebrates your pace, your way.
          </p>
          <Link to="/about">
            <Button variant="outline" className="group">
              Our Story 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Find your helpanion in 3 steps
            </h2>
            <p className="text-lg text-muted-foreground">
              Connect with guidance that understands your journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="text-center p-8 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Discover Your Helpanion</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Search our network and find someone who understands your journey and goals.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="text-center p-8 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Schedule the Meeting</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Check for availability, book an appointment and share your goals.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="text-center p-8 border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Connect & Converse</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get real advice and guidance that helps you take the next step.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="group">
                Find your helpanion 
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              More Than Just Connections
            </h2>
            <p className="text-lg text-muted-foreground">
              WO Commune offers a complete ecosystem for personal growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                Join a supportive network of walkers and helpanions
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Events</h3>
              <p className="text-sm text-muted-foreground">
                Attend networking dinners and community gatherings
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Stories</h3>
              <p className="text-sm text-muted-foreground">
                Read inspiring stories from fellow community members
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Support</h3>
              <p className="text-sm text-muted-foreground">
                Access ongoing guidance and emotional support
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Event */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Event</h2>
          </div>

          <Card className="max-w-2xl mx-auto border-none shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coffee className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Networking Dinner</h3>
              <p className="text-lg text-muted-foreground mb-4">
                24 Aug 2025 — 7:00 PM • Cafe Veritas, Downtown
              </p>
              <p className="text-muted-foreground mb-6">
                An evening of conversation and community.
              </p>
              <Button size="lg">Learn More</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Podcast Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Podcasts & Stories</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="/src/assets/podcast-placeholder.jpg"
                alt="Podcast cover"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">
                You Give Up, Until You Decide Not To.
              </h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                A conversation about persistence and small daily wins. Listen to our latest episode.
              </p>
              <Button size="lg" variant="outline">
                Listen Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Walk with us</h2>
          <p className="text-lg mb-8 opacity-90">
            Stories, guidance, and events — straight to your inbox.
          </p>
          <Button size="lg" variant="secondary">
            Subscribe on Substack
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}