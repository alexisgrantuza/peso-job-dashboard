const applicantModel = require("../model/applicantModel");

const getAllApplicants = async (req, res) => {
  try {
    const applicants = await applicantModel.getApplicants();
    res.status(200).json(applicants); // Send directly
  } catch (err) {
    console.error("Error in controller:", err);
    res.status(500).json({ message: "Failed to retrieve applicants" });
  }
};

module.exports = {
  getAllApplicants,
};
