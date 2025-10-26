import { useState, useEffect } from "react";
import { Profile } from "@/hooks/useOptimizedProfile";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useFormPersistence } from "@/hooks/useFormPersistence";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Eye, 
  EyeOff, 
  Trash2, 
  AlertTriangle,
  Save,
  Settings as SettingsIcon
} from "lucide-react";
import { CalendarIntegrationSettings } from "./CalendarIntegrationSettings";

interface HelpanionSettingsProps {
  profile: Profile;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error?: any; data?: any }>;
}

export const HelpanionSettings = ({ profile, updateProfile }: HelpanionSettingsProps) => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { 
    formData, 
    updateFormData, 
    resetFormData 
  } = useFormPersistence({
    key: "helpanion_settings",
    initialValues: {
      display_name: profile.display_name || "",
      email: profile.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      profileVisible: true,
      emailNotifications: true,
      bookingNotifications: true,
      reviewNotifications: true
    }
  });

  useEffect(() => {
    // Initialize from profile only if there's no saved draft
    const storageKey = `form_helpanion_settings_${profile.user_id}`;
    let hasDraft = false;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        hasDraft = parsed && Object.keys(parsed).length > 0;
      }
    } catch {}
    if (hasDraft) return;

    updateFormData({
      display_name: profile.display_name || "",
      email: profile.email || ""
    });
  }, [profile.user_id, profile.display_name, profile.email]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProfile({
        display_name: formData.display_name,
        email: formData.email,
      });

      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to update profile settings.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile settings updated successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to update password.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Password updated successfully!",
        });
        
        updateFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating password.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you absolutely sure? This action cannot be undone.")) {
      // In a real app, you'd call the delete account API here
      toast({
        title: "Account Deletion",
        description: "Account deletion request submitted. You will receive a confirmation email.",
        variant: "destructive",
      });
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your account preferences and settings
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Update your basic account details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Full Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => updateFormData({ display_name: e.target.value })}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Password & Security
          </CardTitle>
          <CardDescription>
            Change your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => updateFormData({ currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => updateFormData({ newPassword: e.target.value })}
                  placeholder="Enter new password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData({ confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading}>
              <Lock className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
          <CardDescription>
            Control who can see your profile and services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profileVisible">Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">
                Make your profile visible to the public
              </p>
            </div>
            <Switch
              id="profileVisible"
              checked={formData.profileVisible}
              onCheckedChange={(checked) => updateFormData({ profileVisible: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Calendar Integration */}
      <CalendarIntegrationSettings />

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive important updates via email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => updateFormData({ emailNotifications: checked })}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="bookingNotifications">Booking Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about new bookings and updates
              </p>
            </div>
            <Switch
              id="bookingNotifications"
              checked={formData.bookingNotifications}
              onCheckedChange={(checked) => updateFormData({ bookingNotifications: checked })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="reviewNotifications">Review Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when you receive new reviews
              </p>
            </div>
            <Switch
              id="reviewNotifications"
              checked={formData.reviewNotifications}
              onCheckedChange={(checked) => updateFormData({ reviewNotifications: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
            <h3 className="font-medium text-destructive mb-2">Delete Account</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
              All your data, services, and bookings will be permanently deleted.
            </p>
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full md:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal would go here */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Confirm Account Deletion</CardTitle>
              <CardDescription>
                This action cannot be undone. This will permanently delete your account and remove all associated data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="flex-1"
                >
                  Yes, Delete Account
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};