import { CheckCircle, AlertCircle, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileStatusProps {
  status: 'active' | 'in_review' | 'pending';
}

export const ProfileStatus = ({ status = 'active' }: ProfileStatusProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleViewPublic = () => {
    if (user) {
      window.open(`/profile/${user.id}`, '_blank');
    }
  };

  const handleEditProfile = () => {
    navigate('/helpanion-dashboard');
  };
  const statusConfig = {
    active: {
      icon: CheckCircle,
      label: 'Active',
      description: 'Your profile is live and accepting bookings',
      variant: 'default' as const,
      color: 'text-success'
    },
    in_review: {
      icon: AlertCircle,
      label: 'In Review',
      description: 'We\'re reviewing your recent updates',
      variant: 'secondary' as const,
      color: 'text-warning'
    },
    pending: {
      icon: AlertCircle,
      label: 'Pending',
      description: 'Complete your profile to start helping',
      variant: 'destructive' as const,
      color: 'text-destructive'
    }
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          Profile Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <StatusIcon className={`h-5 w-5 ${config.color}`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{config.label}</span>
              <Badge variant={config.variant} className="text-xs">
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 flex-1"
            onClick={handleEditProfile}
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 flex-1"
            onClick={handleViewPublic}
          >
            <Eye className="h-4 w-4" />
            View Public
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};