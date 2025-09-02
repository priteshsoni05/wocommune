import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useRef } from 'react';

interface Testimonial {
  id: string;
  rating: number;
  quote: string;
  name: string;
  field: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    rating: 5,
    quote: 'Exactly the clarity I needed before applying to NIFT.',
    name: 'Tanya',
    field: 'Fashion Aspirant'
  },
  {
    id: '2',
    rating: 4,
    quote: 'It felt like talking to a wiser version of myself.',
    name: 'Anonymous',
    field: 'First-time Founder'
  },
  {
    id: '3',
    rating: 5,
    quote: 'Walked away feeling supported and clear.',
    name: 'Neeraj',
    field: 'Product Analyst'
  },
  {
    id: '4',
    rating: 4,
    quote: 'A very warm and thoughtful conversation.',
    name: 'Riya',
    field: 'Freelance Designer'
  },
  {
    id: '5',
    rating: 5,
    quote: "Didn't expect to find this level of care.",
    name: 'Aditya',
    field: 'Dropout exploring startups'
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export function TestimonialsSlider({ compact = false }: { compact?: boolean }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  return (
    <section className={compact ? "py-6 bg-muted/10 border-y" : "py-16 bg-muted/20"}>
      <div className="max-w-7xl mx-auto px-4">
        {!compact && (
          <div className="text-center mb-12">
          <h2 className="text-3xl font-body font-semibold text-foreground mb-4">
              Voices from our Community
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real experiences from seekers who found guidance through WO Commune
            </p>
          </div>
        )}
        
        <Carousel
          ref={carouselRef}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="bg-background rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow duration-200 h-full">
                  <StarRating rating={testimonial.rating} />
                  <blockquote className="text-foreground mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="mt-auto">
                    <div className="font-semibold text-foreground">— {testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.field}</div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </section>
  );
}