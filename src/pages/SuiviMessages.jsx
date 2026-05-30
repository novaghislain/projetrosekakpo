import React, { useState, useRef, useEffect } from 'react';
import { API_URL } from '../config';
import { Search, Mail, MessageCircle, Clock, Send, Trash2 } from 'lucide-react';
import './Home.css'; // Pour réutiliser certains styles

const SuiviMessages = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState(null);
  const [error, setError] = useState('');
  const [replyText, setReplyText] = useState({});
  const [replying, setReplying] = useState({});

  const handleDeleteReply = async (contactId, index) => {
    if (window.confirm("Supprimer ce message ?")) {
      try {
        const response = await fetch(`${API_URL}/api/contacts/${contactId}/message/${index}`, { method: 'DELETE' });
        if (response.ok) {
          handleSearch({ preventDefault: () => {} });
        } else {
          alert("Erreur lors de la suppression.");
        }
      } catch (e) {
        alert("Erreur de connexion.");
      }
    }
  };

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

  const handleClientReply = async (contactId) => {
    const text = replyText[contactId];
    if (!text || !text.trim()) return;

    setReplying(prev => ({ ...prev, [contactId]: true }));
    try {
      const response = await fetch(`${API_URL}/api/contacts/${contactId}/client-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, email })
      });
      if (response.ok) {
        setReplyText(prev => ({ ...prev, [contactId]: '' }));
        // Refresh messages
        handleSearch({ preventDefault: () => {} });
      } else {
        alert("Erreur lors de l'envoi de la réponse.");
      }
    } catch (err) {
      alert("Erreur de connexion.");
    } finally {
      setReplying(prev => ({ ...prev, [contactId]: false }));
    }
  };

  return (
    <div className="page-container" style={{ minHeight: '80vh', paddingTop: '120px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="text-center mb-8 animate-fade-up">
          <h1 className="text-gradient">Suivi de vos messages</h1>
          <p className="subtitle">Consultez l'historique de vos échanges avec nous.</p>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                {messages.map(msg => {
                  let history = [];
                  if (msg.reply && msg.reply.history) {
                    history = msg.reply.history;
                  } else if (msg.reply && msg.reply.message) {
                    history = [{ sender: 'admin', message: msg.reply.message, date: msg.reply.date }];
                  }

                  return (
                    <div key={msg.id} className="glass-panel p-6" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                        <strong className="text-gradient">Sujet : {msg.sujet || 'Demande de contact'}</strong>
                        <span className="badge" style={{ background: history.length > 0 ? 'var(--color-brand-green)' : '#ccc', color: '#fff', fontSize: '0.8rem' }}>
                          {history.length > 0 ? 'Répondu' : 'En attente'}
                        </span>
                      </div>

                      <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                        {/* Message initial du client */}
                        <div className="chat-bubble client-bubble" style={{ alignSelf: 'flex-end', background: 'var(--gradient-pink)', color: 'white', padding: '12px 18px', borderRadius: '18px 18px 2px 18px', maxWidth: '80%' }}>
                          <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                          <span style={{ fontSize: '0.7rem', opacity: 0.7, display: 'block', textAlign: 'right', marginTop: '5px' }}>{new Date(msg.date).toLocaleDateString('fr-FR')}</span>
                        </div>

                        {/* Historique des réponses */}
                        {history.map((h, i) => (
                          <div key={i} className={`chat-bubble ${h.sender === 'client' ? 'client-bubble' : 'admin-bubble'}`} style={{ 
                            alignSelf: h.sender === 'client' ? 'flex-end' : 'flex-start',
                            background: h.sender === 'client' ? 'var(--gradient-pink)' : 'rgba(255,255,255,0.8)',
                            color: h.sender === 'client' ? 'white' : 'var(--color-text)',
                            padding: '12px 18px', 
                            borderRadius: h.sender === 'client' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                            maxWidth: '80%',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            position: 'relative'
                          }}>
                            {/* Option pour supprimer le message si on est le client */}
                            <button 
                              onClick={() => handleDeleteReply(msg.id, i)}
                              style={{ position: 'absolute', top: '5px', right: h.sender === 'client' ? '10px' : '-25px', background: 'none', border: 'none', color: h.sender === 'client' ? 'rgba(255,255,255,0.8)' : 'var(--color-pink)', cursor: 'pointer' }}
                              title="Supprimer ce message"
                            >
                              <Trash2 size={14} />
                            </button>

                            {h.sender === 'admin' && <strong style={{ fontSize: '0.8rem', color: 'var(--color-brand-green)', display: 'block', marginBottom: '4px' }}>Rose Kakpo</strong>}
                            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{h.message}</p>
                            <span style={{ fontSize: '0.7rem', opacity: 0.7, display: 'block', textAlign: h.sender === 'client' ? 'right' : 'left', marginTop: '5px' }}>{new Date(h.date).toLocaleDateString('fr-FR')}</span>
                          </div>
                        ))}
                      </div>

                      {/* Zone de réponse */}
                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <textarea 
                          className="glass-input" 
                          rows="2" 
                          placeholder="Écrivez une réponse..." 
                          style={{ flex: 1, resize: 'none' }}
                          value={replyText[msg.id] || ''}
                          onChange={e => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleClientReply(msg.id);
                            }
                          }}
                        />
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '0 20px', height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={() => handleClientReply(msg.id)}
                          disabled={replying[msg.id] || !replyText[msg.id]?.trim()}
                        >
                          {replying[msg.id] ? '...' : <Send size={20} />}
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuiviMessages;
