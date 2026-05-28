import { Mail } from 'lucide-react'
import { useContent } from '../hooks/useContent'
import './Contact.css'
import { API_URL } from '../config';

const Contact = () => {
  const { c } = useContent();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Correspondance avec les noms de champs attendus par le backend
    const payload = {
      nom: data.nom_complet,
      email: data.email,
      sujet: data.sujet,
      message: data.message
    };

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert("Message envoyé avec succès et enregistré dans la base de données !");
        e.target.reset();
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur backend.");
    }
  };

  return (
    <div className="contact-page">
      <section className="page-header text-center animate-fade-up">
        <div className="container">
          <h1 className="text-gradient">Contactez-moi</h1>
          <p className="page-subtitle">Une question ? Un besoin spécifique ? Je suis à votre écoute.</p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container contact-container">
          <div className="contact-info animate-fade-up delay-100">
            <h2 className="text-gradient-pink">Restons en contact</h2>
            <p className="mb-4 text-large">
              Vous pouvez m'envoyer un message via le formulaire <br />
              ou utiliser l'un des moyens de contact ci-dessous.
            </p>
            
            <div className="info-items">
              <div className="info-item glass-panel">
                <div className="info-icon pink-bg-light">
                  <Mail className="text-pink" size={24} />
                </div>
                <div>
                  <h4>Email</h4>
                  <p>{c('contact_email', 'contact@rose-kakpo.com')}</p>
                </div>
              </div>
              
              <div className="info-item glass-panel">
                <div className="info-icon green-bg-light">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div>
                  <h4>Téléphone</h4>
                  <p>{c('contact_phone', '+229 01 02 03 04')}</p>
                </div>
              </div>
            </div>

            <div className="social-connect mt-4">
              <h3 className="mb-3">Mes Réseaux Sociaux</h3>
              <div className="social-links-large">
                <a href="https://www.instagram.com/rose_cakpo?igsh=MWwwbjdxbzA3M3RzaQ%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="social-link-item glass-panel">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> Instagram
                </a>
                <a href="https://www.tiktok.com/@girlofgodtrade?_r=1&_t=ZS-96drEpgOZjZ" target="_blank" rel="noreferrer" className="social-link-item glass-panel">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.5 5.46-3.83 6.93-2.14 1.34-4.83 1.54-7.14.62-2.73-1.08-4.73-3.61-5.1-6.49-.33-2.58.62-5.26 2.51-7.07 1.83-1.74 4.41-2.43 6.84-2.03v4.06c-1.39-.23-2.85.06-3.95.89-.99.74-1.63 1.89-1.68 3.14-.07 1.48.57 2.95 1.75 3.86 1.17.91 2.78 1.18 4.2.78 1.57-.44 2.64-1.92 2.65-3.56.03-5.59.01-11.18.01-16.77z"/></svg> TikTok
                </a>
                <a href="https://chat.whatsapp.com/JwQ5Bk2S8AmAmdhZHq6AlA" target="_blank" rel="noreferrer" className="social-link-item glass-panel">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> WhatsApp
                </a>
                <a href="https://www.facebook.com/share/1D2kuLcJVq/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="social-link-item glass-panel">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> Facebook
                </a>
                <a href="https://t.me/+hXBcjA-rPjpmZGRk" target="_blank" rel="noreferrer" className="social-link-item glass-panel">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> Telegram
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper animate-fade-up delay-200">
            <form className="contact-form glass-panel" onSubmit={handleSubmit}>
              <h3 className="text-gradient">Envoyez un message</h3>
              
              <div className="form-group">
                <label>Nom Complet</label>
                <input type="text" name="nom_complet" placeholder="Votre nom" required className="glass-input" />
              </div>
              
              <div className="form-group">
                <label>Adresse Email</label>
                <input type="email" name="email" placeholder="votre@email.com" required className="glass-input" />
              </div>
              
              <div className="form-group">
                <label>Sujet</label>
                <select name="sujet" required defaultValue="" className="glass-input">
                  <option value="" disabled>Sélectionnez un sujet</option>
                  <option value="programme">Question sur un programme</option>
                  <option value="coaching">Demande de coaching</option>
                  <option value="partenariat">Partenariat / Collaboration</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" rows="5" placeholder="Comment puis-je vous aider ?" required className="glass-input"></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary full-width mt-2">Envoyer le message</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
