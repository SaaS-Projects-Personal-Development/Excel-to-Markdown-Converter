import React, { useState } from 'react';
import {
  Copy,
  Check,
  Code2,
  Table as TableIcon,
  Download,
  Sparkles,
  FileCode,
} from 'lucide-react';
import { ExportFormat, FormattingOptions, TableData, TokenStats } from '../types';
import {
  generateExportContent,
  generateMarkdown,
  generatePromptTemplate,
} from '../utils/markdownGenerator';

interface OutputPaneProps {
  table: TableData;
  format: ExportFormat;
  options: FormattingOptions;
  tokenStats: TokenStats;
  onCopySuccess: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const OutputPane: React.FC<OutputPaneProps> = ({
  table,
  format,
  options,
  tokenStats,
  onCopySuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'raw'>('preview');
  const [copiedPrimary, setCopiedPrimary] = useState(false);

  const { headers, alignments, rows } = table;
  const rawOutput = generateExportContent(table, format, options);

  const handleCopyPrimary = async () => {
    try {
      await navigator.clipboard.writeText(rawOutput);
      setCopiedPrimary(true);
      onCopySuccess(
        format === 'gfm' || format === 'compact'
          ? 'Copied Markdown table to clipboard!'
          : `Copied ${format.toUpperCase()} to clipboard!`
      );
      setTimeout(() => setCopiedPrimary(false), 2000);
    } catch {
      onCopySuccess('Clipboard copy failed. Check browser permissions and try again.', 'error');
    }
  };

  const handleCopyHtml = async () => {
    const htmlCode = generateExportContent(table, 'html', options);
    try {
      await navigator.clipboard.writeText(htmlCode);
      onCopySuccess('Copied HTML <table> element!');
    } catch {
      onCopySuccess('Clipboard copy failed. Check browser permissions and try again.', 'error');
    }
  };

  const handleCopyPromptTemplate = async () => {
    const md = generateMarkdown(table, options);
    const prompt = generatePromptTemplate(md);
    try {
      await navigator.clipboard.writeText(prompt);
      onCopySuccess('Copied AI prompt template with embedded table!');
    } catch {
      onCopySuccess('Clipboard copy failed. Check browser permissions and try again.', 'error');
    }
  };

  const handleDownload = () => {
    let extension = 'md';
    let mimeType = 'text/markdown';

    if (format === 'html') {
      extension = 'html';
      mimeType = 'text/html';
    } else if (format === 'json') {
      extension = 'json';
      mimeType = 'application/json';
    } else if (format === 'csv') {
      extension = 'csv';
      mimeType = 'text/csv';
    } else if (format === 'latex') {
      extension = 'tex';
      mimeType = 'text/plain';
    }

    let url: string | null = null;
    try {
      const blob = new Blob([rawOutput], { type: `${mimeType};charset=utf-8;` });
      const objectUrl = URL.createObjectURL(blob);
      url = objectUrl;
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `table-${Date.now()}.${extension}`;
      link.click();
      onCopySuccess(`Downloaded table.${extension}`);
    } catch {
      onCopySuccess('Could not download the table. Please try again.', 'error');
    } finally {
      if (url) {
        const objectUrl = url;
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      }
    }
  };

  const getFormatFilename = () => {
    switch (format) {
      case 'compact':
        return 'table.compact.md';
      case 'html':
        return 'table.html';
      case 'json':
        return 'table.json';
      case 'csv':
        return 'table.csv';
      case 'latex':
        return 'table.tex';
      default:
        return 'table.md';
    }
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 sm:p-5 flex flex-col h-[680px] shadow-2xl relative">
      {/* Header with View Tabs & Token Statistics */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-zinc-800/80 gap-2">
        {/* View Switcher Tabs */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Formatted Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('raw')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              activeTab === 'raw'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Raw Code</span>
          </button>
        </div>

        {/* Stats Badge */}
        <div className="ml-auto flex min-w-0 max-w-full items-center gap-1.5">
          <span className="max-w-full truncate rounded-md border border-zinc-700/60 bg-zinc-800/80 px-2.5 py-1 font-mono text-[11px] text-zinc-300">
            {tokenStats.kbSize} KB · {tokenStats.tokensCurrent} tokens ·{' '}
            {options.compactMode ? (
              <span className="font-semibold text-emerald-400">
                {tokenStats.savingsPercentage}% compact savings
              </span>
            ) : (
              <span className="text-zinc-400">0% compact savings (Standard Mode)</span>
            )}
          </span>
        </div>
      </div>

      {/* Main Viewport Content */}
      <div className="flex-1 overflow-auto my-3 rounded-lg border border-zinc-800 bg-zinc-950/80 relative">
        {activeTab === 'preview' ? (
          /* Formatted GitHub-style Table Preview */
          <div className="p-4 overflow-auto h-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border border-zinc-800 rounded-lg overflow-hidden border-collapse">
                {options.firstRowIsHeader && (
                  <thead className="bg-zinc-900/90 text-zinc-200 border-b border-zinc-800 font-semibold">
                    <tr>
                      {headers.map((h, i) => {
                        const align = alignments[i] || 'left';
                        const alignClass =
                          align === 'center'
                            ? 'text-center'
                            : align === 'right'
                            ? 'text-right'
                            : 'text-left';
                        return (
                          <th
                            key={i}
                            className={`px-3.5 py-2.5 ${alignClass} border-r border-zinc-800/60 last:border-r-0`}
                          >
                            {h || `Col ${i + 1}`}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                )}
                <tbody className="divide-y divide-zinc-800/60">
                  {rows.map((row, rowIdx) => {
                    const zebra = rowIdx % 2 === 1 ? 'bg-zinc-900/30' : 'bg-zinc-950/20';
                    return (
                      <tr key={rowIdx} className={`${zebra} hover:bg-zinc-900/70 transition-colors`}>
                        {row.map((cell, colIdx) => {
                          const align = alignments[colIdx] || 'left';
                          const alignClass =
                            align === 'center'
                              ? 'text-center'
                              : align === 'right'
                              ? 'text-right'
                              : 'text-left';
                          return (
                            <td
                              key={colIdx}
                              className={`px-3.5 py-2 ${alignClass} text-zinc-300 font-mono text-[11px] border-r border-zinc-800/40 last:border-r-0`}
                            >
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Raw Monospace Code Viewer */
          <div className="h-full flex flex-col p-3">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] font-mono text-zinc-400">
              <div className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>{getFormatFilename()}</span>
              </div>
              <span className="text-indigo-400 font-mono text-[10px]">
                {format.toUpperCase()} compliant
              </span>
            </div>
            <textarea
              readOnly
              value={rawOutput}
              spellCheck={false}
              className="w-full flex-1 bg-transparent text-zinc-200 font-mono text-xs leading-relaxed resize-none focus:outline-none select-all selection:bg-indigo-500/30"
            />
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2.5">
        {/* Big Primary Copy Button */}
        <button
          type="button"
          onClick={handleCopyPrimary}
          className={`flex-1 min-w-[200px] py-2 px-4 rounded-lg font-medium text-xs shadow-lg flex items-center justify-center gap-2 transition-all duration-200 ${
            copiedPrimary
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
          }`}
        >
          {copiedPrimary ? (
            <>
              <Check className="w-4 h-4 animate-in zoom-in-50 duration-200" />
              <span>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy {format === 'gfm' || format === 'compact' ? 'Markdown' : format.toUpperCase()} (⌘C)</span>
            </>
          )}
        </button>

        {/* Secondary Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyHtml}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Copy HTML</span>
          </button>

          <button
            type="button"
            onClick={handleCopyPromptTemplate}
            title="Wrap table in an optimized prompt for ChatGPT or Claude"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Prompt Template</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            title={`Download .${format === 'html' ? 'html' : format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'md'} file`}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-200 text-xs font-medium border border-zinc-700/60 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
