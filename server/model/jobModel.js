// models/jobModel.js
const { Sequelize, DataTypes } = require('sequelize');

// Connect to your 'peso-database' MySQL database
const sequelize = new Sequelize('mysql://username:password@localhost:3306/peso-database', {
  dialect: 'mysql',
  logging: false, // Disable logging if not needed
});

const Job = sequelize.define('tbl_jobs', { // Define the 'tbl_jobs' table
  job_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employer_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  job_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  required_skills: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  education_level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  business_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'tbl_jobs',  // Specify the exact table name in the database
  timestamps: false,  // Assuming you don't have createdAt or updatedAt columns in your table
});

module.exports = { Job, sequelize };
