import React from 'react';

/**
 * Botanical Leaf line-art illustration matching the calm outdoor design
 */
export function BotanicalLeaf({ size = 320, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#8B6B4A]/60"
      >
        {/* Soft background glow */}
        <circle
          cx="160"
          cy="160"
          r="140"
          fill="#E6DCC8"
          fillOpacity="0.45"
        />

        {/* Outer botanical leaf perimeter */}
        <path
          d="M 160 35 C 235 75 270 175 225 245 C 195 285 160 295 160 295 C 160 295 125 285 95 245 C 50 175 85 75 160 35 Z"
          stroke="#8B6B4A"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Central stem / vein */}
        <path
          d="M 160 35 Q 160 160 160 295"
          stroke="#8B6B4A"
          strokeWidth="1.75"
          strokeLinecap="round"
        />

        {/* Lateral side veins - Left */}
        <path
          d="M 160 90 Q 130 100 115 120"
          stroke="#8B6B4A"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M 160 135 Q 120 150 100 175"
          stroke="#8B6B4A"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M 160 180 Q 125 200 110 225"
          stroke="#8B6B4A"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M 160 225 Q 135 245 130 265"
          stroke="#8B6B4A"
          strokeWidth="1.25"
          strokeLinecap="round"
        />

        {/* Lateral side veins - Right */}
        <path
          d="M 160 90 Q 190 100 205 120"
          stroke="#8B6B4A"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M 160 135 Q 200 150 220 175"
          stroke="#8B6B4A"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M 160 180 Q 195 200 210 225"
          stroke="#8B6B4A"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M 160 225 Q 185 245 190 265"
          stroke="#8B6B4A"
          strokeWidth="1.25"
          strokeLinecap="round"
        />

        {/* Subtle accent dots */}
        <circle cx="160" cy="35" r="3" fill="#2F5D3A" />
      </svg>
    </div>
  );
}

export function BotanicalSmallEmblem() {
  return (
    <div
      className="w-12 h-12 rounded-2xl bg-[#E6DCC8]/70 border border-[#8B6B4A]/30 flex items-center justify-center select-none pointer-events-none"
      aria-hidden="true"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2F5D3A"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </svg>
    </div>
  );
}
