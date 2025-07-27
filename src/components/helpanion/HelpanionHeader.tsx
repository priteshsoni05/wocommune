import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useUserRoles } from '@/hooks/useUserRoles';
import { SeekHelpModal } from './SeekHelpModal';

interface HelpanionHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilteredSearch: (filters: string[]) => void;
}

export function HelpanionHeader({ searchTerm, onSearchChange, onFilteredSearch }: HelpanionHeaderProps) {
  const [isSeekHelpModalOpen, setIsSeekHelpModalOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useProfile();
  const { hasRole } = useUserRoles();
  const navigate = useNavigate();

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-serif font-bold text-foreground hover:text-primary transition-colors">
                WO Commune
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for a Helpanion by field, experience, or keyword..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-muted/30 border-muted focus:bg-background"
                />
              </div>
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
                    {hasRole('walker') && (
                      <DropdownMenuItem onClick={() => navigate('/walker-dashboard')}>
                        Walker Dashboard
                      </DropdownMenuItem>
                    )}
                    {hasRole('helpanion') && (
                      <DropdownMenuItem onClick={() => navigate('/helpanion-dashboard')}>
                        Helpanion Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default" className="gap-2">
                        Join the Commune
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/auth?mode=signup&role=walker" className="cursor-pointer">Walker</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/auth?mode=signup&role=helpanion" className="cursor-pointer">Helpanion</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        Already a Member
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/auth?mode=login&role=walker" className="cursor-pointer">Walker</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/auth?mode=login&role=helpanion" className="cursor-pointer">Helpanion</Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
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