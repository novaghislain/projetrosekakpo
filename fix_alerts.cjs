const fs = require('fs');
const file = 'src/pages/Admin.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/alert\(/g, 'toast(');

if (!content.includes('react-hot-toast')) {
  content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport toast, { Toaster } from 'react-hot-toast';");
}

if (!content.includes('<Toaster')) {
  content = content.replace('<div className="admin-dashboard">', '<div className="admin-dashboard">\n      <Toaster position="top-right" toastOptions={{ style: { background: "#fff", color: "#333", border: "1px solid rgba(244, 114, 182, 0.3)", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", borderRadius: "12px", padding: "16px", fontWeight: "600" }, success: { iconTheme: { primary: "#2E6F40", secondary: "#fff" } } }} />');
}

fs.writeFileSync(file, content);
console.log('Replaced all alerts with toast.');
