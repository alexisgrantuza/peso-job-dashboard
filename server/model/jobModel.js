const db = require("../config/db");

const JobModel = {
  getAllJobs: (callback) => {
    const sql = "SELECT * FROM jobs";
    db.query(sql, callback);
  },

  getJobById: (id, callback) => {
    const sql = "SELECT * FROM jobs WHERE id = ?";
    db.query(sql, [id], callback);
  },

  createJob: ({ title, description, postedBy }, callback) => {
    const sql =
      'INSERT INTO jobs (title, description, status, posted_by_admin_id) VALUES (?, ?, "pending", ?)';
    db.query(sql, [title, description, postedBy], callback);
  },

  updateJobStatus: (id, status, callback) => {
    const sql = "UPDATE jobs SET status = ? WHERE id = ?";
    db.query(sql, [status, id], callback);
  },

  deleteJob: (id, callback) => {
    const sql = "DELETE FROM jobs WHERE id = ?";
    db.query(sql, [id], callback);
  },
};

module.exports = JobModel;
