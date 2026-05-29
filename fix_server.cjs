const fs = require('fs');

let content = fs.readFileSync('backend/server.js', 'utf8');

const markerStart = '\n// --- PAIEMENTS MANUELS ---';
const markerEnd = '\nconst PORT = process.env.PORT || 3001;\n';

if (content.indexOf(markerStart) !== -1) {
  const startIndex = content.indexOf(markerStart);
  const endIndex = content.indexOf(markerEnd);
  
  if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
    const blockToMove = content.substring(startIndex, endIndex);
    
    // Remove the block
    content = content.replace(blockToMove, '');
    
    // Insert it before app.listen(PORT
    content = content.replace('app.listen(PORT', blockToMove + '\napp.listen(PORT');
    
    fs.writeFileSync('backend/server.js', content, 'utf8');
    console.log("server.js fixed!");
  } else {
    console.log("Could not find markers correctly.");
  }
} else {
  console.log("PAIEMENTS MANUELS not found.");
}
