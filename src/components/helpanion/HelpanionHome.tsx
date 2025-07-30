import { Profile } from "@/hooks/useProfile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight } from "lucide-react";

interface HelpanionHomeProps {
  profile: Profile;
  profileProgress: number;
  onNavigateToProfile: () => void;
}

export const HelpanionHome = ({ profile, profileProgress, onNavigateToProfile }: HelpanionHomeProps) => {
  const firstName = profile.display_name?.split(' ')[0] || 'Helpanion';
  
  return (
    <div className="p-6 space-y-5">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          Hi {firstName} 👋
        </h1>
        <p className="text-base text-muted-foreground">
          Welcome to your Helpanion dashboard
        </p>
      </div>

      {/* Profile Progress Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Profile Progress</CardTitle>
              <CardDescription className="text-sm">
                Complete your profile to start offering help
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-primary">{profileProgress}%</span>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={profileProgress} className="h-2" />
        </CardHeader>
        <CardContent>
          {profileProgress < 80 ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Complete your profile to start offering help to the community
              </p>
              <Button onClick={onNavigateToProfile} className="ml-4">
                Complete Profile
                <ArrowRight className="ml-2 h-4 w-4" />
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
        <CardContent className="pt-5">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              "Your experiences can light someone's path"
            </h3>
            <p className="text-sm text-muted-foreground">
              Every skill you've learned, every challenge you've overcome, and every insight you've gained 
              has the power to guide someone else on their journey.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary">0</h3>
              <p className="text-xs text-muted-foreground">Active Services</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary">0</h3>
              <p className="text-xs text-muted-foreground">Upcoming Sessions</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary">0</h3>
              <p className="text-xs text-muted-foreground">Total Reviews</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started Guide */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Getting Started</CardTitle>
          <CardDescription className="text-sm">
            Follow these steps to become an active Helpanion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                profile.display_name ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {profile.display_name ? '✓' : '1'}
              </div>
              <span className="text-sm">Complete your profile information</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                profile.bio ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {profile.bio ? '✓' : '2'}
              </div>
              <span className="text-sm">Add your bio and expertise areas</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">
                3
              </div>
              <span className="text-sm">Create your first service offering</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs">
                4
              </div>
              <span className="text-sm">Set your availability schedule</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};