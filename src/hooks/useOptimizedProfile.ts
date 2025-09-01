import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'active' | 'in_review' | null;
  email: string | null;
  phone: string | null;
  role: string | null;
  last_active_role: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  website_url: string | null;
  portfolio_url: string | null;
  school: string | null;
  use_case: string | null;
  username: string | null;
  skills: string | null;
}

let profileCache: Profile | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

export const useOptimizedProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(profileCache);
  const [loading, setLoading] = useState(!profileCache);
  const { user } = useAuth();

  const fetchProfile = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const now = Date.now();
    if (!forceRefresh && profileCache && (now - lastFetchTime) < CACHE_DURATION) {
      setProfile(profileCache);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else if (!data) {
        // Profile should be created by the database trigger, but let's wait a moment and retry
        console.log('No profile found, waiting for automatic creation...');
        
        // Wait a moment for the trigger to complete and then retry
        setTimeout(() => {
          fetchProfile(true);
        }, 1000);
        
        setProfile(null);
      } else {
        profileCache = data as Profile;
        lastFetchTime = now;
        setProfile(profileCache);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return { error };
      } else {
        const updatedProfile = data as Profile;
        profileCache = updatedProfile;
        lastFetchTime = Date.now();
        setProfile(updatedProfile);
        return { data: updatedProfile };
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  }, [user, profile]);

  const refetch = useCallback(() => fetchProfile(true), [fetchProfile]);

  // Memoize computed values
  const isComplete = useMemo(() => {
    if (!profile) return false;
    return !!(profile.display_name && profile.bio && profile.email);
  }, [profile]);

  return {
    profile,
    loading,
    updateProfile,
    refetch,
    isComplete
  };
};