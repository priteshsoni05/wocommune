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
          .maybeSingle();

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
    <div className="min-h-screen bg-background">
      {/* Hero Section with Split Layout */}
      <div className="grid lg:grid-cols-12 min-h-[80vh]">
        {/* Left: Profile Hero with Colored Background */}
        <div className="lg:col-span-5 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="mb-8">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden mb-6 mx-auto lg:mx-0 border-4 border-white/20">
                <img
                  src={data.profile.avatar_url || '/placeholder.svg'}
                  alt={data.profile.display_name || 'Profile'}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-center lg:text-left">
                {data.profile.display_name}
              </h1>
              <p className="text-lg text-white/90 mb-6 text-center lg:text-left">
                {data.profile.role || 'Professional Helper'}
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3 justify-center lg:justify-start mb-6">
                {data.profile.linkedin_url && (
                  <a 
                    href={data.profile.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {data.profile.portfolio_url && (
                  <a 
                    href={data.profile.portfolio_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>

              {/* Skills/Expertise Tags */}
              {data.profile.skills && (
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {data.profile.skills.split(',').slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 text-white text-sm rounded-full"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Services Section */}
        <div className="lg:col-span-7 p-8 lg:p-12">
          <div className="max-w-4xl">
            {/* Service Filter Tabs */}
            <div className="flex gap-2 mb-8">
              <button className="px-6 py-2 bg-foreground text-background rounded-full text-sm font-medium">
                All
              </button>
              <button className="px-6 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium hover:bg-muted/80">
                1:1 Call
              </button>
              <button className="px-6 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium hover:bg-muted/80">
                Quick Help
              </button>
            </div>

            {/* Services Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {data.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleServiceBook(service)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {service.duration_minutes} mins
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">
                        {service.price_per_hour === 0 ? 'FREE' : `$${service.price_per_hour}`}
                      </span>
                      <button className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* About Section - Full Width */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-8 lg:px-12 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">About me</h2>
              {/* Social Links in About Section */}
              <div className="flex gap-3">
                {data.profile.linkedin_url && (
                  <a 
                    href={data.profile.linkedin_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-foreground text-background rounded-lg flex items-center justify-center hover:bg-foreground/90 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
            <div className="lg:col-span-10">
              <div className="prose prose-lg max-w-none text-muted-foreground">
                {(data.profile.bio || `Hello! I'm ${data.profile.display_name || 'a dedicated professional'} with years of experience helping individuals and businesses achieve their goals. I believe in providing personalized guidance and support to help you overcome challenges and reach your full potential.

When I'm not working, I love sharing my knowledge and helping others succeed through mentorship and consultation.

I'm passionate about continuous learning and staying up-to-date with the latest industry trends. Let's work together to turn your challenges into opportunities for growth and success.`).split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
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