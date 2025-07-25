import { Calendar, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookings } from "@/hooks/useBookings";

export const UpcomingBookings = () => {
  const { getUpcomingBookings, loading } = useBookings();
  const upcomingBookings = getUpcomingBookings();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Bookings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading your bookings...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Bookings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your next {upcomingBookings.length} scheduled sessions
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingBookings.slice(0, 5).map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium">{formatDate(booking.booking_date)}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {booking.start_time}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{booking.services?.title || 'Service'}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {booking.seeker_name}
                </div>
              </div>
            </div>
          ))}
          {upcomingBookings.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No upcoming bookings</p>
              <p className="text-sm">Share your services to get more bookings!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};