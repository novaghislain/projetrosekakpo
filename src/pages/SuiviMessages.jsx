import React, { useState } from 'react';
import { API_URL } from '../config';
import { Search, Mail, MessageCircle, Clock, ChevronRight } from 'lucide-react';
import './Home.css'; // Pour réutiliser certains styles

const SuiviMessages = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_URL}/api/contacts/track?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des messages');
      }
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError("Impossible de trouver vos messages. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ minHeight: '80vh', paddingTop: '120px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-gradient">Suivi de vos messages</h1>
          <p className="subtitle">Consultez les réponses à vos demandes de contact ici.</p>
        </div>

        <div className="glass-panel p-6 mb-10 animate-fade-up delay-100">
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Mail size={20} className="text-pink" style={{ position: 'absolute', top: '12px', left: '15px' }} />
              <input 
                type="email" 
                className="glass-input" 
                style={{ paddingLeft: '45px' }}
                placeholder="Entrez votre adresse e-mail..." 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Recherche...' : <><Search size={18} /> Chercher</>}
            </button>
          </form>
          {error && <p className="text-pink mt-4">{error}</p>}
        </div>

        {messages !== null && (
          <div className="animate-fade-up delay-200">
            <h3 className="mb-6">Vos conversations ({messages.length})</h3>
            
            {messages.length === 0 ? (
              <div className="glass-panel p-8 text-center">
                <MessageCircle size={40} className="text-pink mb-4 mx-auto" opacity={0.5} />
                <p>Aucun message trouvé pour cette adresse e-mail.</p>
                <p className="text-sm mt-2" style={{ opacity: 0.7 }}>Avez-vous utilisé une autre adresse lors de l'envoi ?</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {messages.map(msg => (
                  <div key={msg.id} className="glass-panel p-6" style={{ position: 'relative', borderLeft: msg.reply ? '4px solid var(--color-brand-green)' : '4px solid #ccc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
                      <strong>Votre message :</strong>
                      <span className="badge" style={{ background: msg.reply ? 'var(--color-brand-green)' : '#ccc', color: '#fff', fontSize: '0.8rem' }}>
                        {msg.reply ? 'Répondu' : 'En attente'}
                      </span>
                    </div>
                    <p style={{ background: 'rgba(255,255,255,0.3)', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                      {msg.message}
                    </p>
                    
                    {msg.reply && (
                      <div style={{ background: 'rgba(225, 48, 108, 0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(225, 48, 108, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <div style={{ background: 'var(--gradient-pink)', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>R</div>
                          <strong>Réponse de Rose Kakpo :</strong>
                        </div>
                        <h4 style={{ marginBottom: '10px', fontSize: '1rem', opacity: 0.8 }}>{msg.reply.subject}</h4>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{msg.reply.message}</p>
                        <div style={{ marginTop: '15px', fontSize: '0.8rem', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={12} /> Répondu le {new Date(msg.reply.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuiviMessages;
