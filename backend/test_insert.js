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

function convertToPg(sql) {
  let i = 1;
  return sql.replace(/\?/g, () => '$' + (i++));
}

const query = `INSERT INTO ebooks (slug, title, price, description, image) VALUES (?, ?, ?, ?, ?)`;
const params = ['test-slug', 'Test Title', 10, 'Desc', ''];

pool.query(convertToPg(query), params, (err, res) => {
  if (err) {
    console.error("ERREUR D'INSERTION :", err);
  } else {
    console.log("SUCCES :", res);
  }
  pool.end();
});
