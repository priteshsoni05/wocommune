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

    console.log('useBookings: Fetching bookings for user:', user.id, 'role:', userRole);

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
        console.log('useBookings: Filtering for walker - seeker_id:', user.id);
        query = query.eq('seeker_id', user.id);
      } else if (userRole === 'helpanion') {
        console.log('useBookings: Filtering for helpanion - helper_id:', user.id);
        query = query.eq('helper_id', user.id);
      } else {
        // Default behavior - show both helper and seeker bookings
        console.log('useBookings: Filtering for both roles');
        query = query.or(`helper_id.eq.${user.id},seeker_id.eq.${user.id}`);
      }

      const { data, error } = await query
        .order('booking_date', { ascending: true })
        .order('start_time', { ascending: true });

      console.log('useBookings: Query result:', { data, error, userRole });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        console.log('useBookings: Setting bookings:', data);
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

  const deleteBooking = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id)
        .eq('helper_id', user.id); // Ensure only helper can delete their bookings

      if (error) {
        console.error('Error deleting booking:', error);
        return { error };
      } else {
        setBookings(prev => prev.filter(booking => booking.id !== id));
        return { success: true };
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
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
    deleteBooking,
    getTodaysBookings,
    getUpcomingBookings,
    refetch: fetchBookings
  };
};