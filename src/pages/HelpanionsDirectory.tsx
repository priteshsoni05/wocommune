// src/pages/HelpanionsDirectory.tsx
import { useState, useMemo, useEffect } from 'react';
import { useHelpanions } from '@/hooks/useHelpanions';
import { useSearchParams, Link } from 'react-router-dom';
import { HelpanionHeader } from '@/components/helpanion/HelpanionHeader';
import { HelpanionFooter } from '@/components/helpanion/HelpanionFooter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ArrowRight, Search } from 'lucide-react';

const PINE = '#01796F'; // brand pine (same as homepage buttons)

export default function HelpanionsDirectory() {
  const { helpanions, loading } = useHelpanions();
  const [searchParams] = useSearchParams();
  const [directorySearchTerm, setDirectorySearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');

  // Sync initial search from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch && !directorySearchTerm) setDirectorySearchTerm(urlSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Unique categories from services
  const categories = useMemo(() => {
    const all = helpanions.flatMap(h => h.services.map(s => s.category).filter(Boolean));
    return ['all', ...Array.from(new Set(all))];
  }, [helpanions]);

  // Helpers
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();
  const getMinPrice = (services: any[]) => {
    const prices = services.map(s => s.price_per_hour).filter((p: any) => p !== null && p !== undefined);
    return prices.length ? Math.min(...prices.map(Number)) : null;
  };

  // Filter + sort
  const filteredHelpanions = useMemo(() => {
    let filtered = helpanions.filter(h => {
      const q = directorySearchTerm.trim().toLowerCase();
      const matchesSearch =
        q === '' ||
        h.display_name?.toLowerCase().includes(q) ||
        h.bio?.toLowerCase().includes(q) ||
        h.services.some((s: any) =>
          s.title.toLowerCase().includes(q) ||
          (s.description?.toLowerCase() || '').includes(q)
        );

      const matchesCategory = selectedCategory === 'all' ||
        h.services.some((s: any) => s.category === selectedCategory);

      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'newest':
        filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price-low':
        filtered.sort((a: any, b: any) => {
          const aPrice = getMinPrice(a.services) ?? Number.POSITIVE_INFINITY;
          const bPrice = getMinPrice(b.services) ?? Number.POSITIVE_INFINITY;
          return aPrice - bPrice;
        });
        break;
      case 'price-high':
        filtered.sort((a: any, b: any) => {
          const aPrice = getMinPrice(a.services) ?? 0;
          const bPrice = getMinPrice(b.services) ?? 0;
          return bPrice - aPrice;
        });
        break;
    }

    return filtered;
  }, [helpanions, directorySearchTerm, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#111] font-futura">
      {/* Top site header stays as-is */}
      <HelpanionHeader onFilteredSearch={() => {}} />

      {/* Page intro */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="text-center pt-8 md:pt-10">
          <h1 className="text-3xl md:text-4xl font-futura-bold tracking-tight">Discover Helpanions</h1>
          <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Find the right helpanion to guide you with practical experience and real-world advice.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-xl bg-white border border-neutral-200 p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                value={directorySearchTerm}
                onChange={(e) => setDirectorySearchTerm(e.target.value)}
                placeholder="Search helpanions, services, or skills…"
                className="pl-9 h-10 rounded-lg border-neutral-300 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            {/* Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-10 w-full md:w-52 rounded-lg border-neutral-300 focus:ring-0">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === 'all' ? 'All categories' : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="h-10 w-full md:w-48 rounded-lg border-neutral-300 focus:ring-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results meta */}
        <div className="mt-4 mb-6">
          <p className="text-sm text-gray-600">
            {loading ? 'Loading…' : `${filteredHelpanions.length} helpanion${filteredHelpanions.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-16 text-gray-600">Loading helpanions…</div>
        ) : filteredHelpanions.length === 0 ? (
          <div className="text-center py-16 text-gray-600">No helpanions found matching your criteria.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredHelpanions.map((h: any) => {
              const minPrice = getMinPrice(h.services);
              const slug = h.username || h.user_id; // works with either route strategy

              return (
                <Card
                  key={h.id}
                  className="border border-neutral-200 bg-white rounded-2xl hover:shadow-md hover:border-neutral-300 transition"
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-neutral-100 flex items-center justify-center shrink-0">
                        {h.avatar_url ? (
                          <img
                            src={h.avatar_url}
                            alt={`${h.display_name}'s avatar`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-sm font-futura-bold text-neutral-700">
                            {getInitials(h.display_name || 'Helper')}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base md:text-lg font-futura-bold truncate">{h.display_name}</h3>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {h.bio || 'Helping through shared experience and practical insights.'}
                        </p>
                        {minPrice !== null && (
                          <p className="mt-2 text-sm text-neutral-800">
                            From <span className="font-futura-bold">₹{minPrice}</span> / hour
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Categories */}
                    {h.services?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {h.services.slice(0, 3).map((s: any, i: number) =>
                          s?.category ? (
                            <Badge key={i} variant="outline" className="text-xs border-neutral-300 text-neutral-700">
                              {s.category}
                            </Badge>
                          ) : null
                        )}
                        {h.services.length > 3 && (
                          <Badge variant="outline" className="text-xs border-neutral-300 text-neutral-700">
                            +{h.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* CTAs */}
                    <div className="mt-5 flex gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 h-9 rounded-lg border-neutral-800 text-neutral-900 hover:bg-neutral-900 hover:text-white"
                      >
                        <Link to={`/p/${slug}`} aria-label={`View ${h.display_name}'s profile`}>
                          View Profile
                        </Link>
                      </Button>
                      <Button
                        asChild
                        className="flex-1 h-9 rounded-lg text-white hover:opacity-90"
                        style={{ backgroundColor: PINE }}
                      >
                        <Link to={`/p/${slug}`} aria-label={`Book a session with ${h.display_name}`}>
                          Book Session
                          <ArrowRight className="ml-1 h-3.5 w-3.5" />
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

      <HelpanionFooter />
    </div>
  );
}
