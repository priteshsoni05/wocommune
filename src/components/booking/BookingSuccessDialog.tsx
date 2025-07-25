import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, MessageCircle } from "lucide-react";
import { format } from "date-fns";

interface BookingSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingDetails: {
    serviceName: string;
    date: Date;
    time: string;
    duration: number;
    helperName: string;
  };
}

export const BookingSuccessDialog = ({
  open,
  onOpenChange,
  bookingDetails
}: BookingSuccessDialogProps) => {
  const addToCalendar = () => {
    const startDateTime = new Date(bookingDetails.date);
    const [hours, minutes] = bookingDetails.time.split(':');
    startDateTime.setHours(parseInt(hours), parseInt(minutes));
    
    const endDateTime = new Date(startDateTime.getTime() + bookingDetails.duration * 60000);
    
    const formatDateForCalendar = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(bookingDetails.serviceName + ' Session')}&dates=${formatDateForCalendar(startDateTime)}/${formatDateForCalendar(endDateTime)}&details=${encodeURIComponent(`Session with ${bookingDetails.helperName}`)}&location=${encodeURIComponent('Online Session')}`;
    
    window.open(calendarUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-6 h-6" />
            <span>Booking Confirmed!</span>
          </DialogTitle>
          <DialogDescription>
            Your session has been successfully booked
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-green-800">Session Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-green-700">
                <span className="font-medium">Service:</span>
                <span>{bookingDetails.serviceName}</span>
              </div>
              <div className="flex items-center space-x-2 text-green-700">
                <Calendar className="w-4 h-4" />
                <span>{format(bookingDetails.date, 'EEEE, MMMM do, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-2 text-green-700">
                <Clock className="w-4 h-4" />
                <span>{bookingDetails.time} ({bookingDetails.duration} minutes)</span>
              </div>
              <div className="flex items-center space-x-2 text-green-700">
                <span className="font-medium">Helpanion:</span>
                <span>{bookingDetails.helperName}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="space-y-3">
            <h4 className="font-medium">What's Next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• The Helpanion will also be notified</li>
              <li>• Join the session at the scheduled time</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={addToCalendar}
              className="w-full"
              variant="outline"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
            
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Continue Browsing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};