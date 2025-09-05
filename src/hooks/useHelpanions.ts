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
  skills: string[] | null;
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
      
      // First check if we can access profiles table at all
      const { data: testProfiles, error: testError } = await supabase
        .from("profiles")
        .select("id, display_name")
        .limit(1);
      
      console.log('useHelpanions: Test query result:', { testProfiles, testError });
      
      // First get active profiles with helpanion role
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id, 
          user_id,
          display_name, 
          bio, 
          avatar_url, 
          created_at, 
          username,
          skills
        `)
        .eq("status", "active")
        .not("username", "is", null)
        .not("username", "eq", "");

      console.log('useHelpanions: Profile query result:', { profiles, profilesError });

      if (profilesError) {
        console.error('Error fetching helpanion profiles:', profilesError);
        setHelpanions([]);
        return;
      }

      if (!profiles || profiles.length === 0) {
        console.log('useHelpanions: No profiles found');
        setHelpanions([]);
        return;
      }

      // Check which profiles have the helpanion role
      const profileUserIds = profiles.map(p => p.user_id);
      console.log('useHelpanions: Profile user IDs:', profileUserIds);
      
      const { data: helpanionRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'helpanion')
        .in('user_id', profileUserIds);

      console.log('useHelpanions: Roles query result:', { helpanionRoles, rolesError });

      if (rolesError) {
        console.error('Error fetching helpanion roles:', rolesError);
        // Continue anyway and return empty array
      }

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

      if (helpanionProfiles.length === 0) {
        console.log('useHelpanions: No helpanion profiles found');
        setHelpanions([]);
        return;
      }

      // Now get services for these helpanion profiles
      const helpanionProfileUserIds = helpanionProfiles.map(p => p.user_id);
      console.log('useHelpanions: Fetching services for user IDs:', helpanionProfileUserIds);
      
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .in('helper_id', helpanionProfileUserIds)
        .eq('is_active', true);

      console.log('useHelpanions: Services query result:', { services, servicesError });

      if (servicesError) {
        console.error('Error fetching services:', servicesError);
        // Continue anyway but log the error
      }

      // Filter profiles to only include those with active services
      const profilesWithServices = helpanionProfiles.filter(profile => {
        const hasActiveServices = services?.some(s => s.helper_id === profile.user_id);
        return hasActiveServices;
      });

      // Transform the data to match our interface
      const transformedHelpanions: HelpanionProfile[] = profilesWithServices.map(profile => {
        const profileServices = services?.filter(s => s.helper_id === profile.user_id) || [];
        
        return {
          ...profile,
          status: 'active' as const,
          updated_at: profile.created_at,
          email: null,
          phone: null,
          services: profileServices
        };
      });

      console.log('useHelpanions: Final helpanions with services:', transformedHelpanions);
      setHelpanions(transformedHelpanions);
    } catch (error) {
      console.error('useHelpanions: Error fetching helpanions:', error);
      setHelpanions([]);
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