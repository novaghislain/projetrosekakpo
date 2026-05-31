const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = val;
    }
  });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    const res = await pool.query("SELECT * FROM formations LIMIT 1");
    if (res.rows.length > 0) {
      console.log("Columns of formations:", Object.keys(res.rows[0]));
      console.log("Full first row:", res.rows[0]);
    } else {
      console.log("No formations found.");
    }
  } catch (err) {
    console.error("Query failed:", err);
  } finally {
    await pool.end();
  }
}

run();
