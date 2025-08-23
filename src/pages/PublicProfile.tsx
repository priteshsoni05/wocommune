
// src/pages/PublicProfile.tsx
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ServiceBookingDialog } from "@/components/booking/ServiceBookingDialog";
import { Profile } from "@/hooks/useProfile";
import { Service } from "@/hooks/useServices";
import { AvailabilitySlot } from "@/hooks/useAvailabilitySlots";
import { Instagram, Linkedin, Globe, FolderOpen, CheckCircle } from "lucide-react";

interface PublicProfileData {
  profile: Profile;
  services: Service[];
  availability: AvailabilitySlot[];
}

const PINE = "#01796F";
const TEXT = "#111111";

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

      console.log("PublicProfile: Fetching profile for username:", username);

      try {
        // Use the working query pattern from WOCommune/useHelpanions
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(`
            *,
            services!left(
              id,
              title,
              description,
              price_per_hour,
              duration_minutes,
              category,
              is_active
            )
          `)
          .eq("username", username)
          .eq("status", "active")
          .maybeSingle();

        console.log("Profile query result:", { profile, profileError });

        if (profileError) {
          console.error("Profile error:", profileError);
          throw profileError;
        }

        if (!profile) {
          console.log("No profile found for username:", username);
          throw new Error("No profile found");
        }

        // Check if profile is active and has username
        if (profile.status !== 'active' || !profile.username) {
          console.log("Profile not active or missing username:", { status: profile.status, username: profile.username });
          throw new Error("Profile not available");
        }

        console.log("Profile found:", profile);

        // Use services from the joined query instead of separate fetch
        const services = Array.isArray(profile.services) 
          ? profile.services.filter(s => s.is_active) 
          : [];

        console.log("Services found:", services);

        // Fetch availability
        const { data: availability, error: availabilityError } = await supabase
          .from("availability_slots")
          .select("*")
          .eq("helper_id", profile.user_id)
          .eq("is_available", true)
          .order("day_of_week", { ascending: true })
          .order("start_time", { ascending: true });

        if (availabilityError) {
          console.error("Availability error:", availabilityError);
          // Don't throw here, just log and continue with empty availability
        }

        console.log("Availability found:", availability);

        setData({
          profile: profile as Profile,
          services: (services || []) as Service[],
          availability: (availability || []) as AvailabilitySlot[],
        });
      } catch (err) {
        console.error("Failed to load profile:", err);
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
      <div className="min-h-screen flex items-center justify-center" style={{ color: TEXT }}>
        Loading profile...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ color: TEXT }}>
        <h1 className="text-xl font-semibold">Profile Not Found</h1>
        <p className="text-sm text-gray-500 mt-2">Username: {username}</p>
        <p className="text-sm text-gray-500">Error: {error}</p>
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
      {/* Header — simple, like WO Commune page */}
      <div className="w-full border-b bg-white">
        <div className="w-full mx-auto flex justify-between items-center px-4 md:px-6 py-3">
          <div className="font-semibold tracking-wide" style={{ color: TEXT }}>
            WO COMMUNE
          </div>
          <button
            onClick={() => navigate("/commune")}
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: PINE }}
          >
            Get Help
          </button>
        </div>
      </div>

      {/* Main grid (full-width, minimal breathing on sides) */}
      <div className="w-full mx-auto grid lg:grid-cols-12 gap-0 px-4 md:px-6">
        {/* Sidebar */}
        <aside className="lg:col-span-4 bg-white border-r border-gray-200 p-6 lg:min-h-[calc(100vh-56px)]">
          <div className="text-center space-y-3" style={{ color: TEXT }}>
            <img
              src={data.profile.avatar_url || "/placeholder.svg"}
              alt={data.profile.display_name || "Profile"}
              className="w-28 h-28 mx-auto rounded-full border-4 border-[#E6EDEB] object-cover"
            />
            <h1 className="text-xl font-bold flex items-center justify-center gap-1">
              {data.profile.display_name}
              <CheckCircle size={18} color={PINE} aria-label="Verified" />
            </h1>
            <p className="text-sm">
              I help with {data.profile.role || "Professional Services"}
            </p>
          </div>

          {/* Expertise */}
          {data.profile.skills && (
            <div className="mt-6" style={{ color: TEXT }}>
              <h3 className="text-sm font-medium mb-2">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {data.profile.skills
                  .split(",")
                  .slice(0, 5)
                  .map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs rounded-full border"
                      style={{ borderColor: "#D1D5DB", color: TEXT, backgroundColor: "#FFFFFF" }}
                    >
                      {skill.trim()}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="mt-6" style={{ color: TEXT }}>
            <h3 className="text-sm font-medium mb-1">Reviews</h3>
            <p className="text-sm">★ 4.9 (24 reviews) • 87 sessions completed</p>
          </div>

          {/* Social icons (just below reviews) */}
          <div className="mt-3 flex items-center justify-start gap-3" style={{ color: TEXT }}>
            {data.profile.instagram_url && (
              <a href={data.profile.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Instagram size={18} />
              </a>
            )}
            {data.profile.linkedin_url && (
              <a href={data.profile.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            )}
            {data.profile.website_url && (
              <a href={data.profile.website_url} target="_blank" rel="noreferrer" aria-label="Website">
                <Globe size={18} />
              </a>
            )}
            {data.profile.portfolio_url && (
              <a href={data.profile.portfolio_url} target="_blank" rel="noreferrer" aria-label="Portfolio">
                <FolderOpen size={18} />
              </a>
            )}
          </div>

          {/* About */}
          {data.profile.bio && (
            <div className="mt-6" style={{ color: TEXT }}>
              <h3 className="text-sm font-medium mb-2">About</h3>
              <p className="text-sm leading-relaxed">{data.profile.bio}</p>
            </div>
          )}
        </aside>

        {/* Main Content — Services only */}
        <main className="lg:col-span-8 p-6" style={{ color: TEXT }}>
          <div ref={servicesRef}>
            <h2 className="text-2xl font-bold mb-6">Services</h2>

            <div className="space-y-6">
              {data.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                      <p className="text-sm mt-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-base font-semibold">₹{service.price_per_hour}</div>
                      <button
                        onClick={() => handleServiceBook(service)}
                        className="mt-2 inline-flex items-center justify-center rounded-md text-white text-sm px-3 py-1.5"
                        style={{ backgroundColor: PINE }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {data.services.length === 0 && (
                <div className="text-sm">No services published yet.</div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sticky CTA */}
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
