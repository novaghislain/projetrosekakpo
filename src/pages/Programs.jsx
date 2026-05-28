import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, TrendingUp, Award, CheckCircle, BookOpen, Target } from 'lucide-react'
import './Programs.css'

const Programs = () => {
  const [prices, setPrices] = useState({
    'woman-king': 25000,
    'strategie-3s': 50000,
    'coaching': 15000
  });

  useEffect(() => {
    fetch('/api/prices')
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
          <p className="page-subtitle">Des solutions, accompagnements et ebooks adaptés à chaque niveau.</p>
        </div>
      </section>

      {/* Program 1 */}
      <section id="woman-king" className="section">
        <div className="container program-detail-container animate-fade-up delay-100">
          <div className="program-detail-content glass-panel p-8">
            <div className="badge"><Target size={14} /> Niveau : Débutant</div>
            <h2 className="text-gradient-pink">Woman King Trade</h2>
            <div className="price-tag mb-4">
              Tarif : {prices['woman-king']?.toLocaleString()} FCFA <span className="text-sm text-gray-500">(≈ {Math.round((prices['woman-king'] || 25000) / 625)} USD)</span>
            </div>
            <p className="program-desc">
              Un programme spécialement conçu pour les femmes qui souhaitent découvrir le trading, 
              développer une nouvelle compétence pour générer une seconde source de revenus et atteindre 
              leur indépendance financière, le tout dans un environnement motivant et accessible.
            </p>
            <ul className="detail-features">
              <li><CheckCircle size={20} className="text-pink" /> Initiation au trading</li>
              <li><CheckCircle size={20} className="text-pink" /> Bases essentielles</li>
              <li><CheckCircle size={20} className="text-pink" /> Accompagnement</li>
              <li><CheckCircle size={20} className="text-pink" /> Communauté féminine</li>
              <li><CheckCircle size={20} className="text-pink" /> Suivi et motivation</li>
            </ul>
            <Link to="/checkout?program=woman-king" className="btn btn-primary">
              Rejoindre Woman King Trade
            </Link>
          </div>
          <div className="program-detail-icon pink-bg-light glow-effect-pink" style={{ padding: 0, overflow: 'hidden' }}>
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
              Tarif : {prices['strategie-3s']?.toLocaleString()} FCFA <span className="text-sm text-gray-500">(≈ {Math.round((prices['strategie-3s'] || 50000) / 625)} USD)</span>
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
          <div className="program-detail-icon pink-bg-light glow-effect-pink" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="/tradeuse_woman_and_men.jpg" alt="Stratégie 3S" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                <Link to="/checkout?program=coaching-free" className="btn btn-outline small-btn mt-2">
                  Réserver (Gratuit)
                </Link>
              </div>

              <div className="coaching-option-card highlighted">
                <div className="option-header">
                  <h4>Séance Suivi</h4>
                  <span className="price text-pink">{prices['coaching']?.toLocaleString()} FCFA</span>
                </div>
                <p className="option-desc">Session approfondie d'une heure pour auditer vos graphiques et vos trades.</p>
                <Link to="/checkout?program=coaching" className="btn btn-primary small-btn mt-2">
                  Réserver un suivi
                </Link>
              </div>
            </div>
          </div>
          <div className="program-detail-icon pink-bg-light glow-effect-pink" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="/visio.jpg" alt="Coaching One-to-One" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>


    </div>
  )
}

export default Programs
