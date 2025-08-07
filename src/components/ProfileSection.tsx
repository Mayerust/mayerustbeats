import { ArtistProfile } from '@/types/beat';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ProfileSectionProps {
  profile: ArtistProfile;
}

export const ProfileSection = ({ profile }: ProfileSectionProps) => {
  return (
    <div className="flex flex-col items-center text-center space-y-6 p-8">
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary cyber-glow">
          <img 
            src={profile.profileImage} 
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20" />
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-glow gradient-cyber bg-clip-text text-transparent">
          {profile.name}
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          {profile.bio}
        </p>
      </div>

      {profile.socialLinks.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {profile.socialLinks.map((link, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="neon-glow"
              asChild
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.platform}
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};