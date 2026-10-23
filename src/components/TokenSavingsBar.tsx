import React from 'react';
import { Zap, Lock } from 'lucide-react';
import { TokenStats } from '../types';

interface TokenSavingsBarProps {
  stats: TokenStats;
  compactMode: boolean;
  onToggleCompact: () => void;
}

export const TokenSavingsBar: React.FC<TokenSavingsBarProps> = ({
  stats,
  compactMode,
  onToggleCompact,
}) => {
  const barWidth = compactMode ? Math.max(stats.savingsPercentage, 18) : 12;

  return (
    <section className="border-t border-zinc-800/80 bg-zinc-950/60 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Token Efficiency Gauge */}
        <div className="w-full md:w-1/2 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-zinc-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>LLM Prompt Token Efficiency</span>
            </span>

            {compactMode ? (
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">
                {stats.savingsPercentage}% overhead eliminated!
              </span>
            ) : (
              <button
                type="button"
                onClick={onToggleCompact}
                className="font-mono text-[11px] text-indigo-400 hover:text-indigo-300 underline transition-colors"
              >
                Turn on Compact Mode to save ~{stats.savingsPercentage}% tokens
              </button>
            )}
          </div>

          {/* Efficiency Bar */}
          <div className="w-full h-2 rounded-full bg-zinc-800/90 overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${barWidth}%` }}
            />
          </div>

          {/* Token Numbers */}
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>
              Standard Padded:{' '}
              <span className="text-zinc-200">~{stats.tokensStandard} tokens</span>
            </span>
            <span>
              Compact Saver:{' '}
              <span className="text-emerald-400 font-semibold">
                ~{stats.tokensCompact} tokens
              </span>
            </span>
          </div>
        </div>

        {/* Privacy Guarantee Badge */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/60 border border-zinc-800 px-3.5 py-2 rounded-lg">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-zinc-200">100% Client-Side.</strong> No telemetry, zero server
            roundtrips, cell data never leaves your device.
          </span>
        </div>
      </div>
    </section>
  );
};
