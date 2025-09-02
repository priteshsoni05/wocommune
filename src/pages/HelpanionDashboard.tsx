import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GlobalHeader from '@/components/common/GlobalHeader';
import { Footer } from '@/components/common/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Heart, 
  Calendar, 
  DollarSign, 
  Star, 
  Settings,
  Plus,
  Users,
  BarChart3
} from 'lucide-react';

interface Profile {
  user_id: string;
  display_name: string;
  username: string;
  bio: string;
  avatar_url: string;
}

interface DashboardStats {
  totalBookings: number;
  totalEarnings: number;
  averageRating: number;
  activeServices: number;
}

export default function HelpanionDashboard() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalEarnings: 0,
    averageRating: 0,
    activeServices: 0
  });
  const [currentUser, setCurrentUser] = useState<any>(null);
  console.log('HelpanionDashboard: username from params:', username);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (username && currentUser) {
      fetchProfile();
      fetchStats();
    }
  }, [username, currentUser]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth?mode=login');
      return;
    }
    
    setCurrentUser(session.user);
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            title: "Profile not found",
            description: "This helpanion profile doesn't exist.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        throw error;
      }

      // Check if current user owns this profile
      if (currentUser && data.user_id !== currentUser.id) {
        toast({
          title: "Access denied",
          description: "You can only access your own dashboard.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setProfile(data);
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!currentUser) return;

    try {
      // Fetch booking stats
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('helper_id', currentUser.id);

      // Fetch earnings
      const { data: earnings } = await supabase
        .from('earnings')
        .select('amount')
        .eq('helper_id', currentUser.id);

      // Fetch services
      const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('helper_id', currentUser.id)
        .eq('is_active', true);

      // Fetch reviews for rating
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('helper_id', currentUser.id);

      const totalEarnings = earnings?.reduce((sum, earning) => sum + Number(earning.amount), 0) || 0;
      const averageRating = reviews?.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

      setStats({
        totalBookings: bookings?.length || 0,
        totalEarnings,
        averageRating: Math.round(averageRating * 10) / 10,
        activeServices: services?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 mt-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.display_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <Heart className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome back, {profile.display_name}
              </h1>
              <p className="text-muted-foreground">@{profile.username}</p>
              <Badge variant="secondary" className="mt-1">
                <Heart className="w-3 h-3 mr-1" />
                Helpanion
              </Badge>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageRating || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">
                From client reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeServices}</div>
              <p className="text-xs text-muted-foreground">
                Currently offering
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Add a new service to help more walkers
              </p>
              <Button className="w-full">
                Add Service
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Manage Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Set your available time slots
              </p>
              <Button variant="outline" className="w-full">
                Update Schedule
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track your performance and growth
              </p>
              <Button variant="outline" className="w-full">
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Your bookings and interactions will appear here</p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}