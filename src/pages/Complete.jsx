import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiAward, FiArrowLeft, FiRotateCcw } from 'react-icons/fi';
import { getRankTitle } from '../data/missions';

export default function Complete({ progress, onResetProgress }) {
  const navigate = useNavigate();
  const points = progress.totalPoints || 0;
  const rank = getRankTitle(points);

  const handlePlayAgain = () => {
    const confirmed = window.confirm('Start over and play again? This will reset recorded points.');
    if (confirmed) {
      onResetProgress();
      navigate('/levels');
    }
  };

  return (
    <main className="w-full max-w-[960px] mx-auto px-5 sm:px-8 py-8 md:py-14 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl bg-[#E6DCC8]/30 border border-[#8B6B4A]/25 p-7 sm:p-10 flex flex-col items-center text-center space-y-6">
        {/* Subtle tag kicker */}
        <span className="text-[10px] font-mono tracking-widest text-[#8B6B4A] uppercase bg-[#E6DCC8]/80 px-3 py-1 rounded-full border border-[#8B6B4A]/25">
          Field Log Certified
        </span>

        {/* Large calm line icon (no confetti) */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E6DCC8]/70 border border-[#8B6B4A]/30 flex items-center justify-center text-[#2F5D3A]">
          <FiAward className="w-10 h-10 sm:w-12 sm:h-12" aria-hidden="true" />
        </div>

        <div className="space-y-1.5">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2F5D3A] tracking-tight">
            Quest complete
          </h1>
          <p className="text-xs sm:text-sm text-[#1F2A22]/70 font-normal">
            All nine field landmarks recorded.
          </p>
        </div>

        {/* Points & Rank card */}
        <div className="w-full max-w-md rounded-2xl bg-[#F6F1E7] border border-[#8B6B4A]/25 p-4 sm:p-5 grid grid-cols-2 gap-4 text-center">
          <div className="border-r border-[#8B6B4A]/20 pr-2">
            <span className="block text-[10px] font-mono uppercase text-[#8B6B4A]">
              Total points
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1F2A22]">
              {points} pts
            </span>
          </div>
          <div className="pl-2">
            <span className="block text-[10px] font-mono uppercase text-[#8B6B4A]">
              Highest rank
            </span>
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#2F5D3A]">
              {rank}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-md pt-2 space-y-3">
          <button
            type="button"
            onClick={handlePlayAgain}
            className="w-full h-12 bg-[#2F5D3A] hover:bg-[#1F4029] text-[#F6F1E7] font-medium text-sm rounded-xl transition-all shadow-none flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
          >
            <FiRotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Play again</span>
          </button>

          <div>
            <Link
              to="/levels"
              className="text-xs text-[#8B6B4A] hover:text-[#1F2A22] transition-colors inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2F5D3A] rounded px-1"
            >
              <FiArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Back to Levels</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
