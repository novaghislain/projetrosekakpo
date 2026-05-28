import { useSearchParams } from 'react-router-dom'
import { ShieldCheck, Landmark, Smartphone, AlertTriangle } from 'lucide-react'
import './MockCheckout.css'

const MockCheckout = () => {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  const amount = searchParams.get('amount')
  const programId = searchParams.get('programId')
  const firstname = searchParams.get('firstname')
  const lastname = searchParams.get('lastname')
  const email = searchParams.get('email')
  const whatsapp = searchParams.get('whatsapp')

  const handleSimulatePayment = (status) => {
    // Construction de l'URL de callback de l'application
    const callbackUrl = new URL('http://localhost:5173/payment-callback')
    callbackUrl.searchParams.append('id', id)
    callbackUrl.searchParams.append('status', status)
    callbackUrl.searchParams.append('programId', programId)
    callbackUrl.searchParams.append('firstname', firstname)
    callbackUrl.searchParams.append('lastname', lastname)
    callbackUrl.searchParams.append('email', email)
    callbackUrl.searchParams.append('whatsapp', whatsapp)
    
    window.location.href = callbackUrl.toString()
  }

  return (
    <div className="mock-checkout-container animate-fade-up">
      <div className="mock-checkout-card">
        {/* Header */}
        <div className="mock-checkout-header">
          <div className="fedapay-logo">
            <span className="logo-feda">feda</span>
            <span className="logo-pay">pay</span>
            <span className="sandbox-badge">SANDBOX SIMULATION</span>
          </div>
          <div className="transaction-details">
            <span className="ref-label">Référence : {id}</span>
            <strong className="amount-value">{Number(amount).toLocaleString()} FCFA</strong>
          </div>
        </div>

        {/* Info box */}
        <div className="sandbox-warning">
          <AlertTriangle size={20} className="text-warning" />
          <div>
            <strong>Mode de Simulation Actif</strong>
            <p>Aucun débit réel ne sera effectué. Choisissez l'une des actions ci-dessous pour simuler le statut de la transaction.</p>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="payment-options">
          <div className="payment-tab active">
            <Smartphone size={20} />
            <span>Mobile Money</span>
          </div>
          <div className="payment-tab">
            <Landmark size={20} />
            <span>Carte Bancaire</span>
          </div>
        </div>

        {/* Mock inputs displaying user data */}
        <div className="mock-form-preview">
          <div className="preview-field">
            <span>Client :</span>
            <strong>{firstname} {lastname}</strong>
          </div>
          <div className="preview-field">
            <span>Email :</span>
            <strong>{email}</strong>
          </div>
          <div className="preview-field">
            <span>WhatsApp :</span>
            <strong>{whatsapp}</strong>
          </div>
        </div>

        {/* Simulation Buttons */}
        <div className="simulation-actions">
          <button 
            onClick={() => handleSimulatePayment('approved')}
            className="btn-simulate-success"
          >
            <ShieldCheck size={20} />
            Simuler un Paiement Réussi
          </button>
          
          <button 
            onClick={() => handleSimulatePayment('declined')}
            className="btn-simulate-fail"
          >
            Simuler un Échec
          </button>
        </div>

        {/* Footer */}
        <div className="mock-checkout-footer">
          <ShieldCheck size={14} className="text-green" />
          <span>Paiement sécurisé et chiffré par FedaPay</span>
        </div>
      </div>
    </div>
  )
}

export default MockCheckout
