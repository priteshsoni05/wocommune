import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useToast } from '@/hooks/use-toast';
import { useOptimizedProfile } from '@/hooks/useOptimizedProfile';

export type UserRole = 'walker' | 'helpanion';

interface RoleSwitchToggleProps {
  currentRole: UserRole;
  className?: string;
  variant?: 'switch' | 'button'; // New variant prop
}

export const RoleSwitchToggle: React.FC<RoleSwitchToggleProps> = ({
  currentRole,
  className = "",
  variant = 'switch'
}) => {
  const { user } = useAuth();
  const { hasRole, addRole, loading: rolesLoading } = useUserRoles();
  const { profile, updateProfile } = useOptimizedProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: ''
  });

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.display_name || '',
        email: profile.email || '',
        username: ''
      });
    }
  }, [profile]);

  const targetRole = currentRole === 'walker' ? 'helpanion' : 'walker';
  const isChecked = currentRole === 'helpanion';

  const handleToggle = (checked: boolean) => {
    if (rolesLoading) return;

    const newRole = checked ? 'helpanion' : 'walker';
    
    if (hasRole(newRole)) {
      // User has the role, navigate to that dashboard
      navigate(`/${newRole}/${user?.id}`);
    } else {
      // User doesn't have the role, show create account modal
      setShowCreateRoleModal(true);
    }
  };

  const handleCreateRole = async () => {
    try {
      // For helpanions, update profile with username if provided
      if (targetRole === 'helpanion' && formData.username) {
        const profileResult = await updateProfile({
          username: formData.username,
          display_name: formData.fullName,
          email: formData.email
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

      // Add the new role
      const result = await addRole(targetRole);
      
      if (result?.error) {
        toast({
          title: "Error",
          description: `Failed to add ${targetRole} role. Please try again.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: `Welcome to ${targetRole === 'helpanion' ? 'Helpanions' : 'Walkers'}!`,
          description: targetRole === 'helpanion' 
            ? "You can now provide guidance to Walkers."
            : "You can now seek help from Helpanions.",
        });
        setShowCreateRoleModal(false);
        navigate(`/${targetRole}/${user?.id}`);
      }
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderModalContent = () => {
    if (targetRole === 'helpanion') {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Become a Helpanion</DialogTitle>
            <DialogDescription>
              To become a Helpanion, please provide a unique username and confirm your details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username (Required for Helpanions)</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Choose a unique username"
                required
              />
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <DialogHeader>
            <DialogTitle>Join as a Walker</DialogTitle>
            <DialogDescription>
              You haven't joined as a Walker yet. Want to join now and start seeking help from Helpanions?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
              />
            </div>
          </div>
        </>
      );
    }
  };

  if (variant === 'button') {
    return (
      <>
        <Button 
          className="w-full text-xs py-2 px-3 rounded-md text-white font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: "#193232" }}
          onClick={() => setShowCreateRoleModal(true)}
        >
          Become a {targetRole === 'helpanion' ? 'Helpanion' : 'Walker'} →
        </Button>

        <Dialog open={showCreateRoleModal} onOpenChange={setShowCreateRoleModal}>
          <DialogContent className="mx-4 max-w-md">
            {renderModalContent()}
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleCreateRole}
                className="flex-1 text-white"
                style={{ backgroundColor: "#193232" }}
                disabled={targetRole === 'helpanion' && !formData.username}
              >
                Yes, Join as {targetRole === 'helpanion' ? 'Helpanion' : 'Walker'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateRoleModal(false)}
                className="flex-1"
              >
                Not now
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-xs text-gray-600">
          {targetRole === 'helpanion' ? 'Helpanion' : 'Walker'}
        </span>
        <Switch
          checked={isChecked}
          onCheckedChange={handleToggle}
          disabled={rolesLoading}
          style={{
            "--switch-color": "#193232"
          } as React.CSSProperties}
        />
      </div>

      <Dialog open={showCreateRoleModal} onOpenChange={setShowCreateRoleModal}>
        <DialogContent className="mx-4 max-w-md">
          {renderModalContent()}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleCreateRole}
              className="flex-1 text-white"
              style={{ backgroundColor: "#193232" }}
              disabled={targetRole === 'helpanion' && !formData.username}
            >
              Yes, Join as {targetRole === 'helpanion' ? 'Helpanion' : 'Walker'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCreateRoleModal(false)}
              className="flex-1"
            >
              Not now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};