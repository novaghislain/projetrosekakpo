const { Pool } = require('pg');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) process.env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
pool.query("SELECT * FROM content WHERE section = 'mail'", (err, res) => {
  console.log(res ? res.rows : err);
  process.exit(0);
});
