const mysql = require("mysql2");

// Create a connection pool to MySQL
const pool = mysql.createPool({
  host: 'localhost', // Your MySQL host
  user: 'your_username', // Your MySQL username
  password: 'your_password', // Your MySQL password
  database: 'peso-database', // Your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Promise wrapper for pool.query to make it async/await compatible
const promisePool = pool.promise();

// Function to get employers
const getEmployers = async () => {
  const query = `
    SELECT employer_id, tin_number, business_name, business_address, location_type, employer_type, business_size, industry, contact_person, position, phone_number, telephone_number, email, status
    FROM tbl_employer_details;
  `;
  
  try {
    const [rows] = await promisePool.query(query);  // Execute the query and get rows
    return rows;  // Return the employer data
  } catch (err) {
    throw new Error('Error fetching employer data: ' + err.message);
  }
};

module.exports = {
  getEmployers,
};
