import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ServiceBookingDialog } from "@/components/booking/ServiceBookingDialog";
import { Profile } from "@/hooks/useProfile";
import { Service } from "@/hooks/useServices";
import { AvailabilitySlot } from "@/hooks/useAvailabilitySlots";

interface PublicProfileData {
  profile: Profile;
  services: Service[];
  availability: AvailabilitySlot[];
}

const PINE = "#01796F"; // brand pine green

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
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-semibold">Profile Not Found</h1>
          <p className="text-sm text-gray-600">
            {error || "This profile doesn't exist or is not available."}
          </p>
          <Link
            to="/commune"
            className="inline-block mt-4 px-4 py-2 rounded-md text-white"
            style={{ backgroundColor: PINE }}
          >
            Back to WO Commune
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-black">
      {/* Sub-header */}
      <div className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-[1140px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          <div className="text-base md:text-lg font-semibold tracking-wide">WO COMMUNE</div>
          <button
            onClick={() => navigate("/commune")}
            className="px-4 py-2 rounded-md text-white font-medium"
            style={{ backgroundColor: PINE }}
          >
            Get Help
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1140px] mx-auto grid lg:grid-cols-12">
        {/* Sidebar */}
        <div className="lg:col-span-4 bg-white border-r border-gray-200">
          <div className="sticky top-0 p-8 space-y-6">
            {/* Profile Info */}
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4" style={{ borderColor: `${PINE}1A` }}>
                <img
                  src={data.profile.avatar_url || "/placeholder.svg"}
                  alt={data.profile.display_name || "Profile"}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                  {data.profile.display_name}
                  <svg className="w-5 h-5" style={{ color: PINE }} fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </h1>

                {data.profile.username && (
                  <div className="mt-1 text-sm text-gray-500">@{data.profile.username}</div>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Reviews</h3>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-600">4.9 (24 reviews)</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 pt-2">
              {data.profile.instagram_url && (
                <a href={data.profile.instagram_url} target="_blank" rel="noreferrer">
                  <img src="/icons/instagram.svg" alt="Instagram" className="w-6 h-6" />
                </a>
              )}
              {data.profile.linkedin_url && (
                <a href={data.profile.linkedin_url} target="_blank" rel="noreferrer">
                  <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-6 h-6" />
                </a>
              )}
              {data.profile.website_url && (
                <a href={data.profile.website_url} target="_blank" rel="noreferrer">
                  <img src="/icons/website.svg" alt="Website" className="w-6 h-6" />
                </a>
              )}
              {data.profile.portfolio_url && (
                <a href={data.profile.portfolio_url} target="_blank" rel="noreferrer">
                  <img src="/icons/portfolio.svg" alt="Portfolio" className="w-6 h-6" />
                </a>
              )}
            </div>

            {/* Book Now Button */}
            <button
              onClick={scrollToServices}
              className="w-full px-4 py-2 rounded-lg font-medium hover:opacity-90 transition text-white"
              style={{ backgroundColor: PINE }}
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Services Section */}
        <div className="lg:col-span-8 p-8">
          <div ref={servicesRef} className="mb-8">
            <h2 className="text-2xl font-bold">Services</h2>
          </div>

          <div className="space-y-6">
            {data.services.map((service) => (
              <div key={service.id} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-700 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">
                    ₹{service.price_per_hour} / {service.duration_minutes}min
                  </span>
                  <button
                    onClick={() => handleServiceBook(service)}
                    className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90"
                    style={{ backgroundColor: PINE }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
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
