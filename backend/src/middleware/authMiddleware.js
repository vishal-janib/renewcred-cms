const jwt = require("jsonwebtoken");

const protectRoute = (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // No token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authentication token provided.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach admin information to request
    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
};

module.exports = protectRoute;
