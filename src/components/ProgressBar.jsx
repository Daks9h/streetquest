import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 1,
  label = '',
  showLabel = true,
  className = '',
}) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-[#1F2A22]/70 mb-1.5 font-mono">
          <span>{label || `${value} of ${max}`}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        className="w-full h-2 bg-[#E6DCC8] rounded-full overflow-hidden border border-[#8B6B4A]/20"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div
          className="h-full bg-[#2F5D3A] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
