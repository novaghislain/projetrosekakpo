import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Users, CreditCard, Star, Target, ShieldCheck, Gift } from 'lucide-react';
import './FormationDetails.css';

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      let end;
      if (targetDate) {
        end = new Date(targetDate);
      } else {
        end = new Date();
        end.setHours(23, 59, 59, 999);
      }
      
      const difference = end - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pro-countdown">
      <div className="countdown-item">
        <span className="countdown-num">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="countdown-label">JOURS</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-item">
        <span className="countdown-num">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="countdown-label">HEURES</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-item">
        <span className="countdown-num">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="countdown-label">MINUTES</span>
      </div>
      <span className="countdown-sep">:</span>
      <div className="countdown-item">
        <span className="countdown-num">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="countdown-label">SECONDES</span>
      </div>
    </div>
  );
};

const formatExpirationDate = (dateString) => {
  if (!dateString) return "ce soir à minuit";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `le ${day}/${month}/${year} à ${hours}h${minutes}`;
};

const FormationDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        const response = await fetch(`/api/formations/${slug}`);
        if (!response.ok) {
          throw new Error("Formation introuvable");
        }
        const data = await response.json();
        
        // Parse content_json if it exists and is a string
        if (data.content_json && typeof data.content_json === 'string') {
          try {
            data.content_json = JSON.parse(data.content_json);
          } catch (e) {
            console.error("Erreur parsing content_json", e);
            data.content_json = { subtitle: "", objectives: [], targetAudience: [], included: [], authorBio: "" };
          }
        }
        
        setFormation(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFormation();
  }, [slug]);

  if (loading) {
    return (
      <div className="pro-loading">
        <div className="loader"></div>
        <p>Génération de l'accès...</p>
      </div>
    );
  }

  if (error || !formation) {
    return (
      <div className="pro-error">
        <h2>Oups !</h2>
        <p>Cette page de formation n'existe pas ou a été supprimée.</p>
        <button onClick={() => navigate('/')} className="pro-btn pro-btn-outline mt-4">Retour à l'accueil</button>
      </div>
    );
  }

  const programList = formation.program ? formation.program.split('\n').filter(line => line.trim() !== '') : [];
  const content = formation.content_json || {};
  const objectives = Array.isArray(content.objectives) ? content.objectives : [];
  const audience = Array.isArray(content.targetAudience) ? content.targetAudience : [];
  const included = Array.isArray(content.included) ? content.included : [];

  return (
    <div className="pro-landing-page">
      {/* Aurora Background Effect */}
      <div className="pro-aurora"></div>

      {/* Sticky Mobile Nav */}
      <div className="pro-sticky-nav">
        <div className="sticky-content">
          <div className="sticky-info">
            <span className="sticky-title">{formation.title}</span>
            <span className="sticky-price">{formation.price.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <button onClick={() => navigate(`/checkout?program=${formation.slug}`)} className="pro-btn">
            S'inscrire
          </button>
        </div>
      </div>

      <div className="pro-container">
        <button onClick={() => navigate('/')} className="pro-back-link">
          <ArrowLeft size={18} /> Retour au site
        </button>

        {/* HERO SECTION */}
        <section className="pro-hero">
          <div className="pro-meta-tags animate-fade-down">
            <div className="meta-tag">
              <Target size={16} />
              <span>Niveau : {formation.slug === 'strategie-3s' ? 'Intermédiaire' : 'Débutant / Tous niveaux'}</span>
            </div>
            <div className="meta-tag">
              <Users size={16} />
              <span>{formation.capacity} places restantes</span>
            </div>
            <div className="meta-tag">
              <span className="live-dot" style={{ width: 6, height: 6 }}></span>
              <span style={{ color: 'var(--pro-gold)' }}>Inscriptions ouvertes</span>
            </div>
          </div>
          
          <h1 className="pro-title animate-fade-up">
            {formation.title}
          </h1>
          
          {content.subtitle && (
            <p className="pro-subtitle animate-fade-up delay-1">
              {content.subtitle}
            </p>
          )}

          <div className="pro-hero-grid animate-fade-up delay-2">
            <div className="pro-visual-wrapper">
              <div className="pro-glow-border">
                {formation.image ? (
                  <img src={formation.image} alt={formation.title} className="pro-flyer" />
                ) : (
                  <div className="pro-placeholder">Image de la formation</div>
                )}
              </div>
            </div>

            <div className="pro-hero-actions">
              <div className="pro-price-box">
                <span className="price-amount">{formation.price.toLocaleString('fr-FR')}</span>
                <span className="price-currency">FCFA</span>
              </div>
              
              <div className="pro-urgency-box">
                <div className="urgency-title">
                  <span className="live-dot"></span> 
                  Fermeture des inscriptions {formatExpirationDate(formation.content_json?.expirationDate)}
                </div>
                <CountdownTimer targetDate={formation.content_json?.expirationDate} />
              </div>
              
              <button onClick={() => navigate(`/checkout?program=${formation.slug}`)} className="pro-btn pro-btn-lg pulse-glow w-100 mb-4">
                <CreditCard size={20} /> Rejoindre la formation maintenant
              </button>
              
              <div className="pro-trust-badges">
                <div className="trust-item"><ShieldCheck size={16} /> Paiement 100% Sécurisé</div>
                <div className="trust-item"><Users size={16} /> Accès immédiat</div>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS GRID */}
        <div className="pro-details-grid">
          
          {/* OBJECTIVES */}
          {objectives.length > 0 && (
            <section className="pro-section card-dark">
              <h2 className="section-title"><Target className="text-gold" /> Objectifs de la formation</h2>
              <ul className="pro-list">
                {objectives.map((obj, idx) => (
                  <li key={idx} className="animate-slide-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="pro-icon-box"><CheckCircle2 size={16} /></div>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* AUDIENCE */}
          {audience.length > 0 && (
            <section className="pro-section card-dark">
              <h2 className="section-title"><Users className="text-purple" /> Pour qui est-ce ?</h2>
              <ul className="pro-list list-alt">
                {audience.map((aud, idx) => (
                  <li key={idx}>
                    <div className="pro-icon-box box-purple"><Star size={16} /></div>
                    <span>{aud}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

        </div>

        {/* PROGRAM */}
        {programList.length > 0 && (
          <section className="pro-section program-section card-dark-glow">
            <h2 className="section-title text-center">Ce que vous allez apprendre</h2>
            <div className="program-timeline">
              {programList.map((item, idx) => {
                const text = item.replace(/^•\s*/, '');
                return (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">{text}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* INCLUDED & BIO */}
        <div className="pro-details-grid">
          {included.length > 0 && (
            <section className="pro-section card-dark">
              <h2 className="section-title"><Gift className="text-gold" /> Ce qui est inclus</h2>
              <ul className="pro-list list-gold">
                {included.map((inc, idx) => (
                  <li key={idx}>
                    <div className="pro-icon-box box-gold"><CheckCircle2 size={16} /></div>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {content.authorBio && (
            <section className="pro-section card-dark author-card">
              <h2 className="section-title">Qui suis-je ?</h2>
              <div className="author-content">
                <div className="author-avatar">
                  <span>RK</span>
                </div>
                <div className="author-bio-text" style={{ whiteSpace: 'pre-wrap', textAlign: 'left', width: '100%' }}>
                  {content.authorBio}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* FINAL CTA */}
        <section className="pro-final-cta">
          <h2>Prête à passer au niveau supérieur ?</h2>
          <button onClick={() => navigate(`/checkout?program=${formation.slug}`)} className="pro-btn pro-btn-lg pulse-glow mt-4">
            Rejoindre pour {formation.price.toLocaleString('fr-FR')} FCFA
          </button>
        </section>

      </div>
    </div>
  );
};

export default FormationDetails;
