import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
      // User wants to switch to Helpanion
      if (hasRole('helpanion')) {
        navigate('/helpanion-dashboard');
      } else {
        setShowHelpanionModal(true);
      }
    }
  };

  // Add Home button to header, matching HelpanionDashboard
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

  return (
    <DashboardLayout
      header={renderHeader()}
      sidebar={
        // Existing sidebar code
        <div>
          {/* Sidebar content goes here */}
        </div>
      }
    >
      {/* Main dashboard content goes here */}
      {/* ... */}
    </DashboardLayout>
  );
}