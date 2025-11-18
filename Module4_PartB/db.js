const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'db.it.pointpark.edu',
  user: 'homeowners',          
  password: 'QYH5Mj2LxmEU3Xnt',
  database: 'homeowners',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = db;
