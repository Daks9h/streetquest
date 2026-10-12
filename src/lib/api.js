/**
 * API client for StreetQuest
 * Communicates with the FastAPI backend (/verify) or falls back to mock if VITE_USE_MOCK is true.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

/**
 * Verify a mission photo against mission criteria.
 *
 * @param {string} missionId
 * @param {Blob} imageBlob
 * @param {string} [fileName='photo.jpg']
 * @returns {Promise<{ verdict: 'match' | 'no_match' | 'unclear', confidence: number, reason: string }>}
 */
export async function verifyPhoto(missionId, imageBlob, fileName = 'photo.jpg') {
  // If mock mode is explicitly requested
  if (USE_MOCK) {
    return runMockVerification(missionId, imageBlob, fileName);
  }

  const formData = new FormData();
  formData.append('mission_id', missionId);
  formData.append('image', imageBlob, fileName || 'photo.jpg');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second client timeout

  try {
    const res = await fetch(`${API_URL}/verify`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errCode = data?.error || (res.status === 429 ? 'QUOTA_EXCEEDED' : res.status === 504 ? 'TIMEOUT' : 'AI_ERROR');
      const errMsg = data?.message || (res.status === 429 ? 'Daily check quota reached. Please try again later.' : 'Verification failed.');
      const error = new Error(errMsg);
      error.code = errCode;
      error.status = res.status;
      throw error;
    }

    return {
      verdict: data.verdict,
      confidence: data.confidence,
      reason: data.reason,
    };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === 'AbortError') {
      const timeoutError = new Error('Verification timed out. Please check your connection and retry.');
      timeoutError.code = 'TIMEOUT';
      throw timeoutError;
    }

    if (err.code) {
      throw err;
    }

    // Network error: could not connect to backend server
    const networkError = new Error("Can't reach the checker. Please ensure the backend is running.");
    networkError.code = 'AI_ERROR';
    throw networkError;
  }
}

/**
 * Mock verification fallback
 */
async function runMockVerification(missionId, imageBlob, fileName = '') {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const name = (fileName || '').toLowerCase();

  if (name.includes('fail')) {
    return {
      verdict: 'no_match',
      confidence: 0.88,
      reason: 'The photo does not clearly show the requested item.',
    };
  }

  if (name.includes('maybe')) {
    return {
      verdict: 'unclear',
      confidence: 0.48,
      reason: 'Try a closer, brighter photo.',
    };
  }

  if (name.includes('error')) {
    const error = new Error('Checker service encountered an error.');
    error.code = 'AI_ERROR';
    throw error;
  }

  if (name.includes('quota')) {
    const error = new Error('Daily check quota reached. Please try again later.');
    error.code = 'QUOTA_EXCEEDED';
    throw error;
  }

  if (name.includes('slow')) {
    const error = new Error('Verification took too long. Please check your connection and retry.');
    error.code = 'TIMEOUT';
    throw error;
  }

  return {
    verdict: 'match',
    confidence: 0.95,
    reason: 'Nice find! Target clearly identified.',
  };
}
