import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

interface ServiceBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  availability: AvailabilitySlot[];
  helperId: string;
  helperName: string;
}

export const ServiceBookingDialog = ({ 
  open, 
  onOpenChange, 
  service, 
  availability, 
  helperId, 
  helperName 
}: ServiceBookingDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const { timeSlots, loading: slotsLoading, formatTime, refreshSlots } = useTimeSlots(availability, selectedDate, helperId);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getAvailableDays = () => {
    return availability.reduce((acc, slot) => {
      if (!acc.includes(slot.day_of_week)) {
        acc.push(slot.day_of_week);
      }
      return acc;
    }, [] as number[]);
  };

  const disabledDays = (date: Date) => {
    const dayOfWeek = date.getDay();
    const availableDays = getAvailableDays();
    // Compare by date only (avoid disabling today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return !availableDays.includes(dayOfWeek) || compareDate < today;
  };

  const handleSlotSelect = (timeSlot: string) => {
    setSelectedSlot(selectedSlot === timeSlot ? null : timeSlot);
  };

  const handleBookSlot = () => {
    if (selectedSlot && selectedDate) {
      setShowBookingForm(true);
    }
  };

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':');
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleBookingSuccess = () => {
    if (selectedDate && selectedSlot) {
      const endTime = calculateEndTime(selectedSlot, service.duration_minutes || 60);
      setBookingDetails({
        serviceName: service.title,
        date: selectedDate,
        time: `${formatTime(selectedSlot)} - ${formatTime(endTime)}`,
        duration: service.duration_minutes || 60,
        helperName: helperName
      });
      setShowSuccessDialog(true);
      setShowBookingForm(false);
      setSelectedSlot(null);
      // Refresh the time slots to show the newly booked slot as unavailable
      refreshSlots();
      // Close the main dialog
      onOpenChange(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="inset-0 w-screen h-[100dvh] max-w-none max-h-none sm:inset-0 sm:w-screen sm:h-[100dvh] sm:max-w-none sm:max-h-none sm:rounded-none sm:translate-x-0 sm:translate-y-0 sm:left-0 sm:top-0 overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold" style={{ color: '#193232' }}>Book: {service.title}</DialogTitle>
            <DialogDescription className="text-base text-gray-600">
              Select your preferred date and time slot
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Calendar Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <CalendarIcon className="w-5 h-5" style={{ color: '#193232' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#193232' }}>Select a Date</h3>
              </div>
              
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={disabledDays}
                className="rounded-md border w-full"
              />
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Available Days:</h4>
                <div className="flex flex-wrap gap-2">
                  {getAvailableDays().map(dayIndex => (
                    <Badge key={dayIndex} variant="outline" className="text-xs">
                      {dayNames[dayIndex]}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Slots Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="w-5 h-5" style={{ color: '#193232' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#193232' }}>Available Times</h3>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {selectedDate 
                  ? `Select a time slot for ${format(selectedDate, 'EEEE, MMMM do')}`
                  : 'Please select a date first'
                }
              </p>

              {selectedDate ? (
                <div className="space-y-4">
                  {slotsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : timeSlots.length > 0 ? (
                    <>
                       <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                         {timeSlots.map((slot) => (
                           <Button
                             key={slot.time}
                             variant={selectedSlot === slot.time ? "default" : "outline"}
                             className={`justify-center text-center text-sm ${
                               !slot.available 
                                 ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
                                 : ""
                             }`}
                             onClick={() => slot.available && handleSlotSelect(slot.time)}
                             disabled={!slot.available}
                           >
                             {formatTime(slot.time)}
                             {!slot.available && (
                               <span className="ml-1 text-xs">(Booked)</span>
                             )}
                           </Button>
                         ))}
                       </div>
                      
                      {selectedSlot && (
                        <div className="space-y-3 pt-4 border-t">
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-sm font-medium mb-2">Selected Time:</p>
                            <p className="text-lg">{formatTime(selectedSlot)} - {formatTime(calculateEndTime(selectedSlot, service.duration_minutes || 60))}</p>
                            <p className="text-sm text-muted-foreground">Duration: {service.duration_minutes || 60} minutes</p>
                          </div>
                          <Button 
                            className="w-full text-white font-semibold hover:opacity-90" 
                            size="lg"
                            onClick={handleBookSlot}
                            style={{ backgroundColor: '#193232' }}
                          >
                            Continue to Booking Details
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
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Form Dialog */}
      {selectedSlot && selectedDate && (
        <BookingDialog
          open={showBookingForm}
          onOpenChange={setShowBookingForm}
          service={service}
          selectedDate={selectedDate}
          selectedTimeSlot={`${formatTime(selectedSlot)} - ${formatTime(calculateEndTime(selectedSlot, service.duration_minutes || 60))}`}
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
    </>
  );
};