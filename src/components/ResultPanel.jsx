import React from 'react';
import { FiCheckCircle, FiXCircle, FiHelpCircle, FiArrowRight, FiRefreshCw } from 'react-icons/fi';

export default function ResultPanel({
  verdict,
  reason = '',
  points = 10,
  onNextMission,
  onTryAgain,
  nextButtonLabel = 'Next mission',
}) {
  if (!verdict) return null;

  if (verdict === 'match') {
    return (
      <div className="w-full rounded-2xl bg-[#E6DCC8]/60 border border-[#2F5D3A]/40 p-6 flex flex-col items-center text-center space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-[#2F5D3A]/10 border border-[#2F5D3A]/30 flex items-center justify-center text-[#2F5D3A]">
          <FiCheckCircle className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <div className="inline-block px-3 py-1 rounded-full bg-[#2F5D3A] text-[#F6F1E7] text-xs font-mono font-semibold tracking-wide mb-1">
            +{points} points
          </div>
          <h3 className="font-serif text-2xl font-semibold text-[#2F5D3A]">
            Nice find
          </h3>
          <p className="text-sm text-[#1F2A22]/80 max-w-sm mx-auto">
            {reason || 'Target verified.'}
          </p>
        </div>

        <div className="w-full pt-2">
          <button
            type="button"
            onClick={onNextMission}
            className="w-full h-12 bg-[#2F5D3A] hover:bg-[#1F4029] text-[#F6F1E7] font-medium text-sm rounded-xl transition-all shadow-none flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
          >
            <span>{nextButtonLabel}</span>
            <FiArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  }

  if (verdict === 'no_match') {
    return (
      <div className="w-full rounded-2xl bg-[#E6DCC8]/50 border border-[#8B6B4A]/30 p-6 flex flex-col items-center text-center space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-[#8B6B4A]/10 border border-[#8B6B4A]/30 flex items-center justify-center text-[#8B6B4A]">
          <FiXCircle className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif text-2xl font-semibold text-[#1F2A22]">
            Not quite
          </h3>
          <p className="text-sm text-[#1F2A22]/80 max-w-sm mx-auto">
            {reason || 'The photo does not match the mission requirements.'}
          </p>
        </div>

        <div className="w-full pt-2">
          <button
            type="button"
            onClick={onTryAgain}
            className="w-full h-12 bg-[#2F5D3A] hover:bg-[#1F4029] text-[#F6F1E7] font-medium text-sm rounded-xl transition-all shadow-none flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
          >
            <FiRefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Try again</span>
          </button>
        </div>
      </div>
    );
  }

  if (verdict === 'unclear') {
    return (
      <div className="w-full rounded-2xl bg-[#E6DCC8]/50 border border-[#8B6B4A]/30 p-6 flex flex-col items-center text-center space-y-4 animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-[#8B6B4A]/10 border border-[#8B6B4A]/30 flex items-center justify-center text-[#8B6B4A]">
          <FiHelpCircle className="w-6 h-6" aria-hidden="true" />
        </div>

        <div className="space-y-1">
          <h3 className="font-serif text-2xl font-semibold text-[#1F2A22]">
            Try a closer, brighter photo
          </h3>
          <p className="text-sm text-[#1F2A22]/80 max-w-sm mx-auto">
            {reason || 'The image was too dark or blurry to confirm.'}
          </p>
        </div>

        <div className="w-full pt-2">
          <button
            type="button"
            onClick={onTryAgain}
            className="w-full h-12 bg-[#2F5D3A] hover:bg-[#1F4029] text-[#F6F1E7] font-medium text-sm rounded-xl transition-all shadow-none flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
          >
            <FiRefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Try again</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
}
