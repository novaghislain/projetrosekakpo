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

const sql = `
CREATE TABLE IF NOT EXISTS manual_payments (
  id SERIAL PRIMARY KEY,
  program_id TEXT NOT NULL,
  customer_info JSON NOT NULL,
  network TEXT NOT NULL,
  proof_image TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

pool.query(sql, (err, res) => {
  if (err) {
    console.error("Erreur création table :", err);
  } else {
    console.log("Table manual_payments créée avec succès !");
  }
  pool.end();
});
