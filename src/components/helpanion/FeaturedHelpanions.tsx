import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

type Helpanion = {
  id: string;
  display_name?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
};

type Props = {
  helpanions: Helpanion[];
};

const PINE = "#01796F"; // Matches WOCommune CTA color
const AVATAR_FALLBACK = ""; // keep empty to show initials when no avatar

function getInitial(name: string) {
  const n = (name || "").trim();
  return n ? n[0].toUpperCase() : "H";
}

function HelpanionCard({ helpanion }: { helpanion: Helpanion }) {
  const name = (helpanion.display_name || "Helpanion").trim();
  const bio =
    (helpanion.bio?.trim() ||
      "Helping through shared experience and practical insights.") as string;

  const shortBio = bio.length > 280 ? `${bio.slice(0, 277)}...` : bio;
  const img = helpanion.avatar_url || AVATAR_FALLBACK;
  const showInitials = !img;

  // Card shell matches the cards below (border, rounded, shadow, overflow-hidden, flex h-full)
  return (
    <div className="bg-white border rounded-md shadow-sm overflow-hidden flex flex-col h-full">
      {/* Content block (centered) */}
      <div className="p-6 flex flex-col items-center text-center flex-1">
        {/* Circular avatar */}
        {showInitials ? (
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-semibold mb-4"
            style={{ backgroundColor: "#D1D5DB" }}
            aria-label={`${name} avatar placeholder`}
          >
            {getInitial(name)}
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border border-gray-200">
            <img src={img} alt={`${name} avatar`} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Name */}
        <h3 className="text-base md:text-lg font-semibold mb-2">{name}</h3>

        {/* Bio */}
        <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">{shortBio}</p>

        {/* Full-width CTA anchored to bottom */}
        <button
          className="w-full px-4 py-2 rounded-md text-sm font-medium text-white mt-auto"
          style={{ backgroundColor: PINE }}
          onClick={() => {
            // TODO: wire up when profile route exists, e.g.:
            // navigate(`/helpanions/${helpanion.id}`)
          }}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

export default function FeaturedHelpanions({ helpanions }: Props) {
  if (!helpanions?.length) {
    return <div className="text-center text-gray-500 text-sm">No helpanions to show yet.</div>;
  }

  return (
    <div className="w-full">
      {/* Grid matches the layout of the cards below */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {helpanions.map((h) => (
          <HelpanionCard key={h.id} helpanion={h} />
        ))}
      </div>

      {/* Restore Explore all helpanions CTA (right aligned) */}
      <div className="flex justify-end mt-6">
        <Link
          to="/helpanions"
          className="inline-flex items-center px-5 py-2 rounded-md font-semibold text-white"
          style={{ backgroundColor: PINE }}
        >
          Explore all helpanions
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}