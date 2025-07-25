import { Calendar, Clock, Settings, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAvailabilitySlots } from "@/hooks/useAvailabilitySlots";
import { AddSlotDialog } from "./AddSlotDialog";
import { useBookings } from "@/hooks/useBookings";
import { toast } from "sonner";

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

const getRelativeDay = (dayOfWeek: number) => {
  const today = new Date().getDay();
  const tomorrow = (today + 1) % 7;
  
  if (dayOfWeek === today) return 'Today';
  if (dayOfWeek === tomorrow) return 'Tomorrow';
  return dayNames[dayOfWeek];
};

export const CalendarSlotManager = () => {
  const { slots, loading, deleteSlot, updateSlot } = useAvailabilitySlots();
  const { bookings } = useBookings();

  // Filter available slots (not booked)
  const availableSlots = slots.filter(slot => {
    if (!slot.is_available) return false;
    
    // Check if this slot is booked
    const isBooked = bookings.some(booking => {
      const bookingDay = new Date(booking.booking_date).getDay();
      const slotStart = slot.start_time;
      const slotEnd = slot.end_time;
      const bookingStart = booking.start_time;
      const bookingEnd = booking.end_time;
      
      return bookingDay === slot.day_of_week && 
             bookingStart < slotEnd && 
             bookingEnd > slotStart &&
             booking.status !== 'cancelled';
    });
    
    return !isBooked;
  });

  // Get booked slots
  const bookedSlots = slots.filter(slot => {
    return bookings.some(booking => {
      const bookingDay = new Date(booking.booking_date).getDay();
      const slotStart = slot.start_time;
      const slotEnd = slot.end_time;
      const bookingStart = booking.start_time;
      const bookingEnd = booking.end_time;
      
      return bookingDay === slot.day_of_week && 
             bookingStart < slotEnd && 
             bookingEnd > slotStart &&
             booking.status !== 'cancelled';
    });
  });

  const handleToggleAvailability = async (slotId: string, currentStatus: boolean) => {
    const result = await updateSlot(slotId, { is_available: !currentStatus });
    if (result) {
      toast.success(`Slot ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
    } else {
      toast.error('Failed to update slot');
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    const result = await deleteSlot(slotId);
    if (result) {
      toast.success('Slot deleted successfully');
    } else {
      toast.error('Failed to delete slot');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar & Availability
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Manage
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {availableSlots.length} slots available this week
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Available Slots
          </h4>
          {availableSlots.length > 0 ? (
            <div className="space-y-2">
              {availableSlots.slice(0, 3).map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div>
                    <span className="text-sm font-medium">{getRelativeDay(slot.day_of_week)}</span>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      Open
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleToggleAvailability(slot.id, slot.is_available)}
                        >
                          {slot.is_available ? 'Disable' : 'Enable'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
              {availableSlots.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{availableSlots.length - 3} more slots
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No available slots</p>
          )}
        </div>

        {bookedSlots.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-sm font-medium">Booked Slots</h4>
            {bookedSlots.slice(0, 2).map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-2 bg-accent/30 rounded">
                <div>
                  <span className="text-sm font-medium">{getRelativeDay(slot.day_of_week)}</span>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                  </p>
                </div>
                <Badge className="text-xs">
                  Booked
                </Badge>
              </div>
            ))}
          </div>
        )}
        
        <AddSlotDialog />
      </CardContent>
    </Card>
  );
};