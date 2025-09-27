import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOptimizedProfile } from "@/hooks/useOptimizedProfile";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useServices } from "@/hooks/useServices";
import { useBookings } from "@/hooks/useBookings";
import { useRolePersistence } from "@/hooks/useRolePersistence";
import { RoleSwitchToggle } from "@/components/auth/RoleSwitchToggle";
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
  LogOut,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
// HelpanionHome component is defined inline now
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

const PRIMARY_GREEN = "#193232";
const BG_NEUTRAL = "#ffffff";

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
  const { profile, loading: profileLoading, updateProfile, refetch } = useOptimizedProfile();
  const { hasRole, addRole } = useUserRoles();
  const { services } = useServices();
  const { bookings } = useBookings('helpanion');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId } = useParams();
  
  // Role persistence
  const { setActiveRole, clearRoleData, handleCorruptedData } = useRolePersistence();
  
  // Use the unified profile progress hook
  const profileProgress = useProfileProgress(profile);

  const [activeTab, setActiveTab] = useState<TabKey>("home");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    
    // Check if user is accessing their own dashboard
    if (user && userId && user.id !== userId) {
      navigate("/auth");
      return;
    }
  }, [user, authLoading, navigate, userId]);

  useEffect(() => {
    if (profile && user) {
      // Set active role in storage for persistence
      const success = setActiveRole('helpanion');
      if (!success) {
        console.error('Failed to set role');
        handleCorruptedData();
      }
      
      // Update database as backup only if role is different
      if (profile.last_active_role !== "helpanion") {
        updateProfile({ last_active_role: "helpanion" });
      }
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

  if (!user) {
    return null;
  }

  // Define all handler functions first
  const handleSignOut = async () => {
    // Clear role data and any persisted form data, then sign out
    clearRoleData();
    // The signOut function in AuthContext will also clear form data
    await signOut();
    navigate("/wo-commune");
  };


  // Define render functions after handlers
  const renderSidebar = () => (
    <div className="h-full flex flex-col" style={{ backgroundColor: BG_NEUTRAL }}>
      <div className="p-4 border-b" style={{ borderColor: "#ddd" }}>
        <h1 className="text-lg font-semibold text-gray-900">WO Commune</h1>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-sm text-gray-600">
              Hi {profile?.display_name || "Helpanion"}
            </p>
            <p className="text-xs text-gray-500">(Helpanion)</p>
          </div>
          <RoleSwitchToggle currentRole="helpanion" />
        </div>
        {profile && (
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
        )}
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


  // Don't render dashboard if profile is not loaded
  if (!profile) {
    return null;
  }

  // Remove the old calculateProfileProgress function - using unified hook now


  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-5">
            {/* Welcome Header */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                    Hi {profile.display_name?.split(' ')[0] || 'Helpanion'} 👋
                  </h1>
                  <p className="text-sm lg:text-base text-muted-foreground">
                    Welcome to your Helpanion dashboard
                  </p>
                </div>
                {profile?.username && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(`/${profile.username}`, '_blank')}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:inline">View Public Profile</span>
                    <span className="sm:hidden">Public</span>
                  </Button>
                )}
              </div>
            </div>


            {/* Profile Progress Card */}
            <div className="border border-primary/20 bg-primary/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm lg:text-base font-semibold">Profile Progress</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground">
                    Complete your profile to start offering help
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg lg:text-xl font-bold text-primary">{profileProgress.completion}%</span>
                  <p className="text-xs text-muted-foreground">Complete</p>
                </div>
              </div>
              <Progress value={profileProgress.completion} className="h-1.5 lg:h-2" />
              <div className="mt-4">
                {profileProgress.completion < 80 ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      Complete your profile to start offering help to the community
                    </p>
                    <Button onClick={() => setActiveTab("profile")} size="sm" className="w-full sm:w-auto text-xs h-8">
                      Complete Profile
                      <ChevronRight className="ml-2 h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600">
                    <span className="text-sm font-medium">
                      Your profile is ready! You can now start offering help.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer" onClick={() => setActiveTab("profile")}>
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Update Profile</h3>
                    <p className="text-sm text-muted-foreground">Manage your profile information</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer" onClick={() => setActiveTab("services")}>
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Create Services</h3>
                    <p className="text-sm text-muted-foreground">Offer your expertise</p>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer" onClick={() => setActiveTab("availability")}>
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Set Availability</h3>
                    <p className="text-sm text-muted-foreground">Manage your schedule</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "profile":
        return profile ? (
          <HelpanionProfile profile={profile} updateProfile={updateProfile} />
        ) : null;
      case "services":
        return <HelpanionServices profileProgress={profileProgress.completion} isProfileComplete={profileProgress.isComplete} />;
      case "availability":
        return <HelpanionAvailability profileProgress={profileProgress.completion} isProfileComplete={profileProgress.isComplete} />;
      case "bookings":
        return <HelpanionBookings />;
      case "reviews":
        return <HelpanionReviews />;
      case "settings":
        return profile ? (
          <HelpanionSettings profile={profile} updateProfile={updateProfile} />
        ) : null;
      default:
        return null;
    }
  };


  return (
    <>
      <DashboardLayout sidebar={renderSidebar()} header={renderHeader()}>
        {renderContent()}
      </DashboardLayout>
    </>
  );
};

export default HelpanionDashboard;
