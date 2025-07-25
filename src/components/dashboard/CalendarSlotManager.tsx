import { Calendar, Clock, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  available: boolean;
  booked?: boolean;
}

const mockSlots: TimeSlot[] = [
  { id: '1', day: 'Today', time: '4:00 PM - 5:00 PM', available: true },
  { id: '2', day: 'Tomorrow', time: '10:00 AM - 11:00 AM', available: true, booked: true },
  { id: '3', day: 'Tomorrow', time: '2:00 PM - 3:00 PM', available: true },
  { id: '4', day: 'Friday', time: '9:00 AM - 10:00 AM', available: false },
  { id: '5', day: 'Friday', time: '11:00 AM - 12:00 PM', available: true },
];

export const CalendarSlotManager = () => {
  const availableSlots = mockSlots.filter(slot => slot.available && !slot.booked);
  const bookedSlots = mockSlots.filter(slot => slot.booked);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar & Availability
          </CardTitle>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="h-4 w-4" />
            Manage
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {availableSlots.length} slots available this week
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Available Slots
          </h4>
          {availableSlots.length > 0 ? (
            <div className="space-y-2">
              {availableSlots.slice(0, 3).map((slot) => (
                <div key={slot.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div>
                    <span className="text-sm font-medium">{slot.day}</span>
                    <p className="text-xs text-muted-foreground">{slot.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Open
                  </Badge>
                </div>
              ))}
              {availableSlots.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{availableSlots.length - 3} more slots
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No available slots</p>
          )}
        </div>

        {bookedSlots.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-sm font-medium">Booked Slots</h4>
            {bookedSlots.slice(0, 2).map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-2 bg-accent/30 rounded">
                <div>
                  <span className="text-sm font-medium">{slot.day}</span>
                  <p className="text-xs text-muted-foreground">{slot.time}</p>
                </div>
                <Badge className="text-xs">
                  Booked
                </Badge>
              </div>
            ))}
          </div>
        )}
        
        <Button variant="outline" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add New Slots
        </Button>
      </CardContent>
    </Card>
  );
};