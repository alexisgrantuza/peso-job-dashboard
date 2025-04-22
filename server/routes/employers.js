const express = require('express');
const employerController = require('../controller/employerController');  // Import the employer controller

module.exports = (connection) => {
  const router = express.Router();

  // Route to fetch all employers
  router.get('/', employerController.getEmployers);  // Use the controller function

  return router;
};
