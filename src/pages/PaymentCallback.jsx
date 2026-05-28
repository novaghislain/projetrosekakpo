import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Loader2, ArrowRight, Send, HelpCircle, Download } from 'lucide-react'
import './PaymentCallback.css'
import { API_URL } from '../config';

const programNames = {
  'woman-king': 'Woman King Trade',
  'strategie-3s': 'Stratégie 3S',
  'coaching-free': 'Coaching One-to-One (1ère Séance)',
  'coaching': 'Coaching One-to-One (Suivi)',
  'ebook-vision': 'E-Book : De la vision à la maîtrise',
  'ebook-positionner': 'E-Book : Se positionner intelligemment'
}

const PaymentCallback = () => {
  const [searchParams] = useSearchParams()
  const transactionId = searchParams.get('id')
  const statusParam = searchParams.get('status')
  const programId = searchParams.get('programId')

  // Client billing details pre-filled from searchParams
  const preFirstname = searchParams.get('firstname') || ''
  const preLastname = searchParams.get('lastname') || ''
  const preEmail = searchParams.get('email') || ''
  const preWhatsapp = searchParams.get('whatsapp') || ''

  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [verificationError, setVerificationError] = useState('')
  const [registering, setRegistering] = useState(false)
  const [registered, setRegistered] = useState(false)

  // Registration Form State
  const [formData, setFormData] = useState({
    prenom: preFirstname,
    nom: preLastname,
    email: preEmail,
    whatsapp: preWhatsapp,
    niveau: '',
    programme: programNames[programId] || 'Woman King Trade'
  })

  useEffect(() => {
    const verifyPayment = async () => {
      if (!transactionId) {
        setVerifying(false)
        setVerificationError("Identifiant de transaction manquant.")
        return
      }

      // If simulated status from mock is approved, or if we verify with the backend
      if (statusParam === 'approved' || transactionId.startsWith('MOCK-')) {
        setVerifying(false)
        setVerified(true)
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/payment/verify/${transactionId}`)
        const data = await response.json()

        if (response.ok && data.status === 'approved') {
          setVerified(true)
        } else {
          setVerificationError(
            data.status === 'declined'
              ? "Le paiement a été refusé par l'opérateur."
              : data.status === 'canceled'
              ? "Le paiement a été annulé."
              : "Le paiement n'a pas pu être validé."
          )
        }
      } catch (err) {
        console.error(err)
        setVerificationError("Impossible de se connecter au serveur de vérification.")
      } finally {
        setVerifying(false)
      }
    }

    verifyPayment()
  }, [transactionId, statusParam])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setRegistering(true)

    try {
      const payloadToSend = { ...formData, programSlug: programId };
      const response = await fetch(`${API_URL}/api/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSend)
      })

      if (response.ok) {
        setRegistered(true)
      } else {
        alert("Erreur lors de l'enregistrement de vos données.")
      }
    } catch (err) {
      console.error(err)
      alert("Erreur réseau. Impossible d'enregistrer l'inscription.")
    } finally {
      setRegistering(false)
    }
  }

  // 1. Verifying state
  if (verifying) {
    return (
      <div className="callback-page-container">
        <div className="status-card glass-panel text-center">
          <Loader2 className="spinner text-pink animate-spin" size={60} />
          <h2>Vérification du paiement...</h2>
          <p>Veuillez patienter, nous vérifions le statut de votre transaction auprès de FedaPay.</p>
        </div>
      </div>
    )
  }

  // 2. Failure state
  if (!verified) {
    return (
      <div className="callback-page-container">
        <div className="status-card glass-panel text-center">
          <XCircle className="text-red" size={70} />
          <h2 className="text-gradient-red mt-4">Paiement échoué</h2>
          <p className="mt-2">{verificationError || "Votre paiement n'a pas pu être confirmé. Si vous avez été débité, veuillez contacter le support."}</p>
          <div className="mt-6 flex-buttons">
            <Link to="/programs" className="btn btn-primary">
              Réessayer le paiement
            </Link>
            <Link to="/contact" className="btn btn-secondary">
              Contacter le support
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 3. Payment Verified but not yet Registered (Show enrollment form)
  if (!registered) {
    return (
      <div className="callback-page-container">
        <div className="form-card glass-panel animate-fade-up">
          <div className="form-card-header text-center">
            <CheckCircle2 className="text-green" size={50} />
            <h2 className="text-gradient-pink mt-3">
              {transactionId && transactionId.startsWith('FREE-') ? "Réservation Validée !" : "Paiement Confirmé !"}
            </h2>
            <p className="mt-2 text-muted">
              {transactionId && transactionId.startsWith('FREE-') 
                ? `Complétez vos détails pour valider votre séance gratuite de ${formData.programme}.`
                : `Complétez vos détails pour configurer votre accès au programme ${formData.programme}.`
              }
            </p>
          </div>

          <form onSubmit={handleRegisterSubmit} className="callback-enrollment-form mt-6">
            <div className="form-row">
              <div className="form-group">
                <label>Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className="glass-input"
                />
              </div>
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleInputChange}
                  className="glass-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Adresse Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="glass-input"
              />
            </div>

            <div className="form-group">
              <label>Numéro WhatsApp (avec indicatif)</label>
              <input
                type="tel"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="glass-input"
              />
            </div>

            <div className="form-group">
              <label>Votre niveau actuel en trading</label>
              <select
                name="niveau"
                required
                value={formData.niveau}
                onChange={handleInputChange}
                className="glass-input"
              >
                <option value="" disabled>Sélectionnez votre niveau</option>
                <option value="debutant">Débutante (Je n'y connais rien)</option>
                <option value="intermediaire">Intermédiaire (Je trade mais ne suis pas régulière)</option>
                <option value="avance">Avancée (Je maîtrise mais stagne)</option>
              </select>
            </div>

            <button type="submit" disabled={registering} className="btn btn-primary full-width mt-4">
              {registering ? 'Enregistrement...' : "Finaliser mon inscription"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const isEbook = programId === 'ebook-vision' || programId === 'ebook-positionner';
  const ebookFile = programId === 'ebook-vision' 
    ? '/EBOOK_FIGURE_BOUGIE_ROSE.pdf' 
    : '/GUIDE_PRATIQUE_POUR_DEBUTER_LE_TRADING_ROSE_KAKPO.pdf';

  // 4. Registration Completed (Show community redirect links or download button)
  return (
    <div className="callback-page-container">
      <div className="status-card glass-panel text-center success-final animate-fade-up">
        <CheckCircle2 className="text-green scale-up" size={80} />
        <h2 className="text-gradient-pink mt-4">Bienvenue dans l'aventure !</h2>
        <p className="mt-2 text-large">Votre inscription au programme <strong>{formData.programme}</strong> est validée avec succès.</p>
        
        {isEbook ? (
          <div className="action-box-community mt-6">
            <h3 className="text-green-brand">Télécharger votre E-Book</h3>
            <p>Félicitations pour votre achat ! Votre guide est disponible immédiatement :</p>
            
            <div className="community-links mt-4">
              <a 
                href={ebookFile} 
                download
                className="community-btn ebook-download-btn"
              >
                <Download size={20} />
                Télécharger l'E-Book (PDF)
              </a>
            </div>
            
            <p className="mt-6 text-sm text-muted">
              Rejoignez également notre communauté WhatsApp pour échanger :
            </p>
            
            <div className="community-links mt-3">
              <a 
                href="https://chat.whatsapp.com/JwQ5Bk2S8AmAmdhZHq6AlA" 
                target="_blank" 
                rel="noreferrer" 
                className="community-btn whatsapp-color"
              >
                <Send size={18} />
                Rejoindre le Groupe WhatsApp
              </a>
            </div>
          </div>
        ) : (
          <div className="action-box-community mt-6">
            <h3>Étape essentielle : Rejoindre vos canaux</h3>
            <p>Cliquez ci-dessous pour intégrer immédiatement nos canaux de communication officiels :</p>
            
            <div className="community-links mt-4">
              <a 
                href="https://chat.whatsapp.com/JwQ5Bk2S8AmAmdhZHq6AlA" 
                target="_blank" 
                rel="noreferrer" 
                className="community-btn whatsapp-color"
              >
                <Send size={20} />
                Rejoindre le Groupe WhatsApp
              </a>
              
              <a 
                href="https://t.me/+hXBcjA-rPjpmZGRk" 
                target="_blank" 
                rel="noreferrer" 
                className="community-btn telegram-color"
              >
                <Send size={20} />
                Rejoindre le Canal Telegram
              </a>
            </div>
          </div>
        )}

        <div className="mt-6">
          <Link to="/" className="btn btn-secondary">
            Retour à l'accueil <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentCallback
