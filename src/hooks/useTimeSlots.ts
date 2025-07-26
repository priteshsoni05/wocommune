import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AvailabilitySlot } from './useAvailabilitySlots';
import { Booking } from './useBookings';

interface TimeSlot {
  time: string;
  available: boolean;
  booking?: Pick<Booking, 'start_time' | 'end_time' | 'status'>;
}

export const useTimeSlots = (
  availability: AvailabilitySlot[], 
  selectedDate: Date | undefined,
  helperId: string
) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const generateTimeSlots = (startTime: string, endTime: string) => {
    const slots: string[] = [];
    const start = new Date(`2024-01-01 ${startTime}`);
    const end = new Date(`2024-01-01 ${endTime}`);
    
    let current = new Date(start);
    
    while (current < end) {
      const timeString = current.toTimeString().slice(0, 5);
      slots.push(timeString);
      current.setMinutes(current.getMinutes() + 15); // 15-minute intervals
    }
    
    return slots;
  };

  const fetchBookingsForDate = async (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    console.log('=== Fetching bookings ===');
    console.log('Helper ID:', helperId);
    console.log('Date:', dateString);
    
    // Query for booking availability - now accessible to public users
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('start_time, end_time, status')
      .eq('helper_id', helperId)
      .eq('booking_date', dateString)
      .in('status', ['pending', 'confirmed']);

    console.log('Query result:', { bookings, error });
    
    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return bookings as Pick<Booking, 'start_time' | 'end_time' | 'status'>[];
  };

  const isSlotBlocked = (timeString: string, bookings: Pick<Booking, 'start_time' | 'end_time' | 'status'>[]) => {
    console.log(`=== Checking slot ${timeString} ===`);
    console.log('Available bookings:', bookings);
    
    for (const booking of bookings) {
      console.log(`Checking against booking: ${booking.start_time} - ${booking.end_time}`);
      
      const bookingStart = new Date(`2024-01-01 ${booking.start_time}`);
      const bookingEnd = new Date(`2024-01-01 ${booking.end_time}`);
      
      // Add 15-minute break after each booking
      const breakEnd = new Date(bookingEnd.getTime() + 15 * 60000);
      
      const slotTime = new Date(`2024-01-01 ${timeString}`);
      
      console.log(`Booking start: ${bookingStart}, Booking end: ${bookingEnd}, Break end: ${breakEnd}, Slot time: ${slotTime}`);
      
      // Check if slot conflicts with booking or break time
      if (slotTime >= bookingStart && slotTime < breakEnd) {
        console.log(`✗ Slot ${timeString} is BLOCKED`);
        return true;
      }
    }
    console.log(`✓ Slot ${timeString} is AVAILABLE`);
    return false;
  };

  useEffect(() => {
    const loadTimeSlots = async () => {
      if (!selectedDate || availability.length === 0) {
        setTimeSlots([]);
        return;
      }

      setLoading(true);
      
      try {
        const dayOfWeek = selectedDate.getDay();
        const daySlots = availability.filter(slot => 
          slot.day_of_week === dayOfWeek && slot.is_available
        );

        if (daySlots.length === 0) {
          setTimeSlots([]);
          setLoading(false);
          return;
        }

        // Get all bookings for the selected date
        const bookings = await fetchBookingsForDate(selectedDate);
        
        // Generate time slots for all available periods
        const allSlots: TimeSlot[] = [];
        
        for (const slot of daySlots) {
          const generatedSlots = generateTimeSlots(slot.start_time, slot.end_time);
          
          for (const timeString of generatedSlots) {
            const isBlocked = isSlotBlocked(timeString, bookings);
            const existingBooking = bookings.find(booking => 
              booking.start_time <= timeString && booking.end_time > timeString
            );
            
            allSlots.push({
              time: timeString,
              available: !isBlocked,
              booking: existingBooking
            });
          }
        }

        // Sort slots by time
        allSlots.sort((a, b) => a.time.localeCompare(b.time));
        
        setTimeSlots(allSlots);
      } catch (error) {
        console.error('Error loading time slots:', error);
        setTimeSlots([]);
      } finally {
        setLoading(false);
      }
    };

    loadTimeSlots();
    
    // Set up an interval to refresh slots every 30 seconds to catch new bookings
    const interval = setInterval(loadTimeSlots, 30000);
    
    return () => clearInterval(interval);
  }, [selectedDate, availability, helperId, refreshKey]);

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const refreshSlots = () => {
    setRefreshKey(prev => prev + 1);
  };

  return {
    timeSlots,
    loading,
    formatTime,
    refreshSlots
  };
};