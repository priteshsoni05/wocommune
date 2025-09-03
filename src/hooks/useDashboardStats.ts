import { useState, useEffect } from 'react';
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

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
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
  });
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { services } = useServices();
  const { bookings } = useBookings();
  const { getTotalEarnings, getThisMonthEarnings, getPendingEarnings } = useEarnings();
  const { profile } = useProfile();

  useEffect(() => {
    if (user && services && bookings && profile) {
      calculateStats();
    }
  }, [user, services, bookings, profile]);

  const calculateStats = () => {
    setLoading(true);

    try {
      // Calculate profile completion
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
      const completedFields = profileFields.filter(field => {
        if (Array.isArray(field)) return field.length > 0;
        return field && field.trim();
      }).length;
      const profileCompletion = Math.round((completedFields / profileFields.length) * 100);

      // Calculate service stats
      const activeServices = services.filter(service => service.is_active).length;

      // Calculate booking stats
      const totalBookings = bookings.length;
      const completedSessions = bookings.filter(booking => booking.status === 'completed').length;
      
      // Calculate this week's bookings
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const thisWeekBookings = bookings.filter(booking => 
        new Date(booking.booking_date) >= oneWeekAgo
      ).length;

      // Calculate earnings
      const totalEarnings = getTotalEarnings();
      const thisMonthEarnings = getThisMonthEarnings();
      const pendingEarnings = getPendingEarnings();

      // TODO: Implement reviews system - for now set to 0
      const averageRating = 0;
      const totalReviews = 0;

      setStats({
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
      });
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = () => {
    calculateStats();
  };

  return {
    stats,
    loading,
    refreshStats
  };
};