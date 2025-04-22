const express = require("express");
const router = express.Router();

// Assuming you have your MySQL connection available globally or passed into the route
module.exports = (connection) => {

  // Route to get all announcements
  router.get("/", (req, res) => {
    connection.query("SELECT * FROM announcements", (err, results) => {
      if (err) {
        console.error("Error fetching announcements:", err);
        return res.status(500).json({ message: "Database query error" });
      }
      res.json(results);
    });
  });

  // Route to add an announcement
  router.post("/", (req, res) => {
    const { title, content, created_by } = req.body;

    // Input validation (you can expand this as needed)
    if (!title || !content || !created_by) {
      return res.status(400).json({ message: "Title, content, and created_by are required" });
    }

    const query = `INSERT INTO announcements (title, content, created_by, created_at) VALUES (?, ?, ?, NOW())`;
    connection.query(query, [title, content, created_by], (err, result) => {
      if (err) {
        console.error("Error inserting announcement:", err);
        return res.status(500).json({ message: "Error inserting announcement" });
      }
      res.status(201).json({ message: "Announcement created successfully", id: result.insertId });
    });
  });

  // Route to update an announcement
  router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    // Input validation
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const query = `UPDATE announcements SET title = ?, content = ? WHERE id = ?`;
    connection.query(query, [title, content, id], (err, result) => {
      if (err) {
        console.error("Error updating announcement:", err);
        return res.status(500).json({ message: "Error updating announcement" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.status(200).json({ message: "Announcement updated successfully" });
    });
  });

  // Route to delete an announcement
  router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM announcements WHERE id = ?`;
    connection.query(query, [id], (err, result) => {
      if (err) {
        console.error("Error deleting announcement:", err);
        return res.status(500).json({ message: "Error deleting announcement" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.status(200).json({ message: "Announcement deleted successfully" });
    });
  });

  return router;
};
