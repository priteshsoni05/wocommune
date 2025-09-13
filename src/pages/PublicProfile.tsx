import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useServices } from "@/hooks/useServices";
import { useAvailabilitySlots } from "@/hooks/useAvailabilitySlots";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GlobalHeader from "@/components/common/GlobalHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceBookingDialog } from "@/components/booking/ServiceBookingDialog";
import { MapPin, Star, Clock, ExternalLink } from "lucide-react";

export default function PublicProfile() {
  const { id } = useParams();
  const { profile, loading: profileLoading } = useProfile();
  const { services, loading: servicesLoading } = useServices();
  const { slots: availability, loading: availabilityLoading } = useAvailabilitySlots(id);
  
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  if (profileLoading || servicesLoading || availabilityLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <div className="pt-16 max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              <Skeleton className="w-24 h-24 rounded-full mx-auto lg:mx-0" />
              <Skeleton className="h-6 w-32 mx-auto lg:mx-0" />
              <Skeleton className="h-4 w-48 mx-auto lg:mx-0" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <div className="pt-16 flex justify-center items-center min-h-[80vh] text-muted-foreground">
          Profile not found.
        </div>
      </div>
    );
  }

  const handleBookNow = (service: any) => {
    setSelectedService(service);
    setShowBookingDialog(true);
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase() || 'H';
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <div className="pt-16 max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDEBAR - User Information */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex flex-col items-center lg:items-start space-y-4">
                {/* Profile Avatar */}
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar_url || ""} alt={profile.display_name || ""} />
                  <AvatarFallback className="text-lg font-medium bg-muted text-muted-foreground">
                    {getInitials(profile.display_name || "")}
                  </AvatarFallback>
                </Avatar>

                {/* Name & Bio */}
                <div className="text-center lg:text-left space-y-1">
                  <h1 className="text-lg font-semibold text-foreground">
                    {profile.display_name}
                  </h1>
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {profile.bio.substring(0, 100)}
                      {profile.bio.length > 100 && "..."}
                    </p>
                  )}
                  {profile.profession && (
                    <p className="text-xs text-muted-foreground font-medium">
                      {profile.profession}
                    </p>
                  )}
                </div>

                {/* Key Details */}
                <div className="w-full space-y-3 text-center lg:text-left">
                  {profile.skills && profile.skills.length > 0 && (
                    <div>
                      <h6 className="text-xs font-medium text-foreground mb-2">Expertise</h6>
                      <div className="flex flex-wrap gap-1 justify-center lg:justify-start">
                        {profile.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs py-0.5 px-2">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {(profile.school || profile.linkedin_url || profile.website_url) && (
                    <div className="space-y-2 pt-2 border-t border-border">
                      {profile.school && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center lg:justify-start">
                          <MapPin className="w-3 h-3" />
                          <span>{profile.school}</span>
                        </div>
                      )}
                      
                      {/* Social Links */}
                      <div className="flex gap-2 justify-center lg:justify-start">
                        {profile.linkedin_url && (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                        {profile.website_url && (
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
                            <a href={profile.website_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4 text-xs font-medium border-foreground/20 hover:bg-foreground hover:text-background"
                >
                  Connect
                </Button>
              </div>
            </Card>
          </div>

          {/* RIGHT SECTION - Services */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              <div className="text-center lg:text-left">
                <h2 className="text-lg font-medium text-foreground mb-1">
                  Here's what I can help you with
                </h2>
                {profile.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    {profile.bio.substring(0, 150)}
                    {profile.bio.length > 150 && "..."}
                  </p>
                )}
              </div>

              {/* Services Grid */}
              <div className="space-y-3">
                {services && services.length > 0 ? (
                  services.map((service: any) => (
                    <Card key={service.id} className="border border-border/50 hover:border-border transition-colors">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Service Info */}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-foreground">
                                {service.title}
                              </h3>
                              {service.category && (
                                <Badge variant="outline" className="text-xs px-1.5 py-0">
                                  {service.category}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {service.description?.substring(0, 120)}
                              {service.description?.length > 120 && "..."}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {service.duration_minutes && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{service.duration_minutes} min</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Price & CTA */}
                          <div className="flex flex-col items-start sm:items-end gap-2 sm:text-right">
                            <div className="text-sm font-semibold text-foreground">
                              ₹{service.price_per_hour}
                              <span className="text-xs text-muted-foreground font-normal">/session</span>
                            </div>
                            <Button 
                              onClick={() => handleBookNow(service)}
                              className="bg-[hsl(180,33%,15%)] hover:bg-[hsl(180,33%,12%)] text-white text-xs px-4 py-1.5 h-auto font-medium"
                            >
                              Book now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border border-dashed border-border/50">
                    <CardContent className="p-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        No services available at the moment.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      {selectedService && (
        <ServiceBookingDialog
          open={showBookingDialog}
          onOpenChange={setShowBookingDialog}
          service={selectedService}
          availability={availability}
          helperId={id || ''}
          helperName={profile?.display_name || 'Helper'}
        />
      )}
    </div>
  );
}
