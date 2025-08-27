import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedProfile as useProfile } from '@/hooks/useOptimizedProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useBookings } from '@/hooks/useBookings';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Bell, Calendar, History, Settings, LogOut, Home, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type TabKey = 'sessions' | 'notifications' | 'history' | 'settings';

const navigationTabs = [
  { key: 'sessions' as TabKey, label: 'Sessions', icon: Calendar },
  { key: 'notifications' as TabKey, label: 'Notifications', icon: Bell },
  { key: 'history' as TabKey, label: 'History', icon: History },
  { key: 'settings' as TabKey, label: 'Settings', icon: Settings },
];

export default function WalkerDashboard() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { hasRole, addRole, loading: rolesLoading } = useUserRoles();
  const { bookings, loading: bookingsLoading } = useBookings();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<TabKey>('sessions');
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

  const renderSidebar = () => (
    <div className="h-full bg-card flex flex-col">
      {/* Header */}
      <div className="p-3 lg:p-6 border-b border-border">
        <div className="mb-3 lg:mb-4">
          <h1 className="text-base lg:text-xl font-semibold text-foreground">
            WO Commune
          </h1>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs lg:text-sm text-muted-foreground">Hi {profile?.display_name || 'Walker'}</p>
            <p className="text-xs text-muted-foreground">(Walker)</p>
          </div>
          
          {hasRole('helpanion') && (
            <div className="flex items-center gap-1 lg:gap-2">
              <span className="text-xs text-muted-foreground">Helpanion</span>
              <Switch 
                checked={false}
                onCheckedChange={handleRoleToggle}
                className="scale-75 lg:scale-100"
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex-1 p-2 lg:p-4">
        <div className="space-y-0.5 lg:space-y-1">
          {navigationTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                // Auto-close sidebar on mobile when tab is selected
                if (window.innerWidth < 1024) {
                  // Use setTimeout to ensure state update happens
                  setTimeout(() => {
                    const event = new CustomEvent('closeMobileSidebar');
                    window.dispatchEvent(event);
                  }, 100);
                }
              }}
              className={cn(
                "w-full flex items-center gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 text-left rounded-md lg:rounded-lg transition-colors touch-manipulation min-h-[44px]",
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <tab.icon className="h-4 w-4 lg:h-4 lg:w-4 flex-shrink-0" />
              <span className="text-sm lg:text-sm font-medium">{tab.label}</span>
              {activeTab === tab.key && (
                <ChevronRight className="h-3 w-3 lg:h-3 lg:w-3 ml-auto" />
              )}
            </button>
          ))}
        </div>

        {/* Browse Helpanions button */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2 uppercase font-medium">Quick Actions</p>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 lg:gap-3 px-2 lg:px-3 py-2 lg:py-2.5 text-left rounded-md lg:rounded-lg"
            onClick={() => navigate('/helpanion')}
          >
            <Calendar className="h-4 w-4 lg:h-4 lg:w-4 flex-shrink-0" />
            <span className="text-sm lg:text-sm font-medium">Browse Helpanions</span>
          </Button>
        </div>
      </nav>

      {/* Become Helpanion CTA */}
      {!hasRole('helpanion') && (
        <div className="p-3 lg:p-4 border-t border-border">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 lg:p-4">
            <h3 className="text-xs lg:text-sm font-medium text-foreground mb-1">
              Want to help others too?
            </h3>
            <p className="text-xs text-muted-foreground mb-2 lg:mb-3">
              Become a Helpanion and share your expertise.
            </p>
            <Button 
              size="sm" 
              className="w-full text-xs h-7 lg:h-8"
              onClick={() => setShowHelpanionModal(true)}
            >
              Become a Helpanion →
            </Button>
          </div>
        </div>
      )}
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

  const renderContent = () => {
    switch (activeTab) {
      case 'sessions':
        return (
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
                        <div className="font-medium">{booking.seeker_name}</div>
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
        );
      case 'notifications':
        return (
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
        );
      case 'history':
        return (
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
                        <div className="font-medium">{booking.seeker_name}</div>
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
        );
      case 'settings':
        return (
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
        );
      default:
        return null;
    }
  };

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