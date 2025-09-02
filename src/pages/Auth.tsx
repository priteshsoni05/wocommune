import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft } from 'lucide-react';
import GlobalHeader from '@/components/common/GlobalHeader';
import { Footer } from '@/components/common/Footer';

type AuthMode = 'login' | 'signup';
type UserRole = 'walker' | 'helpanion';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [selectedRole, setSelectedRole] = useState<UserRole>('walker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: displayName || 'New User',
              initial_role: selectedRole
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
        } else {
          setMessage('Check your email for the confirmation link!');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          // Redirect will happen automatically through auth state change
          setMessage('Welcome back!');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader />
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-md mt-8 md:mt-10">
        {/* Back to WO Commune link */}
        <Link 
          to="/wo-commune" 
          className="inline-flex items-center gap-2 text-brand hover:text-brand/80 mb-6"
        >
          <ArrowLeft size={16} />
          Back to WO Commune
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-brand">
              {mode === 'signup' ? 'Join WO Commune' : 'Welcome Back'}
            </CardTitle>
            <p className="text-muted-foreground">
              {mode === 'signup' 
                ? 'Choose your role and create your account' 
                : 'Sign in to your account'
              }
            </p>
          </CardHeader>
          
          <CardContent>
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <Button
                type="button"
                variant={mode === 'signup' ? 'default' : 'outline'}
                onClick={() => setMode('signup')}
                className="flex-1"
              >
                Sign Up
              </Button>
              <Button
                type="button"
                variant={mode === 'login' ? 'default' : 'outline'}
                onClick={() => setMode('login')}
                className="flex-1"
              >
                Log In
              </Button>
            </div>

            {/* Role Selection for Signup */}
            {mode === 'signup' && (
              <div className="mb-6">
                <Label className="text-base font-semibold mb-3 block">
                  I want to join as a:
                </Label>
                <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="walker">Walker</TabsTrigger>
                    <TabsTrigger value="helpanion">Helpanion</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="walker" className="mt-4">
                    <Card className="p-4 bg-brand/5">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-xl">🚶</span>
                        </div>
                        <h4 className="font-semibold text-brand mb-2">Walker</h4>
                        <p className="text-sm text-muted-foreground">
                          Seeking guidance and support on my journey
                        </p>
                      </div>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="helpanion" className="mt-4">
                    <Card className="p-4 bg-brand/5">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-xl">🤝</span>
                        </div>
                        <h4 className="font-semibold text-brand mb-2">Helpanion</h4>
                        <p className="text-sm text-muted-foreground">
                          Ready to share my experience and help others
                        </p>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How should we call you?"
                    required
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-brand hover:bg-brand/90 text-brand-foreground"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                  </>
                ) : (
                  mode === 'signup' ? 'Create Account' : 'Sign In'
                )}
              </Button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === 'signup' ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-brand hover:text-brand/80 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-brand hover:text-brand/80 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}