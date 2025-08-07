import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BeatCard } from './BeatCard';
import { Beat } from '@/types/beat';

interface BeatShowcaseProps {
  beats: Beat[];
}

export const BeatShowcase = ({ beats }: BeatShowcaseProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentBeat = beats[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentIndex]);

  const handlePlayPause = () => {
    if (!audioRef.current || !currentBeat) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? beats.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === beats.length - 1 ? 0 : prev + 1));
  };

  if (beats.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground text-lg">No beats available yet</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-center space-x-8">
        <Button
          onClick={handlePrevious}
          variant="ghost"
          size="lg"
          className="rounded-full w-12 h-12 cyber-glow"
          disabled={beats.length <= 1}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="flex-1 max-w-md">
          <BeatCard
            beat={currentBeat}
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
        </div>

        <Button
          onClick={handleNext}
          variant="ghost"
          size="lg"
          className="rounded-full w-12 h-12 cyber-glow"
          disabled={beats.length <= 1}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Audio visualizer */}
      {isPlaying && (
        <div className="flex justify-center mt-6 space-x-1">
          {Array.from({ length: 32 }, (_, i) => (
            <div
              key={i}
              className="w-1 bg-primary audio-visualizer"
              style={{
                height: `${Math.random() * 40 + 10}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Beat counter */}
      <div className="flex justify-center mt-4 space-x-2">
        {beats.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-primary w-8' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`}
          />
        ))}
      </div>

      <audio
        ref={audioRef}
        src={currentBeat?.audioFile}
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
};