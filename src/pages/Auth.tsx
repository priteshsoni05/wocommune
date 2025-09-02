import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GlobalHeader from '@/components/common/GlobalHeader';
import { Footer } from '@/components/common/Footer';
import { Loader2, User, Heart, ArrowLeft } from 'lucide-react';

/* Brand colors matching home page */
const PINE = "#193232";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const mode = searchParams.get('mode') || 'login';
  
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'walker' | 'helpanion' | null>(null);
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

  const handleRoleSelection = (role: 'walker' | 'helpanion') => {
    setSelectedRole(role);
  };

  const handleBackToRoleSelection = () => {
    setSelectedRole(null);
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

      if (data.user && selectedRole) {
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

      // Clear form and reset to role selection
      setFormData({
        email: '',
        password: '',
        displayName: '',
        confirmPassword: ''
      });
      setSelectedRole(null);
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

  // Login Form
  if (mode === 'login') {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#2B2B2B]">
        <GlobalHeader />
        
        {/* Hero-style background for login */}
        <section className="relative w-full min-h-[85vh] mt-8 md:mt-10">
          <div className="absolute inset-0" style={{ backgroundColor: PINE }} />
          
          <div className="relative z-10 max-w-[1140px] mx-auto px-4 md:px-8 h-full flex flex-col items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2" style={{ color: PINE }}>
                  Welcome Back
                </h1>
                <p className="text-gray-600">
                  Sign in to continue your journey
                </p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
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
                
                <Button 
                  type="submit" 
                  className="w-full"
                  style={{ backgroundColor: PINE, color: "white" }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
              
              <div className="text-center text-sm mt-6">
                <p>
                  Don't have an account?{' '}
                  <Link to="/auth?mode=signup" className="hover:underline" style={{ color: PINE }}>
                    Sign up
                  </Link>
                </p>
              </div>
              
              <div className="text-center mt-4">
                <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                  ← Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  // Signup Flow - Step 1: Role Selection
  if (mode === 'signup' && !selectedRole) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <GlobalHeader />
        
        {/* Clean role selection section */}
        <section className="relative w-full min-h-[85vh] mt-8 md:mt-10 flex items-center justify-center">
          <div className="max-w-[1140px] mx-auto px-4 md:px-8 text-center">
            
            {/* Title */}
            <h1 className="text-lg md:text-xl font-medium mb-6 text-foreground tracking-wide">
              JOIN WO COMMUNE AS
            </h1>
            
            {/* Divider */}
            <div className="w-12 border-t border-foreground mx-auto mb-8" />
            
            {/* Role Selection Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xs mx-auto">
              {/* Walker Button */}
              <Button 
                onClick={() => handleRoleSelection('walker')}
                className="w-full sm:w-28 h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium text-sm"
              >
                Walker
              </Button>

              {/* Helpanion Button */}
              <Button 
                onClick={() => handleRoleSelection('helpanion')}
                className="w-full sm:w-28 h-10 rounded-full font-medium text-sm"
                style={{ backgroundColor: PINE, color: "white" }}
              >
                Helpanion
              </Button>
            </div>
            
            {/* Back to login */}
            <div className="mt-12">
              <Link to="/auth?mode=login" className="text-muted-foreground hover:text-foreground text-sm">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    );
  }

  // Signup Flow - Step 2: Form
  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalHeader />
      
      {/* Clean minimal form section */}
      <section className="relative w-full min-h-[85vh] mt-8 md:mt-10 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 md:px-8 w-full">
          
          {/* Role indicator */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              {selectedRole === 'walker' ? (
                <User className="w-8 h-8 text-muted-foreground" />
              ) : (
                <Heart className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            <h1 className="text-xl font-medium text-foreground mb-2">
              {selectedRole === 'walker' ? 'Join as Walker' : 'Join as Helpanion'}
            </h1>
            <p className="text-sm text-muted-foreground">
              Create your account to get started
            </p>
          </div>
          
          {/* Back button */}
          <Button
            variant="ghost"
            onClick={handleBackToRoleSelection}
            className="mb-6 p-0 h-auto text-muted-foreground hover:text-foreground text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to role selection
          </Button>
          
          {/* Clean signup form */}
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName" className="text-sm font-medium text-foreground">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Enter your display name"
                  className="mt-1 h-11 border-border focus:border-foreground"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="mt-1 h-11 border-border focus:border-foreground"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="mt-1 h-11 border-border focus:border-foreground"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="mt-1 h-11 border-border focus:border-foreground"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-md"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
          
          {/* Sign in link */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/auth?mode=login" className="text-foreground hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}