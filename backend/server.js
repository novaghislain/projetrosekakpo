const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Chargement du fichier .env en local sans dépendance externe
try {
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
    console.log('Fichier .env chargé.');
  }
} catch (e) {
  console.log('Aucun fichier .env chargé.');
}

const app = express();

const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

if (!process.env.DATABASE_URL) {
  console.error("❌ ERREUR CRITIQUE: La variable d'environnement DATABASE_URL est manquante.");
  process.exit(1);
}

// Base de données

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
  return sql.replace(/\?/g, () => '$' + (i++));
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

// === ROUTES PUBLIQUES ===

// 1. Sauvegarder un message de contact
app.post('/api/contact', (req, res) => {
  const { nom, email, message } = req.body;
  if (!nom || !email || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const query = `INSERT INTO contacts (nom, email, message) VALUES (?, ?, ?)`;
  db.run(query, [nom, email, message], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur lors de l'envoi du message." });
    }
    
    // Tentative d'envoi d'e-mail via nodemailer
    db.all("SELECT key, value FROM content WHERE section = 'mail'", (errMail, rows) => {
      if (!errMail && rows && rows.length > 0) {
        const mailConfig = {};
        rows.forEach(r => { mailConfig[r.key] = r.value });
        
        if (mailConfig.ceo_forward_email && mailConfig.smtp_user && mailConfig.smtp_pass) {
          const transporter = nodemailer.createTransport({
            host: mailConfig.smtp_host || 'smtp.gmail.com',
            port: parseInt(mailConfig.smtp_port) || 465,
            secure: parseInt(mailConfig.smtp_port) === 465,
            auth: {
              user: mailConfig.smtp_user,
              pass: mailConfig.smtp_pass
            }
          });

          const mailOptions = {
            from: `"${nom}" <${mailConfig.smtp_user}>`,
            to: mailConfig.ceo_forward_email,
            subject: `Nouveau message sur votre site de : ${nom}`,
            text: `Vous avez reçu un nouveau message !\n\nDe: ${nom}\nEmail: ${email}\nMessage:\n${message}\n\n--\nMessage envoyé depuis le site Rose Kakpo.`
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Erreur d'envoi d'email SMTP :", error);
            } else {
              console.log("E-mail transféré avec succès :", info.response);
            }
          });
        }
      }
    });

    res.json({ success: true, message: "Message envoyé avec succès", id: this.lastID });
  });
});

app.delete('/api/admin/contacts/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM contacts WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    res.json({ success: true, deleted: this.changes });
  });
});

// 2. S'inscrire à la newsletter
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "L'email est requis." });
  }

  const query = `INSERT INTO newsletters (email) VALUES (?)`;
  db.run(query, [email], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: "Cet email est déjà inscrit à la newsletter." });
      }
      return res.status(500).json({ error: "Erreur lors de l'inscription à la newsletter." });
    }
    res.status(201).json({ success: true, message: "Inscription à la newsletter réussie." });
  });
});

// 3. S'inscrire à un programme
app.post('/api/enroll', (req, res) => {
  const { nom, email, whatsapp, niveau, programme, programSlug } = req.body;

  if (!nom || !email || !whatsapp || !niveau || !programme) {
    return res.status(400).json({ error: "Tous les champs sont requis pour l'inscription." });
  }

  const query = `INSERT INTO enrollments (nom, email, whatsapp, niveau, programme) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [nom, email, whatsapp, niveau, programme], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erreur lors de l'inscription au programme." });
    }
    
    if (programSlug) {
      db.run(`UPDATE formations SET capacity = capacity - 1 WHERE slug = ? AND capacity > 0`, [programSlug], (err2) => {
        if (err2) console.error("Erreur décrémentation capacité:", err2);
        res.status(201).json({ success: true, message: "Inscription enregistrée avec succès.", id: this.lastID });
      });
    } else {
      res.status(201).json({ success: true, message: "Inscription enregistrée avec succès.", id: this.lastID });
    }
  });
});

// 4. Récupérer les articles (Public)
app.get('/api/articles', (req, res) => {
  db.all(`SELECT * FROM articles ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la récupération des articles." });
    res.json(rows);
  });
});

// 5. Récupérer un article spécifique (Public)
app.get('/api/articles/:id', (req, res) => {
  db.get(`SELECT * FROM articles WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    if (!row) return res.status(404).json({ error: "Article non trouvé." });
    res.json(row);
  });
});

// 6. Récupérer une formation spécifique par son slug (Public)
app.get('/api/formations/:slug', (req, res) => {
  db.get(`SELECT * FROM formations WHERE slug = ?`, [req.params.slug], (err, row) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    if (!row) return res.status(404).json({ error: "Formation introuvable." });
    res.json(row);
  });
});

// === ROUTES ADMIN ===
// (Dans une vraie app, ces routes seraient protégées par un token JWT)

app.get('/api/admin/contacts', (req, res) => {
  db.all(`SELECT * FROM contacts ORDER BY date DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur." });
    res.json(rows);
  });
});

app.get('/api/admin/newsletters', (req, res) => {
  db.all(`SELECT * FROM newsletters ORDER BY date DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur." });
    res.json(rows);
  });
});

app.delete('/api/admin/newsletters/:id', (req, res) => {
  db.run(`DELETE FROM newsletters WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: "Erreur." });
    res.json({ success: true });
  });
});

app.get('/api/admin/enrollments', (req, res) => {
  db.all(`SELECT * FROM enrollments ORDER BY date DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur." });
    res.json(rows);
  });
});

app.delete('/api/admin/enrollments/:id', (req, res) => {
  db.run(`DELETE FROM enrollments WHERE id = ?`, [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: "Erreur." });
    res.json({ success: true });
  });
});

// Créer un article
app.post('/api/admin/articles', (req, res) => {
  const { title, category, date, readTime, excerpt, content, image } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Titre et contenu obligatoires." });
  }

  const query = `INSERT INTO articles (title, category, date, readTime, excerpt, content, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(query, [title, category, date, readTime, excerpt, content, image], function (err) {
    if (err) return res.status(500).json({ error: "Erreur de création." });
    res.status(201).json({ success: true, id: this.lastID });
  });
});

// Supprimer un article
app.delete('/api/admin/articles/:id', (req, res) => {
  db.run(`DELETE FROM articles WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: "Erreur." });
    res.json({ success: true });
  });
});

// === ROUTES ADMIN FORMATIONS ===

// Lister les formations
app.get('/api/admin/formations', (req, res) => {
  db.all(`SELECT * FROM formations ORDER BY date DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la récupération des formations." });
    res.json(rows);
  });
});

// Créer une formation
app.post('/api/admin/formations', (req, res) => {
  const { slug, title, price, capacity, program, image, content_json } = req.body;
  if (!slug || !title || price === undefined || !capacity || !program) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }
  const query = `INSERT INTO formations (slug, title, price, capacity, program, image, content_json) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const defaultContent = JSON.stringify({
    subtitle: "",
    objectives: [],
    targetAudience: [],
    included: [],
    authorBio: ""
  });
  const finalContentJson = content_json ? (typeof content_json === 'object' ? JSON.stringify(content_json) : content_json) : defaultContent;

  db.run(query, [slug, title, price, capacity, program, image, finalContentJson], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: "Ce lien (slug) est déjà utilisé par une autre formation." });
      }
      return res.status(500).json({ error: "Erreur de création de la formation." });
    }
    res.status(201).json({ success: true, id: this.lastID });
  });
});

// Modifier une formation
app.put('/api/admin/formations/:id', (req, res) => {
  const { slug, title, price, capacity, program, image, content_json } = req.body;
  if (!slug || !title || price === undefined || !capacity || !program) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const query = `UPDATE formations SET slug = ?, title = ?, price = ?, capacity = ?, program = ?, image = ?, content_json = ? WHERE id = ?`;
  const defaultContent = JSON.stringify({
    subtitle: "",
    objectives: [],
    targetAudience: [],
    included: [],
    authorBio: ""
  });
  const finalContentJson = content_json ? (typeof content_json === 'object' ? JSON.stringify(content_json) : content_json) : defaultContent;

  db.run(query, [slug, title, price, capacity, program, image, finalContentJson, req.params.id], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: "Ce lien (slug) est déjà utilisé par une autre formation." });
      }
      return res.status(500).json({ error: "Erreur de mise à jour de la formation." });
    }
    if (this.changes === 0) return res.status(404).json({ error: "Formation introuvable." });
    res.json({ success: true, message: "Formation mise à jour avec succès." });
  });
});

// Supprimer une formation
app.delete('/api/admin/formations/:id', (req, res) => {
  db.run(`DELETE FROM formations WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: "Erreur lors de la suppression." });
    res.json({ success: true });
  });
});

// === EBOOKS ROUTES ===

// Lister les ebooks (public & admin)
app.get('/api/ebooks', (req, res) => {
  db.all(`SELECT * FROM ebooks ORDER BY date DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la récupération des ebooks." });
    res.json(rows);
  });
});

// Créer un ebook
app.post('/api/admin/ebooks', (req, res) => {
  const { slug, title, price, description, image, testimonials_json } = req.body;
  if (!slug || !title || price === undefined || !description) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }
  const query = `INSERT INTO ebooks (slug, title, price, description, image, testimonials_json) VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [slug, title, price, description, image, testimonials_json], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: "Ce lien (slug) est déjà utilisé par un autre ebook." });
      }
      return res.status(500).json({ error: "Erreur de création de l'ebook." });
    }
    res.status(201).json({ success: true, id: this.lastID });
  });
});

// Modifier un ebook
app.put('/api/admin/ebooks/:id', (req, res) => {
  const { slug, title, price, description, image, testimonials_json } = req.body;
  if (!slug || !title || price === undefined || !description) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const query = `UPDATE ebooks SET slug = ?, title = ?, price = ?, description = ?, image = ?, testimonials_json = ? WHERE id = ?`;
  
  db.run(query, [slug, title, price, description, image, testimonials_json, req.params.id], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: "Ce lien (slug) est déjà utilisé par un autre ebook." });
      }
      return res.status(500).json({ error: "Erreur de mise à jour de l'ebook." });
    }
    if (this.changes === 0) return res.status(404).json({ error: "Ebook introuvable." });
    res.json({ success: true, message: "Ebook mis à jour avec succès." });
  });
});

// Supprimer un ebook
app.delete('/api/admin/ebooks/:id', (req, res) => {
  db.run(`DELETE FROM ebooks WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: "Erreur lors de la suppression." });
    res.json({ success: true });
  });
});

// === CMS CONTENT ROUTES ===

// Récupérer tout le contenu du site (public)
app.get('/api/content', (req, res) => {
  db.all(`SELECT * FROM content ORDER BY section, key`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la récupération du contenu." });
    // Transformer en objet clé-valeur
    const contentMap = {};
    rows.forEach(row => { contentMap[row.key] = row; });
    res.json(contentMap);
  });
});

// Mettre à jour une entrée de contenu (Admin)
app.put('/api/admin/content/:key', (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  if (value === undefined) {
    return res.status(400).json({ error: "La valeur est requise." });
  }

  db.run(`UPDATE content SET value = ? WHERE key = ?`, [value, key], function (err) {
    if (err) return res.status(500).json({ error: "Erreur lors de la mise à jour du contenu." });
    if (this.changes === 0) return res.status(404).json({ error: "Clé de contenu introuvable." });
    res.json({ success: true, message: "Contenu mis à jour avec succès." });
  });
});

// Récupérer les tarifs des formations et ebooks
app.get('/api/prices', (req, res) => {
  db.all(`SELECT * FROM prices`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la récupération des tarifs." });
    res.json(rows);
  });
});

// Mettre à jour un tarif (Admin)
app.put('/api/admin/prices/:id', (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  if (price === undefined || isNaN(price)) {
    return res.status(400).json({ error: "Le prix doit être un nombre valide." });
  }

  db.run(`UPDATE prices SET price = ? WHERE id = ?`, [price, id], function (err) {
    if (err) return res.status(500).json({ error: "Erreur lors de la mise à jour du tarif." });
    res.json({ success: true, message: "Tarif mis à jour avec succès." });
  });
});

// Connexion Administrateur / Collaborateur
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Identifiant et mot de passe requis." });
  }

  db.get("SELECT * FROM users WHERE username = ?", [username.toLowerCase().trim()], (err, user) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Identifiant ou mot de passe incorrect." });
    }
    res.json({ success: true, username: user.username, role: user.role });
  });
});

// Récupérer la liste des collaborateurs (Admin uniquement)
app.get('/api/admin/collaborators', (req, res) => {
  db.all("SELECT id, username, role, date FROM users ORDER BY date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    res.json(rows);
  });
});

// Ajouter un collaborateur (Admin uniquement)
app.post('/api/admin/collaborators', (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Identifiant et mot de passe requis." });
  }

  db.run(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    [username.toLowerCase().trim(), password, role || 'collaborateur'],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: "Cet identifiant est déjà utilisé." });
        }
        return res.status(500).json({ error: "Erreur lors de la création du collaborateur." });
      }
      res.status(201).json({ success: true, id: this.lastID });
    }
  );
});

// Supprimer un collaborateur (Admin uniquement)
app.delete('/api/admin/collaborators/:id', (req, res) => {
  const { id } = req.params;

  db.get("SELECT username FROM users WHERE id = ?", [id], (err, user) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable." });
    if (user.username === 'rose') {
      return res.status(400).json({ error: "Impossible de supprimer l'administrateur principal." });
    }

    db.run("DELETE FROM users WHERE id = ?", [id], function (err2) {
      if (err2) return res.status(500).json({ error: "Erreur lors de la suppression." });
      res.json({ success: true });
    });
  });
});

// Changer de mot de passe (Tout utilisateur authentifié)
app.post('/api/admin/change-password', (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  db.get("SELECT * FROM users WHERE username = ?", [username.toLowerCase().trim()], (err, user) => {
    if (err) return res.status(500).json({ error: "Erreur serveur." });
    if (!user || user.password !== currentPassword) {
      return res.status(400).json({ error: "Le mot de passe actuel est incorrect." });
    }

    db.run("UPDATE users SET password = ? WHERE id = ?", [newPassword, user.id], (err2) => {
      if (err2) return res.status(500).json({ error: "Erreur de mise à jour du mot de passe." });
      res.json({ success: true, message: "Mot de passe modifié avec succès." });
    });
  });
});

// === FLUX DE PAIEMENT EDAPAY (REAL & MOCK) ===
const https = require('https');

// Helper pour effectuer des requêtes HTTPS vers l'API FedaPay
function makeRequest(url, method, headers, data) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: headers
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ statusCode: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, rawBody: body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// 1. Initialiser une transaction FedaPay (ou Mock si clé absente)
app.post('/api/payment/create', (req, res) => {
  const { programId, customer, sessionType } = req.body;

  if (!programId || !customer || !customer.email || !customer.firstname || !customer.lastname || !customer.whatsapp) {
    return res.status(400).json({ error: "Détails du client et identifiant du programme obligatoires." });
  }

  // Chercher d'abord dans les tarifs fixes (Prices)
  db.get("SELECT * FROM prices WHERE id = ?", [programId], (err, program) => {
    if (err) return res.status(500).json({ error: "Erreur lors de la récupération des prix." });

    if (program) {
      processPayment(program.name, program.price);
    } else {
      // Si non trouvé dans prices, chercher dans les formations dynamiques (slug = programId)
      db.get("SELECT * FROM formations WHERE slug = ?", [programId], (err2, dynamicProgram) => {
        if (err2 || !dynamicProgram) {
          return res.status(400).json({ error: "Programme invalide ou introuvable." });
        }
        processPayment(dynamicProgram.title, dynamicProgram.price);
      });
    }
  });

  async function processPayment(programName, price) {
    // Gérer le cas de la première séance de coaching offerte
    if (programId === 'coaching-free' || (programId === 'coaching' && sessionType === 'free')) {
      const freeId = `FREE-${Date.now()}`;
      const freeUrl = `http://localhost:5173/payment-callback?id=${freeId}&status=approved&programId=${programId}&firstname=${encodeURIComponent(customer.firstname)}&lastname=${encodeURIComponent(customer.lastname)}&email=${encodeURIComponent(customer.email)}&whatsapp=${encodeURIComponent(customer.whatsapp)}`;
      return res.json({ success: true, url: freeUrl, transactionId: freeId });
    }

    // Si la clé API FedaPay est configurée, on tente la vraie transaction
    if (process.env.FEDAPAY_SECRET_KEY) {
      try {
        const fedapayEnv = process.env.FEDAPAY_ENVIRONMENT || 'sandbox';
        const apiBase = fedapayEnv === 'live' ? 'https://api.fedapay.com/v1' : 'https://sandbox-api.fedapay.com/v1';

        const headers = {
          'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
          'Content-Type': 'application/json'
        };

        const txData = {
          description: `Achat du programme: ${programName}`,
          amount: price,
          currency: {
            iso: "XOF"
          },
          callback_url: `http://localhost:5173/payment-callback?programId=${programId}`,
          customer: {
            firstname: customer.firstname,
            lastname: customer.lastname,
            email: customer.email,
            phone_number: {
              number: customer.whatsapp,
              country: "BJ"
            }
          }
        };

        // Étape A: Création de la transaction
        const txRes = await makeRequest(`${apiBase}/transactions`, 'POST', headers, txData);
        let txId;
        if (txRes.body) {
          const tx = txRes.body['v1/transaction'] || txRes.body.transaction || txRes.body;
          txId = tx.id;
        }

        if (!txId) {
          console.error("Échec création transaction FedaPay:", txRes.body);
          let errorMessage = "Erreur FedaPay.";
          if (txRes.body && txRes.body.errors) {
            errorMessage = Object.values(txRes.body.errors).flat().join(", ");
          } else if (txRes.body && txRes.body.message) {
            errorMessage = txRes.body.message;
          }
          return res.status(400).json({ error: `FedaPay a refusé la transaction : ${errorMessage}` });
        }

        // Étape B: Génération du token de checkout
        const tokenRes = await makeRequest(`${apiBase}/transactions/${txId}/token`, 'POST', headers, {});
        let checkoutUrl;
        if (tokenRes.body) {
          // Si l'API renvoie { token: '...', url: '...' }, on prend l'URL directement
          checkoutUrl = tokenRes.body.url || (tokenRes.body['v1/token'] && tokenRes.body['v1/token'].url);
        }

        if (!checkoutUrl) {
          console.error("Échec génération du token de paiement:", tokenRes.body);
          throw new Error("FedaPay Token API error");
        }

        return res.json({ success: true, url: checkoutUrl, transactionId: txId });
      } catch (err) {
        console.warn("FedaPay API error:", err.message);
        return res.status(500).json({ error: "FedaPay API error: " + err.message });
      }
    } else {
      // Redirection vers le mode Simulation en local (seulement si pas de clé API)
      const mockId = `MOCK-${Date.now()}`;
      const mockUrl = `http://localhost:5173/mock-checkout?id=${mockId}&amount=${price}&programId=${programId}&firstname=${encodeURIComponent(customer.firstname)}&lastname=${encodeURIComponent(customer.lastname)}&email=${encodeURIComponent(customer.email)}&whatsapp=${encodeURIComponent(customer.whatsapp)}`;

      res.json({ success: true, url: mockUrl, transactionId: mockId });
    }
  }
});

// 2. Vérification d'une transaction FedaPay (ou Mock)
app.get('/api/payment/verify/:id', async (req, res) => {
  const { id } = req.params;

  if (id.startsWith('MOCK-') || id.startsWith('FREE-')) {
    // Les paiements simulés ou gratuits en local sont validés automatiquement
    return res.json({ success: true, status: 'approved' });
  }

  if (!process.env.FEDAPAY_SECRET_KEY) {
    return res.status(400).json({ error: "Clé secrète FedaPay absente." });
  }

  try {
    const fedapayEnv = process.env.FEDAPAY_ENVIRONMENT || 'sandbox';
    const apiBase = fedapayEnv === 'live' ? 'https://api.fedapay.com/v1' : 'https://sandbox-api.fedapay.com/v1';

    const headers = {
      'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
      'Content-Type': 'application/json'
    };

    const verifyRes = await makeRequest(`${apiBase}/transactions/${id}`, 'GET', headers);
    let status = 'pending';
    if (verifyRes.body) {
      const txData = verifyRes.body['v1/transaction'] || verifyRes.body.transaction || verifyRes.body;
      status = txData.status;
    }

    res.json({ success: true, status });
  } catch (error) {
    console.error("Erreur de vérification de la transaction:", error);
    res.status(500).json({ error: "Erreur lors de la vérification de la transaction." });
  }
});

// Démarrer le serveur

// --- PAIEMENTS MANUELS ---

app.post('/api/payment/manual', (req, res) => {
  const { programId, customer, network, proofImage } = req.body;
  if (!programId || !customer || !network || !proofImage) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const crypto = require('crypto');
  const trackingId = 'TRK-' + crypto.randomBytes(3).toString('hex').toUpperCase();

  const query = `INSERT INTO manual_payments (program_id, customer_info, network, proof_image, status, tracking_id) VALUES (?, ?, ?, ?, 'pending', ?)`;
  db.run(query, [programId, JSON.stringify(customer), network, proofImage, trackingId], function(err) {
    if (err) {
      console.error("Erreur insertion manual_payment:", err);
      return res.status(500).json({ error: "Erreur lors de la soumission de votre paiement." });
    }
    res.status(201).json({ success: true, trackingId, message: "Paiement soumis avec succès. En attente de validation." });
  });
});

app.get('/api/payment/track/:trackingId', (req, res) => {
  const { trackingId } = req.params;
  db.get(`SELECT program_id, status FROM manual_payments WHERE tracking_id = ?`, [trackingId], (err, row) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    if (!row) return res.status(404).json({ error: "Lien de suivi invalide ou introuvable." });
    res.json({ success: true, programId: row.program_id, status: row.status });
  });
});

app.get('/api/admin/manual-payments', (req, res) => {
  db.all(`SELECT * FROM manual_payments ORDER BY id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    const parsed = rows.map(r => {
      try { r.customer_info = JSON.parse(r.customer_info); } catch(e) {}
      return r;
    });
    res.json(parsed);
  });
});

app.post('/api/admin/manual-payments/:id/approve', (req, res) => {
  const { id } = req.params;
  
  db.get(`SELECT * FROM manual_payments WHERE id = ?`, [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "Paiement introuvable." });
    if (row.status === 'approved') return res.status(400).json({ error: "Déjà approuvé." });

    let customer = row.customer_info;
    if (typeof customer === 'string') {
      try { customer = JSON.parse(customer); } catch(e) {}
    }
    
    const enrollQuery = `INSERT INTO enrollments (nom, email, whatsapp, niveau, programme) VALUES (?, ?, ?, ?, ?)`;
    const programNames = {
      'woman-king': 'Woman King Trade',
      'strategie-3s': 'Stratégie 3S',
      'coaching-free': 'Coaching One-to-One (1ère Séance)',
      'coaching': 'Coaching One-to-One (Suivi)',
      'ebook-vision': 'E-Book : De la vision à la maîtrise',
      'ebook-positionner': 'E-Book : Se positionner intelligemment'
    };
    const programmeName = programNames[row.program_id] || row.program_id;
    
    db.run(enrollQuery, [`${customer.firstname} ${customer.lastname}`, customer.email, customer.whatsapp, 'N/A', programmeName], (err2) => {
      if (err2) console.error("Erreur insertion enrollments:", err2);
      
      db.run(`UPDATE manual_payments SET status = 'approved' WHERE id = ?`, [id], (err3) => {
        
        db.all("SELECT key, value FROM content WHERE section = 'mail'", (errMail, rowsMail) => {
          if (!errMail && rowsMail && rowsMail.length > 0) {
            const mailConfig = {};
            rowsMail.forEach(r => { mailConfig[r.key] = r.value });
            
            if (mailConfig.smtp_user && mailConfig.smtp_pass) {
              const transporter = require('nodemailer').createTransport({
                host: mailConfig.smtp_host || 'smtp.gmail.com',
                port: parseInt(mailConfig.smtp_port) || 465,
                secure: parseInt(mailConfig.smtp_port) === 465,
                auth: { user: mailConfig.smtp_user, pass: mailConfig.smtp_pass }
              });

              let textContent = `Bonjour ${customer.firstname},\n\nVotre paiement a été validé avec succès pour : ${programmeName}.\n\n`;
              if (row.program_id === 'ebook-vision' || row.program_id === 'ebook-positionner') {
                const link = row.program_id === 'ebook-vision' ? 'https://projetrosekakpo.onrender.com/EBOOK_FIGURE_BOUGIE_ROSE.pdf' : 'https://projetrosekakpo.onrender.com/GUIDE_PRATIQUE_POUR_DEBUTER_LE_TRADING_ROSE_KAKPO.pdf';
                textContent += `Voici le lien pour télécharger votre E-Book : ${link}\n\n`;
              } else if (row.program_id === 'woman-king') {
                textContent += `Veuillez rejoindre le groupe WhatsApp exclusif de la formation Woman King Trade :\nWhatsApp: https://chat.whatsapp.com/EpqfnVvALmuCKrJ9FlK70P?s=cl&p=i&mlu=4\n\n`;
              } else {
                textContent += `Veuillez rejoindre nos canaux de communication :\nWhatsApp: https://chat.whatsapp.com/JwQ5Bk2S8AmAmdhZHq6AlA\nTelegram: https://t.me/+hXBcjA-rPjpmZGRk\n\n`;
              }
              textContent += `Merci pour votre confiance,\nL'équipe Rose Kakpo`;

              const mailOptions = {
                from: `"Rose Kakpo" <${mailConfig.smtp_user}>`,
                to: customer.email,
                subject: `Accès à votre programme : ${programmeName}`,
                text: textContent
              };

              transporter.sendMail(mailOptions, (error) => {
                if (error) console.error("Erreur d'envoi d'email :", error);
              });
            }
          }
        });

        res.json({ success: true });
      });
    });
  });
});

app.delete('/api/admin/manual-payments/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM manual_payments WHERE id = ?`, [id], function(err) {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur Backend démarré sur http://localhost:${PORT}`);
});
