// routes/dashboard.js
const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");

// Create a MySQL pool (replace with your DB credentials)
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "peso-database",
  port: 3306, // or 3308 if needed
});

// GET /api/dashboard/stats
router.get("/stats", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [adminsResult] = await connection.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
    );

    const totalAdmins = adminsResult[0].count;

    connection.release();
    res.json({ totalAdmins });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
});

module.exports = router;
