import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import FeaturedHelpanions from "@/components/FeaturedHelpanions";

const WOCommunePage = () => {
  const [helpanions, setHelpanions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHelpanions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("helponions")
        .select("id, name, bio, profile_image");

      if (error) {
        console.error("Error fetching Helpanions:", error);
      } else {
        setHelpanions(data || []);
      }
      setLoading(false);
    };

    fetchHelpanions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-8 text-center">
        Featured Helpanions
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <FeaturedHelpanions helpanions={helpanions} />
      )}
    </div>
  );
};

export default WOCommunePage;
