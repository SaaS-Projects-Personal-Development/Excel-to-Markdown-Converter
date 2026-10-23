import React from 'react';
import { X, BookOpen, Code2, Zap, ShieldCheck, Keyboard } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-2xl flex flex-col gap-5 relative z-10 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base text-zinc-100">
                Tabular Documentation &amp; Cheatsheet
              </h3>
              <p className="text-xs text-zinc-400">
                Markdown table specifications, alignment rules, and LLM prompt engineering tips.
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

        {/* Content sections */}
        <div className="flex flex-col gap-5 text-xs text-zinc-300 leading-relaxed">
          {/* Section 1: Alignment */}
          <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4">
            <h4 className="font-semibold text-zinc-100 flex items-center gap-2 mb-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Column Alignment Syntax (GFM Spec)</span>
            </h4>
            <p className="text-zinc-400 mb-3">
              GitHub Flavored Markdown uses colons in the header delimiter row to control text alignment:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="text-zinc-200 font-semibold mb-1">Left Align</div>
                <code className="text-indigo-400">:---</code>
                <div className="text-[10px] text-zinc-400 mt-1">Default for text strings</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="text-zinc-200 font-semibold mb-1">Center Align</div>
                <code className="text-indigo-400">:---:</code>
                <div className="text-[10px] text-zinc-400 mt-1">Dates, statuses, badges</div>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="text-zinc-200 font-semibold mb-1">Right Align</div>
                <code className="text-indigo-400">---:</code>
                <div className="text-[10px] text-zinc-400 mt-1">Numbers, currency, %</div>
              </div>
            </div>
          </div>

          {/* Section 2: LLM Compact Mode */}
          <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4">
            <h4 className="font-semibold text-zinc-100 flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Why Use LLM Compact Mode?</span>
            </h4>
            <p className="text-zinc-400 mb-2">
              Standard Markdown tables use extensive whitespace padding to make monospace text align visually in text editors. However, AI models (Claude 3.5, GPT-4o, Gemini 1.5) consume tokens for every space character!
            </p>
            <p className="text-zinc-400 mb-2">
              <strong className="text-zinc-200">Tabular Compact Mode</strong> strips all non-essential space characters while preserving strict Markdown table syntax (<code className="font-mono text-zinc-300">|A|B|C|</code> with <code className="font-mono text-zinc-300">|:--|:--|:--|</code>).
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[11px]">
              ✓ Reduces prompt table payload by 30% to 55% tokens with zero loss of semantic comprehension.
            </div>
          </div>

          {/* Section 3: Escaping Pipes & Line Breaks */}
          <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4">
            <h4 className="font-semibold text-zinc-100 flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Pipe Escaping &amp; Multiline Cells</span>
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Pipe characters:</strong> Internal pipes inside cell content (e.g., <code className="font-mono text-zinc-300">Meta | Fireworks</code>) are automatically converted to <code className="font-mono text-indigo-400">\|</code> so markdown parsers don&apos;t mistake them for new columns.
              </li>
              <li>
                <strong className="text-zinc-200">Multiline cells:</strong> Line breaks within an Excel or Sheets cell are transformed to HTML <code className="font-mono text-indigo-400">&lt;br&gt;</code> tags to maintain strict single-line table row format.
              </li>
            </ul>
          </div>

          {/* Section 4: Keyboard Shortcuts */}
          <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4">
            <h4 className="font-semibold text-zinc-100 flex items-center gap-2 mb-2">
              <Keyboard className="w-4 h-4 text-indigo-400" />
              <span>Keyboard Shortcuts</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400">Paste anywhere</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">⌘+V</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400">Quick copy</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">⌘+C</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400">Next cell / column</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">Tab</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-zinc-900 border border-zinc-800">
                <span className="text-zinc-400">Next row / new row</span>
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">Enter</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
