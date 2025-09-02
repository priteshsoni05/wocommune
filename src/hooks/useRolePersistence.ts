import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'helpanion' | 'walker';

const ROLE_STORAGE_KEY = 'wo_commune_user_role';
const ROLE_TIMESTAMP_KEY = 'wo_commune_role_timestamp';
const ROLE_EXPIRY_TIME = 30 * 24 * 60 * 60 * 1000; // 30 days

interface RolePersistenceState {
  role: UserRole | null;
  isLoading: boolean;
}

export const useRolePersistence = () => {
  const { user } = useAuth();
  const [state, setState] = useState<RolePersistenceState>({
    role: null,
    isLoading: true
  });

  // Get stored role from localStorage
  const getStoredRole = useCallback((): UserRole | null => {
    try {
      if (!user) return null;
      
      const storedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      const timestamp = localStorage.getItem(ROLE_TIMESTAMP_KEY);
      
      // Check if data exists and is not expired
      if (storedRole && timestamp) {
        const now = Date.now();
        const storedTime = parseInt(timestamp, 10);
        
        if (now - storedTime < ROLE_EXPIRY_TIME) {
          const role = storedRole as UserRole;
          if (role === 'helpanion' || role === 'walker') {
            return role;
          }
        }
      }
      
      // Clear corrupted or expired data
      localStorage.removeItem(ROLE_STORAGE_KEY);
      localStorage.removeItem(ROLE_TIMESTAMP_KEY);
      return null;
    } catch (error) {
      console.error('Error reading role from storage:', error);
      // Clear corrupted data
      localStorage.removeItem(ROLE_STORAGE_KEY);
      localStorage.removeItem(ROLE_TIMESTAMP_KEY);
      return null;
    }
  }, [user]);

  // Set role in localStorage
  const setStoredRole = useCallback((role: UserRole | null) => {
    try {
      if (!user) return false;
      
      if (role) {
        localStorage.setItem(ROLE_STORAGE_KEY, role);
        localStorage.setItem(ROLE_TIMESTAMP_KEY, Date.now().toString());
      } else {
        localStorage.removeItem(ROLE_STORAGE_KEY);
        localStorage.removeItem(ROLE_TIMESTAMP_KEY);
      }
      return true;
    } catch (error) {
      console.error('Error storing role:', error);
      return false;
    }
  }, [user]);

  // Clear all role data (for logout)
  const clearRoleData = useCallback(() => {
    try {
      localStorage.removeItem(ROLE_STORAGE_KEY);
      localStorage.removeItem(ROLE_TIMESTAMP_KEY);
      localStorage.removeItem('wo_commune_preferred_role');
      setState({ role: null, isLoading: false });
      return true;
    } catch (error) {
      console.error('Error clearing role data:', error);
      return false;
    }
  }, []);

  // Set active role
  const setActiveRole = useCallback((role: UserRole) => {
    if (!user) return false;
    
    const success = setStoredRole(role);
    if (success) {
      setState({ role, isLoading: false });
      return true;
    }
    return false;
  }, [user, setStoredRole]);

  // Get current role
  const getCurrentRole = useCallback((): UserRole | null => {
    return state.role;
  }, [state.role]);

  // Get dashboard path for current role and user
  const getDashboardPath = useCallback((): string => {
    if (!user) return '/auth';
    
    const role = getCurrentRole();
    if (!role) return '/auth';
    
    return role === 'helpanion' ? `/helpanion/${user.id}` : `/walker/${user.id}`;
  }, [getCurrentRole, user]);

  // Initialize role from storage
  useEffect(() => {
    if (!user) {
      setState({ role: null, isLoading: false });
      return;
    }

    const storedRole = getStoredRole();
    setState({ role: storedRole, isLoading: false });
  }, [user, getStoredRole]);

  // Handle corrupted data fallback
  const handleCorruptedData = useCallback(() => {
    console.warn('Role data corrupted or missing, clearing role data');
    clearRoleData();
    return null;
  }, [clearRoleData]);

  return {
    role: state.role,
    isLoading: state.isLoading,
    setActiveRole,
    getCurrentRole,
    getDashboardPath,
    clearRoleData,
    handleCorruptedData,
    hasValidRole: !!state.role
  };
};