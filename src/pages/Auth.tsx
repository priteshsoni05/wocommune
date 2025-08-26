import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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

  // Only use signIn; signUp flow uses supabase.auth.signUp directly to pass metadata
  const { signIn } = useAuth();
  const { addRole } = useUserRoles();
  const { updateProfile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = (searchParams.get('mode') as 'login' | 'signup') || 'login';
  const role = (searchParams.get('role') as UserRole) || 'walker';

  const getRedirectPathByRole = (r: UserRole) =>
    r === 'helpanion' ? '/helpanion-dashboard' : '/walker-dashboard';

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
        
        const roles = userRoles?.map((r: any) => r.role) || [];
        const redirectRole = roles.includes(role) ? role : (roles.includes('helpanion') ? 'helpanion' : 'walker');
        navigate(getRedirectPathByRole(redirectRole));
      }
    };
    
    checkAuth();
  }, [navigate, role]);

  const handleRoleJoin = async () => {
    if (!selectedRole) return;

    try {
      const roleResult = await addRole(selectedRole);
      if (roleResult?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to add role. Please try again.',
        });
        return;
      }

      const redirectPath = getRedirectPathByRole(selectedRole);
      navigate(redirectPath);

      toast({
        title: `Welcome to ${selectedRole === 'helpanion' ? 'Helpanion' : 'Walker'}!`,
        description: `You've successfully joined as a ${selectedRole}.`,
      });

      setShowRoleJoinModal(false);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
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
              variant: 'destructive',
              title: 'Username not found',
              description: 'No account found with this username.',
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
            variant: 'destructive',
            title: 'Login failed',
            description: error.message,
          });
        } else {
          // Wait briefly, then check roles and redirect
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
                  const redirectPath = getRedirectPathByRole(role);
                  navigate(redirectPath);
                  return;
                }

                const roles = userRoles?.map((r: any) => r.role) || [];
                const hasRequiredRole = roles.includes(role);

                if (!hasRequiredRole) {
                  setShowRoleJoinModal(true);
                  setSelectedRole(role);
                  return;
                }

                const redirectPath = getRedirectPathByRole(role);
                navigate(redirectPath);

                toast({
                  title: 'Welcome back!',
                  description: `You've successfully logged in as a ${role}.`,
                });
              }
            } catch (err) {
              console.error('Error in post-login flow:', err);
              const redirectPath = getRedirectPathByRole(role);
              navigate(redirectPath);
            }
          }, 600);
        }
      } else {
        // Signup flow — skipping email verification
        if (!fullName || !email || !password) {
          toast({
            title: 'Missing information',
            description: 'Please fill in name, email, and password.',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        // If Helpanion, require and check unique username before sign-up
        if (role === 'helpanion') {
          if (!username) {
            toast({
              title: 'Username required',
              description: 'Please choose a unique username for your public profile.',
              variant: 'destructive',
            });
            setLoading(false);
            return;
          }
          const { data: existing, error: existsErr } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .maybeSingle();

          if (existsErr) {
            console.warn('Username check error:', existsErr);
          }
          if (existing) {
            toast({
              variant: 'destructive',
              title: 'Username already taken',
              description: 'Please choose a different username.',
            });
            setLoading(false);
            return;
          }
        }

        const isHelpanion = role === 'helpanion';

        // Important: Ensure email confirmation is disabled in Supabase for immediate session.
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: fullName,
              username: isHelpanion ? username : null,
              role, // consumed later; also useful if you enable a server trigger
            },
          },
        });

        if (signUpError) {
          toast({
            title: 'Error signing up',
            description: signUpError.message,
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }

        try {
          // Ensure role assignment now that a session should exist
          const roleResult = await addRole(role);
          if (roleResult?.error) {
            console.warn('Failed to assign role:', roleResult.error);
          }

          // Update profile
          if (isHelpanion && username) {
            await updateProfile({
              username,
              last_active_role: 'helpanion',
            });
          } else {
            await updateProfile({ last_active_role: 'walker' });
          }

          toast({
            title: 'Welcome!',
            description: `Your ${isHelpanion ? 'Helpanion' : 'Walker'} account is ready.`,
          });

          navigate(getRedirectPathByRole(role));
          return;
        } catch (postErr) {
          console.error('Post-signup setup error:', postErr);
          toast({
            title: 'Signed up, but setup failed',
            description: 'Please try logging in; your account exists.',
            variant: 'destructive',
          });
          navigate('/auth?mode=login&role=' + role);
          return;
        }
      }
    } catch {
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
      const redirectPath = getRedirectPathByRole(role);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}${redirectPath}` },
      });
      if (error) {
        toast({
          title: 'Error with Google login',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch {
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
      const redirectPath = getRedirectPathByRole(role);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: { redirectTo: `${window.location.origin}${redirectPath}` },
      });
      if (error) {
        toast({
          title: 'Error with LinkedIn login',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch {
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
        redirectTo: `${window.location.origin}/auth?mode=login&role=${role}`,
      });

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error sending reset email',
          description: error.message,
        });
      } else {
        toast({
          title: 'Reset email sent!',
          description: 'Please check your email for password reset instructions.',
        });
        setShowForgotPassword(false);
        setResetEmail('');
      }
    } catch {
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
      return role === 'helpanion' ? 'Sign in to your Helpanion account' : 'Sign in to your Walker account';
    } else {
      return role === 'helpanion' ? 'Start helping others with your expertise' : 'Start your journey seeking guidance';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            <Link to="/" className="text-brand hover:text-brand/80 mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <CardTitle className="text-2xl font-serif text-foreground">{getTitle()}</CardTitle>
            </div>
          </div>
          <CardDescription className="text-muted-foreground">{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Social Login Buttons */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full border-border/60 hover:bg-accent/50 hover:border-accent" 
              onClick={handleGoogleLogin} 
              disabled={loading}
            >
              <Mail className="w-4 h-4 mr-2" />
              Continue with Gmail
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-border/60 hover:bg-accent/50 hover:border-accent" 
              onClick={handleLinkedInLogin} 
              disabled={loading}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Continue with LinkedIn
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-border/60" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Manual Login/Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="border-border/60 focus:border-brand focus:ring-brand/20"
                />
              </div>
            )}

            {mode === 'signup' && role === 'helpanion' && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground">Username (Unique Public ID)</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Choose a unique username"
                  className="border-border/60 focus:border-brand focus:ring-brand/20"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
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
                className="border-border/60 focus:border-brand focus:ring-brand/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                minLength={6}
                className="border-border/60 focus:border-brand focus:ring-brand/20"
              />
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-brand hover:text-brand/80 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-brand hover:bg-brand/90 text-brand-foreground" 
              disabled={loading}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <Link to={`/auth?mode=signup&role=${role}`} className="text-brand hover:text-brand/80 hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to={`/auth?mode=login&role=${role}`} className="text-brand hover:text-brand/80 hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resetEmail">Email Address</Label>
              <Input
                id="resetEmail"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForgotPassword(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Role Join Modal */}
      <Dialog open={showRoleJoinModal} onOpenChange={setShowRoleJoinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join as {selectedRole === 'helpanion' ? 'Helpanion' : 'Walker'}</DialogTitle>
            <DialogDescription>
              You don't have the {selectedRole} role yet. Would you like to join as a {selectedRole}?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setShowRoleJoinModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleRoleJoin} className="flex-1">
              Join as {selectedRole === 'helpanion' ? 'Helpanion' : 'Walker'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}