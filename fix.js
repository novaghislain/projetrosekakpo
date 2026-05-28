const val1 = "Je suis <strong>Rose Kakpo</strong>, tradeuse indépendante et membre de la RMICLASS, un écosystème spécialisé dans l'éducation et l'accompagnement dans l'univers du trading. Passionnée par le digital et les marchés financiers, j'accompagne les débutants qui souhaitent apprendre le trading avec plus de simplicité, de compréhension et de proximité.";
const val2 = "Lorsque j'ai découvert le trading, je me suis rapidement heurtée à la complexité de cet univers : termes techniques, trop d'informations et très peu de clarté. Comme beaucoup, je m'y suis perdue mais avec le temps, de part ma détermination, l'apprentissage et les <strong>3 années d'expérience</strong> acquises au sein de la <strong>RMICLASS</strong>, j'ai pu développer une compréhension solide des marchés.";

fetch("http://localhost:3001/api/admin/content/about_intro", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ value: val1 })
}).then(r => r.json()).then(console.log);

fetch("http://localhost:3001/api/admin/content/about_story_3", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ value: val2 })
}).then(r => r.json()).then(console.log);
