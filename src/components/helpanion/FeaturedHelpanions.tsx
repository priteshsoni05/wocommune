import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Helpanion {
  id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}

interface FeaturedHelpanionsProps {
  helpanions: Helpanion[];
}

const PINE = "#01796F";

const FeaturedHelpanions: React.FC<FeaturedHelpanionsProps> = ({ helpanions }) => {
  return (
    <div className="space-y-6">
      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpanions.map((helpanion) => (
          <Card
            key={helpanion.id}
            className="border border-neutral-200 bg-white rounded-2xl hover:shadow-md hover:border-neutral-300 transition"
          >
            <CardContent className="p-5 flex flex-col h-full">
              {/* Profile header */}
              <div className="flex flex-col items-center text-center flex-1">
                <Avatar className="w-16 h-16 mb-4 border border-neutral-200 shadow-sm">
                  <AvatarImage src={helpanion.avatar_url} alt={helpanion.display_name} />
                  <AvatarFallback>
                    {helpanion.display_name?.charAt(0)?.toUpperCase() || "H"}
                  </AvatarFallback>
                </Avatar>

                <h3 className="text-base md:text-lg font-futura-bold mb-1">
                  {helpanion.display_name || "Helpanion"}
                </h3>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4 font-futura">
                  {helpanion.bio || "Helping through shared experience and practical insights."}
                </p>
              </div>

              {/* CTAs */}
              <div className="flex gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-lg border-neutral-800 text-neutral-900 hover:bg-neutral-900 hover:text-white font-futura"
                >
                  View Profile
                </Button>
                <Button
                  size="sm"
                  className="flex-1 rounded-lg text-white font-futura hover:opacity-90"
                  style={{ backgroundColor: PINE }}
                >
                  Book Session
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA below cards */}
      <div className="flex justify-end">
        <Button
          asChild
          className="rounded-lg text-white font-futura hover:opacity-90"
          style={{ backgroundColor: PINE }}
        >
          <Link to="/helpenions-directory">
            Explore all helpanions
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FeaturedHelpanions;
