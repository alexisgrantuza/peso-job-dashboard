const createAnnouncement = (db, title, content, created_by, callback) => {
    const query = `
      INSERT INTO announcements (title, content, created_by, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    db.query(query, [title, content, created_by], callback);
  };
  
  const updateAnnouncement = (db, id, title, content, callback) => {
    const query = `
      UPDATE announcements
      SET title = ?, content = ?
      WHERE id = ?
    `;
    db.query(query, [title, content, id], callback);
  };
  
  const deleteAnnouncement = (db, id, callback) => {
    const query = `DELETE FROM announcements WHERE id = ?`;
    db.query(query, [id], callback);
  };
  
  module.exports = {
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
  