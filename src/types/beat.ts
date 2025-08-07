export interface Beat {
  id: string;
  name: string;
  artist: string;
  artwork: string;
  style: string;
  genre: string;
  cost: number;
  audioFile: string;
  duration: number;
  bpm: number;
  key: string;
  createdAt: Date;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ArtistProfile {
  name: string;
  bio: string;
  profileImage: string;
  socialLinks: SocialLink[];
}