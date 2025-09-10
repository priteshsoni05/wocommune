import { Clock, User, Video, CheckCircle } from "lucide-react";
import { isAfter, parse } from "date-fns";
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

  const isSessionEnded = (booking: any) => {
    const now = new Date();
    const today = new Date();
    const endTime = parse(booking.end_time, 'HH:mm:ss', today);
    return isAfter(now, endTime);
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
          <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-muted/30 rounded-lg space-y-3 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <div className="text-sm font-medium bg-accent px-2 py-1 rounded w-fit">
                  {booking.start_time}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{booking.seeker_name}</span>
                </div>
              </div>
              <p className="text-sm font-medium truncate">{booking.services?.title || 'Service'}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:ml-4">
              {booking.status === 'confirmed' ? (
                <>
                  <Button className="gap-2 w-full sm:w-auto">
                    <Video className="h-5 w-5" />
                    <span className="hidden sm:inline">Join Call</span>
                    <span className="sm:hidden">Join</span>
                  </Button>
                  {isSessionEnded(booking) && (
                    <Button variant="outline" className="gap-2 w-full sm:w-auto" onClick={() => handleMarkDone(booking.id)}>
                      <CheckCircle className="h-5 w-5" />
                      <span className="hidden sm:inline">Mark Done</span>
                      <span className="sm:hidden">Done</span>
                    </Button>
                  )}
                </>
              ) : booking.status === 'completed' ? (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-success">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Completed</span>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-warning">
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