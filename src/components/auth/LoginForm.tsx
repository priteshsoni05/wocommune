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

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(error.message || 'An error occurred during Google login');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/api/placeholder/800/600")' }}>
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-sans text-lg text-foreground">WELCOME BACK TO WO COMMUNE</h1>
        <p className="text-muted-foreground font-sans">
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
              className="text-sm font-medium text-foreground font-sans"
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
              className="h-12 px-4 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 font-sans"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="password" 
                className="text-sm font-medium text-foreground font-sans"
              >
                Password
              </Label>
              <button
                type="button"
                onClick={() => setShowForgotPassword && setShowForgotPassword(true)}
                className="text-sm text-primary hover:text-primary/80 transition-colors font-sans"
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
              className="h-12 px-4 border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 font-sans"
            />
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-role-button hover:bg-role-button/90 text-white font-semibold text-base rounded-lg transition-all duration-200 font-sans"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Google Login Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
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