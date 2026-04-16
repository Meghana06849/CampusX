module.exports = async (req, res) => {
  try {
    const { default: app, dbConnectionPromise } = await import('../tpo-tracker-backend/src/app.js');

    await dbConnectionPromise;

    return app(req, res);
  } catch (error) {
    const message = error?.message || 'API initialization failed';

    return res.status(500).json({
      success: false,
      message,
    });
  }
};
