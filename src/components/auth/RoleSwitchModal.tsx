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
      <DialogContent className="sm:max-w-md max-w-[90vw] mx-4 border-none shadow-none bg-transparent">
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/20 flex items-center justify-center p-4 -m-6">
          <div className="w-full max-w-md text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-lg font-sans text-foreground">
                CHOOSE YOUR PROFILE
              </h1>
              <p className="text-muted-foreground font-sans text-sm">
                You have profiles as both Walker and Helpanion. Choose which one to continue with.
              </p>
            </div>
            
            <div className="space-y-4">
              {availableRoles.map((roleId) => {
                const role = roleConfig[roleId];
                const IconComponent = role.icon;
                return (
                  <div
                    key={roleId}
                    className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-background/90 hover:border-primary/30 touch-manipulation"
                    onClick={() => handleRoleSelect(roleId)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: roleId === 'helpanion' ? '#193232' : '#f3f4f6' }}>
                        <span className="text-lg font-sans font-bold" style={{ color: roleId === 'helpanion' ? 'white' : '#193232' }}>
                          {roleId === 'helpanion' ? 'H' : 'W'}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-sans font-semibold text-foreground">
                          {role.name}
                        </h3>
                        <p className="text-sm text-muted-foreground font-sans">
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Checkbox
                  id="remember-choice"
                  checked={rememberChoice}
                  onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
                  className="touch-target"
                />
                <label 
                  htmlFor="remember-choice" 
                  className="text-sm text-muted-foreground cursor-pointer font-sans"
                >
                  Remember my choice next time
                </label>
              </div>
              
              <Button 
                variant="outline" 
                onClick={onClose} 
                className="w-full h-12 font-sans font-semibold bg-background border-border hover:bg-muted/50 transition-all duration-200 touch-manipulation rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};