import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { TodaysSessions } from "@/components/dashboard/TodaysSessions";
import { UpcomingBookings } from "@/components/dashboard/UpcomingBookings";
import { ProfileStatus } from "@/components/dashboard/ProfileStatus";
import { EarningsSummary } from "@/components/dashboard/EarningsSummary";
import { CalendarSlotManager } from "@/components/dashboard/CalendarSlotManager";
import { QuickActions } from "@/components/dashboard/QuickActions";

const Index = () => {
  // Mock user data - in a real app, this would come from authentication/API
  const userData = {
    name: "Jordan",
    profileStatus: 'active' as const
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <WelcomeHeader userName={userData.name} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content area */}
          <div className="lg:col-span-8 space-y-6">
            <TodaysSessions />
            <UpcomingBookings />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <ProfileStatus status={userData.profileStatus} />
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
