import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HelpanionProfile {
  id: string;
  user_id: string;
  username: string | null;
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
      // First, get user IDs with helpanion role
      const { data: helpanionRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'helpanion');

      if (rolesError) {
        console.error('Error fetching helpanion roles:', rolesError);
        return;
      }

      const helpanionUserIds = helpanionRoles?.map(role => role.user_id) || [];
      
      if (helpanionUserIds.length === 0) {
        setHelpanions([]);
        return;
      }

      // Then fetch profiles that have helpanion role and active services
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          services!left(
            id,
            title,
            description,
            price_per_hour,
            duration_minutes,
            category,
            is_active
          )
        `)
        .eq('status', 'active')
        .in('user_id', helpanionUserIds)
        .not('username', 'is', null);

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