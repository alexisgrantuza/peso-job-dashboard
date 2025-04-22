const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// All routes are protected by authentication
router.use(auth);

// Get all users
router.get("/", (req, res) => {
  const query = "SELECT id, name, email, role FROM users";
  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error fetching users" });
    }
    res.json(results);
  });
});

// Get all admins
router.get("/admins", (req, res) => {
  const query = "SELECT id, name, email, role FROM users WHERE role = 'admin'";

  db.query(query, (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error fetching admins" });
    }
    res.json(results);
  });
});

// Create new admin
router.post("/admins", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')";

    db.query(query, [name, email, hashedPassword], (error, results) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Error creating admin" });
      }

      res.status(201).json({ message: "Admin created successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete admin
router.delete("/admins/:id", (req, res) => {
  const query = "DELETE FROM users WHERE id = ? AND role = 'admin'";

  db.query(query, [req.params.id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: "Error deleting admin" });
    }

    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Admin not found or cannot be deleted" });
    }

    res.json({ message: "Admin deleted successfully" });
  });
});

// Update admin
router.put("/admins/:id", async (req, res) => {
  const { name, email, password } = req.body;
  const id = req.params.id;

  try {
    let query;
    let params;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query =
        "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ? AND role = 'admin'";
      params = [name, email, hashedPassword, id];
    } else {
      query =
        "UPDATE users SET name = ?, email = ? WHERE id = ? AND role = 'admin'";
      params = [name, email, id];
    }

    db.query(query, params, (error, results) => {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Error updating admin" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.json({ message: "Admin updated successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
