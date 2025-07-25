import { Calendar, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Booking {
  id: string;
  date: string;
  time: string;
  seekerName: string;
  serviceName: string;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    date: 'Tomorrow',
    time: '11:00 AM',
    seekerName: 'Alex Rivera',
    serviceName: 'Mindfulness Session'
  },
  {
    id: '2',
    date: 'Friday',
    time: '3:00 PM',
    seekerName: 'Emma Thompson',
    serviceName: 'Life Coaching'
  },
  {
    id: '3',
    date: 'Monday',
    time: '9:30 AM',
    seekerName: 'David Park',
    serviceName: 'Career Guidance'
  }
];

export const UpcomingBookings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Bookings
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your next {mockBookings.length} scheduled sessions
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockBookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium">{booking.date}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {booking.time}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{booking.serviceName}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  {booking.seekerName}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};