import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';

const Track = () => {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, pending, approved, rejected, not_found
  const [programId, setProgramId] = useState('');
  const [accessLink, setAccessLink] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/payment/track/${trackingId}`);
        if (response.ok) {
          const data = await response.json();
          setStatus(data.status);
          setProgramId(data.programId);
          if (data.accessLink) setAccessLink(data.accessLink);
        } else {
          setStatus('not_found');
        }
      } catch (err) {
        console.error(err);
        setStatus('not_found');
      }
    };
    fetchStatus();
  }, [trackingId]);

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="status-card glass-panel text-center">
          <div className="spinner" style={{ margin: '0 auto 1rem', width: '40px', height: '40px', border: '3px solid rgba(255,182,193,0.3)', borderTopColor: '#ffb3c6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <h3>Recherche de votre commande...</h3>
        </div>
      );
    }

    if (status === 'not_found') {
      return (
        <div className="status-card glass-panel text-center">
          <XCircle className="text-pink scale-up" size={80} style={{ margin: '0 auto', color: '#f44336' }} />
          <h2 className="mt-4" style={{ color: '#f44336' }}>Lien invalide</h2>
          <p className="mt-4 text-large">Ce lien de suivi n'existe pas ou a expiré.</p>
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div className="status-card glass-panel text-center">
          <Clock className="text-pink scale-up" size={80} style={{ margin: '0 auto', color: '#ffcc00' }} />
          <h2 className="mt-4" style={{ color: '#ffcc00' }}>En cours d'examen</h2>
          <p className="mt-4 text-large">Votre paiement est en train d'être vérifié par notre équipe.</p>
          <p className="mt-2 text-muted">Revenez sur cette page un peu plus tard pour voir si votre accès a été validé !</p>
          <button onClick={() => window.location.reload()} className="btn btn-outline mt-6">
            Actualiser la page
          </button>
        </div>
      );
    }

    if (status === 'approved') {
      let link = accessLink || '';
      let buttonText = 'Rejoindre la Communauté';
      if (!link) {
        if (programId === 'woman-king') {
          link = 'https://chat.whatsapp.com/EpqfnVvALmuCKrJ9FlK70P?s=cl&p=i&mlu=4';
          buttonText = 'Rejoindre Woman King Trade';
        } else if (programId === 'ebook-vision' || programId === 'ebook-positionner') {
          link = programId === 'ebook-vision' ? 'https://projetrosekakpo.onrender.com/EBOOK_FIGURE_BOUGIE_ROSE.pdf' : 'https://projetrosekakpo.onrender.com/GUIDE_PRATIQUE_POUR_DEBUTER_LE_TRADING_ROSE_KAKPO.pdf';
          buttonText = 'Télécharger l\'E-Book';
        } else {
          link = 'https://chat.whatsapp.com/JwQ5Bk2S8AmAmdhZHq6AlA';
        }
      } else if (programId.includes('ebook')) {
        buttonText = 'Télécharger l\'E-Book';
      }

      return (
        <div className="status-card glass-panel text-center success-final">
          <CheckCircle2 className="text-green scale-up" size={80} style={{ margin: '0 auto', color: '#25D366' }} />
          <h2 className="mt-4" style={{ color: '#25D366' }}>Paiement Validé ! 🎉</h2>
          <p className="mt-4 text-large">Félicitations, votre accès est prêt.</p>
          
          <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(37, 211, 102, 0.1)', borderRadius: '12px', border: '1px solid rgba(37, 211, 102, 0.2)' }}>
            <h3 style={{ color: '#25D366', marginBottom: '1rem', fontSize: '1.1rem' }}>Voici votre accès :</h3>
            <a href={link} target="_blank" rel="noreferrer" className="btn" style={{ backgroundColor: '#25D366', color: '#fff', border: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', width: '100%', justifyContent: 'center' }}>
              {programId.includes('ebook') ? null : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>}
              {buttonText}
            </a>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="checkout-page animate-fade-up">
      <div className="checkout-header">
        <div className="checkout-container">
          <button onClick={() => navigate('/')} className="checkout-back" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '1rem' }}>
            <ArrowLeft size={18} /> Retour à l'accueil
          </button>
        </div>
      </div>
      <div className="checkout-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Track;
