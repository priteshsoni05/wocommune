import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
const IMAGE_FALLBACK = "/assets/event-placeholder.jpg";

const FeaturedHelpanions: React.FC<FeaturedHelpanionsProps> = ({ helpanions }) => {
  return (
    <div className="space-y-6">
      {/* Cards grid (match size/layout shown in image) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {helpanions.map((helpanion) => {
          const name = helpanion.display_name || "Helpanion";
          const bio =
            (helpanion.bio || "Helping through shared experience and practical insights.").trim();
          const shortBio = bio.length > 160 ? `${bio.slice(0, 157)}...` : bio;
          const img = helpanion.avatar_url || IMAGE_FALLBACK;

          return (
            <Card
              key={helpanion.id}
              className="bg-white border rounded-md shadow-sm overflow-hidden flex flex-col h-full"
            >
              {/* Tall image area */}
              <img
                src={img}
                alt={`${name} avatar`}
                className="w-full h-48 object-cover"
              />

              {/* Content */}
              <CardContent className="p-4 flex flex-col flex-1">
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {name}
                </h3>
                <p
                  className="text-gray-600 text-sm mb-4 flex-1"
                  style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
                >
                  {shortBio}
                </p>

                {/* Full-width primary CTA anchored at bottom */}
                <Button
                  className="w-full text-white font-medium"
                  style={{ backgroundColor: PINE }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CTA below cards */}
      <div className="flex justify-end">
        <Button
          asChild
          className="rounded-lg text-white font-[Source_Sans_Pro] hover:opacity-90"
          style={{ backgroundColor: PINE }}
        >
          <Link to="/helpanions">
            Explore all helpanions
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FeaturedHelpanions;