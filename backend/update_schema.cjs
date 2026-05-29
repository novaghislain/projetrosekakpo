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
    await pool.query("ALTER TABLE articles ADD COLUMN image TEXT;");
    console.log("Column 'image' added to 'articles'.");
  } catch (err) {
    if (err.code === '42701') console.log("Column 'image' already exists in 'articles'.");
    else console.error(err);
  }

  try {
    await pool.query("ALTER TABLE ebooks ADD COLUMN testimonials_json TEXT;");
    console.log("Column 'testimonials_json' added to 'ebooks'.");
  } catch (err) {
    if (err.code === '42701') console.log("Column 'testimonials_json' already exists in 'ebooks'.");
    else console.error(err);
  }
  pool.end();
}
run();
