import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'walker' | 'helpanion';

interface LoginFormProps {
  onSuccess: (userRoles: UserRole[]) => void;
  onNoRoleFound: (email: string) => void;
  setShowForgotPassword?: (show: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onNoRoleFound,
  setShowForgotPassword
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getUserRoles = async (userEmail: string): Promise<UserRole[]> => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_roles_by_email', { _email: userEmail });

      if (error) throw error;
      // Filter out admin role from the UI
      return (data || []).map((item: any) => item.role) as UserRole[];
    } catch (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw signInError;
      }

      // Get user roles
      const userRoles = await getUserRoles(email);

      if (userRoles.length === 0) {
        onNoRoleFound(email);
      } else {
        onSuccess(userRoles);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else {
        setError(error.message || 'An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-8 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/api/placeholder/800/600")' }}>
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-lg text-foreground">WELCOME BACK TO WO COMMUNE</h1>
        <p className="text-muted-foreground">
          Sign in to continue your journey
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <Label 
              htmlFor="email" 
              className="text-sm font-medium text-foreground"
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="h-12 px-4 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="password" 
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <button
                type="button"
                onClick={() => setShowForgotPassword && setShowForgotPassword(true)}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="h-12 px-4 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="border-destructive/20 bg-destructive/5 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive font-medium">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full bg-role-button hover:bg-role-button/90 text-white"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>

      </form>
    </div>
  );
};