const jwt = require('jsonwebtoken');

// Middleware for normal users
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Failed to authenticate token' });
    req.user = decoded; // Attach decoded payload
    next();
  });
}

// Middleware for admins only
function verifyAdmin(req, res, next) {
  const token = req.headers['authorization']?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    req.user = decoded; // changed from req.admin to req.user for consistency
    next();
  });
}

module.exports = { verifyToken, verifyAdmin };





