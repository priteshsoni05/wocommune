import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useUserRoles } from "@/hooks/useUserRoles";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { TodaysSessions } from "@/components/dashboard/TodaysSessions";
import { UpcomingBookings } from "@/components/dashboard/UpcomingBookings";
import { ProfileStatus } from "@/components/dashboard/ProfileStatus";
import { EarningsSummary } from "@/components/dashboard/EarningsSummary";
import { CalendarSlotManager } from "@/components/dashboard/CalendarSlotManager";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MyServices } from "@/components/dashboard/MyServices";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const HelpanionDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { hasRole, addRole } = useUserRoles();
  const navigate = useNavigate();
  const { toast } = useToast();
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <WelcomeHeader userName={`${profile.display_name || 'Helpanion'} (Helpanion)`} />
            {hasRole('walker') && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Switch to Walker</span>
                <Switch 
                  checked={false}
                  onCheckedChange={handleRoleToggle}
                />
              </div>
            )}
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
        
        {!hasRole('walker') && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Want to seek help too?
              </CardTitle>
              <CardDescription>
                Become a Walker to access guidance from other Helpanions in the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowWalkerModal(true)}>
                Become a Walker →
              </Button>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-8 space-y-6">
            <TodaysSessions />
            <div id="my-services">
              <MyServices />
            </div>
            <UpcomingBookings />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <ProfileStatus status={profile.status} />
            <EarningsSummary />
            <CalendarSlotManager />
            <QuickActions />
          </div>
        </div>
      </div>

      {/* Become Walker Modal */}
      <Dialog open={showWalkerModal} onOpenChange={setShowWalkerModal}>
        <DialogContent>
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
    </div>
  );
};

export default HelpanionDashboard;