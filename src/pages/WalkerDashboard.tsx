import { useState, useEffect } from 'react';mport { useNavigate } from 'react-router-dom';
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
import { Bell, Calendar, History, Settings, Video, Clock, Star, LogOut, Home } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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
  }, [profile, user, updateProfile]);

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
      // User wants to switch to Helpanion
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

  // Sidebar rendering (Home and Logout buttons REMOVED from sidebar)
  const renderSidebar = () => (
    <div className="h-full bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg lg:text-xl font-semibold text-foreground">
            WO Commune
          </h1>
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
            onClick={() => navigate('/helpanion')}
          >
            <Calendar className="h-5 w-5 lg:h-4 lg:w-4" />
            <span className="text-base lg:text-sm">Browse Helpanions</span>
          </Button>
        </div>
      </div>
    </div>
  );

  // Header rendering (Home and Logout remain here)
  const renderHeader = () => (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-semibold text-foreground">
        WO Commune
      </h1>
      <div className="flex gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/" aria-label="Home">
            <Home className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  // Content
  const renderContent = () => (
    <div className="py-4 px-2 sm:px-4">
      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="mb-6 w-full flex">
          <TabsTrigger value="sessions" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" /> Sessions
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1">
            <History className="h-4 w-4 mr-2" /> History
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">
            <Settings className="h-4 w-4 mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
              <CardDescription>
                These are the sessions you've booked as a Walker.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div>Loading...</div>
              ) : upcomingBookings.length === 0 ? (
                <div className="text-muted-foreground">No upcoming sessions.</div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between border-b border-border pb-2"
                    >
                      <div>
                        <div className="font-medium">{booking.helpanion_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(booking.booking_date), 'PPpp')}
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Stay up to date with your session updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">No new notifications.</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Completed Sessions</CardTitle>
              <CardDescription>
                Your session history as a Walker.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div>Loading...</div>
              ) : completedBookings.length === 0 ? (
                <div className="text-muted-foreground">No completed sessions.</div>
              ) : (
                <div className="space-y-4">
                  {completedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between border-b border-border pb-2"
                    >
                      <div>
                        <div className="font-medium">{booking.helpanion_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(booking.booking_date), 'PPpp')}
                        </div>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your profile details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <div>{profile?.display_name || '-'}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div>{profile?.email || '-'}</div>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <div>{profile?.phone || '-'}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="display_name">Name</Label>
                    <Input
                      id="display_name"
                      value={formData.display_name}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, display_name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, email: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((f) => ({ ...f, phone: e.target.value }))
                      }
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={handleSaveProfile}>
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Become a Helpanion</DialogTitle>
            <DialogDescription>
              To become a Helpanion, please provide a unique username.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={helpanionFormData.fullName}
                onChange={(e) =>
                  setHelpanionFormData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={helpanionFormData.email}
                onChange={(e) =>
                  setHelpanionFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={helpanionFormData.username}
                onChange={(e) =>
                  setHelpanionFormData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />
            </div>
            <Button className="w-full" onClick={handleBecomeHelpanion}>
              Become Helpanion
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}