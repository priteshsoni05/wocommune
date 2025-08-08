import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Profile } from "@/hooks/useProfile";
import { useServices } from "@/hooks/useServices";
import { useAvailabilitySlots } from "@/hooks/useAvailabilitySlots";

interface GettingStartedChecklistProps {
  profile: Profile;
  onNavigateToProfile: () => void;
  onNavigateToServices: () => void;
  onNavigateToAvailability: () => void;
}

export const GettingStartedChecklist = ({ 
  profile, 
  onNavigateToProfile, 
  onNavigateToServices, 
  onNavigateToAvailability 
}: GettingStartedChecklistProps) => {
  const { services } = useServices();
  const { slots } = useAvailabilitySlots();

  // Check completion status for each step
  const profileComplete = !!(profile.display_name && profile.email);
  const bioComplete = !!(profile.bio && (profile.use_case || profile.skills));
  const servicesComplete = services.length > 0;
  const availabilityComplete = slots.length > 0;

  const steps = [
    {
      id: 1,
      title: "Complete your profile information",
      completed: profileComplete,
      action: onNavigateToProfile,
      description: "Add your name, email and basic information"
    },
    {
      id: 2,
      title: "Add your bio and expertise areas",
      completed: bioComplete,
      action: onNavigateToProfile,
      description: "Tell others about your background and skills"
    },
    {
      id: 3,
      title: "Create your first service offering",
      completed: servicesComplete,
      action: onNavigateToServices,
      description: "Define what kind of help you can provide"
    },
    {
      id: 4,
      title: "Set your availability schedule",
      completed: availabilityComplete,
      action: onNavigateToAvailability,
      description: "Choose when you're available to help"
    }
  ];

  const completedCount = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const allComplete = completedCount === totalSteps;

  return (
    <Card>
      <CardHeader className="pb-3 lg:pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm lg:text-base">Getting Started</CardTitle>
            <CardDescription className="text-xs lg:text-sm">
              Follow these steps to become an active Helpanion
            </CardDescription>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-primary">
              {completedCount}/{totalSteps}
            </span>
            <p className="text-xs text-muted-foreground">Complete</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {allComplete ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="h-12 w-12 mx-auto text-success" />
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Congratulations! 🎉
              </h3>
              <p className="text-sm text-muted-foreground">
                You're all set to start helping others in the community
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="group">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 ${
                    step.completed 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}>
                    {step.completed ? '✓' : step.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className={`text-sm font-medium ${
                          step.completed ? 'text-foreground' : 'text-foreground'
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                      {!step.completed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={step.action}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 text-xs"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};