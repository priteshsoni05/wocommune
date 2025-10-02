import { useBookings } from "@/hooks/useBookings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Video,
  CalendarPlus
} from "lucide-react";
import { format, isAfter, parseISO, parse } from "date-fns";

export const HelpanionBookings = () => {
  const { bookings, updateBookingStatus, deleteBooking, getTodaysBookings, getUpcomingBookings, loading } = useBookings();
  const { toast } = useToast();

  const todaysBookings = getTodaysBookings();
  const upcomingBookings = getUpcomingBookings();
  const pastBookings = bookings.filter(booking => 
    booking.booking_date < new Date().toISOString().split('T')[0]
  );

  const handleStatusUpdate = async (bookingId: string, status: 'confirmed' | 'completed' | 'cancelled') => {
    const result = await updateBookingStatus(bookingId, status);
    
    if (result?.error) {
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Booking ${status} successfully!`,
      });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const result = await deleteBooking(bookingId);
    
    if (result?.error) {
      toast({
        title: "Error",
        description: "Failed to cancel booking.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Booking cancelled and slot is now available!",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const isSessionEnded = (booking: any) => {
    const now = new Date();
    const bookingDate = parseISO(booking.booking_date);
    const endTime = parse(booking.end_time, 'HH:mm:ss', bookingDate);
    return isAfter(now, endTime);
  };

  const handleSendInvite = (booking: any) => {
    const bookingDate = parseISO(booking.booking_date);
    const startDateTime = parse(booking.start_time, 'HH:mm:ss', bookingDate);
    const endDateTime = parse(booking.end_time, 'HH:mm:ss', bookingDate);
    
    // Format dates for Google Calendar (yyyyMMddTHHmmss format in UTC)
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalendarUrl.searchParams.append('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.append('text', booking.services?.title || 'Session');
    googleCalendarUrl.searchParams.append('dates', `${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}`);
    googleCalendarUrl.searchParams.append('details', `Session with ${booking.seeker_name}\n\nNotes: ${booking.notes || 'No additional notes'}`);
    googleCalendarUrl.searchParams.append('add', booking.seeker_email);
    
    window.open(googleCalendarUrl.toString(), '_blank');
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{booking.services?.title || 'Service Session'}</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(`2000-01-01T${booking.start_time}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })} - {new Date(`2000-01-01T${booking.end_time}`).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </CardDescription>
          </div>
          <Badge variant={getStatusColor(booking.status)}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Seeker Info */}
          <div className="flex items-center gap-4 p-3 bg-accent rounded-lg">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{booking.seeker_name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {booking.seeker_email}
              </p>
            </div>
          </div>

          {/* Notes */}
          {booking.notes && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Notes from seeker:</p>
              <p className="text-sm text-muted-foreground">{booking.notes}</p>
            </div>
          )}

          {/* Amount */}
          {booking.total_amount && (
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <span className="text-sm font-medium">Session Amount</span>
              <span className="font-bold text-success">₹{booking.total_amount}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            {booking.status === 'pending' && (
              <>
                <Button 
                  onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                  className="flex-1"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirm
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleCancelBooking(booking.id)}
                  className="flex-1 sm:flex-none"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Cancel
                </Button>
              </>
            )}
            
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <Button 
                variant="outline"
                onClick={() => handleSendInvite(booking)}
                className="flex-1 sm:flex-none"
              >
                <CalendarPlus className="h-5 w-5 mr-2" />
                Send Invite
              </Button>
            )}
            
            {booking.status === 'confirmed' && isSessionEnded(booking) && (
              <Button 
                variant="outline"
                onClick={() => handleStatusUpdate(booking.id, 'completed')}
                className="flex-1 sm:flex-none"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bookings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your upcoming and past sessions
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today ({todaysBookings.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {todaysBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No sessions today</h3>
                  <p className="text-muted-foreground">
                    You don't have any sessions scheduled for today.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {todaysBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No upcoming sessions</h3>
                  <p className="text-muted-foreground">
                    You don't have any upcoming sessions scheduled.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No past sessions</h3>
                  <p className="text-muted-foreground">
                    Your completed sessions will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};