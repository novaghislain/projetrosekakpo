import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle2, Copy } from 'lucide-react';
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
      color: '#005b82'
    },
    'CELTIIS': {
      name: 'CELTIIS Cash',
      number: '(Numéro à venir)',
      recipientName: 'AMEDEOGNONNAN ROSEMONDE GNIDETE KAKPO',
      color: '#e5007d'
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
    alert("Numéro copié !");
  };

  if (success) {
    return (
      <div className="checkout-page animate-fade-up">
        <div className="checkout-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <div className="status-card glass-panel text-center success-final">
            <CheckCircle2 className="text-green scale-up" size={80} style={{ margin: '0 auto' }} />
            <h2 className="text-gradient-pink mt-4">Preuve soumise avec succès !</h2>
            <p className="mt-4 text-large">
              Merci {customer.firstname} ! Votre paiement est en cours de validation par notre équipe.
            </p>
            <p className="mt-2 text-muted">
              Une fois validé, vous recevrez automatiquement vos accès par email pour le programme <strong>{programName}</strong>.
            </p>
            <div className="mt-6">
              <button onClick={() => navigate('/')} className="btn btn-primary">
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
          <button onClick={() => navigate(-1)} className="checkout-back" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '1rem' }}>
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
              
              {error && <div className="checkout-error mb-4" style={{ backgroundColor: 'rgba(255,0,0,0.1)', color: '#ff4d4d', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.2)' }}>{error}</div>}

              <div className="network-selector mb-5" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {Object.keys(networks).map((key) => (
                  <div 
                    key={key}
                    onClick={() => setSelectedNetwork(key)}
                    style={{ 
                      flex: '1 1 calc(33.333% - 1rem)', 
                      padding: '1rem', 
                      borderRadius: '12px', 
                      cursor: 'pointer',
                      border: selectedNetwork === key ? `2px solid ${networks[key].color}` : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: selectedNetwork === key ? 'rgba(255,255,255,0.05)' : 'transparent',
                      textAlign: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <strong style={{ display: 'block', color: networks[key].color, fontSize: '1.2rem' }}>{key}</strong>
                  </div>
                ))}
              </div>

              <div className="payment-instructions glass-panel mb-5" style={{ padding: '1.5rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <h3 style={{ marginBottom: '1rem', color: networks[selectedNetwork].color }}>Détails pour {networks[selectedNetwork].name}</h3>
                <p style={{ marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Montant à transférer :</p>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', marginBottom: '1.5rem' }}>
                  {dynamicPrice.toLocaleString()} FCFA
                </div>

                <p style={{ marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Envoyez au numéro :</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#fff', letterSpacing: '1px' }}>
                    {networks[selectedNetwork].number}
                  </span>
                  <button onClick={() => copyToClipboard(networks[selectedNetwork].number)} style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer' }} title="Copier le numéro">
                    <Copy size={20} />
                  </button>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginTop: '0' }}>Nom : {networks[selectedNetwork].recipientName}</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                  <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '500' }}>Preuve de transfert (Capture d'écran)</label>
                  <label className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center', cursor: 'pointer', margin: 0, padding: '1rem', borderStyle: 'dashed' }}>
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    <Upload size={20} /> Sélectionner une image
                  </label>
                  
                  {proofImage && (
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                      <img src={proofImage} alt="Preuve" style={{ maxWidth: '100%', maxHeight: '250px', borderRadius: '8px', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>

                <button type="submit" disabled={loading} className="checkout-submit-btn pulse-glow mt-4" style={{ width: '100%', padding: '1.2rem' }}>
                  {loading ? 'Soumission...' : "Valider mon paiement"}
                </button>
              </form>
            </div>
          </div>

          <div className="checkout-right">
            <div className="checkout-summary-box">
              <h3 className="summary-title">Récapitulatif</h3>
              <div className="summary-item-card" style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="summary-item-info">
                  <h4>{programName}</h4>
                </div>
              </div>
              <div className="summary-price-row">
                <span>Client</span>
                <span>{customer.firstname} {customer.lastname}</span>
              </div>
              <div className="summary-price-row">
                <span>Total à payer</span>
                <span className="total-price" style={{ fontSize: '1.2rem' }}>{dynamicPrice.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManualPayment;
