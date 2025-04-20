const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Fetch dashboard statistics including admin count
const getDashboardStats = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    try {
      // Get total admins
      const [adminsResult] = await connection.query(
        "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
      );

      const stats = {
        totalAdmins: adminsResult[0].count,
      };

      res.json(stats);
    } finally {
      connection.release(); // Always release the connection
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
};

module.exports = { getDashboardStats };
