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
  price_min?: number | null;          // optional: cheapest service price
  average_rating?: number | null;     // optional
  sessions_completed?: number | null; // optional
};

const PINE = "#2C5F50";
const IMAGE_FALLBACK = "/assets/event-placeholder.jpg"; // if using Vite, place this under /public/assets/

const formatINR = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;

const safeInitials = (name?: string) => {
  if (!name) return "H";
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0]!)
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const shortText = (text?: string, max = 220) => {
  if (!text) return "";
  const t = text.trim().replace(/\s+/g, " ");
  return t.length > max ? `${t.slice(0, max - 3)}...` : t;
};

const getSlug = (h: Helpanion) => h.username || h.user_id || h.id;

function HelpanionAvatar({ name, src }: { name: string; src?: string | null }) {
  const [currentSrc, setCurrentSrc] = React.useState<string | undefined>(
    src || IMAGE_FALLBACK
  );

  const handleError = () => {
    // Try fallback once; if that also fails, show initials
    if (currentSrc && currentSrc !== IMAGE_FALLBACK) {
      setCurrentSrc(IMAGE_FALLBACK);
    } else {
      setCurrentSrc(undefined);
    }
  };

  return (
    <div className="w-24 h-24 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center border mb-4">
      {currentSrc ? (
        <img
          src={currentSrc}
          alt={`${name} avatar`}
          className="w-full h-full object-cover"
          onError={handleError}
        />
      ) : (
        <div className="text-lg font-semibold text-neutral-700">
          {safeInitials(name)}
        </div>
      )}
    </div>
  );
}

/**
 * FeaturedHelpanions
 * - Cards formatted to match the 'event' card rhythm (min-h matches events).
 * - Shows: avatar, name, short bio, optional price/rating, View Profile + Book Session buttons.
 */
const FeaturedHelpanions: React.FC<{ helpanions: Helpanion[] }> = ({ helpanions }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {helpanions.map((h) => {
          const name = h.display_name || "Helpanion";
          const bio = shortText(h.bio || "Ready to help you on your journey.", 260);
          const slug = encodeURIComponent(getSlug(h));
          const hasPrice = h.price_min != null;
          const hasRating = h.average_rating != null && Number.isFinite(Number(h.average_rating));
          const hasSessions = h.sessions_completed != null;

          return (
            <Card
              key={h.id}
              className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col h-full min-h-[420px]"
            >
              <CardContent className="flex flex-col items-center text-center p-6 flex-1">
                {/* Avatar */}
                <HelpanionAvatar name={name} src={h.avatar_url || undefined} />

                {/* Name */}
                <h3
                  className="font-semibold text-lg mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {name}
                </h3>

                {/* Optional meta row: price / rating / sessions */}
                {(hasPrice || hasRating || hasSessions) && (
                  <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-neutral-600 mb-3">
                    {hasPrice && (
                      <div className="px-3 py-1 rounded-md bg-neutral-100 text-sm">
                        From {formatINR(h.price_min as number)}
                      </div>
                    )}
                    {hasRating && (
                      <div className="px-3 py-1 rounded-md bg-neutral-100 text-sm">
                        ⭐ {Number(h.average_rating).toFixed(1)}
                      </div>
                    )}
                    {hasSessions && (
                      <div className="px-3 py-1 rounded-md bg-neutral-100 text-sm">
                        {h.sessions_completed === 1
                          ? "1 session"
                          : `${h.sessions_completed}+ sessions`}
                      </div>
                    )}
                  </div>
                )}

                {/* Bio */}
                <p
                  className="text-sm text-gray-600 mb-6 flex-1 leading-relaxed"
                  style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
                >
                  {bio}
                </p>

                {/* CTAs: stacked on mobile, side-by-side on md+ */}
                <div className="w-full mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* View Profile - outline */}
                  <Button asChild variant="outline" className="w-full h-10 font-medium">
                    <Link to={`/p/${slug}`} aria-label={`View ${name} profile`}>
                      View Profile
                    </Link>
                  </Button>

                  {/* Book Session - primary */}
                  <Button
                    asChild
                    className="w-full h-10 font-medium text-white"
                    style={{ backgroundColor: PINE }}
                  >
                    <Link
                      to={`/p/${slug}?action=book`}
                      aria-label={`Book a session with ${name}`}
                    >
                      Book Session
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {/* No "Explore all helpanions" here per your request - keep CTA in the WO Commune page */}
    </div>
  );
};

export default FeaturedHelpanions;
