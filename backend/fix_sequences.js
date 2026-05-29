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

const tables = [
  'contacts',
  'newsletters',
  'enrollments',
  'articles',
  'users',
  'formations',
  'ebooks'
];

async function fixSequences() {
  for (let table of tables) {
    try {
      await pool.query(`SELECT setval('${table}_id_seq', COALESCE((SELECT MAX(id) FROM ${table}), 1));`);
      console.log(`✅ Séquence corrigée pour ${table}`);
    } catch (e) {
      console.error(`Erreur sur ${table}:`, e.message);
    }
  }
  pool.end();
}

fixSequences();
