import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GlobalHeader from '@/components/common/GlobalHeader';
import { Footer } from '@/components/common/Footer';
import { Loader2, User, Heart } from 'lucide-react';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const mode = searchParams.get('mode') || 'login';
  
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'walker' | 'helpanion'>('walker');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });

      navigate('/wo-commune');
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/wo-commune`;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: formData.displayName,
            initial_role: selectedRole
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Insert the selected role for the new user
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: selectedRole
          });

        if (roleError) {
          console.error('Error adding role:', roleError);
        }
      }

      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });

      // Clear form
      setFormData({
        email: '',
        password: '',
        displayName: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
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
                ? 'Connect with walkers and helpanions' 
                : 'Sign in to your account'
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {mode === 'signup' && (
              <>
                {/* Role Selection */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Choose your role</Label>
                  <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as 'walker' | 'helpanion')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="walker">
                        <User className="w-4 h-4 mr-2" />
                        Walker
                      </TabsTrigger>
                      <TabsTrigger value="helpanion">
                        <Heart className="w-4 h-4 mr-2" />
                        Helpanion
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="walker" className="mt-4">
                      <div className="p-4 bg-brand/5 rounded-lg text-center">
                        <User className="w-8 h-8 mx-auto mb-2 text-brand" />
                        <h4 className="font-semibold text-brand">I'm a Walker</h4>
                        <p className="text-sm text-muted-foreground">
                          Seeking guidance and support on my journey
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="helpanion" className="mt-4">
                      <div className="p-4 bg-brand/5 rounded-lg text-center">
                        <Heart className="w-8 h-8 mx-auto mb-2 text-brand" />
                        <h4 className="font-semibold text-brand">I'm a Helpanion</h4>
                        <p className="text-sm text-muted-foreground">
                          Ready to help and guide others on their path
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                <Separator />
              </>
            )}
            
            {/* Auth Form */}
            <form onSubmit={mode === 'signup' ? handleSignup : handleLogin} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="How should we call you?"
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-brand hover:bg-brand/90 text-brand-foreground"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  mode === 'signup' ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>
            
            <div className="text-center text-sm">
              {mode === 'signup' ? (
                <p>
                  Already have an account?{' '}
                  <Link to="/auth?mode=login" className="text-brand hover:underline">
                    Sign in
                  </Link>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <Link to="/auth?mode=signup" className="text-brand hover:underline">
                    Sign up
                  </Link>
                </p>
              )}
            </div>
            
            <div className="text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-brand">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
}