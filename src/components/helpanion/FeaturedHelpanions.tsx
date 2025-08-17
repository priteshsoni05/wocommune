import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Helpanion = {
  id: string;
  user_id?: string;
  username?: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  price_min?: number | null;
  average_rating?: number | null;
  sessions_completed?: number | null;
};

const PINE = "#2C5F50";
const IMAGE_FALLBACK = "/assets/event-placeholder.jpg";

const shortText = (text?: string, max = 220) => {
  if (!text) return "";
  const t = text.trim();
  return t.length > max ? `${t.slice(0, max - 3)}...` : t;
};

const initials = (name?: string) => {
  if (!name) return "H";
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const FeaturedHelpanions: React.FC<{ helpanions: Helpanion[] }> = ({ helpanions }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {helpanions.map((h) => {
          const name = h.display_name || "Helpanion";
          const bio = shortText(h.bio || "Ready to help you on your journey.", 260);
          const img = h.avatar_url || IMAGE_FALLBACK;

          // Only use username for the public profile route
          const username = h.username?.trim() || "";
          const hasUsername = username.length > 0;
          const profilePath = hasUsername ? `/${encodeURIComponent(username)}` : "";

          return (
            <Card
              key={h.id}
              className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col h-full min-h-[420px]"
            >
              <CardContent className="flex flex-col items-center text-center p-6 flex-1">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center border mb-4">
                  {h.avatar_url ? (
                    <img
                      src={img}
                      alt={`${name} avatar`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                        const parent = (e.currentTarget as HTMLImageElement).parentElement;
                        if (parent) {
                          const fallback = document.createElement("div");
                          fallback.textContent = initials(name);
                          fallback.className = "text-lg font-semibold text-neutral-700";
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="text-lg font-semibold text-neutral-700">{initials(name)}</div>
                  )}
                </div>

                {/* Name */}
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {name}
                </h3>

                {/* Bio */}
                <p
                  className="text-sm text-gray-600 mb-6 flex-1 leading-relaxed"
                  style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
                >
                  {bio}
                </p>

                {/* CTAs */}
                <div className="w-full mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* View Profile - must point to /:username */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-10 font-medium"
                    disabled={!hasUsername}
                    aria-disabled={!hasUsername}
                  >
                    {hasUsername ? (
                      <Link to={profilePath} aria-label={`View ${name} profile`}>
                        View Profile
                      </Link>
                    ) : (
                      <span>View Profile</span>
                    )}
                  </Button>

                  {/* Book Session - popup to be implemented later */}
                  <Button
                    className="w-full h-10 font-medium text-white"
                    style={{ backgroundColor: PINE }}
                    onClick={() => {
                      // TODO: open booking popup later
                    }}
                    aria-label={`Book a session with ${name}`}
                  >
                    Book Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedHelpanions;
