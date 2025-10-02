import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck, Users } from 'lucide-react';

export type UserRole = 'walker' | 'helpanion';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  title: string;
  description: string;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  title,
  description
}) => {
  const roles = [
    {
      id: 'walker' as UserRole,
      name: 'Walker',
      description: 'Seek guidance and connect with helpanions.',
      icon: UserCheck,
      color: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100'
    },
    {
      id: 'helpanion' as UserRole,
      name: 'Helpanion',
      description: 'Share your experiences and guide others.',
      icon: Users,
      color: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:from-emerald-100 hover:to-teal-100'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-w-[90vw] mx-4 border-none shadow-none bg-transparent">
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 flex items-center justify-center p-4 -m-6">
          <div className="w-full max-w-md text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-lg text-foreground">
                JOIN WO COMMUNE AS
              </h1>
            </div>
            
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => onSelectRole('walker')}
                className="px-8 py-3 bg-background border-border text-foreground hover:bg-muted/50 transition-all duration-200 touch-manipulation font-medium rounded-full"
              >
                Walker
              </Button>
              <Button
                size="lg"
                onClick={() => onSelectRole('helpanion')}
                className="px-8 py-3 bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 touch-manipulation font-medium rounded-full"
                style={{ backgroundColor: '#193232', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#193232'}
              >
                Helpanion
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};