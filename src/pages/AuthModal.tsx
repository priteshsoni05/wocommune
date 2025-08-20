import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const navigate = useNavigate();

  const handleJoinAsHelpanion = () => {
    onOpenChange(false);
    navigate('/auth?mode=signup&role=helpanion');
  };

  const handleJoinAsWalker = () => {
    onOpenChange(false);
    navigate('/auth?mode=signup&role=walker');
  };

  const handleLogin = () => {
    onOpenChange(false);
    navigate('/auth?mode=login&role=walker');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-serif">Join Walker's Odyssey</DialogTitle>
          <DialogDescription className="text-center">
            Choose how you'd like to get started
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          <Button onClick={handleJoinAsHelpanion} className="w-full" size="lg">
            Join as a Helpanion
          </Button>
          <Button onClick={handleJoinAsWalker} variant="outline" className="w-full" size="lg">
            Join as a Walker
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          <Button onClick={handleLogin} variant="ghost" className="w-full">
            Already have an account? Sign in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}