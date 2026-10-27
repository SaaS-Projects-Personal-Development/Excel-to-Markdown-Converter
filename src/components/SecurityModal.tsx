import React from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, EyeOff, ServerOff } from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl flex flex-col gap-5 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base text-zinc-100">
                100% Client-Side Privacy Guarantee
              </h3>
              <p className="text-xs text-zinc-400">
                Your spreadsheet and proprietary tabular data never leaves your browser.
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

        {/* Audit points */}
        <div className="space-y-3 text-xs text-zinc-300">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
            <ServerOff className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-zinc-100 mb-0.5">Zero Backend Services</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                table2MD does not communicate with any external backend API, database, or analytics service. Inspect the browser Network tab anytime to confirm zero outbound network traffic during paste and export operations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
            <EyeOff className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-zinc-100 mb-0.5">No Telemetry or Tracking</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                No Google Analytics, no PostHog, no tracking pixels, and no advertising cookies. Your data remains strictly in your machine&apos;s volatile RAM.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/80">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-zinc-100 mb-0.5">Safe for Financial &amp; Secret Data</div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Whether you paste confidential payroll data, benchmark numbers, or internal architecture schemas, everything runs strictly client-side via JavaScript standard string operations.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Audited client-side architecture</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors font-medium"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
