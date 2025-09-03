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
import GlobalHeader from '@/components/common/GlobalHeader';
import { Footer } from '@/components/common/Footer';
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
    console.log('Auth page URL params:', { mode, role });
    if (mode === 'signup') {
      console.log('Setting signup mode');
      setAuthMode('signup');
      if (role) {
        setSelectedRole(role);
        setShowSignupForm(true);
        console.log('Showing signup form for role:', role);
      } else {
        setShowRoleSelection(true);
        console.log('Showing role selection modal');
      }
    } else {
      console.log('Setting login mode');
      setAuthMode('login');
      // Reset signup states when switching to login
      setShowRoleSelection(false);
      setShowSignupForm(false);
      setSelectedRole(null);
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
    if (!user) return;
    
    setActiveRole(selectedRole);
    
    if (rememberChoice) {
      localStorage.setItem('wo_commune_preferred_role', selectedRole);
    }
    
    const dashboardPath = selectedRole === 'helpanion' ? `/helpanion/${user.id}` : `/walker/${user.id}`;
    navigate(dashboardPath);
    
    setShowRoleSwitch(false);
    toast.success(`Welcome back to your ${selectedRole} dashboard!`);
  };

  const handleLoginSuccess = (userRoles: UserRole[]) => {
    if (!user) return;
    
    if (userRoles.length === 1) {
      // Single role - redirect directly
      const role = userRoles[0];
      setActiveRole(role);
      const dashboardPath = role === 'helpanion' ? `/helpanion/${user.id}` : `/walker/${user.id}`;
      navigate(dashboardPath);
      toast.success(`Welcome back!`);
    } else if (userRoles.length > 1) {
      // Multiple roles - show role switch modal
      const preferredRole = localStorage.getItem('wo_commune_preferred_role') as UserRole;
      if (preferredRole && userRoles.includes(preferredRole)) {
        // Use preferred role if available
        setActiveRole(preferredRole);
        const dashboardPath = preferredRole === 'helpanion' ? `/helpanion/${user.id}` : `/walker/${user.id}`;
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

  const handleSignupSuccess = (role: UserRole) => {
    setShowSignupForm(false);
    
    if (user) {
      // User is authenticated (email confirmation disabled) - navigate directly
      const dashboardPath = role === 'helpanion' ? `/helpanion/${user.id}` : `/walker/${user.id}`;
      navigate(dashboardPath);
      toast.success(`Welcome! Your ${role} account is ready.`);
    } else {
      // Email confirmation required - show success message and redirect to login
      setAuthMode('login');
      navigate('/auth?mode=login', { replace: true });
      toast.success(`Account created successfully! Please check your email to verify your account, then sign in.`);
    }
  };

  const handleBackToMain = () => {
    setShowSignupForm(false);
    setShowRoleSelection(false);
    setSelectedRole(null);
    setNoRoleMessage('');
    setAuthMode('signup');
    navigate('/auth?mode=signup', { replace: true });
  };

  const handleCreateAccount = () => {
    console.log('handleCreateAccount called');
    setAuthMode('signup');
    setShowRoleSelection(true);
    setShowSignupForm(false);
    setSelectedRole(null);
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
      <div className="min-h-screen flex flex-col">
        <GlobalHeader />
        <div className="flex-1 flex items-center justify-center p-4 pt-16">
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
                  <CardTitle className="text-2xl font-bold text-foreground">
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <GlobalHeader />

      <div className="flex-1 flex items-center justify-center p-4 pt-16">
        {authMode === 'login' ? (
          <Card className="w-full max-w-md shadow-lg border-border/50 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 px-6 py-6">
              <CardTitle className="text-2xl font-bold text-foreground">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 px-6 pb-6">
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
            </CardContent>
          </Card>
        ) : (
          <div className="w-full max-w-lg text-center">
            <h3 className="text-lg font-bold text-foreground mb-8">
              JOIN WO COMMUNE AS
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg font-semibold border-2 hover:bg-muted/10"
                onClick={() => handleSignupForRole('walker')}
              >
                Walker
              </Button>
              
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg font-semibold text-white"
                style={{ backgroundColor: '#193232' }}
                onClick={() => handleSignupForRole('helpanion')}
              >
                Helpanion
              </Button>
            </div>
            
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowRoleSelection(false);
                }}
                className="text-brand hover:text-brand/80 hover:underline font-semibold"
              >
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
      
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