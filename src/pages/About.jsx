import { CheckCircle2 } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import './About.css'

const About = () => {
  const { c } = useContent();

  return (
    <div className="about-page">
      {/* Page Header */}
      <section className="page-header text-center animate-fade-up">
        <div className="container">
          <h1 className="text-gradient">À propos de moi</h1>
          <p className="page-subtitle">Découvrez mon parcours et la vision qui m'anime.</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section story-section">
        <div className="container story-container animate-fade-up delay-100">
          <div className="story-image-wrapper floating-1">
            <div className="story-image glow-effect-green">
               <div className="image-placeholder glass-panel" style={{ backgroundImage: "url('/photo2.jpeg')", backgroundSize: "cover", backgroundPosition: "top center", border: "none", color: "transparent" }}></div>
            </div>
          </div>
          <div className="story-content">
            <p className="mb-4 text-large" dangerouslySetInnerHTML={{ __html: c('about_story_1', "Je suis <strong>Rose Kakpo</strong>, tradeuse indépendante et membre de la <strong>RMICLASS</strong>. Passionnée par le digital et les marchés financiers, j'accompagne les personnes qui souhaitent découvrir le trading avec plus de simplicité et de proximité.") }} />
            <p>{c('about_story_2', "Mon objectif ne se limite pas au partage de connaissances. À travers cette plateforme, j'ai voulu créer un espace où les débutants peuvent apprendre à leur rythme, sans se sentir dépassés par la complexité de cet univers.")}</p>
          </div>
        </div>
      </section>

      {/* Second Story Section */}
      <section className="section story-section">
        <div className="container story-container reverse animate-fade-up delay-150">
          <div className="story-image-wrapper floating-2">
            <div className="story-image glow-effect-pink">
               <div className="image-placeholder glass-panel" style={{ backgroundImage: "url('/photo3.jpeg')", backgroundSize: "cover", backgroundPosition: "top center", border: "none", color: "transparent" }}></div>
            </div>
          </div>
          <div className="story-content">
            <p dangerouslySetInnerHTML={{ __html: c('about_story_3', "Lorsque j'ai découvert le trading, je me suis rapidement heurtée à la complexité de cet univers : termes techniques, trop d'informations et très peu de clarté. Comme beaucoup, je m'y suis perdue mais avec le temps, de part ma détermination, l'apprentissage et les <strong>3 années d'expérience</strong> acquises au sein de la <strong>RMICLASS</strong>, j'ai pu développer une compréhension solide des marchés.") }} />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container mission-vision-grid animate-fade-up delay-200">
          <div className="card glass-panel pink-border-top">
            <h3 className="text-gradient-pink">Ma Mission</h3>
            <p>{c('about_mission', "Accompagner les personnes qui souhaitent découvrir le trading autrement : avec plus de simplicité, de compréhension et de structure. Mon but est de vous faire gagner du temps et de vous éviter les erreurs classiques que rencontrent énormément de débutants.")}</p>
          </div>
          <div className="card glass-panel green-border-top">
            <h3 className="text-gradient-green">Ma Vision</h3>
            <p>{c('about_vision', "À travers cette plateforme, je souhaite rendre l'apprentissage du trading plus humain, plus clair et plus accessible à une nouvelle génération tournée vers le digital, l'indépendance financière et l'évolution personnelle.")}</p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section values-section">
        <div className="container animate-fade-up delay-300">
          <h2 className="text-center mb-4 text-gradient">Mes Valeurs</h2>
          <div className="values-grid">
            <div className="value-item glass-panel">
              <CheckCircle2 className="text-pink mb-2" size={36} />
              <h4>Transparence</h4>
              <p>Pas de fausses promesses. Le trading demande du travail et je vous dis la vérité sur ce que cela implique.</p>
            </div>
            <div className="value-item glass-panel">
              <CheckCircle2 className="text-green mb-2" size={36} />
              <h4>Discipline</h4>
              <p>C'est la clé de la réussite. Je vous apprends à développer une rigueur professionnelle et inébranlable.</p>
            </div>
            <div className="value-item glass-panel">
              <CheckCircle2 className="text-pink mb-2" size={36} />
              <h4>Bienveillance</h4>
              <p>Un apprentissage dans un cadre sain, motivant et sans jugement, surtout pour les débutants.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
