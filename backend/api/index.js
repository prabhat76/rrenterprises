// Serverless handler for Vercel
const app = require('../app');

// Export the app wrapped for serverless
module.exports = async (req, res) => {
  try {
    await app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};
