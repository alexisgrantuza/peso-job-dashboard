const mysql = require("mysql");
require("dotenv").config();

// Singleton connection variable
let connection;

const connectDB = () => {
  if (!connection) {
    connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to the database:", err.stack);
        process.exit(1); // Exit process if DB connection fails
      }
      console.log("Connected to the database.");
    });
  }
  return connection;
};

module.exports = connectDB;
