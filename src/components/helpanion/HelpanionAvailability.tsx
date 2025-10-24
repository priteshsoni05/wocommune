import { useState } from "react";
import { useAvailabilitySlots } from "@/hooks/useAvailabilitySlots";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, Calendar, Plus, Trash2, AlertCircle } from "lucide-react";

interface HelpanionAvailabilityProps {
  profileProgress: number;
  isProfileComplete: boolean;
}

const daysOfWeek = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const timeSlots = Array.from({ length: 24 * 4 }, (_, i) => {
  const hours = Math.floor(i / 4);
  const minutes = (i % 4) * 15;
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return {
    value: timeString,
    label: new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  };
});

export const HelpanionAvailability = ({ profileProgress, isProfileComplete }: HelpanionAvailabilityProps) => {
  const { slots, createSlot, deleteSlot, loading } = useAvailabilitySlots();
  const { toast } = useToast();
  
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { 
    formData, 
    updateFormData, 
    resetFormData 
  } = useFormPersistence({
    key: "helpanion_availability",
    initialValues: {
      day_of_week: 1,
      start_time: "09:00",
      end_time: "17:00",
      is_available: true
    }
  });

  const isProfileIncomplete = !isProfileComplete;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProfileIncomplete) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile (display name, username, bio, profile photo, and skills) before setting availability.",
        variant: "destructive",
      });
      return;
    }

    const result = await createSlot(formData);
    
    if (!result) {
      toast({
        title: "Error",
        description: "Failed to add availability slot.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Availability slot added successfully!",
      });
      resetFormData();
      setShowAddForm(false);
    }
  };

  const handleDelete = async (slotId: string) => {
    if (window.confirm("Are you sure you want to delete this availability slot?")) {
      const result = await deleteSlot(slotId);
      if (!result) {
        toast({
          title: "Error",
          description: "Failed to delete availability slot.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Availability slot deleted successfully!",
        });
      }
    }
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    const day = daysOfWeek.find(d => d.value === slot.day_of_week)?.label || 'Unknown';
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {} as Record<string, typeof slots>);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Availability</h1>
          <p className="text-lg text-muted-foreground">
            Set your available days and times for sessions
          </p>
        </div>
        
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={isProfileIncomplete}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Availability
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
                  Complete your profile (display name, username, bio, profile photo, and skills) before setting availability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Availability Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Availability Slot</CardTitle>
            <CardDescription>
              Set your available days and time ranges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="day_of_week">Day of Week</Label>
                  <Select 
                    value={formData.day_of_week.toString()} 
                    onValueChange={(value) => updateFormData({ day_of_week: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_time">Start Time</Label>
                  <Select 
                    value={formData.start_time} 
                    onValueChange={(value) => updateFormData({ start_time: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.slice(0, -4).map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_time">End Time</Label>
                  <Select 
                    value={formData.end_time} 
                    onValueChange={(value) => updateFormData({ end_time: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.slice(4).map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="is_available"
                  checked={formData.is_available}
                  onCheckedChange={(checked) => updateFormData({ is_available: checked })}
                />
                <Label htmlFor="is_available">Available for booking</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  Add Availability
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Current Availability */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Availability</h2>
        
        {slots.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No availability set</h3>
                <p className="text-muted-foreground mb-4">
                  Add your available days and times so people can book sessions with you
                </p>
                <Button onClick={() => setShowAddForm(true)} disabled={isProfileIncomplete}>
                  <Plus className="h-4 w-4 mr-2" />
                  Set Your Availability
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(groupedSlots).map(([day, daySlots]) => (
              <Card key={day}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {day}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {daySlots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {new Date(`2000-01-01T${slot.start_time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })} - {new Date(`2000-01-01T${slot.end_time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={slot.is_available ? "default" : "secondary"}>
                          {slot.is_available ? "Available" : "Blocked"}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(slot.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">💡 Availability Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Set 15-minute buffer between sessions for preparation</p>
          <p>• Consider your timezone when setting availability</p>
          <p>• Blocked slots won't show up for booking</p>
          <p>• You can add multiple time ranges for the same day</p>
        </CardContent>
      </Card>
    </div>
  );
};