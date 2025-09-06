import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Booking {
  id: string;
  service_id: string;
  helper_id: string;
  seeker_id: string;
  seeker_name: string;
  seeker_email: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_amount: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  services?: {
    title: string;
    description: string;
  };
}

export const useBookings = (userRole?: 'walker' | 'helpanion') => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setBookings([]);
      setLoading(false);
    }
  }, [user, userRole]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          services (
            title,
            description
          )
        `);

      // Filter based on user role
      if (userRole === 'walker') {
        query = query.eq('seeker_id', user.id);
      } else if (userRole === 'helpanion') {
        query = query.eq('helper_id', user.id);
      } else {
        // Default behavior - show both helper and seeker bookings
        query = query.or(`helper_id.eq.${user.id},seeker_id.eq.${user.id}`);
      }

      const { data, error } = await query
        .order('booking_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data as Booking[]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    if (!user) return;

    try {
      // Allow updates for either helper or seeker
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .or(`helper_id.eq.${user.id},seeker_id.eq.${user.id}`)
        .select()
        .single();

      if (error) {
        console.error('Error updating booking status:', error);
        return { error };
      } else {
        setBookings(prev => prev.map(booking => 
          booking.id === id ? { ...booking, status } : booking
        ));
        return { data: data as Booking };
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      return { error };
    }
  };

  const getTodaysBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(booking => booking.booking_date === today);
  };

  const getUpcomingBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(booking => booking.booking_date > today);
  };

  return {
    bookings,
    loading,
    updateBookingStatus,
    getTodaysBookings,
    getUpcomingBookings,
    refetch: fetchBookings
  };
};