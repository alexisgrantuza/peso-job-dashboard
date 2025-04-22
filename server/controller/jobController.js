const JobModel = require("../model/jobModel");

exports.getAllJobs = (req, res) => {
  JobModel.Job.findAll()
    .then(results => res.json(results))
    .catch(err => {
      console.error("Error fetching jobs:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

exports.getJobById = (req, res) => {
  const id = req.params.id;
  JobModel.Job.findByPk(id)
    .then(result => {
      if (!result) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(result);
    })
    .catch(err => {
      console.error("Error fetching job:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

exports.createJob = (req, res) => {
  const { location, job_type, salary, description, required_skills, education_level, business_name, industry, status } = req.body;

  if (!location || !job_type || !salary || !education_level || !business_name || !industry || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  JobModel.Job.create({
    location, job_type, salary, description, required_skills, education_level, business_name, industry, status
  })
    .then(() => res.status(201).json({ message: "Job created successfully" }))
    .catch(err => {
      console.error("Error creating job:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

exports.updateJob = (req, res) => {
  const id = req.params.id;
  const { location, job_type, salary, description, required_skills, education_level, business_name, industry, status } = req.body;

  if (!location || !job_type || !salary || !education_level || !business_name || !industry || !status) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  JobModel.Job.update({ location, job_type, salary, description, required_skills, education_level, business_name, industry, status }, { where: { job_id: id } })
    .then(() => res.json({ message: "Job updated successfully" }))
    .catch(err => {
      console.error("Error updating job:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
};

exports.deleteJob = (req, res) => {
  const id = req.params.id;

  JobModel.Job.destroy({ where: { job_id: id } })
    .then(() => res.json({ message: "Job deleted successfully" }))
    .catch(err => {
      console.error("Error deleting job:", err);
      res.status(500).json({ message: "Internal Server Error" });
    });
};
