const fs = require('fs');
const path = require('path');

const serverFile = path.resolve(__dirname, 'server.js');
let code = fs.readFileSync(serverFile, 'utf8');

// 1. Replace sqlite3 require with pg
code = code.replace("const sqlite3 = require('sqlite3').verbose();", "const { Pool } = require('pg');");

// 2. Replace db initialization
const dbInitStart = code.indexOf("const dbPath = path.resolve(__dirname, 'database.sqlite');");
const dbInitEnd = code.indexOf('// === ROUTES PUBLIQUES ===');

const pgShim = `
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('Erreur inattendue sur le client PostgreSQL', err);
});

console.log('Connecté à la base de données PostgreSQL (Supabase).');

// Convertit les ? en $1, $2, etc. pour PostgreSQL
function convertToPg(sql) {
  let i = 1;
  return sql.replace(/\\?/g, () => '$' + (i++));
}

// Shim (adaptateur) pour simuler l'API sqlite3 et éviter de réécrire toutes les routes
const db = {
  all: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    pool.query(convertToPg(sql), params, (err, res) => {
      callback(err, res ? res.rows : []);
    });
  },
  get: (sql, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    pool.query(convertToPg(sql), params, (err, res) => {
      callback(err, res && res.rows.length > 0 ? res.rows[0] : null);
    });
  },
  run: function(sql, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    pool.query(convertToPg(sql), params, (err, res) => {
      if (callback) callback.call({ lastID: null, changes: res ? res.rowCount : 0 }, err);
    });
  }
};

`;

if (dbInitStart !== -1 && dbInitEnd !== -1) {
  code = code.substring(0, dbInitStart) + pgShim + code.substring(dbInitEnd);
  fs.writeFileSync(serverFile, code);
  console.log("Refactoring complete");
} else {
  console.error("Could not find blocks to replace");
}
