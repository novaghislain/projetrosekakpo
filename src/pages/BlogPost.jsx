import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import { useState, useEffect } from 'react'
import './BlogPost.css'
import { API_URL } from '../config';

const BlogPost = () => {
  const { id } = useParams()
  const [email, setEmail] = useState('');
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/articles/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setArticle(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur", err);
        setLoading(false);
      });
  }, [id]);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/newsletter`, {
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

  if (loading) {
    return <div className="text-center p-5 mt-5">Chargement de l'article...</div>;
  }

  if (!article) {
    return (
      <div className="blog-post-page text-center" style={{ paddingTop: '150px' }}>
        <h2>Article introuvable</h2>
        <Link to="/blog" className="btn btn-primary mt-4">Retour au blog</Link>
      </div>
    )
  }

  return (
    <div className="blog-post-page">
      <div className="container">
        <Link to="/blog" className="back-link">
          <ArrowLeft size={20} /> Retour aux articles
        </Link>
      </div>

      <article className="post-container">
        <header className="post-header animate-fade-up">
          <span className="post-category">{article.category}</span>
          <h1 className="post-title">{article.title}</h1>
          <div className="post-meta">
            <span><Calendar size={16} /> {article.date}</span>
            <span><Clock size={16} /> Lecture : {article.readTime}</span>
          </div>
        </header>

        {article.image && (
          <div className="post-cover-image-container animate-fade-up delay-100" style={{ width: '100%', marginBottom: '2rem', borderRadius: '16px', overflow: 'hidden', textAlign: 'center', background: 'var(--color-gray-100)' }}>
            <img src={article.image} alt={article.title} style={{ maxWidth: '100%', maxHeight: '700px', width: 'auto', objectFit: 'contain' }} />
          </div>
        )}
        <div className="post-content-layout">

          <div 
            className="post-body animate-fade-up delay-200"
            style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          ></div>
        </div>

        <footer className="post-footer glass-panel animate-fade-up delay-300">
          <div className="author-info">
            <div className="author-avatar pink-bg">RK</div>
            <div>
              <h4 className="text-gradient-pink">{article.author}</h4>
              <p>{article.authorRole}</p>
            </div>
          </div>
          <div className="share-actions">
            <button className="btn btn-outline"><Share2 size={18} /> Partager cet article</button>
          </div>
        </footer>
      </article>

      {/* Newsletter intégrée */}
      <section className="newsletter-section text-center section">
        <div className="container animate-fade-up">
          <div className="newsletter-inner glass-panel">
            <h2 className="text-gradient">Cet article vous a plu ?</h2>
            <p>Rejoignez la newsletter pour recevoir mes prochains conseils directement par email.</p>
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

export default BlogPost
