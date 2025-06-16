const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'careboardsecret';

const auth = (requiredRoles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid authorization header format' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error('JWT verification error:', err); // Log error for debugging
      return res.status(401).json({ error: 'Invalid token' });
    }

    if (requiredRoles.length) {
      if (typeof decoded.role === 'undefined') {
        return res.status(403).json({ error: 'User role not found in token' });
      }
      if (!requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }

    req.user = decoded;
    next();
  };
};

module.exports = auth;
