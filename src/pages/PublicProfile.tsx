import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ServiceBookingDialog } from "@/components/booking/ServiceBookingDialog";
import { Profile } from "@/hooks/useOptimizedProfile";
import { Service } from "@/hooks/useServices";
import { AvailabilitySlot } from "@/hooks/useAvailabilitySlots";
import { Instagram, Linkedin, Globe, FolderOpen, CheckCircle, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import GlobalHeader from '@/components/common/GlobalHeader';
import { useAuth } from "@/contexts/AuthContext";
import { useRolePersistence } from "@/hooks/useRolePersistence";

interface PublicProfileData {
  profile: Profile;
  services: Service[];
  availability: AvailabilitySlot[];
}

// Cache for public profiles
const profileCache = new Map<string, { data: PublicProfileData; timestamp: number }>();
const CACHE_DURATION = 300000; // 5 minutes

const OptimizedPublicProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getDashboardPath, clearRoleData } = useRolePersistence();
  const [data, setData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showBioModal, setShowBioModal] = useState(false);
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

  // Helper function for sign out
  const handleSignOut = async () => {
    clearRoleData();
    await supabase.auth.signOut();
    navigate('/wo-commune');
  };

  // Get avatar content for header
  const avatarContent = useMemo(() => {
    if (user?.user_metadata?.avatar_url) {
      return { type: 'image' as const, value: user.user_metadata.avatar_url };
    }
    const displayName = user?.user_metadata?.display_name || user?.email || 'User';
    return { type: 'initial' as const, value: displayName.charAt(0).toUpperCase() };
  }, [user]);

  // Memoize bio processing
  const truncatedBio = useMemo(() => {
    const bio = data?.profile.bio;
    if (!bio) return { text: "", needsTruncation: false };
    
    if (bio.length <= 375) {
      return { text: bio, needsTruncation: false };
    }
    
    return { text: bio.substring(0, 375), needsTruncation: true };
  }, [data?.profile.bio]);

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-xl font-semibold text-foreground">Profile Not Found</h1>
        <p className="text-sm text-muted-foreground mt-2">Username: {username}</p>
        <p className="text-sm text-muted-foreground">Error: {error}</p>
        <Link
          to="/wo-commune"
          className="mt-3 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Back to WO Commune
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header with burger menu functionality */}
      <GlobalHeader 
        user={user}
        displayName={user?.user_metadata?.display_name || user?.email?.split('@')[0] || "Friend"}
        avatarContent={avatarContent}
        dashboardPath={getDashboardPath()}
        clearRoleData={clearRoleData}
        signOut={handleSignOut}
        navigate={navigate}
      />

      {/* Main Content - Two Column Layout */}
      <section className="pt-20 pb-8 bg-background">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Left Column - User Information */}
            <div className="lg:col-span-1">
              <div className="space-y-4 p-6 rounded-lg" style={{ backgroundColor: '#193232' }}>
                {/* Profile Image & Basic Info */}
                <div className="text-center lg:text-left">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <img
                      src={data.profile.avatar_url || "/placeholder.svg"}
                      alt={data.profile.display_name || "Profile"}
                      className="w-20 h-20 rounded-full object-cover shadow-sm border-2 border-white/20 mx-auto lg:mx-0 lg:flex-shrink-0"
                      loading="lazy"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <h1 className="text-xl font-semibold text-white flex items-center justify-center lg:justify-start gap-2">
                        {data.profile.display_name}
                        <CheckCircle size={14} className="text-white" aria-label="Verified" />
                      </h1>
                      
                      <p className="text-sm text-white/80 leading-relaxed text-center">
                        {data.profile.short_bio || "Professional Services Expert"}
                      </p>
                    </div>
                  </div>
                  
                  {/* Expertise Tags - positioned below image */}
                  {skillsArray.length > 0 && (
                    <div className="flex flex-wrap justify-center lg:justify-start gap-1 mt-3">
                      {skillsArray.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs rounded-md bg-white/20 text-white font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* About Section */}
                {data.profile.bio && (
                  <div className="space-y-2">
                    <h2 className="text-base font-medium text-white">About</h2>
                    <p className="text-sm text-white/80 leading-relaxed text-justify sm:text-left">
                      {truncatedBio.text}
                      {truncatedBio.needsTruncation && (
                        <button
                          onClick={() => setShowBioModal(true)}
                          className="text-white/60 hover:text-white ml-1 underline"
                        >
                          ...
                        </button>
                      )}
                    </p>
                  </div>
                )}

                {/* At a glance */}
                <div className="space-y-3">
                  <h3 className="text-base font-medium text-white">At a glance</h3>
                  
                  <div className="space-y-2">
                    {data.profile.profession && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-white">Profession</span>
                        <p className="text-sm text-white/80 text-justify sm:text-left">{data.profile.profession}</p>
                      </div>
                    )}
                    
                    {data.profile.school && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium text-white">Education</span>
                        <p className="text-sm text-white/80 text-justify sm:text-left">{data.profile.school}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Links */}
                {socialLinks.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-base font-medium text-white">Connect</h3>
                    <div className="flex items-center justify-start gap-2">
                      {socialLinks.map(({ url, icon: Icon, label }, idx) => (
                        <a 
                          key={idx} 
                          href={url} 
                          target="_blank" 
                          rel="noreferrer" 
                          aria-label={label}
                          className="p-2 hover:bg-white/10 rounded-md transition-colors text-white/80 hover:text-white"
                        >
                          <Icon size={18} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Services */}
            <div className="lg:col-span-2" ref={servicesRef}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-medium text-foreground">Here's what I can help you with</h2>
                </div>

                {data.services.length === 0 ? (
                  <div className="text-center py-15">
                    <div className="text-muted-foreground">No services available at the moment.</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {data.services.map((service) => (
                      <div
                        key={service.id}
                        className="bg-gray-50 border border-border rounded-lg p-6 hover:shadow-sm transition-all duration-300 hover:border-primary/20"
                      >
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <h3 className="text-lg font-medium text-foreground">{service.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed text-justify sm:text-left">
                              {service.description}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="text-xl font-semibold text-primary">
                                ₹{service.price_per_hour}
                              </div>
                              {service.duration_minutes && (
                                <>
                                  <span>•</span>
                                  <span>{service.duration_minutes} Mins</span>
                                </>
                              )}
                            </div>

                            <button
                              onClick={() => handleServiceBook(service)}
                              className="px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-colors"
                              style={{ backgroundColor: '#193232' }}
                            >
                              Book now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Bio Modal */}
      <Dialog open={showBioModal} onOpenChange={setShowBioModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>About Me</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap text-justify sm:text-left">
              {data?.profile.bio}
            </p>
          </div>
        </DialogContent>
      </Dialog>

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