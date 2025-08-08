import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHero } from "@/components/public/ProfileHero";
import { AboutSection } from "@/components/public/AboutSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { ServiceBookingDialog } from "@/components/booking/ServiceBookingDialog";
import { Profile } from "@/hooks/useProfile";
import { Service } from "@/hooks/useServices";
import { AvailabilitySlot } from "@/hooks/useAvailabilitySlots";
// import { ReviewsSection } from "@/components/public/ReviewsSection"; // Uncomment if you have this

interface PublicProfileData {
  profile: Profile;
  services: Service[];
  availability: AvailabilitySlot[];
}

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [data, setData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!userId) {
        setError("Profile not found");
        setLoading(false);
        return;
      }

      try {
        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (profileError || !profile) throw profileError || new Error("No profile found");

        // Fetch active services
        const { data: services, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("helper_id", userId)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (servicesError || !services) throw servicesError || new Error("No services found");

        // Fetch availability slots
        const { data: availability, error: availabilityError } = await supabase
          .from("availability_slots")
          .select("*")
          .eq("helper_id", userId)
          .eq("is_available", true)
          .order("day_of_week", { ascending: true })
          .order("start_time", { ascending: true });

        if (availabilityError || !availability) throw availabilityError || new Error("No availability found");

        setData({
          profile: profile as Profile,
          services: services as Service[],
          availability: availability as AvailabilitySlot[],
        });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [userId]);

  const handleServiceBook = (service: Service) => {
    setSelectedService(service);
    setShowBookingDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Profile Not Found</h1>
          <p className="text-muted-foreground">{error || "This profile doesn't exist or is not available."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: Profile, About, Top Reviews & Ratings */}
          <div className="w-full lg:w-2/5 flex flex-col gap-6">
            <ProfileHero profile={data.profile} />
            <AboutSection profile={data.profile} />
            {/* Replace below with your actual reviews/ratings component */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Top Reviews & Ratings</h3>
              <div className="text-muted-foreground text-sm">
                {/* <ReviewsSection userId={userId!} /> */}
                (Reviews and ratings go here)
              </div>
            </div>
          </div>
          {/* Right column: Services */}
          <div className="w-full lg:w-3/5 flex flex-col gap-6">
            <ServicesSection
              services={data.services}
              helperId={userId as string}
              onServiceBook={handleServiceBook}
            />
            {/* Optionally, add <AvailabilitySection /> here if desired */}
          </div>
        </div>
      </div>

      {/* Service Booking Dialog */}
      {selectedService && (
        <ServiceBookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          service={selectedService}
          availability={data.availability}
          helperId={userId as string}
          helperName={data.profile.display_name || "Helper"}
        />
      )}
    </div>
  );
};

export default PublicProfile;