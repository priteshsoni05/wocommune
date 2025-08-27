import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOptimizedProfile as useProfile } from "@/hooks/useOptimizedProfile";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useServices } from "@/hooks/useServices";
import { useBookings } from "@/hooks/useBookings";
import { useRolePersistence } from "@/hooks/useRolePersistence";
import { useProfileProgress } from "@/hooks/useProfileProgress";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
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

type TabKey =
  | "home"
  | "profile"
  | "services"
  | "availability"
  | "bookings"
  | "reviews"
  | "settings";

const PRIMARY_GREEN = "#01796F";
const BG_NEUTRAL = "#FAF9F6";

const navigationTabs = [
  { key: "home" as TabKey, label: "Home", icon: Home },
  { key: "profile" as TabKey, label: "My Profile", icon: User },
  { key: "services" as TabKey, label: "Create Service", icon: Lightbulb },
  { key: "availability" as TabKey, label: "Availability", icon: Calendar },
  { key: "bookings" as TabKey, label: "Bookings", icon: BookOpen },
  { key: "reviews" as TabKey, label: "Reviews", icon: Star },
  { key: "settings" as TabKey, label: "Settings", icon: Settings }
];

const HelpanionDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { hasRole, addRole } = useUserRoles();
  const { services } = useServices();
  const { bookings } = useBookings();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Role persistence
  const { setActiveRole, clearRoleData, handleCorruptedData } = useRolePersistence();
  
  // Use the unified profile progress hook
  const profileProgress = useProfileProgress(profile);

  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [showWalkerModal, setShowWalkerModal] = useState(false);
  const [walkerFormData, setWalkerFormData] = useState({
    fullName: "",
    email: ""
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile && user) {
      // Set active role in storage for persistence
      const success = setActiveRole('helpanion');
      if (!success) {
        console.error('Failed to set role, forcing logout');
        handleCorruptedData();
        navigate('/wo-commune');
        return;
      }
      
      // Update database as backup
      updateProfile({ last_active_role: "helpanion" });
      setWalkerFormData({
        fullName: profile.display_name || "",
        email: profile.email || ""
      });
    }
  }, [profile, user, setActiveRole, updateProfile, handleCorruptedData, navigate]);

  if (authLoading || profileLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: BG_NEUTRAL }}
      >
        <div className="text-center space-y-4">
          <div
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ borderColor: `${PRIMARY_GREEN} transparent transparent transparent` }}
          ></div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  // Remove the old calculateProfileProgress function - using unified hook now

  const handleSignOut = async () => {
    // Clear role data and sign out
    clearRoleData();
    await signOut();
    navigate("/wo-commune");
  };

  const handleRoleToggle = (checked: boolean) => {
    if (checked) {
      if (hasRole("walker")) {
        navigate("/walker-dashboard");
      } else {
        setShowWalkerModal(true);
      }
    }
  };

  const handleBecomeWalker = async () => {
    const result = await addRole("walker");
    if (result?.error) {
      toast({
        title: "Error",
        description: "Failed to add Walker role. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Welcome to Walkers!",
        description: "You can now seek help from Helpanions."
      });
      setShowWalkerModal(false);
      navigate("/walker-dashboard");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <HelpanionHome
            profile={profile}
            profileProgress={profileProgress.completion}
            onNavigateToProfile={() => setActiveTab("profile")}
            onNavigateToServices={() => setActiveTab("services")}
            onNavigateToAvailability={() => setActiveTab("availability")}
          />
        );
      case "profile":
        return (
          <HelpanionProfile profile={profile} updateProfile={updateProfile} />
        );
      case "services":
        return <HelpanionServices profileProgress={profileProgress.completion} isProfileComplete={profileProgress.isComplete} />;
      case "availability":
        return <HelpanionAvailability profileProgress={profileProgress.completion} isProfileComplete={profileProgress.isComplete} />;
      case "bookings":
        return <HelpanionBookings />;
      case "reviews":
        return <HelpanionReviews />;
      case "settings":
        return (
          <HelpanionSettings profile={profile} updateProfile={updateProfile} />
        );
      default:
        return null;
    }
  };

  const renderSidebar = () => (
    <div className="h-full flex flex-col" style={{ backgroundColor: BG_NEUTRAL }}>
      <div className="p-4 border-b" style={{ borderColor: "#ddd" }}>
        <h1 className="text-lg font-semibold text-gray-900">WO Commune</h1>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-sm text-gray-600">
              Hi {profile.display_name || "Helpanion"}
            </p>
            <p className="text-xs text-gray-500">(Helpanion)</p>
          </div>
          {hasRole("walker") && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Walker</span>
              <Switch
                checked={false}
                onCheckedChange={handleRoleToggle}
                style={{
                  "--switch-color": PRIMARY_GREEN
                } as React.CSSProperties}
              />
            </div>
          )}
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Profile Progress</span>
            <span>{profileProgress.completion}%</span>
          </div>
          <Progress
            value={profileProgress.completion}
            className="h-2"
            style={{ backgroundColor: "#ddd" }}
          />
          {!profileProgress.isComplete && profileProgress.missingFields.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Missing: {profileProgress.missingFields.join(", ")}
            </p>
          )}
        </div>
      </div>

      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {navigationTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                activeTab === tab.key
                  ? "text-white"
                  : "text-gray-600 hover:bg-gray-200"
              )}
              style={
                activeTab === tab.key
                  ? { backgroundColor: PRIMARY_GREEN }
                  : undefined
              }
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-900">WO Commune</h1>
      <div className="flex gap-2">
        <Button
          asChild
          size="sm"
          style={{ backgroundColor: "transparent" }}
          className="hover:bg-gray-200"
        >
          <Link to="/" aria-label="Home">
            <Home className="h-4 w-4 text-gray-700" />
          </Link>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSignOut}
          className="hover:bg-gray-200"
        >
          <LogOut className="h-4 w-4 text-gray-700" />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <DashboardLayout sidebar={renderSidebar()} header={renderHeader()}>
        {renderContent()}
      </DashboardLayout>

      <Dialog open={showWalkerModal} onOpenChange={setShowWalkerModal}>
        <DialogContent className="mx-4 max-w-md">
          <DialogHeader>
            <DialogTitle>Join as a Walker</DialogTitle>
            <DialogDescription>
              You haven't joined as a Walker yet. Want to join now and start
              seeking help from other Helpanions?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="walker-name">Full Name</Label>
              <Input
                id="walker-name"
                value={walkerFormData.fullName}
                onChange={(e) =>
                  setWalkerFormData((prev) => ({
                    ...prev,
                    fullName: e.target.value
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walker-email">Email</Label>
              <Input
                id="walker-email"
                type="email"
                value={walkerFormData.email}
                onChange={(e) =>
                  setWalkerFormData((prev) => ({
                    ...prev,
                    email: e.target.value
                  }))
                }
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleBecomeWalker}
                className="flex-1 text-white"
                style={{ backgroundColor: PRIMARY_GREEN }}
              >
                Yes, Join as Walker
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowWalkerModal(false)}
                className="flex-1"
              >
                Not now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpanionDashboard;
