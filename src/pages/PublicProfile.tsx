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
        // Fetch profile by username
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .maybeSingle();

        if (profileError || !profile) throw profileError || new Error("No profile found");

        // Fetch active services using the profile's user_id
        const { data: services, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("helper_id", profile.user_id)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (servicesError || !services) throw servicesError || new Error("No services found");

        // Fetch availability slots using the profile's user_id
        const { data: availability, error: availabilityError } = await supabase
          .from("availability_slots")
          .select("*")
          .eq("helper_id", profile.user_id)
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
  }, [username]);

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
      <div className="container mx-auto p-0">
        <div className="grid lg:grid-cols-12 gap-0 min-h-screen">
          {/* Left Sidebar - Sticky Profile Info */}
          <div className="lg:col-span-4 bg-card border-r border-border">
            <div className="sticky top-0 p-8 space-y-6">
              {/* Profile Header */}
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20">
                  <img
                    src={data.profile.avatar_url || '/placeholder.svg'}
                    alt={data.profile.display_name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {data.profile.display_name}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-3">
                    I help with {data.profile.role || 'Professional Services'}
                  </p>
                  
                  {/* Trust Indicators */}
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Active 2 days ago</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Tags */}
              {data.profile.skills && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.profile.skills.split(',').slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">Reviews</h3>
                  <button className="text-xs text-primary hover:underline">View all</button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">4.9 (24 reviews)</span>
                </div>
                <p className="text-xs text-muted-foreground">87 sessions completed</p>
              </div>

              {/* Social Links */}
              {(data.profile.linkedin_url || data.profile.portfolio_url || data.profile.website_url) && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground">Connect</h3>
                  <div className="flex gap-2">
                    {data.profile.linkedin_url && (
                      <a 
                        href={data.profile.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                    {data.profile.portfolio_url && (
                      <a 
                        href={data.profile.portfolio_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    {data.profile.website_url && (
                      <a 
                        href={data.profile.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-border">
                <button className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Book a Session
                </button>
                <button className="w-full border border-border text-foreground px-4 py-3 rounded-lg font-medium hover:bg-muted transition-colors">
                  Send Message
                </button>
              </div>

              {/* About Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-foreground">About</h3>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <p className="line-clamp-4">
                    {data.profile.bio || `Hello! I'm ${data.profile.display_name || 'a dedicated professional'} with years of experience helping individuals and businesses achieve their goals. I believe in providing personalized guidance and support to help you overcome challenges and reach your full potential.`}
                  </p>
                  <button className="text-primary text-xs hover:underline mt-2">Read more</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Services and Availability */}
          <div className="lg:col-span-8 p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Services</h2>
              <p className="text-muted-foreground">Choose from {data.services.length} available services</p>
            </div>

            {/* Service Filters */}
            <div className="flex gap-2 mb-8 flex-wrap">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                All Services
              </button>
              <button className="px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium hover:bg-muted/80">
                1:1 Mentoring
              </button>
              <button className="px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium hover:bg-muted/80">
                Quick Call
              </button>
              <button className="px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm font-medium hover:bg-muted/80">
                Package Deal
              </button>
            </div>

            {/* Services Grid */}
            <div className="space-y-6">
              {data.services.map((service) => (
                <div
                  key={service.id}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          {service.category || 'Consultation'}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Service Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-muted-foreground">{service.duration_minutes} mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-muted-foreground">Zoom Call</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-muted-foreground">1-on-1</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-600 font-medium">Available Today</span>
                    </div>
                  </div>

                  {/* Price and Book Button */}
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-foreground">
                      {service.price_per_hour === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        <span>₹{service.price_per_hour}</span>
                      )}
                      {service.price_per_hour !== 0 && (
                        <span className="text-sm text-muted-foreground font-normal">/{service.duration_minutes}min</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleServiceBook(service)}
                      className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      Book Now
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Availability Calendar Section */}
            <div className="mt-12 p-6 bg-muted/30 rounded-xl">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Availability</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Today 2:00 PM', 'Tomorrow 10:00 AM', 'Dec 27 3:00 PM', 'Dec 28 11:00 AM'].map((slot, index) => (
                  <button
                    key={index}
                    className="p-3 bg-background border border-border rounded-lg text-sm hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    {slot}
                  </button>
                ))}
              </div>
              <button className="mt-4 text-primary text-sm hover:underline">View all available times →</button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Book Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium">
          Book a Session
        </button>
      </div>

      {/* Service Booking Dialog */}
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