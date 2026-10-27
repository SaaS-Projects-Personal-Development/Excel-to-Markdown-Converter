/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Toolbar } from './components/Toolbar';
import { GridEditor } from './components/GridEditor';
import { OutputPane } from './components/OutputPane';
import { TokenSavingsBar } from './components/TokenSavingsBar';
import { ManualPasteModal } from './components/ManualPasteModal';
import { TemplatesModal } from './components/TemplatesModal';
import { DocsModal } from './components/DocsModal';
import { SecurityModal } from './components/SecurityModal';
import { Toast } from './components/Toast';
import { FeedbackPage } from './components/FeedbackPage';
import { Alignment, ExportFormat, FormattingOptions, Preset, TableData, ToastInfo } from './types';
import { PRESETS } from './utils/presets';
import { inferColumnAlignment, parseSpreadsheetText } from './utils/parseClipboard';
import { calculateTokenStats } from './utils/markdownGenerator';

const DEFAULT_PRESET = PRESETS[0]; // AI Models Benchmark

const INITIAL_TABLE: TableData = {
  headers: [...DEFAULT_PRESET.headers],
  alignments: [...DEFAULT_PRESET.alignments],
  rows: DEFAULT_PRESET.rows.map((r) => [...r]),
};

const INITIAL_OPTIONS: FormattingOptions = {
  firstRowIsHeader: true,
  escapePipes: true,
  compactMode: false,
  multilineMode: 'br',
};

export default function App() {
  const [table, setTable] = useState<TableData>(INITIAL_TABLE);
  const [format, setFormat] = useState<ExportFormat>('gfm');
  const [options, setOptions] = useState<FormattingOptions>(INITIAL_OPTIONS);
  const [currentPresetLabel, setCurrentPresetLabel] = useState<string>(DEFAULT_PRESET.label);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<TableData[]>([INITIAL_TABLE]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Modals state
  const [isManualPasteOpen, setIsManualPasteOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ id: String(Date.now()), message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 2400);
  }, []);

  // Push new state to history
  const commitTableChange = useCallback((newTable: TableData) => {
    setTable(newTable);
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      next.push(newTable);
      return next.slice(-30); // keep last 30 states
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 29));
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      setHistoryIndex(targetIndex);
      setTable(history[targetIndex]);
      showToast('Undo', 'info');
    }
  }, [history, historyIndex, showToast]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      setHistoryIndex(targetIndex);
      setTable(history[targetIndex]);
      showToast('Redo', 'info');
    }
  }, [history, historyIndex, showToast]);

  // Update Header cell
  const handleUpdateHeader = useCallback((colIdx: number, value: string) => {
    const newHeaders = [...table.headers];
    newHeaders[colIdx] = value;
    commitTableChange({ ...table, headers: newHeaders });
  }, [commitTableChange, table]);

  // Update Data cell
  const handleUpdateCell = useCallback((rowIdx: number, colIdx: number, value: string) => {
    const newRows = table.rows.map((row) => [...row]);
    if (!newRows[rowIdx]) newRows[rowIdx] = new Array(table.headers.length).fill('');
    newRows[rowIdx][colIdx] = value;
    commitTableChange({ ...table, rows: newRows });
  }, [commitTableChange, table]);

  // Cycle alignment for a single column
  const handleCycleAlignment = useCallback((colIdx: number) => {
    const cycle = (current: Alignment): Alignment => {
      if (current === 'left') return 'center';
      if (current === 'center') return 'right';
      return 'left';
    };

    const newAlignments = [...table.alignments];
    newAlignments[colIdx] = cycle(newAlignments[colIdx] || 'left');
    commitTableChange({ ...table, alignments: newAlignments });
  }, [commitTableChange, table]);

  // Add column
  const handleAddColumn = useCallback(() => {
    const nextTable: TableData = {
      headers: [...table.headers, `Col ${table.headers.length + 1}`],
      alignments: [...table.alignments, 'left'],
      rows: table.rows.map((row) => [...row, '']),
    };
    commitTableChange(nextTable);
    showToast('Added column');
  }, [commitTableChange, showToast, table]);

  // Delete column
  const handleDeleteColumn = useCallback((colIdx: number) => {
    if (table.headers.length <= 1) {
      showToast('Table needs at least one column', 'error');
      return;
    }
    const nextTable: TableData = {
      headers: table.headers.filter((_, i) => i !== colIdx),
      alignments: table.alignments.filter((_, i) => i !== colIdx),
      rows: table.rows.map((row) => row.filter((_, i) => i !== colIdx)),
    };
    commitTableChange(nextTable);
    showToast('Deleted column');
  }, [commitTableChange, showToast, table]);

  // Add row
  const handleAddRow = useCallback(() => {
    const nextTable = {
      ...table,
      rows: [...table.rows, new Array(table.headers.length).fill('')],
    };
    commitTableChange(nextTable);
    showToast('Added row');
  }, [commitTableChange, showToast, table]);

  // Delete row
  const handleDeleteRow = useCallback((rowIdx: number) => {
    const newRows = table.rows.filter((_, i) => i !== rowIdx);
    const nextTable = {
      ...table,
      rows: newRows.length > 0 ? newRows : [new Array(table.headers.length).fill('')],
    };
    commitTableChange(nextTable);
    showToast('Deleted row');
  }, [commitTableChange, showToast, table]);

  // Auto align all columns
  const handleAutoAlignAll = useCallback(() => {
    const newAlignments = table.headers.map((_, colIdx) =>
      inferColumnAlignment(table.rows, colIdx)
    );
    commitTableChange({ ...table, alignments: newAlignments });
    showToast('Columns automatically aligned');
  }, [commitTableChange, showToast, table]);

  // Clear Grid
  const handleClearGrid = useCallback(() => {
    const blankTable: TableData = {
      headers: ['Col 1', 'Col 2', 'Col 3'],
      alignments: ['left', 'left', 'left'],
      rows: [
        ['', '', ''],
        ['', '', ''],
      ],
    };
    commitTableChange(blankTable);
    setCurrentPresetLabel('Custom Blank');
    showToast('Grid cleared');
  }, [commitTableChange, showToast]);

  // Load Preset
  const handleSelectPreset = useCallback((preset: Preset) => {
    const loaded: TableData = {
      headers: [...preset.headers],
      alignments: [...preset.alignments],
      rows: preset.rows.map((r) => [...r]),
    };
    commitTableChange(loaded);
    setCurrentPresetLabel(preset.label);
    showToast(`Loaded "${preset.label}"`);
  }, [commitTableChange, showToast]);

  // Handle Imported text from File or Manual Paste
  const handleApplyImportedData = useCallback((imported: TableData, label = 'Imported Sheet') => {
    commitTableChange(imported);
    setCurrentPresetLabel(label);
    showToast(`Imported ${imported.rows.length} rows × ${imported.headers.length} columns!`);
  }, [commitTableChange, showToast]);

  const handleImportFile = useCallback((content: string, filename: string) => {
    try {
      const parsed = parseSpreadsheetText(content);
      if (parsed) {
        handleApplyImportedData(parsed, filename.slice(0, 18));
      } else {
        showToast('Could not parse file structure. Check the file format and try again.', 'error');
      }
    } catch (error) {
      console.error(`Could not parse imported file "${filename}":`, error);
      showToast('An unexpected error occurred while parsing the file.', 'error');
    }
  }, [handleApplyImportedData, showToast]);

  // Universal Global Clipboard & Paste Engine
  useEffect(() => {
    const handleGlobalPaste = (e: ClipboardEvent) => {
      const activeEl = document.activeElement;
      // If user is focused on the manual paste textarea or modal, don't hijack
      if (activeEl?.id === 'modalTextInput') return;

      const clipboardText = e.clipboardData?.getData('text');
      if (!clipboardText || !clipboardText.trim()) return;

      // Check if it looks like a spreadsheet (tab separated, comma separated, or markdown table)
      try {
        const parsed = parseSpreadsheetText(clipboardText);
        if (parsed && (parsed.headers.length > 1 || parsed.rows.length > 1)) {
          // Prevent default only if we parsed multi-cell spreadsheet data
          e.preventDefault();
          handleApplyImportedData(parsed, 'Pasted Spreadsheet');
        }
      } catch (error) {
        console.error('Could not parse pasted spreadsheet data:', error);
        showToast('An unexpected error occurred while parsing pasted data.', 'error');
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, [handleApplyImportedData, showToast]);

  // Global Keyboard Shortcuts (⌘C to copy markdown, ⌘Z for undo, ⌘Y for redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';

      // ⌘Z / ⌘Y
      if (isCmdOrCtrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if (!isInput) {
          e.preventDefault();
          handleUndo();
        }
      } else if (
        (isCmdOrCtrl && e.key.toLowerCase() === 'y') ||
        (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        if (!isInput) {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Calculate live token statistics
  const tokenStats = calculateTokenStats(table, options);

  return (
    <div className="bg-[#0c0c0e] text-zinc-100 font-sans antialiased min-h-screen flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 1. Global Navigation Bar */}
      <Navbar
        onOpenConverter={() => setIsFeedbackOpen(false)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenSecurity={() => setIsSecurityOpen(true)}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      {/* 2. Main Workbench Content */}
      <main className="flex-1 flex flex-col justify-start w-full">
        {/* Ribbon & Settings Bar */}
        <Toolbar
          currentPresetLabel={currentPresetLabel}
          onSelectPreset={handleSelectPreset}
          onImportFile={handleImportFile}
          onImportError={(message) => showToast(message, 'error')}
          onClearGrid={handleClearGrid}
          format={format}
          onChangeFormat={setFormat}
          options={options}
          onChangeOptions={setOptions}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />

        {/* Split Pane: Left Editor, Right Live Output */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full flex-1">
            {/* LEFT COLUMN: Interactive Spreadsheet Grid */}
            <GridEditor
              table={table}
              onUpdateHeader={handleUpdateHeader}
              onUpdateCell={handleUpdateCell}
              onCycleAlignment={handleCycleAlignment}
              onAddColumn={handleAddColumn}
              onDeleteColumn={handleDeleteColumn}
              onAddRow={handleAddRow}
              onDeleteRow={handleDeleteRow}
              onAutoAlignAll={handleAutoAlignAll}
              onOpenManualPaste={() => setIsManualPasteOpen(true)}
            />

            {/* RIGHT COLUMN: Live Markdown Output & Preview */}
            <OutputPane
              table={table}
              format={format}
              options={options}
              tokenStats={tokenStats}
              onCopySuccess={(msg, type = 'success') => showToast(msg, type)}
            />
          </div>
        </div>

        {/* 3. Bottom Bar: LLM Token Efficiency & Privacy Guarantee */}
        <TokenSavingsBar
          stats={tokenStats}
          compactMode={options.compactMode}
          onToggleCompact={() => {
            const nextMode = !options.compactMode;
            setOptions((prev) => ({ ...prev, compactMode: nextMode }));
            if (nextMode && format === 'gfm') {
              setFormat('compact');
            } else if (!nextMode && format === 'compact') {
              setFormat('gfm');
            }
          }}
        />
      </main>

      {/* 4. Global Footer with Keyboard Shortcuts */}
      <footer className="border-t border-zinc-800/60 py-3 text-center text-zinc-500 text-xs bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Shortcuts:{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-300 border border-zinc-700/60 text-[11px]">
              ⌘+C
            </kbd>{' '}
            Copy Markdown ·{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-300 border border-zinc-700/60 text-[11px]">
              ⌘+V
            </kbd>{' '}
            Fast Paste ·{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-300 border border-zinc-700/60 text-[11px]">
              Tab
            </kbd>{' '}
            Cell Nav ·{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono text-zinc-300 border border-zinc-700/60 text-[11px]">
              Enter
            </kbd>{' '}
            Next Row
          </span>
          <span>table2MD Studio · 100% Client-Side Open Source MIT</span>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <ManualPasteModal
        isOpen={isManualPasteOpen}
        onClose={() => setIsManualPasteOpen(false)}
        onApplyData={(data) => handleApplyImportedData(data, 'Manual Input')}
      />

      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      <SecurityModal isOpen={isSecurityOpen} onClose={() => setIsSecurityOpen(false)} />

      <FeedbackPage
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onToast={showToast}
      />

      {/* Toast */}
      <Toast toast={toast} />
    </div>
  );
}
