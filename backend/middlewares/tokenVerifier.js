const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  console.log("request for user data");

  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach token data to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyToken;