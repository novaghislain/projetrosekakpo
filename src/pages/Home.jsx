import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Users, Award, BookOpen, Star, Lightbulb, Target, CheckCircle2 } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import './Home.css'

const Home = () => {
  const { c } = useContent();

  return (
    <div className="home">
      {/* 1. Hero Section */}
      <section className="hero">
        <div className="container hero-container animate-fade-up">
          <div className="hero-content">
            <h1 dangerouslySetInnerHTML={{ __html: c('hero_title', 'Le trading simplifié pour les femmes <span class="text-gradient">ambitieuses</span>') }} />
            <p className="hero-subtitle">
              {c('hero_subtitle', "Maîtrisez le trading et prenez le contrôle de vos finances. Je vous accompagne pas-à-pas vers la rentabilité grâce à des stratégies simples et une discipline de fer.")}
            </p>

            <ul className="hero-benefits">
              <li><CheckCircle2 size={20} className="text-pink" /> <span>{c('hero_benefit_1', 'Approche 100% adaptée aux débutants')}</span></li>
              <li><CheckCircle2 size={20} className="text-pink" /> <span>{c('hero_benefit_3', 'Communauté active et bienveillante')}</span></li>
            </ul>

            <div className="hero-buttons">
              <Link to="/programs#woman-king" className="btn btn-primary">
                Rejoindre Woman King Trade <ArrowRight size={18} />
              </Link>
              <Link to="/programs#strategie-3s" className="btn btn-secondary">
                Découvrir la Stratégie 3S
              </Link>
              <Link to="/programs#coaching" className="btn btn-secondary mt-2">
                Réserver un Coaching
              </Link>
            </div>
            <Link to="/contact" className="btn-text">
              Me contacter
            </Link>
          </div>
          <div className="hero-image-placeholder delay-100">
            <div className="image-shape glow-pink" style={{ backgroundImage: "url('/photo1.jpeg')", backgroundSize: "cover", backgroundPosition: "center" }}></div>

            <div className="stats-badge glass-panel float-1">
              <Users size={24} className="text-pink" />
              <div>
                <strong>{c('hero_stat_1', '+500')}</strong>
                <span>{c('hero_stat_1_label', 'Femmes formées')}</span>
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
                <strong>{c('hero_stat_2', '3 ans')}</strong>
                <span>{c('hero_stat_2_label', "D'expérience")}</span>
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
              "{c('about_quote', "Le trading n'est pas un jeu de hasard, c'est une compétence qui s'acquiert avec la bonne méthode et la bonne psychologie.")}"
            </blockquote>
            <div className="quote-author">
              <strong>Rose Kakpo</strong>
              <span>Guide et Tradeuse</span>
            </div>
          </div>
          <div className="about-content">
            <h2 className="text-gradient">Qui je suis</h2>
            <p dangerouslySetInnerHTML={{ __html: c('about_intro', "Je suis <strong>Rose Kakpo</strong>, tradeuse indépendante et membre de la RMICLASS, un écosystème spécialisé dans l'éducation et l’accompagnement dans l’univers du trading. Passionnée par le digital et les marchés financiers, j'accompagne les débutants qui souhaitent apprendre le trading avec plus de simplicité, de compréhension et de proximité.") }} />
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
                <TrendingUp size={32} />
              </div>
              <h3>Formations Trading</h3>
              <p>Apprendre les bases du trading, comprendre les marchés et développer une stratégie rentable.</p>
            </div>

            <div className="service-card glass-panel animate-fade-up delay-200">
              <div className="service-icon green-bg">
                <Users size={32} />
              </div>
              <h3>Accompagnement</h3>
              <p>Coaching personnalisé et suivi continu pour corriger vos erreurs et évoluer plus rapidement.</p>
            </div>

            <div className="service-card glass-panel animate-fade-up delay-300">
              <div className="service-icon pink-bg">
                <Lightbulb size={32} />
              </div>
              <h3>Éducation financière</h3>
              <p>Conseils pratiques pour mieux gérer son argent, investir intelligemment et sécuriser son avenir.</p>
            </div>

            <div className="service-card glass-panel animate-fade-up delay-400">
              <div className="service-icon green-bg">
                <Target size={32} />
              </div>
              <h3>Motivation & discipline</h3>
              <p>Développement personnel et productivité pour forger un mental d'acier indispensable au trading.</p>
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

            <div className="program-card featured glass-panel animate-fade-up delay-200">
              <div className="featured-badge">Populaire</div>
              <div className="program-icon pink-bg"><TrendingUp size={28} /></div>
              <h3>La Stratégie 3S</h3>
              <p>Pour les traders intermédiaires qui stagnent. Structure, analyse et psychologie pour devenir rentable.</p>
              <Link to="/programs#strategie-3s" className="btn btn-primary full-width mt-auto" style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Découvrir la Stratégie 3S</Link>
            </div>

            <div className="program-card animate-fade-up delay-300">
              <div className="program-icon pink-bg"><Award size={28} /></div>
              <h3>Coaching One-to-One</h3>
              <p>Un accompagnement personnalisé pour débloquer vos difficultés spécifiques avec un audit complet.</p>
              <Link to="/programs#coaching" className="btn btn-outline full-width mt-auto" style={{ height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Réserver un Coaching</Link>
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
            <div className="testimonial-card glass-panel animate-fade-up delay-100">
              <div className="stars">
                <Star fill="#F472B6" color="#F472B6" size={20} />
                <Star fill="#F472B6" color="#F472B6" size={20} />
                <Star fill="#F472B6" color="#F472B6" size={20} />
                <Star fill="#F472B6" color="#F472B6" size={20} />
                <Star fill="#F472B6" color="#F472B6" size={20} />
              </div>
              <p className="testimonial-text">"{c('testimonial_1_text', "Formation très claire. J'avais peur de me lancer mais Rose a su rendre les choses tellement simples à comprendre !")}"</p>
              <p className="testimonial-author">- {c('testimonial_1_author', 'Sarah L.')}</p>
            </div>
            <div className="testimonial-card glass-panel animate-fade-up delay-200">
              <div className="stars">
                <Star fill="#2E6F40" color="#2E6F40" size={20} />
                <Star fill="#2E6F40" color="#2E6F40" size={20} />
                <Star fill="#2E6F40" color="#2E6F40" size={20} />
                <Star fill="#2E6F40" color="#2E6F40" size={20} />
                <Star fill="#2E6F40" color="#2E6F40" size={20} />
              </div>
              <p className="testimonial-text">"{c('testimonial_2_text', "J'ai enfin compris le trading grâce au programme 3S. Ma psychologie a complètement changé devant les graphiques.")}"</p>
              <p className="testimonial-author">- {c('testimonial_2_author', 'Marc E.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Appel à l'action */}
      <section className="cta-section section text-center">
        <div className="container cta-container glass-panel animate-fade-up">
          <div className="cta-content-inner">
            <h2 className="text-gradient-pink">{c('cta_title', 'Prête à commencer ton parcours financier ?')}</h2>
            <p>{c('cta_subtitle', 'Rejoignez une communauté bienveillante et passez à l\'action dès aujourd\'hui pour transformer votre avenir.')}</p>
            <div className="cta-buttons">
              <Link to="/programs#woman-king" className="btn btn-primary">Rejoindre maintenant</Link>
              <Link to="/programs#coaching" className="btn btn-accent">Réserver un coaching one-to-one</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
