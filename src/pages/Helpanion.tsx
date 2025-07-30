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
      <section className="px-4 py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Hero Image - Left Side */}
            <div className="order-2 lg:order-1">
              <img 
                src={heroImage} 
                alt="Helpanion mentorship and guidance illustration" 
                className="w-full max-w-lg mx-auto rounded-2xl shadow-xl object-cover"
              />
            </div>
            
            {/* Hero Text - Right Side */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
                Real people. Real conversations. Real guidance.
              </h1>
              <p className="text-base text-muted-foreground mb-6 leading-relaxed">
                Find someone who's been there—and is here to help you walk your path.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button size="lg" className="px-6 py-2.5 text-sm font-medium" onClick={scrollToFeatured}>
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