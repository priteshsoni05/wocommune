import { Link } from 'react-router-dom';
import { ChevronDown, UserPlus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface AuthDropdownProps {
  variant?: 'mobile' | 'desktop';
}

export function AuthDropdown({ variant = 'desktop' }: AuthDropdownProps) {
  const isMobile = variant === 'mobile';
  
  console.log('AuthDropdown rendering with variant:', variant);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="default" 
          className={`gap-2 bg-brand hover:bg-brand/90 text-brand-foreground ${isMobile ? 'text-xs px-3 py-1.5' : ''}`}
          onClick={() => console.log('AuthDropdown trigger clicked')}
        >
          {isMobile ? 'Login/Sign Up' : 'Join/Login'}
          <ChevronDown className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-card border-border shadow-lg z-[9999] min-w-48"
        sideOffset={4}
      >
        <DropdownMenuItem asChild className="hover:bg-accent cursor-pointer focus:bg-accent">
          <Link 
            to="/auth?mode=login" 
            className="flex items-center px-3 py-2 w-full"
            onClick={() => console.log('Login clicked')}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-accent cursor-pointer focus:bg-accent">
          <Link 
            to="/auth?mode=signup" 
            className="flex items-center px-3 py-2 w-full"
            onClick={() => console.log('Signup clicked')}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Sign Up
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}