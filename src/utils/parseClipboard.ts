import { Alignment, TableData } from '../types';

/**
 * Intelligent clipboard and text parser supporting:
 * 1. TSV (Excel / Google Sheets / Numbers clipboard)
 * 2. Markdown tables (| col | col |) with alignment syntax extraction
 * 3. CSV with RFC-4180 quotes & multiline values
 * 4. Semicolon-separated values (European Excel exports)
 */
export function parseSpreadsheetText(raw: string): TableData | null {
  if (!raw || !raw.trim()) return null;

  const trimmed = raw.trim();

  // 1. Detect if it's a Markdown table
  if (isMarkdownTable(trimmed)) {
    const mdResult = parseMarkdownTable(trimmed);
    if (mdResult) return mdResult;
  }

  // 2. Detect separator (Tab vs Comma vs Semicolon)
  const separator = detectSeparator(trimmed);

  // 3. Parse grid based on separator
  const grid = separator === ',' ? parseCsvGrid(trimmed) : parseDelimitedGrid(trimmed, separator);

  if (!grid || grid.length === 0) return null;

  // Normalize column count
  const maxCols = Math.max(...grid.map((r) => r.length), 1);
  if (maxCols === 0) return null;

  const normalizedRows = grid.map((row) => {
    const r = [...row];
    while (r.length < maxCols) r.push('');
    return r;
  });

  // Extract header row
  const headers = normalizedRows[0].map((h, i) => (h.trim() ? h.trim() : `Col ${i + 1}`));
  const dataRows = normalizedRows.length > 1 ? normalizedRows.slice(1) : [new Array(maxCols).fill('')];

  // Infer alignments based on data types
  const alignments = headers.map((_, colIdx) => inferColumnAlignment(dataRows, colIdx));

  return {
    headers,
    alignments,
    rows: dataRows,
  };
}

/**
 * Checks if input text is a markdown table
 */
function isMarkdownTable(text: string): boolean {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return false;
  // Look for separator line e.g. |---| or |:---|
  const hasPipe = lines[0].includes('|');
  const hasSeparator = lines.some((line) => /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(line));
  return hasPipe && hasSeparator;
}

/**
 * Parses a markdown table into TableData
 */
function parseMarkdownTable(text: string): TableData | null {
  const rawLines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (rawLines.length < 2) return null;

  // Split line by pipe
  const splitPipes = (line: string): string[] => {
    let clean = line;
    if (clean.startsWith('|')) clean = clean.slice(1);
    if (clean.endsWith('|')) clean = clean.slice(0, -1);
    return clean.split('|').map((c) => c.trim().replace(/\\\|/g, '|'));
  };

  const headerLine = rawLines[0];
  const separatorIndex = rawLines.findIndex((line, i) => i > 0 && /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(line));

  if (separatorIndex === -1) return null;

  const headers = splitPipes(headerLine);
  const separatorCells = splitPipes(rawLines[separatorIndex]);

  const alignments: Alignment[] = headers.map((_, i) => {
    const sep = separatorCells[i] || '';
    const left = sep.startsWith(':');
    const right = sep.endsWith(':');
    if (left && right) return 'center';
    if (right) return 'right';
    return 'left';
  });

  const dataRows: string[][] = [];
  for (let i = separatorIndex + 1; i < rawLines.length; i++) {
    const cells = splitPipes(rawLines[i]);
    while (cells.length < headers.length) cells.push('');
    dataRows.push(cells.slice(0, headers.length));
  }

  return {
    headers,
    alignments,
    rows: dataRows.length ? dataRows : [new Array(headers.length).fill('')],
  };
}

/**
 * Detect delimiter: Tab, Comma, or Semicolon
 */
function detectSeparator(text: string): string {
  const firstLine = text.split(/\r?\n/)[0];
  if (firstLine.includes('\t')) return '\t';
  
  // Count occurrences in first few lines
  const sampleLines = text.split(/\r?\n/).slice(0, 5);
  let commaCount = 0;
  let semiCount = 0;
  let tabCount = 0;

  for (const line of sampleLines) {
    commaCount += (line.match(/,/g) || []).length;
    semiCount += (line.match(/;/g) || []).length;
    tabCount += (line.match(/\t/g) || []).length;
  }

  if (tabCount > 0) return '\t';
  if (semiCount > commaCount) return ';';
  return ',';
}

/**
 * Standard delimiter parser (tab or semicolon)
 */
function parseDelimitedGrid(text: string, sep: string): string[][] {
  const lines = text.split(/\r?\n/);
  const grid: string[][] = [];

  for (const line of lines) {
    if (!line.trim() && grid.length === 0) continue;
    grid.push(line.split(sep).map((cell) => cell.trim()));
  }

  // Remove trailing blank rows
  while (grid.length > 0 && grid[grid.length - 1].every((c) => c === '')) {
    grid.pop();
  }

  return grid;
}

/**
 * RFC-4180 compliant CSV parser that handles quotes and embedded newlines
 */
function parseCsvGrid(text: string): string[][] {
  const grid: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      currentCell = '';
      if (currentRow.some((c) => c.length > 0)) {
        grid.push(currentRow);
      }
      currentRow = [];
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      grid.push(currentRow);
    }
  }

  return grid;
}

/**
 * Automatically infers alignment based on cell content:
 * Numeric / currency / percent / metrics -> right
 * Checkmarks / symbols / short statuses -> center
 * Normal text -> left
 */
export function inferColumnAlignment(rows: string[][], colIdx: number): Alignment {
  let numCount = 0;
  let symbolCount = 0;
  let totalNonEmpty = 0;

  const numPattern = /^[\$€£¥₹]?\s*-?[\d,]+(\.\d+)?%?$/;
  const symbolPattern = /^([✓✔✗✕—\-•\+\*]|true|false|yes|no|none|n\/a)$/i;

  for (const row of rows) {
    const val = (row[colIdx] || '').trim();
    if (!val) continue;
    totalNonEmpty++;

    if (numPattern.test(val)) {
      numCount++;
    } else if (symbolPattern.test(val) || val.length <= 3) {
      symbolCount++;
    }
  }

  if (totalNonEmpty === 0) return 'left';
  if (numCount / totalNonEmpty >= 0.5) return 'right';
  if (symbolCount / totalNonEmpty >= 0.6) return 'center';
  return 'left';
}
