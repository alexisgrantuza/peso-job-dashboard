const connectDB = require("../config/database");
const db = connectDB();

const UserModel = {
  getAllUsers: (callback) => {
    const sql = "SELECT id, name, email, role FROM users";
    db.query(sql, callback);
  },

  getUserById: (id, callback) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },

  createUser: ({ name, email, passwordHash, role = "user" }, callback) => {
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, passwordHash, role], callback);
  },

  updateUser: (id, { name, email }, callback) => {
    const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    db.query(sql, [name, email, id], callback);
  },

  deleteUser: (id, callback) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

module.exports = UserModel;
