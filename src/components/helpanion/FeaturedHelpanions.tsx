import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HelpanionProfile } from '@/hooks/useHelpanions';

interface FeaturedHelpanionsProps {
  helpanions: HelpanionProfile[];
  loading: boolean;
}

export function FeaturedHelpanions({ helpanions, loading }: FeaturedHelpanionsProps) {
  console.log('FeaturedHelpanions received:', { helpanions: helpanions.length, loading });
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getMinPrice = (services: any[]) => {
    const prices = services.map(s => s.price_per_hour).filter(Boolean);
    return prices.length > 0 ? Math.min(...prices.map(Number)) : null;
  };

  if (loading) {
    return (
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Featured Helpanions</h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">We're finding the right people for you...</p>
          </div>
        </div>
      </section>
    );
  }

  if (helpanions.length === 0) {
    return (
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-12">Featured Helpanions</h2>
          <div className="text-center py-12">
            <p className="text-muted-foreground">No Helpanions available at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 bg-muted/10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-center mb-12 text-foreground">
          Featured Helpanions
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {helpanions.slice(0, 8).map((helpanion) => {
            const minPrice = getMinPrice(helpanion.services);
            const isNew = new Date(helpanion.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            
            return (
              <Card key={helpanion.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-background/80 backdrop-blur">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-primary/10 mx-auto mb-4">
                    <img 
                      src={helpanion.avatar_url || `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop&crop=face`} 
                      alt={`${helpanion.display_name}'s profile`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center text-primary font-medium">
                      {getInitials(helpanion.display_name || 'Helper')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CardTitle className="text-lg font-serif">{helpanion.display_name}</CardTitle>
                      {isNew && <Badge variant="secondary" className="text-xs">New</Badge>}
                    </div>
                    {minPrice && (
                      <p className="text-sm text-muted-foreground">From ₹{minPrice}/hour</p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 text-center">
                    {helpanion.bio || 'Helping others through shared experiences and practical insights.'}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex flex-wrap justify-center gap-1">
                      {helpanion.services.slice(0, 2).map((service, idx) => (
                        service.category && (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {service.category}
                          </Badge>
                        )
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" asChild>
                        <Link to={`/profile/${helpanion.user_id}`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1 group-hover:bg-primary/90" asChild>
                        <Link to={`/profile/${helpanion.user_id}`}>
                          Book Session
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {helpanions.length > 8 && (
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/helpanion/explore">
                View All Helpanions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}