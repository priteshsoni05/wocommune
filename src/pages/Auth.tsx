import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Mail, LogIn, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { UserRole } from '@/hooks/useUserRoles';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signUp, signIn } = useAuth();
  const { addRole } = useUserRoles();
  const { updateProfile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get('mode') as 'login' | 'signup'; // login or signup
  const role = searchParams.get('role') as UserRole; // walker or helpanion

  useEffect(() => {
    if (user) {
      // Redirect based on the last active role or selected role
      const redirectPath = role === 'helpanion' ? '/helpanion-dashboard' : '/walker-dashboard';
      navigate(redirectPath);
    }
  }, [user, navigate, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        // Login flow
        let loginEmail = email;
        
        // For Helpanion login, allow login with username or email
        if (role === 'helpanion' && emailOrUsername && !emailOrUsername.includes('@')) {
          // It's a username, need to find the email
          const { data: profileData } = await supabase
            .from('profiles')
            .select('email')
            .eq('username', emailOrUsername)
            .single();
          
          if (profileData?.email) {
            loginEmail = profileData.email;
          } else {
            toast({
              variant: "destructive",
              title: "Username not found",
              description: "No account found with this username."
            });
            setLoading(false);
            return;
          }
        } else if (role === 'helpanion') {
          loginEmail = emailOrUsername;
        }

        const { error } = await signIn(loginEmail, password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message
          });
        } else {
          toast({
            title: "Welcome back!",
            description: `You've successfully logged in as a ${role}.`
          });
        }
      } else {
        // Signup flow
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: 'Error signing up',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          // Add the selected role to the user after successful signup
          const roleResult = await addRole(role);
          if (roleResult?.error) {
            console.warn('Failed to assign role:', roleResult.error);
          }

          // Update profile with username if Helpanion
          if (role === 'helpanion' && username) {
            await updateProfile({ 
              username,
              last_active_role: 'helpanion'
            });
          } else {
            await updateProfile({ 
              last_active_role: 'walker'
            });
          }
          
          toast({
            title: 'Welcome to WO Commune!',
            description: `You've joined as a ${role}. Please check your email to verify your account.`,
          });
        }
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const redirectPath = role === 'helpanion' ? '/helpanion-dashboard' : '/walker-dashboard';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}${redirectPath}`
        }
      });
      if (error) {
        toast({
          title: 'Error with Google login',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInLogin = async () => {
    setLoading(true);
    try {
      const redirectPath = role === 'helpanion' ? '/helpanion-dashboard' : '/walker-dashboard';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}${redirectPath}`
        }
      });
      if (error) {
        toast({
          title: 'Error with LinkedIn login',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (mode === 'login') {
      return role === 'helpanion' ? 'Welcome back, Helpanion' : 'Welcome back, Walker';
    } else {
      return role === 'helpanion' ? 'Join as a Helpanion' : 'Join as a Walker';
    }
  };

  const getDescription = () => {
    if (mode === 'login') {
      return role === 'helpanion' 
        ? 'Sign in to your Helpanion account' 
        : 'Sign in to your Walker account';
    } else {
      return role === 'helpanion' 
        ? 'Start helping others with your expertise' 
        : 'Start your journey seeking guidance';
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Link to="/" className="text-primary hover:text-primary/80">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <CardTitle className="text-2xl font-serif">
                {getTitle()}
              </CardTitle>
            </div>
          </div>
          <CardDescription>
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Social Login Buttons */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <Mail className="w-4 h-4 mr-2" />
              Continue with Gmail
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleLinkedInLogin}
              disabled={loading}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Continue with LinkedIn
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Manual Login/Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {mode === 'signup' && role === 'helpanion' && (
              <div className="space-y-2">
                <Label htmlFor="username">Username (Unique Public ID)</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Choose a unique username"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">
                {mode === 'login' && role === 'helpanion' ? 'Email or Username' : 'Email Address'}
              </Label>
              <Input
                id="email"
                type={mode === 'login' && role === 'helpanion' ? 'text' : 'email'}
                value={mode === 'login' && role === 'helpanion' ? emailOrUsername : email}
                onChange={(e) => {
                  if (mode === 'login' && role === 'helpanion') {
                    setEmailOrUsername(e.target.value);
                  } else {
                    setEmail(e.target.value);
                  }
                }}
                required
                placeholder={mode === 'login' && role === 'helpanion' ? 'Enter email or username' : 'Enter your email'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                minLength={6}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center">
            <div className="text-sm text-muted-foreground">
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </div>
            <div className="flex gap-2 justify-center mt-2">
              <Link 
                to={`/auth?mode=${mode === 'login' ? 'signup' : 'login'}&role=walker`}
                className="text-sm text-primary hover:underline"
              >
                {mode === 'login' ? 'Join as Walker' : 'Login as Walker'}
              </Link>
              <span className="text-sm text-muted-foreground">•</span>
              <Link 
                to={`/auth?mode=${mode === 'login' ? 'signup' : 'login'}&role=helpanion`}
                className="text-sm text-primary hover:underline"
              >
                {mode === 'login' ? 'Join as Helpanion' : 'Login as Helpanion'}
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}