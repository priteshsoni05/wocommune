import { useState, useMemo, useEffect } from 'react';
import { useHelpanions } from '@/hooks/useHelpanions';
import { useSearchParams } from 'react-router-dom';
import { HelpanionHeader } from '@/components/helpanion/HelpanionHeader';
import { HelpanionFooter } from '@/components/helpanion/HelpanionFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HelpanionsDirectory() {
  const { helpanions, loading } = useHelpanions();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Update search term from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch && urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  // Extract unique categories from all services
  const categories = useMemo(() => {
    const allCategories = helpanions.flatMap(h => 
      h.services.map(s => s.category).filter(Boolean)
    );
    return ['all', ...Array.from(new Set(allCategories))];
  }, [helpanions]);

  // Filter and sort helpanions
  const filteredHelpanions = useMemo(() => {
    let filtered = helpanions.filter(helpanion => {
      const matchesSearch = searchTerm === '' || 
        helpanion.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        helpanion.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        helpanion.services.some(s => 
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory = selectedCategory === 'all' || 
        helpanion.services.some(s => s.category === selectedCategory);

      return matchesSearch && matchesCategory;
    });

    // Sort filtered results
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          const aPrice = Math.min(...a.services.map(s => s.price_per_hour || Infinity));
          const bPrice = Math.min(...b.services.map(s => s.price_per_hour || Infinity));
          return aPrice - bPrice;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const aPrice = Math.max(...a.services.map(s => s.price_per_hour || 0));
          const bPrice = Math.max(...b.services.map(s => s.price_per_hour || 0));
          return bPrice - aPrice;
        });
        break;
    }

    return filtered;
  }, [helpanions, searchTerm, selectedCategory, sortBy]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getMinPrice = (services: any[]) => {
    const prices = services.map(s => s.price_per_hour).filter(Boolean);
    return prices.length > 0 ? Math.min(...prices.map(Number)) : null;
  };

  return (
    <div className="min-h-screen bg-background font-futura">
      <HelpanionHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onFilteredSearch={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-futura-bold mb-4">Discover Helpanions</h1>
          <p className="text-lg text-muted-foreground font-futura max-w-2xl mx-auto">
            Find the perfect helpanion to guide you through your challenges with their expertise and experience.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-muted/10 rounded-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search helpanions, services, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-futura"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 font-futura">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category} className="font-futura">
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 font-futura">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest" className="font-futura">Newest First</SelectItem>
                <SelectItem value="price-low" className="font-futura">Price: Low to High</SelectItem>
                <SelectItem value="price-high" className="font-futura">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground font-futura">
            {loading ? 'Loading...' : `${filteredHelpanions.length} helpanion${filteredHelpanions.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Helpanions Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-futura">Loading helpanions...</p>
          </div>
        ) : filteredHelpanions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-futura">No helpanions found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHelpanions.map((helpanion) => {
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
                      <div className="hidden w-full h-full flex items-center justify-center text-primary font-futura-bold">
                        {getInitials(helpanion.display_name || 'Helper')}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CardTitle className="text-lg font-futura-bold">{helpanion.display_name}</CardTitle>
                        {isNew && <Badge variant="secondary" className="text-xs font-futura">New</Badge>}
                      </div>
                      {minPrice && (
                        <p className="text-sm text-muted-foreground font-futura">From ₹{minPrice}/hour</p>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 text-center font-futura">
                      {helpanion.bio || 'Helping others through shared experiences and practical insights.'}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap justify-center gap-1">
                        {helpanion.services.slice(0, 3).map((service, idx) => (
                          service.category && (
                            <Badge key={idx} variant="outline" className="text-xs font-futura">
                              {service.category}
                            </Badge>
                          )
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1 font-futura" asChild>
                          <Link to={`/profile/${helpanion.user_id}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button size="sm" className="flex-1 group-hover:bg-primary/90 font-futura" asChild>
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
        )}
      </div>

      <HelpanionFooter />
    </div>
  );
}