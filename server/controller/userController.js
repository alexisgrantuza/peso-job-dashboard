const bcrypt = require("bcryptjs");
const connectDB = require("../config/database");
const db = connectDB();

// ─── USER CONTROLLERS ────────────────────────────────────────────────

const getAllUsers = (req, res) => {
  const query = "SELECT id, name, email, role, created_at FROM users";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Error fetching users" });
    }
    res.json(results);
  });
};

const createUser = async (req, res) => {
  const { name, email, password, role = "user" } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(query, [name, email, hashedPassword, role], (error, results) => {
      if (error) {
        console.error("Error creating user:", error);
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Error creating user" });
      }
      res.status(201).json({ message: "User created successfully" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  const id = req.params.id;

  try {
    let query, params;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
      params = [name, email, hashedPassword, id];
    } else {
      query = "UPDATE users SET name = ?, email = ? WHERE id = ?";
      params = [name, email, id];
    }

    db.query(query, params, (error, results) => {
      if (error) {
        console.error("Error updating user:", error);
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Error updating user" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User updated successfully" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = (req, res) => {
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Error deleting user" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  });
};

// ─── ADMIN CONTROLLERS ───────────────────────────────────────────────

const getAllAdmins = (req, res) => {
  const query = "SELECT id, name, email, role, created_at FROM users WHERE role = 'admin'";
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching admins:", error);
      return res.status(500).json({ message: "Error fetching admins" });
    }
    res.json(results);
  });
};

const createAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')";
    db.query(query, [name, email, hashedPassword], (error, results) => {
      if (error) {
        console.error("Error creating admin:", error);
        if (error.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Error creating admin" });
      }
      res.status(201).json({ message: "Admin created successfully" });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateAdmin = async (req, res) => {
  const { name, email, password } = req.body;
  const id = req.params.id;

  try {
    let query, params;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ? AND role = 'admin'";
      params = [name, email, hashedPassword, id];
    } else {
      query = "UPDATE users SET name = ?, email = ? WHERE id = ? AND role = 'admin'";
      params = [name, email, id];
    }

    db.query(query, params, (error, results) => {
      if (error) {
        console.error("Error updating admin:", error);
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
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteAdmin = (req, res) => {
  const query = "DELETE FROM users WHERE id = ? AND role = 'admin'";
  db.query(query, [req.params.id], (error, results) => {
    if (error) {
      console.error("Error deleting admin:", error);
      return res.status(500).json({ message: "Error deleting admin" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found or cannot be deleted" });
    }

    res.json({ message: "Admin deleted successfully" });
  });
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};
