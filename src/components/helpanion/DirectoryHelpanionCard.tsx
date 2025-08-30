import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowUpRight } from "lucide-react";

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

interface DirectoryHelpanionCardProps {
  helpanion: HelpanionProfile;
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

const truncateText = (text?: string | null, maxLength = 100) => {
  if (!text) return "Ready to help you achieve your goals.";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

export const DirectoryHelpanionCard: React.FC<DirectoryHelpanionCardProps> = ({ helpanion }) => {
  const displayName = helpanion.display_name || "Helpanion";
  const skillsArray = helpanion.skills ? helpanion.skills.split(',').map(s => s.trim()).slice(0, 3) : [];

  const handleViewProfile = () => {
    if (helpanion.username) {
      window.location.href = `/p/${helpanion.username}`;
    }
  };

  return (
    <Card className="group h-full hover:shadow-lg transition-all duration-300 border border-border/30 hover:border-primary/30 bg-white relative">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Avatar */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          {helpanion.avatar_url ? (
            <img
              src={helpanion.avatar_url}
              alt={`${displayName}'s avatar`}
              className="w-20 h-20 rounded-full object-cover"
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
            className={`w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg ${helpanion.avatar_url ? 'hidden' : 'flex'}`}
          >
            {getInitials(displayName)}
          </div>
        </div>

        {/* Name with Verification */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <h3 className="font-semibold text-foreground text-lg text-center">
            {displayName}
          </h3>
          <CheckCircle className="w-5 h-5 shrink-0" style={{ color: '#193232' }} />
        </div>

        {/* Bio */}
        <p className="text-muted-foreground text-sm text-center mb-4 leading-relaxed flex-1">
          {truncateText(helpanion.bio)}
        </p>

        {/* Expertise Tags */}
        {skillsArray.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {skillsArray.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs px-3 py-1 bg-primary/10 text-primary border-primary/20"
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}

        {/* View Profile Link */}
        <button
          onClick={handleViewProfile}
          disabled={!helpanion.username}
          className="absolute bottom-4 right-4 flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          View Profile
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </CardContent>
    </Card>
  );
};