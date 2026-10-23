import React, { useRef, useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  Upload,
  Trash2,
  Undo2,
  Redo2,
  Check,
  Zap,
} from 'lucide-react';
import { ExportFormat, FormattingOptions, Preset } from '../types';
import { PRESETS } from '../utils/presets';

interface ToolbarProps {
  currentPresetLabel: string;
  onSelectPreset: (preset: Preset) => void;
  onImportFile: (content: string, filename: string) => void;
  onClearGrid: () => void;
  format: ExportFormat;
  onChangeFormat: (format: ExportFormat) => void;
  options: FormattingOptions;
  onChangeOptions: (updater: (prev: FormattingOptions) => FormattingOptions) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentPresetLabel,
  onSelectPreset,
  onImportFile,
  onClearGrid,
  format,
  onChangeFormat,
  options,
  onChangeOptions,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) => {
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportFile(content, file.name);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <section className="border-b border-zinc-800/70 bg-zinc-900/40 sticky top-14 z-30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        {/* Left: Presets, Import, Undo/Redo & Clear */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          {/* Preset Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 rounded-lg border border-zinc-700/70 transition-colors shadow-sm font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="truncate max-w-[140px] sm:max-w-[180px]">
                {currentPresetLabel}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {presetDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setPresetDropdownOpen(false)}
                />
                <div className="absolute left-0 mt-1.5 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-zinc-500 border-b border-zinc-800/80 mb-1">
                    Preloaded Datasets
                  </div>
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        onSelectPreset(preset);
                        setPresetDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-zinc-800 text-zinc-200 text-xs flex items-center justify-between transition-colors group"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium group-hover:text-indigo-300">
                          {preset.label}
                        </span>
                        <span className="text-[10px] text-zinc-400 truncate max-w-[170px]">
                          {preset.description}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-indigo-400 border border-zinc-700/50">
                        {preset.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Import File Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg border border-zinc-800 transition-colors font-medium cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-400" />
            <span>Import CSV/TSV</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.tsv,.txt,.tab"
              onChange={handleFileUpload}
              className="hidden"
            />
          </button>

          {/* History Undo / Redo */}
          <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-800 p-0.5">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="p-1 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="p-1 rounded text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Clear Grid */}
          <button
            type="button"
            onClick={onClearGrid}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-zinc-400 rounded-lg border border-zinc-800 transition-colors font-medium"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Grid</span>
          </button>
        </div>

        {/* Right: Export Format Pills & Toggles */}
        <div className="flex items-center flex-wrap gap-3 text-xs">
          {/* Format Pills */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {(
              [
                { id: 'gfm', label: 'GFM' },
                { id: 'compact', label: 'Clean' },
                { id: 'html', label: '<table>' },
                { id: 'json', label: 'JSON' },
                { id: 'csv', label: 'CSV' },
                { id: 'latex', label: 'LaTeX' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChangeFormat(item.id);
                  if (item.id === 'compact') {
                    onChangeOptions((prev) => ({ ...prev, compactMode: true }));
                  } else if (item.id === 'gfm') {
                    onChangeOptions((prev) => ({ ...prev, compactMode: false }));
                  }
                }}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  format === item.id
                    ? 'text-white bg-indigo-600 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="hidden xl:block h-4 w-[1px] bg-zinc-800" />

          {/* Settings Toggles */}
          <div className="flex items-center flex-wrap gap-3 select-none text-zinc-300">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-100 transition-colors">
              <input
                type="checkbox"
                checked={options.firstRowIsHeader}
                onChange={(e) =>
                  onChangeOptions((prev) => ({
                    ...prev,
                    firstRowIsHeader: e.target.checked,
                  }))
                }
                className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-indigo-600"
              />
              <span>First Row as Header</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-100 transition-colors">
              <input
                type="checkbox"
                checked={options.escapePipes}
                onChange={(e) =>
                  onChangeOptions((prev) => ({
                    ...prev,
                    escapePipes: e.target.checked,
                  }))
                }
                className="rounded border-zinc-700 bg-zinc-900 text-indigo-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-indigo-600"
              />
              <span>
                Escape Pipes (<code className="text-indigo-400 font-mono">|</code>)
              </span>
            </label>

            {/* LLM Compact Mode Toggle */}
            <label
              className={`flex items-center gap-1.5 cursor-pointer px-2.5 py-1 rounded-md transition-all font-medium border ${
                options.compactMode
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
              }`}
            >
              <input
                type="checkbox"
                checked={options.compactMode}
                onChange={(e) => {
                  const val = e.target.checked;
                  onChangeOptions((prev) => ({
                    ...prev,
                    compactMode: val,
                  }));
                  if (val && format === 'gfm') {
                    onChangeFormat('compact');
                  } else if (!val && format === 'compact') {
                    onChangeFormat('gfm');
                  }
                }}
                className="rounded border-indigo-400 bg-zinc-900 text-indigo-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-indigo-600"
              />
              <Zap className="w-3 h-3 text-amber-400" />
              <span>LLM Compact Mode</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};
