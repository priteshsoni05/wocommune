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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showRoleJoinModal, setShowRoleJoinModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { user, signUp, signIn } = useAuth();
  const { addRole } = useUserRoles();
  const { updateProfile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get('mode') as 'login' | 'signup'; // login or signup
  const role = searchParams.get('role') as UserRole; // walker or helpanion

  const handleRoleJoin = async () => {
    if (!selectedRole) return;
    
    try {
      const roleResult = await addRole(selectedRole);
      if (roleResult?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add role. Please try again."
        });
        return;
      }

      const redirectPath = selectedRole === 'helpanion' ? '/helpanion-dashboard' : '/walker-dashboard';
      navigate(redirectPath);
      
      toast({
        title: `Welcome to ${selectedRole === 'helpanion' ? 'Helpanion' : 'Walker'}!`,
        description: `You've successfully joined as a ${selectedRole}.`
      });
      
      setShowRoleJoinModal(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again."
      });
    }
  };

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
          // Wait for authentication to complete and then check roles
          setTimeout(async () => {
            try {
              const { data: session } = await supabase.auth.getSession();
              if (session?.session?.user) {
                const { data: userRoles, error: rolesError } = await supabase
                  .from('user_roles')
                  .select('role')
                  .eq('user_id', session.session.user.id);
                
                if (rolesError) {
                  console.error('Error fetching roles:', rolesError);
                  // Default to allowing login for backward compatibility
                  const redirectPath = role === 'helpanion' ? '/helpanion-dashboard' : '/walker-dashboard';
                  navigate(redirectPath);
                  return;
                }

                const roles = userRoles?.map(r => r.role) || [];
                const hasRequiredRole = roles.includes(role);
                
                if (!hasRequiredRole) {
                  // User doesn't have this role - show modal to join
                  setShowRoleJoinModal(true);
                  setSelectedRole(role);
                  return;
                }

                // User has the role - proceed with login
                const redirectPath = role === 'helpanion' ? '/helpanion-dashboard' : '/walker-dashboard';
                navigate(redirectPath);
                
                toast({
                  title: "Welcome back!",
                  description: `You've successfully logged in as a ${role}.`
                });
              }
            } catch (error) {
              console.error('Error in post-login flow:', error);
              // Fallback: allow login
              const redirectPath = role === 'helpanion' ? '/helpanion-dashboard' : '/walker-dashboard';
              navigate(redirectPath);
            }
          }, 1000);
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
          setLoading(false);
          return;
        }

        // Add role to user
        const roleResult = await addRole(role);
        if (roleResult?.error) {
          console.warn('Failed to assign role:', roleResult.error);
        }

        // Check for unique username if role is helpanion
        if (role === 'helpanion' && username) {
          const { data: existing } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .single();

          if (existing) {
            toast({
              variant: 'destructive',
              title: 'Username already taken',
              description: 'Please choose a different username.'
            });
            setLoading(false);
            return;
          }

          await updateProfile({ 
            username,
            last_active_role: 'helpanion'
          });
        } else {
          await updateProfile({ last_active_role: 'walker' });
        }

        // Show toast & redirect
        toast({
          title: 'Verify your email to continue',
          description: "We've sent you a confirmation email. Click the link to activate your account."
        });

        navigate('/verify-email'); // New page explaining next steps
        return; // End here to prevent double click or fallback login
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/auth?mode=login&role=${role}`
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error sending reset email",
          description: error.message
        });
      } else {
        toast({
          title: "Reset email sent!",
          description: "Please check your email for password reset instructions."
        });
        setShowForgotPassword(false);
        setResetEmail('');
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

            {/* Forgot Password Link - Only show for login mode */}
            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Forgot Password Modal Content */}
          {showForgotPassword && (
            <div className="space-y-4 border-t pt-4">
              <div className="text-center">
                <h3 className="text-lg font-medium">Reset Your Password</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email Address</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmail('');
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>
              </form>
            </div>
          )}

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

      {/* Role Join Modal */}
      <Dialog open={showRoleJoinModal} onOpenChange={setShowRoleJoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join as {selectedRole === 'helpanion' ? 'Helpanion' : 'Walker'}</DialogTitle>
            <DialogDescription>
              You're not registered as a {selectedRole} yet. Would you like to join now?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => setShowRoleJoinModal(false)}
            >
              Not Now
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleRoleJoin}
            >
              Yes, Join as {selectedRole === 'helpanion' ? 'Helpanion' : 'Walker'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}