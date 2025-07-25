import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Linkedin, Twitter } from "lucide-react";
import { Profile } from "@/hooks/useProfile";

interface ProfileHeroProps {
  profile: Profile;
}

export const ProfileHero = ({ profile }: ProfileHeroProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Mock data for social links and expertise tags - these could be added to the profile table later
  const socialLinks = [
    { platform: 'linkedin', url: '#', icon: Linkedin },
    { platform: 'twitter', url: '#', icon: Twitter },
    { platform: 'portfolio', url: '#', icon: ExternalLink }
  ];

  const expertiseTags = ['Product Marketing', 'Brand Strategy', 'Growth Marketing', 'Content Strategy'];

  return (
    <section className="text-center py-12 border-b border-border">
      <div className="space-y-6">
        <Avatar className="w-32 h-32 mx-auto">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name || 'Profile'} />
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {getInitials(profile.display_name || 'Helper')}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            {profile.display_name || 'Helpanion'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {profile.bio || 'Experienced professional ready to help you achieve your goals'}
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Button
                key={link.platform}
                variant="outline"
                size="sm"
                className="rounded-full"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <Icon className="w-4 h-4" />
                </a>
              </Button>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {expertiseTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-3 py-1">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
};