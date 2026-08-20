import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Users, Award, BookOpen, Star, Lightbulb, Target, CheckCircle2 } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import { trackLeadOnce } from '../components/FacebookPixel'
import './Home.css'

const Home = () => {
  const { content } = useContent();

  const getHeroTitle = () => {
    let title = 'Le trading simplifié pour les femmes ambitieuses';
    // On enlève d'éventuels vieux tags span pour être sûr
    title = title.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');
    // On force le dégradé en CSS en ligne pour contourner tout conflit de style
    title = title.replace(/(ambitieuses)/i, '<span style="background: linear-gradient(135deg, var(--color-brand-pink), var(--color-brand-green)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">$1</span>');
    return title;
  };

  const handleWhatsappClick = () => {
    trackLeadOnce('home_contact_rose');
  };

  return (
    <div className="home">
      {/* 1. Hero Section */}
      <section className="hero">
        <div className="container hero-container animate-fade-up">
          <div className="hero-content">
            <h1 dangerouslySetInnerHTML={{ __html: getHeroTitle() }} />
            <p className="hero-subtitle">
              {"Maîtrisez le trading et prenez le contrôle de vos finances. Je vous accompagne pas-à-pas vers la rentabilité grâce à des stratégies simples et une discipline de fer."}
            </p>

            <ul className="hero-benefits">
              <li><CheckCircle2 size={20} className="text-pink" /> <span>Approche 100% adaptée aux débutants</span></li>
              <li><CheckCircle2 size={20} className="text-pink" /> <span>Communauté active et bienveillante</span></li>
            </ul>

            <div className="hero-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/programs#woman-king" className="btn btn-primary">
                  Découvrir Woman King Trade <ArrowRight size={18} />
                </Link>
                <Link to="/programs#strategie-3s" className="btn btn-secondary">
                  Découvrir la Stratégie 3S
                </Link>
              </div>
              <Link to="/programs#mon-regard" className="btn btn-secondary" style={{ backgroundColor: '#2E6F40', color: '#fff', borderColor: '#2E6F40' }}>
                Découvrir mon regard sur le marché pour gagner en temps et générer du revenu
              </Link>
            </div>
            <a href="https://wa.me/2290167348956" onClick={(e) => handleWhatsappClick(e, "https://wa.me/2290167348956")} className="btn-text">
              Me contacter
            </a>
          </div>
          <div className="hero-image-placeholder delay-100">
            <div className="image-shape glow-pink" style={{ backgroundImage: "url('/photo1.jpeg')", backgroundSize: "cover", backgroundPosition: "center" }}></div>

            <div className="stats-badge glass-panel float-1">
              <Users size={24} className="text-pink" />
              <div>
                <strong>{'+500'}</strong>
                <span>{'Femmes formées'}</span>
              </div>
            </div>

            <div className="stats-badge small glass-panel float-2">
              <TrendingUp size={20} className="text-green" />
              <div>
                <strong>Stratégie 3S</strong>
                <span>Méthode prouvée</span>
              </div>
            </div>

            <div className="stats-badge small glass-panel float-3">
              <Award size={20} className="text-pink" />
              <div>
                <strong>{'3 ans'}</strong>
                <span>{"D'expérience"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Qui je suis */}
      <section className="about-preview section-light">
        <div className="container about-preview-container animate-fade-up delay-200">
          <div className="about-quote-card glass-panel">
            <div className="quote-icon">
              <Star size={32} className="text-pink" />
            </div>
            <blockquote>
              "{"Le trading n'est pas un jeu de hasard, c'est une compétence qui s'acquiert avec la bonne méthode et la bonne psychologie."}"
            </blockquote>
            <div className="quote-author">
              <strong>Rose Kakpo</strong>
              <span>Guide et Tradeuse</span>
            </div>
          </div>
          <div className="about-content">
            <h2 className="text-gradient">Qui je suis</h2>
            <p dangerouslySetInnerHTML={{ __html: "Je suis <strong>Rose Kakpo</strong>, tradeuse indépendante et membre de la RMICLASS, un écosystème spécialisé dans l'éducation et l’accompagnement dans l’univers du trading. Passionnée par le digital et les marchés financiers, j'accompagne les débutants qui souhaitent apprendre le trading avec plus de simplicité, de compréhension et de proximité." }} />
            <Link to="/about" className="btn btn-primary mt-4">
              En savoir plus sur moi <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Ce que je fais */}
      <section className="services-section section">
        <div className="container">
          <div className="section-header text-center animate-fade-up">
            <h2 className="text-gradient-green">Ce que je fais</h2>
            <p className="subtitle-large">Mes domaines d'expertise pour vous accompagner vers la réussite.</p>
          </div>

          <div className="services-grid">
            <div className="service-card glass-panel animate-fade-up delay-100">
              <div className="service-icon pink-bg">
                <Star size={32} />
              </div>
              <h3>Mes Domaines d'Expertise</h3>
              <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: '15px 0' }}>
                <li style={{ marginBottom: '8px' }}><strong>Formation :</strong> Apprendre et comprendre les bases du trading</li>
                <li style={{ marginBottom: '8px' }}><strong>Accompagnement :</strong> Coaching et suivi continu</li>
                <li style={{ marginBottom: '8px' }}><strong>Éducation Financière :</strong> Conseil pratique pour mieux gérer son argent</li>
                <li style={{ marginBottom: '8px' }}><strong>Motivation et Discipline :</strong> Développement personnel et productivité</li>
              </ul>
            </div>

            <div className="service-card glass-panel animate-fade-up delay-200">
              <div className="service-icon green-bg">
                <TrendingUp size={32} />
              </div>
              <h3>Qu'est ce que le trading ?</h3>
              <p>Une activité qui nous permet d'intervenir sur les marchés financiers dans le but de générer des gains.</p>
            </div>

            <div className="service-card glass-panel animate-fade-up delay-300">
              <div className="service-icon pink-bg">
                <Users size={32} />
              </div>
              <h3>Qui peut exercer le trading ?</h3>
              <p>Le trading est accessible à toute personne motivée à apprendre. Aucune expérience préalable n'est nécessaire lorsqu'on bénéficie d'un accompagnement et d'une méthode claire.</p>
            </div>

            <div className="service-card glass-panel animate-fade-up delay-400">
              <div className="service-icon green-bg">
                <Target size={32} />
              </div>
              <h3>Les outils indispensables pour débuter</h3>
              <ul style={{ textAlign: 'left', paddingLeft: '20px', margin: '15px 0', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '8px' }}>Smartphone ou ordinateur</li>
                <li style={{ marginBottom: '8px' }}>Connexion Internet</li>
                <li style={{ marginBottom: '8px' }}>Formation et accompagnement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Mes programmes / ressources */}
      <section className="programs-section section-light">
        <div className="container">
          <div className="section-header text-center animate-fade-up">
            <h2 className="text-gradient-pink">Mes Programmes & Ressources</h2>
            <p className="subtitle-large">Des formations adaptées à votre niveau pour des résultats concrets.</p>
          </div>

          <div className="programs-grid">
            <div className="program-card animate-fade-up delay-100">
              <div className="program-icon pink-bg"><BookOpen size={28} /></div>
              <h3>Woman King Trade</h3>
              <p>Un programme dédié aux femmes débutantes pour découvrir le trading, créer une seconde source de revenus et atteindre leur indépendance financière dans un environnement bienveillant.</p>
              <Link to="/programs#woman-king" className="btn btn-outline full-width mt-auto" style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Découvrir le programme</Link>
            </div>

            <div className="program-card featured glass-panel animate-fade-up delay-200" style={{ borderColor: 'rgba(46, 111, 64, 0.3)' }}>
              <div className="featured-badge" style={{ background: '#2E6F40' }}>Opportunités</div>
              <div className="program-icon green-bg"><TrendingUp size={28} style={{ color: '#2E6F40' }} /></div>
              <h3>Mon Regard sur les Marchés</h3>
              <p>Recevez mes positions en temps réel et bénéficiez de mon travail quotidien sur les marchés directement sur votre compte pour gagner en temps et générer du revenu.</p>
              <Link to="/programs#mon-regard" className="btn btn-primary full-width mt-auto" style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2E6F40', borderColor: '#2E6F40' }}>Découvrir les opportunités</Link>
            </div>

            <div className="program-card animate-fade-up delay-300">
              <div className="program-icon pink-bg"><Award size={28} /></div>
              <h3>La Stratégie 3S</h3>
              <p>Pour les traders intermédiaires qui stagnent. Structure, analyse et psychologie pour devenir rentable avec une méthode claire.</p>
              <Link to="/programs#strategie-3s" className="btn btn-outline full-width mt-auto" style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Découvrir la Stratégie 3S</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Témoignages */}
      <section className="testimonials-section section">
        <div className="container">
          <div className="section-header text-center animate-fade-up">
            <h2 className="text-gradient">Ils m'ont fait confiance</h2>
            <p className="subtitle-large">Découvrez les retours des personnes que j'ai accompagnées.</p>
          </div>
          <div className="testimonials-grid">
            {(() => {
              let dynamicTestimonials = [];
              if (content?.testimonials?.value) {
                try {
                  dynamicTestimonials = JSON.parse(content.testimonials.value);
                } catch(e) {}
              }

              if (dynamicTestimonials.length > 0) {
                return dynamicTestimonials.map(t => (
                  <div key={t.id} className="testimonial-card glass-panel animate-fade-up">
                    {(t.images && t.images.length > 0) ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                        {t.images.map((img, i) => (
                          <div key={i} style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={img} alt={`Témoignage ${i+1}`} style={{ width: '100%', height: 'auto', display: 'block' }} />
                          </div>
                        ))}
                      </div>
                    ) : (t.image && (
                      <div style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', marginBottom: '15px' }}>
                        <img src={t.image} alt="Témoignage" style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    ))}
                    <div className="stars">
                      {Array(t.rating).fill(0).map((_, i) => <Star key={i} fill="#F472B6" color="#F472B6" size={20} />)}
                    </div>
                    {t.message && <p className="testimonial-text">"{t.message}"</p>}
                    <p className="testimonial-author">- {t.nom}</p>
                  </div>
                ));
              }

              // Fallback to static if none
              return (
                <>
                  <div className="testimonial-card glass-panel animate-fade-up">
                    <div className="stars">
                      <Star fill="#F472B6" color="#F472B6" size={20} />
                      <Star fill="#F472B6" color="#F472B6" size={20} />
                      <Star fill="#F472B6" color="#F472B6" size={20} />
                      <Star fill="#F472B6" color="#F472B6" size={20} />
                      <Star fill="#F472B6" color="#F472B6" size={20} />
                    </div>
                    <p className="testimonial-text">"Formation très claire. J'avais peur de me lancer mais Rose a su rendre les choses tellement simples à comprendre !"</p>
                    <p className="testimonial-author">- Sarah L.</p>
                  </div>
                  <div className="testimonial-card glass-panel animate-fade-up delay-200">
                    <div className="stars">
                      <Star fill="#2E6F40" color="#2E6F40" size={20} />
                      <Star fill="#2E6F40" color="#2E6F40" size={20} />
                      <Star fill="#2E6F40" color="#2E6F40" size={20} />
                      <Star fill="#2E6F40" color="#2E6F40" size={20} />
                      <Star fill="#2E6F40" color="#2E6F40" size={20} />
                    </div>
                    <p className="testimonial-text">"J'ai enfin compris le trading grâce au programme 3S. Ma psychologie a complètement changé devant les graphiques."</p>
                    <p className="testimonial-author">- Marc E.</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </section>

      {/* 7. Appel à l'action */}
      <section className="cta-section section text-center">
        <div className="container cta-container glass-panel animate-fade-up">
          <div className="cta-content-inner">
            <h2 className="text-gradient-pink">Prête à commencer ton parcours financier ?</h2>
            <p>Rejoignez une communauté bienveillante et passez à l'action dès aujourd'hui pour transformer votre avenir.</p>
            <div className="cta-buttons">
              <Link to="/programs#woman-king" className="btn btn-primary">Rejoindre Woman King Trade</Link>
              <Link to="/programs#mon-regard" className="btn btn-secondary" style={{ backgroundColor: '#2E6F40', color: '#fff', borderColor: '#2E6F40' }}>Découvrir mon regard sur le marché</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
