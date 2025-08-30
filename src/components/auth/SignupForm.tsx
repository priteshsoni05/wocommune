import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRolePersistence } from '@/hooks/useRolePersistence';

export type UserRole = 'walker' | 'helpanion';

interface SignupFormProps {
  selectedRole: UserRole;
  onSuccess: (role: UserRole) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  username: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  selectedRole,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const { setActiveRole } = useRolePersistence();

  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }

    setUsernameLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('is_username_available', { _username: username });

      if (error) throw error;

      if (!data) {
        setUsernameError('Username is already taken');
        return false;
      }

      setUsernameError('');
      return true;
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameError('Error checking username availability');
      return false;
    } finally {
      setUsernameLoading(false);
    }
  };

  const checkExistingRole = async (email: string, role: UserRole) => {
    try {
      const { data, error } = await supabase
        .rpc('user_has_role', { _email: email, _role: role });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error checking existing role:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if user already has this role
      const hasRole = await checkExistingRole(formData.email, selectedRole);
      if (hasRole) {
        setError(`You already have a ${selectedRole} profile. Please log in instead.`);
        setLoading(false);
        return;
      }

      // For Helpanions, validate username
      if (selectedRole === 'helpanion') {
        const isUsernameValid = await checkUsernameAvailability(formData.username);
        if (!isUsernameValid) {
          setLoading(false);
          return;
        }
      }

      // Sign up the user
      const redirectUrl = `${window.location.origin}/auth`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: formData.name,
            username: selectedRole === 'helpanion' ? formData.username : undefined
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          // User exists, try to add the role
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          });

          if (signInError) {
            setError('This email is already registered with a different password. Please log in or use a different email.');
            setLoading(false);
            return;
          }

          // Get current user and add role
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({ user_id: user.id, role: selectedRole });

            if (roleError) {
              console.error('Error adding role:', roleError);
              setError('Error adding role to your account');
              setLoading(false);
              return;
            }

            // Update profile for Helpanions
            if (selectedRole === 'helpanion') {
              const { error: profileError } = await supabase
                .from('profiles')
                .update({ username: formData.username })
                .eq('user_id', user.id);

              if (profileError) {
                console.error('Error updating profile:', profileError);
                setError('Error updating profile');
                setLoading(false);
                return;
              }
            }

            // Set the active role immediately after role addition
            setActiveRole(selectedRole);
            onSuccess(selectedRole);
            return;
          }
        } else {
          throw authError;
        }
      }

      if (authData.user) {
        // Add role to the user
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: authData.user.id, role: selectedRole });

        if (roleError) {
          console.error('Error adding role:', roleError);
          setError('Account created but error adding role');
          setLoading(false);
          return;
        }

        // Update profile for Helpanions
        if (selectedRole === 'helpanion') {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ username: formData.username })
            .eq('user_id', authData.user.id);

          if (profileError) {
            console.error('Error updating profile:', profileError);
            setError('Account created but error updating profile');
            setLoading(false);
            return;
          }
        }

        // Set the active role immediately after successful signup
        setActiveRole(selectedRole);
        onSuccess(selectedRole);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    setFormData(prev => ({ ...prev, username: value }));
    setUsernameError('');
  };

  const handleUsernameBlur = () => {
    if (selectedRole === 'helpanion' && formData.username) {
      checkUsernameAvailability(formData.username);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground font-semibold">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
          placeholder="Enter your full name"
          className="h-11 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-brand focus:ring-brand/20 touch-manipulation"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-semibold">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
          placeholder="Enter your email"
          className="h-11 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-brand focus:ring-brand/20 touch-manipulation"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground font-semibold">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          required
          placeholder="Create a password"
          minLength={6}
          className="h-11 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-brand focus:ring-brand/20 touch-manipulation"
        />
      </div>

      {selectedRole === 'helpanion' && (
        <div className="space-y-2">
          <Label htmlFor="username" className="text-foreground font-semibold">Username</Label>
          <div className="relative">
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              onBlur={handleUsernameBlur}
              required
              placeholder="Choose a unique username"
              className={`h-11 pr-10 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-brand focus:ring-brand/20 touch-manipulation ${usernameError ? 'border-destructive focus:border-destructive focus:ring-destructive/20' : ''}`}
            />
            {usernameLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          {usernameError && (
            <p className="text-sm text-destructive flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{usernameError}</span>
            </p>
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive font-medium">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex space-x-3 pt-2">
        <Button
          type="submit"
          disabled={loading || usernameLoading || (selectedRole === 'helpanion' && !!usernameError)}
          className="flex-1 h-11 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold touch-manipulation"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="px-6 h-11 font-semibold touch-manipulation"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};