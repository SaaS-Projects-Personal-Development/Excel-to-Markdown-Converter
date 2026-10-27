import React, { useEffect, useRef, useState } from 'react';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { LoaderCircle, MessageSquare, Send, X } from 'lucide-react';

interface FeedbackPageProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ isOpen, onClose, onToast }) => {
  const [userName, setUserName] = useState('');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setIsSuccess(false);
        setError(null);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, isOpen, onClose]);

  useEffect(() => () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  }, []);

  const handleClose = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userName.trim() || !feedbackTitle.trim()) {
      setError('Please enter your name and a title.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      await emailjs.send(
        'service_uaq489w',
        'template_4q2k1rh',
        {
          from_name: userName.trim(),
          message: feedbackText.trim(),
          from_email: userEmail.trim() || 'Anonymous',
          title: feedbackTitle.trim(),
          app_name: 'Sheet2MD',
        },
        { publicKey: 'UvFbiQx_ujJVcBjXu' },
      );

      setIsSuccess(true);
      setUserName('');
      setFeedbackTitle('');
      setFeedbackText('');
      setUserEmail('');
      onToast('Feedback sent successfully.', 'success');
      closeTimeoutRef.current = setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      const response = err instanceof EmailJSResponseStatus ? err : null;
      if (response) {
        console.error('EmailJS request failed:', response.status, response.text);
      } else {
        console.error('Unexpected EmailJS error:', err);
      }

      const message = response?.status === 422 && /recipients address is empty/i.test(response.text)
        ? 'EmailJS has no recipient configured. Set your Gmail address in the template’s To Email field.'
        : 'Failed to send feedback. Please try again.';
      setError(message);
      onToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        className="relative z-10 w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
              <MessageSquare className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <h2 id="feedback-modal-title" className="text-base font-semibold text-zinc-100">
                Send feedback
              </h2>
              <p className="mt-0.5 text-xs text-zinc-400">Your message helps improve Sheet2MD.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            aria-label="Close feedback dialog"
            className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="feedback-name" className="mb-2 block text-sm font-medium text-zinc-200">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="feedback-name"
              type="text"
              required
              maxLength={100}
              value={userName}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="Your name"
              disabled={isLoading || isSuccess}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="feedback-email" className="mb-2 block text-sm font-medium text-zinc-200">
              Email <span className="font-normal text-zinc-500">(optional)</span>
            </label>
            <input
              id="feedback-email"
              type="email"
              maxLength={254}
              value={userEmail}
              onChange={(event) => setUserEmail(event.target.value)}
              placeholder="your@email.com (optional)"
              disabled={isLoading || isSuccess}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="feedback-title" className="mb-2 block text-sm font-medium text-zinc-200">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="feedback-title"
              type="text"
              required
              maxLength={200}
              value={feedbackTitle}
              onChange={(event) => setFeedbackTitle(event.target.value)}
              placeholder="Feedback title"
              disabled={isLoading || isSuccess}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/70 px-3.5 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="feedback-message" className="mb-2 block text-sm font-medium text-zinc-200">
              Your feedback <span className="text-red-400">*</span>
            </label>
            <textarea
              id="feedback-message"
              required
              rows={6}
              maxLength={5000}
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value)}
              placeholder="Found a bug or have a feature request? Let me know..."
              disabled={isLoading || isSuccess}
              className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950/70 px-3.5 py-3 text-sm leading-6 text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/15 disabled:opacity-60"
            />
          </div>

          {isSuccess && (
            <p role="status" className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              Thanks! Your feedback has been sent.
            </p>
          )}
          {error && (
            <p role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}

          <div className="flex justify-end border-t border-zinc-800 pt-4">
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
