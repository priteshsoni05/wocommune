import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Trash2 } from 'lucide-react';
import { FilterState } from '@/hooks/useFilteredHelpanions';

interface FilterChipsProps {
  filters: FilterState;
  onRemoveFilter: (category: keyof Omit<FilterState, 'search'>, item: string) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

const CATEGORY_LABELS = {
  alumni: 'Alumni',
  people: 'People', 
  helpAreas: 'Help Areas'
};

export function FilterChips({ filters, onRemoveFilter, onClearAll, hasActiveFilters }: FilterChipsProps) {
  if (!hasActiveFilters) return null;

  const allFilters = [
    ...filters.alumni.map(item => ({ category: 'alumni' as const, item })),
    ...filters.people.map(item => ({ category: 'people' as const, item })),
    ...filters.helpAreas.map(item => ({ category: 'helpAreas' as const, item }))
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 rounded-lg border">
      <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
      
      {allFilters.map(({ category, item }) => (
        <Badge
          key={`${category}-${item}`}
          variant="secondary"
          className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
        >
          <span className="text-xs font-medium text-muted-foreground">
            {CATEGORY_LABELS[category]}:
          </span>
          <span>{item}</span>
          <button
            onClick={() => onRemoveFilter(category, item)}
            className="ml-1 hover:bg-primary/30 rounded-full p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {filters.search && (
        <Badge
          variant="secondary"
          className="flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent border-accent/20"
        >
          <span className="text-xs font-medium text-muted-foreground">Search:</span>
          <span>"{filters.search}"</span>
        </Badge>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="ml-2 h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <Trash2 className="h-3 w-3 mr-1" />
        Clear all
      </Button>
    </div>
  );
}