import { useState, useEffect, useMemo, useCallback } from 'react';
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

  // Tag all helpanions with auto-generated tags
  const taggedHelpanions = useMemo<TaggedHelpanionProfile[]>(() => {
    return rawHelpanions.map(tagHelpanionProfile);
  }, [rawHelpanions]);

  // Update URL when filters change (only when manually changed, not from URL)
  const updateURL = useCallback((newFilters: FilterState) => {
    const newParams = new URLSearchParams();
    
    newFilters.alumni.forEach(item => newParams.append('alumni', item));
    newFilters.people.forEach(item => newParams.append('people', item));
    newFilters.helpAreas.forEach(item => newParams.append('helpAreas', item));
    
    if (newFilters.search) {
      newParams.set('search', newFilters.search);
    }

    setSearchParams(newParams, { replace: true });
  }, [setSearchParams]);

  // Sync filters from URL when query params change (avoids loops by comparing state)
  useEffect(() => {
    const alumni = searchParams.getAll('alumni');
    const people = searchParams.getAll('people');
    const helpAreas = searchParams.getAll('helpAreas');
    const search = searchParams.get('search') || '';

    const incoming: FilterState = { alumni, people, helpAreas, search };

    const eq = (a: string[], b: string[]) =>
      a.length === b.length && a.every((v) => b.includes(v));

    const isSame =
      eq(incoming.alumni, filters.alumni) &&
      eq(incoming.people, filters.people) &&
      eq(incoming.helpAreas, filters.helpAreas) &&
      incoming.search === filters.search;

    if (!isSame) {
      setFilters(incoming);
    }
  }, [searchParams, filters]);

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
    const newFilters = {
      ...filters,
      [category]: [...filters[category], item]
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const removeFilter = (category: keyof Omit<FilterState, 'search'>, item: string) => {
    const newFilters = {
      ...filters,
      [category]: filters[category].filter(f => f !== item)
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      alumni: [],
      people: [],
      helpAreas: [],
      search: ''
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const setSearch = (search: string) => {
    const newFilters = { ...filters, search };
    setFilters(newFilters);
    updateURL(newFilters);
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