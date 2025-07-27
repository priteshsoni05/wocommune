import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'walker' | 'helpanion' | 'admin';

export const useUserRoles = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserRoles();
    } else {
      setRoles([]);
      setLoading(false);
    }
  }, [user]);

  const fetchUserRoles = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
      } else {
        setRoles(data.map(item => item.role as UserRole));
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: UserRole) => roles.includes(role);

  const addRole = async (role: UserRole) => {
    if (!user || hasRole(role)) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: user.id, role });

      if (error) {
        console.error('Error adding role:', error);
        return { error };
      } else {
        setRoles(prev => [...prev, role]);
        return { success: true };
      }
    } catch (error) {
      console.error('Error adding role:', error);
      return { error };
    }
  };

  return {
    roles,
    loading,
    hasRole,
    addRole,
    refetch: fetchUserRoles
  };
};