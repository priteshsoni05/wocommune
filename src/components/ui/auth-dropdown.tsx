import { useState } from 'react';
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
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="default" 
          className={`gap-2 ${isMobile ? 'text-xs px-3 py-1.5' : ''}`}
        >
          {isMobile ? 'Login/Sign Up' : 'Join/Login'}
          <ChevronDown className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Login to Existing Account
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/auth?mode=login&role=walker" className="cursor-pointer">
            <LogIn className="h-4 w-4 mr-2" />
            Login as Walker
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/auth?mode=login&role=helpanion" className="cursor-pointer">
            <LogIn className="h-4 w-4 mr-2" />
            Login as Helpanion
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Create New Account
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link to="/auth?mode=signup&role=walker" className="cursor-pointer">
            <UserPlus className="h-4 w-4 mr-2" />
            Join as Walker
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/auth?mode=signup&role=helpanion" className="cursor-pointer">
            <UserPlus className="h-4 w-4 mr-2" />
            Join as Helpanion
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}