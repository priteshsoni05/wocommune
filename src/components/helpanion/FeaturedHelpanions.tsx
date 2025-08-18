import React from "react";
import { Link } from "react-router-dom";

type Helpanion = {
  id: string;
  username?: string | null;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  average_rating?: number | null;
  rating?: number | null;
  created_at?: string | null;
};

type Props = {
  helpanions: Helpanion[];
};

const PINE = "#2C5F50";

export default function FeaturedHelpanions({ helpanions }: Props) {
  if (!helpanions || helpanions.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {helpanions.map((h) => {
        // Prefer username for public profile route; fallback to id
        const slug = (h.username || "").trim();
        const profileUrl = slug
          ? `/helpanions/${encodeURIComponent(slug)}`
          : `/helpanions/${encodeURIComponent(h.id)}`;

        return (
          <article
            key={h.id}
            className="bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col"
          >
            <div className="h-44 w-full bg-gray-100 overflow-hidden">
              {h.avatar_url ? (
                <img
                  src={h.avatar_url}
                  alt={`${h.display_name || "Helpanion"} avatar`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No photo
                </div>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <h3
                className="text-xl font-semibold"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {h.display_name || "Helpanion"}
              </h3>
              {h.bio && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {h.bio}
                </p>
              )}

              <div className="mt-auto pt-4">
                <Link
                  to={profileUrl}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-md text-white font-medium hover:opacity-90"
                  style={{ backgroundColor: PINE }}
                  aria-label={`View profile of ${h.display_name || "Helpanion"}`}
                >
                  View profile
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
