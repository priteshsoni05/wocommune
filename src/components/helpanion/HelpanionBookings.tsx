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
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";

export const HelpanionBookings = () => {
  const { bookings, updateBookingStatus, getTodaysBookings, getUpcomingBookings, loading } = useBookings();
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
                  onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                  className="flex-1 sm:flex-none"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Cancel
                </Button>
              </>
            )}
            
            {booking.status === 'confirmed' && (
              <>
                <Button className="flex-1">
                  <Video className="h-5 w-5 mr-2" />
                  Join Session
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleStatusUpdate(booking.id, 'completed')}
                  className="flex-1 sm:flex-none"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Complete
                </Button>
              </>
            )}
            
            <Button variant="ghost" className="flex-1 sm:flex-none">
              <MessageSquare className="h-5 w-5 mr-2" />
              Message
            </Button>
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