import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Mail, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Service } from "@/hooks/useServices";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  selectedDate: Date;
  selectedTimeSlot: string;
  helperId: string;
  onBookingSuccess: () => void;
}

export const BookingDialog = ({
  open,
  onOpenChange,
  service,
  selectedDate,
  selectedTimeSlot,
  helperId,
  onBookingSuccess
}: BookingDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: ""
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const [startTime, endTime] = selectedTimeSlot.split(" - ");

  const calculateSessionEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(":");
    const startDate = new Date();
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
  };

  const sessionEndTime = calculateSessionEndTime(startTime.replace(/[^\d:]/g, ''), service.duration_minutes || 60);

  const calculateSessionPrice = () => {
    if (!service.price_per_hour) return 0;
    return (service.price_per_hour * (service.duration_minutes || 60)) / 60;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Starting booking process...');
    console.log('User:', user);
    console.log('Service:', service);
    
    setLoading(true);
    try {
      // Create a guest user ID if not authenticated - use null for anonymous users
      const bookingUserId = user?.id || null;
      
      // Convert time strings to proper format for database
      const formatTimeForDB = (timeStr: string) => {
        const cleanTime = timeStr.replace(/[^\d:]/g, '');
        return cleanTime.length === 4 ? `0${cleanTime}` : cleanTime;
      };

      const bookingData = {
        service_id: service.id,
        helper_id: helperId,
        seeker_id: bookingUserId,
        seeker_name: formData.fullName,
        seeker_email: formData.email,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: formatTimeForDB(startTime),
        end_time: sessionEndTime,
        status: 'pending',
        total_amount: calculateSessionPrice(),
        notes: formData.message || null
      };

      console.log('Booking data to insert:', bookingData);

      // For anonymous users, we can't select the booking back due to RLS
      // So we'll insert without selecting for anonymous users
      let data, error;
      
      if (user?.id) {
        // Authenticated user - can select the booking back
        const result = await supabase
          .from('bookings')
          .insert(bookingData)
          .select()
          .single();
        data = result.data;
        error = result.error;
      } else {
        // Anonymous user - just insert without selecting
        const result = await supabase
          .from('bookings')
          .insert(bookingData);
        error = result.error;
        // Create a mock data object for the email function
        data = { ...bookingData, id: 'anonymous-booking' };
      }

      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Detailed error:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      // Send booking confirmation emails (only for authenticated users)
      if (user?.id) {
        await supabase.functions.invoke('send-booking-confirmation', {
          body: {
            booking: data,
            service: service,
            helperEmail: helperId
          }
        });
      }

      toast({
        title: "Booking confirmed!",
        description: "You'll receive a confirmation email shortly.",
      });

      onBookingSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Book Session</span>
          </DialogTitle>
          <DialogDescription>
            Complete your booking details below
          </DialogDescription>
        </DialogHeader>

        {/* Booking Summary */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <h4 className="font-medium text-sm">Booking Summary</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Service:</span>
              <span className="font-medium text-foreground">{service.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium text-foreground">{format(selectedDate, 'EEEE, MMMM do, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="font-medium text-foreground">{startTime} - {sessionEndTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium text-foreground">{service.duration_minutes || 60} minutes</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span>Total:</span>
              <span className="font-bold text-foreground">${calculateSessionPrice().toFixed(0)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Full Name *</span>
            </Label>
            <Input
              id="fullName"
              required
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email *</span>
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Message to Helpanion (Optional)</span>
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Any special requests or information..."
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};