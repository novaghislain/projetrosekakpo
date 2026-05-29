import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Upload, CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '../config';
import './Checkout.css';

const ManualPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [selectedNetwork, setSelectedNetwork] = useState('MTN');
  const [proofImage, setProofImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [trackingId, setTrackingId] = useState('');

  // Fallback if no state
  if (!state || !state.programId || !state.customer) {
    return (
      <div className="checkout-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <h2>Erreur de session</h2>
        <p>Vos informations de commande ont expiré. Veuillez recommencer.</p>
        <button className="btn btn-primary" onClick={() => navigate('/programs')}>Retour aux programmes</button>
      </div>
    );
  }

  const { programId, programName, dynamicPrice, customer } = state;

  const networks = {
    'MTN': {
      name: 'MTN Mobile Money',
      number: '+229 0169690456',
      recipientName: 'AMEDEOGNONNAN ROSEMONDE GNIDETE KAKPO',
      color: '#ffcc00'
    },
    'MOOV': {
      name: 'MOOV Money',
      number: '(Numéro à venir)',
      recipientName: 'AMEDEOGNONNAN ROSEMONDE GNIDETE KAKPO',
      color: '#ff6600'
    },
    'CELTIIS': {
      name: 'CELTIIS Cash',
      number: '(Numéro à venir)',
      recipientName: 'AMEDEOGNONNAN ROSEMONDE GNIDETE KAKPO',
      color: '#005b82'
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image est trop volumineuse (max 5 Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofImage(reader.result);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofImage) {
      setError("Veuillez téléverser une capture d'écran de votre paiement.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/payment/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId,
          customer,
          network: selectedNetwork,
          proofImage
        })
      });

      const data = await response.json();

      if (response.ok) {
        setTrackingId(data.trackingId);
        setSuccess(true);
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Numéro copié !");
  };

  if (success) {
    const trackingUrl = `https://rosekakpo.com/track/${trackingId}`;
    return (
      <div className="checkout-page animate-fade-up">
        <div className="checkout-container checkout-success-container">
          <div className="status-card glass-panel text-center success-final">
            <CheckCircle2 className="text-green scale-up" size={80} style={{ margin: '0 auto' }} />
            <h2 className="text-gradient-pink mt-4">Preuve soumise avec succès !</h2>
            <p className="mt-4 text-large">
              Merci {customer.firstname} ! Votre paiement est en cours de validation par notre équipe.
            </p>
            
            <div className="tracking-info-box">
              <h3 style={{ color: '#D53F8C', marginBottom: '1rem', fontSize: '1.1rem' }}>🔗 Votre lien de suivi de commande</h3>
              <p style={{ marginBottom: '1rem', fontSize: '0.95rem', color: '#555' }}>Conservez ce lien précieusement. Dès que nous aurons validé votre paiement, votre accès sera disponible sur cette page :</p>
              
              <div className="tracking-url-box">
                <input type="text" readOnly value={trackingUrl} className="tracking-input" />
                <button onClick={() => {
                  navigator.clipboard.writeText(trackingUrl);
                  toast.success("Lien copié !");
                }} className="btn btn-outline copy-btn">Copier</button>
              </div>
              
              <button onClick={() => navigate(`/track/${trackingId}`)} className="btn btn-primary w-100" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                Accéder à mon suivi
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="mt-6">
              <button onClick={() => navigate('/')} className="btn btn-outline" style={{ border: 'none', textDecoration: 'underline' }}>
                Retour à l'accueil
              </button>
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
          <button onClick={() => navigate(-1)} className="checkout-back" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#555', fontSize: '1rem' }}>
            <ArrowLeft size={18} /> Retour
          </button>
        </div>
      </div>

      <div className="checkout-container checkout-main">
        <div className="checkout-layout">
          
          <div className="checkout-left">
            <div className="checkout-form-box">
              <h2 className="form-title">Paiement Manuel</h2>
              <p className="form-subtitle">Transférez le montant exact pour valider votre commande.</p>
              
              {error && <div className="checkout-error mb-4" style={{ backgroundColor: 'rgba(255,0,0,0.05)', color: '#ff4d4d', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.1)' }}>{error}</div>}

              <div className="network-selector mb-5" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {Object.keys(networks).map((key) => (
                  <div 
                    key={key}
                    onClick={() => setSelectedNetwork(key)}
                    className="network-card"
                    style={{ 
                      border: selectedNetwork === key ? `2px solid ${networks[key].color}` : '1px solid rgba(0,0,0,0.1)',
                      backgroundColor: selectedNetwork === key ? 'rgba(0,0,0,0.02)' : 'transparent',
                    }}
                  >
                    <img src={`/${key}.png`} alt={networks[key].name} style={{ width: '100%', maxHeight: '40px', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>

              <div className="payment-instructions glass-panel mb-5">
                <h3 style={{ marginBottom: '1rem', color: networks[selectedNetwork].color, fontSize: '1.1rem' }}>Détails pour {networks[selectedNetwork].name}</h3>
                <p className="instruction-label">Montant à transférer :</p>
                <div className="instruction-value price-highlight">
                  {dynamicPrice.toLocaleString()} FCFA
                </div>

                <p className="instruction-label">Envoyez au numéro :</p>
                <div className="phone-row">
                  <span className="phone-number">
                    {networks[selectedNetwork].number}
                  </span>
                  <button onClick={() => copyToClipboard(networks[selectedNetwork].number)} className="copy-icon-btn" title="Copier le numéro">
                    <Copy size={18} />
                  </button>
                </div>
                <p className="recipient-name">Nom : {networks[selectedNetwork].recipientName}</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                  <label className="upload-label">Preuve de transfert (Capture d'écran)</label>
                  <label className="btn btn-outline upload-btn">
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    <Upload size={20} /> Sélectionner une image
                  </label>
                  
                  {proofImage && (
                    <div className="proof-image-container">
                      <img src={proofImage} alt="Preuve" className="proof-image" />
                    </div>
                  )}
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary submit-payment-btn">
                  {loading ? 'Soumission...' : "Valider mon paiement"}
                </button>
              </form>
            </div>
          </div>

          <div className="checkout-right">
            <div className="checkout-summary-box">
              <h3 className="summary-title">Récapitulatif</h3>
              <div className="summary-item-card">
                <div className="summary-item-info">
                  <h4 className="program-name-summary">{programName}</h4>
                </div>
              </div>
              <div className="summary-price-row">
                <span>Client</span>
                <span className="customer-name-summary">{customer.firstname} {customer.lastname}</span>
              </div>
              <div className="summary-total-row">
                <span>Total à payer</span>
                <span className="total-price">{dynamicPrice.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManualPayment;
