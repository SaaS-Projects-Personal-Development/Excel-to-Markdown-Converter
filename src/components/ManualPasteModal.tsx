import React, { useState } from 'react';
import { X, FileSpreadsheet, Sparkles } from 'lucide-react';
import { parseSpreadsheetText } from '../utils/parseClipboard';
import { TableData } from '../types';

interface ManualPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyData: (data: TableData) => void;
}

export const ManualPasteModal: React.FC<ManualPasteModalProps> = ({
  isOpen,
  onClose,
  onApplyData,
}) => {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = () => {
    if (!text.trim()) {
      setError('Please paste spreadsheet content or delimited text.');
      return;
    }

    const parsed = parseSpreadsheetText(text);
    if (!parsed) {
      setError('Could not recognize spreadsheet structure. Please verify columns and rows.');
      return;
    }

    onApplyData(parsed);
    setText('');
    setError(null);
    onClose();
  };

  const samplePlaceholder = `Model\tProvider\tContext\tInput ($/1M)\tOutput ($/1M)
Claude 3.5 Sonnet\tAnthropic\t200k\t$3.00\t$15.00
GPT-4o\tOpenAI\t128k\t$2.50\t$10.00
Gemini 1.5 Pro\tGoogle\t2M\t$1.25\t$5.00`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <h3 className="font-display font-semibold text-sm text-zinc-100 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
            <span>Paste Delimited Spreadsheet or Markdown Table</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 p-1 rounded hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400">
          Drop raw text copied from Excel, Google Sheets, Airtable, CSV files, or an existing Markdown
          table. Automatically recognizes Tab (<code className="font-mono text-zinc-300">\t</code>),
          Comma (<code className="font-mono text-zinc-300">,</code>), Semicolon (
          <code className="font-mono text-zinc-300">;</code>), or Pipes (
          <code className="font-mono text-zinc-300">|</code>).
        </p>

        <textarea
          rows={7}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError(null);
          }}
          placeholder={samplePlaceholder}
          className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none placeholder:text-zinc-600"
        />

        {error && (
          <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            onClick={() => {
              setText(samplePlaceholder);
            }}
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample TSV</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-md shadow-indigo-600/20"
            >
              Parse &amp; Load Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
