import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, TrendingUp, Award, CheckCircle, BookOpen, Target, BarChart2, DollarSign, Search, Clock, Lightbulb } from 'lucide-react'
import './Programs.css'
import { API_URL } from '../config';

const Programs = () => {
  const [prices, setPrices] = useState({
    'woman-king': 85000,
    'strategie-3s': 105000,
    'mon-regard-1m': 35000,
    'mon-regard-3m': 65000,
    'coaching': 15000
  });

  useEffect(() => {
    fetch(`${API_URL}/api/prices?t=${Date.now()}`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const priceMap = {};
        data.forEach(item => {
          priceMap[item.id] = item.price;
        });
        setPrices(prev => ({ ...prev, ...priceMap }));
      })
      .catch(err => console.error("Error fetching prices:", err));
  }, []);
  return (
    <div className="programs-page">
      <section className="page-header pink-bg-light text-center animate-fade-up">
        <div className="container">
          <h1 className="text-gradient">Formations & Ressources</h1>
          <p className="page-subtitle">Des solutions, accompagnements et opportunités adaptés à chaque niveau.</p>
        </div>
      </section>

      {/* 1. Formation Woman King Trade */}
      <section id="woman-king" className="section" style={{ scrollMarginTop: '90px' }}>
        <div className="container program-detail-container animate-fade-up delay-100">
          <div className="program-detail-content glass-panel p-8">
            <div className="badge"><Target size={14} /> Niveau : Débutant</div>
            <h2 className="text-gradient-pink">Woman King Trade</h2>
            <div className="price-tag mb-4">
              {prices['woman-king'] ? (
                <>Tarif : {prices['woman-king'].toLocaleString()} FCFA <span className="text-sm text-gray-500">(≈ {Math.round(prices['woman-king'] / 625)} USD)</span></>
              ) : (
                <span className="text-sm text-gray-400">Chargement du tarif...</span>
              )}
            </div>
            <p className="program-desc">
              Un programme spécialement conçu pour les femmes qui souhaitent découvrir le trading, 
              développer une nouvelle compétence pour générer une seconde source de revenus et atteindre 
              leur indépendance financière, le tout dans un environnement motivant et accessible.
            </p>
            <ul className="detail-features">
              <li><CheckCircle2 size={20} className="text-pink" style={{ minWidth: '20px', marginTop: '2px' }} /> <span>Initiation au trading</span></li>
              <li><CheckCircle2 size={20} className="text-pink" style={{ minWidth: '20px', marginTop: '2px' }} /> <span>Base essentiel</span></li>
              <li><CheckCircle2 size={20} className="text-pink" style={{ minWidth: '20px', marginTop: '2px' }} /> <span>Méthode d’analyse et stratégie</span></li>
              <li><CheckCircle2 size={20} className="text-pink" style={{ minWidth: '20px', marginTop: '2px' }} /> <span>Communauté féminine</span></li>
              <li><CheckCircle2 size={20} className="text-pink" style={{ minWidth: '20px', marginTop: '2px' }} /> <span>Suivi et motivation</span></li>
              <li><CheckCircle2 size={20} className="text-pink" style={{ minWidth: '20px', marginTop: '2px' }} /> <span>Plan d’action pour générer minimum 1000usd par mois grâce au trading</span></li>
            </ul>
            <Link to="/checkout?program=woman-king" className="btn btn-primary">
              Rejoindre Woman King Trade
            </Link>
          </div>
          <div className="program-detail-photo">
            <img src="/day-trader-upset-after-losing-money-cryptocurrency-investment-due-rug-pull.jpg" alt="Woman King Trade" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* 2. Section Mon Regard sur les Marchés */}
      <section id="mon-regard" className="section" style={{ background: 'linear-gradient(180deg, rgba(46, 111, 64, 0.04) 0%, rgba(236, 72, 153, 0.03) 100%)', scrollMarginTop: '90px' }}>
        <div className="container animate-fade-up">
          <div className="glass-panel p-8 mon-regard-box" style={{ maxWidth: '920px', margin: '0 auto', borderColor: 'rgba(46, 111, 64, 0.25)' }}>
            
            {/* En-tête centré */}
            <div className="mon-regard-header text-center">
              <div className="badge" style={{ backgroundColor: '#2E6F40', color: '#fff', border: 'none', marginBottom: '1.25rem' }}>
                <TrendingUp size={16} /> Opportunités Quotidiennes
              </div>
              <h2 className="text-gradient" style={{ fontSize: '2.2rem', marginBottom: '0.75rem', lineHeight: '1.25' }}>
                MON REGARD SUR LES MARCHÉS AU QUOTIDIEN
              </h2>
              <p style={{ fontSize: '1.2rem', fontWeight: '600', color: '#2E6F40', marginBottom: '2rem' }}>
                Les opportunités que je repère sur les marchés, directement sur votre compte.
              </p>
            </div>

            {/* Photo 1 : Placée directement après le grand titre / sous-titre */}
            <div className="mon-regard-image-wrapper">
              <img src="/mon-regard-sur-le-marche.png" alt="Mon Regard sur le Marché - Rose Kakpo" />
            </div>

            {/* Description ordonnée et NON CENTRÉE (alignée à gauche) */}
            <div className="mon-regard-desc">
              <p>
                Je mets mon expérience et mon temps au service de l’analyse des marchés pour identifier les opportunités que je décide de trader.
              </p>
              <p>
                Vous recevez mes positions au moment où je les prends et pouvez les reproduire directement sur votre compte.
              </p>
              <p>
                Vous n’avez plus besoin de passer des heures à surveiller les graphiques ou à rechercher vous-même les configurations intéressantes. Vous bénéficiez simplement du travail que je réalise chaque jour sur les marchés.
              </p>
            </div>

            {/* Phrase d'accroche LAISSÉE EN MODE CENTRÉ */}
            <div className="mon-regard-cta-text">
              Accédez à mes opportunités de trading au quotidien.
            </div>

            {/* Encadré CE QUE VOUS RECEVEZ - NON CENTRÉ avec symboles professionnels */}
            <div className="mon-regard-features-box">
              <h4 style={{ color: '#2E6F40', fontSize: '1.15rem', fontWeight: '800', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                CE QUE VOUS RECEVEZ :
              </h4>
              <ul className="mon-regard-features-list">
                <li className="mon-regard-feature-item">
                  <div className="mon-regard-icon-badge green">
                    <BarChart2 size={22} />
                  </div>
                  <span>Mes opportunités de trading</span>
                </li>
                <li className="mon-regard-feature-item">
                  <div className="mon-regard-icon-badge pink">
                    <DollarSign size={22} />
                  </div>
                  <span>Mes positions et leurs évolutions</span>
                </li>
                <li className="mon-regard-feature-item">
                  <div className="mon-regard-icon-badge green">
                    <Search size={22} />
                  </div>
                  <span>Les marchés que je surveille</span>
                </li>
                <li className="mon-regard-feature-item">
                  <div className="mon-regard-icon-badge pink">
                    <Clock size={22} />
                  </div>
                  <span>Un gain de temps considérable</span>
                </li>
                <li className="mon-regard-feature-item">
                  <div className="mon-regard-icon-badge green">
                    <Lightbulb size={22} />
                  </div>
                  <span>L’accès à mon expérience et à mon analyse quotidienne</span>
                </li>
              </ul>
            </div>

            {/* Grille des tarifs / offres */}
            <div className="coaching-options" style={{ marginTop: '2rem' }}>
              {/* Offre 1 Mois */}
              <div className="coaching-option-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div className="option-header" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
                    <h4 style={{ fontSize: '1.1rem' }}>🔹 Abonnement 1 mois</h4>
                    <span className="price" style={{ color: '#2E6F40', fontWeight: '800' }}>
                      {(prices['mon-regard-1m'] || 35000).toLocaleString()} F CFA
                    </span>
                  </div>
                  <p className="option-desc" style={{ marginTop: '12px', fontSize: '0.95rem' }}>
                    Accès à Mon regard sur les marchés pendant 1 mois.
                  </p>
                </div>
                <Link to="/checkout?program=mon-regard-1m" className="btn btn-outline small-btn mt-4" style={{ width: '100%', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: '#2E6F40', color: '#2E6F40', fontWeight: '700' }}>
                  👉 Accéder (1 mois)
                </Link>
              </div>

              {/* Offre Spéciale 3 Mois avec Image Bouton Animé */}
              <div className="coaching-option-card highlighted" style={{ borderColor: 'var(--color-brand-pink)', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.06) 0%, rgba(46, 111, 64, 0.06) 100%)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '10px', right: '-30px', background: 'var(--gradient-pink)', color: '#fff', fontSize: '0.75rem', fontWeight: '800', padding: '4px 35px', transform: 'rotate(45deg)', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  TOP OFFRE
                </div>
                <div>
                  <div className="option-header" style={{ borderBottom: '1px solid rgba(236, 72, 153, 0.2)', paddingBottom: '10px' }}>
                    <h4 style={{ color: 'var(--color-brand-pink)', fontWeight: '800', fontSize: '1.15rem' }}>🔥 Offre spéciale — 3 mois</h4>
                    <div>
                      <span className="price text-pink" style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                        {(prices['mon-regard-3m'] || 65000).toLocaleString()} F CFA
                      </span>
                      <div style={{ fontSize: '0.85rem', color: '#888', textDecoration: 'line-through' }}>
                        Au lieu de 105 000 F CFA
                      </div>
                    </div>
                  </div>
                  <p className="option-desc" style={{ marginTop: '10px', color: '#2E6F40', fontWeight: '700', fontSize: '1rem' }}>
                    ➡️ Économisez 40 000 F CFA
                  </p>
                  <p className="option-desc" style={{ fontSize: '0.88rem', color: '#666', marginTop: '6px' }}>
                    Bénéficiez de 3 mois complets pour le prix d’environ 1 mois + 2 semaines.
                  </p>
                </div>

                {/* Bouton Animé Utilisant l'Image Spéciale 3 Mois */}
                <Link to="/checkout?program=mon-regard-3m" className="animated-offer-btn mt-4">
                  <img src="/offre-speciale-3mois.png" alt="Profitez maintenant - Offre Spéciale 3 Mois 65 000 FCFA" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Formation Stratégie 3S */}
      <section id="strategie-3s" className="section" style={{ scrollMarginTop: '90px' }}>
        <div className="container program-detail-container reverse animate-fade-up delay-200">
          <div className="program-detail-content glass-panel p-8 border-pink">
            <div className="badge"><Target size={14} /> Niveau : Intermédiaire</div>
            <h2 className="text-gradient-pink">Stratégie 3S</h2>
            <div className="price-tag mb-4">
              {prices['strategie-3s'] ? (
                <>Tarif : {prices['strategie-3s'].toLocaleString()} FCFA <span className="text-sm text-gray-500">(≈ {Math.round(prices['strategie-3s'] / 625)} USD)</span></>
              ) : (
                <span className="text-sm text-gray-400">Chargement du tarif...</span>
              )}
            </div>
            <p className="program-desc">
              Tu trades déjà mais tu n'arrives pas à évoluer ? Le programme 3S aide les traders 
              à améliorer leur compréhension du marché, leur discipline et leur stratégie.
            </p>
            <ul className="detail-features">
              <li><CheckCircle2 size={20} className="text-pink" style={{ minWidth: '20px', marginTop: '2px' }} /> <span>Structurer son trading</span></li>
              <li><CheckCircle2 size={20} className="text-pink" style={{ minWidth: '20px', marginTop: '2px' }} /> <span>Améliorer son analyse</span></li>
              <li><CheckCircle2 size={20} className="text-pink" style={{ minWidth: '20px', marginTop: '2px' }} /> <span>Travailler la psychologie</span></li>
              <li><CheckCircle2 size={20} className="text-pink" style={{ minWidth: '20px', marginTop: '2px' }} /> <span>Développer une stratégie claire</span></li>
            </ul>
            <Link to="/checkout?program=strategie-3s" className="btn btn-primary">
              Découvrir la Stratégie 3S
            </Link>
          </div>
          <div className="program-detail-photo">
            <img src="/strategie-3s.jpeg" alt="Stratégie 3S" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>


    </div>
  )
}

export default Programs
