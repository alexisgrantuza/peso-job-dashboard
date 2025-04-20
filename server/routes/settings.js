const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// All routes are protected by authentication
router.use(auth);

module.exports = router;
