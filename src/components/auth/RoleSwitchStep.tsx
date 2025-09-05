import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export type UserRole = 'walker' | 'helpanion';

interface RoleSwitchStepProps {
  availableRoles: UserRole[];
  onSelectRole: (role: UserRole, rememberChoice: boolean) => void;
  onCancel: () => void;
}

export const RoleSwitchStep: React.FC<RoleSwitchStepProps> = ({
  availableRoles,
  onSelectRole,
  onCancel
}) => {
  const [rememberChoice, setRememberChoice] = useState(false);

  const roleConfig = {
    walker: {
      name: 'Walker',
      description: 'Continue as a seeker of guidance'
    },
    helpanion: {
      name: 'Helpanion',
      description: 'Continue as a guide and mentor'
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    onSelectRole(role, rememberChoice);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="font-sans text-lg text-foreground">
          CHOOSE YOUR PROFILE
        </h1>
        <p className="text-muted-foreground font-sans">
          You have profiles as both Walker and Helpanion. Choose which one to continue with.
        </p>
      </div>

      {/* Role Selection */}
      <div className="space-y-4">
        {availableRoles.map((roleId) => {
          const role = roleConfig[roleId];
          return (
            <div
              key={roleId}
              className="border border-input rounded-lg p-6 cursor-pointer transition-all duration-200 hover:bg-muted/50 hover:border-primary/30 bg-background"
              onClick={() => handleRoleSelect(roleId)}
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center" 
                  style={{ backgroundColor: roleId === 'helpanion' ? '#193232' : '#f3f4f6' }}
                >
                  <span 
                    className="text-lg font-sans font-bold" 
                    style={{ color: roleId === 'helpanion' ? 'white' : '#193232' }}
                  >
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

      {/* Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Checkbox
            id="remember-choice"
            checked={rememberChoice}
            onCheckedChange={(checked) => setRememberChoice(checked as boolean)}
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
          onClick={onCancel} 
          className="w-full h-12 font-sans font-semibold bg-background border-input hover:bg-muted/50 transition-all duration-200 rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};