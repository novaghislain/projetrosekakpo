import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import './Programs.css' // We can reuse the same CSS

const Ebooks = () => {
  return (
    <div className="programs-page">
      <section className="page-header pink-bg-light text-center animate-fade-up">
        <div className="container">
          <h1 className="text-gradient">E-Books & Ressources Exclusives</h1>
          <p className="page-subtitle">Accélérez votre apprentissage avec mes guides pratiques et ressources téléchargeables.</p>
        </div>
      </section>

      <section id="ebooks" className="section bg-light" style={{ minHeight: '60vh' }}>
        <div className="container animate-fade-up delay-100">
          <div className="ebooks-only-grid">
            <div className="ebook-cover-card glass-panel">
              <Link to="/checkout?program=ebook-vision" className="ebook-cover-link">
                <img src="/book-1.png" alt="De la vision à la maîtrise" className="ebook-cover-image" />
                <div className="ebook-cover-overlay">
                  <BookOpen className="ebook-overlay-icon" size={32} />
                  <h3>De la vision à la maîtrise</h3>
                  <p>Découvrez la puissance de l'analyse des bougies japonaises.</p>
                  <span className="ebook-overlay-btn">Obtenir cet E-Book</span>
                </div>
              </Link>
            </div>

            <div className="ebook-cover-card glass-panel">
              <Link to="/checkout?program=ebook-positionner" className="ebook-cover-link">
                <img src="/book.png" alt="Se positionner intelligemment" className="ebook-cover-image" />
                <div className="ebook-cover-overlay">
                  <BookOpen className="ebook-overlay-icon" size={32} />
                  <h3>Se positionner intelligemment</h3>
                  <p>Le guide pratique pour débuter le trading sereinement.</p>
                  <span className="ebook-overlay-btn">Obtenir cet E-Book</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Ebooks
