import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useServices } from "@/hooks/useServices";
import { useBookings } from "@/hooks/useBookings";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  User, 
  Lightbulb, 
  Calendar, 
  BookOpen, 
  Star, 
  Settings, 
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { HelpanionHome } from "@/components/helpanion/HelpanionHome";
import { HelpanionProfile } from "@/components/helpanion/HelpanionProfile";
import { HelpanionServices } from "@/components/helpanion/HelpanionServices";
import { HelpanionAvailability } from "@/components/helpanion/HelpanionAvailability";
import { HelpanionBookings } from "@/components/helpanion/HelpanionBookings";
import { HelpanionReviews } from "@/components/helpanion/HelpanionReviews";
import { HelpanionSettings } from "@/components/helpanion/HelpanionSettings";

type TabKey = 'home' | 'profile' | 'services' | 'availability' | 'bookings' | 'reviews' | 'settings';

const navigationTabs = [
  { key: 'home' as TabKey, label: 'Home', icon: Home },
  { key: 'profile' as TabKey, label: 'My Profile', icon: User },
  { key: 'services' as TabKey, label: 'Create Service', icon: Lightbulb },
  { key: 'availability' as TabKey, label: 'Availability', icon: Calendar },
  { key: 'bookings' as TabKey, label: 'Bookings', icon: BookOpen },
  { key: 'reviews' as TabKey, label: 'Reviews', icon: Star },
  { key: 'settings' as TabKey, label: 'Settings', icon: Settings },
];

const HelpanionDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { hasRole, addRole } = useUserRoles();
  const { services } = useServices();
  const { bookings } = useBookings();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [showWalkerModal, setShowWalkerModal] = useState(false);
  const [walkerFormData, setWalkerFormData] = useState({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile && user) {
      // Update last active role
      updateProfile({ last_active_role: 'helpanion' });
      setWalkerFormData({
        fullName: profile.display_name || "",
        email: profile.email || "",
      });
    }
  }, [profile, user, updateProfile]);

  // --- Add: Home Button for top right corner ---
  // We'll place this button outside or at the end of the navigation/top bar inside DashboardLayout if possible.
  // If DashboardLayout exposes a header prop/slot, use it. Otherwise, add here above main content.
  // For simplicity, add it above the main content for now.

  // Handlers for tab navigation
  const handleTabChange = (key: TabKey) => {
    setActiveTab(key);
  };

  // Render content based on the active tab
  const renderTabContent = () => {
    if (!profile) return null;
    switch (activeTab) {
      case 'home':
        return (
          <HelpanionHome
            profile={profile}
            profileProgress={profile.profileProgress || 0}
            onNavigateToProfile={() => setActiveTab('profile')}
            onNavigateToServices={() => setActiveTab('services')}
            onNavigateToAvailability={() => setActiveTab('availability')}
          />
        );
      case 'profile':
        return (
          <HelpanionProfile
            profile={profile}
            updateProfile={updateProfile}
          />
        );
      case 'services':
        return (
          <HelpanionServices
            profileProgress={profile.profileProgress || 0}
          />
        );
      case 'availability':
        return (
          <HelpanionAvailability
            profileProgress={profile.profileProgress || 0}
          />
        );
      case 'bookings':
        return <HelpanionBookings />;
      case 'reviews':
        return <HelpanionReviews />;
      case 'settings':
        return (
          <HelpanionSettings
            profile={profile}
            updateProfile={updateProfile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      {/* Top bar for navigation & home button */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background z-10">
        <div className="flex items-center gap-2">
          {navigationTabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium", {
                "bg-primary text-white": activeTab === tab.key
              })}
              onClick={() => handleTabChange(tab.key)}
            >
              <tab.icon className="w-4 h-4 mr-1" />
              {tab.label}
            </Button>
          ))}
        </div>
        {/* Home button on right */}
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">
        {profileLoading ? (
          <div className="text-center text-muted-foreground py-10">Loading...</div>
        ) : (
          renderTabContent()
        )}
      </div>
    </DashboardLayout>
  );
};

export default HelpanionDashboard;