import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeekHelpModal } from './SeekHelpModal';

interface HelpanionHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilteredSearch: (filters: string[]) => void;
}

export function HelpanionHeader({ searchTerm, onSearchChange, onFilteredSearch }: HelpanionHeaderProps) {
  const [isSeekHelpModalOpen, setIsSeekHelpModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-serif font-bold text-foreground hover:text-primary transition-colors">
                WO Commune
              </Link>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for a Helpanion by field, experience, or keyword..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-muted/30 border-muted focus:bg-background"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="default" 
                onClick={() => setIsSeekHelpModalOpen(true)}
                className="bg-primary hover:bg-primary/90"
              >
                Seek Help
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Join the Commune
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border-border">
                  <DropdownMenuItem asChild>
                    <Link to="/auth" className="cursor-pointer">Join as a Walker</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/auth" className="cursor-pointer">Join as a Helpanion</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" asChild>
                <Link to="/auth">Login/Signup</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <SeekHelpModal 
        isOpen={isSeekHelpModalOpen}
        onClose={() => setIsSeekHelpModalOpen(false)}
        onFindHelpanions={onFilteredSearch}
      />
    </>
  );
}