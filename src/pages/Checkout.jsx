import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react'
import './Checkout.css'
import { API_URL } from '../config';

const programsData = {
  'woman-king': {
    name: 'Woman King Trade',
    price: 25000,
    usdPrice: 40,
    desc: 'Un programme complet d’initiation pour les femmes débutantes.',
    features: ['Accompagnement de proximité', 'Bases essentielles et initiation', 'Communauté active 100% féminine', 'Suivi de progression personnel']
  },
  'strategie-3s': {
    name: 'Stratégie 3S',
    price: 50000,
    usdPrice: 80,
    desc: 'Structure, analyse et psychologie pour les traders intermédiaires.',
    features: ['Méthodologie d’analyse approfondie', 'Gestion de la psychologie de marché', 'Plan de trading rigoureux', 'Session de revue collective']
  },
  'coaching-free': {
    name: 'Coaching One-to-One (1ère Séance)',
    price: 0,
    usdPrice: 0,
    desc: 'Bénéficiez de votre premier entretien individuel entièrement gratuit.',
    features: ['Diagnostic de votre profil', 'Entretien privé (45 min)', 'Définition d’un plan d’apprentissage', '100% offert']
  },
  'coaching': {
    name: 'Coaching One-to-One (Suivi)',
    price: 15000,
    usdPrice: 25,
    desc: 'Session individuelle d’une heure avec Rose Kakpo.',
    features: ['Audit complet de tes graphiques', 'Session privée via Zoom ou WhatsApp', 'Plan d’action personnalisé', 'Suivi post-appel']
  },
  'ebook-vision': {
    name: 'E-Book : De la vision à la maîtrise',
    price: 5000,
    usdPrice: 8,
    desc: 'Un guide d’apprentissage complet pour maîtriser les figures de bougies.',
    features: ['Figures de bougies détaillées', 'Explications simples et illustrées', 'Astuces de trading pratiques', 'Format PDF téléchargeable à vie']
  },
  'ebook-positionner': {
    name: 'E-Book : Se positionner intelligemment',
    price: 5000,
    usdPrice: 8,
    desc: 'Le guide pratique indispensable pour débuter le trading.',
    features: ['Vocabulaire du trader débutant', 'Structure des marchés financiers', 'Gestion du risque de départ', 'Format PDF téléchargeable à vie']
  }
}

const Checkout = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const programId = searchParams.get('program')
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    whatsapp: '',
    niveau: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const [program, setProgram] = useState(null)
  const [dynamicPrice, setDynamicPrice] = useState(0)
  const [dynamicUsdPrice, setDynamicUsdPrice] = useState(0)
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (!programId) {
      navigate('/programs')
      return
    }

    setLoading(true)

    const loadProgram = async () => {
      // Helper: fetch with retry
      const fetchWithRetry = async (url, options = {}, retries = 5, delay = 800) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            const res = await fetch(url, options);
            return res;
          } catch (err) {
            if (attempt < retries) {
              console.warn(`Fetch ${url} - tentative ${attempt}/${retries} échouée, réessai dans ${delay}ms`);
              await new Promise(r => setTimeout(r, delay));
              delay = Math.min(delay * 1.5, 4000);
            } else {
              throw err;
            }
          }
        }
      };

      try {
        // Try to fetch dynamic formation from database first
        const res = await fetchWithRetry(`${API_URL}/api/formations/${programId}`, { cache: 'no-store' });

        let data;
        if (!res.ok) {
          // Fallback to static programsData if available
          if (programsData[programId]) {
            try {
              const pricesRes = await fetchWithRetry(`${API_URL}/api/prices`);
              if (pricesRes && pricesRes.ok) {
                const pricesData = await pricesRes.json();
                const foundPrice = pricesData.find(item => item.id === programId);
                if (foundPrice) {
                  data = {
                    title: programsData[programId].name,
                    price: foundPrice.price,
                    program: programsData[programId].desc,
                    features: programsData[programId].features
                  };
                }
              }
            } catch (e) {
              console.error("Error loading prices:", e);
            }
            if (!data) {
              data = {
                title: programsData[programId].name,
                price: programsData[programId].price,
                program: programsData[programId].desc,
                features: programsData[programId].features
              };
            }
          } else {
            // Fallback to Ebooks
            try {
              const ebookRes = await fetchWithRetry(`${API_URL}/api/ebooks`);
              if (ebookRes && ebookRes.ok) {
                const ebooksList = await ebookRes.json();
                const foundEbook = ebooksList.find(e => e.slug === programId);
                if (foundEbook) {
                  data = {
                    title: foundEbook.title,
                    price: foundEbook.price,
                    program: foundEbook.description,
                    image: foundEbook.image,
                    isEbook: true
                  };
                }
              }
            } catch (e) {
              console.error("Error loading ebooks:", e);
            }
            if (!data) {
              navigate('/programs');
              return;
            }
          }
        } else {
          data = await res.json();
        }

        let accessLink = '';
        if (data.content_json) {
          let parsedContent = data.content_json;
          if (typeof parsedContent === 'string') {
            try {
              parsedContent = JSON.parse(parsedContent);
            } catch (e) {
              console.error("Erreur parsing content_json", e);
            }
          }
          accessLink = parsedContent.accessLink || '';
        }

        setProgram({
          name: data.title || data.name,
          price: data.price,
          usdPrice: Math.round(data.price / 625),
          desc: data.program || 'Accès complet au programme.',
          features: Array.isArray(data.features)
            ? data.features
            : (data.program ? data.program.split('\n').filter(Boolean).map(l => l.replace(/^•\s*/, '')) : []),
          accessLink: accessLink,
          isEbook: data.isEbook || false
        })
        setDynamicPrice(data.price)
        setDynamicUsdPrice(Math.round(data.price / 625))
        if (data.image) setImage(data.image)
        setLoading(false)
      } catch (err) {
        console.error("Erreur Checkout:", err);
        navigate('/programs');
      }
    };

    loadProgram();
  }, [programId, navigate])

  if (loading && !program) return <div className="checkout-page" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div className="loader"></div></div>
  if (!program) return <div className="checkout-page" style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><div className="loader"></div></div>

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (dynamicPrice === 0 || programId === 'coaching-free') {
        // Direct enrollment for free programs
        const payload = {
          nom: `${formData.firstname} ${formData.lastname}`,
          email: formData.email,
          whatsapp: formData.whatsapp,
          niveau: formData.niveau || 'debutant',
          programme: program.name,
          programSlug: programId
        }

        const response = await fetch(`${API_URL}/api/enroll`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        
        const data = await response.json()
        if (response.ok) {
          setIsSuccess(true)
          setLoading(false)
        } else {
          setError(data.error || "Une erreur est survenue lors de l'inscription.")
          setLoading(false)
        }
      } else {
        // Redirection to manual payment page for paid programs
        navigate('/manual-payment', { 
          state: { 
            programId, 
            programName: program.name,
            dynamicPrice, 
            dynamicUsdPrice,
            customer: {
              firstname: formData.firstname,
              lastname: formData.lastname,
              email: formData.email,
              whatsapp: formData.whatsapp
            } 
          } 
        });
      }
    } catch (err) {
      console.error(err)
      setError("Erreur de connexion avec le serveur.")
      setLoading(false)
    }
  }

  if (isSuccess) {
    const isEbook = programId.startsWith('ebook-') || program.isEbook;
    const isCoaching = programId === 'coaching-free' || programId === 'coaching';
    const ebookFile = programId === 'ebook-vision' 
      ? '/EBOOK_FIGURE_BOUGIE_ROSE.pdf' 
      : '/GUIDE_PRATIQUE_POUR_DEBUTER_LE_TRADING_ROSE_KAKPO.pdf';
    
    const whatsappGroupLink = program.accessLink || "https://chat.whatsapp.com/JwQ5Bk2S8AmAmdhZHq6AlA";
    const telegramLink = "https://t.me/+hXBcjA-rPjpmZGRk";
    const directWhatsappRose = "https://wa.me/2290191348557?text=" + encodeURIComponent(`Bonjour Rose, je viens de m'inscrire au Coaching One-to-One gratuit (${formData.firstname} ${formData.lastname}).`);

    return (
      <div className="checkout-page animate-fade-up">
        <div className="checkout-container" style={{ maxWidth: '600px', margin: '4rem auto' }}>
          <div className="checkout-form-box text-center success-box" style={{ padding: '3rem 2rem' }}>
            <div className="success-icon-wrapper" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', marginBottom: '1.5rem', color: '#10b981' }}>
              <CheckCircle2 size={48} />
            </div>
            
            <h2 className="form-title" style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>Bienvenue dans l'aventure !</h2>
            <p className="form-subtitle" style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              Votre inscription au programme <strong>{program.name}</strong> a été validée avec succès.
            </p>

            {isEbook ? (
              <div className="success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <a href={ebookFile} download className="checkout-submit-btn pulse-glow" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  Télécharger mon E-Book (PDF)
                </a>
                <a href="https://chat.whatsapp.com/JwQ5Bk2S8AmAmdhZHq6AlA" target="_blank" rel="noreferrer" className="btn-secondary-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', background: 'rgba(255,255,255,0.05)' }}>
                  Rejoindre la communauté WhatsApp
                </a>
              </div>
            ) : isCoaching ? (
              <div className="success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                <p style={{ color: 'var(--color-gray-600)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.6' }}>
                  Je vais vous contacter très rapidement sur votre numéro WhatsApp (<strong>{formData.whatsapp}</strong>) afin de planifier le jour et l'heure de notre entretien privé. Vous pouvez également m'envoyer un message direct pour accélérer le processus :
                </p>
                <a href={directWhatsappRose} target="_blank" rel="noreferrer" className="checkout-submit-btn pulse-glow" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  M'envoyer un message sur WhatsApp
                </a>
              </div>
            ) : (
              <div className="success-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                <p style={{ color: 'var(--color-gray-600)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  Intégrez dès maintenant nos canaux officiels pour recevoir vos accès et les instructions :
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <a href={whatsappGroupLink} target="_blank" rel="noreferrer" className="checkout-submit-btn pulse-glow" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', fontSize: '0.9rem' }}>
                    Groupe WhatsApp
                  </a>
                  <a href={telegramLink} target="_blank" rel="noreferrer" className="btn-secondary-link" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', background: 'rgba(255,255,255,0.05)', fontSize: '0.9rem' }}>
                    Canal Telegram
                  </a>
                </div>
              </div>
            )}

            <div style={{ marginTop: '2.5rem' }}>
              <Link to="/" className="checkout-back" style={{ justifyContent: 'center' }}>
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page animate-fade-up">
      <div className="checkout-header">
        <div className="checkout-container">
          <Link to={programsData[programId] ? "/programs" : `/formation/${programId}`} className="checkout-back">
            <ArrowLeft size={18} /> Retour
          </Link>
          <div className="checkout-secure-badge">
            <Lock size={14} /> Paiement 100% Sécurisé
          </div>
        </div>
      </div>

      <div className="checkout-container checkout-main">
        <div className="checkout-layout">
          
          {/* LEFT: FORM */}
          <div className="checkout-left">
            <div className="checkout-form-box">
              <h2 className="form-title">{dynamicPrice === 0 ? "Informations d'inscription" : "Informations de facturation"}</h2>
              <p className="form-subtitle">Renseignez vos coordonnées pour recevoir votre accès.</p>
              
              {error && <div className="checkout-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Prénom</label>
                    <input type="text" name="firstname" required value={formData.firstname} onChange={handleInputChange} className="checkout-input" />
                  </div>
                  <div className="form-group">
                    <label>Nom</label>
                    <input type="text" name="lastname" required value={formData.lastname} onChange={handleInputChange} className="checkout-input" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Adresse Email</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="checkout-input" placeholder="Pour recevoir vos accès" />
                </div>

                <div className="form-group">
                  <label>Numéro WhatsApp (avec indicatif)</label>
                  <input type="tel" name="whatsapp" required value={formData.whatsapp} onChange={handleInputChange} className="checkout-input" placeholder="+229..." />
                </div>

                {(dynamicPrice === 0 || programId === 'coaching-free') && (
                  <div className="form-group">
                    <label>Votre niveau actuel en trading</label>
                    <select
                      name="niveau"
                      required
                      value={formData.niveau}
                      onChange={handleInputChange}
                      className="checkout-input"
                      style={{ background: '#13111a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <option value="" disabled>Sélectionnez votre niveau</option>
                      <option value="debutant">Débutante (Je n'y connais rien)</option>
                      <option value="intermediaire">Intermédiaire (Je trade mais ne suis pas régulière)</option>
                      <option value="avance">Avancée (Je maîtrise mais stagne)</option>
                    </select>
                  </div>
                )}

                <button type="submit" disabled={loading} className="checkout-submit-btn pulse-glow mt-4">
                  {loading ? 'Traitement en cours...' : dynamicPrice === 0 ? "S'inscrire (Gratuit)" : `Payer ${dynamicPrice.toLocaleString()} FCFA`}
                </button>
                
                {dynamicPrice > 0 && (
                  <div className="checkout-trust">
                    <ShieldCheck size={18} className="text-primary" />
                    <span>Transaction sécurisée</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="checkout-right">
            <div className="checkout-summary-box">
              <h3 className="summary-title">Récapitulatif de la commande</h3>
              
              <div className="summary-item-card">
                {image && <img src={image} alt="Formation" className="summary-item-img" />}
                <div className="summary-item-info">
                  <h4>{program.name}</h4>
                  <p>{program.desc}</p>
                </div>
              </div>

              <div className="summary-price-row">
                <span>Sous-total</span>
                <span>{dynamicPrice === 0 ? 'Gratuit' : `${dynamicPrice.toLocaleString()} FCFA`}</span>
              </div>
              {dynamicPrice > 0 && (
                <div className="summary-price-row">
                  <span>Taxes</span>
                  <span>Incluses</span>
                </div>
              )}
              
              <div className="summary-total-row">
                <span>Total à payer</span>
                <div className="total-price-box">
                  <span className="total-price">{dynamicPrice === 0 ? '0 FCFA' : `${dynamicPrice.toLocaleString()} FCFA`}</span>
                  {dynamicUsdPrice > 0 && <span className="usd-price">≈ {dynamicUsdPrice} USD</span>}
                </div>
              </div>

              <div className="summary-includes">
                <h4>Ce qui est inclus :</h4>
                <ul>
                  {program.features.slice(0, 4).map((feat, index) => (
                    <li key={index}>
                      <CheckCircle2 size={16} className="text-primary" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Checkout
