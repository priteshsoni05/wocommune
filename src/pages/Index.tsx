import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { TodaysSessions } from "@/components/dashboard/TodaysSessions";
import { UpcomingBookings } from "@/components/dashboard/UpcomingBookings";
import { ProfileStatus } from "@/components/dashboard/ProfileStatus";
import { EarningsSummary } from "@/components/dashboard/EarningsSummary";
import { CalendarSlotManager } from "@/components/dashboard/CalendarSlotManager";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { MyServices } from "@/components/dashboard/MyServices";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/helpanion');
    }
  }, [user, authLoading, navigate]);

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
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <WelcomeHeader userName={profile.display_name || 'Helper'} />
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
        
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
    </div>
  );
};

export default Index;
