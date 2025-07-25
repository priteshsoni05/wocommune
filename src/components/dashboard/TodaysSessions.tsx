import { Clock, User, Video, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Session {
  id: string;
  time: string;
  seekerName: string;
  serviceName: string;
  status: 'upcoming' | 'completed';
}

const mockSessions: Session[] = [
  {
    id: '1',
    time: '10:00 AM',
    seekerName: 'Sarah Chen',
    serviceName: 'Career Transition Guidance',
    status: 'upcoming'
  },
  {
    id: '2',
    time: '2:30 PM',
    seekerName: 'Marcus Johnson',
    serviceName: 'Resume Review',
    status: 'upcoming'
  }
];

export const TodaysSessions = () => {
  if (mockSessions.length === 0) {
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
          You've got {mockSessions.filter(s => s.status === 'upcoming').length} sessions ahead
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockSessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-sm font-medium bg-accent px-2 py-1 rounded">
                  {session.time}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {session.seekerName}
                </div>
              </div>
              <p className="text-sm font-medium">{session.serviceName}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {session.status === 'upcoming' ? (
                <>
                  <Button size="sm" className="gap-2">
                    <Video className="h-4 w-4" />
                    Join Call
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Mark Done
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Completed</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};