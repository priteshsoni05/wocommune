import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Helpanion {
  id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}

interface FeaturedHelpanionsProps {
  helpanions: Helpanion[];
}

const FeaturedHelpanions: React.FC<FeaturedHelpanionsProps> = ({ helpanions }) => {
  const fetchHelpanions = async () => {
    // This component now receives helpanions as props instead of fetching

  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {helpanions.map((helpanion) => (
        <Card key={helpanion.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-16 h-16 mb-4">
                <AvatarImage src={helpanion.avatar_url} alt={helpanion.display_name} />
                <AvatarFallback>
                  {helpanion.display_name?.charAt(0)?.toUpperCase() || "H"}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg mb-2">
                {helpanion.display_name || "Helpanion"}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3">
                {helpanion.bio || "Ready to help you on your journey."}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeaturedHelpanions;
