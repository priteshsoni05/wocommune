import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, IndianRupee } from "lucide-react";
import { Service } from "@/hooks/useServices";

interface ServicesSectionProps {
  services: Service[];
  helperId: string;
  onServiceBook: (service: Service) => void;
}

export const ServicesSection = ({ services, helperId, onServiceBook }: ServicesSectionProps) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const formatPrice = (pricePerHour: number | null, durationMinutes: number) => {
    if (!pricePerHour) return 'Contact for pricing';
    const hourlyRate = pricePerHour;
    const sessionPrice = (hourlyRate * durationMinutes) / 60;
    return `₹${sessionPrice.toFixed(0)}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'career': 'bg-blue-100 text-blue-800',
      'business': 'text-white',
      'personal': 'bg-purple-100 text-purple-800',
      'education': 'bg-orange-100 text-orange-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  if (services.length === 0) {
    return (
      <section className="py-12 border-b border-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Services Offered</h2>
          <p className="text-muted-foreground">No services available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 border-b border-border">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-foreground text-center">Services Offered</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  {service.category && (
                    <Badge className={`text-xs ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(service.duration_minutes || 60)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <IndianRupee className="w-4 h-4" />
                    <span className="font-medium">
                      {formatPrice(service.price_per_hour, service.duration_minutes || 60)}
                    </span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => onServiceBook(service)}
                >
                  Book this service
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};