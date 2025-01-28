import mysql from 'mysql';

const db = mysql.createConnection({
  host: 'localhost', // Change this to your DB host
  user: 'root', // Your DB username
  password: '', // Your DB password
  database: 'katrina' // Your database name
});

db.connect((err) => {
  if (err) {
    console.error('DB connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
});

export default db;
