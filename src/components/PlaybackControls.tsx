import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
} from 'lucide-react';

interface PlaybackControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onRestart: () => void;
  onSeek: (stepIndex: number) => void;
  playbackSpeed: number;
  setPlaybackSpeed: (speed: number) => void;
  disabled: boolean;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onRestart,
  onSeek,
  playbackSpeed,
  setPlaybackSpeed,
  disabled,
}) => {
  const isAtStart = currentStepIndex <= 0;
  const isAtEnd = currentStepIndex >= totalSteps - 1;

  const speeds = [
    { label: '0.5x', value: 1500 },
    { label: '1x', value: 800 },
    { label: '2x', value: 400 },
    { label: '4x', value: 150 },
  ];

  return (
    <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Primary Stepper Buttons */}
      <div className="flex items-center space-x-2 w-full md:w-auto justify-center">
        {/* Restart / Jump to Start */}
        <button
          type="button"
          onClick={onRestart}
          disabled={disabled || isAtStart}
          className="p-2 rounded-lg bg-[#151F30] hover:bg-[#1E2D44] text-slate-300 border border-[#243247] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Restart to Step 1"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Previous Step */}
        <button
          type="button"
          onClick={onPrev}
          disabled={disabled || isAtStart}
          className="p-2 rounded-lg bg-[#151F30] hover:bg-[#1E2D44] text-slate-300 border border-[#243247] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 px-3"
          title="Previous Step"
        >
          <SkipBack className="w-4 h-4" />
          <span className="text-xs font-mono font-medium hidden sm:inline">Prev</span>
        </button>

        {/* Play / Pause Toggle Button */}
        {isPlaying ? (
          <button
            type="button"
            onClick={onPause}
            disabled={disabled}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
            title="Pause automatic playback"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span>Pause</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onPlay}
            disabled={disabled || isAtEnd}
            className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-glow-accent disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Play automatic step-by-step execution"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Play</span>
          </button>
        )}

        {/* Next Step */}
        <button
          type="button"
          onClick={onNext}
          disabled={disabled || isAtEnd}
          className="p-2 rounded-lg bg-[#151F30] hover:bg-[#1E2D44] text-slate-300 border border-[#243247] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1 px-3"
          title="Next Step"
        >
          <span className="text-xs font-mono font-medium hidden sm:inline">Next</span>
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Scrubber / Step Progress Slider */}
      <div className="flex-1 max-w-md w-full flex items-center space-x-3 px-2">
        <span className="text-xs font-mono text-slate-400 whitespace-nowrap min-w-[50px]">
          {totalSteps > 0 ? `${currentStepIndex + 1} / ${totalSteps}` : '0 / 0'}
        </span>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => onSeek(parseInt(e.target.value, 10))}
          disabled={disabled || totalSteps <= 1}
          className="w-full accent-cyan-400 h-1.5 bg-[#1E2D44] rounded-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        />
      </div>

      {/* Playback Speed Selector */}
      <div className="flex items-center space-x-1.5 bg-[#151F30] p-1 rounded-lg border border-[#243247]">
        <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
        {speeds.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setPlaybackSpeed(s.value)}
            disabled={disabled}
            className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
              playbackSpeed === s.value
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
