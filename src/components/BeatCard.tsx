import { useState, useRef } from 'react';
import { Play, Pause, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Beat } from '@/types/beat';

interface BeatCardProps {
  beat: Beat;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export const BeatCard = ({ beat, isPlaying, onPlayPause }: BeatCardProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  return (
    <Card className="beat-card p-6 w-full max-w-sm mx-auto">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={beat.artwork} 
          alt={beat.name}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <Button
          onClick={onPlayPause}
          className="absolute bottom-4 right-4 rounded-full w-12 h-12 cyber-glow"
          variant="secondary"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-xl font-bold text-glow">{beat.name}</h3>
          <p className="text-muted-foreground">{beat.artist}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
            {beat.genre}
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-secondary/20 text-secondary border border-secondary/30">
            {beat.style}
          </span>
        </div>

        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{beat.bpm} BPM</span>
          <span>Key: {beat.key}</span>
          <span>{formatTime(beat.duration)}</span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-accent font-semibold">
            <DollarSign className="w-4 h-4" />
            {formatPrice(beat.cost)}
          </div>
          <Button variant="outline" size="sm" className="neon-glow">
            License
          </Button>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={beat.audioFile}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedData={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
        }}
      />
    </Card>
  );
};