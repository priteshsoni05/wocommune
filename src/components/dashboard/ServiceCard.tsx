import { useState } from "react";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { EditServiceDialog } from "./EditServiceDialog";
import { useServices, Service } from "@/hooks/useServices";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { updateService, deleteService } = useServices();
  const { toast } = useToast();

  const handleToggleActive = async () => {
    const result = await updateService(service.id, { is_active: !service.is_active });
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update service status"
      });
    } else {
      toast({
        title: service.is_active ? "Service deactivated" : "Service activated",
        description: `${service.title} is now ${service.is_active ? 'inactive' : 'active'}`
      });
    }
  };

  const handleDelete = async () => {
    const result = await deleteService(service.id);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete service"
      });
    } else {
      toast({
        title: "Service deleted",
        description: `${service.title} has been removed`
      });
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <Card className="group relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={service.is_active ? "default" : "secondary"}>
              {service.is_active ? "Active" : "Inactive"}
            </Badge>
            {service.category && (
              <Badge variant="outline">{service.category}</Badge>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditOpen(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Service</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{service.title}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {service.image_url && (
          <div className="mb-3">
            <img
              src={service.image_url}
              alt={service.title}
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        )}

        <h3 className="font-semibold text-base mb-2">{service.title}</h3>
        {service.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {service.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="space-y-1">
            <div className="font-medium">
              ${service.price_per_hour}/hr
            </div>
            <div className="text-muted-foreground">
              {formatDuration(service.duration_minutes)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {service.is_active ? (
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            )}
            <Switch
              checked={service.is_active}
              onCheckedChange={handleToggleActive}
            />
          </div>
        </div>
      </CardContent>

      <EditServiceDialog
        service={service}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />
    </Card>
  );
};