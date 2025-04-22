const employerModel = require('../model/employerModel');  // Import the employer model

// Controller function to get employers
const getEmployers = async (req, res) => {
  try {
    // Call the getEmployers function from the model
    const employers = await employerModel.getEmployers();
    res.json(employers);  // Send the employers data as a response
  } catch (err) {
    console.error("Error fetching employer data:", err.message); // More detailed error logging
    res.status(500).json({ message: "Database query failed", error: err.message });
  }
};

module.exports = { getEmployers };
