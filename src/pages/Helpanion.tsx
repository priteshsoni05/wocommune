import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useHelpanions } from '@/hooks/useHelpanions';
import { HelpanionHeader } from '@/components/helpanion/HelpanionHeader';
import { FeaturedHelpanions } from '@/components/helpanion/FeaturedHelpanions';
import { TestimonialsSlider } from '@/components/helpanion/TestimonialsSlider';
import { HelpanionFooter } from '@/components/helpanion/HelpanionFooter';
import { SearchResultsModal } from '@/components/helpanion/SearchResultsModal';
import heroImage from '@/assets/hero-helpanion.jpg';

export default function Helpanion() {
  const { helpanions, loading } = useHelpanions();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Show modal immediately when user starts typing
    if (value.trim()) {
      setIsSearchModalOpen(true);
    } else {
      setIsSearchModalOpen(false);
    }
  };

  const handleSearchSubmit = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setSearchTerm(searchQuery);
      setIsSearchModalOpen(true);
    }
  };

  const handleFilteredSearch = (filters: string[]) => {
    // Redirect to helpanions directory page with filters
    if (filters.length > 0) {
      window.location.href = `/helpanions?filters=${encodeURIComponent(filters.join(','))}`;
    }
  };

  const scrollToFeatured = () => {
    document.getElementById('featured-helpanions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background font-futura">
      {/* Header */}
      <HelpanionHeader 
        onFilteredSearch={handleFilteredSearch}
      />

      {/* Search Results Modal */}
      <SearchResultsModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        searchTerm={searchTerm}
        helpanions={helpanions}
      />

      {/* Hero Section */}
      <section className="px-3 sm:px-4 py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Hero Image - Left Side */}
            <div className="order-2 lg:order-1">
              <div className="aspect-[4/3] sm:aspect-square lg:aspect-[4/3] w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto">
                <img 
                  src={heroImage} 
                  alt="Helpanion mentorship and guidance illustration" 
                  className="w-full h-full rounded-xl sm:rounded-2xl shadow-lg object-cover"
                />
              </div>
            </div>
            
            {/* Hero Text - Right Side */}
            <div className="order-1 lg:order-2 text-center lg:text-left px-2 sm:px-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-futura-bold text-foreground mb-3 sm:mb-4 leading-tight">
                Real people. Real conversations. Real guidance.
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                Find someone who's been there—and is here to help you walk your path.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start">
                <Button size="lg" className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium" asChild>
                  <Link to="/helpanions">Explore Helpanions</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <TestimonialsSlider />

      {/* Featured Helpanions */}
      <div id="featured-helpanions">
        <FeaturedHelpanions 
          helpanions={helpanions} 
          loading={loading} 
        />
      </div>

      {/* Footer */}
      <HelpanionFooter />
    </div>
  );
}