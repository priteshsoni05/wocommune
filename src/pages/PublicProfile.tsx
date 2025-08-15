// src/pages/PublicProfile.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ServiceBookingDialog } from "@/components/booking/ServiceBookingDialog";
import { Profile } from "@/hooks/useProfile";
import { Service } from "@/hooks/useServices";
import { AvailabilitySlot } from "@/hooks/useAvailabilitySlots";
import { FaInstagram, FaLinkedin, FaGlobe, FaFolderOpen } from "react-icons/fa";
import { CheckCircle } from "lucide-react";

interface PublicProfileData {
  profile: Profile;
  services: Service[];
  availability: AvailabilitySlot[];
}

const PINE = "#01796F";

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!username) {
        setError("Profile not found");
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .maybeSingle();

        if (profileError || !profile) throw profileError || new Error("No profile found");

        const { data: services, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("helper_id", profile.user_id)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (servicesError) throw servicesError;

        const { data: availability, error: availabilityError } = await supabase
          .from("availability_slots")
          .select("*")
          .eq("helper_id", profile.user_id)
          .eq("is_available", true)
          .order("day_of_week", { ascending: true })
          .order("start_time", { ascending: true });

        if (availabilityError) throw availabilityError;

        setData({
          profile: profile as Profile,
          services: (services || []) as Service[],
          availability: (availability || []) as AvailabilitySlot[],
        });
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [username]);

  const handleServiceBook = (service: Service) => {
    setSelectedService(service);
    setShowBookingDialog(true);
  };

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-xl font-semibold">Profile Not Found</h1>
        <Link
          to="/commune"
          className="mt-3 px-4 py-2 rounded-md text-white"
          style={{ backgroundColor: PINE }}
        >
          Back to WO Commune
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <div className="w-full border-b bg-white">
        <div className="max-w-[1140px] mx-auto flex justify-between items-center px-4 py-3">
          <div className="font-semibold">WO COMMUNE</div>
          <button
            onClick={() => navigate("/commune")}
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: PINE }}
          >
            Get Help
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1140px] mx-auto grid lg:grid-cols-12 gap-6 px-4 py-8">
        {/* Sidebar */}
        <aside className="lg:col-span-4 bg-white border rounded-lg p-6 space-y-6">
          <div className="text-center">
            <img
              src={data.profile.avatar_url || "/placeholder.svg"}
              alt={data.profile.display_name || "Profile"}
              className="w-28 h-28 mx-auto rounded-full border object-cover"
            />
            <h1 className="mt-3 text-xl font-bold flex items-center justify-center gap-2">
              {data.profile.display_name}
              <CheckCircle className="text-green-600 w-5 h-5" />
            </h1>
            {data.profile.role && (
              <p className="text-sm">{data.profile.role}</p>
            )}
          </div>

          {/* Expertise */}
          {data.profile.skills && (
            <div>
              <h3 className="text-sm font-medium mb-2">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {data.profile.skills.split(",").slice(0, 5).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs rounded-full bg-gray-100"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="text-center">
            <p className="text-sm">
              ⭐ 4.9 (24 reviews) • 87 sessions completed
            </p>
          </div>

          {/* Social icons */}
          <div className="flex gap-4 justify-center">
            {data.profile.instagram_url && (
              <a href={data.profile.instagram_url} target="_blank" rel="noreferrer">
                <FaInstagram className="w-5 h-5" />
              </a>
            )}
            {data.profile.linkedin_url && (
              <a href={data.profile.linkedin_url} target="_blank" rel="noreferrer">
                <FaLinkedin className="w-5 h-5" />
              </a>
            )}
            {data.profile.website_url && (
              <a href={data.profile.website_url} target="_blank" rel="noreferrer">
                <FaGlobe className="w-5 h-5" />
              </a>
            )}
            {data.profile.portfolio_url && (
              <a href={data.profile.portfolio_url} target="_blank" rel="noreferrer">
                <FaFolderOpen className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* About */}
          {data.profile.bio && (
            <div>
              <h3 className="text-sm font-medium mb-1">About</h3>
              <p className="text-sm">{data.profile.bio}</p>
            </div>
          )}
        </aside>

        {/* Services */}
        <main className="lg:col-span-8" ref={servicesRef}>
          <h2 className="text-2xl font-bold mb-6">Services</h2>
          <div className="space-y-6">
            {data.services.map((service) => (
              <div
                key={service.id}
                className="bg-white border rounded-lg p-5 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <p className="text-sm mt-1">{service.description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-lg font-bold">₹{service.price_per_hour}</p>
                  <button
                    onClick={() => handleServiceBook(service)}
                    className="mt-2 px-3 py-1 rounded-md text-white text-sm"
                    style={{ backgroundColor: PINE }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <button
          onClick={scrollToServices}
          className="w-full py-3 rounded-lg font-medium text-white"
          style={{ backgroundColor: PINE }}
        >
          Book a Session
        </button>
      </div>

      {/* Booking Dialog */}
      {selectedService && (
        <ServiceBookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          service={selectedService}
          availability={data.availability}
          helperId={data.profile.user_id}
          helperName={data.profile.display_name || "Helper"}
        />
      )}
    </div>
  );
};

export default PublicProfile;
