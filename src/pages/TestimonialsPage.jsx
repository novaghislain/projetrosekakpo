import React from 'react';
import { Star } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import './Home.css'; // Pour réutiliser le style des cartes

const TestimonialsPage = () => {
  const { content } = useContent();
  
  let dynamicTestimonials = [];
  if (content?.testimonials?.value) {
    try {
      dynamicTestimonials = JSON.parse(content.testimonials.value);
    } catch(e) {}
  }

  return (
    <div className="page-container" style={{ minHeight: '80vh', paddingTop: '120px' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-gradient">Ils m'ont fait confiance</h1>
          <p className="subtitle">Découvrez les retours et témoignages de la communauté Rose Kakpo.</p>
        </div>

        {dynamicTestimonials.length === 0 ? (
          <div className="text-center p-8 glass-panel animate-fade-up delay-100">
            <p>Aucun témoignage n'est encore disponible pour le moment.</p>
          </div>
        ) : (
          <div className="testimonials-grid animate-fade-up delay-100">
            {dynamicTestimonials.map(t => (
              <div key={t.id} className="testimonial-card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {/* Affichage de la capture d'écran si elle existe */}
                {(t.images && t.images.length > 0) ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px' }}>
                    {t.images.map((img, i) => (
                      <div key={i} style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                        <img src={img} alt={`Témoignage de ${t.nom || 'Client'} - capture ${i+1}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    ))}
                  </div>
                ) : (t.image && (
                  <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
                    <img src={t.image} alt={`Témoignage de ${t.nom || 'Client'}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                ))}
                
                <div className="stars">
                  {Array(t.rating).fill(0).map((_, i) => <Star key={i} fill="#F472B6" color="#F472B6" size={20} />)}
                </div>
                {t.message && <p className="testimonial-text">"{t.message}"</p>}
                {t.nom && <p className="testimonial-author">- {t.nom}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPage;
