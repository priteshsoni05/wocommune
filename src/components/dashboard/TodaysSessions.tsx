import { Clock, User, Video, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBookings } from "@/hooks/useBookings";
import { useToast } from "@/hooks/use-toast";

export const TodaysSessions = () => {
  const { getTodaysBookings, updateBookingStatus, loading } = useBookings();
  const { toast } = useToast();
  const todaysBookings = getTodaysBookings();

  const handleMarkDone = async (bookingId: string) => {
    const { error } = await updateBookingStatus(bookingId, 'completed');
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark session as complete"
      });
    } else {
      toast({
        title: "Session completed!",
        description: "Great job helping someone today"
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading your sessions...</div>
        </CardContent>
      </Card>
    );
  }

  if (todaysBookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground mb-2">No sessions scheduled for today</div>
            <p className="text-sm text-muted-foreground">Take a well-deserved break! 🌿</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Today's Sessions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          You've got {todaysBookings.filter(b => b.status === 'confirmed').length} sessions ahead
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {todaysBookings.map((booking) => (
          <div key={booking.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-sm font-medium bg-accent px-2 py-1 rounded">
                  {booking.start_time}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {booking.seeker_name}
                </div>
              </div>
              <p className="text-sm font-medium">{booking.services?.title || 'Service'}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {booking.status === 'confirmed' ? (
                <>
                  <Button size="sm" className="gap-2">
                    <Video className="h-4 w-4" />
                    Join Call
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => handleMarkDone(booking.id)}>
                    <CheckCircle className="h-4 w-4" />
                    Mark Done
                  </Button>
                </>
              ) : booking.status === 'completed' ? (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Completed</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-warning">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Pending</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};