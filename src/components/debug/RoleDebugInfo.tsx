import React from 'react';
import { useRolePersistence } from '@/hooks/useRolePersistence';
import { useAuth } from '@/contexts/AuthContext';

export const RoleDebugInfo: React.FC = () => {
  const { user } = useAuth();
  const { role, hasValidRole, getDashboardPath } = useRolePersistence();

  if (!user) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-md text-xs max-w-xs z-50"
      style={{ fontSize: '11px' }}
    >
      <div className="font-mono">
        <div>User: {user.email}</div>
        <div>Stored Role: {role || 'None'}</div>
        <div>Valid Role: {hasValidRole ? 'Yes' : 'No'}</div>
        <div>Dashboard: {getDashboardPath()}</div>
        <div>Storage: {localStorage.getItem('wo_commune_user_role') || 'Empty'}</div>
      </div>
    </div>
  );
};