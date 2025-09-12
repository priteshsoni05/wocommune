import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ServiceBookingDialog } from "@/components/booking/ServiceBookingDialog";
import { Profile } from "@/hooks/useOptimizedProfile";
import { Service } from "@/hooks/useServices";
import { AvailabilitySlot } from "@/hooks/useAvailabilitySlots";
import { Instagram, Linkedin, Globe, FolderOpen, CheckCircle, Star } from "lucide-react";
import GlobalHeader from '@/components/common/GlobalHeader';
import { useAuth } from "@/contexts/AuthContext";
import { useRolePersistence } from "@/hooks/useRolePersistence";

interface PublicProfileData {
  profile: Profile;
  services: Service[];
  availability: AvailabilitySlot[];
}

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
  const servicesRef = useRef<HTMLDivElement | null>(null);

  const fetchPublicProfile = useCallback(async () => {
    if (!username) {
      setError("Profile not found");
      setLoading(false);
      return;
    }

    const cached = profileCache.get(username);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("status", "active")
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error("No profile found");

      const { data: services } = await supabase
        .from("services")
        .select("*, help_type")
        .eq("helper_id", profile.user_id)
        .eq("is_active", true);

      const { data: availability } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("helper_id", profile.user_id)
        .eq("is_available", true);

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
        services: services || [],
        availability: availability || []
      };

      profileCache.set(username, { data: result, timestamp: Date.now() });
      setData(result);
    } catch (err) {
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

  const handleSignOut = async () => {
    clearRoleData();
    await supabase.auth.signOut();
    navigate('/wo-commune');
  };

  const avatarContent = useMemo(() => {
    if (user?.user_metadata?.avatar_url) {
      return { type: 'image' as const, value: user.user_metadata.avatar_url };
    }
    const displayName = user?.user_metadata?.display_name || user?.email || 'User';
    return { type: 'initial' as const, value: displayName.charAt(0).toUpperCase() };
  }, [user]);

  const skillsArray = useMemo(() => {
    const skills = data?.profile.skills;
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.slice(0, 5);
    if (typeof skills === 'string') return String(skills).split(",").slice(0, 5).map(skill => skill.trim());
    return [];
  }, [data?.profile.skills]);

  const socialLinks = useMemo(() => {
    if (!data?.profile) return [];
    const links = [];
    if (data.profile.instagram_url) links.push({ url: data.profile.instagram_url, icon: Instagram, label: "Instagram" });
    if (data.profile.linkedin_url) links.push({ url: data.profile.linkedin_url, icon: Linkedin, label: "LinkedIn" });
    if (data.profile.website_url) links.push({ url: data.profile.website_url, icon: Globe, label: "Website" });
    if (data.profile.portfolio_url) links.push({ url: data.profile.portfolio_url, icon: FolderOpen, label: "Portfolio" });
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
      <GlobalHeader 
        user={user}
        displayName={user?.user_metadata?.display_name || user?.email?.split('@')[0] || "Friend"}
        avatarContent={avatarContent}
        dashboardPath={getDashboardPath()}
        clearRoleData={clearRoleData}
        signOut={handleSignOut}
        navigate={navigate}
      />

      <section className="pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column - Profile */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <div className="flex flex-col items-center lg:items-start gap-6">
                  <img
                    src={data.profile.avatar_url || "/placeholder.svg"}
                    alt={data.profile.display_name || "Profile"}
                    className="w-28 h-28 rounded-full object-cover border-4 border-primary/20 shadow-md"
                  />
                  <div className="space-y-2 text-center lg:text-left">
                    <h1 className="text-3xl font-semibold flex items-center justify-center lg:justify-start gap-2">
                      {data.profile.display_name}
                      <CheckCircle size={18} className="text-primary" />
                    </h1>
                    <p className="text-muted-foreground italic">{data.profile.short_bio || "Professional Services Expert"}</p>
                    {skillsArray.length > 0 && (
                      <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                        {skillsArray.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 text-xs rounded-full bg-muted text-foreground shadow-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {data.profile.bio && (
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                  <h2 className="text-lg font-medium mb-2">About</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{data.profile.bio}</p>
                </div>
              )}

              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
                <h3 className="text-base font-medium">Key Details</h3>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">4.9</span>
                  <span className="text-muted-foreground">(24 reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">87 sessions completed</span>
                </div>
                {data.profile.profession && (
                  <div>
                    <span className="text-xs font-medium">Profession</span>
                    <p className="text-sm text-muted-foreground">{data.profile.profession}</p>
                  </div>
                )}
                {data.profile.school && (
                  <div>
                    <span className="text-xs font-medium">Education</span>
                    <p className="text-sm text-muted-foreground">{data.profile.school}</p>
                  </div>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                  <h3 className="text-base font-medium mb-3">Connect</h3>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map(({ url, icon: Icon, label }, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noreferrer" aria-label={label}
                        className="p-3 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-primary/10 transition-all">
                        <Icon size={18} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <button className="w-full px-5 py-3 rounded-xl font-medium shadow-md bg-black text-white hover:bg-black/90 transition">
                Contact & Connect
              </button>
            </div>

            {/* Right Column - Services */}
            <div className="lg:col-span-7 space-y-8" ref={servicesRef}>
              <div>
                <h2 className="text-2xl font-semibold">Here’s what I can help you with</h2>
                <p className="text-sm text-muted-foreground">{data.services.length} service(s) available</p>
              </div>

              {data.services.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">No services available at the moment.</div>
              ) : (
                <div className="space-y-6">
                  {data.services.map((service) => (
                    <div key={service.id}
                      className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border">
                          <div className="text-xl font-semibold text-primary">
                            ₹{service.price_per_hour}
                            {service.duration_minutes && <span className="text-sm text-muted-foreground ml-2">/ {service.duration_minutes} min</span>}
                          </div>
                          <button
                            onClick={() => handleServiceBook(service)}
                            className="mt-4 sm:mt-0 px-6 py-2 rounded-full text-white font-medium shadow-md hover:shadow-lg transition"
                            style={{ backgroundColor: "#193232" }}
                          >
                            Get Help
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
      </section>

      {/* Mobile sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-4">
        <button
          onClick={scrollToServices}
          className="w-full py-4 rounded-xl font-semibold text-white text-lg shadow-md hover:shadow-lg transition"
          style={{ backgroundColor: "#193232" }}
        >
          View Services
        </button>
      </div>

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
