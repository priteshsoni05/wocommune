import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

type Service = {
  id: string;
  title: string;
  price_per_hour: number | null;
};

type Helpanion = {
  id: string;
  user_id: string;
  username?: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  status: string | null;
  services?: Service[];
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  helpanions: Helpanion[];
  query: string;
}

export function SearchResultsModal({ isOpen, onClose, helpanions, query }: Props) {
  const filteredHelpanions = useMemo(() => {
    if (!query.trim()) return helpanions;
    const q = query.toLowerCase();
    return helpanions.filter(
      (h) =>
        (h.display_name || "").toLowerCase().includes(q) ||
        (h.bio || "").toLowerCase().includes(q) ||
        (h.username || "").toLowerCase().includes(q)
    );
  }, [helpanions, query]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>Results</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
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
              {filteredHelpanions.map((helpanion) => {
                const profileHref = helpanion.username?.trim()
                  ? `/${encodeURIComponent(helpanion.username.trim())}`
                  : `/profile/${helpanion.user_id}`;
                return (
                  <Card key={helpanion.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={helpanion.avatar_url || undefined} alt={helpanion.display_name || "Helpanion"} />
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
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {helpanion.bio}
                        </p>

                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs">
                            {helpanion.status || 'pending'}
                          </Badge>
                        </div>

                        {helpanion.services && helpanion.services.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Services:</p>
                            <div className="flex flex-wrap gap-1">
                              {helpanion.services.slice(0, 2).map((service) => (
                                <Badge key={service.id} variant="secondary" className="text-xs">
                                  {service.title} {service.price_per_hour != null ? `- ₹${service.price_per_hour}/hr` : ""}
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
                          <Link to={profileHref}>View Profile</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
