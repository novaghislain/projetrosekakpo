const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

const articles = [
  {
    title: "Comment analyser une tendance de marché comme un pro",
    category: "Trading",
    excerpt: "Découvrez les secrets de l'analyse technique pour ne plus jamais trader à l'envers du marché.",
    date: "24 Mai 2024",
    readTime: "5 min",
    content: `
      <p>L'analyse technique est la fondation absolue de tout bon trader. Avant de prendre une position sur le marché, il est impératif de savoir dans quelle direction les prix se dirigent globalement. Beaucoup de débutants cherchent la formule magique ou l'indicateur parfait, mais ils oublient l'essentiel : la structure du marché.</p>
      <p>Dans cet article, je vous montre comment les professionnels lisent un graphique nu pour déterminer la tendance de fond et maximiser leurs chances de réussite.</p>
      
      <h2>1. Qu'est-ce qu'une tendance ?</h2>
      <p>Le marché ne monte et ne descend jamais en ligne droite parfaite. Il évolue en formant des vagues (des creux et des sommets). Une tendance haussière claire est caractérisée par des sommets de plus en plus hauts et des creux de plus en plus hauts (Higher Highs et Higher Lows). À l'inverse, une tendance baissière est une succession de sommets et de creux de plus en plus bas.</p>
      
      <h2>2. L'importance des unités de temps (Multi-Timeframe Analysis)</h2>
      <p>L'erreur classique est d'analyser son graphique en 5 minutes et d'ignorer ce qui se passe en 4 heures ou en journalier (Daily). Pour analyser comme un pro, commencez toujours par les grandes unités de temps pour identifier la "marée", puis zoomez sur les petites unités de temps pour trouver vos points d'entrée.</p>
      
      <h2>3. Ne jamais trader contre la tendance principale</h2>
      <p>Comme on dit souvent sur les marchés : "Trend is your friend" (La tendance est ton amie). Acheter dans une forte tendance baissière, c'est comme essayer d'attraper un couteau qui tombe : vous allez forcément vous couper. Attendez toujours que le prix confirme un retournement avec des figures chartistes solides avant d'envisager de trader à contre-courant.</p>
      
      <h2>4. Les outils pour confirmer la tendance</h2>
      <p>Apprenez à tracer correctement vos droites de tendance en reliant au moins deux ou trois points de contact majeurs. Les moyennes mobiles (comme la moyenne mobile 50 ou 200 périodes) sont également d'excellents indicateurs visuels pour savoir d'un seul coup d'œil si le marché est dominé par les acheteurs ou par les vendeurs.</p>
    `
  },
  {
    title: "Le Mindset du Trader : Dompter la peur et la cupidité",
    category: "Psychologie",
    excerpt: "La psychologie représente 80% de la réussite en trading. Apprenez à gérer vos émotions pour protéger vos gains.",
    date: "22 Mai 2024",
    readTime: "6 min",
    content: `
      <p>Vous avez la meilleure stratégie du monde, mais vous perdez quand même de l'argent ? C'est tout à fait normal. En trading, la technique ne représente qu'une petite partie de l'équation. Le véritable combat se déroule dans votre esprit.</p>
      <p>La peur de perdre et la cupidité sont les deux pires ennemies du trader débutant. Voyons comment les professionnels entraînent leur cerveau à penser en termes de probabilités.</p>

      <h2>1. Le FOMO (Fear of Missing Out) : La peur de rater le mouvement</h2>
      <p>Voir un cours s'envoler sans vous peut être frustrant. La réaction humaine classique est de sauter dans le train en marche, souvent au pire moment (juste avant une correction). Un trader discipliné sait que les opportunités sur le marché sont infinies. Si vous manquez un mouvement, attendez le prochain.</p>

      <h2>2. L'impatience et l'overtrading</h2>
      <p>Vouloir récupérer ses pertes immédiatement (le "revenge trading") est le moyen le plus rapide de vider un compte. Apprenez à accepter les pertes comme de simples frais de fonctionnement de votre entreprise de trading.</p>

      <h2>3. Comment développer la discipline de fer</h2>
      <p>Tenez un journal de trading rigoureux. Notez non seulement vos points d'entrée et de sortie, mais également votre état émotionnel au moment de prendre la position. Avec le temps, vous identifierez des schémas de comportement autodestructeurs à éliminer.</p>
    `
  },
  {
    title: "Les bases de la liberté financière : Gérer et investir",
    category: "Éducation Financière",
    excerpt: "Avant de trader, apprenez à gérer vos finances personnelles. Découvrez comment structurer votre budget et vos investissements.",
    date: "18 Mai 2024",
    readTime: "7 min",
    content: `
      <p>L'éducation financière est cruellement absente du système scolaire traditionnel. Pourtant, savoir gagner de l'argent est inutile si l'on ne sait pas le conserver et le faire fructifier.</p>
      <p>Le trading ne devrait jamais être votre seule source de revenus, surtout au début. Il doit s'inscrire dans une stratégie globale d'éducation financière et de gestion de patrimoine.</p>

      <h2>1. La règle des 50/30/20</h2>
      <p>Pour gérer vos revenus intelligemment, essayez de répartir vos entrées d'argent de la manière suivante : 50% pour vos besoins essentiels (loyer, factures, nourriture), 30% pour vos envies et loisirs, et 20% pour votre épargne et vos investissements (y compris votre capital de trading).</p>

      <h2>2. Le fonds d'urgence : Votre bouclier de sécurité</h2>
      <p>N'investissez jamais d'argent dont vous pourriez avoir besoin à court terme. Avant de placer le moindre centime en bourse ou sur les marchés de devises, constituez-vous un fonds d'urgence équivalent à 3 à 6 mois de dépenses courantes.</p>

      <h2>3. L'effet des intérêts cumulés</h2>
      <p>Comprenez la puissance du temps. Investir régulièrement de petites sommes produit des résultats spectaculaires sur le long terme grâce aux intérêts cumulés. Considérez le trading comme un accélérateur, mais gardez une base d'investissement passive et diversifiée.</p>
    `
  },
  {
    title: "Les 5 erreurs fatales des débutants en trading",
    category: "Erreurs de Débutants",
    excerpt: "Évitez ces pièges qui coûtent cher et commencez votre parcours sur des bases solides.",
    date: "20 Mai 2024",
    readTime: "4 min",
    content: `
      <p>Quand on débute en trading, l'enthousiasme nous pousse souvent à griller les étapes. On veut des résultats immédiats, on rêve d'indépendance, et c'est exactement là que le marché nous sanctionne. Voici les 5 erreurs les plus courantes qui ruinent le capital des débutants.</p>

      <h2>1. Trader sans plan (ou le changer en cours de route)</h2>
      <p>Prendre une position parce que "je le sens bien" n'est pas du trading, c'est du casino. Vous devez avoir une checklist stricte avant chaque trade. Pire encore : modifier son stop loss parce que le prix s'en approche est le meilleur moyen de liquider son compte.</p>

      <h2>2. Ignorer la gestion du risque (Money Management)</h2>
      <p>C'est l'erreur la plus fatale. Risquer 10% ou 20% de son capital sur un seul trade est du suicide financier. Les professionnels ne risquent que 1% ou 2% par position. L'objectif premier d'un trader n'est pas de faire de l'argent, mais de protéger son capital.</p>

      <h2>3. La sur-négociation (Overtrading)</h2>
      <p>Rester devant l'écran 8 heures par jour finit par créer de fausses opportunités. L'ennui pousse au clic. En réalité, un bon trader prend parfois seulement 2 ou 3 trades par semaine. La patience paie infiniment plus que l'hyperactivité.</p>

      <h2>4. Chercher le "Graal" des indicateurs</h2>
      <p>Les débutants passent d'un indicateur à l'autre dès qu'ils subissent une perte. Le RSI, le MACD, les bandes de Bollinger... Aucun indicateur ne prédit l'avenir. La maîtrise de la simple action des prix (Price Action) sera toujours supérieure à un graphique rempli de couleurs.</p>

      <h2>5. Trader avec de l'argent dont on a besoin</h2>
      <p>Trader l'argent de son loyer ou de ses courses ajoute une pression psychologique insoutenable. Vous allez prendre de mauvaises décisions parce que vous *devez* gagner. Le trading doit se faire avec un capital alloué spécifiquement à cela, dont la perte ne changera pas votre niveau de vie.</p>
    `
  },
  {
    title: "La routine quotidienne pour maximiser sa productivité",
    category: "Motivation & Productivité",
    excerpt: "Le succès ne doit rien au hasard. Découvrez comment planifier vos journées et optimiser votre énergie pour performer.",
    date: "15 Mai 2024",
    readTime: "5 min",
    content: `
      <p>Être performant en trading ou dans n'importe quelle activité entrepreneuriale exige une discipline quotidienne. Votre routine matinale et votre hygiène de vie dictent directement la clarté de vos décisions financières.</p>
      <p>Voici les habitudes clés adoptées par les personnes les plus productives pour maintenir un niveau d'énergie élevé et un focus absolu.</p>

      <h2>1. Planifier la veille pour le lendemain</h2>
      <p>Ne commencez jamais votre journée sans savoir exactement ce que vous allez faire. Établissez une liste de 3 tâches prioritaires (les "Must-Win") la veille au soir. Cela libère de la charge mentale et vous permet d'attaquer directement dès le matin.</p>

      <h2>2. Protéger ses heures de focus profond (Deep Work)</h2>
      <p>Le multitâche est un mythe qui détruit l'efficacité. Consacrez des blocs de 90 minutes sans aucune distraction (téléphone en mode avion, pas de réseaux sociaux) pour vos tâches les plus complexes : analyses de marché, lecture, ou création de contenu.</p>

      <h2>3. La routine du matin : Clarté mentale et forme physique</h2>
      <p>Une bonne routine commence par une déconnexion des écrans au réveil. Prenez le temps de méditer, de lire quelques pages ou de faire un peu d'exercice physique avant de regarder vos notifications ou vos graphiques de trading.</p>
    `
  }
];

db.serialize(() => {
  db.run("DELETE FROM articles");
  const stmt = db.prepare("INSERT INTO articles (title, category, date, readTime, excerpt, content) VALUES (?, ?, ?, ?, ?, ?)");
  for (const a of articles) {
    stmt.run(a.title, a.category, a.date, a.readTime, a.excerpt, a.content);
  }
  stmt.finalize(() => {
    console.log("Articles seedés !");
    db.close();
  });
});
