import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { useBookings } from '@/hooks/useBookings';
import { useEarnings } from '@/hooks/useEarnings';
import { useProfile } from '@/hooks/useProfile';

export interface DashboardStats {
  activeServices: number;
  totalBookings: number;
  thisWeekBookings: number;
  completedSessions: number;
  totalEarnings: number;
  thisMonthEarnings: number;
  pendingEarnings: number;
  profileCompletion: number;
  averageRating: number;
  totalReviews: number;
}

export const useOptimizedDashboardStats = () => {
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { services } = useServices();
  const { bookings } = useBookings();
  const { getTotalEarnings, getThisMonthEarnings, getPendingEarnings } = useEarnings();
  const { profile } = useProfile();

  // Memoize expensive calculations
  const stats = useMemo<DashboardStats>(() => {
    if (!user || !services || !bookings || !profile) {
      return {
        activeServices: 0,
        totalBookings: 0,
        thisWeekBookings: 0,
        completedSessions: 0,
        totalEarnings: 0,
        thisMonthEarnings: 0,
        pendingEarnings: 0,
        profileCompletion: 0,
        averageRating: 0,
        totalReviews: 0,
      };
    }

    // Profile completion calculation (optimized)
    const profileFields = [
      profile.display_name,
      profile.username,
      profile.bio,
      profile.email,
      profile.school,
      profile.role,
      profile.use_case,
      profile.skills,
      profile.avatar_url
    ];
    const completedFields = profileFields.filter(field => field && field.toString().trim()).length;
    const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

    // Service stats
    const activeServices = services.filter(service => service.is_active).length;

    // Booking stats (optimized with single iteration)
    let totalBookings = 0;
    let completedSessions = 0;
    let thisWeekBookings = 0;
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    for (const booking of bookings) {
      totalBookings++;
      if (booking.status === 'completed') {
        completedSessions++;
      }
      if (new Date(booking.booking_date) >= oneWeekAgo) {
        thisWeekBookings++;
      }
    }

    // Earnings (cached from hook)
    const totalEarnings = getTotalEarnings();
    const thisMonthEarnings = getThisMonthEarnings();
    const pendingEarnings = getPendingEarnings();

    // TODO: Implement reviews system
    const averageRating = 0;
    const totalReviews = 0;

    return {
      activeServices,
      totalBookings,
      thisWeekBookings,
      completedSessions,
      totalEarnings,
      thisMonthEarnings,
      pendingEarnings,
      profileCompletion,
      averageRating,
      totalReviews,
    };
  }, [user, services, bookings, profile, getTotalEarnings, getThisMonthEarnings, getPendingEarnings]);

  useEffect(() => {
    if (user && services && bookings && profile) {
      setLoading(false);
    }
  }, [user, services, bookings, profile]);

  const refreshStats = useCallback(() => {
    // Force recalculation by triggering dependencies
    setLoading(true);
    setTimeout(() => setLoading(false), 100);
  }, []);

  return {
    stats,
    loading,
    refreshStats
  };
};