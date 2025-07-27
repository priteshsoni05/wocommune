import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useHelpanions } from '@/hooks/useHelpanions';
import { HelpanionHeader } from '@/components/helpanion/HelpanionHeader';
import { FeaturedHelpanions } from '@/components/helpanion/FeaturedHelpanions';
import { TestimonialsSlider } from '@/components/helpanion/TestimonialsSlider';
import { HelpanionFooter } from '@/components/helpanion/HelpanionFooter';

export default function Helpanion() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHelpanions, setFilteredHelpanions] = useState<any[]>([]);
  
  const { helpanions, loading } = useHelpanions();

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
        onSearchChange={setSearchTerm}
        onFilteredSearch={handleFilteredSearch}
      />

      {/* Hero Section */}
      <section className="px-4 py-20 text-center bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            Real people. Real conversations. Real guidance.
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Find someone who's been there—and is here to help you walk your path.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" onClick={scrollToFeatured}>
              Explore Helpanions
            </Button>
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