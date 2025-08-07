import { Beat, ArtistProfile } from '@/types/beat';

const BEATS_STORAGE_KEY = 'mayerust-beats';
const PROFILE_STORAGE_KEY = 'mayerust-profile';

export const saveBeats = (beats: Beat[]) => {
  localStorage.setItem(BEATS_STORAGE_KEY, JSON.stringify(beats));
};

export const loadBeats = (): Beat[] => {
  const stored = localStorage.getItem(BEATS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addBeat = (beat: Beat) => {
  const beats = loadBeats();
  beats.push(beat);
  saveBeats(beats);
};

export const updateBeat = (id: string, updatedBeat: Partial<Beat>) => {
  const beats = loadBeats();
  const index = beats.findIndex(beat => beat.id === id);
  if (index !== -1) {
    beats[index] = { ...beats[index], ...updatedBeat };
    saveBeats(beats);
  }
};

export const deleteBeat = (id: string) => {
  const beats = loadBeats();
  const filtered = beats.filter(beat => beat.id !== id);
  saveBeats(filtered);
};

export const saveProfile = (profile: ArtistProfile) => {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
};

export const loadProfile = (): ArtistProfile => {
  const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
  return stored ? JSON.parse(stored) : {
    name: 'Mayerust',
    bio: 'Futuristic beats for the digital age',
    profileImage: '/lovable-uploads/a76b874a-08fc-496b-9320-2fddbf1a02b9.png',
    socialLinks: []
  };
};