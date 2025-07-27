import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell, Calendar, History, Settings, Video, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function WalkerDashboard() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { hasRole, addRole, loading: rolesLoading } = useUserRoles();
  const { bookings, loading: bookingsLoading } = useBookings();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showHelpanionModal, setShowHelpanionModal] = useState(false);
  const [helpanionFormData, setHelpanionFormData] = useState({
    fullName: "",
    email: "",
    username: "",
  });
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile && user) {
      // Update last active role
      updateProfile({ last_active_role: 'walker' });
      setFormData({
        display_name: profile.display_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
      });
      setHelpanionFormData({
        fullName: profile.display_name || "",
        email: profile.email || "",
        username: "",
      });
    }
  }, [profile, user]);

  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.booking_date) >= new Date()
  );
  
  const completedBookings = bookings.filter(booking => 
    booking.status === 'completed'
  );

  const handleSaveProfile = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleRoleToggle = (checked: boolean) => {
    if (checked && !rolesLoading) {
      // Switch to Helpanion
      if (hasRole('helpanion')) {
        navigate('/helpanion-dashboard');
      } else {
        setShowHelpanionModal(true);
      }
    }
  };

  const handleBecomeHelpanion = async () => {
    // Update profile with username if provided
    if (helpanionFormData.username) {
      const profileResult = await updateProfile({ 
        username: helpanionFormData.username,
        display_name: helpanionFormData.fullName,
        email: helpanionFormData.email
      });
      if (profileResult?.error) {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    const result = await addRole('helpanion');
    if (result?.error) {
      toast({
        title: "Error",
        description: "Failed to add Helpanion role. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome to Helpanions!",
        description: "You can now provide guidance to Walkers.",
      });
      setShowHelpanionModal(false);
      navigate('/helpanion-dashboard');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold">
                Hi {profile?.display_name?.split(' ')[0] || 'Walker'} (Walker)
              </h1>
              {/* Role Toggle */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Switch to Helpanion</span>
                <Switch 
                  checked={false}
                  onCheckedChange={handleRoleToggle}
                  disabled={rolesLoading}
                />
              </div>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!hasRole('helpanion') && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Want to help others too?
              </CardTitle>
              <CardDescription>
                Become a Helpanion and share your expertise with other community members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowHelpanionModal(true)}>
                Become a Helpanion →
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sessions" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Sessions
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Sessions */}
          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booked Sessions</CardTitle>
                <CardDescription>
                  Your scheduled conversations with Helpanions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Loading sessions...</div>
                  </div>
                ) : upcomingBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No upcoming sessions</h3>
                    <p className="text-muted-foreground mb-4">Book your first session with a Helpanion</p>
                    <Button onClick={() => navigate('/helpanion')}>Browse Helpanions</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">{booking.services?.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              with Helper {booking.helper_id}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {booking.start_time} - {booking.end_time}
                          </div>
                        </div>

                        {booking.notes && (
                          <p className="text-sm bg-muted/50 p-3 rounded">
                            "{booking.notes}"
                          </p>
                        )}

                        {booking.status === 'confirmed' && (
                          <div className="flex gap-2">
                            <Button size="sm">
                              <Video className="w-4 h-4 mr-2" />
                              Join Meeting
                            </Button>
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Messages and updates from your Helpanions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock notifications - replace with real data */}
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Session Reminder</h4>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your session with Sarah is starting in 24 hours. Don't forget to prepare your questions!
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Session Confirmed</h4>
                      <span className="text-xs text-muted-foreground">1 day ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Great news! Your session request has been confirmed by your Helpanion.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-12 h-12 mx-auto mb-4" />
                    <p>You're all caught up!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Session History */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Session History</CardTitle>
                <CardDescription>
                  Your completed conversations and feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                {completedBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No completed sessions yet</h3>
                    <p className="text-muted-foreground">Your session history will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-medium">{booking.services?.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Star className="w-4 h-4 mr-2" />
                              Leave Feedback
                            </Button>
                            <Button variant="outline" size="sm">
                              Rebook
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your profile and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Profile Information</h3>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="display_name">Full Name</Label>
                      <Input
                        id="display_name"
                        value={formData.display_name}
                        onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Preferences</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Session reminders (24 hours before)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Session reminders (1 hour before)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Updates from Helpanions</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Become Helpanion Modal */}
      <Dialog open={showHelpanionModal} onOpenChange={setShowHelpanionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join as a Helpanion</DialogTitle>
            <DialogDescription>
              You haven't joined as a Helpanion yet. Want to join now and start helping other community members?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="helpanion-name">Full Name</Label>
              <Input
                id="helpanion-name"
                value={helpanionFormData.fullName}
                onChange={(e) => setHelpanionFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="helpanion-email">Email</Label>
              <Input
                id="helpanion-email"
                type="email"
                value={helpanionFormData.email}
                onChange={(e) => setHelpanionFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="helpanion-username">Username (Unique Public ID)</Label>
              <Input
                id="helpanion-username"
                value={helpanionFormData.username}
                onChange={(e) => setHelpanionFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Choose a unique username"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleBecomeHelpanion} className="flex-1">
                Yes, Join as Helpanion
              </Button>
              <Button variant="outline" onClick={() => setShowHelpanionModal(false)} className="flex-1">
                Not now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}