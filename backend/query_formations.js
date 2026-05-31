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
    const res = await pool.query("SELECT id, title, slug, price FROM formations");
    if (res.rows.length > 0) {
      console.log("All formations summary:", JSON.stringify(res.rows, null, 2));
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
