import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface AudioJournalPlayerProps {
  title: string;
  speaker: string;
  durationSeconds?: number;
  transcript: string;
}

export const AudioJournalPlayer: React.FC<AudioJournalPlayerProps> = ({
  title,
  speaker,
  durationSeconds = 105,
  transcript,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, durationSeconds]);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const progressPercent = (currentTime / durationSeconds) * 100;

  return (
    <div className="bg-[#F3EFE6] border border-[#E4DCce] rounded-xl p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause' : 'Play audio note'}
            className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-colors shadow-2xs shrink-0"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-800 font-bold">
                Curator's Audio Note
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
            </div>
            <h4 className="font-serif text-xs font-bold text-stone-900 truncate max-w-[180px]">
              {title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-stone-600">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 hover:text-stone-900 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <span className="font-mono text-[10px] text-stone-500">
            {formatSeconds(currentTime)} / {formatSeconds(durationSeconds)}
          </span>
        </div>
      </div>

      {/* Animated Waveform Visualizer */}
      <div className="flex items-center gap-1 h-5 px-1 bg-stone-200/60 rounded-md overflow-hidden">
        {Array.from({ length: 32 }).map((_, i) => {
          const isActive = (i / 32) * 100 <= progressPercent;
          const randomHeight = Math.sin(i * 0.7) * 40 + 50;
          return (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-150 ${
                isActive ? 'bg-amber-800' : 'bg-stone-300'
              } ${isPlaying ? 'animate-pulse' : ''}`}
              style={{
                height: isPlaying ? `${Math.max(20, (randomHeight * (i % 2 === 0 ? 1 : 0.8)))}%` : '30%',
              }}
            />
          );
        })}
      </div>

      {/* Transcript Accordion */}
      <div className="pt-1 border-t border-stone-300/60 flex items-center justify-between text-[11px] text-stone-600">
        <span className="italic font-serif truncate max-w-[200px]">Narrated by {speaker}</span>
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="flex items-center gap-0.5 text-stone-700 hover:text-stone-900 font-medium"
        >
          <span>Transcript</span>
          {showTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {showTranscript && (
        <div className="p-2.5 bg-white rounded-lg border border-stone-200 text-xs text-stone-700 font-sans leading-relaxed animate-in fade-in duration-150">
          “{transcript}”
        </div>
      )}
    </div>
  );
};
