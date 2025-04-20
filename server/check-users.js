require("dotenv").config();
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to database successfully");

  // Query to check users table
  connection.query(
    "SELECT id, name, email, role, password FROM users",
    (error, results) => {
      if (error) {
        console.error("Error querying database:", error);
        return;
      }

      console.log("\nUsers in database:");
      console.log("==================");
      results.forEach((user) => {
        console.log(`\nID: ${user.id}`);
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Role: ${user.role}`);
        console.log(`Password Hash: ${user.password}`);
        console.log("------------------");
      });

      connection.end();
    }
  );
});
