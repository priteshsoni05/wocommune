import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import { SeekHelpModal } from './SeekHelpModal';
import { SmartSearchBar } from './SmartSearchBar';
import { AuthDropdown } from '@/components/ui/auth-dropdown';

interface HelpanionHeaderProps {
  onFilteredSearch: (filters: string[]) => void;
}

export function HelpanionHeader({ onFilteredSearch }: HelpanionHeaderProps) {
  const [isSeekHelpModalOpen, setIsSeekHelpModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { hasRole } = useUserRoles();
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {/* Mobile Layout */}
          <div className="flex lg:hidden items-center justify-between mb-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-lg sm:text-xl font-semibold text-foreground hover:text-primary transition-colors">
                WO Commune
              </Link>
            </div>
            
            {/* Mobile Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="default" 
                onClick={() => setIsSeekHelpModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-xs px-3 py-1.5"
              >
                Seek Help
              </Button>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-7 w-7 rounded-full">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || 'User'} />
                        <AvatarFallback>
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-xs font-medium leading-none">{profile?.display_name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      if (profile?.last_active_role === 'helpanion' && hasRole('helpanion')) {
                        navigate('/helpanion-dashboard');
                      } else if (profile?.last_active_role === 'walker' && hasRole('walker')) {
                        navigate('/walker-dashboard');
                      } else if (hasRole('helpanion')) {
                        navigate('/helpanion-dashboard');
                      } else {
                        navigate('/walker-dashboard');
                      }
                    }}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <AuthDropdown variant="mobile" />
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden w-full">
            <SmartSearchBar 
              placeholder="Search Helpanions..."
              isMobile={true}
            />
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                WO Commune
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <SmartSearchBar />
            </div>

             {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="default" 
                onClick={() => setIsSeekHelpModalOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                Seek Help
              </Button>

              {user ? (
                /* User Profile Dropdown */
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.display_name || 'User'} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{profile?.display_name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{profile?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {
                      // Navigate to appropriate dashboard based on user's last active role or available roles
                      if (profile?.last_active_role === 'helpanion' && hasRole('helpanion')) {
                        navigate('/helpanion-dashboard');
                      } else if (profile?.last_active_role === 'walker' && hasRole('walker')) {
                        navigate('/walker-dashboard');
                      } else if (hasRole('helpanion')) {
                        navigate('/helpanion-dashboard');
                      } else {
                        navigate('/walker-dashboard');
                      }
                    }}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
               ) : (
                <AuthDropdown variant="desktop" />
              )}
            </div>
          </div>
        </div>
      </header>

      <SeekHelpModal 
        isOpen={isSeekHelpModalOpen}
        onClose={() => setIsSeekHelpModalOpen(false)}
        onFindHelpanions={onFilteredSearch}
      />
    </>
  );
}