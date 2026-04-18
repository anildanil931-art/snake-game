import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Cybernetic Horizon",
    artist: "AI Synth Matrix",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "Neon Overdrive",
    artist: "Neural Network Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Binary Sunset",
    artist: "Deep Learning Audio",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  return (
    <div className="flex flex-col gap-8 w-full font-display">
      {/* Track List Simulation / Active Track */}
      <div className="flex flex-col gap-3">
        <div className="p-3 bg-card-dark border-l-[3px] border-neon-pink cursor-pointer">
          <div className="text-[14px] font-bold text-text-main mb-1">{TRACKS[currentTrackIndex].title}</div>
          <div className="text-[12px] text-text-dim">{TRACKS[currentTrackIndex].artist}</div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t-[2px] border-[#222]">
         <div className="text-[10px] text-neon-green uppercase mb-0.5 tracking-wider">Game Mode</div>
         <div className="text-[14px] font-bold text-text-main">Endless Arcade</div>
      </div>

      {/* Player UI */}
      <div className="bg-[#0a0a0a] border-t-2 border-[#222] pt-6 flex flex-col gap-6 w-full mt-2">
         <div className="flex items-center gap-4">
           <div className="w-[50px] h-[50px] shrink-0 bg-gradient-to-tr from-neon-blue to-neon-pink"></div>
           <div className="flex-1 truncate">
             <div className="text-[14px] font-bold text-text-main truncate">{TRACKS[currentTrackIndex].title}</div>
             <div className="text-[12px] text-text-dim truncate">{TRACKS[currentTrackIndex].artist}</div>
           </div>
         </div>

         <div className="flex items-center justify-center gap-[30px]">
           <button onClick={prevTrack} className="text-white hover:text-neon-blue transition-colors flex items-center justify-center">
             <SkipBack className="w-6 h-6" />
           </button>
           <button onClick={togglePlay} className="w-[50px] h-[50px] bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0">
             {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 translate-x-[2px]" fill="currentColor" />}
           </button>
           <button onClick={nextTrack} className="text-white hover:text-neon-blue transition-colors flex items-center justify-center">
             <SkipForward className="w-6 h-6" />
           </button>
         </div>

         <div className="w-full">
           <div className="h-[4px] bg-[#333] relative">
             <div 
               className="absolute top-0 left-0 h-full bg-neon-blue shadow-[0_0_10px_var(--color-neon-blue)]"
               style={{ width: `${progress}%` }}
             />
           </div>
           <div className="flex justify-between mt-2 text-[12px] font-mono text-text-dim">
             <span>SYS.ONLINE</span>
             <span>V1.0.0</span>
           </div>
         </div>
      </div>

      <audio 
        ref={audioRef}
        src={TRACKS[currentTrackIndex].url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
    </div>
  );
}
