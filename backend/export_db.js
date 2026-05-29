const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);
const outputPath = path.resolve(__dirname, 'supabase_migration.sql');

const tables = [
  {
    name: 'contacts',
    schema: `CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  sujet TEXT,
  message TEXT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
  },
  {
    name: 'newsletters',
    schema: `CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
  },
  {
    name: 'enrollments',
    schema: `CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  niveau TEXT NOT NULL,
  programme TEXT NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
  },
  {
    name: 'articles',
    schema: `CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  readTime TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Rose Kakpo',
  authorRole TEXT DEFAULT 'Tradeuse & Formatrice'
);`
  },
  {
    name: 'prices',
    schema: `CREATE TABLE IF NOT EXISTS prices (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL
);`
  },
  {
    name: 'users',
    schema: `CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'collaborateur',
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
  },
  {
    name: 'settings',
    schema: `CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL
);`
  },
  {
    name: 'content',
    schema: `CREATE TABLE IF NOT EXISTS content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  section TEXT NOT NULL,
  type TEXT DEFAULT 'text'
);`
  },
  {
    name: 'formations',
    schema: `CREATE TABLE IF NOT EXISTS formations (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  price REAL NOT NULL,
  capacity INTEGER NOT NULL,
  program TEXT NOT NULL,
  image TEXT,
  content_json TEXT DEFAULT '{}',
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
  },
  {
    name: 'ebooks',
    schema: `CREATE TABLE IF NOT EXISTS ebooks (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`
  }
];

let sql = '';

db.serialize(() => {
  tables.forEach(table => {
    sql += table.schema + '\n\n';
  });

  let tablesProcessed = 0;

  tables.forEach(table => {
    db.all(`SELECT * FROM ${table.name}`, [], (err, rows) => {
      if (err) throw err;
      if (rows.length > 0) {
        const columns = Object.keys(rows[0]);
        sql += `-- Data for ${table.name}\n`;
        rows.forEach(row => {
          const values = columns.map(col => {
            let val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') {
              // Escape single quotes for SQL
              return "'" + val.replace(/'/g, "''") + "'";
            }
            return val;
          });
          sql += `INSERT INTO ${table.name} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
        });
        sql += `\n`;
      }
      tablesProcessed++;
      if (tablesProcessed === tables.length) {
        fs.writeFileSync(outputPath, sql);
        console.log('Migration SQL generated at ' + outputPath);
        db.close();
      }
    });
  });
});
