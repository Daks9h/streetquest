import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Levels from './pages/Levels';
import Mission from './pages/Mission';
import Complete from './pages/Complete';
import { loadProgress, addCompletedMission, clearProgress } from './lib/storage';

export default function App() {
  const [progress, setProgress] = useState(() => loadProgress());

  // Listen for storage changes if multiple tabs or windows are open
  useEffect(() => {
    const handleStorageChange = () => {
      setProgress(loadProgress());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleMissionMatch = (missionId, points) => {
    const updated = addCompletedMission(missionId, points);
    setProgress(updated);
  };

  const handleResetProgress = () => {
    const cleared = clearProgress();
    setProgress(cleared);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E7] text-[#1F2A22] flex flex-col font-sans selection:bg-[#E6DCC8] selection:text-[#1F2A22]">
      {/* Slim Top Bar on all screens except Home */}
      <TopBar points={progress.totalPoints} />

      {/* Main Screen Routes */}
      <div className="flex-1 w-full">
        <Routes>
          <Route
            path="/"
            element={<Home onResetProgress={handleResetProgress} />}
          />
          <Route
            path="/levels"
            element={<Levels progress={progress} />}
          />
          <Route
            path="/mission/:id"
            element={
              <Mission
                progress={progress}
                onMissionMatch={handleMissionMatch}
              />
            }
          />
          <Route
            path="/complete"
            element={
              <Complete
                progress={progress}
                onResetProgress={handleResetProgress}
              />
            }
          />
          <Route path="*" element={<Navigate to="/levels" replace />} />
        </Routes>
      </div>
    </div>
  );
}
