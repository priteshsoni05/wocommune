import { Plus, DollarSign, Share2, Settings, BookOpen, MessageCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateServiceDialog } from "@/components/dashboard/CreateServiceDialog";
import { useToast } from "@/hooks/use-toast";
import { useServices } from "@/hooks/useServices";

export const QuickActions = () => {
  const { toast } = useToast();
  const { services } = useServices();
  
  const handleShareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/helper`;
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Link copied!",
      description: "Your booking link has been copied to clipboard"
    });
  };

  const scrollToServices = () => {
    const servicesElement = document.getElementById('my-services');
    if (servicesElement) {
      servicesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const actions = [
    {
      icon: Plus,
      label: 'Create Service',
      description: 'Add a new offering',
      component: true // This will be handled specially
    },
    {
      icon: Package,
      label: 'Manage Services',
      description: `${services.length} service${services.length === 1 ? '' : 's'}`,
      onClick: scrollToServices
    },
    {
      icon: Share2,
      label: 'Share Profile',
      description: 'Get your booking link',
      onClick: handleShareProfile
    },
    {
      icon: DollarSign,
      label: 'Edit Pricing',
      description: 'Update your rates',
      onClick: () => console.log('Edit pricing')
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      description: 'Chat with seekers',
      onClick: () => console.log('Messages')
    },
    {
      icon: Settings,
      label: 'Settings',
      description: 'Account preferences',
      onClick: () => console.log('Settings')
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Quick Actions</CardTitle>
        <p className="text-sm text-muted-foreground">
          Everything you need at your fingertips
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            
            if (action.component && action.label === 'Create Service') {
              return (
                <CreateServiceDialog key={action.label}>
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-muted/50"
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{action.label}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                </CreateServiceDialog>
              );
            }
            
            return (
              <Button
                key={action.label}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-muted/50"
                onClick={action.onClick}
              >
                <Icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};