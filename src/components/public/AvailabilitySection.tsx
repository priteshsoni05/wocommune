import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { AvailabilitySlot } from "@/hooks/useAvailabilitySlots";
import { format, addDays, startOfWeek } from "date-fns";

interface AvailabilitySectionProps {
  availability: AvailabilitySlot[];
  helperId: string;
}

export const AvailabilitySection = ({ availability, helperId }: AvailabilitySectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAvailableDays = () => {
    return availability.reduce((acc, slot) => {
      if (!acc.includes(slot.day_of_week)) {
        acc.push(slot.day_of_week);
      }
      return acc;
    }, [] as number[]);
  };

  const getSlotsForDay = (dayOfWeek: number) => {
    return availability.filter(slot => slot.day_of_week === dayOfWeek);
  };

  const getSelectedDaySlots = () => {
    if (!selectedDate) return [];
    const dayOfWeek = selectedDate.getDay();
    return getSlotsForDay(dayOfWeek);
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(selectedSlot === slotId ? null : slotId);
  };

  const handleBookSlot = () => {
    if (selectedSlot && selectedDate) {
      // This would normally open a booking dialog or redirect to booking page
      console.log('Booking slot:', selectedSlot, 'for date:', selectedDate);
      alert('Booking functionality would be implemented here!');
    }
  };

  const disabledDays = (date: Date) => {
    const dayOfWeek = date.getDay();
    const availableDays = getAvailableDays();
    return !availableDays.includes(dayOfWeek) || date < new Date();
  };

  if (availability.length === 0) {
    return (
      <section className="py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Availability</h2>
          <p className="text-muted-foreground">No availability slots are currently configured.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-foreground text-center">Book a Session</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5" />
                <span>Select a Date</span>
              </CardTitle>
              <CardDescription>
                Choose from available days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={disabledDays}
                className="rounded-md border"
              />
              
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Available Days:</h4>
                <div className="flex flex-wrap gap-2">
                  {getAvailableDays().map(dayIndex => (
                    <Badge key={dayIndex} variant="outline" className="text-xs">
                      {dayNames[dayIndex]}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Available Times</span>
              </CardTitle>
              <CardDescription>
                {selectedDate 
                  ? `Select a time slot for ${format(selectedDate, 'EEEE, MMMM do')}`
                  : 'Please select a date first'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                <div className="space-y-4">
                  {getSelectedDaySlots().length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 gap-2">
                        {getSelectedDaySlots().map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot === slot.id ? "default" : "outline"}
                            className="justify-start text-left"
                            onClick={() => handleSlotSelect(slot.id)}
                          >
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </Button>
                        ))}
                      </div>
                      
                      {selectedSlot && (
                        <Button 
                          className="w-full" 
                          size="lg"
                          onClick={handleBookSlot}
                        >
                          Book Selected Time
                        </Button>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      No available time slots for this day
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Select a date to view available time slots
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};