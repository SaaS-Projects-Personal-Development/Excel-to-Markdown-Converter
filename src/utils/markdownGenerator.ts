import { Alignment, ExportFormat, FormattingOptions, TableData, TokenStats } from '../types';

/**
 * Format cell content according to user options
 */
export function formatCellValue(value: string, options: FormattingOptions): string {
  let text = value ?? '';

  // Handle multiline
  if (options.multilineMode === 'br') {
    text = text.replace(/\r?\n/g, '<br>');
  } else {
    text = text.replace(/\r?\n/g, ' ');
  }

  // Escape pipe characters
  if (options.escapePipes) {
    text = text.replace(/\|/g, '\\|');
  }

  return text;
}

/**
 * Pad a string to target length with alignment
 */
function padString(str: string, targetLen: number, alignment: Alignment): string {
  const diff = targetLen - str.length;
  if (diff <= 0) return str;

  if (alignment === 'right') {
    return ' '.repeat(diff) + str;
  }
  if (alignment === 'center') {
    const leftPad = Math.floor(diff / 2);
    const rightPad = diff - leftPad;
    return ' '.repeat(leftPad) + str + ' '.repeat(rightPad);
  }
  return str + ' '.repeat(diff);
}

/**
 * Generate GFM or Compact Markdown Table
 */
export function generateMarkdown(table: TableData, options: FormattingOptions): string {
  const { headers, alignments, rows } = table;
  const isCompact = options.compactMode;
  const hasHeader = options.firstRowIsHeader;

  const formattedHeaders = headers.map((h) => formatCellValue(h, options));
  const formattedRows = rows.map((r) => r.map((c) => formatCellValue(c, options)));

  // Calculate maximum column widths for alignment padding
  const colWidths = headers.map((_, colIdx) => {
    let max = hasHeader ? (formattedHeaders[colIdx] || '').length : 0;
    for (const row of formattedRows) {
      const len = (row[colIdx] || '').length;
      if (len > max) max = len;
    }
    return Math.max(max, 3);
  });

  const lines: string[] = [];

  // Header line
  if (hasHeader) {
    const headerLineCells = headers.map((_, i) => {
      const val = formattedHeaders[i] || '';
      return isCompact ? val : ` ${padString(val, colWidths[i], alignments[i] || 'left')} `;
    });
    lines.push(`|${headerLineCells.join('|')}|`);

    // Separator line
    const sepCells = headers.map((_, i) => {
      const align = alignments[i] || 'left';
      const width = colWidths[i];

      if (isCompact) {
        if (align === 'center') return ':-:';
        if (align === 'right') return '--:';
        return ':--';
      }

      if (align === 'center') {
        const dashes = Math.max(width - 2, 1);
        return ` :${'-'.repeat(dashes)}: `;
      }
      if (align === 'right') {
        const dashes = Math.max(width - 1, 2);
        return ` ${'-'.repeat(dashes)}: `;
      }
      const dashes = Math.max(width - 1, 2);
      return ` :${'-'.repeat(dashes)} `;
    });
    lines.push(`|${sepCells.join('|')}|`);
  }

  // Data rows
  for (const row of formattedRows) {
    const rowCells = headers.map((_, i) => {
      const val = row[i] || '';
      return isCompact ? val : ` ${padString(val, colWidths[i], alignments[i] || 'left')} `;
    });
    lines.push(`|${rowCells.join('|')}|`);
  }

  return lines.join('\n');
}

/**
 * Generate semantic HTML table
 */
export function generateHtmlTable(table: TableData, options: FormattingOptions): string {
  const { headers, alignments, rows } = table;
  const hasHeader = options.firstRowIsHeader;

  let html = `<table class="tabular-table">\n`;

  if (hasHeader) {
    html += `  <thead>\n    <tr>\n`;
    headers.forEach((h, i) => {
      const align = alignments[i] ? ` align="${alignments[i]}"` : '';
      html += `      <th${align}>${escapeHtml(formatCellValue(h, options))}</th>\n`;
    });
    html += `    </tr>\n  </thead>\n`;
  }

  html += `  <tbody>\n`;
  rows.forEach((r) => {
    html += `    <tr>\n`;
    headers.forEach((_, i) => {
      const align = alignments[i] ? ` align="${alignments[i]}"` : '';
      html += `      <td${align}>${escapeHtml(formatCellValue(r[i] || '', options))}</td>\n`;
    });
    html += `    </tr>\n`;
  });
  html += `  </tbody>\n</table>`;

  return html;
}

/**
 * Generate JSON structure
 */
export function generateJson(table: TableData): string {
  const { headers, rows } = table;
  const list = rows.map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      const key = h.trim() || `column_${i + 1}`;
      obj[key] = r[i] || '';
    });
    return obj;
  });
  return JSON.stringify(list, null, 2);
}

/**
 * Generate CSV / TSV string
 */
export function generateCsv(table: TableData, delimiter: ',' | '\t' = ','): string {
  const { headers, rows } = table;
  const allRows = [headers, ...rows];

  return allRows
    .map((row) =>
      row
        .map((cell) => {
          const val = cell || '';
          if (val.includes(delimiter) || val.includes('"') || val.includes('\n')) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        })
        .join(delimiter)
    )
    .join('\n');
}

/**
 * Generate LaTeX tabular code
 */
export function generateLatex(table: TableData): string {
  const { headers, alignments, rows } = table;
  const colSpecs = alignments.map((a) => (a === 'center' ? 'c' : a === 'right' ? 'r' : 'l')).join(' ');

  let latex = `\\begin{table}[h]\n\\centering\n\\begin{tabular}{${colSpecs}}\n\\hline\n`;
  latex += headers.map((h) => escapeLatex(h)).join(' & ') + ' \\\\\n\\hline\n';

  for (const row of rows) {
    latex += headers.map((_, i) => escapeLatex(row[i] || '')).join(' & ') + ' \\\\\n';
  }

  latex += `\\hline\n\\end{tabular}\n\\end{table}`;
  return latex;
}

/**
 * Generate AI prompt template with embedded markdown table
 */
export function generatePromptTemplate(markdown: string): string {
  return `You are an expert data analyst. Below is the reference tabular dataset:

\`\`\`markdown
${markdown}
\`\`\`

Task Instructions:
1. Carefully analyze the table above.
2. Provide a clear summary of key patterns, outliers, and takeaways.
3. Address any requested calculations or comparisons based on this data.`;
}

/**
 * Calculate token and byte statistics
 */
export function calculateTokenStats(table: TableData, options: FormattingOptions): TokenStats {
  const standardMd = generateMarkdown(table, { ...options, compactMode: false });
  const compactMd = generateMarkdown(table, { ...options, compactMode: true });

  const currentMd = options.compactMode ? compactMd : standardMd;
  const byteSize = new Blob([currentMd]).size;
  const kbSize = (byteSize / 1024).toFixed(1);

  // Token heuristic: ~3.75 chars per token for typical code/markdown tables
  const tokensStandard = Math.max(1, Math.ceil(standardMd.length / 3.75));
  const tokensCompact = Math.max(1, Math.ceil(compactMd.length / 3.75));
  const tokensCurrent = options.compactMode ? tokensCompact : tokensStandard;

  const rawDiff = tokensStandard - tokensCompact;
  const savingsPercentage = tokensStandard > 0 ? Math.max(0, Math.round((rawDiff / tokensStandard) * 100)) : 0;

  return {
    byteSize,
    kbSize,
    tokensCurrent,
    tokensStandard,
    tokensCompact,
    savingsPercentage,
  };
}

/**
 * Universal export dispatcher
 */
export function generateExportContent(
  table: TableData,
  format: ExportFormat,
  options: FormattingOptions
): string {
  switch (format) {
    case 'gfm':
      return generateMarkdown(table, { ...options, compactMode: false });
    case 'compact':
      return generateMarkdown(table, { ...options, compactMode: true });
    case 'html':
      return generateHtmlTable(table, options);
    case 'json':
      return generateJson(table);
    case 'csv':
      return generateCsv(table, ',');
    case 'latex':
      return generateLatex(table);
    default:
      return generateMarkdown(table, options);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeLatex(str: string): string {
  return str
    .replace(/\\/g, '\\textbackslash ')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde ')
    .replace(/\^/g, '\\textasciicircum ');
}
