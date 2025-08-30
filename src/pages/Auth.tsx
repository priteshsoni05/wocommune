import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRolePersistence } from '@/hooks/useRolePersistence';
import { RoleSelectionModal, UserRole } from '@/components/auth/RoleSelectionModal';
import { RoleSwitchModal } from '@/components/auth/RoleSwitchModal';
import { SignupForm } from '@/components/auth/SignupForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { toast } from 'sonner';

export default function Auth() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [noRoleMessage, setNoRoleMessage] = useState('');

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { setActiveRole, getDashboardPath } = useRolePersistence();

  const mode = searchParams.get('mode') as 'login' | 'signup' | null;
  const role = searchParams.get('role') as UserRole | null;

  // Initialize auth mode from URL
  useEffect(() => {
    if (mode === 'signup') {
      setAuthMode('signup');
      if (role) {
        setSelectedRole(role);
        setShowSignupForm(true);
      } else {
        setShowRoleSelection(true);
      }
    } else {
      setAuthMode('login');
    }
  }, [mode, role]);

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      const dashboardPath = getDashboardPath();
      if (dashboardPath !== '/auth') {
        navigate(dashboardPath);
      }
    }
  }, [user, navigate, getDashboardPath]);

  const handleRoleSwitch = (selectedRole: UserRole, rememberChoice: boolean) => {
    setActiveRole(selectedRole);
    
    if (rememberChoice) {
      localStorage.setItem('wo_commune_preferred_role', selectedRole);
    }
    
    const dashboardPath = selectedRole === 'helpanion' ? '/helpanion-dashboard' : '/walker-dashboard';
    navigate(dashboardPath);
    
    setShowRoleSwitch(false);
    toast.success(`Welcome back to your ${selectedRole} dashboard!`);
  };

  const handleLoginSuccess = (userRoles: UserRole[]) => {
    if (userRoles.length === 1) {
      // Single role - redirect directly
      const role = userRoles[0];
      setActiveRole(role);
      const dashboardPath = role === 'helpanion' ? '/helpanion-dashboard' : '/walker-dashboard';
      navigate(dashboardPath);
      toast.success(`Welcome back!`);
    } else if (userRoles.length > 1) {
      // Multiple roles - show role switch modal
      const preferredRole = localStorage.getItem('wo_commune_preferred_role') as UserRole;
      if (preferredRole && userRoles.includes(preferredRole)) {
        // Use preferred role if available
        setActiveRole(preferredRole);
        const dashboardPath = preferredRole === 'helpanion' ? '/helpanion-dashboard' : '/walker-dashboard';
        navigate(dashboardPath);
        toast.success(`Welcome back to your ${preferredRole} dashboard!`);
      } else {
        // Show role selection
        setAvailableRoles(userRoles);
        setShowRoleSwitch(true);
      }
    }
  };

  const handleLoginNoRole = (email: string) => {
    setUserEmail(email);
    setNoRoleMessage(`You don't have any active profiles yet. Would you like to create one?`);
  };

  const handleSignupForRole = (role: UserRole) => {
    setSelectedRole(role);
    setShowRoleSelection(false);
    setShowSignupForm(true);
    // Update URL to reflect the signup flow
    navigate(`/auth?mode=signup&role=${role}`, { replace: true });
  };

  const handleSignupSuccess = () => {
    setShowSignupForm(false);
    toast.success('Account created successfully! Welcome!');
    // The signup form handles navigation
  };

  const handleBackToMain = () => {
    setShowSignupForm(false);
    setShowRoleSelection(false);
    setSelectedRole(null);
    setNoRoleMessage('');
    setAuthMode('login');
    navigate('/auth', { replace: true });
  };

  const handleCreateAccount = () => {
    setAuthMode('signup');
    setShowRoleSelection(true);
  };

  const getMainTitle = () => {
    return authMode === 'login' ? 'Welcome Back' : 'Create Your Account';
  };

  const getMainDescription = () => {
    return authMode === 'login' 
      ? 'Sign in to access your dashboard' 
      : 'Choose your role to get started';
  };

  // If showing signup form for specific role
  if (showSignupForm && selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 flex items-center justify-center p-4 safe-area-y">
        <Card className="w-full max-w-md shadow-lg border-border/50 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 px-6 py-6">
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={handleBackToMain}
                className="text-brand hover:text-brand/80 mr-4 touch-manipulation p-1"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <CardTitle className="text-2xl font-serif text-foreground">
                  Join as {selectedRole === 'helpanion' ? 'Helpanion' : 'Walker'}
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-muted-foreground leading-relaxed">
              {selectedRole === 'helpanion' 
                ? 'Share your experiences and guide others' 
                : 'Seek guidance and connect with helpanions'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <SignupForm
              selectedRole={selectedRole}
              onSuccess={handleSignupSuccess}
              onCancel={handleBackToMain}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 flex items-center justify-center p-4 safe-area-y">
      <Card className="w-full max-w-md shadow-lg border-border/50 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 px-6 py-6">
          <div className="flex items-center justify-center mb-4">
            <Link to="/" className="text-brand hover:text-brand/80 mr-4 touch-manipulation p-1">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <CardTitle className="text-2xl font-serif text-foreground">
                {getMainTitle()}
              </CardTitle>
            </div>
          </div>
          <CardDescription className="text-muted-foreground leading-relaxed">
            {getMainDescription()}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 px-6 pb-6">
          {authMode === 'login' ? (
            <>
              {noRoleMessage && (
                <Alert className="border-brand/20 bg-brand/5">
                  <AlertCircle className="h-4 w-4 text-brand" />
                  <AlertDescription className="text-brand font-medium">
                    {noRoleMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              <LoginForm
                onSuccess={handleLoginSuccess}
                onNoRoleFound={handleLoginNoRole}
              />
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-11 font-semibold touch-manipulation"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
                </Button>
                
                {noRoleMessage && (
                  <Button
                    variant="default"
                    className="w-full h-11 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold touch-manipulation"
                    onClick={handleCreateAccount}
                  >
                    Create New Profile
                  </Button>
                )}
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={handleCreateAccount}
                  className="text-brand hover:text-brand/80 hover:underline font-semibold touch-manipulation"
                >
                  Sign up
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Please select your role to continue with signup
              </p>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setShowRoleSelection(false);
                  }}
                  className="text-brand hover:text-brand/80 hover:underline font-semibold touch-manipulation"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Selection Modal for Signup */}
      <RoleSelectionModal
        isOpen={showRoleSelection}
        onClose={() => {
          setShowRoleSelection(false);
          setAuthMode('login');
        }}
        onSelectRole={handleSignupForRole}
        title="Choose Your Role"
        description="Select how you'd like to participate in the WO Commune community."
      />

      {/* Role Switch Modal for Multi-Role Users */}
      <RoleSwitchModal
        isOpen={showRoleSwitch}
        onClose={() => setShowRoleSwitch(false)}
        availableRoles={availableRoles}
        onSelectRole={handleRoleSwitch}
      />

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}