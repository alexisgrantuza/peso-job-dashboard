const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mysql = require("mysql2/promise");

// Create pool connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Protect all routes
router.use(auth);

// Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Get total applicants
      const [applicantsResult] = await connection.query(
        "SELECT COUNT(*) as count FROM applicants"
      );

      // Get successful applicants
      const [successfulResult] = await connection.query(
        "SELECT COUNT(*) as count FROM applicants WHERE status = 'hired'"
      );

      // Get total employers
      const [employersResult] = await connection.query(
        "SELECT COUNT(*) as count FROM employers"
      );

      // Get recent jobs (last 5)
      const [recentJobs] = await connection.query(
        `SELECT j.title, COUNT(a.id) as applicants 
         FROM jobs j 
         LEFT JOIN applications a ON j.id = a.job_id 
         GROUP BY j.id 
         ORDER BY j.created_at DESC 
         LIMIT 5`
      );

      // Get monthly applications data
      const [monthlyApplications] = await connection.query(
        `SELECT j.title as position, COUNT(a.id) as applications 
         FROM jobs j 
         LEFT JOIN applications a ON j.id = a.job_id 
         WHERE MONTH(a.created_at) = MONTH(CURRENT_DATE()) 
         GROUP BY j.id 
         ORDER BY applications DESC 
         LIMIT 5`
      );

      const stats = {
        totalApplicants: applicantsResult[0].count,
        successfulApplicants: successfulResult[0].count,
        totalEmployers: employersResult[0].count,
        recentJobs,
        monthlyApplications,
      };

      res.json(stats);
    } finally {
      connection.release(); // Always release the connection
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
});

module.exports = router;
