import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useBookings } from '@/hooks/useBookings';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell, Calendar, History, Settings, Video, Clock, Star, LogOut } from 'lucide-react';
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
    console.log('Toggle clicked, checked:', checked, 'hasRole helpanion:', hasRole('helpanion'), 'rolesLoading:', rolesLoading);
    
    if (checked && !rolesLoading) {
      // User wants to switch to Helpanion
      if (hasRole('helpanion')) {
        console.log('User has helpanion role, navigating to helpanion dashboard');
        navigate('/helpanion-dashboard');
      } else {
        console.log('User does not have helpanion role, showing modal');
        setShowHelpanionModal(true);
      }
    }
    // If unchecked, do nothing (stay on walker dashboard)
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

  const renderSidebar = () => (
    <div className="h-full bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg lg:text-xl font-semibold text-foreground">
            WO Commune
          </h1>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">
            Hi {profile?.display_name?.split(' ')[0] || 'Walker'} (Walker)
          </p>
          {/* Role Toggle */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">Switch to Helpanion</span>
            <Switch 
              checked={false}
              onCheckedChange={handleRoleToggle}
              disabled={rolesLoading}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {!hasRole('helpanion') && (
        <div className="p-4 border-b border-border">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h3 className="text-sm font-medium text-foreground mb-1">
              Want to help others too?
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Become a Helpanion and share your expertise.
            </p>
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => setShowHelpanionModal(true)}
            >
              Become a Helpanion →
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 p-4">
        <p className="text-xs text-muted-foreground mb-4 uppercase font-medium">Dashboard</p>
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 py-3 lg:py-2"
            onClick={() => navigate('/')}
          >
            <Calendar className="h-5 w-5 lg:h-4 lg:w-4" />
            <span className="text-base lg:text-sm">Browse Helpanions</span>
          </Button>
        </div>
      </div>
    </div>
  );

  const renderHeader = () => (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold">
        Walker Dashboard
      </h1>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="sessions" className="flex items-center gap-2 py-3 px-2 lg:px-4">
            <Calendar className="w-4 h-4" />
            <span className="text-xs lg:text-sm">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 py-3 px-2 lg:px-4">
            <Bell className="w-4 h-4" />
            <span className="text-xs lg:text-sm">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 py-3 px-2 lg:px-4">
            <History className="w-4 h-4" />
            <span className="text-xs lg:text-sm">History</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 py-3 px-2 lg:px-4">
            <Settings className="w-4 h-4" />
            <span className="text-xs lg:text-sm">Settings</span>
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
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
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
                      
                      <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-4 text-sm text-muted-foreground">
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
                        <div className="flex flex-col lg:flex-row gap-2">
                          <Button size="sm" className="w-full lg:w-auto">
                            <Video className="w-4 h-4 mr-2" />
                            Join Meeting
                          </Button>
                          <Button variant="outline" size="sm" className="w-full lg:w-auto">
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
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-1 lg:gap-0">
                    <h4 className="font-medium">Session Reminder</h4>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your session with Sarah is starting in 24 hours. Don't forget to prepare your questions!
                  </p>
                </div>
                
                <Separator />
                
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-1 lg:gap-0">
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
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <h4 className="font-medium">{booking.services?.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-2">
                          <Button variant="outline" size="sm" className="w-full lg:w-auto">
                            <Star className="w-4 h-4 mr-2" />
                            Leave Feedback
                          </Button>
                          <Button variant="outline" size="sm" className="w-full lg:w-auto">
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
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
                  <h3 className="text-lg font-medium">Profile Information</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full lg:w-auto"
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
                  <div className="flex flex-col lg:flex-row gap-2">
                    <Button onClick={handleSaveProfile} className="w-full lg:w-auto">Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="w-full lg:w-auto">
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
  );

  return (
    <>
      <DashboardLayout
        sidebar={renderSidebar()}
        header={renderHeader()}
      >
        {renderContent()}
      </DashboardLayout>

      {/* Become Helpanion Modal */}
      <Dialog open={showHelpanionModal} onOpenChange={setShowHelpanionModal}>
        <DialogContent className="mx-4 max-w-md">
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
    </>
  );
}