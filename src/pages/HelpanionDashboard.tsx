import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  }, [profile, user]);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const calculateProfileProgress = () => {
    let completed = 0;
    const total = 6;
    
    if (profile.display_name) completed++;
    if (profile.bio) completed++;
    if (profile.avatar_url) completed++;
    if (profile.username) completed++;
    if (services.length > 0) completed++;
    if (bookings.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleRoleToggle = (checked: boolean) => {
    if (checked) {
      // Switch to Walker
      if (hasRole('walker')) {
        navigate('/walker-dashboard');
      } else {
        setShowWalkerModal(true);
      }
    }
  };

  const handleBecomeWalker = async () => {
    const result = await addRole('walker');
    if (result?.error) {
      toast({
        title: "Error",
        description: "Failed to add Walker role. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to Walkers!",
        description: "You can now seek help from Helpanions.",
      });
      setShowWalkerModal(false);
      navigate('/walker-dashboard');
    }
  };

  const renderContent = () => {
    const profileProgress = calculateProfileProgress();
    
    switch (activeTab) {
      case 'home':
        return (
          <HelpanionHome 
            profile={profile} 
            profileProgress={profileProgress}
            onNavigateToProfile={() => setActiveTab('profile')}
          />
        );
      case 'profile':
        return <HelpanionProfile profile={profile} updateProfile={updateProfile} />;
      case 'services':
        return <HelpanionServices profileProgress={profileProgress} />;
      case 'availability':
        return <HelpanionAvailability profileProgress={profileProgress} />;
      case 'bookings':
        return <HelpanionBookings />;
      case 'reviews':
        return <HelpanionReviews />;
      case 'settings':
        return <HelpanionSettings profile={profile} updateProfile={updateProfile} />;
      default:
        return null;
    }
  };

  const renderSidebar = () => (
    <div className="h-full bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg lg:text-xl font-semibold text-foreground">
            WO Commune
          </h1>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Hi {profile.display_name || 'Helpanion'}</p>
            <p className="text-xs text-muted-foreground">(Helpanion)</p>
          </div>
          
          {hasRole('walker') && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Walker</span>
              <Switch 
                checked={false}
                onCheckedChange={handleRoleToggle}
              />
            </div>
          )}
        </div>
        
        {/* Profile Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Profile Progress</span>
            <span className="text-xs text-muted-foreground">{calculateProfileProgress()}%</span>
          </div>
          <Progress value={calculateProfileProgress()} className="h-2" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 lg:py-2.5 text-left rounded-lg transition-colors touch-manipulation",
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <tab.icon className="h-5 w-5 lg:h-4 lg:w-4 flex-shrink-0" />
              <span className="text-base lg:text-sm">{tab.label}</span>
              {activeTab === tab.key && (
                <ChevronRight className="h-4 w-4 lg:h-3 lg:w-3 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Become Walker CTA */}
      {!hasRole('walker') && (
        <div className="p-4 border-t border-border">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-1">
              Want to seek help too?
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Become a Walker to access guidance from other Helpanions.
            </p>
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => setShowWalkerModal(true)}
            >
              Become a Walker →
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-foreground">
        WO Commune
      </h1>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <>
      <DashboardLayout
        sidebar={renderSidebar()}
        header={renderHeader()}
      >
        {renderContent()}
      </DashboardLayout>

      {/* Become Walker Modal */}
      <Dialog open={showWalkerModal} onOpenChange={setShowWalkerModal}>
        <DialogContent className="mx-4 max-w-md">
          <DialogHeader>
            <DialogTitle>Join as a Walker</DialogTitle>
            <DialogDescription>
              You haven't joined as a Walker yet. Want to join now and start seeking help from other Helpanions?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="walker-name">Full Name</Label>
              <Input
                id="walker-name"
                value={walkerFormData.fullName}
                onChange={(e) => setWalkerFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="walker-email">Email</Label>
              <Input
                id="walker-email"
                type="email"
                value={walkerFormData.email}
                onChange={(e) => setWalkerFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleBecomeWalker} className="flex-1">
                Yes, Join as Walker
              </Button>
              <Button variant="outline" onClick={() => setShowWalkerModal(false)} className="flex-1">
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