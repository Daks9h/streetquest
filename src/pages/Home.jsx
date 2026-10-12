import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BotanicalLeaf, BotanicalSmallEmblem } from '../components/BotanicalLeaf';

export default function Home({ onResetProgress }) {
  const navigate = useNavigate();

  const handleStartQuest = () => {
    navigate('/levels');
  };

  const handleResetClick = () => {
    const confirmed = window.confirm('Reset all progress? This will clear completed missions and points.');
    if (confirmed) {
      onResetProgress();
    }
  };

  return (
    <main className="w-full min-h-[calc(100vh-2rem)] flex flex-col justify-center items-center px-5 sm:px-8 py-8 md:py-16">
      {/* Mobile Layout (< 768px) */}
      <div className="w-full max-w-md flex flex-col justify-between md:hidden min-h-[500px]">
        {/* Top Header & Emblem */}
        <div className="space-y-6">
          <BotanicalSmallEmblem />

          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#2F5D3A]">
              StreetQuest
            </h1>
            <p className="text-sm text-[#1F2A22]/80 font-normal">
              Small missions. Real outdoors.
            </p>
          </div>

          {/* Quiet Field Note card from design */}
          <div className="rounded-xl bg-[#E6DCC8]/60 border border-[#8B6B4A]/25 p-4 space-y-2 mt-4">
            <div className="flex items-center justify-between text-[11px] tracking-wider uppercase text-[#8B6B4A] font-mono font-medium">
              <span>FIELD LOG</span>
              <span className="flex items-center gap-1.5 text-[#2F5D3A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F5D3A]" />
                Active Sector
              </span>
            </div>
            <div className="pt-1">
              <h2 className="font-serif text-sm font-semibold text-[#1F2A22]">
                District Perimeter
              </h2>
              <p className="text-xs text-[#1F2A22]/70 mt-0.5">
                Quiet outdoor landmarks to discover nearby.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-12 space-y-3">
          <button
            type="button"
            onClick={handleStartQuest}
            className="w-full h-12 bg-[#2F5D3A] hover:bg-[#1F4029] text-[#F6F1E7] font-medium text-sm rounded-xl transition-all shadow-none flex items-center justify-center cursor-pointer active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
          >
            Start Quest
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResetClick}
              className="text-[11px] text-[#8B6B4A] hover:text-[#1F2A22] underline underline-offset-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2F5D3A] rounded px-1"
            >
              Reset progress
            </button>
          </div>
        </div>
      </div>

      {/* Laptop Layout (>= 768px) */}
      <div className="w-full max-w-[960px] hidden md:grid grid-cols-2 gap-16 items-center">
        {/* Left Column: Heading, Tagline, Button, Reset */}
        <div className="flex flex-col items-start space-y-6 text-left">
          <div className="space-y-3">
            <h1 className="font-serif text-5xl font-semibold tracking-tight text-[#2F5D3A] leading-tight">
              StreetQuest
            </h1>
            <p className="text-base text-[#1F2A22]/80 font-normal">
              Small missions. Real outdoors.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="button"
              onClick={handleStartQuest}
              className="px-7 py-3 min-h-[48px] bg-[#2F5D3A] hover:bg-[#1F4029] text-[#F6F1E7] font-medium text-sm rounded-xl transition-all shadow-none inline-flex items-center justify-center cursor-pointer active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
            >
              Start Quest
            </button>

            <div>
              <button
                type="button"
                onClick={handleResetClick}
                className="text-[11px] text-[#8B6B4A] hover:text-[#1F2A22] underline underline-offset-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2F5D3A] rounded px-1 block"
              >
                Reset progress
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Botanical line-art leaf */}
        <div className="flex justify-end items-center">
          <BotanicalLeaf size={320} />
        </div>
      </div>
    </main>
  );
}
