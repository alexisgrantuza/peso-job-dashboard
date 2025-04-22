const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    console.log("Token:", token);  // Log token for debugging

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Store the decoded payload

    if (!["superadmin", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
