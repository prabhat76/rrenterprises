const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const match = token.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).json({ error: 'Invalid token format' });

  jwt.verify(match[1], process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Failed to authenticate token' });
    req.user = decoded;
    next();
  });
};