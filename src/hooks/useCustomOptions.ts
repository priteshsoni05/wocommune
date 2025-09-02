import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CustomOption {
  id: string;
  user_id: string;
  option_type: 'school' | 'role';
  option_value: string;
  created_at: string;
}

export const useCustomOptions = (optionType: 'school' | 'role') => {
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCustomOptions();
    } else {
      setCustomOptions([]);
      setLoading(false);
    }
  }, [user, optionType]);

  const fetchCustomOptions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('custom_options')
        .select('option_value')
        .eq('user_id', user.id)
        .eq('option_type', optionType)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching custom options:', error);
      } else {
        setCustomOptions(data?.map(item => item.option_value) || []);
      }
    } catch (error) {
      console.error('Error fetching custom options:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomOption = async (optionValue: string) => {
    if (!user || !optionValue.trim()) return { error: 'Invalid option value' };

    try {
      const { error } = await supabase
        .from('custom_options')
        .insert({
          user_id: user.id,
          option_type: optionType,
          option_value: optionValue.trim()
        });

      if (error) {
        // If it's a duplicate, it's not really an error for the user
        if (error.code === '23505') {
          return { data: optionValue };
        }
        console.error('Error adding custom option:', error);
        return { error };
      } else {
        // Add to local state immediately
        setCustomOptions(prev => [optionValue.trim(), ...prev]);
        return { data: optionValue };
      }
    } catch (error) {
      console.error('Error adding custom option:', error);
      return { error };
    }
  };

  return {
    customOptions,
    loading,
    addCustomOption,
    refetch: fetchCustomOptions
  };
};