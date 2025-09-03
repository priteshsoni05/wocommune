import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export interface SearchSuggestion {
  id: string;
  type: 'person' | 'tag' | 'role' | 'school' | 'service';
  text: string;
  subtext?: string;
  userId?: string;
  category?: string;
}

export const useSmartSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const debouncedSearchTerm = useMemo(() => {
    const timer = setTimeout(() => searchTerm, 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const performSearch = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setLoading(true);
      setShowSuggestions(true);

      try {
        const query = searchTerm.toLowerCase().trim();
        
        // Search profiles and their services
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            id,
            user_id,
            display_name,
            role,
            school,
            skills,
            bio,
            status,
            services!inner(
              id,
              title,
              category,
              description,
              is_active
            )
          `)
          .eq('status', 'active')
          .or(`display_name.ilike.%${query}%,role.ilike.%${query}%,school.ilike.%${query}%,skills.ilike.%${query}%,bio.ilike.%${query}%`)
          .limit(10);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Search services directly
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select(`
            id,
            title,
            category,
            description,
            helper_id,
            profiles!inner(
              display_name,
              user_id,
              status
            )
          `)
          .eq('is_active', true)
          .eq('profiles.status', 'active')
          .or(`title.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(5);

        if (servicesError) {
          console.error('Error fetching services:', servicesError);
        }

        const suggestionsList: SearchSuggestion[] = [];
        const seen = new Set<string>();

        // Add person suggestions
        profiles?.forEach(profile => {
          const key = `person-${profile.user_id}`;
          if (!seen.has(key) && profile.display_name) {
            seen.add(key);
            suggestionsList.push({
              id: key,
              type: 'person',
              text: profile.display_name,
              subtext: profile.role || undefined,
              userId: profile.user_id
            });
          }

          // Add role suggestions
          if (profile.role) {
            const roleKey = `role-${profile.role.toLowerCase()}`;
            if (!seen.has(roleKey)) {
              seen.add(roleKey);
              suggestionsList.push({
                id: roleKey,
                type: 'role',
                text: profile.role,
                subtext: 'Professional Role'
              });
            }
          }

          // Add school suggestions
          if (profile.school) {
            const schoolKey = `school-${profile.school.toLowerCase()}`;
            if (!seen.has(schoolKey)) {
              seen.add(schoolKey);
              suggestionsList.push({
                id: schoolKey,
                type: 'school',
                text: profile.school,
                subtext: 'Educational Background'
              });
            }
          }

          // Add skill tags
          if (profile.skills) {
            const skills = Array.isArray(profile.skills) ? profile.skills : (profile.skills ? String(profile.skills).split(',') : []);
            skills.forEach(skill => {
              const skillTrimmed = typeof skill === 'string' ? skill.trim() : skill;
              if (skillTrimmed.toLowerCase().includes(query)) {
                const skillKey = `tag-${skillTrimmed.toLowerCase()}`;
                if (!seen.has(skillKey)) {
                  seen.add(skillKey);
                  suggestionsList.push({
                    id: skillKey,
                    type: 'tag',
                    text: skillTrimmed,
                    subtext: 'Skill Tag'
                  });
                }
              }
            });
          }
        });

        // Add service suggestions
        services?.forEach(service => {
          const serviceKey = `service-${service.id}`;
          if (!seen.has(serviceKey)) {
            seen.add(serviceKey);
            suggestionsList.push({
              id: serviceKey,
              type: 'service',
              text: service.title,
              subtext: `by ${service.profiles ? (service.profiles as any).display_name || 'Helpanion' : 'Helpanion'}`,
              userId: service.profiles ? (service.profiles as any).user_id : undefined,
              category: service.category || undefined
            });
          }

          // Add category suggestions
          if (service.category) {
            const categoryKey = `tag-${service.category.toLowerCase()}`;
            if (!seen.has(categoryKey)) {
              seen.add(categoryKey);
              suggestionsList.push({
                id: categoryKey,
                type: 'tag',
                text: service.category,
                subtext: 'Service Category'
              });
            }
          }
        });

        // Sort by relevance (exact matches first, then partial matches)
        suggestionsList.sort((a, b) => {
          const aExact = a.text.toLowerCase() === query;
          const bExact = b.text.toLowerCase() === query;
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          
          const aStarts = a.text.toLowerCase().startsWith(query);
          const bStarts = b.text.toLowerCase().startsWith(query);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          
          // Prioritize people over other types
          if (a.type === 'person' && b.type !== 'person') return -1;
          if (a.type !== 'person' && b.type === 'person') return 1;
          
          return a.text.localeCompare(b.text);
        });

        setSuggestions(suggestionsList.slice(0, 7));
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(performSearch, 200);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'person' && suggestion.userId) {
      // First get the username from the profile
      supabase
        .from('profiles')
        .select('username')
        .eq('user_id', suggestion.userId)
        .single()
        .then(({ data }) => {
          if (data?.username) {
            navigate(`/${data.username}`);
          }
        });
    } else {
      // For tags, roles, schools, redirect to filtered search
      const filterParam = encodeURIComponent(suggestion.text);
      navigate(`/helpanions?filter=${filterParam}&type=${suggestion.type}`);
    }
    setShowSuggestions(false);
    setSearchTerm('');
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    if (value.length === 0) {
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding to allow for suggestion clicks
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSearchTerm('');
    }
  };

  return {
    searchTerm,
    suggestions,
    loading,
    showSuggestions,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleKeyDown,
    handleSuggestionClick
  };
};