import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { UserCheck, Users } from 'lucide-react';

export type UserRole = 'walker' | 'helpanion';

interface RoleSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableRoles: UserRole[];
  onSelectRole: (role: UserRole, rememberChoice: boolean) => void;
}

export const RoleSwitchModal: React.FC<RoleSwitchModalProps> = ({
  isOpen,
  onClose,
  availableRoles,
  onSelectRole
}) => {
  const [rememberChoice, setRememberChoice] = useState(false);

  const roleConfig = {
    walker: {
      name: 'Walker',
      description: 'Continue as a seeker of guidance',
      icon: UserCheck,
      color: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100'
    },
    helpanion: {
      name: 'Helpanion',
      description: 'Continue as a guide and mentor',
      icon: Users,
      color: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:from-emerald-100 hover:to-teal-100'
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    onSelectRole(role, rememberChoice);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-w-[90vw] mx-4">
        <DialogHeader className="space-y-4 text-center">
          <DialogTitle className="text-2xl font-serif text-foreground">
            Choose Your Profile
          </DialogTitle>
          <p className="text-muted-foreground text-sm px-2">
            You have profiles as both Walker and Helpanion. Choose which one to continue with.
          </p>
        </DialogHeader>
        
        <div className="space-y-3 mt-6 px-2">
          {availableRoles.map((roleId) => {
            const role = roleConfig[roleId];
            const IconComponent = role.icon;
            return (
              <Card
                key={roleId}
                className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] touch-manipulation ${role.color}`}
                onClick={() => handleRoleSelect(roleId)}
              >
                <CardHeader className="pb-3 px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-serif font-semibold text-foreground">
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

        <div className="mt-6 space-y-4 px-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-choice"
              checked={rememberChoice}
              onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
              className="touch-target"
            />
            <label 
              htmlFor="remember-choice" 
              className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
            >
              Remember my choice next time
            </label>
          </div>
          
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