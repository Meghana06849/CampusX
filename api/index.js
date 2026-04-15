module.exports = async (req, res) => {
  const { default: app, dbConnectionPromise } = await import('../tpo-tracker-backend/src/app.js');

  await dbConnectionPromise;

  return app(req, res);
};
