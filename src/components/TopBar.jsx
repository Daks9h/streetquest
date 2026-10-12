import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCompass } from 'react-icons/fi';

export default function TopBar({ points = 0 }) {
  const location = useLocation();

  // Do not render top bar on Home screen
  if (location.pathname === '/') {
    return null;
  }

  const isLevels = location.pathname === '/levels';

  return (
    <header className="w-full bg-[#F6F1E7] border-b border-[#8B6B4A]/20 transition-colors z-20 px-5 md:px-8 py-3.5">
      <div className="max-w-[960px] mx-auto flex items-center justify-between">
        {/* Left: App name (link to Home) & Levels link */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="font-serif text-[18px] md:text-[20px] font-semibold text-[#2F5D3A] tracking-tight hover:opacity-85 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A] rounded"
          >
            StreetQuest
          </Link>

          <Link
            to="/levels"
            className={`text-sm tracking-normal transition-colors pb-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A] rounded ${
              isLevels
                ? 'text-[#2F5D3A] font-semibold border-b-2 border-[#2F5D3A]'
                : 'text-[#1F2A22]/70 hover:text-[#1F2A22]'
            }`}
          >
            Levels
          </Link>
        </div>

        {/* Right: Player points (small, quiet) */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#1F2A22]/85 bg-[#E6DCC8]/70 px-3 py-1 rounded-full border border-[#8B6B4A]/25 shadow-none">
          <FiCompass className="text-[#8B6B4A] text-sm" aria-hidden="true" />
          <span>{points} pts</span>
        </div>
      </div>
    </header>
  );
}
