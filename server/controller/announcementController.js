const path = require("path");
const { createAnnouncement, updateAnnouncement, deleteAnnouncement } = require("../model/announcementModel");

const postAnnouncement = (req, res) => {
  const db = req.app.get("db");
  const { title, content } = req.body;
  const created_by = 1; // hardcoded for now
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  createAnnouncement(db, title, content, created_by, (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Failed to create announcement" });
    }

    res.status(201).json({
      message: "Announcement created!",
      data: {
        id: result.insertId,
        title,
        content,
        created_by,
        image_url,
        created_at: new Date(),
      },
    });
  });
};

const updateAnnouncementController = (req, res) => {
  const db = req.app.get("db");
  const { id } = req.params;
  const { title, content } = req.body;

  updateAnnouncement(db, id, title, content, (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Failed to update announcement" });
    }

    res.status(200).json({
      message: "Announcement updated successfully",
      data: { id, title, content },
    });
  });
};

const deleteAnnouncementController = (req, res) => {
  const db = req.app.get("db");
  const { id } = req.params;

  deleteAnnouncement(db, id, (err, result) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ message: "Failed to delete announcement" });
    }

    res.status(200).json({
      message: "Announcement deleted successfully",
    });
  });
};

module.exports = {
  postAnnouncement,
  updateAnnouncementController,
  deleteAnnouncementController,
};

