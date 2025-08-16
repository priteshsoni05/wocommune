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
  services?: { price_per_hour?: number }[];
}

interface FeaturedHelpanionsProps {
  helpanions: Helpanion[];
}

const PINE = "#2C5F50";
const IMAGE_FALLBACK = "/assets/event-placeholder.jpg";

const FeaturedHelpanions: React.FC<FeaturedHelpanionsProps> = ({ helpanions }) => {
  const getMinPrice = (services: any[]) => {
    const prices = services
      ?.map((s: any) => s.price_per_hour)
      .filter((p: any) => p !== null && p !== undefined);
    return prices?.length ? Math.min(...prices.map(Number)) : null;
  };

  return (
    <section className="max-w-[1140px] mx-auto px-4 md:px-8 py-12">
      {/* Section heading */}
      <h2
        className="text-2xl font-bold mb-8 text-center"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Featured Helpanions
      </h2>

      {/* Responsive grid: 1 → 2 → 3 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {helpanions.map((helpanion) => {
          const name = helpanion.display_name || "Helpanion";
          const bio =
            (helpanion.bio || "Helping through shared experience and practical insights.").trim();
          const shortBio = bio.length > 120 ? `${bio.slice(0, 117)}...` : bio;
          const img = helpanion.avatar_url || IMAGE_FALLBACK;
          const minPrice = getMinPrice(helpanion.services || []);
          const slug = helpanion.id;

          return (
            <Card
              key={helpanion.id}
              className="bg-white border rounded-md shadow-sm overflow-hidden flex flex-col"
            >
              {/* Fixed-height image (aligned with Events cards) */}
              <img
                src={img}
                alt={`${name} avatar`}
                className="w-full h-48 object-cover"
              />

              {/* Content */}
              <CardContent className="flex flex-col flex-1 p-4">
                {/* Name */}
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {name}
                </h3>

                {/* Bio */}
                <p
                  className="text-gray-600 text-sm mb-3 flex-1"
                  style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
                >
                  {shortBio}
                </p>

                {/* Price */}
                {minPrice !== null && (
                  <p
                    className="text-sm text-neutral-700 mb-4"
                    style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
                  >
                    From <span className="font-semibold">₹{minPrice}</span> / hour
                  </p>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 mt-auto">
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 h-9 rounded-md border-gray-300 text-gray-800 hover:bg-gray-100"
                  >
                    <Link to={`/p/${slug}`}>View Profile</Link>
                  </Button>
                  <Button
                    asChild
                    className="flex-1 h-9 rounded-md text-white hover:opacity-90"
                    style={{ backgroundColor: PINE }}
                  >
                    <Link to={`/p/${slug}`}>
                      Book Session
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedHelpanions;
