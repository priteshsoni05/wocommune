import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CalendarIntegrationSettings = () => {
  const [calendarId, setCalendarId] = useState("");
  const [status, setStatus] = useState<"not_configured" | "connected" | "error">("not_configured");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCalendarSettings();
  }, []);

  const fetchCalendarSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('google_calendar_id, calendar_integration_status')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile) {
        setCalendarId(profile.google_calendar_id || "");
        setStatus((profile.calendar_integration_status as "not_configured" | "connected" | "error") || "not_configured");
      }
    } catch (error) {
      console.error('Error fetching calendar settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCalendar = async () => {
    if (!calendarId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid calendar ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({
          google_calendar_id: calendarId,
          calendar_integration_status: 'connected'
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setStatus('connected');
      toast({
        title: "Calendar Connected",
        description: "Your Google Calendar has been successfully linked!",
      });
    } catch (error) {
      console.error('Error saving calendar:', error);
      setStatus('error');
      toast({
        title: "Error",
        description: "Failed to connect calendar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({
          google_calendar_id: null,
          calendar_integration_status: 'not_configured'
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setCalendarId("");
      setStatus('not_configured');
      toast({
        title: "Calendar Disconnected",
        description: "Your Google Calendar has been disconnected.",
      });
    } catch (error) {
      console.error('Error disconnecting calendar:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect calendar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline">Not Configured</Badge>;
    }
  };

  if (isLoading) {
    return <div>Loading calendar settings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Google Calendar Integration
        </CardTitle>
        <CardDescription>
          Connect your Google Calendar to automatically create events for your bookings
        </CardDescription>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'not_configured' && (
          <Alert>
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Setup Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Open your Google Calendar</li>
                  <li>Click on "Settings and sharing" for the calendar you want to use</li>
                  <li>In the "Share with specific people" section, add: <code className="bg-muted px-1 rounded">your-service-account@email.com</code></li>
                  <li>Give "Make changes to events" permission</li>
                  <li>Copy the Calendar ID from the "Integrate calendar" section</li>
                  <li>Paste it below and save</li>
                </ol>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.open('https://calendar.google.com/', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Google Calendar
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="calendar-id">Google Calendar ID</Label>
          <Input
            id="calendar-id"
            placeholder="your-calendar-id@group.calendar.google.com"
            value={calendarId}
            onChange={(e) => setCalendarId(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-muted-foreground">
            You can find this in your Google Calendar settings under "Integrate calendar"
          </p>
        </div>

        <div className="flex gap-2">
          {status === 'not_configured' || status === 'error' ? (
            <Button onClick={handleSaveCalendar} disabled={loading || !calendarId.trim()}>
              {loading ? "Connecting..." : "Connect Calendar"}
            </Button>
          ) : (
            <>
              <Button onClick={handleSaveCalendar} disabled={loading}>
                {loading ? "Updating..." : "Update Calendar"}
              </Button>
              <Button variant="outline" onClick={handleDisconnect} disabled={loading}>
                Disconnect
              </Button>
            </>
          )}
        </div>

        {status === 'connected' && (
          <Alert>
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              Your calendar is connected! New bookings will automatically appear in your Google Calendar.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};