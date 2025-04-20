const db = require("../config/db");

const UserModel = {
  getAllAdmins: (callback) => {
    const sql = "SELECT id, name, email FROM users WHERE role = 'admin'";
    db.query(sql, callback);
  },

  getUserByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  getUserById: (id, callback) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },

  createAdmin: ({ name, email, passwordHash }, callback) => {
    const sql =
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')";
    db.query(sql, [name, email, passwordHash], callback);
  },

  updateAdmin: (id, { name, email }, callback) => {
    const sql =
      'UPDATE users SET name = ?, email = ? WHERE id = ? AND role = "admin"';
    db.query(sql, [name, email, id], callback);
  },

  deleteAdmin: (id, callback) => {
    const sql = 'DELETE FROM users WHERE id = ? AND role = "admin"';
    db.query(sql, [id], callback);
  },
};

module.exports = UserModel;
