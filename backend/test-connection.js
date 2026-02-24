const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 60000,
  idleTimeoutMillis: 30000,
  statement_timeout: 30000
});

console.log('Connecting with config:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  ssl: true
});

client.connect((err) => {
  if (err) {
    console.error('Connection error:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  } else {
    console.log('Connected successfully!');
    
    client.query('SELECT NOW()', (err, result) => {
      if (err) {
        console.error('Query error:', err);
      } else {
        console.log('Query result:', result.rows);
      }
      client.end();
      process.exit(0);
    });
  }
});
