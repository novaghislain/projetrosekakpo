import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CreditCard, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react'
import './Checkout.css'

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
    whatsapp: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [program, setProgram] = useState(programsData[programId] || null)
  const [dynamicPrice, setDynamicPrice] = useState(program ? program.price : 0)
  const [dynamicUsdPrice, setDynamicUsdPrice] = useState(program ? program.usdPrice : 0)
  const [image, setImage] = useState(null)

  useEffect(() => {
    if (!programId) {
      navigate('/programs')
      return
    }

    if (programsData[programId]) {
      fetch('/api/prices')
        .then(res => res.json())
        .then(data => {
          const found = data.find(item => item.id === programId)
          if (found) {
            setDynamicPrice(found.price)
            setDynamicUsdPrice(Math.round(found.price / 625))
          }
        })
        .catch(err => console.error("Error loading prices:", err))
    } else {
      // Dynamic Formation
      fetch(`/api/formations/${programId}`)
        .then(res => {
          if (!res.ok) throw new Error("Formation introuvable");
          return res.json();
        })
        .then(data => {
          setProgram({
            name: data.title,
            price: data.price,
            usdPrice: Math.round(data.price / 625),
            desc: 'Accès complet à la formation et ses bonus.',
            features: data.program.split('\n').filter(Boolean).map(l => l.replace(/^•\s*/, ''))
          })
          setDynamicPrice(data.price)
          setDynamicUsdPrice(Math.round(data.price / 625))
          setImage(data.image)
        })
        .catch(err => {
           console.error("Erreur:", err);
           navigate('/programs');
        })
    }
  }, [programId, navigate])

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
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId,
          customer: formData,
          sessionType: programId === 'coaching-free' ? 'free' : 'paid'
        })
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Une erreur est survenue lors de l'initialisation.")
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setError("Erreur de connexion avec le serveur.")
      setLoading(false)
    }
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
              <h2 className="form-title">Informations de facturation</h2>
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

                <button type="submit" disabled={loading} className="checkout-submit-btn pulse-glow mt-4">
                  {loading ? 'Traitement en cours...' : dynamicPrice === 0 ? 'Valider ma place (Gratuit)' : `Payer ${dynamicPrice.toLocaleString()} FCFA`}
                </button>
                
                <div className="checkout-trust">
                  <ShieldCheck size={18} className="text-primary" />
                  <span>Transaction chiffrée SSL de bout en bout via FedaPay</span>
                </div>
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
                <span>{dynamicPrice.toLocaleString()} FCFA</span>
              </div>
              <div className="summary-price-row">
                <span>Taxes</span>
                <span>Incluses</span>
              </div>
              
              <div className="summary-total-row">
                <span>Total à payer</span>
                <div className="total-price-box">
                  <span className="total-price">{dynamicPrice === 0 ? 'GRATUIT' : `${dynamicPrice.toLocaleString()} FCFA`}</span>
                  {dynamicPrice > 0 && <span className="total-usd">(≈ {dynamicUsdPrice} USD)</span>}
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
