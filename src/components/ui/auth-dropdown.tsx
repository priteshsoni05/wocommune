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
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-3 py-2">
          Login to Existing Account
        </DropdownMenuLabel>
        <DropdownMenuItem asChild className="hover:bg-accent cursor-pointer focus:bg-accent">
          <Link 
            to="/auth?mode=login&role=walker" 
            className="flex items-center px-3 py-2 w-full"
            onClick={() => console.log('Walker login clicked')}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login as Walker
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-accent cursor-pointer focus:bg-accent">
          <Link 
            to="/auth?mode=login&role=helpanion" 
            className="flex items-center px-3 py-2 w-full"
            onClick={() => console.log('Helpanion login clicked')}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Login as Helpanion
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-border my-1" />
        
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground px-3 py-2">
          Create New Account
        </DropdownMenuLabel>
        <DropdownMenuItem asChild className="hover:bg-accent cursor-pointer focus:bg-accent">
          <Link 
            to="/auth?mode=signup&role=walker" 
            className="flex items-center px-3 py-2 w-full"
            onClick={() => console.log('Walker signup clicked')}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Join as Walker
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="hover:bg-accent cursor-pointer focus:bg-accent">
          <Link 
            to="/auth?mode=signup&role=helpanion" 
            className="flex items-center px-3 py-2 w-full"
            onClick={() => console.log('Helpanion signup clicked')}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Join as Helpanion
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}