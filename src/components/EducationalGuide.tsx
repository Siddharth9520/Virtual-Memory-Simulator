import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Cpu, HardDrive, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';

export const EducationalGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <section className="bg-[#101827] border border-[#1E2D44] rounded-2xl shadow-lg overflow-hidden transition-all">
      {/* Accordion Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between bg-[#101827] hover:bg-[#121B2B] text-left transition-colors cursor-pointer"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-200 font-mono flex items-center gap-2">
              <span>OS Theory &amp; Viva Examination Guide</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono font-medium lowercase">
                educational reference
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Key concepts: Page Hits, Page Faults, Victim Selection, and Belády’s Anomaly
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-slate-400">
          <span className="text-xs font-mono font-medium hidden sm:inline">
            {isOpen ? 'Collapse Guide' : 'Expand Guide'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Guide Content */}
      {isOpen && (
        <div className="p-5 border-t border-[#1E2D44] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-[#0D1422] animate-in fade-in duration-200">
          {/* Concept 1: Page Hit vs Page Fault */}
          <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <Cpu className="w-4 h-4" />
                <span>1. Hit vs. Fault Mechanics</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                <p>
                  <strong className="text-emerald-400">Page Hit:</strong> The CPU requests a virtual memory page that is already loaded in one of the physical RAM frames. Address translation completes instantly without disk I/O.
                </p>
                <p>
                  <strong className="text-red-400">Page Fault:</strong> The referenced page is absent from physical RAM. The hardware MMU triggers a page-fault trap to the OS kernel, requiring a disk read to transfer the page into memory.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1E2D44]/70 text-[11px] text-slate-400 font-mono">
              Formula: Hits + Faults = Total References
            </div>
          </div>

          {/* Concept 2: Why Replacement Occurs */}
          <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <RefreshCw className="w-4 h-4" />
                <span>2. Why Replacement Occurs</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                <p>
                  Physical memory has finite capacity ($N$ frames). When a page fault occurs and all $N$ frames are occupied, the OS cannot simply allocate a new slot.
                </p>
                <p>
                  It must select a <strong className="text-slate-100">victim page</strong> already resident in RAM, evict it (writing it to swap if modified/dirty), and repurpose that frame slot for the incoming page.
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1E2D44]/70 text-[11px] text-slate-400 font-mono">
              Goal: Minimize total page fault frequency
            </div>
          </div>

          {/* Concept 3: How Algorithms Select Victims */}
          <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <HardDrive className="w-4 h-4" />
                <span>3. Victim Selection Strategies</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                <p>
                  <strong className="text-cyan-300">FIFO:</strong> Evicts the oldest loaded page (queue/circular pointer). Ignores usage recency; susceptible to Belády’s Anomaly.
                </p>
                <p>
                  <strong className="text-indigo-300">LRU:</strong> Evicts the page unused for the longest past interval. Exploits temporal locality; stack algorithm.
                </p>
                <p>
                  <strong className="text-emerald-300">Optimal:</strong> Evicts the page whose next access is farthest in the future (or never referenced again).
                </p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1E2D44]/70 text-[11px] text-slate-400 font-mono">
              LRU past lookback vs. Optimal future foresight
            </div>
          </div>

          {/* Concept 4: Why Optimal is a Benchmark */}
          <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-4 flex flex-col justify-between md:col-span-2 lg:col-span-2">
            <div>
              <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>4. Why Optimal Acts as a Theoretical Benchmark</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Optimal (Belády’s MIN algorithm) guarantees the mathematical minimum number of page faults for any reference string and frame capacity. However, because general-purpose operating systems execute interactive, non-deterministic programs, the kernel cannot predict future memory access sequences in advance. Thus, Optimal is physically unimplementable in standard operating systems and serves as an offline clairvoyant upper-bound against which practical heuristics (LRU, Clock/Second-Chance, Aging) are evaluated.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1E2D44]/70 text-[11px] text-slate-400 font-mono">
              Theoretical Limit: Faults(Optimal) &le; Faults(A) for any algorithm A
            </div>
          </div>

          {/* Concept 5: Belady's Anomaly Note */}
          <div className="bg-[#121B2B] border border-[#1E2D44] rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                <HelpCircle className="w-4 h-4" />
                <span>5. Belády’s Anomaly</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                In FIFO, allocating more physical frames can paradoxically increase the number of page faults (e.g. 9 faults on 3 frames vs. 10 faults on 4 frames for <code className="text-cyan-300 font-mono">1 2 3 4 1 2 5 1 2 3 4 5</code>). LRU and Optimal are stack algorithms and are immune to this phenomenon.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#1E2D44]/70 text-[11px] text-amber-400/90 font-mono">
              Load Preset #5 to see live demonstration
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
