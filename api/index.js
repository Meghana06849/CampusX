module.exports = async (req, res) => {
  const { default: app } = await import('../tpo-tracker-backend/src/app.js');
  return app(req, res);
};
