export type Alignment = 'left' | 'center' | 'right';

export type ExportFormat = 'gfm' | 'compact' | 'html' | 'json' | 'csv' | 'latex';

export interface TableData {
  headers: string[];
  alignments: Alignment[];
  rows: string[][];
}

export interface FormattingOptions {
  firstRowIsHeader: boolean;
  escapePipes: boolean;
  compactMode: boolean;
  multilineMode: 'br' | 'space';
}

export interface Preset {
  id: string;
  label: string;
  badge?: string;
  category: 'benchmark' | 'saas' | 'tech' | 'product';
  description: string;
  headers: string[];
  alignments: Alignment[];
  rows: string[][];
}

export interface ToastInfo {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export interface TokenStats {
  byteSize: number;
  kbSize: string;
  tokensCurrent: number;
  tokensStandard: number;
  tokensCompact: number;
  savingsPercentage: number;
}
