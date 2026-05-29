const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Chargement de .env
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

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  try {
    await client.connect();
    console.log('Connecté à Supabase.');
    
    const sqlPath = path.resolve(__dirname, 'supabase_migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Exécution du script SQL de ' + (sql.length / 1024 / 1024).toFixed(2) + ' MB...');
    await client.query(sql);
    
    console.log('✅ Migration réussie ! Toutes les tables et données ont été importées dans Supabase.');
  } catch (err) {
    console.error('❌ Erreur lors de la migration :', err);
  } finally {
    await client.end();
  }
}

runMigration();
