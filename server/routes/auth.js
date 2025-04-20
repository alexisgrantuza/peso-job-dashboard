const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Handle connection errors
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to database successfully");
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login attempt with email:", email);

  if (!email || !password) {
    console.log("Missing email or password");
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if user exists
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (error) {
          console.error("Database query error:", error);
          return res.status(500).json({ message: "Server error" });
        }

        console.log(
          "Database query results:",
          results.length ? "User found" : "No user found"
        );

        if (results.length === 0) {
          console.log("No user found with email:", email);
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = results[0];
        console.log("User role:", user.role);

        try {
          // Compare password
          console.log("Attempting password comparison");
          const isMatch = await bcrypt.compare(password, user.password);
          console.log("Password match result:", isMatch);

          if (!isMatch) {
            console.log("Password does not match");
            return res.status(401).json({ message: "Invalid credentials" });
          }

          // Create JWT token
          console.log("Creating JWT token");
          const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );

          console.log("Login successful for user:", user.email);
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
        } catch (bcryptError) {
          console.error("Password comparison error:", bcryptError);
          return res.status(500).json({ message: "Error verifying password" });
        }
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
