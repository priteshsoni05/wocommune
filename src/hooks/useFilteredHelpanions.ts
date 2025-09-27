import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHelpanions } from './useHelpanions';
import { tagHelpanionProfile, TaggedHelpanionProfile } from '@/utils/profileTagger';

export interface FilterState {
  alumni: string[];
  people: string[];
  helpAreas: string[];
  search: string;
}

export interface FilterCounts {
  [category: string]: {
    [item: string]: number;
  };
}

export function useFilteredHelpanions() {
  const { helpanions: rawHelpanions, loading } = useHelpanions();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<FilterState>(() => {
    const alumniParams = searchParams.getAll('alumni');
    const peopleParams = searchParams.getAll('people'); 
    const helpAreasParams = searchParams.getAll('helpAreas');
    
    // Also check for single parameter values (from dropdown clicks)
    const singleAlumni = searchParams.get('alumni');
    const singlePeople = searchParams.get('people');
    const singleHelpAreas = searchParams.get('helpAreas');
    
    return {
      alumni: singleAlumni ? [singleAlumni] : alumniParams,
      people: singlePeople ? [singlePeople] : peopleParams,
      helpAreas: singleHelpAreas ? [singleHelpAreas] : helpAreasParams,
      search: searchParams.get('search') || ''
    };
  });

  // Update filters when URL parameters change
  useEffect(() => {
    const alumniParams = searchParams.getAll('alumni');
    const peopleParams = searchParams.getAll('people'); 
    const helpAreasParams = searchParams.getAll('helpAreas');
    
    // Also check for single parameter values (from dropdown clicks)
    const singleAlumni = searchParams.get('alumni');
    const singlePeople = searchParams.get('people');
    const singleHelpAreas = searchParams.get('helpAreas');
    
    setFilters({
      alumni: singleAlumni ? [singleAlumni] : alumniParams,
      people: singlePeople ? [singlePeople] : peopleParams,
      helpAreas: singleHelpAreas ? [singleHelpAreas] : helpAreasParams,
      search: searchParams.get('search') || ''
    });
  }, [searchParams]);

  // Tag all helpanions with auto-generated tags
  const taggedHelpanions = useMemo<TaggedHelpanionProfile[]>(() => {
    return rawHelpanions.map(tagHelpanionProfile);
  }, [rawHelpanions]);

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    
    filters.alumni.forEach(item => newParams.append('alumni', item));
    filters.people.forEach(item => newParams.append('people', item));
    filters.helpAreas.forEach(item => newParams.append('helpAreas', item));
    
    if (filters.search) {
      newParams.set('search', filters.search);
    }

    setSearchParams(newParams, { replace: true });
  }, [filters, setSearchParams]);

  // Calculate filter counts
  const filterCounts = useMemo<FilterCounts>(() => {
    const counts: FilterCounts = {
      alumni: {},
      people: {},
      helpAreas: {}
    };

    taggedHelpanions.forEach(helpanion => {
      helpanion.tags.alumni.forEach(tag => {
        counts.alumni[tag] = (counts.alumni[tag] || 0) + 1;
      });
      helpanion.tags.people.forEach(tag => {
        counts.people[tag] = (counts.people[tag] || 0) + 1;
      });
      helpanion.tags.helpAreas.forEach(tag => {
        counts.helpAreas[tag] = (counts.helpAreas[tag] || 0) + 1;
      });
    });

    return counts;
  }, [taggedHelpanions]);

  // Filter helpanions based on current filters
  const filteredHelpanions = useMemo(() => {
    return taggedHelpanions.filter(helpanion => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          helpanion.display_name?.toLowerCase().includes(searchTerm) ||
          helpanion.bio?.toLowerCase().includes(searchTerm) ||
          helpanion.skills?.some(skill => skill.toLowerCase().includes(searchTerm)) ||
          helpanion.services?.some(service => 
            service.title.toLowerCase().includes(searchTerm) ||
            service.description?.toLowerCase().includes(searchTerm)
          );
        
        if (!matchesSearch) return false;
      }

      // Category filters (AND logic within category, OR logic between categories)
      const hasAlumniMatch = filters.alumni.length === 0 || 
        filters.alumni.some(filter => helpanion.tags.alumni.includes(filter));
      
      const hasPeopleMatch = filters.people.length === 0 || 
        filters.people.some(filter => helpanion.tags.people.includes(filter));
      
      const hasHelpAreasMatch = filters.helpAreas.length === 0 || 
        filters.helpAreas.some(filter => helpanion.tags.helpAreas.includes(filter));

      return hasAlumniMatch && hasPeopleMatch && hasHelpAreasMatch;
    });
  }, [taggedHelpanions, filters]);

  // Filter management functions
  const addFilter = (category: keyof Omit<FilterState, 'search'>, item: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: [...prev[category], item]
    }));
  };

  const removeFilter = (category: keyof Omit<FilterState, 'search'>, item: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(f => f !== item)
    }));
  };

  const clearFilters = () => {
    setFilters({
      alumni: [],
      people: [],
      helpAreas: [],
      search: ''
    });
  };

  const setSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const hasActiveFilters = filters.alumni.length > 0 || 
                          filters.people.length > 0 || 
                          filters.helpAreas.length > 0 ||
                          filters.search.length > 0;

  return {
    helpanions: filteredHelpanions,
    allHelpanions: taggedHelpanions,
    loading,
    filters,
    filterCounts,
    addFilter,
    removeFilter,
    clearFilters,
    setSearch,
    hasActiveFilters,
    totalCount: filteredHelpanions.length,
    allCount: taggedHelpanions.length
  };
}