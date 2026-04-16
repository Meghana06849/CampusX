import app, { dbConnectionPromise } from '../src/app.js';

export default async function handler(req, res) {
  try {
    await dbConnectionPromise;
    return app(req, res);
  } catch (error) {
    const message = error?.message || 'API initialization failed';

    return res.status(500).json({
      success: false,
      message,
    });
  }
}
