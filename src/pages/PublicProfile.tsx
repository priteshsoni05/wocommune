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

    try {
      // Optimized single query with joins
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id, 
          user_id,
          display_name, 
          bio, 
          avatar_url, 
          created_at, 
          username,
          skills,
          linkedin_url,
          instagram_url,
          website_url,
          portfolio_url,
          services!left(
            id,
            title,
            description,
            price_per_hour,
            duration_minutes,
            category,
            is_active
          ),
          availability_slots!left(
            id,
            day_of_week,
            start_time,
            end_time,
            is_available
          )
        `)
        .eq("username", username)
        .eq("status", "active")
        .not("username", "is", null)
        .not("username", "eq", "")
        .maybeSingle();

      if (profilesError) {
        throw profilesError;
      }

      if (!profiles) {
        throw new Error("No profile found");
      }

      // Process the data
      const services = Array.isArray(profiles.services) 
        ? profiles.services.filter(s => s.is_active) 
        : [];

      const availability = Array.isArray(profiles.availability_slots)
        ? profiles.availability_slots.filter(slot => slot.is_available)
        : [];

      // Create profile object
      const profileData: Profile = {
        id: profiles.id,
        user_id: profiles.user_id,
        display_name: profiles.display_name,
        bio: profiles.bio,
        avatar_url: profiles.avatar_url,
        username: profiles.username,
        skills: profiles.skills,
        created_at: profiles.created_at,
        updated_at: profiles.created_at,
        status: 'active',
        email: null,
        phone: null,
        role: null,
        last_active_role: null,
        linkedin_url: profiles.linkedin_url,
        instagram_url: profiles.instagram_url,
        website_url: profiles.website_url,
        portfolio_url: profiles.portfolio_url,
        school: null,
        use_case: null
      };

      const result = {
        profile: profileData,
        services: services as Service[],
        availability: availability as AvailabilitySlot[],
      };

      // Cache the result
      profileCache.set(username, { data: result, timestamp: Date.now() });
      setData(result);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Failed to load profile");
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
    return data?.profile.skills 
      ? data.profile.skills.split(",").slice(0, 5).map(skill => skill.trim())
      : [];
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

      {/* Main grid */}
      <div className="w-full mx-auto grid lg:grid-cols-12 gap-0 mt-8 md:mt-10">
        {/* Sidebar */}
        <aside className="lg:col-span-4 bg-white border-r border-gray-200 p-6 lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px]">
          <div className="text-center space-y-3" style={{ color: TEXT }}>
            <img
              src={data.profile.avatar_url || "/placeholder.svg"}
              alt={data.profile.display_name || "Profile"}
              className="w-28 h-28 mx-auto rounded-full object-cover"
              style={{ border: "4px solid #193232" }}
              loading="lazy"
            />
            <h1 className="text-xl font-bold flex items-center justify-center gap-1">
              {data.profile.display_name}
              <CheckCircle size={18} style={{ color: "#193232" }} aria-label="Verified" />
            </h1>
            <p className="text-sm">
              I help with {data.profile.role || "Professional Services"}
            </p>
          </div>

          {/* Expertise */}
          {skillsArray.length > 0 && (
            <div className="mt-6" style={{ color: TEXT }}>
              <h3 className="text-sm font-medium mb-2">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {skillsArray.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs rounded-full border text-white"
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
            <h3 className="text-sm font-medium mb-1">Reviews</h3>
            <p className="text-sm">★ 4.9 (24 reviews) • 87 sessions completed</p>
          </div>

          {/* Social icons */}
          {socialLinks.length > 0 && (
            <div className="mt-3 flex items-center justify-start gap-3" style={{ color: TEXT }}>
              {socialLinks.map(({ url, icon: Icon, label }, idx) => (
                <a key={idx} href={url} target="_blank" rel="noreferrer" aria-label={label}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          )}

          {/* About */}
          {data.profile.bio && (
            <div className="mt-6" style={{ color: TEXT }}>
              <h3 className="text-sm font-medium mb-2">About</h3>
              <p className="text-sm leading-relaxed">{data.profile.bio}</p>
            </div>
          )}
        </aside>

        {/* Main Content */}
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
                        style={{ backgroundColor: "#193232" }}
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