import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { ToastInfo } from '../types';

interface ToastProps {
  toast: ToastInfo | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-zinc-900 border border-zinc-700/80 text-zinc-100 shadow-2xl text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200">
      {isError ? (
        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
      ) : isInfo ? (
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      )}
      <span>{toast.message}</span>
    </div>
  );
};
