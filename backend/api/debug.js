module.exports = (req, res) => {
  try {
    const app = require('../app');
    res.json({ 
      status: 'ok', 
      message: 'App loaded successfully',
      appType: typeof app,
      hasListen: typeof app.listen,
      env: process.env.NODE_ENV 
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack,
      env: process.env.NODE_ENV
    });
  }
};
