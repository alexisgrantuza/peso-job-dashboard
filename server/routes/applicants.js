const express = require("express");
const router = express.Router();

// Endpoint to get applicants' job application details with optional status filter
const applicantsRoutes = (connection) => {
  router.get("/", (req, res) => {
    const { status } = req.query;  // Get the status from the query string

    // Validate the status parameter
    const validStatuses = ['Pending', 'Approved', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value. Allowed values are: Pending, Approved, Rejected." });
    }

    // Build the SQL query
    let sqlQuery = `
      SELECT 
        ja.application_id, 
        ja.status, 
        aa.first_name, 
        aa.last_name, 
        aa.email, 
        j.job_title
      FROM tbl_job_applications ja
      JOIN tbl_applicant_accounts aa ON ja.applicant_id = aa.applicant_id
      JOIN tbl_jobs j ON ja.job_id = j.job_id
    `;

    // If a status is provided, add the WHERE clause to filter by status
    if (status) {
      sqlQuery += ` WHERE ja.status = ?`;  // Use parameterized queries to avoid SQL injection
    }

    // Execute the query
    connection.query(sqlQuery, [status], (err, results) => {
      if (err) {
        console.error("Error fetching applicants:", err.message);
        return res.status(500).json({ message: "Failed to retrieve applicants" });
      }

      // If no applicants are found, return a 404 message
      if (results.length === 0) {
        return res.status(404).json({ message: "No applicants found" });
      }

      // Return the filtered or all applicants
      res.status(200).json(results);
    });
  });

  return router;
};

module.exports = applicantsRoutes;
