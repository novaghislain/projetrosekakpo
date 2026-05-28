import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import './Programs.css' // We can reuse the same CSS

const Ebooks = () => {
  const { c } = useContent()

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
          <div className="ebooks-only-grid">
            
            {/* 1st Ebook */}
            <div className="ebook-cover-card glass-panel">
              <Link to="/checkout?program=ebook-positionner" className="ebook-cover-link">
                <img src="/cover-positionner.jpeg" alt={c('ebook1_title', 'Se positionner intelligemment')} className="ebook-cover-image" />
                <div className="ebook-cover-overlay">
                  <BookOpen className="ebook-overlay-icon" size={32} />
                  <h3>{c('ebook1_title', 'Se positionner intelligemment')}</h3>
                  <p>{c('ebook1_desc', 'Le guide pratique pour débuter le trading sereinement.')}</p>
                  <span className="ebook-overlay-btn">Obtenir cet E-Book</span>
                </div>
              </Link>
            </div>

            {/* 2nd Ebook */}
            <div className="ebook-cover-card glass-panel">
              <Link to="/checkout?program=ebook-vision" className="ebook-cover-link">
                <img src="/book.png" alt={c('ebook2_title', 'De la vision à la maîtrise')} className="ebook-cover-image" />
                <div className="ebook-cover-overlay">
                  <BookOpen className="ebook-overlay-icon" size={32} />
                  <h3>{c('ebook2_title', 'De la vision à la maîtrise')}</h3>
                  <p>{c('ebook2_desc', "Découvrez la puissance de l'analyse des bougies japonaises.")}</p>
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
