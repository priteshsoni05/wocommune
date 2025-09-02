import React from 'react';
import { Link } from 'react-router-dom';
import WOCommuneSlate from '@/components/common/WOCommuneSlate';
import GlobalHeader from '@/components/common/GlobalHeader';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function WOCommune() {
  console.log('WOCommune page is rendering');
  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader />
      
      {/* WO Commune Slate Header */}
      <div className="mt-8 md:mt-10">
        <WOCommuneSlate />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-brand">WO COMMUNE</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connecting walkers with helpanions
          </p>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto">
            Join our community where walkers seeking guidance connect with experienced helpanions 
            who understand the journey. Whether you're looking for support or ready to help others, 
            WO Commune is where meaningful connections begin.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Walker Card */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-6">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🚶</span>
              </div>
              <h3 className="text-2xl font-semibold text-brand">I'm a Walker</h3>
              <p className="text-muted-foreground">
                Seeking guidance, support, and connection on my journey. 
                Ready to find a helpanion who understands my path.
              </p>
              <Link to="/auth">
                <Button size="lg" className="w-full bg-brand hover:bg-brand/90 text-brand-foreground">
                  Find a Helpanion
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Helpanion Card */}
          <Card className="p-8 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-6">
              <div className="w-16 h-16 bg-brand/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-2xl font-semibold text-brand">I'm a Helpanion</h3>
              <p className="text-muted-foreground">
                Ready to share my experience and support others on their journey. 
                I want to help walkers find their way.
              </p>
              <Link to="/auth">
                <Button size="lg" className="w-full bg-brand hover:bg-brand/90 text-brand-foreground">
                  Become a Helpanion
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-brand">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-brand text-brand-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-lg mb-2">Choose Your Role</h4>
              <p className="text-muted-foreground">
                Decide whether you're seeking guidance as a walker or offering support as a helpanion.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand text-brand-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-lg mb-2">Connect & Match</h4>
              <p className="text-muted-foreground">
                Find the right match based on your needs, goals, and shared experiences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-brand text-brand-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-lg mb-2">Start Walking Together</h4>
              <p className="text-muted-foreground">
                Begin meaningful conversations and supportive relationships that help you grow.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-brand/5 rounded-lg p-8">
          <h3 className="text-2xl font-bold mb-4 text-brand">Ready to Start Your Journey?</h3>
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of walkers and helpanions who have found their path through community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-brand text-brand hover:bg-brand hover:text-brand-foreground">
                I Need Guidance
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" className="bg-brand hover:bg-brand/90 text-brand-foreground">
                I Want to Help
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}