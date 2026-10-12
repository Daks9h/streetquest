import { MISSIONS } from '../data/missions';

export const STORAGE_KEY = 'streetquest_v1';

// In-memory fallback if localStorage is disabled or throws
let memoryStore = {
  completed: {},
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const completed =
        parsed && typeof parsed.completed === 'object' && parsed.completed !== null
          ? parsed.completed
          : {};

      const totalPoints = Object.values(completed).reduce(
        (acc, item) => acc + (typeof item?.points === 'number' ? item.points : 0),
        0
      );

      memoryStore = { completed };
      return { completed, totalPoints };
    }
  } catch (err) {
    console.warn('Could not read from localStorage, using session store:', err);
  }

  const totalPoints = Object.values(memoryStore.completed).reduce(
    (acc, item) => acc + (typeof item?.points === 'number' ? item.points : 0),
    0
  );

  return { completed: { ...memoryStore.completed }, totalPoints };
}

export function saveProgress(completedMap) {
  memoryStore.completed = { ...completedMap };
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        completed: completedMap,
      })
    );
  } catch (err) {
    console.warn('Could not write to localStorage:', err);
  }
}

export function addCompletedMission(missionId, points) {
  const current = loadProgress();
  if (current.completed[missionId]) {
    // Already completed: never award points again
    return current;
  }

  const updatedCompleted = {
    ...current.completed,
    [missionId]: {
      points,
      at: new Date().toISOString(),
    },
  };

  saveProgress(updatedCompleted);

  const totalPoints = Object.values(updatedCompleted).reduce(
    (acc, item) => acc + (item?.points || 0),
    0
  );

  return { completed: updatedCompleted, totalPoints };
}

export function clearProgress() {
  memoryStore = { completed: {} };
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Could not clear localStorage:', err);
  }
  return { completed: {}, totalPoints: 0 };
}

export function isMissionCompleted(completed, missionId) {
  return Boolean(completed && completed[missionId]);
}

export function isLevelUnlocked(levelId, completed) {
  if (levelId === 'easy') return true;

  const completedMap = completed || {};
  const completedIds = Object.keys(completedMap);

  if (levelId === 'medium') {
    const easyCompleted = completedIds.filter((id) => id.startsWith('easy-')).length;
    return easyCompleted >= 2;
  }

  if (levelId === 'hard') {
    const medCompleted = completedIds.filter((id) => id.startsWith('med-')).length;
    return medCompleted >= 2;
  }

  return false;
}

export function isMissionUnlocked(missionId, completed) {
  const mission = MISSIONS.find((m) => m.id === missionId);
  if (!mission) return false;
  return isLevelUnlocked(mission.level, completed);
}

export function getCompletedCountForLevel(levelId, completed) {
  const completedMap = completed || {};
  return MISSIONS.filter((m) => m.level === levelId && completedMap[m.id]).length;
}

export function areAllMissionsCompleted(completed) {
  const completedMap = completed || {};
  return MISSIONS.length > 0 && MISSIONS.every((m) => Boolean(completedMap[m.id]));
}
