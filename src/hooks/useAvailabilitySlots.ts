import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface AvailabilitySlot {
  id: string;
  helper_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export const useAvailabilitySlots = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSlots = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('helper_id', user.id)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error('Error fetching availability slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSlot = async (slot: Omit<AvailabilitySlot, 'id' | 'helper_id' | 'created_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('availability_slots')
        .insert([
          {
            helper_id: user.id,
            day_of_week: slot.day_of_week,
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_available: slot.is_available,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      await fetchSlots(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error creating availability slot:', error);
      return null;
    }
  };

  const updateSlot = async (id: string, updates: Partial<AvailabilitySlot>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('availability_slots')
        .update(updates)
        .eq('id', id)
        .eq('helper_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchSlots(); // Refresh the list
      return data;
    } catch (error) {
      console.error('Error updating availability slot:', error);
      return null;
    }
  };

  const deleteSlot = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('availability_slots')
        .delete()
        .eq('id', id)
        .eq('helper_id', user.id);

      if (error) throw error;
      
      await fetchSlots(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error deleting availability slot:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [user]);

  return {
    slots,
    loading,
    createSlot,
    updateSlot,
    deleteSlot,
    refreshSlots: fetchSlots,
  };
};