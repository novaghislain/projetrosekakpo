import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, TrendingUp, Award, CheckCircle, BookOpen, Target } from 'lucide-react'
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

      {/* Section Mon Regard sur les Marchés */}
      <section id="mon-regard" className="section" style={{ background: 'linear-gradient(180deg, rgba(46, 111, 64, 0.04) 0%, rgba(236, 72, 153, 0.03) 100%)' }}>
        <div className="container animate-fade-up">
          <div className="program-detail-container" style={{ alignItems: 'flex-start', gap: '3.5rem' }}>
            <div className="program-detail-content glass-panel p-8" style={{ flex: '1.2', borderColor: 'rgba(46, 111, 64, 0.25)' }}>
              <div className="badge" style={{ backgroundColor: '#2E6F40', color: '#fff', border: 'none' }}>
                <TrendingUp size={16} /> Opportunités Quotidiennes
              </div>
              <h2 className="text-gradient" style={{ fontSize: '2.1rem', marginBottom: '0.5rem' }}>
                MON REGARD SUR LES MARCHÉS AU QUOTIDIEN
              </h2>
              <p style={{ fontSize: '1.15rem', fontWeight: '600', color: '#2E6F40', marginBottom: '1.5rem' }}>
                Les opportunités que je repère sur les marchés, directement sur votre compte.
              </p>

              <div className="program-desc" style={{ color: 'var(--color-gray-700)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                <p style={{ marginBottom: '1rem' }}>
                  Je mets mon expérience et mon temps au service de l’analyse des marchés pour identifier les opportunités que je décide de trader.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  Vous recevez mes positions au moment où je les prends et pouvez les reproduire directement sur votre compte.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  Vous n’avez plus besoin de passer des heures à surveiller les graphiques ou à rechercher vous-même les configurations intéressantes. Vous bénéficiez simplement du travail que je réalise chaque jour sur les marchés.
                </p>
                <p style={{ fontWeight: '600', color: 'var(--color-brand-pink)', marginBottom: '1.5rem' }}>
                  Accédez à mes opportunités de trading au quotidien.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(46, 111, 64, 0.15)', marginBottom: '2rem' }}>
                <h4 style={{ color: '#2E6F40', fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  CE QUE VOUS RECEVEZ :
                </h4>
                <ul className="detail-features" style={{ marginBottom: 0 }}>
                  <li><span style={{ fontSize: '1.3rem' }}>📊</span> <span>Mes opportunités de trading</span></li>
                  <li><span style={{ fontSize: '1.3rem' }}>💸</span> <span>Mes positions et leurs évolutions</span></li>
                  <li><span style={{ fontSize: '1.3rem' }}>🔎</span> <span>Les marchés que je surveille</span></li>
                  <li><span style={{ fontSize: '1.3rem' }}>⏱️</span> <span>Un gain de temps considérable</span></li>
                  <li><span style={{ fontSize: '1.3rem' }}>💡</span> <span>L’accès à mon expérience et à mon analyse quotidienne</span></li>
                </ul>
              </div>

              {/* Grille des tarifs / offres */}
              <div className="coaching-options" style={{ marginTop: '1.5rem' }}>
                {/* Offre 1 Mois */}
                <div className="coaching-option-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div className="option-header" style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
                      <h4 style={{ fontSize: '1.1rem' }}>🔹 Abonnement 1 mois</h4>
                      <span className="price" style={{ color: '#2E6F40', fontWeight: '800' }}>
                        {(prices['mon-regard-1m'] || 35000).toLocaleString()} F CFA
                      </span>
                    </div>
                    <p className="option-desc" style={{ marginTop: '12px' }}>
                      Accès à Mon regard sur les marchés pendant 1 mois.
                    </p>
                  </div>
                  <Link to="/checkout?program=mon-regard-1m" className="btn btn-outline small-btn mt-3" style={{ width: '100%', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderColor: '#2E6F40', color: '#2E6F40' }}>
                    👉 Accéder (1 mois)
                  </Link>
                </div>

                {/* Offre Spéciale 3 Mois */}
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
                    <p className="option-desc" style={{ marginTop: '10px', color: '#2E6F40', fontWeight: '700' }}>
                      ➡️ Économisez 40 000 F CFA
                    </p>
                    <p className="option-desc" style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                      Bénéficiez de 3 mois complets pour le prix d’environ 1 mois + 2 semaines.
                    </p>
                  </div>
                  <Link to="/checkout?program=mon-regard-3m" className="btn btn-primary small-btn mt-3" style={{ width: '100%', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                    👉 PROFITER DE L'OFFRE 3 MOIS
                  </Link>
                </div>
              </div>
            </div>

            {/* Photos & Bannières du produit */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '480px' }}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', border: '3px solid white', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.12)' }}>
                <img src="/mon-regard-sur-le-marche.png" alt="Mon Regard sur le Marché - Rose Kakpo" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <Link to="/checkout?program=mon-regard-3m" style={{ display: 'block', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(46, 111, 64, 0.2)', boxShadow: '0 10px 30px rgba(46, 111, 64, 0.15)', transition: 'transform 0.3s ease' }}>
                <img src="/offre-speciale-3mois.png" alt="Offre Spéciale 3 Mois - 65 000 FCFA" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Program 1 */}
      <section id="woman-king" className="section">
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
              <li><CheckCircle size={20} className="text-pink" /> Initiation au trading</li>
              <li><CheckCircle size={20} className="text-pink" /> Base essentiel</li>
              <li><CheckCircle size={20} className="text-pink" /> Méthode d’analyse et stratégie</li>
              <li><CheckCircle size={20} className="text-pink" /> Communauté féminine</li>
              <li><CheckCircle size={20} className="text-pink" /> Suivi et motivation</li>
              <li><CheckCircle size={20} className="text-pink" /> Plan d’action pour générer minimum 1000usd par mois grâce au trading</li>
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

      {/* Program 2 */}
      <section id="strategie-3s" className="section">
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
              <li><CheckCircle size={20} className="text-pink" /> Structurer son trading</li>
              <li><CheckCircle size={20} className="text-pink" /> Améliorer son analyse</li>
              <li><CheckCircle size={20} className="text-pink" /> Travailler la psychologie</li>
              <li><CheckCircle size={20} className="text-pink" /> Développer une stratégie claire</li>
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

      {/* Program 3 */}
      <section id="coaching" className="section">
        <div className="container program-detail-container animate-fade-up delay-300">
          <div className="program-detail-content glass-panel p-8 border-pink">
            <div className="badge"><Target size={14} /> Niveau : Tous niveaux</div>
            <h2 className="text-gradient-pink">Coaching One-to-One</h2>
            <p className="program-desc">
              Réserve un coaching individuel personnalisé pour poser tes questions, débloquer 
              une difficulté ou bénéficier d'un accompagnement adapté à ton niveau.
            </p>
            <ul className="detail-features">
              <li><CheckCircle size={20} className="text-pink" /> Coaching individuel</li>
              <li><CheckCircle size={20} className="text-pink" /> Appel Zoom ou WhatsApp</li>
              <li><CheckCircle size={20} className="text-pink" /> Analyse personnalisée</li>
              <li><CheckCircle size={20} className="text-pink" /> Audit trading</li>
              <li><CheckCircle size={20} className="text-pink" /> Accompagnement adapté</li>
            </ul>
            <div className="coaching-options">
              <div className="coaching-option-card">
                <div className="option-header">
                  <h4>1ère Séance</h4>
                  <span className="price text-green">Offerte</span>
                </div>
                <p className="option-desc">Idéal pour faire le point, analyser votre profil et définir un plan.</p>
                <Link to="/checkout?program=coaching-free" className="btn btn-outline small-btn mt-2" style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Réserver
                </Link>
              </div>

              <div className="coaching-option-card highlighted">
                <div className="option-header">
                  <h4>Séance Suivi</h4>
                  <span className="price text-pink">{prices['coaching'] ? `${prices['coaching'].toLocaleString()} FCFA` : 'Chargement...'}</span>
                </div>
                <p className="option-desc">Session approfondie d'une heure pour auditer vos graphiques et vos trades.</p>
                <Link to="/checkout?program=coaching" className="btn btn-primary small-btn mt-2" style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Réserver un suivi
                </Link>
              </div>
            </div>
          </div>
          <div className="program-detail-photo">
            <img src="/visio.jpg" alt="Coaching One-to-One" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>


    </div>
  )
}

export default Programs
