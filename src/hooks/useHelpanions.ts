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
      console.log('useHelpanions: Starting to fetch helpanions...');
      
      // Directly fetch profiles that have helpanion role and active services
      // Using a public query that doesn't require authentication
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
        .not('username', 'is', null)
        .not('username', 'eq', '');

      console.log('useHelpanions: Profile query result:', { profiles, profilesError });

      if (profilesError) {
        console.error('Error fetching helpanion profiles:', profilesError);
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('useHelpanions: No profiles found');
        setHelpanions([]);
        return;
      }

      // Check which profiles have the helpanion role
      const profileUserIds = profiles.map(p => p.user_id);
      const { data: helpanionRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'helpanion')
        .in('user_id', profileUserIds);

      console.log('useHelpanions: Roles query result:', { helpanionRoles, rolesError });

      const helpanionUserIds = helpanionRoles?.map(role => role.user_id) || [];
      
      if (helpanionUserIds.length === 0) {
        console.log('useHelpanions: No helpanion roles found');
        setHelpanions([]);
        return;
      }

      // Filter profiles to only include those with helpanion role
      const helpanionProfiles = profiles.filter(profile => 
        helpanionUserIds.includes(profile.user_id)
      );

      // Transform the data to match our interface
      const transformedHelpanions: HelpanionProfile[] = helpanionProfiles.map(profile => ({
        ...profile,
        status: profile.status as 'pending' | 'active' | 'in_review',
        services: Array.isArray(profile.services) ? profile.services.filter(s => s.is_active) : []
      }));

      // Filter out profiles without active services
      const helpanionsWithServices = transformedHelpanions.filter(h => h.services.length > 0);

      console.log('useHelpanions: Final helpanions with services:', helpanionsWithServices);
      setHelpanions(helpanionsWithServices);
    } catch (error) {
      console.error('useHelpanions: Error fetching helpanions:', error);
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