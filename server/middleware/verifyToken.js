function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(" ")[1];
  if (!token) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Token invalid:", err.message);
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    console.log("✅ Token decoded:", decoded);  // <--- Add this
    req.user = decoded;
    next();
  });
}





