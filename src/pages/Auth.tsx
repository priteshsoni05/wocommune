import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import GlobalHeader from '@/components/common/GlobalHeader';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'signin';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'walker' | 'helpanion'>('walker');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: displayName,
            selected_role: selectedRole
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success('Account created! Please check your email to verify your account.');
        // Navigate to WO Commune after successful signup
        navigate('/wo-commune');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Welcome back!');
      navigate('/wo-commune');
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <div className="container mx-auto px-4 py-8 max-w-md mt-8 md:mt-10">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-brand">
              {mode === 'signup' ? 'Join WO Commune' : 'Welcome Back'}
            </CardTitle>
            <p className="text-muted-foreground">
              {mode === 'signup' 
                ? 'Choose your role and create your account' 
                : 'Sign in to your account'
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Choose Your Role</Label>
                <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'walker' | 'helpanion')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="walker" className="flex items-center gap-2">
                      <span>🚶</span>
                      Walker
                    </TabsTrigger>
                    <TabsTrigger value="helpanion" className="flex items-center gap-2">
                      <span>🤝</span>
                      Helpanion
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="walker" className="mt-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold text-brand mb-2">I'm a Walker</h3>
                      <p className="text-sm text-muted-foreground">
                        Seeking guidance, support, and connection on my journey. 
                        Ready to find a helpanion who understands my path.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="helpanion" className="mt-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <h3 className="font-semibold text-brand mb-2">I'm a Helpanion</h3>
                      <p className="text-sm text-muted-foreground">
                        Ready to share my experience and support others on their journey. 
                        I want to help walkers find their way.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <form onSubmit={mode === 'signup' ? handleSignUp : handleSignIn} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="displayName"
                      type="text"
                      placeholder="Enter your display name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-brand hover:bg-brand/90 text-brand-foreground"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
              </Button>
            </form>

            <div className="text-center text-sm">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <Link to="/auth?mode=signin" className="text-brand hover:underline">
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <Link to="/auth?mode=signup" className="text-brand hover:underline">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}