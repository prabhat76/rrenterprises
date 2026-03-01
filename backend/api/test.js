module.exports = (req, res) => {
  res.json({ status: 'ok', message: 'Simple test endpoint', timestamp: new Date() });
};
