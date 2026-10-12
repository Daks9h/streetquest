import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  FiArrowLeft,
  FiChevronDown,
  FiChevronUp,
  FiLoader,
  FiCheckCircle,
  FiArrowRight,
} from 'react-icons/fi';
import { MISSIONS, getMissionById } from '../data/missions';
import {
  isLevelUnlocked,
  isMissionCompleted,
  isMissionUnlocked,
  areAllMissionsCompleted,
} from '../lib/storage';
import { verifyPhoto } from '../lib/api';
import PhotoUpload from '../components/PhotoUpload';
import ResultPanel from '../components/ResultPanel';
import ErrorBanner from '../components/ErrorBanner';

export default function Mission({ progress, onMissionMatch }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const mission = getMissionById(id);

  // Guard: unknown mission or locked mission redirects to /levels
  useEffect(() => {
    if (!mission) {
      navigate('/levels', { replace: true });
      return;
    }

    const unlocked = isMissionUnlocked(mission.id, progress.completed);
    if (!unlocked) {
      navigate('/levels', { replace: true });
    }
  }, [id, mission, progress.completed, navigate]);

  const [showHint, setShowHint] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // { blob, previewUrl, fileName }
  // States: 'empty' | 'photo_selected' | 'loading' | 'match' | 'no_match' | 'unclear' | 'error' | 'quota_exceeded' | 'timeout'
  const [screenState, setScreenState] = useState('empty');
  const [resultData, setResultData] = useState(null); // { verdict, confidence, reason }
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCode, setErrorCode] = useState('');

  const isCompleted = mission ? isMissionCompleted(progress.completed, mission.id) : false;

  // Reset state on mission change
  useEffect(() => {
    setShowHint(false);
    setSelectedPhoto(null);
    setResultData(null);
    setErrorMessage('');
    setErrorCode('');
    setScreenState('empty');
  }, [id]);

  if (!mission) {
    return null;
  }

  // Handle Photo selection from PhotoUpload
  const handlePhotoReady = (photo) => {
    setSelectedPhoto(photo);
    setScreenState('photo_selected');
    setErrorMessage('');
    setErrorCode('');
    setResultData(null);
  };

  const handlePhotoCleared = () => {
    setSelectedPhoto(null);
    setScreenState('empty');
    setErrorMessage('');
    setErrorCode('');
    setResultData(null);
  };

  // Check photo verification
  const handleCheckPhoto = async () => {
    if (!selectedPhoto?.blob || screenState === 'loading') return;

    setScreenState('loading');
    setErrorMessage('');
    setErrorCode('');

    try {
      const result = await verifyPhoto(
        mission.id,
        selectedPhoto.blob,
        selectedPhoto.fileName
      );

      setResultData(result);

      if (result.verdict === 'match') {
        setScreenState('match');
        // Only award points if not already completed
        if (!isCompleted && onMissionMatch) {
          onMissionMatch(mission.id, mission.points);
        }
      } else if (result.verdict === 'no_match') {
        setScreenState('no_match');
      } else if (result.verdict === 'unclear') {
        setScreenState('unclear');
      }
    } catch (err) {
      console.warn('Verification failed:', err);
      const code = err.code || 'AI_ERROR';
      setErrorCode(code);
      setErrorMessage(err.message || 'Verification failed.');

      if (code === 'QUOTA_EXCEEDED') {
        setScreenState('quota_exceeded');
      } else if (code === 'TIMEOUT') {
        setScreenState('timeout');
      } else {
        setScreenState('error');
      }
    }
  };

  const handleTryAgain = () => {
    setResultData(null);
    setErrorMessage('');
    setErrorCode('');
    // Keep or clear photo - user can re-evaluate or select a new one
    setScreenState('photo_selected');
  };

  const handleRetryError = () => {
    handleCheckPhoto();
  };

  // Next Mission Navigation logic
  const handleNextMission = () => {
    // 1. Look for next uncompleted mission in the same level
    const sameLevelMissions = MISSIONS.filter((m) => m.level === mission.level);
    const nextUncompletedInLevel = sameLevelMissions.find(
      (m) => m.id !== mission.id && !progress.completed[m.id]
    );

    if (nextUncompletedInLevel) {
      navigate(`/mission/${nextUncompletedInLevel.id}`);
      return;
    }

    // 2. If no more uncompleted in current level, check if all 9 are completed
    if (areAllMissionsCompleted(progress.completed)) {
      navigate('/complete');
      return;
    }

    // 3. Otherwise, return to levels list
    navigate('/levels');
  };

  return (
    <main className="w-full max-w-xl mx-auto px-5 sm:px-6 py-6 md:py-10">
      {/* Back Arrow to /levels */}
      <div className="mb-4">
        <Link
          to="/levels"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#8B6B4A] hover:text-[#1F2A22] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A] rounded py-1 pr-2"
        >
          <FiArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Levels</span>
        </Link>
      </div>

      {/* Mission Card container */}
      <div className="rounded-3xl bg-[#E6DCC8]/40 border border-[#8B6B4A]/25 p-6 md:p-8 space-y-6">
        {/* Mission Level & Metadata kicker */}
        <div className="flex items-center justify-between text-xs font-mono text-[#8B6B4A]">
          <span className="capitalize font-semibold text-[#2F5D3A] bg-[#2F5D3A]/10 px-2.5 py-1 rounded-full border border-[#2F5D3A]/20">
            {mission.level} Level
          </span>
          <span>about {mission.minutes} min · {mission.points} pts</span>
        </div>

        {/* Mission Title & Instruction */}
        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2F5D3A] tracking-tight">
            {mission.title}
          </h1>
          <p className="text-sm sm:text-base text-[#1F2A22]/85 leading-relaxed">
            {mission.instruction}
          </p>
        </div>

        {/* Show Hint Toggle */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowHint((prev) => !prev)}
            className="inline-flex items-center gap-1.5 text-xs text-[#8B6B4A] hover:text-[#1F2A22] font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2F5D3A] rounded"
            aria-expanded={showHint}
          >
            <span>{showHint ? 'Hide hint' : 'Show hint'}</span>
            {showHint ? (
              <FiChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <FiChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </button>

          {showHint && (
            <div className="mt-2.5 p-3 rounded-xl bg-[#F6F1E7] border border-[#8B6B4A]/20 text-xs text-[#1F2A22]/80 leading-relaxed animate-fadeIn">
              {mission.hint}
            </div>
          )}
        </div>

        {/* ALREADY COMPLETED STATE */}
        {isCompleted ? (
          <div className="rounded-2xl bg-[#2F5D3A]/10 border border-[#2F5D3A]/30 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#2F5D3A]/15 border border-[#2F5D3A]/30 flex items-center justify-center text-[#2F5D3A] mx-auto">
              <FiCheckCircle className="w-6 h-6" aria-hidden="true" />
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-0.5 rounded-full bg-[#2F5D3A] text-[#F6F1E7] text-[11px] font-mono font-medium">
                +{mission.points} points awarded
              </span>
              <h2 className="font-serif text-xl font-semibold text-[#2F5D3A]">
                Already completed
              </h2>
              <p className="text-xs text-[#1F2A22]/70">
                This mission was already logged. Each landmark rewards points once.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={handleNextMission}
                className="w-full sm:w-auto px-6 h-11 bg-[#2F5D3A] hover:bg-[#1F4029] text-[#F6F1E7] font-medium text-xs rounded-xl transition-all shadow-none flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
              >
                <span>Next mission</span>
                <FiArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              <Link
                to="/levels"
                className="w-full sm:w-auto px-5 h-11 bg-[#E6DCC8]/80 hover:bg-[#E6DCC8] text-[#1F2A22] font-medium text-xs rounded-xl border border-[#8B6B4A]/25 transition-all flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A]"
              >
                Back to Levels
              </Link>
            </div>
          </div>
        ) : (
          /* ACTIVE MISSION INTERACTION STATES */
          <div className="space-y-4">
            {/* Verdict Result Panels (match, no_match, unclear) */}
            {resultData && (screenState === 'match' || screenState === 'no_match' || screenState === 'unclear') ? (
              <ResultPanel
                verdict={resultData.verdict}
                reason={resultData.reason}
                points={mission.points}
                onNextMission={handleNextMission}
                onTryAgain={handleTryAgain}
              />
            ) : (
              <>
                {/* Photo Upload area */}
                <PhotoUpload
                  onPhotoReady={handlePhotoReady}
                  onPhotoCleared={handlePhotoCleared}
                  disabled={screenState === 'loading'}
                  onError={(msg) => {
                    setErrorMessage(msg);
                    setErrorCode('BAD_IMAGE');
                    setScreenState('error');
                  }}
                />

                {/* Error Banner for errors, quota exceeded, or timeout */}
                {(screenState === 'error' || screenState === 'quota_exceeded' || screenState === 'timeout') && (
                  <ErrorBanner
                    error={errorMessage}
                    errorCode={errorCode}
                    onRetry={screenState === 'quota_exceeded' ? null : handleRetryError}
                  />
                )}

                {/* Check Button (one obvious main button) */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleCheckPhoto}
                    disabled={!selectedPhoto || screenState === 'loading'}
                    className={`w-full h-12 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5D3A] ${
                      !selectedPhoto || screenState === 'loading'
                        ? 'bg-[#2F5D3A]/40 text-[#F6F1E7]/70 cursor-not-allowed'
                        : 'bg-[#2F5D3A] hover:bg-[#1F4029] text-[#F6F1E7] cursor-pointer active:scale-[0.99]'
                    }`}
                  >
                    {screenState === 'loading' ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin text-[#F6F1E7]" aria-hidden="true" />
                        <span>Checking your photo...</span>
                      </>
                    ) : (
                      <span>Check my photo</span>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
