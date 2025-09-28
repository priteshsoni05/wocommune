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
  confirmPassword: string;
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
    confirmPassword: '',
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
    e.stopPropagation();
    setError('');
    setLoading(true);

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

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
            // Check if user already has this role
            const { data: existingRole } = await supabase
              .from('user_roles')
              .select('id')
              .eq('user_id', user.id)
              .eq('role', selectedRole)
              .single();

            if (!existingRole) {
              // Add role to existing user only if they don't have it
              const { error: roleError } = await supabase
                .from('user_roles')
                .insert({ user_id: user.id, role: selectedRole });

              if (roleError) {
                console.error('Error adding role:', roleError);
                setError('Error adding role to your account');
                setLoading(false);
                return;
              }
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

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth?mode=signup&role=${selectedRole}`
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Google signup error:', error);
      setError(error.message || 'An error occurred during Google signup');
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-8 ${selectedRole === 'helpanion' || selectedRole === 'walker' ? 'bg-cover bg-center bg-no-repeat' : ''}`} style={selectedRole === 'helpanion' || selectedRole === 'walker' ? { backgroundImage: 'url("/api/placeholder/800/600")' } : {}}>
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className={`${selectedRole === 'helpanion' || selectedRole === 'walker' ? 'font-sans text-lg' : 'font-brand text-3xl font-bold'} text-foreground`}>
          {selectedRole === 'helpanion' ? 'START YOUR HELPANION JOURNEY' : selectedRole === 'walker' ? 'START YOUR WALKER JOURNEY' : `Create your ${selectedRole} account`}
        </h1>
        <p className="text-muted-foreground font-sans">
          Join our community and start {selectedRole === 'helpanion' ? 'helping others' : 'getting help'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          {/* Full Name Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="name" 
              className="text-sm font-medium text-foreground font-sans"
            >
              Full name
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              placeholder="Enter your full name"
              className="h-12 px-4 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 font-sans"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className="text-sm font-medium text-foreground font-sans"
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              placeholder="Enter your email"
              className="h-12 px-4 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 font-sans"
            />
          </div>

          {/* Username Field (for Helpanions only) */}
          {selectedRole === 'helpanion' && (
            <div className="space-y-2">
              <Label 
                htmlFor="username" 
                className="text-sm font-medium text-foreground font-sans"
              >
                Username
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  onBlur={handleUsernameBlur}
                  required
                  placeholder="Choose a unique username"
                  className={`h-12 px-4 pr-10 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 font-sans ${
                    usernameError ? 'border-destructive focus:border-destructive focus:ring-destructive/10' : ''
                  }`}
                />
                {usernameLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {usernameError && (
                <p className="text-sm text-destructive flex items-center gap-1.5 font-sans">
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{usernameError}</span>
                </p>
              )}
            </div>
          )}

          {/* Password Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="text-sm font-medium text-foreground font-sans"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                placeholder="Create password"
                minLength={6}
                className="h-12 px-4 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label 
                htmlFor="confirmPassword" 
                className="text-sm font-medium text-foreground font-sans"
              >
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                placeholder="Confirm password"
                minLength={6}
                className="h-12 px-4 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive font-medium font-sans">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="submit"
            disabled={loading || usernameLoading || (selectedRole === 'helpanion' && !!usernameError)}
            className={`flex-1 h-12 ${selectedRole === 'helpanion' || selectedRole === 'walker' ? 'bg-role-button hover:bg-role-button/90 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'} font-semibold text-base rounded-lg transition-all duration-200 font-sans`}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="sm:w-auto px-8 h-12 font-semibold text-base rounded-lg transition-all duration-200 font-sans border-input hover:bg-accent"
          >
            Cancel
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Google Signup Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full h-12 border-2 border-border hover:border-primary/50 font-semibold text-base rounded-lg transition-all duration-200 font-sans"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </Button>
      </form>
    </div>
  );
};