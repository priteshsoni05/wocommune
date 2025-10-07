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
    
    // Check if user is authenticated - redirect to auth if not
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign up as a Walker to book sessions with our Helpanions.",
        action: (
          <Button
            onClick={() => window.location.href = '/auth?mode=signup&role=walker'}
            className="bg-primary text-primary-foreground"
          >
            Join as Walker
          </Button>
        ),
      });
      return;
    }
    
    console.log('Starting booking process...');
    console.log('User:', user);
    console.log('Service:', service);
    
    setLoading(true);
    try {
      // Now authenticated user is required - use user.id directly
      const bookingUserId = user.id;
      
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

      // Resolve helper profile for email context
      const { data: helperProfile } = await supabase
        .from('profiles')
        .select('display_name, email')
        .eq('user_id', helperId)
        .maybeSingle();

      const helperDisplayName = helperProfile?.display_name || 'Helper';
      const helperEmail = helperProfile?.email || 'helper@example.com';

      let data, error;
      
      // Create booking without meeting link (helper will send invite manually)
      const result = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();
      data = result.data;
      error = result.error;

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

      // Send booking confirmation emails
      try {
        await supabase.functions.invoke('send-booking-confirmation', {
          body: {
            booking: data,
            service: service,
            helperEmail: helperEmail,
            helperName: helperDisplayName
          }
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't throw error - booking was successful even if email failed
      }

      toast({
        title: "Booking confirmed!",
        description: "You'll receive a confirmation email shortly.",
      });

      onBookingSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Booking error:', error);
      
      let errorMessage = "Something went wrong. Please try again.";
      let errorTitle = "Booking failed";
      
      // Check for specific database constraint errors
      if (error?.message?.includes('unique_helper_datetime') || error?.code === '23505') {
        errorTitle = "Time slot unavailable";
        errorMessage = "This time slot has already been booked. Please select a different time.";
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
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
          <DialogTitle className="flex items-center space-x-2 font-semibold" style={{ color: '#193232' }}>
            <Calendar className="w-5 h-5" />
            <span>Book Session</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Complete your booking details below
          </DialogDescription>
        </DialogHeader>

        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
          <h4 className="font-semibold text-sm" style={{ color: '#193232' }}>Booking Summary</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Service:</span>
              <span className="font-medium text-gray-900">{service.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span className="font-medium text-gray-900">{format(selectedDate, 'EEEE, MMMM do, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span>Time:</span>
              <span className="font-medium text-gray-900">{startTime} - {sessionEndTime}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium text-gray-900">{service.duration_minutes || 60} minutes</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-1">
              <span className="font-semibold">Total:</span>
              <span className="font-bold" style={{ color: '#193232' }}>₹{calculateSessionPrice().toFixed(0)}</span>
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
              className="flex-1 font-semibold"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 text-white font-semibold hover:opacity-90"
              disabled={loading}
              style={{ backgroundColor: '#193232' }}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};