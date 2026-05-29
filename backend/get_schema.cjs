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
    const formations = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'formations'");
    const ebooks = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'ebooks'");
    const articles = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'articles'");
    console.log("Formations:", formations.rows);
    console.log("Ebooks:", ebooks.rows);
    console.log("Articles:", articles.rows);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
