const express = require('express');
const router = express.Router();

// Example authentication middleware (replace with your actual middleware)
const auth = (req, res, next) => {
  // Perform authentication logic here
  // For now, we'll just call next to allow the request to continue
  next();
};

// PUT /jobs/:id/status - Update the status of a specific job
router.put('/:id/status', auth, (req, res) => {
  const jobId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const query = 'UPDATE tbl_jobs SET status = ? WHERE job_id = ?';

  // Use the connection passed from the main app
  const connection = req.app.get('db'); 

  connection.query(query, [status, jobId], (err, results) => {
    if (err) {
      console.error('Error updating job status:', err);
      return res.status(500).json({ message: 'Error updating job status' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ message: 'Job status updated successfully' });
  });
});

// GET /jobs - Fetch all jobs with updated status
router.get('/', auth, (req, res) => {
  const query = `
    SELECT job_id, employer_id, location, job_type, salary, education_level, 
           business_name, industry, status
    FROM tbl_jobs
  `;

  // Use the connection passed from the main app
  const connection = req.app.get('db'); 

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching jobs:', err);
      return res.status(500).json({ message: 'Error fetching jobs' });
    }

    res.json(results);
  });
});

// Export the router with the connection passed as an argument
module.exports = (connection) => {
  return router;
};
