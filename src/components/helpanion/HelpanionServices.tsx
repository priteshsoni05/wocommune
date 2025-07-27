import { useState } from "react";
import { useServices } from "@/hooks/useServices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, DollarSign, Clock, AlertCircle, Lightbulb } from "lucide-react";

interface HelpanionServicesProps {
  profileProgress: number;
}

const helpTypes = ["One-time", "Ongoing", "Review", "Freelance"];
const categories = ["College", "Career", "Wellness", "Productivity", "Business", "Creative", "Technical"];
const durations = [30, 45, 60, 90];
const modes = ["Zoom", "Google Meet", "Phone Call", "In-person"];

export const HelpanionServices = ({ profileProgress }: HelpanionServicesProps) => {
  const { services, createService, updateService, deleteService, loading } = useServices();
  const { toast } = useToast();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price_per_hour: 0,
    duration_minutes: 60,
    is_active: true,
    image_url: "",
    // Additional fields to store in description
    helpType: "",
    mode: "",
    outcomes: ""
  });

  const isProfileIncomplete = profileProgress < 60;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProfileIncomplete) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete at least 60% of your profile before creating services.",
        variant: "destructive",
      });
      return;
    }

    const serviceData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price_per_hour: formData.price_per_hour,
      duration_minutes: formData.duration_minutes,
      is_active: formData.is_active,
      image_url: formData.image_url || null,
    };

    try {
      let result;
      if (editingService) {
        result = await updateService(editingService, serviceData);
      } else {
        result = await createService(serviceData);
      }

      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to save service. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: editingService ? "Service updated successfully!" : "Service created successfully!",
        });
        resetForm();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      price_per_hour: 0,
      duration_minutes: 60,
      is_active: true,
      image_url: "",
      helpType: "",
      mode: "",
      outcomes: ""
    });
    setShowCreateForm(false);
    setEditingService(null);
  };

  const handleEdit = (service: any) => {
    setFormData({
      title: service.title,
      description: service.description || "",
      category: service.category || "",
      price_per_hour: service.price_per_hour || 0,
      duration_minutes: service.duration_minutes,
      is_active: service.is_active,
      image_url: service.image_url || "",
      helpType: "",
      mode: "",
      outcomes: ""
    });
    setEditingService(service.id);
    setShowCreateForm(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      const result = await deleteService(serviceId);
      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to delete service.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Service deleted successfully!",
        });
      }
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Service</h1>
          <p className="text-lg text-muted-foreground">
            Share your expertise with the community
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={isProfileIncomplete}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Profile Completion Warning */}
      {isProfileIncomplete && (
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-warning" />
              <div>
                <p className="font-medium text-foreground">Profile Incomplete</p>
                <p className="text-sm text-muted-foreground">
                  Complete at least 60% of your profile before creating services. Current progress: {profileProgress}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Service Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingService ? "Edit Service" : "Create New Service"}
            </CardTitle>
            <CardDescription>
              Fill in the details to create a service offering
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Break into UI/UX Design"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="helpType">Help Type</Label>
                  <Select value={formData.helpType} onValueChange={(value) => setFormData(prev => ({ ...prev, helpType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select help type" />
                    </SelectTrigger>
                    <SelectContent>
                      {helpTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price_per_hour">Pricing</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price_per_hour"
                      type="number"
                      value={formData.price_per_hour}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_per_hour: Number(e.target.value) }))}
                      placeholder="0 for free"
                      className="pl-10"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Set to 0 for free</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Select value={formData.duration_minutes.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, duration_minutes: Number(value) }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durations.map((duration) => (
                        <SelectItem key={duration} value={duration.toString()}>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {duration} mins
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mode">Mode</Label>
                  <Select value={formData.mode} onValueChange={(value) => setFormData(prev => ({ ...prev, mode: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {modes.map((mode) => (
                        <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what's included in your service..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outcomes">Tags or Outcomes Covered</Label>
                <Input
                  id="outcomes"
                  value={formData.outcomes}
                  onChange={(e) => setFormData(prev => ({ ...prev, outcomes: e.target.value }))}
                  placeholder="Portfolio Review, Career Planning, Interview Prep (comma-separated)"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading}>
                  {editingService ? "Update Service" : "Add to Live Services"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Existing Services */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Services</h2>
        
        {services.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No services yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first service to start helping others in the community
                </p>
                <Button onClick={() => setShowCreateForm(true)} disabled={isProfileIncomplete}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Service
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <Card key={service.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        {service.category && <Badge variant="secondary">{service.category}</Badge>}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration_minutes}min
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {service.price_per_hour === 0 ? 'Free' : `$${service.price_per_hour}/hr`}
                      </span>
                    </div>
                    <Badge variant={service.is_active ? "default" : "secondary"}>
                      {service.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
