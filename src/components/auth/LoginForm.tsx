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
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onNoRoleFound
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-semibold">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
          className="h-11 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-brand focus:ring-brand/20 touch-manipulation"
        />
      </div>

      {error && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-destructive font-medium">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold touch-manipulation"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign In
      </Button>
    </form>
  );
};