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
            description: 'Découvrez la puissance de l\'analyse des bougies japonaises.',
            image: '/cover-positionner.jpeg'
          },
          {
            id: 2,
            slug: 'ebook-positionner',
            title: 'Se positionner intelligemment',
            price: 15.00,
            description: 'Le guide pratique pour débuter le trading sereinement.',
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
              {ebooks.map((ebook, index) => {
                const testimonials = ebook.testimonials_json ? JSON.parse(ebook.testimonials_json) : [];
                return (
                <div key={ebook.id} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className="ebook-cover-card glass-panel" style={{ animationDelay: `${index * 100}ms`, height: '100%' }}>
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
                  
                  {testimonials.length > 0 && (
                    <div className="ebook-testimonials animate-fade-up">
                      <h4 className="text-center text-gradient" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Ce qu'elles en disent</h4>
                      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}>
                        {testimonials.map((img, idx) => (
                          <div key={idx} style={{ flex: '0 0 auto', width: '200px', scrollSnapAlign: 'center', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                            <img src={img} alt={`Avis ${idx + 1}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </div>
  )
}

export default Ebooks
