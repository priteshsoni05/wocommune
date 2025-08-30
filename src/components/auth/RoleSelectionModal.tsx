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
      <DialogContent className="sm:max-w-md max-w-[90vw] mx-4">
        <DialogHeader className="space-y-4 text-center">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {title}
          </DialogTitle>
          <p className="text-muted-foreground text-sm px-2">
            {description}
          </p>
        </DialogHeader>
        
        <div className="space-y-3 mt-6 px-2">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] touch-manipulation ${role.color}`}
                onClick={() => onSelectRole(role.id)}
              >
                <CardHeader className="pb-3 px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold text-foreground">
                        {role.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                        {role.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 px-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="w-full touch-manipulation font-semibold"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};