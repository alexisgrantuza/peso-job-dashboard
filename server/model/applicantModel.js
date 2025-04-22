// Get the database connection
const connectDB = require("../config/database");

const getApplicants = () => {
  return new Promise((resolve, reject) => {
    const connection = connectDB(); // Using the singleton connection

    const query = `
      SELECT 
        app.application_id,
        acc.first_name,
        acc.last_name,
        acc.email,
        job.job_title,
        app.status
      FROM tbl_job_applications app
      JOIN tbl_applicant_accounts acc ON app.applicant_id = acc.applicant_id
      JOIN tbl_jobs job ON app.job_id = job.job_id
    `;

    connection.query(query, (err, results) => {
      if (err) {
        console.error("SQL error:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  getApplicants,
};
