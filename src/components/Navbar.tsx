import React from 'react';
import { MessageSquareCode } from 'lucide-react';

interface NavbarProps {
  onOpenConverter: () => void;
  onOpenTemplates: () => void;
  onOpenDocs: () => void;
  onOpenSecurity: () => void;
  onOpenFeedback: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenConverter,
  onOpenTemplates,
  onOpenDocs,
  onOpenSecurity,
  onOpenFeedback,
}) => {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <img src="/table2MD.logo.svg" alt="" className="h-11 w-auto shrink-0" />
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-xl tracking-tight text-white">
              table2MD
            </span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-normal border border-zinc-700/60">
              v1.2
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-mono text-[11px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            100% Client-Side • Zero Backend
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-zinc-400">
          <button
            type="button"
            onClick={onOpenConverter}
            className="px-3 py-1.5 rounded-md bg-zinc-800/90 text-zinc-100 shadow-sm"
          >
            Converter
          </button>
          <button
            type="button"
            onClick={onOpenTemplates}
            className="px-3 py-1.5 rounded-md hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
          >
            Templates
          </button>
          <button
            type="button"
            onClick={onOpenDocs}
            className="px-3 py-1.5 rounded-md hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
          >
            Docs
          </button>
          <button
            type="button"
            onClick={onOpenSecurity}
            className="px-3 py-1.5 rounded-md hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
          >
            Security &amp; Privacy
          </button>
        </nav>

        {/* Right quick affordances */}
        <div className="flex items-center gap-3 text-xs">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-zinc-400">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 font-semibold border border-zinc-700 text-[11px]">
              ⌘V
            </kbd>
            <span>to paste spreadsheet</span>
          </div>

          <button
            type="button"
            onClick={onOpenFeedback}
            aria-label="Feedback"
            title="Feedback"
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors text-[10px] sm:text-xs font-medium whitespace-nowrap"
          >
            <MessageSquareCode className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Feedback</span>
          </button>
        </div>
      </div>
    </header>
  );
};
