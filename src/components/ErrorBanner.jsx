import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

export default function ErrorBanner({
  error,
  errorCode = '',
  onRetry,
  className = '',
}) {
  if (!error) return null;

  const isQuota =
    errorCode === 'QUOTA_EXCEEDED' ||
    (typeof error === 'string' && error.toLowerCase().includes('quota'));

  const isTimeout =
    errorCode === 'TIMEOUT' ||
    (typeof error === 'string' && error.toLowerCase().includes('time'));

  let message = typeof error === 'string' ? error : error?.message || 'Verification failed.';
  if (isQuota) {
    message = 'Daily check quota reached. Please try again later.';
  } else if (isTimeout) {
    message = 'Verification took too long. Please check your connection and retry.';
  }

  return (
    <div
      className={`rounded-xl bg-[#B5533C]/10 border border-[#B5533C]/30 p-4 text-[#B5533C] text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#B5533C]" aria-hidden="true" />
        <span className="font-normal text-xs sm:text-sm text-[#1F2A22]">
          {message}
        </span>
      </div>

      {/* Show Retry button unless quota exceeded */}
      {!isQuota && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#B5533C] hover:bg-[#9a4430] text-[#F6F1E7] text-xs font-medium transition-colors shrink-0 cursor-pointer self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B5533C]"
        >
          <FiRefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
