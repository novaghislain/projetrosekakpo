import fs from 'fs';

let content = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

const customConfirmStr = `
  const customConfirm = (message, onConfirm) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span>{message}</span>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => toast.dismiss(t.id)}>Annuler</button>
          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem', background: '#dc2626' }} onClick={() => { toast.dismiss(t.id); onConfirm(); }}>Confirmer</button>
        </div>
      </div>
    ), { duration: Infinity });
  };
`;

if (!content.includes('customConfirm(')) {
  content = content.replace('const handleCopyLink', customConfirmStr + '\n  const handleCopyLink');
}

// Now we need to replace all window.confirm with customConfirm
// Because customConfirm is asynchronous (it requires a callback), we can't just replace `if (!window.confirm("...")) return;`
// We need to rewrite the function body.

// Example:
// const handleDeleteTestimonial = async (id) => {
//   if (!window.confirm("Supprimer ce témoignage ?")) return;
//   try { ... } catch (e) { ... }
// };
// Becomes:
// const handleDeleteTestimonial = (id) => {
//   customConfirm("Supprimer ce témoignage ?", async () => {
//     try { ... } catch (e) { ... }
//   });
// };

const regex = /const (handleDelete[a-zA-Z0-9_]+) = async \((.*?)\) => {\s*if \(!?window\.confirm\((['"`].*?['"`])\)\) return;\s*([\s\S]*?)\s*};/g;

content = content.replace(regex, (match, funcName, args, message, body) => {
  return `const ${funcName} = (${args}) => {\n    customConfirm(${message}, async () => {\n      ${body}\n    });\n  };`;
});

// Special case for handleDeleteArticle because it's slightly different
const articleRegex = /const handleDeleteArticle = async \(id\) => {\s*if \(window\.confirm\("Voulez-vous vraiment supprimer cet article \?"\)\) {\s*try {([\s\S]*?)} catch \(error\) {([\s\S]*?)}\s*}\s*};/;
content = content.replace(articleRegex, `const handleDeleteArticle = (id) => {
    customConfirm("Voulez-vous vraiment supprimer cet article ?", async () => {
      try {$1} catch (error) {$2}
    });
  };`);

// Special case for handleDeleteCollaborator
const collabRegex = /const handleDeleteCollaborator = async \(id\) => {\s*if \(window\.confirm\("Voulez-vous vraiment supprimer ce collaborateur \?"\)\) {\s*try {([\s\S]*?)} catch \(error\) {([\s\S]*?)}\s*}\s*};/;
content = content.replace(collabRegex, `const handleDeleteCollaborator = (id) => {
    customConfirm("Voulez-vous vraiment supprimer ce collaborateur ?", async () => {
      try {$1} catch (error) {$2}
    });
  };`);

// Also fix the blog category validation
content = content.replace(
  'if (!newArticle.title || !newArticle.content) {',
  'if (!newArticle.title || !newArticle.content || !newArticle.category) {\n      toast("Veuillez remplir le titre, le contenu et choisir une catégorie.");\n      return;\n    }\n    if (!newArticle.title || !newArticle.content) {'
);

fs.writeFileSync('src/pages/Admin.jsx', content);
console.log('Fixed all confirms');
