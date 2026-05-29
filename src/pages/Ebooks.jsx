import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import './Programs.css' // We can reuse the same CSS
import { API_URL } from '../config';

const Ebooks = () => {
  const { c } = useContent()
  const [ebooks, setEbooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/ebooks`)
      .then(res => {
        if (!res.ok) throw new Error("API not found");
        return res.json();
      })
      .then(data => {
        setEbooks(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Erreur lors de la récupération des ebooks, utilisation des données de secours", err)
        // Fallback data if backend is not available (e.g. on Vercel without a connected backend)
        setEbooks([
          {
            id: 1,
            slug: 'ebook-vision',
            title: 'De la vision à la maîtrise',
            price: 15.00,
            description: `Tu peux passer des années à trader… ou poser dès maintenant les bonnes bases.

De la vision à la maîtrise du Trading est un guide pratique et structuré conçu pour t’aider à comprendre le marché simplement, sans surcharge ni confusion.

Tu y découvriras :
• Les bases essentielles pour analyser le marché
• Comment construire un vrai plan de trading
• La gestion du risque et du capital
• La psychologie du trader
• Des conseils concrets adaptés aux débutants

Une méthode claire, pratique et orientée résultats pour avancer avec confiance et arrêter d’improviser.`,
            image: '/cover-positionner.jpeg'
          },
          {
            id: 2,
            slug: 'ebook-positionner',
            title: 'Se positionner intelligemment',
            price: 15.00,
            description: `Et si les bougies du marché pouvaient enfin devenir un langage que tu comprends réellement ?

Dans cet ebook, tu vas apprendre à reconnaître les figures de bougies les plus importantes, comprendre ce qu’elles signifient et surtout savoir comment les utiliser pour éviter les entrées inutiles et mieux te positionner sur le marché.

Un guide simple, pratique et accessible, conçu pour t’aider à développer une lecture plus intelligente du marché même si tu débutes en trading.`,
            image: '/book.png'
          }
        ])
        setLoading(false)
      })
  }, [])

  return (
    <div className="programs-page">
      <section className="page-header pink-bg-light text-center animate-fade-up">
        <div className="container">
          <h1 className="text-gradient">{c('ebooks_title', 'E-Books & Ressources Exclusives')}</h1>
          <p className="page-subtitle">{c('ebooks_subtitle', 'Accélérez votre apprentissage avec mes guides pratiques et ressources téléchargeables.')}</p>
        </div>
      </section>

      <section id="ebooks" className="section bg-light" style={{ minHeight: '60vh' }}>
        <div className="container animate-fade-up delay-100">
          
          {loading ? (
            <div className="text-center" style={{ padding: '4rem 0' }}>
              <div className="spinner"></div>
              <p>Chargement des ebooks...</p>
            </div>
          ) : ebooks.length === 0 ? (
            <div className="text-center text-gray" style={{ padding: '4rem 0' }}>
              <p>Aucun ebook n'est disponible pour le moment.</p>
            </div>
          ) : (
            <div className="ebooks-only-grid">
              {ebooks.map((ebook, index) => (
                <div key={ebook.id} className="ebook-cover-card glass-panel" style={{ animationDelay: `${index * 100}ms` }}>
                  <Link to={`/checkout?program=${ebook.slug}`} className="ebook-cover-link">
                    {ebook.image ? (
                      <img src={ebook.image} alt={ebook.title} className="ebook-cover-image" />
                    ) : (
                      <div className="ebook-cover-placeholder">
                        <BookOpen size={64} color="var(--color-brand-pink)" opacity={0.5} />
                      </div>
                    )}
                    <div className="ebook-cover-overlay">
                      <BookOpen className="ebook-overlay-icon" size={32} />
                      <h3>{ebook.title}</h3>
                      <p>{ebook.description}</p>
                      <span className="ebook-overlay-btn">Obtenir cet E-Book (${ebook.price})</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}

export default Ebooks
