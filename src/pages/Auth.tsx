import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Mail, LogIn } from 'lucide-react';
import type { UserRole } from '@/hooks/useUserRoles';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('walker');
  const [loading, setLoading] = useState(false);
  const { user, signUp, signIn } = useAuth();
  const { addRole } = useUserRoles();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get the role from URL params if coming from "Join the Commune"
  const roleFromUrl = searchParams.get('role') as UserRole;
  
  useEffect(() => {
    if (roleFromUrl && ['walker', 'helpanion'].includes(roleFromUrl)) {
      setSelectedRole(roleFromUrl);
      setIsLogin(false); // Default to signup for role selection
    }
  }, [roleFromUrl]);

  useEffect(() => {
    if (user) {
      // Redirect based on user's role - will be handled by useUserRoles hook
      navigate('/helpanion');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: error.message
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully logged in."
          });
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({
            title: 'Error signing up',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          console.log('Signup successful, adding role:', selectedRole);
          // Add the selected role to the user after successful signup
          const roleResult = await addRole(selectedRole);
          console.log('Role assignment result:', roleResult);
          if (roleResult?.error) {
            console.warn('Failed to assign role:', roleResult.error);
          }
          
          toast({
            title: 'Welcome to WO Commune!',
            description: `You've joined as a ${selectedRole}. Please check your email to verify your account.`,
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/helpanion`
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/helpanion`
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-serif">
            {isLogin ? 'Welcome back' : 'Join WO Commune'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Sign in to your account' 
              : `Start your journey as a ${selectedRole === 'walker' ? 'Walker' : 'Helpanion'}`
            }
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

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            {!isLogin && !roleFromUrl && (
              <div className="space-y-3">
                <Label>Join as</Label>
                <RadioGroup value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="walker" id="walker" />
                    <Label htmlFor="walker" className="cursor-pointer">Walker - Seek help from experts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="helpanion" id="helpanion" />
                    <Label htmlFor="helpanion" className="cursor-pointer">Helpanion - Provide expert guidance</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
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
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}