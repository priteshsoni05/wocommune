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
import WOCommuneSlate from '@/components/common/WOCommuneSlate';
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
        <div className="pt-8 md:pt-10">
          <WOCommuneSlate />
        </div>
        <div className="flex-1 flex items-center justify-center p-4 pt-8">
          <Card className="w-full max-w-2xl shadow-xl border-border/30 bg-card/98 backdrop-blur-sm">
            <CardContent className="p-8">
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
      <div className="pt-8 md:pt-10">
        <WOCommuneSlate />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 pt-8">
        {authMode === 'login' ? (
          <Card className="w-full max-w-lg shadow-xl border-border/30 bg-card/98 backdrop-blur-sm">
            <CardContent className="p-8">
              {noRoleMessage && (
                <Alert className="border-primary/20 bg-primary/5 mb-6">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-primary font-medium font-sans">
                    {noRoleMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              <LoginForm
                onSuccess={handleLoginSuccess}
                onNoRoleFound={handleLoginNoRole}
                setShowForgotPassword={setShowForgotPassword}
              />
              
              {noRoleMessage && (
                <div className="mt-6">
                  <Button
                    variant="default"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-lg transition-all duration-200 font-sans"
                    onClick={handleCreateAccount}
                  >
                    Create New Profile
                  </Button>
                </div>
              )}
              
              <div className="mt-8 text-center text-sm text-muted-foreground font-sans">
                Don't have an account?{' '}
                <button
                  onClick={handleCreateAccount}
                  className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors"
                >
                  Sign up
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full max-w-2xl text-center">
            <div className="space-y-6 mb-12">
              <h1 className="font-brand text-4xl font-bold text-foreground">Join WO Commune</h1>
              <p className="text-lg text-muted-foreground font-sans max-w-md mx-auto">
                Choose your role and become part of our supportive community
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
              <Card 
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 hover:border-primary/30"
                onClick={() => handleSignupForRole('walker')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                    <span className="text-2xl font-brand font-bold text-foreground group-hover:text-primary transition-colors">W</span>
                  </div>
                  <h3 className="font-brand text-xl font-bold text-foreground mb-2">Walker</h3>
                  <p className="text-sm text-muted-foreground font-sans">
                    Seek guidance and connect with helpanions
                  </p>
                </CardContent>
              </Card>
              
              <Card 
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl border-2 hover:border-primary/30 bg-primary/5"
                onClick={() => handleSignupForRole('helpanion')}
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/90 transition-colors">
                    <span className="text-2xl font-brand font-bold text-primary-foreground">H</span>
                  </div>
                  <h3 className="font-brand text-xl font-bold text-foreground mb-2">Helpanion</h3>
                  <p className="text-sm text-muted-foreground font-sans">
                    Share your experiences and guide others
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12 text-center text-sm text-muted-foreground font-sans">
              Already have an account?{' '}
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowRoleSelection(false);
                }}
                className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors"
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