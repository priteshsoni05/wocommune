import { Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceCard } from "./ServiceCard";
import { CreateServiceDialog } from "./CreateServiceDialog";
import { useServices } from "@/hooks/useServices";

export const MyServices = () => {
  const { services, loading } = useServices();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            My Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-secondary">Loading services...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeServices = services.filter(service => service.is_active);
  const inactiveServices = services.filter(service => !service.is_active);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              My Services
            </CardTitle>
            <p className="text-secondary mt-1">
              {services.length > 0 ? (
                <>
                  {services.length} service{services.length === 1 ? '' : 's'} • {activeServices.length} active
                </>
              ) : (
                "Manage your service offerings"
              )}
            </p>
          </div>
          <CreateServiceDialog>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </CreateServiceDialog>
        </div>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">No services yet</h3>
              <p className="text-secondary max-w-sm mx-auto">
                Create your first service to start helping others and earning money.
              </p>
            </div>
            <CreateServiceDialog>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Service
              </Button>
            </CreateServiceDialog>
          </div>
        ) : (
          <div className="space-y-6">
            {activeServices.length > 0 && (
              <div className="space-y-3">
                <h6>
                  Active Services ({activeServices.length})
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            )}
            
            {inactiveServices.length > 0 && (
              <div className="space-y-3">
                <h6>
                  Inactive Services ({inactiveServices.length})
                </h6>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inactiveServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};