import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ServiceBookingDialog } from "@/components/booking/ServiceBookingDialog";
import { Profile } from "@/hooks/useOptimizedProfile";
import { Service } from "@/hooks/useServices";
import { AvailabilitySlot } from "@/hooks/useAvailabilitySlots";
import { Instagram, Linkedin, Globe, FolderOpen, CheckCircle } from "lucide-react";
import GlobalHeader from '@/components/common/GlobalHeader';

interface PublicProfileData {
  profile: Profile;
  services: Service[];
  availability: AvailabilitySlot[];
}

const PINE = "#193232";
const TEXT = "#111111";

// Cache for public profiles
const profileCache = new Map<string, { data: PublicProfileData; timestamp: number }>();
const CACHE_DURATION = 300000; // 5 minutes

const OptimizedPublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);

  const fetchPublicProfile = useCallback(async () => {
    if (!username) {
      setError("Profile not found");
      setLoading(false);
      return;
    }

    // Check cache first
    const cached = profileCache.get(username);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    console.log('Fetching public profile for username:', username);
    try {
      // First get the profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("status", "active")
        .maybeSingle();

      console.log('Profile query result:', { profile, profileError });

      if (profileError) {
        console.error('Profile query error:', profileError);
        throw profileError;
      }

      if (!profile) {
        console.log('No profile found for username:', username);
        throw new Error("No profile found");
      }

      // Then get services separately
      const { data: services, error: servicesError } = await supabase
        .from("services")
        .select("*, help_type")
        .eq("helper_id", profile.user_id)
        .eq("is_active", true);

      console.log('Services query result:', { services, servicesError });

      // Then get availability separately
      const { data: availability, error: availabilityError } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("helper_id", profile.user_id)
        .eq("is_available", true);

      console.log('Availability query result:', { availability, availabilityError });

      // Process the data - use the fetched data directly
      const processedServices = (services || []).map((service: any) => ({
        ...service,
        help_type: service.help_type || null
      }));
      const processedAvailability = availability || [];

      // Create profile object
      const profileData: Profile = {
        id: profile.id,
        user_id: profile.user_id,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        updated_at: profile.updated_at || profile.created_at,
        username: profile.username,
        skills: profile.skills,
        linkedin_url: profile.linkedin_url,
        instagram_url: profile.instagram_url,
        website_url: profile.website_url,
        portfolio_url: profile.portfolio_url,
        profession: profile.profession,
        email: profile.email,
        phone: profile.phone,
        status: profile.status as 'active' | 'pending' | 'in_review',
        last_active_role: profile.last_active_role,
        short_bio: profile.short_bio,
        school: profile.school,
        use_case: profile.use_case
      };

      const result: PublicProfileData = {
        profile: profileData,
        services: processedServices,
        availability: processedAvailability
      };

      console.log('Public profile data loaded successfully:', result);

      // Cache the result
      profileCache.set(username, { data: result, timestamp: Date.now() });
      setData(result);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(`Failed to load profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchPublicProfile();
  }, [fetchPublicProfile]);

  const handleServiceBook = useCallback((service: Service) => {
    setSelectedService(service);
    setShowBookingDialog(true);
  }, []);

  const scrollToServices = useCallback(() => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Memoize skills processing
  const skillsArray = useMemo(() => {
    const skills = data?.profile.skills;
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.slice(0, 5);
    if (typeof skills === 'string') return String(skills).split(",").slice(0, 5).map(skill => skill.trim());
    return [];
  }, [data?.profile.skills]);

  // Memoize social links
  const socialLinks = useMemo(() => {
    if (!data?.profile) return [];
    
    const links = [];
    if (data.profile.instagram_url) {
      links.push({ url: data.profile.instagram_url, icon: Instagram, label: "Instagram" });
    }
    if (data.profile.linkedin_url) {
      links.push({ url: data.profile.linkedin_url, icon: Linkedin, label: "LinkedIn" });
    }
    if (data.profile.website_url) {
      links.push({ url: data.profile.website_url, icon: Globe, label: "Website" });
    }
    if (data.profile.portfolio_url) {
      links.push({ url: data.profile.portfolio_url, icon: FolderOpen, label: "Portfolio" });
    }
    return links;
  }, [data?.profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ color: TEXT }}>
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
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
          to="/wo-commune"
          className="mt-3 px-4 py-2 rounded-md text-white"
          style={{ backgroundColor: "#193232" }}
        >
          Back to WO Commune
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Global Header */}
      <GlobalHeader />

      {/* Main container with proper spacing */}
      <div className="pt-8 md:pt-10 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 min-h-[calc(100vh-5rem)]">
            {/* Sidebar */}
            <aside className="lg:col-span-4 bg-white border border-gray-200 rounded-lg mx-4 lg:mx-0 p-6 h-fit lg:sticky lg:top-24">
              <div className="text-center space-y-4" style={{ color: TEXT }}>
                <img
                  src={data.profile.avatar_url || "/placeholder.svg"}
                  alt={data.profile.display_name || "Profile"}
                  className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg"
                  style={{ border: "4px solid #193232" }}
                  loading="lazy"
                />
                <div>
                  <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                    {data.profile.display_name}
                    <CheckCircle size={20} style={{ color: "#193232" }} aria-label="Verified" />
                  </h1>
                  <p className="text-base text-gray-600 mt-2">
                    {data.profile.short_bio || "I help with Professional Services"}
                  </p>
                </div>
              </div>

              {/* Expertise */}
              {skillsArray.length > 0 && (
                <div className="mt-6" style={{ color: TEXT }}>
                  <h3 className="text-base font-semibold mb-3">Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsArray.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 text-sm rounded-full border text-white font-medium"
                        style={{ borderColor: "#193232", backgroundColor: "#193232" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="mt-6" style={{ color: TEXT }}>
                <h3 className="text-base font-semibold mb-2">Reviews</h3>
                <p className="text-base">★ 4.9 (24 reviews) • 87 sessions completed</p>
              </div>

              {/* Social icons */}
              {socialLinks.length > 0 && (
                <div className="mt-4 flex items-center justify-start gap-4" style={{ color: TEXT }}>
                  {socialLinks.map(({ url, icon: Icon, label }, idx) => (
                    <a 
                      key={idx} 
                      href={url} 
                      target="_blank" 
                      rel="noreferrer" 
                      aria-label={label}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              )}

              {/* About */}
              {data.profile.bio && (
                <div className="mt-6" style={{ color: TEXT }}>
                  <h3 className="text-base font-semibold mb-3">About</h3>
                  <p className="text-base leading-relaxed text-gray-700">{data.profile.bio}</p>
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-8 mx-4 lg:mx-0 pb-20 lg:pb-8" style={{ color: TEXT }}>
              <div ref={servicesRef} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">Services</h2>
                  <div className="text-sm text-gray-500">
                    {data.services.length} service{data.services.length !== 1 ? 's' : ''} available
                  </div>
                </div>

                <div className="space-y-6">
                  {data.services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                          <p className="text-base leading-relaxed text-gray-700">
                            {service.description}
                          </p>
                        </div>

                        <div className="sm:shrink-0 text-center sm:text-right">
                          <div className="text-2xl font-bold mb-4" style={{ color: "#193232" }}>
                            ₹{service.price_per_hour}
                          </div>
                          <button
                            onClick={() => handleServiceBook(service)}
                            className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg text-white text-base font-medium px-6 py-3 hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: "#193232" }}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {data.services.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-500">No services published yet.</div>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom">
        <button
          onClick={scrollToServices}
          className="w-full py-4 rounded-lg font-semibold text-white text-lg"
          style={{ backgroundColor: "#193232" }}
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

export default OptimizedPublicProfile;