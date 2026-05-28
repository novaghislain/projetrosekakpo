const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`ALTER TABLE formations ADD COLUMN content_json TEXT DEFAULT '{}'`, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log("La colonne 'content_json' existe déjà dans la table 'formations'.");
      } else {
        console.error("Erreur lors de l'ajout de la colonne:", err.message);
      }
    } else {
      console.log("Colonne 'content_json' ajoutée avec succès à la table 'formations'.");
    }
  });
});

db.close();
