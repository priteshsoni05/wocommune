import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Search, Grid, List, Check, Heart, Shield, Lightbulb, MessageCircle, Users, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHelpanions } from '@/hooks/useHelpanions';

export default function Helpanion() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { helpanions, loading } = useHelpanions();

  const filteredHelpanions = helpanions.filter(helpanion => {
    const matchesSearch = helpanion.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         helpanion.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || 
                           helpanion.services.some(service => 
                             service.category?.toLowerCase() === categoryFilter.toLowerCase());
    const matchesPrice = priceFilter === 'all' || 
                        helpanion.services.some(service => {
                          if (!service.price_per_hour) return false;
                          const price = Number(service.price_per_hour);
                          if (priceFilter === 'low') return price <= 1000;
                          if (priceFilter === 'medium') return price > 1000 && price <= 3000;
                          if (priceFilter === 'high') return price > 3000;
                          return true;
                        });
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = [...new Set(helpanions.flatMap(h => 
    h.services.map(s => s.category).filter(Boolean)
  ))];

  const getMinPrice = (services: any[]) => {
    const prices = services.map(s => s.price_per_hour).filter(Boolean);
    return prices.length > 0 ? Math.min(...prices.map(Number)) : null;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const scrollToExplore = () => {
    document.getElementById('explore-helpanions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 py-20 text-center bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Find someone who's been there.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Real guidance from real people. One-on-one conversations that move you forward.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/auth">
                Become a Helpanion
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6"
              onClick={scrollToExplore}
            >
              Explore Helpanions
            </Button>
          </div>
        </div>
      </section>

      {/* What is Helpanion Section */}
      <section className="px-4 py-16 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">What is Helpanion?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              WO Commune's Helpanion is where help-seekers connect with those who've walked the path before them.
              Through 1:1 conversations — with creators, operators, designers, thinkers, founders, freelancers, and more — seekers get clarity, encouragement, and real direction.
            </p>
            <p className="text-base text-muted-foreground mt-4 font-medium">
              💬 This is not about expert talk. It's about shared experiences and practical insights.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-0 shadow-sm bg-card/50">
              <Check className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Real people, not scripted answers</h3>
            </Card>
            <Card className="text-center p-6 border-0 shadow-sm bg-card/50">
              <Lightbulb className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Lived experience over generic content</h3>
            </Card>
            <Card className="text-center p-6 border-0 shadow-sm bg-card/50">
              <MessageCircle className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Ask what truly matters to you</h3>
            </Card>
            <Card className="text-center p-6 border-0 shadow-sm bg-card/50">
              <Shield className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Private, secure, no-judgment guidance</h3>
            </Card>
          </div>
        </div>
      </section>

      {/* Explore Helpanions Section */}
      <section id="explore-helpanions" className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-6">Explore Helpanions</h2>
            <p className="text-lg text-muted-foreground">
              Connect with real people who've navigated the path you're on.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or keyword..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category, index) => (
                      <SelectItem key={`category-${index}`} value={category || ''}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="low">₹0 - ₹1,000</SelectItem>
                    <SelectItem value="medium">₹1,000 - ₹3,000</SelectItem>
                    <SelectItem value="high">₹3,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Helpanions Grid/List */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading helpanions...</p>
            </div>
          ) : filteredHelpanions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No helpanions found matching your criteria.</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 
              "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
              "space-y-4"
            }>
              {filteredHelpanions.map((helpanion) => {
                const minPrice = getMinPrice(helpanion.services);
                const isNew = new Date(helpanion.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                
                return (
                  <Card key={helpanion.id} className={`group hover:shadow-lg transition-all duration-200 ${
                    viewMode === 'list' ? 'flex flex-row items-center p-4' : ''
                  }`}>
                    <CardHeader className={viewMode === 'list' ? 'flex-shrink-0 pb-0 pr-4' : ''}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-primary/10 flex-shrink-0">
                          <img 
                            src={helpanion.avatar_url || `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face`} 
                            alt={`${helpanion.display_name}'s profile`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden w-full h-full flex items-center justify-center text-primary font-medium text-sm">
                            {getInitials(helpanion.display_name || 'Helper')}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{helpanion.display_name}</CardTitle>
                            {isNew && <Badge variant="secondary" className="text-xs">New</Badge>}
                          </div>
                          {minPrice && (
                            <p className="text-sm text-muted-foreground">From ₹{minPrice}/hour</p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className={`flex-1 ${viewMode === 'list' ? 'py-0' : 'pt-2'}`}>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {helpanion.bio || 'Helping others through shared experiences and practical insights.'}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-1">
                          {helpanion.services.slice(0, 3).map((service, idx) => (
                            service.category && (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {service.category}
                              </Badge>
                            )
                          ))}
                        </div>
                        
                        <Button size="sm" className="w-full group-hover:bg-primary/90" asChild>
                          <Link to={`/profile/${helpanion.user_id}`}>
                            View Profile
                            <ArrowRight className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Book a Session Section */}
      <section className="px-4 py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            This isn't advice from a stranger. It's direction from someone who gets it.
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="flex flex-col items-center text-center p-6">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">One-on-one conversations tailored to you</h3>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Navigation className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Skip the guesswork — ask exactly what you need</h3>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Lightbulb className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Learn from people with real-world experience</h3>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Heart className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">People who genuinely want to help</h3>
            </div>
            <div className="flex flex-col items-center text-center p-6 md:col-span-2 lg:col-span-1">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">100% private & safe environment</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Still Wondering Section */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Still Wondering Who to Talk To?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We'll help match you with a Helpanion who fits your story.
          </p>
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link to="/auth">
              Join the Commune
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="px-4 py-16 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
          
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="who-are-helpanions" className="bg-card rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Who are Helpanions?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Helpanions are real people who've navigated the path you're on. They're not influencers or advisors—they're fellow walkers sharing what worked for them.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-to-book" className="bg-card rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How do I book a session?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Click on a Helpanion's profile → Select a service → Choose an available time slot → Make payment → You're set.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="session-format" className="bg-card rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                What does a session look like?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Usually a video or audio call. Some sessions may include resources or post-call notes. It's up to the Helpanion.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="pricing" className="bg-card rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                How are prices decided?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Each Helpanion sets their own prices. You pay them directly (minus platform fee).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="become-helpanion" className="bg-card rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold">
                Can I become a Helpanion?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! If you believe your journey can help someone else, click here to apply.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}