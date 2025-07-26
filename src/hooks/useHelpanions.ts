import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HelpanionProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  avatar_url: string | null;
  status: 'pending' | 'active' | 'in_review';
  created_at: string;
  updated_at: string;
  services: Array<{
    id: string;
    title: string;
    description: string | null;
    price_per_hour: number | null;
    duration_minutes: number | null;
    category: string | null;
    is_active: boolean;
  }>;
}

export const useHelpanions = () => {
  const [helpanions, setHelpanions] = useState<HelpanionProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHelpanions();
  }, []);

  const fetchHelpanions = async () => {
    try {
      // Fetch active profiles with their services
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          services!inner(
            id,
            title,
            description,
            price_per_hour,
            duration_minutes,
            category,
            is_active
          )
        `)
        .eq('status', 'active');

      if (profilesError) {
        console.error('Error fetching helpanions:', profilesError);
        return;
      }

      // Transform the data to match our interface
      const transformedHelpanions: HelpanionProfile[] = profiles?.map(profile => ({
        ...profile,
        status: profile.status as 'pending' | 'active' | 'in_review',
        services: Array.isArray(profile.services) ? profile.services.filter(s => s.is_active) : []
      })) || [];

      // Filter out profiles without active services
      const helpanionsWithServices = transformedHelpanions.filter(h => h.services.length > 0);

      setHelpanions(helpanionsWithServices);
    } catch (error) {
      console.error('Error fetching helpanions:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    helpanions,
    loading,
    refetch: fetchHelpanions
  };
};