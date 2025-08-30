import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Eye, Calendar, CheckCircle } from "lucide-react";

interface HelpanionProfile {
  id: string;
  user_id?: string;
  username?: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  skills?: string | null;
  services?: Array<{
    id: string;
    title: string;
    price_per_hour: number | null;
    category: string | null;
  }>;
  created_at?: string;
}

interface FeaturedHelpanionsProps {
  helpanions: HelpanionProfile[];
}

const getInitials = (name?: string | null) => {
  if (!name) return "H";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const formatPrice = (price?: number | null) => {
  if (!price) return "Contact for pricing";
  return `₹${new Intl.NumberFormat("en-IN").format(price)}/hr`;
};

const truncateText = (text?: string | null, maxLength = 120) => {
  if (!text) return "Ready to help you achieve your goals.";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

const HelpanionCard: React.FC<{ helpanion: HelpanionProfile }> = ({ helpanion }) => {
  const displayName = helpanion.display_name || "Helpanion";
  const minPrice = helpanion.services?.reduce((min, service) => {
    if (!service.price_per_hour) return min;
    return min === null ? service.price_per_hour : Math.min(min, service.price_per_hour);
  }, null as number | null);

  const skillsArray = helpanion.skills ? helpanion.skills.split(',').map(s => s.trim()).slice(0, 3) : [];

  const handleViewProfile = () => {
    if (helpanion.username) {
      // Use the correct route path that's defined in App.tsx
      window.location.href = `/p/${helpanion.username}`;
    }
  };

  const handleBookSession = () => {
    if (helpanion.username) {
      // Use the correct route path that's defined in App.tsx
      window.location.href = `/p/${helpanion.username}#services`;
    }
  };

  return (
    <Card className="group h-full hover:shadow-xl transition-all duration-300 border border-border/60 hover:border-primary/40 bg-white">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            {helpanion.avatar_url ? (
              <img
                src={helpanion.avatar_url}
                alt={`${displayName}'s avatar`}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                onError={(e) => {
                  const target = e.currentTarget;
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    target.style.display = 'none';
                    fallback.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div 
              className={`w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold ${helpanion.avatar_url ? 'hidden' : 'flex'}`}
            >
              {getInitials(displayName)}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: '#193232' }}></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">
                {displayName}
              </h3>
              <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#193232' }} />
            </div>
            {helpanion.services && helpanion.services.length > 0 && (
              <p className="text-secondary mb-2">
                {helpanion.services[0].category || "Professional Helper"}
              </p>
            )}
            <div className="flex items-center gap-2 text-secondary">
              <Clock className="w-4 h-4" />
              <span>Available now</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-secondary mb-4 flex-1 leading-relaxed">
          {truncateText(helpanion.bio)}
        </p>

        {/* Skills Tags */}
        {skillsArray.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skillsArray.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-caption px-2 py-1">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {/* Rating & Stats */}
        <div className="flex items-center gap-4 mb-4 text-secondary">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">4.9</span>
            <span>(24)</span>
          </div>
          <span>•</span>
          <span>87 sessions</span>
        </div>

        {/* Pricing */}
        <div className="mb-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-secondary">Starting from</span>
            <span className="font-semibold text-primary">
              {formatPrice(minPrice)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 mt-auto">
          <Button
            onClick={handleViewProfile}
            variant="outline"
            className="w-full gap-2 hover:bg-primary/5 border-primary/20"
            disabled={!helpanion.username}
          >
            <Eye className="w-4 h-4" />
            View Profile
          </Button>
          <Button
            onClick={handleBookSession}
            className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!helpanion.username}
          >
            <Calendar className="w-4 h-4" />
            Book Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturedHelpanions: React.FC<FeaturedHelpanionsProps> = ({ helpanions }) => {
  if (helpanions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3>No Helpanions Available</h3>
        <p className="text-secondary">Check back soon for featured helpers!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {helpanions.map((helpanion) => (
        <HelpanionCard key={helpanion.id} helpanion={helpanion} />
      ))}
    </div>
  );
};

export default FeaturedHelpanions;