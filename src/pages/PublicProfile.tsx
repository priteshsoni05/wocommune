import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHero } from "@/components/public/ProfileHero";
import { AboutSection } from "@/components/public/AboutSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { AvailabilitySection } from "@/components/public/AvailabilitySection";
import { Profile } from "@/hooks/useProfile";
import { Service } from "@/hooks/useServices";
import { AvailabilitySlot } from "@/hooks/useAvailabilitySlots";

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
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (profileError) throw profileError;

        // Fetch active services
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('helper_id', userId)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (servicesError) throw servicesError;

        // Fetch availability slots
        const { data: availability, error: availabilityError } = await supabase
          .from('availability_slots')
          .select('*')
          .eq('helper_id', userId)
          .eq('is_available', true)
          .order('day_of_week', { ascending: true })
          .order('start_time', { ascending: true });

        if (availabilityError) throw availabilityError;

        setData({
          profile: profile as Profile,
          services: services as Service[],
          availability: availability as AvailabilitySlot[]
        });
      } catch (err) {
        console.error('Error fetching public profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [userId]);

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProfileHero profile={data.profile} />
        <AboutSection profile={data.profile} />
        <ServicesSection 
          services={data.services} 
          helperId={userId!} 
          onServiceSelect={setSelectedService}
        />
        <AvailabilitySection 
          availability={data.availability} 
          helperId={userId!} 
          selectedService={selectedService}
          helperName={data.profile.display_name || 'Helper'}
        />
      </div>
    </div>
  );
};

export default PublicProfile;