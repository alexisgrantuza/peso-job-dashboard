require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const settingsRoutes = require("./routes/settings");
const dashboardRoutes = require("./routes/dashboard");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

///app.use(bodyParser.json());

//var con = mysql.createConnection({
//  host: "localhost:3308",
//  user: "root",
//  password: "your_password",
//  database: "peso-database",
//});

//con.connect(function (err) {
//  if (err) err;

//  console.log("connection successfuly");
//});

// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test database connection
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/name", (req, res) => {
  res.send("alexis");
});

app.post("/submit", (req, res) => {
  var name = req.body.name;
  res.send(name);
});

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Peso Kopal Superadmin API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
