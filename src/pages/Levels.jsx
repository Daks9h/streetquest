import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLock, FiCheck, FiChevronRight } from 'react-icons/fi';
import {
  MISSIONS,
  LEVELS,
  getRankTitle,
} from '../data/missions';
import {
  isLevelUnlocked,
  isMissionCompleted,
  getCompletedCountForLevel,
} from '../lib/storage';

export default function Levels({ progress }) {
  const navigate = useNavigate();
  const completed = progress.completed || {};
  const points = progress.totalPoints || 0;
  const currentRank = getRankTitle(points);

  const handleMissionClick = (missionId, isUnlocked) => {
    if (!isUnlocked) return;
    navigate(`/mission/${missionId}`);
  };

  return (
    <main className="w-full max-w-[960px] mx-auto px-5 sm:px-8 py-6 md:py-10">
      {/* Top Rank and points header */}
      <div className="flex items-center justify-between text-xs text-[#1F2A22]/80 mb-6">
        <div className="inline-flex items-center gap-2 bg-[#E6DCC8]/70 px-3.5 py-1.5 rounded-full border border-[#8B6B4A]/25 text-[12px] font-medium text-[#1F2A22]">
          <span className="w-2 h-2 rounded-full bg-[#2F5D3A]" aria-hidden="true" />
          <span>Rank: <strong className="text-[#2F5D3A]">{currentRank}</strong></span>
          <span className="text-[#8B6B4A]/60">·</span>
          <span className="font-mono">{points} points</span>
        </div>
        <span className="text-[11px] font-mono tracking-wider text-[#8B6B4A] uppercase">
          FIELD LOG
        </span>
      </div>

      <div className="mb-6">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-[#2F5D3A] tracking-tight">
          Field Levels
        </h1>
        <p className="text-xs sm:text-sm text-[#1F2A22]/70 mt-1">
          Complete missions to unlock further outdoor tiers.
        </p>
      </div>

      {/* Level Rows */}
      <div className="space-y-4">
        {LEVELS.map((level) => {
          const unlocked = isLevelUnlocked(level.id, completed);
          const foundCount = getCompletedCountForLevel(level.id, completed);
          const levelMissions = MISSIONS.filter((m) => m.level === level.id);

          return (
            <section
              key={level.id}
              className={`rounded-2xl border transition-all ${
                unlocked
                  ? 'bg-[#E6DCC8]/40 border-[#8B6B4A]/30 p-5 md:p-6'
                  : 'bg-[#E6DCC8]/20 border-[#8B6B4A]/20 p-5 md:p-6 opacity-80'
              }`}
              aria-label={`${level.title} Level`}
            >
              {/* Level Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#8B6B4A]/15">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E6DCC8] border border-[#8B6B4A]/25 flex items-center justify-center text-[#2F5D3A] font-semibold text-xs font-mono">
                    {level.title[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-lg md:text-xl font-semibold text-[#1F2A22]">
                        {level.title}
                      </h2>
                      {!unlocked && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8B6B4A] bg-[#E6DCC8]/70 px-2 py-0.5 rounded-full border border-[#8B6B4A]/20">
                          <FiLock className="w-3 h-3 text-[#8B6B4A]" aria-hidden="true" />
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#1F2A22]/80 font-mono">
                    {unlocked ? `${foundCount} of 3 found` : `${level.pointsEach} pts each`}
                  </span>
                </div>
              </div>

              {/* Unlocked Level: show missions */}
              {unlocked ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {levelMissions.map((mission) => {
                    const isDone = isMissionCompleted(completed, mission.id);

                    return (
                      <button
                        key={mission.id}
                        type="button"
                        onClick={() => handleMissionClick(mission.id, true)}
                        className={`text-left rounded-xl p-4 border transition-all flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A] ${
                          isDone
                            ? 'bg-[#2F5D3A]/5 border-[#2F5D3A]/30 hover:bg-[#2F5D3A]/10'
                            : 'bg-[#F6F1E7] border-[#8B6B4A]/25 hover:border-[#2F5D3A]/50 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-mono text-[#8B6B4A]">
                              about {mission.minutes} min · {mission.points} pts
                            </span>
                            {isDone && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#2F5D3A] font-medium">
                                <FiCheck className="w-3.5 h-3.5" aria-hidden="true" />
                                Done
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif text-base font-semibold text-[#1F2A22] leading-snug">
                            {mission.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#8B6B4A]/10 text-xs text-[#2F5D3A] font-medium">
                          <span>{isDone ? 'Review mission' : 'Open mission'}</span>
                          <FiChevronRight className="w-4 h-4 text-[#8B6B4A]" aria-hidden="true" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Locked Level: show lock requirement text */
                <div className="py-4 px-3 flex items-center justify-between bg-[#E6DCC8]/30 rounded-xl border border-[#8B6B4A]/15 text-[#8B6B4A] text-xs sm:text-sm">
                  <div className="flex items-center gap-2.5">
                    <FiLock className="w-4 h-4 shrink-0 text-[#8B6B4A]" aria-hidden="true" />
                    <span>{level.unlockRequirement}</span>
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8B6B4A]/70 hidden sm:inline">
                    Locked
                  </span>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
