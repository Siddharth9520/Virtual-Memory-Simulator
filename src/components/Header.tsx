import React from 'react';
import { Cpu, RotateCcw } from 'lucide-react';
import { PlaybackStatus } from '../types/simulator';

interface HeaderProps {
  status: PlaybackStatus;
  onReset: () => void;
  hasResults: boolean;
}

export const Header: React.FC<HeaderProps> = ({ status, onReset, hasResults }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Running':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Completed':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Ready':
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
    }
  };

  const getStatusDot = () => {
    switch (status) {
      case 'Running':
        return 'bg-amber-400 animate-pulse';
      case 'Completed':
        return 'bg-emerald-400';
      case 'Ready':
      default:
        return 'bg-cyan-400';
    }
  };

  return (
    <header className="w-full bg-[#101827] border-b border-[#1E2D44] px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-accent">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-wider text-slate-100 font-mono">
                VM<span className="text-cyan-400">SIM</span>
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono tracking-widest">
                v1.0 OS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Virtual Memory &amp; Page Replacement Simulator
            </p>
          </div>
        </div>

        {/* Status Indicator & Global Actions */}
        <div className="flex items-center space-x-3 self-end sm:self-center">
          {/* Status Badge */}
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-mono font-medium ${getStatusColor()}`}
          >
            <span className={`w-2 h-2 rounded-full ${getStatusDot()}`} />
            <span>STATUS: {status.toUpperCase()}</span>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            disabled={!hasResults && status === 'Ready'}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-[#151F30] hover:bg-[#1E2D44] border border-[#243247] hover:border-slate-500/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Reset Simulator to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
