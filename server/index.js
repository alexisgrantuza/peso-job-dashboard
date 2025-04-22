require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const path = require("path");
const jwt = require("jsonwebtoken");

// Route imports
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const settingsRoutes = require("./routes/settings");
const dashboardRoutes = require("./routes/super_adminDashboard");
const applicantsRoutes = require("./routes/applicants");
const jobsRoutes = require("./routes/jobs");
const announcementsRoutes = require("./routes/announcements");
const employersRoutes = require("./routes/employers"); // Ensure correct import here

// Middleware imports
const auth = require("./middleware/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve image uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database ✅");
});

// Pass the connection to the routes
app.set("db", connection);

// Authentication Route (Login)
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // Query the database to find the user
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const user = results[0];

      // Compare password (use bcrypt in a real app)
      const validPassword = password === user.password; // Replace with bcrypt compare

      if (!validPassword) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Return token and role
      res.json({ token, role: user.role });
    }
  );
});

// Routes
app.use("/api/auth", authRoutes);

// Protected Routes
app.use("/api/users", auth, userRoutes); // Protected route
app.use("/api/settings", auth, settingsRoutes); // Protected route
app.use("/api/dashboard", auth, dashboardRoutes); // Protected route
app.use("/api/applicants", auth, applicantsRoutes(connection)); // Protected route for applicants
app.use("/api/jobs", auth, jobsRoutes(connection)); // Pass the connection here
app.use("/api/announcements", announcementsRoutes(connection));

// Debugging - check if employersRoutes is loaded and valid
if (employersRoutes) {
  console.log("Employers routes loaded successfully.");
  app.use("/api/employers", auth, employersRoutes(connection)); // Protected route for employers
} else {
  console.error("Failed to load employers routes. Check the file path and exports.");
}

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Peso Superadmin API 👋" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
