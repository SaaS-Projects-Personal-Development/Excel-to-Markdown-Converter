import React from 'react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { PRESETS } from '../utils/presets';
import { Preset } from '../types';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: Preset) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl flex flex-col gap-5 relative z-10 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base text-zinc-100">
                Preset Table Templates
              </h3>
              <p className="text-xs text-zinc-400">
                Production-ready schemas for LLM benchmarks, SaaS pricing tiers, and developer documentation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 overflow-y-auto pr-1">
          {PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="bg-zinc-950/80 border border-zinc-800/90 hover:border-zinc-700/80 rounded-xl p-4 flex flex-col justify-between gap-3 transition-all duration-150 group"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-sm text-zinc-100 group-hover:text-indigo-300 transition-colors">
                    {preset.label}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700/60">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  {preset.description}
                </p>

                {/* Headers preview chip strip */}
                <div className="flex flex-wrap gap-1">
                  {preset.headers.slice(0, 4).map((h, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                    >
                      {h}
                    </span>
                  ))}
                  {preset.headers.length > 4 && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500">
                      +{preset.headers.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className="w-full mt-2 py-1.5 px-3 rounded-lg bg-zinc-900 hover:bg-indigo-600 text-zinc-200 hover:text-white border border-zinc-800 hover:border-indigo-500 text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                <span>Load Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
