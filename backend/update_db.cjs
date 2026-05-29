const { Pool } = require('pg');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) process.env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  try {
    await pool.query("ALTER TABLE manual_payments ADD COLUMN tracking_id TEXT");
    console.log("Column tracking_id added successfully!");
  } catch (err) {
    if (err.code === '42701') console.log("Column tracking_id already exists.");
    else console.error(err);
  } finally {
    pool.end();
  }
}
run();
