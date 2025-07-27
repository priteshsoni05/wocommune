import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-serif font-bold text-foreground hover:text-primary transition-colors">
                WO Commune
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              {/* Join the Commune Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="gap-2">
                    Join the Commune
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border-border z-50">
                  <DropdownMenuItem asChild>
                    <Link to="/auth?mode=signup&role=walker" className="cursor-pointer">
                      Walker
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/auth?mode=signup&role=helpanion" className="cursor-pointer">
                      Helpanion
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Already a Member Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Already a Member
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border-border z-50">
                  <DropdownMenuItem asChild>
                    <Link to="/auth?mode=login&role=walker" className="cursor-pointer">
                      Walker
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/auth?mode=login&role=helpanion" className="cursor-pointer">
                      Helpanion
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-20 text-center bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            Welcome to WO Commune
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            A community platform where Walkers seek guidance and Helpanions provide expert support.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
            {/* Walker Card */}
            <div className="bg-card border border-border rounded-lg p-8 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4">Join as a Walker</h3>
              <p className="text-muted-foreground mb-6">
                Seek guidance from experienced Helpanions who've walked similar paths. Get personalized support for your journey.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Access to expert guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Book personalized sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Community support</span>
                </div>
              </div>
              <Link to="/auth?mode=signup&role=walker">
                <Button className="w-full group">
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Helpanion Card */}
            <div className="bg-card border border-border rounded-lg p-8 text-left hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-4">Join as a Helpanion</h3>
              <p className="text-muted-foreground mb-6">
                Share your expertise and guide others on their journey. Build meaningful connections while earning from your knowledge.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Share your expertise</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Earn from helping others</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm">Flexible scheduling</span>
                </div>
              </div>
              <Link to="/auth?mode=signup&role=helpanion">
                <Button variant="outline" className="w-full group">
                  Start Helping
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-16">
            <Link to="/helpanion" className="text-primary hover:underline">
              Browse Helpanions →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}