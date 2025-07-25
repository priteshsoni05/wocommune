import { Plus, DollarSign, Share2, Settings, BookOpen, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'Create Service',
      description: 'Add a new offering',
      onClick: () => console.log('Create service')
    },
    {
      icon: DollarSign,
      label: 'Edit Pricing',
      description: 'Update your rates',
      onClick: () => console.log('Edit pricing')
    },
    {
      icon: Share2,
      label: 'Share Profile',
      description: 'Get your booking link',
      onClick: () => console.log('Share profile')
    },
    {
      icon: BookOpen,
      label: 'Resources',
      description: 'Helper guides & tips',
      onClick: () => console.log('Resources')
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