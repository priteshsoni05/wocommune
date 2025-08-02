import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHelpanions } from '@/hooks/useHelpanions';
import { HelpanionHeader } from '@/components/helpanion/HelpanionHeader';
import { FeaturedHelpanions } from '@/components/helpanion/FeaturedHelpanions';
import { TestimonialsSlider } from '@/components/helpanion/TestimonialsSlider';
import { HelpanionFooter } from '@/components/helpanion/HelpanionFooter';
import heroImage from '@/assets/hero-sketch.jpg';

export default function Helpanion() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHelpanions, setFilteredHelpanions] = useState<any[]>([]);
  
  const { helpanions, loading } = useHelpanions();

  // Handle direct search input changes
  const handleSearchChange = (value: string) => {
    console.log('Search term changed:', value);
    console.log('Total helpanions:', helpanions.length);
    setSearchTerm(value);
    
    if (!value.trim()) {
      console.log('Empty search, clearing filtered results');
      setFilteredHelpanions([]);
      return;
    }

    // Filter helpanions based on search term
    const filtered = helpanions.filter(helpanion => {
      const searchLower = value.toLowerCase();
      
      // Check if search matches bio, display name, or services
      const matchesName = helpanion.display_name?.toLowerCase().includes(searchLower);
      const matchesBio = helpanion.bio?.toLowerCase().includes(searchLower);
      const matchesServices = helpanion.services?.some(service => 
        service.title?.toLowerCase().includes(searchLower) ||
        service.description?.toLowerCase().includes(searchLower) ||
        service.category?.toLowerCase().includes(searchLower)
      );
      
      const matches = matchesName || matchesBio || matchesServices;
      if (matches) {
        console.log('Match found:', helpanion.display_name, { matchesName, matchesBio, matchesServices });
      }
      
      return matches;
    });
    
    console.log('Filtered results:', filtered.length, filtered.map(h => h.display_name));
    setFilteredHelpanions(filtered);
  };

  const handleFilteredSearch = (filters: string[]) => {
    if (filters.length === 0) {
      setFilteredHelpanions([]);
      return;
    }

    const filtered = helpanions.filter(helpanion => {
      return filters.some(filter => {
        // Check if filter matches bio, services, or categories
        const matchesBio = helpanion.bio?.toLowerCase().includes(filter.toLowerCase());
        const matchesServices = helpanion.services.some(service => 
          service.title?.toLowerCase().includes(filter.toLowerCase()) ||
          service.description?.toLowerCase().includes(filter.toLowerCase()) ||
          service.category?.toLowerCase().includes(filter.toLowerCase())
        );
        return matchesBio || matchesServices;
      });
    });
    
    setFilteredHelpanions(filtered);
  };

  const scrollToFeatured = () => {
    document.getElementById('featured-helpanions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HelpanionHeader 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onFilteredSearch={handleFilteredSearch}
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-foreground mb-3 sm:mb-4 leading-tight">
                Real people. Real conversations. Real guidance.
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                Find someone who's been there—and is here to help you walk your path.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start">
                <Button size="lg" className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium" onClick={scrollToFeatured}>
                  Explore Helpanions
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
          helpanions={filteredHelpanions.length > 0 ? filteredHelpanions : helpanions} 
          loading={loading} 
        />
      </div>

      {/* Footer */}
      <HelpanionFooter />
    </div>
  );
}