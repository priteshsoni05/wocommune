import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HelpanionProfile } from '@/hooks/useHelpanions';

interface SearchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  helpanions: HelpanionProfile[];
}

export function SearchResultsModal({ isOpen, onClose, searchTerm, helpanions }: SearchResultsModalProps) {
  const filteredHelpanions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const query = searchTerm.toLowerCase();
    return helpanions.filter(helpanion => 
      helpanion.display_name?.toLowerCase().includes(query) ||
      helpanion.bio?.toLowerCase().includes(query) ||
      helpanion.services?.some(service => 
        service.title?.toLowerCase().includes(query) && service.is_active
      )
    );
  }, [helpanions, searchTerm]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">
            Search Results for "{searchTerm}"
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {filteredHelpanions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No helpanions found matching your search.</p>
              <Button asChild className="mt-4">
                <Link to="/helpanions">Browse All Helpanions</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHelpanions.map((helpanion) => (
                <Card key={helpanion.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={helpanion.avatar_url} alt={helpanion.display_name} />
                        <AvatarFallback>
                          {helpanion.display_name?.charAt(0) || 'H'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight">
                          {helpanion.display_name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {helpanion.status === 'active' ? 'Active' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {helpanion.bio}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {helpanion.status}
                        </Badge>
                      </div>

                      {helpanion.services && helpanion.services.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Services:</p>
                          <div className="flex flex-wrap gap-1">
                            {helpanion.services.slice(0, 2).map((service) => (
                              <Badge key={service.id} variant="secondary" className="text-xs">
                                {service.title} - ${service.price_per_hour}/hr
                              </Badge>
                            ))}
                            {helpanion.services.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{helpanion.services.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <Button asChild size="sm" className="w-full">
                        <Link to={`/p/${helpanion.username || helpanion.user_id}`}>
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t pt-4">
          <Button asChild variant="outline" className="w-full">
            <Link to="/helpanions">View All Helpanions</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}