import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Service {
  id: string;
  helper_id: string;
  title: string;
  description: string | null;
  price_per_hour: number | null;
  category: string | null;
  duration_minutes: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchServices();
    } else {
      setServices([]);
      setLoading(false);
    }
  }, [user]);

  const fetchServices = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('helper_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data as Service[]);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: Omit<Service, 'id' | 'helper_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('services')
        .insert([{ ...serviceData, helper_id: user.id }])
        .select()
        .single();

      if (error) {
        console.error('Error creating service:', error);
        return { error };
      } else {
        setServices(prev => [data as Service, ...prev]);
        return { data: data as Service };
      }
    } catch (error) {
      console.error('Error creating service:', error);
      return { error };
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .eq('helper_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating service:', error);
        return { error };
      } else {
        setServices(prev => prev.map(service => service.id === id ? data as Service : service));
        return { data: data as Service };
      }
    } catch (error) {
      console.error('Error updating service:', error);
      return { error };
    }
  };

  const deleteService = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
        .eq('helper_id', user.id);

      if (error) {
        console.error('Error deleting service:', error);
        return { error };
      } else {
        setServices(prev => prev.filter(service => service.id !== id));
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      return { error };
    }
  };

  return {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    refetch: fetchServices
  };
};