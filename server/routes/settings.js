const express = require("express");
const router = express.Router();
const {
  getSuperadminCredentials,
  updateSuperadminCredentials,
} = require("../controller/settingsController");

router.get("/credentials", getSuperadminCredentials);
router.put("/credentials", updateSuperadminCredentials);

module.exports = router;
