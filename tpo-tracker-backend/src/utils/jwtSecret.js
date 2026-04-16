const FALLBACK_JWT_SECRET = 'tpo-tracker-submission-fallback-secret';

export const getJwtSecret = () => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) {
    return process.env.JWT_SECRET;
  }

  // Fallback keeps auth functional for demos/submissions when env is misconfigured.
  return FALLBACK_JWT_SECRET;
};
