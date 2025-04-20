const db = require("../config/database.js");

exports.getSuperadminCredentials = (req, res) => {
  const query = "SELECT id, name, email, role FROM users WHERE role = 'superadmin' LIMIT 1";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching credentials:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Superadmin not found" });
    }

    res.json(results[0]);
  });
};

exports.updateSuperadminCredentials = (req, res) => {
  const { id, name, email, password } = req.body;

  if (!id || !name || !email) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const query = password
    ? "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?"
    : "UPDATE users SET name = ?, email = ? WHERE id = ?";

  const values = password ? [name, email, password, id] : [name, email, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating credentials:", err);
      return res.status(500).json({ message: "Database update failed" });
    }

    res.json({ message: "Credentials updated successfully" });
  });
};
