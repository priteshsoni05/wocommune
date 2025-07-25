import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { AvailabilitySlot } from "@/hooks/useAvailabilitySlots";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import { Service } from "@/hooks/useServices";
import { format } from "date-fns";
import { BookingDialog } from "@/components/booking/BookingDialog";
import { BookingSuccessDialog } from "@/components/booking/BookingSuccessDialog";

interface AvailabilitySectionProps {
  availability: AvailabilitySlot[];
  helperId: string;
  selectedService?: Service;
  helperName: string;
}

export const AvailabilitySection = ({ availability, helperId, selectedService, helperName }: AvailabilitySectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const { timeSlots, loading: slotsLoading, formatTime } = useTimeSlots(availability, selectedDate, helperId);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

  const handleSlotSelect = (timeSlot: string) => {
    setSelectedSlot(selectedSlot === timeSlot ? null : timeSlot);
  };

  const handleBookSlot = () => {
    if (!selectedService) {
      alert('Please select a service first from the Services section above.');
      return;
    }
    
    if (selectedSlot && selectedDate) {
      setShowBookingDialog(true);
    }
  };

  const handleBookingSuccess = () => {
    if (selectedService && selectedDate && selectedSlot) {
      const endTime = calculateEndTime(selectedSlot, selectedService.duration_minutes || 60);
      setBookingDetails({
        serviceName: selectedService.title,
        date: selectedDate,
        time: `${formatTime(selectedSlot)} - ${formatTime(endTime)}`,
        duration: selectedService.duration_minutes || 60,
        helperName: helperName
      });
      setShowSuccessDialog(true);
      setSelectedSlot(null);
      // Refresh time slots would happen automatically through the hook
    }
  };

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':');
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
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
                  {slotsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : timeSlots.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot.time}
                            variant={selectedSlot === slot.time ? "default" : "outline"}
                            className="justify-center text-center"
                            onClick={() => handleSlotSelect(slot.time)}
                            disabled={!slot.available}
                          >
                            {formatTime(slot.time)}
                          </Button>
                        ))}
                      </div>
                      
                      {selectedSlot && (
                        <div className="space-y-2">
                          {!selectedService && (
                            <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
                              ⚠️ Please select a service from the Services section above first
                            </p>
                          )}
                          <Button 
                            className="w-full" 
                            size="lg"
                            onClick={handleBookSlot}
                            disabled={!selectedService}
                          >
                            Book Selected Time
                          </Button>
                        </div>
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

      {/* Booking Dialog */}
      {selectedService && selectedSlot && selectedDate && (
        <BookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          service={selectedService}
          selectedDate={selectedDate}
          selectedTimeSlot={`${formatTime(selectedSlot)} - ${formatTime(calculateEndTime(selectedSlot, selectedService.duration_minutes || 60))}`}
          helperId={helperId}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Success Dialog */}
      {bookingDetails && (
        <BookingSuccessDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
          bookingDetails={bookingDetails}
        />
      )}
    </section>
  );
};