const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('no-cache')) {
  html = html.replace('<head>', '<head>\n    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />\n    <meta http-equiv="Pragma" content="no-cache" />\n    <meta http-equiv="Expires" content="0" />');
  fs.writeFileSync('index.html', html);
  console.log('Added cache-busting headers');
}
