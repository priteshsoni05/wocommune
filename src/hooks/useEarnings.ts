import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Earning {
  id: string;
  helper_id: string;
  booking_id: string;
  amount: number;
  status: 'pending' | 'paid';
  payout_date: string | null;
  created_at: string;
}

export const useEarnings = () => {
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEarnings();
    } else {
      setEarnings([]);
      setLoading(false);
    }
  }, [user]);

  const fetchEarnings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('earnings')
        .select('*')
        .eq('helper_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching earnings:', error);
      } else {
        setEarnings(data as Earning[]);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalEarnings = () => {
    return earnings.reduce((sum, earning) => sum + earning.amount, 0);
  };

  const getPendingEarnings = () => {
    return earnings
      .filter(earning => earning.status === 'pending')
      .reduce((sum, earning) => sum + earning.amount, 0);
  };

  const getPaidEarnings = () => {
    return earnings
      .filter(earning => earning.status === 'paid')
      .reduce((sum, earning) => sum + earning.amount, 0);
  };

  const getThisMonthEarnings = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return earnings
      .filter(earning => {
        const earningDate = new Date(earning.created_at);
        return earningDate.getMonth() === currentMonth && 
               earningDate.getFullYear() === currentYear;
      })
      .reduce((sum, earning) => sum + earning.amount, 0);
  };

  return {
    earnings,
    loading,
    getTotalEarnings,
    getPendingEarnings,
    getPaidEarnings,
    getThisMonthEarnings,
    refetch: fetchEarnings
  };
};