// src/pages/PublicProfile.tsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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

const PublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!username) {
        setError("Profile not found");
        setLoading(false);
        return;
      }

      try {
        // Profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .maybeSingle();

        if (profileError || !profile) throw profileError || new Error("No profile found");

        // Services
        const { data: services, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("helper_id", profile.user_id)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (servicesError) throw servicesError;

        // Availability
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
      } catch (err) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">{error || "Profile not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Sub Header */}
      <div className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="text-xl font-bold tracking-tight">WO COMMUNE</div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
            Get Help
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-0">
        {/* Left Sidebar */}
        <div className="lg:col-span-4 border-r border-gray-200 bg-gray-50 p-6">
          <div className="sticky top-6 space-y-6">
            {/* Profile Info */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-100">
                <img
                  src={data.profile.avatar_url || "/placeholder.svg"}
                  alt={data.profile.display_name || "Profile"}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="mt-4 text-2xl font-bold">{data.profile.display_name}</h1>
              <p className="text-gray-500">I help with {data.profile.role || "services"}</p>
            </div>

            {/* Skills */}
            {data.profile.skills && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700">Expertise</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.profile.skills.split(",").slice(0, 5).map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                Book a Session
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg">
                Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-8 p-6">
          {/* Services Section */}
          <h2 className="text-2xl font-bold mb-2">Services</h2>
          <p className="text-gray-500 mb-6">
            Choose from {data.services.length} available services
          </p>

          <div className="space-y-6">
            {data.services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{service.title}</h3>
                  <span className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
                    {service.category || "Consultation"}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold">
                    {service.price_per_hour === 0 ? "FREE" : `₹${service.price_per_hour}`}
                  </span>
                  <button
                    onClick={() => handleServiceBook(service)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
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
