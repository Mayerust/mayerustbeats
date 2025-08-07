import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Beat, ArtistProfile } from '@/types/beat';
import { addBeat, saveProfile, loadProfile, loadBeats, deleteBeat } from '@/utils/beatStorage';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Music } from 'lucide-react';

const beatSchema = z.object({
  name: z.string().min(1, 'Beat name is required'),
  style: z.string().min(1, 'Style is required'),
  genre: z.string().min(1, 'Genre is required'),
  cost: z.number().min(0, 'Cost must be non-negative'),
  artwork: z.string().url('Must be a valid URL'),
  audioFile: z.string().url('Must be a valid URL'),
  duration: z.number().min(1, 'Duration must be positive'),
  bpm: z.number().min(60).max(200, 'BPM must be between 60-200'),
  key: z.string().min(1, 'Key is required'),
});

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().min(1, 'Bio is required'),
  profileImage: z.string().url('Must be a valid URL'),
  socialLinks: z.string().optional(),
});

type BeatFormData = z.infer<typeof beatSchema>;
type ProfileFormData = z.infer<typeof profileSchema>;

export const AdminForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'beats' | 'profile'>('beats');
  const [existingBeats, setExistingBeats] = useState<Beat[]>(loadBeats());
  
  const beatForm = useForm<BeatFormData>({
    resolver: zodResolver(beatSchema),
    defaultValues: {
      cost: 0,
      duration: 120,
      bpm: 120,
    }
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      ...loadProfile(),
      socialLinks: loadProfile().socialLinks.map(link => `${link.platform}: ${link.url}`).join('\n')
    },
  });

  const onSubmitBeat = (data: BeatFormData) => {
    const newBeat: Beat = {
      id: Date.now().toString(),
      name: data.name,
      artist: 'Mayerust',
      artwork: data.artwork,
      style: data.style,
      genre: data.genre,
      cost: data.cost,
      audioFile: data.audioFile,
      duration: data.duration,
      bpm: data.bpm,
      key: data.key,
      createdAt: new Date(),
    };
    
    addBeat(newBeat);
    setExistingBeats(loadBeats());
    beatForm.reset();
    toast({
      title: 'Beat Added',
      description: `${data.name} has been added to your portfolio.`,
    });
  };

  const onSubmitProfile = (data: ProfileFormData) => {
    const socialLinks = data.socialLinks 
      ? data.socialLinks.split('\n').map((link: string) => {
          const [platform, url] = link.split(':').map(s => s.trim());
          return { platform, url, icon: '' };
        }).filter(link => link.platform && link.url)
      : [];

    const profile: ArtistProfile = {
      name: data.name,
      bio: data.bio,
      profileImage: data.profileImage,
      socialLinks,
    };
    
    saveProfile(profile);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been successfully updated.',
    });
  };

  const handleDeleteBeat = (id: string) => {
    deleteBeat(id);
    setExistingBeats(loadBeats());
    toast({
      title: 'Beat Deleted',
      description: 'Beat has been removed from your portfolio.',
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-glow gradient-cyber bg-clip-text text-transparent">
            Mayerust Admin Panel
          </h1>
          <p className="text-muted-foreground mt-2">Manage your beats and profile</p>
        </div>

        <div className="flex justify-center">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={activeTab === 'beats' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('beats')}
              className="px-6"
            >
              <Music className="w-4 h-4 mr-2" />
              Beats
            </Button>
            <Button
              variant={activeTab === 'profile' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('profile')}
              className="px-6"
            >
              Profile
            </Button>
          </div>
        </div>

        {activeTab === 'beats' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="beat-card">
              <CardHeader>
                <CardTitle>Add New Beat</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={beatForm.handleSubmit(onSubmitBeat)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Beat Name</Label>
                    <Input {...beatForm.register('name')} />
                    {beatForm.formState.errors.name && (
                      <p className="text-destructive text-sm">{beatForm.formState.errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="style">Style</Label>
                      <Input {...beatForm.register('style')} placeholder="e.g., Dark, Melodic" />
                    </div>
                    <div>
                      <Label htmlFor="genre">Genre</Label>
                      <Input {...beatForm.register('genre')} placeholder="e.g., Trap, Hip-Hop" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="cost">Cost ($)</Label>
                      <Input 
                        type="number" 
                        {...beatForm.register('cost', { valueAsNumber: true })} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="bpm">BPM</Label>
                      <Input 
                        type="number" 
                        {...beatForm.register('bpm', { valueAsNumber: true })} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="key">Key</Label>
                      <Input {...beatForm.register('key')} placeholder="e.g., C Minor" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input 
                      type="number" 
                      {...beatForm.register('duration', { valueAsNumber: true })} 
                    />
                  </div>

                  <div>
                    <Label htmlFor="artwork">Artwork URL</Label>
                    <Input {...beatForm.register('artwork')} placeholder="https://..." />
                  </div>

                  <div>
                    <Label htmlFor="audioFile">Audio File URL</Label>
                    <Input {...beatForm.register('audioFile')} placeholder="https://..." />
                  </div>

                  <Button type="submit" className="w-full cyber-glow">
                    Add Beat
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="beat-card">
              <CardHeader>
                <CardTitle>Existing Beats ({existingBeats.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {existingBeats.length === 0 ? (
                    <p className="text-muted-foreground">No beats added yet</p>
                  ) : (
                    existingBeats.map((beat) => (
                      <div 
                        key={beat.id} 
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{beat.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {beat.genre} • {beat.style} • ${beat.cost}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBeat(beat.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <Card className="beat-card max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Artist Name</Label>
                  <Input {...profileForm.register('name')} />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea {...profileForm.register('bio')} rows={3} />
                </div>

                <div>
                  <Label htmlFor="profileImage">Profile Image URL</Label>
                  <Input {...profileForm.register('profileImage')} />
                </div>

                <div>
                  <Label htmlFor="socialLinks">Social Links (one per line: Platform: URL)</Label>
                  <Textarea 
                    {...profileForm.register('socialLinks')} 
                    placeholder="Instagram: https://instagram.com/mayerust&#10;SoundCloud: https://soundcloud.com/mayerust"
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full cyber-glow">
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};