import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import './Blog.css'

const Blog = () => {
  const [email, setEmail] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  const categories = [
    'Tous',
    'Trading',
    'Psychologie',
    'Éducation Financière',
    'Erreurs de Débutants',
    'Motivation & Productivité'
  ];

  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur de chargement des articles", err);
        setLoading(false);
      });
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (response.ok) {
        alert("Inscription réussie ! Vous recevrez bientôt mes conseils.");
        setEmail('');
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur backend.");
    }
  };

  const filteredArticles = selectedCategory === 'Tous'
    ? articles
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="blog-page">
      <section className="page-header text-center animate-fade-up">
        <div className="container">
          <h1 className="text-gradient">Blog & Ressources</h1>
          <p className="page-subtitle">Conseils, analyses et astuces pour réussir dans le trading et la gestion financière.</p>
        </div>
      </section>

      <section className="section blog-section">
        <div className="container">
          <div className="blog-topics-grid mb-5 animate-fade-up delay-100">
            {categories.map((cat) => (
              <div 
                key={cat} 
                className={`topic-tag ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
          {loading ? (
            <div className="text-center p-5"><p>Chargement des articles...</p></div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center p-5"><p>Aucun article n'a été trouvé dans cette catégorie pour le moment.</p></div>
          ) : (
            <div className="blog-grid">
              {filteredArticles.map((article, index) => (
                <article key={article.id} className={`blog-card glass-panel animate-fade-up delay-${(index % 3) * 100}`}>
                  <div className="blog-content">
                    <div className="blog-meta-top">
                      <span className="blog-category">{article.category}</span>
                      <div className="blog-meta-right">
                        <span><Calendar size={14} /> {article.date}</span>
                        <span><Clock size={14} /> {article.readTime}</span>
                      </div>
                    </div>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <Link to={`/blog/${article.id}`} className="read-more-btn">
                      Lire l'article <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section text-center section">
        <div className="container animate-fade-up delay-200">
          <div className="newsletter-inner glass-panel">
            <h2 className="text-gradient-pink">Ne manquez aucun article</h2>
            <p>Rejoignez la newsletter pour recevoir mes meilleurs conseils directement par email.</p>
            <form className="inline-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Votre adresse email" 
                required 
                className="glass-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">S'abonner</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog
