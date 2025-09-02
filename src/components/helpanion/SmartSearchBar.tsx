import { useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, User, Tag, GraduationCap, Briefcase, Wrench } from 'lucide-react';
import { useSmartSearch, SearchSuggestion } from '@/hooks/useSmartSearch';
import { cn } from '@/lib/utils';

interface SmartSearchBarProps {
  placeholder?: string;
  className?: string;
  isMobile?: boolean;
}

export function SmartSearchBar({ 
  placeholder = "Search for a Helpanion by field, experience, or keyword...", 
  className,
  isMobile = false 
}: SmartSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    searchTerm,
    suggestions,
    loading,
    showSuggestions,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleKeyDown,
    handleSuggestionClick
  } = useSmartSearch();

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    const iconClass = "h-3 w-3 text-muted-foreground flex-shrink-0";
    switch (type) {
      case 'person':
        return <User className={iconClass} />;
      case 'tag':
        return <Tag className={iconClass} />;
      case 'role':
        return <Briefcase className={iconClass} />;
      case 'school':
        return <GraduationCap className={iconClass} />;
      case 'service':
        return <Wrench className={iconClass} />;
      default:
        return <Search className={iconClass} />;
    }
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground",
          isMobile ? "h-4 w-4" : "h-4 w-4"
        )} />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            "pl-10 bg-muted/30 border-muted focus:bg-background transition-colors",
            isMobile ? "text-sm" : "",
            showSuggestions && suggestions.length > 0 ? "rounded-b-none" : ""
          )}
          autoComplete="off"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 bg-background border border-t-0 border-muted rounded-b-md shadow-lg max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              Searching...
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-3 text-sm text-muted-foreground text-center">
              No results found for '{searchTerm}'
            </div>
          ) : (
            <div className="py-1">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left hover:bg-muted/50 focus:bg-muted/50 focus:outline-none transition-colors flex items-center gap-3"
                >
                  {getSuggestionIcon(suggestion.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {suggestion.text}
                    </div>
                    {suggestion.subtext && (
                      <div className="text-xs text-muted-foreground truncate">
                        {suggestion.subtext}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}