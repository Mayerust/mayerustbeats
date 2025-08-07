import { useState, useEffect } from 'react';
import { BeatShowcase } from '@/components/BeatShowcase';
import { ProfileSection } from '@/components/ProfileSection';
import { Beat, ArtistProfile } from '@/types/beat';
import { loadBeats, loadProfile } from '@/utils/beatStorage';

const Index = () => {
  const [beats, setBeats] = useState<Beat[]>([]);
  const [profile, setProfile] = useState<ArtistProfile | null>(null);

  useEffect(() => {
    setBeats(loadBeats());
    setProfile(loadProfile());
  }, []);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 -z-10" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Profile Section */}
          <ProfileSection profile={profile} />
          
          {/* Beats Showcase */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-glow">Latest Beats</h2>
              <p className="text-muted-foreground mt-2">
                Navigate through the collection using the arrows
              </p>
            </div>
            
            <BeatShowcase beats={beats} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
