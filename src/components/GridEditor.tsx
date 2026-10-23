import React, { useRef } from 'react';
import {
  Table as TableIcon,
  Plus,
  Info,
  Trash2,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  SlidersHorizontal,
  FileSpreadsheet,
  Columns3,
  ListPlus,
} from 'lucide-react';
import { Alignment, TableData } from '../types';

interface GridEditorProps {
  table: TableData;
  onUpdateHeader: (colIdx: number, value: string) => void;
  onUpdateCell: (rowIdx: number, colIdx: number, value: string) => void;
  onCycleAlignment: (colIdx: number) => void;
  onAddColumn: () => void;
  onDeleteColumn: (colIdx: number) => void;
  onAddRow: () => void;
  onDeleteRow: (rowIdx: number) => void;
  onAutoAlignAll: () => void;
  onOpenManualPaste: () => void;
}

export const GridEditor: React.FC<GridEditorProps> = ({
  table,
  onUpdateHeader,
  onUpdateCell,
  onCycleAlignment,
  onAddColumn,
  onDeleteColumn,
  onAddRow,
  onDeleteRow,
  onAutoAlignAll,
  onOpenManualPaste,
}) => {
  const { headers, alignments, rows } = table;
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const getCellKey = (r: number, c: number) => `${r}-${c}`;

  const handleCellKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIdx: number,
    colIdx: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (rowIdx + 1 < rows.length) {
        const nextInput = inputRefs.current.get(getCellKey(rowIdx + 1, colIdx));
        nextInput?.focus();
        nextInput?.select();
      } else {
        // At the last row, add new row and focus new cell
        onAddRow();
        setTimeout(() => {
          const nextInput = inputRefs.current.get(getCellKey(rowIdx + 1, colIdx));
          nextInput?.focus();
          nextInput?.select();
        }, 50);
      }
    } else if (e.key === 'ArrowDown') {
      if (rowIdx + 1 < rows.length) {
        e.preventDefault();
        const nextInput = inputRefs.current.get(getCellKey(rowIdx + 1, colIdx));
        nextInput?.focus();
      }
    } else if (e.key === 'ArrowUp') {
      if (rowIdx > 0) {
        e.preventDefault();
        const prevInput = inputRefs.current.get(getCellKey(rowIdx - 1, colIdx));
        prevInput?.focus();
      }
    }
  };

  const getAlignIcon = (align: Alignment) => {
    switch (align) {
      case 'center':
        return <AlignCenter className="w-3 h-3 text-indigo-400" />;
      case 'right':
        return <AlignRight className="w-3 h-3 text-indigo-400" />;
      default:
        return <AlignLeft className="w-3 h-3 text-zinc-400" />;
    }
  };

  const getAlignClass = (align: Alignment) => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col h-[680px] shadow-2xl relative">
      {/* Editor Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-zinc-100 font-display font-medium text-sm">
            <TableIcon className="w-4 h-4 text-indigo-400" />
            <span>Interactive Grid Editor</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700/60 font-mono text-[11px] text-zinc-400">
            {rows.length} rows × {headers.length} cols
          </span>
        </div>

        {/* Quick buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onAddColumn}
            className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 text-xs rounded-md border border-zinc-700/60 transition-colors font-medium"
          >
            <Plus className="w-3 h-3 text-indigo-400" />
            <span>Col</span>
          </button>
          <button
            type="button"
            onClick={onAddRow}
            className="flex items-center gap-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 text-xs rounded-md border border-zinc-700/60 transition-colors font-medium"
          >
            <Plus className="w-3 h-3 text-indigo-400" />
            <span>Row</span>
          </button>

          {/* Info Popover on hover */}
          <div className="relative group ml-1">
            <button
              type="button"
              className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            <div className="absolute right-0 top-7 w-64 p-3 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-300 text-[11px] shadow-2xl hidden group-hover:block z-30 pointer-events-none">
              <div className="font-semibold text-zinc-100 mb-1 flex items-center gap-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Spreadsheet Paste</span>
              </div>
              Press <kbd className="px-1 bg-zinc-800 rounded text-zinc-200 font-mono">⌘V</kbd> or{' '}
              <kbd className="px-1 bg-zinc-800 rounded text-zinc-200 font-mono">Ctrl+V</kbd> anywhere
              to paste Excel cells, Google Sheets, or CSV data.
            </div>
          </div>
        </div>
      </div>

      {/* Instruction & Auto-Align Sub-bar */}
      <div className="py-2 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <span className="flex items-center gap-1.5 truncate mr-2">
          <span>Click any cell to edit. Tab moves across, Enter down.</span>
        </span>
        <button
          type="button"
          onClick={onAutoAlignAll}
          className="text-indigo-400 hover:text-indigo-300 transition-colors underline font-medium flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>Auto-Align Columns</span>
        </button>
      </div>

      {/* Scrollable Table Matrix */}
      <div className="overflow-auto flex-1 border border-zinc-800/80 rounded-lg bg-zinc-950/60 relative">
        <table className="w-full border-collapse text-xs select-none">
          {/* Header Row */}
          <thead className="sticky top-0 z-20 bg-zinc-900 border-b border-zinc-800 shadow-sm">
            <tr>
              <th className="w-10 px-2 py-2 text-center text-zinc-500 font-mono text-[11px] font-normal bg-zinc-900 border-r border-zinc-800/60 select-none">
                #
              </th>
              {headers.map((header, colIdx) => {
                const align = alignments[colIdx] || 'left';
                return (
                  <th
                    key={colIdx}
                    className="px-2 py-1.5 bg-zinc-900 border-r border-zinc-800/60 last:border-r-0 group min-w-[120px]"
                  >
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => onUpdateHeader(colIdx, e.target.value)}
                        className={`w-full bg-transparent border-0 focus:bg-zinc-800 focus:outline-none rounded px-1.5 py-0.5 text-zinc-100 font-semibold text-xs transition-colors ${getAlignClass(
                          align
                        )}`}
                        placeholder={`Col ${colIdx + 1}`}
                      />

                      {/* Header controls: Cycle alignment and delete column */}
                      <div className="flex items-center opacity-40 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => onCycleAlignment(colIdx)}
                          title={`Cycle Alignment (${align})`}
                          className="p-1 hover:bg-zinc-800 rounded text-zinc-300 hover:text-indigo-400 transition-colors"
                        >
                          {getAlignIcon(align)}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteColumn(colIdx)}
                          title="Delete Column"
                          className="p-1 hover:bg-red-500/20 rounded text-zinc-400 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Body Data Rows */}
          <tbody className="divide-y divide-zinc-800/50">
            {rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="group hover:bg-zinc-900/40 border-b border-zinc-800/40 last:border-b-0 transition-colors"
              >
                {/* Row Index with Hover Delete */}
                <td className="w-10 px-2 py-1 text-center font-mono text-[11px] text-zinc-500 bg-zinc-950/40 select-none border-r border-zinc-800/60">
                  <div className="relative flex items-center justify-center">
                    <span className="group-hover:hidden">{rowIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => onDeleteRow(rowIdx)}
                      title="Delete Row"
                      className="hidden group-hover:flex items-center justify-center text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>

                {/* Cells */}
                {row.map((cell, colIdx) => {
                  const align = alignments[colIdx] || 'left';
                  const cellKey = getCellKey(rowIdx, colIdx);

                  return (
                    <td
                      key={colIdx}
                      className="p-1 border-r border-zinc-800/60 last:border-r-0 min-w-[120px]"
                    >
                      <input
                        ref={(el) => {
                          if (el) inputRefs.current.set(cellKey, el);
                          else inputRefs.current.delete(cellKey);
                        }}
                        type="text"
                        value={cell}
                        onChange={(e) => onUpdateCell(rowIdx, colIdx, e.target.value)}
                        onKeyDown={(e) => handleCellKeyDown(e, rowIdx, colIdx)}
                        className={`w-full bg-transparent hover:bg-zinc-900/60 focus:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 px-2 py-1 rounded text-zinc-200 text-xs font-mono transition-colors ${getAlignClass(
                          align
                        )}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Quick Action Bar */}
      <div className="pt-3 mt-1 flex items-center justify-between gap-2 border-t border-zinc-800/70">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddRow}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/40 transition-colors"
          >
            <ListPlus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ Add Row at End</span>
          </button>
          <button
            type="button"
            onClick={onAddColumn}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800/70 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/40 transition-colors"
          >
            <Columns3 className="w-3.5 h-3.5 text-indigo-400" />
            <span>+ Add Column</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onOpenManualPaste}
          className="text-xs font-medium text-zinc-400 hover:text-zinc-200 flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700/50"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
          <span>Manual Input Dialog</span>
        </button>
      </div>
    </div>
  );
};
