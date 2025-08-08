import { Profile } from "@/hooks/useProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight } from "lucide-react";
import { GettingStartedChecklist } from "./GettingStartedChecklist";
import { useBookings } from "@/hooks/useBookings";
import { useServices } from "@/hooks/useServices";

interface HelpanionHomeProps {
  profile: Profile;
  profileProgress: number;
  onNavigateToProfile: () => void;
  onNavigateToServices: () => void;
  onNavigateToAvailability: () => void;
}

export const HelpanionHome = ({ profile, profileProgress, onNavigateToProfile, onNavigateToServices, onNavigateToAvailability }: HelpanionHomeProps) => {
  const firstName = profile.display_name?.split(' ')[0] || 'Helpanion';
  const { services } = useServices();
  const { bookings } = useBookings();
  
  // Calculate real stats
  const activeServices = services.filter(s => s.is_active).length;
  const upcomingBookings = bookings.filter(b => 
    b.status === 'confirmed' && new Date(b.booking_date) >= new Date()
  ).length;
  
  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 lg:space-y-5">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
          Hi {firstName} 👋
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Welcome to your Helpanion dashboard
        </p>
      </div>

      {/* Profile Progress Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3 lg:pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm lg:text-base">Profile Progress</CardTitle>
              <CardDescription className="text-xs lg:text-sm">
                Complete your profile to start offering help
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-lg lg:text-xl font-bold text-primary">{profileProgress}%</span>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={profileProgress} className="h-1.5 lg:h-2" />
        </CardHeader>
        <CardContent>
          {profileProgress < 80 ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs lg:text-sm text-muted-foreground">
                Complete your profile to start offering help to the community
              </p>
              <Button onClick={onNavigateToProfile} size="sm" className="w-full sm:w-auto text-xs h-8">
                Complete Profile
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">
                Your profile is ready! You can now start offering help.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inspirational Message */}
      <Card className="bg-gradient-to-r from-accent to-secondary border-0">
        <CardContent className="pt-4 lg:pt-5">
          <div className="text-center space-y-2">
            <h3 className="text-base lg:text-lg font-semibold text-foreground">
              "Your experiences can light someone's path"
            </h3>
            <p className="text-xs lg:text-sm text-muted-foreground">
              Every skill you've learned, every challenge you've overcome, and every insight you've gained 
              has the power to guide someone else on their journey.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 lg:gap-3">
        <Card>
          <CardContent className="pt-3 lg:pt-4">
            <div className="text-center">
              <h3 className="text-lg lg:text-xl font-bold text-primary">{activeServices}</h3>
              <p className="text-xs text-muted-foreground">Active Services</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-3 lg:pt-4">
            <div className="text-center">
              <h3 className="text-lg lg:text-xl font-bold text-primary">{upcomingBookings}</h3>
              <p className="text-xs text-muted-foreground">Upcoming Sessions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-3 lg:pt-4">
            <div className="text-center">
              <h3 className="text-lg lg:text-xl font-bold text-primary">0</h3>
              <p className="text-xs text-muted-foreground">Total Reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Guide */}
      <GettingStartedChecklist 
        profile={profile}
        onNavigateToProfile={onNavigateToProfile}
        onNavigateToServices={onNavigateToServices}
        onNavigateToAvailability={onNavigateToAvailability}
      />
    </div>
  );
};