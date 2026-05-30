import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Users, BookOpen, MessageSquare, Trash2, CreditCard, CheckCircle2, Plus, LayoutDashboard, Search, Bell, LogOut, Tag, Shield, Key, Edit3, ChevronDown, Info, Settings, Upload, Star } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Admin.css';
import { API_URL } from '../config';

const fallbackCopy = (text) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    toast("Copié dans le presse-papier !");
  } catch (err) {
    toast("Copie manuelle requise : " + text);
  }
  textArea.remove();
};

const copyToClipboard = (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      toast("Copié dans le presse-papier !");
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const customConfirm = (message, onConfirm) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span>{message}</span>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => toast.dismiss(t.id)}>Annuler</button>
          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem', background: '#dc2626' }} onClick={() => { toast.dismiss(t.id); onConfirm(); }}>Confirmer</button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const [activeTab, setActiveTab] = useState('overview');

  const [contacts, setContacts] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [manualPayments, setManualPayments] = useState([]);
  const [formations, setFormations] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [newEbook, setNewEbook] = useState({ slug: '', title: '', price: '', description: '', image: '', testimonials: [] });
  const [showEbookForm, setShowEbookForm] = useState(false);
  const [editingEbookId, setEditingEbookId] = useState(null);
  const [resources, setResources] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifications, setReadNotifications] = useState(() => JSON.parse(localStorage.getItem('rose_read_notifs') || '[]'));
  const [repliedContacts, setRepliedContacts] = useState(() => JSON.parse(localStorage.getItem('rose_replied_contacts') || '[]'));

  // Derive notifications
  const notifications = [
    ...contacts.map(c => {
      let title = `Nouveau message de ${c.nom}`;
      if (c.status === 'waiting') title = `Nouvelle réponse de ${c.nom}`;
      const msgText = (c.lastMessage || c.message || '');
      const extract = typeof msgText === 'string' ? msgText.substring(0, 20) + '...' : '';
      return { id: `msg-${c.id}-${new Date(c.date).getTime()}`, type: 'messages', text: `${title} : ${extract}`, date: c.date };
    }),
    ...enrollments.map(e => ({ id: `enr-${e.id}`, type: 'inscriptions', text: `Nouvelle inscription : ${e.firstname || e.nom}`, date: e.date })),
    ...newsletters.map(n => ({ id: `nsl-${n.id}`, type: 'newsletter', text: `Nouvel abonné : ${n.email}`, date: n.date })),
    ...manualPayments.map(m => {
      const name = m.customer_info ? `${m.customer_info.firstname} ${m.customer_info.lastname}` : m.nom;
      return { id: `man-${m.id}`, type: 'manual-payments', text: `Nouveau paiement manuel : ${name}`, date: m.date };
    })
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  const unreadCount = notifications.filter(n => !readNotifications.includes(n.id)).length;
  const [prevUnreadCount, setPrevUnreadCount] = useState(unreadCount);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      const playBeep = (time, freq) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, time);
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(0.5, time + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start(time);
        oscillator.stop(time + 0.3);
      };

      // Double "ding!"
      playBeep(audioCtx.currentTime, 880);
      playBeep(audioCtx.currentTime + 0.15, 1100);
    } catch (e) {
      console.log("Audio not supported");
    }
  };

  useEffect(() => {
    if (unreadCount > prevUnreadCount) {
      playNotificationSound();
    }
    setPrevUnreadCount(unreadCount);
  }, [unreadCount, prevUnreadCount]);

  const handleNotificationClick = (n) => {
    if (!readNotifications.includes(n.id)) {
      const newReads = [...readNotifications, n.id];
      setReadNotifications(newReads);
      localStorage.setItem('rose_read_notifs', JSON.stringify(newReads));
    }
    setActiveTab(n.type);
    setShowNotifications(false);
  };
  const [articles, setArticles] = useState([]);
  const [editingArticleId, setEditingArticleId] = useState(null);
  const [prices, setPrices] = useState([]);
  const [editingPrices, setEditingPrices] = useState({});
  const [collaborators, setCollaborators] = useState([]);
  const [siteContent, setSiteContent] = useState({});
  const [editingContent, setEditingContent] = useState({});
  const [contentStatus, setContentStatus] = useState({});
  const [openSections, setOpenSections] = useState({ hero: true });

  // Testimonials state
  const [testimonialsList, setTestimonialsList] = useState([]);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({ nom: '', message: '', rating: 5, images: [] });

  useEffect(() => {
    if (siteContent.testimonials && siteContent.testimonials.value) {
      try {
        setTestimonialsList(JSON.parse(siteContent.testimonials.value));
      } catch (e) { }
    }
  }, [siteContent]);

  const handleSaveTestimonial = async () => {
    if (!newTestimonial.nom || (!newTestimonial.message && (!newTestimonial.images || newTestimonial.images.length === 0))) {
      toast("Le nom est requis, ainsi qu'un message ou une image.");
      return;
    }
    let updated;
    if (editingTestimonialId) {
      updated = testimonialsList.map(t => t.id === editingTestimonialId ? { ...newTestimonial, id: editingTestimonialId } : t);
    } else {
      updated = [{ ...newTestimonial, id: Date.now() }, ...testimonialsList];
    }
    try {
      const res = await fetch(`${API_URL}/api/admin/content/testimonials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: JSON.stringify(updated) })
      });
      if (res.ok) {
        setTestimonialsList(updated);
        setShowTestimonialForm(false);
        setEditingTestimonialId(null);
        setNewTestimonial({ nom: '', message: '', rating: 5, images: [] });
      } else {
        const err = await res.json();
        toast("Erreur lors de l'enregistrement: " + (err.error || "L'image est peut-être trop lourde."));
      }
    } catch (e) {
      console.error(e);
      toast("Erreur de connexion au serveur. L'image est probablement trop lourde pour être envoyée.");
    }
  };

  const handleDeleteTestimonial = (id) => {
    customConfirm("Supprimer ce témoignage ?", async () => {
      const updated = testimonialsList.filter(t => t.id !== id);
    try {
      await fetch(`${API_URL}/api/admin/content/testimonials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: JSON.stringify(updated) })
      });
      setTestimonialsList(updated);
    } catch (e) { console.error(e); }
    });
  };

  const [newArticle, setNewArticle] = useState({
    title: '',
    category: '',
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
    readTime: '5 min',
    excerpt: '',
    content: '',
    image: ''
  });
  const [isPublishing, setIsPublishing] = useState(false);

  const [newCollab, setNewCollab] = useState({
    username: '',
    password: '',
    role: 'collaborateur'
  });

  const [newFormation, setNewFormation] = useState({
    slug: '',
    title: '',
    price: '',
    capacity: '',
    program: '',
    image: '',
    subtitle: '',
    objectives: '',
    targetAudience: '',
    included: '',
    authorBio: '',
    expirationDate: '',
    accessLink: '',
    testimonials: []
  });
  const [showFormationForm, setShowFormationForm] = useState(false);
  const [editingFormationId, setEditingFormationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [replyingToContact, setReplyingToContact] = useState(null);
  const [replyHistory, setReplyHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchReplyHistory = async (contactId) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/contacts/${contactId}/history`);
      if (res.ok) {
        const data = await res.json();
        setReplyHistory(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (replyingToContact) {
      fetchReplyHistory(replyingToContact.id);
    } else {
      setReplyHistory([]);
    }
  }, [replyingToContact]);

  const handleDeleteReply = async (index) => {
    if (!replyingToContact) return;
    if (window.confirm("Supprimer ce message ?")) {
      try {
        const res = await fetch(`${API_URL}/api/contacts/${replyingToContact.id}/message/${index}`, { method: 'DELETE' });
        if (res.ok) {
          fetchReplyHistory(replyingToContact.id);
        }
      } catch (e) {}
    }
  };
  const [replyMessage, setReplyMessage] = useState('');
  const [replySubject, setReplySubject] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const session = localStorage.getItem('rose_admin_session');
    if (session) {
      try {
        const userData = JSON.parse(session);
        setIsAuthenticated(true);
        setCurrentUser(userData);
        fetchData();
        if (userData.role === 'admin') {
          fetchCollaborators();
        }

        // Auto-refresh data every 15 seconds
        const intervalId = setInterval(() => {
          fetchData();
        }, 15000);

        return () => clearInterval(intervalId);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginUser = username.trim() || 'rose';

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setIsAuthenticated(true);
        setCurrentUser({ username: data.username, role: data.role });
        localStorage.setItem('rose_admin_session', JSON.stringify({ username: data.username, role: data.role }));
        fetchData();
        if (data.role === 'admin') {
          fetchCollaborators();
        }
      } else {
        toast(data.error || "Identifiant ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error(error);
      toast("Erreur de connexion avec le serveur.");
    }
  };

  const fetchCollaborators = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/collaborators`);
      if (response.ok) {
        const data = await response.json();
        setCollaborators(data);
      }
    } catch (error) {
      console.error("Error loading collaborators:", error);
    }
  };

  const fetchData = async () => {
    try {
      const safeFetch = (url) => fetch(url).then(res => res.json()).catch(err => ({ error: true, details: err }));

      const [resContacts, resNewsletters, resEnrollments, resArticles, resPrices, resContent, resFormations, resEbooks, resManual] = await Promise.all([
        safeFetch(`${API_URL}/api/admin/contacts`),
        safeFetch(`${API_URL}/api/admin/newsletters`),
        safeFetch(`${API_URL}/api/admin/enrollments`),
        safeFetch(`${API_URL}/api/articles`),
        safeFetch(`${API_URL}/api/prices`),
        safeFetch(`${API_URL}/api/content`),
        safeFetch(`${API_URL}/api/admin/formations`),
        safeFetch(`${API_URL}/api/ebooks`),
        safeFetch(`${API_URL}/api/admin/manual-payments`)
      ]);

      setContacts(prev => Array.isArray(resContacts) ? resContacts : prev);
      setNewsletters(prev => Array.isArray(resNewsletters) ? resNewsletters : prev);
      setEnrollments(prev => Array.isArray(resEnrollments) ? resEnrollments : prev);
      setArticles(prev => Array.isArray(resArticles) ? resArticles : prev);
      setPrices(prev => Array.isArray(resPrices) ? resPrices : prev);
      setSiteContent(prev => resContent && !resContent.error ? resContent : prev);
      setFormations(prev => Array.isArray(resFormations) ? resFormations : prev);
      setEbooks(prev => Array.isArray(resEbooks) ? resEbooks : prev);
      setManualPayments(prev => Array.isArray(resManual) ? resManual : prev);

      const editMap = {};
      (Array.isArray(resPrices) ? resPrices : []).forEach(p => {
        editMap[p.id] = p.price;
      });
      setEditingPrices(editMap);

      // Init editing content map
      const contentEditMap = {};
      Object.keys(resContent).forEach(k => {
        contentEditMap[k] = resContent[k].value;
      });
      setEditingContent(contentEditMap);

    } catch (error) {
      console.error("Erreur de récupération des données:", error);
      toast("Impossible de charger les données du serveur.");
    }
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    if (!newArticle.title || !newArticle.content || !newArticle.category) {
      toast("Veuillez remplir le titre, le contenu et choisir une catégorie.");
      return;
    }
    setIsPublishing(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      });

      if (response.ok) {
        toast(`Article publié avec succès !`);
        setNewArticle({ title: '', category: '', excerpt: '', content: '', author: 'Rose Kakpo', authorRole: 'Experte en Trading', image: '' });
        setShowArticleForm(false);
        fetchData();
      } else {
        const data = await response.json().catch(() => ({}));
        toast(data.error || "Erreur de création.");
      }
    } catch (error) {
      console.error(error);
      toast("Erreur de réseau : l'image est peut-être trop lourde ou la connexion a été coupée.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteAnnouncement = (id) => {
    customConfirm('Supprimer cette annonce ?', async () => {
      try {
      await fetch(`${API_URL}/api/admin/announcements/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) { console.error(e); }
    });
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !replyingToContact) return;
    setReplySending(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/contacts/${replyingToContact.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage, subject: replySubject })
      });
      if (response.ok) {
        setSuccessMessage('Réponse publiée avec succès sur la page de Suivi !');

        setReplyingToContact(null);
        setReplyMessage('');
        setReplySubject('');
        fetchData();
        setTimeout(() => {
          setSuccessMessage('');
        }, 1500);
      } else {
        const err = await response.json().catch(() => ({ error: 'Erreur inconnue du serveur' }));
        const errorMsg = err.error || 'Erreur lors de l\'envoi de la réponse';
        setError(errorMsg);
        toast(`Échec de l'envoi : ${errorMsg}\n\nAvez-vous bien redémarré le backend ?`);
      }
    } catch (err) {
      setError('Erreur de connexion');
      toast("Erreur de connexion au serveur ! Avez-vous redémarré le backend Node.js ?");
    } finally {
      setReplySending(false);
    }
  };

  const handleDeleteContact = (id) => {
    customConfirm('Supprimer ce message ?', async () => {
      try {
      await fetch(`${API_URL}/api/admin/contacts/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) { console.error(e); }
    });
  };

  const handleDeleteNewsletter = (id) => {
    customConfirm('Supprimer cet abonné de la newsletter ?', async () => {
      try {
      await fetch(`${API_URL}/api/admin/newsletters/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) { console.error(e); }
    });
  };

  const handleDeleteEnrollment = (id) => {
    customConfirm('Supprimer cette inscription ?', async () => {
      try {
      await fetch(`${API_URL}/api/admin/enrollments/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) { console.error(e); }
    });
  };

  const handleDeleteArticle = (id) => {
    customConfirm("Voulez-vous vraiment supprimer cet article ?", async () => {
      try {
        await fetch(`${API_URL}/api/admin/articles/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleUpdatePrice = async (id) => {
    const priceValue = parseFloat(editingPrices[id]);
    if (priceValue === undefined || isNaN(priceValue) || priceValue < 0) {
      toast("Veuillez saisir un prix numérique valide.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/prices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: priceValue })
      });

      if (response.ok) {
        toast("Tarif mis à jour avec succès !");
        fetchData();
      } else {
        const errData = await response.json();
        toast(errData.error || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
      toast("Impossible de se connecter au serveur.");
    }
  };


  const handleApproveManualPayment = async (payment) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/manual-payments/${payment.id}/approve`, { method: 'POST' });
      if (response.ok) {
        const waLink = getWhatsAppLink(payment);
        if (waLink !== '#') {
          window.open(waLink, '_blank');
        }
        fetchData();
      } else {
        const data = await response.json();
        toast(data.error || "Erreur lors de la validation.");
      }
    } catch (err) { toast("Erreur réseau"); }
  };

  const handleRejectManualPayment = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir rejeter/supprimer ce paiement ?")) return;
    try {
      const res = await fetch(`${API_URL}/api/admin/manual-payments/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) { console.error(err); }
  };

  const handleViewImage = (base64) => {
    const win = window.open();
    if (win) {
      win.document.write(`<body style="margin:0;background:#111;display:flex;justify-content:center;align-items:center;min-height:100vh;"><img src="${base64}" style="max-width:100%;max-height:100%;object-fit:contain;"/></body>`);
      win.document.title = "Preuve de Paiement";
      win.document.close();
    }
  };

  const getWhatsAppLink = (payment) => {
    const rawNum = payment.customer_info?.whatsapp || payment.telephone;
    const num = rawNum?.replace(/[^0-9+]/g, '');
    if (!num) return '#';
    const firstname = payment.customer_info?.firstname || payment.nom || '';
    let text = `Bonjour ${firstname}, votre paiement a bien été validé !\n\n`;
    const programId = payment.program_id || payment.programme;
    if (programId === 'woman-king') {
      text += `Voici le lien exclusif pour rejoindre la formation Woman King Trade :\nhttps://chat.whatsapp.com/EpqfnVvALmuCKrJ9FlK70P?s=cl&p=i&mlu=4`;
    } else {
      text += `Veuillez rejoindre nos canaux de communication :\nhttps://chat.whatsapp.com/JwQ5Bk2S8AmAmdhZHq6AlA`;
    }
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setCurrentUser(null);
    localStorage.removeItem('rose_admin_session');
  };

  // CMS: save a single content key
  const handleSaveContent = async (key) => {
    const value = editingContent[key];
    if (value === undefined) return;

    setContentStatus(prev => ({ ...prev, [key]: 'saving' }));

    try {
      const response = await fetch(`${API_URL}/api/admin/content/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });
      const data = await response.json();
      if (response.ok) {
        setContentStatus(prev => ({ ...prev, [key]: 'saved' }));
        setSiteContent(prev => ({ ...prev, [key]: { ...prev[key], value } }));
        // Clear success message after 2s
        setTimeout(() => setContentStatus(prev => ({ ...prev, [key]: null })), 2500);
      } else {
        setContentStatus(prev => ({ ...prev, [key]: 'error' }));
        console.error(data.error);
      }
    } catch {
      setContentStatus(prev => ({ ...prev, [key]: 'error' }));
    }
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Render a single CMS field
  const renderCmsField = (fieldKey) => {
    const item = siteContent[fieldKey];
    if (!item) return null;
    const isLong = item.type === 'html' || (editingContent[fieldKey] || '').length > 80;
    const status = contentStatus[fieldKey];

    return (
      <div className="cms-field" key={fieldKey}>
        <label>
          {item.label}
          {item.type === 'html' && <span className="cms-field-hint">(HTML accepté : &lt;strong&gt;, &lt;span&gt;...)</span>}
        </label>
        <div className="cms-input-row">
          {isLong ? (
            <textarea
              className="glass-input"
              rows={3}
              value={editingContent[fieldKey] || ''}
              onChange={e => setEditingContent(prev => ({ ...prev, [fieldKey]: e.target.value }))}
            />
          ) : (
            <input
              type="text"
              className="glass-input"
              value={editingContent[fieldKey] || ''}
              onChange={e => setEditingContent(prev => ({ ...prev, [fieldKey]: e.target.value }))}
            />
          )}
          <button
            className={`cms-save-btn ${status === 'saved' ? 'saved' : ''}`}
            onClick={() => handleSaveContent(fieldKey)}
          >
            {status === 'saving' ? '...' : status === 'saved' ? '✓ Enregistré' : 'Sauvegarder'}
          </button>
        </div>
        {status === 'error' && <span className="cms-field-status error">❌ Erreur de sauvegarde</span>}
      </div>
    );
  };

  const ceoSections = [
    {
      id: 'seo',
      label: '🔍 Référencement (SEO)',
      keys: ['seo_title', 'seo_description']
    },
    {
      id: 'mail',
      label: '✉️ Configuration de réception des E-mails',
      keys: ['ceo_forward_email', 'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass']
    },
    {
      id: 'contact_public',
      label: '📞 Contact Public (Visible sur le site)',
      keys: ['contact_email', 'contact_phone']
    }
  ];

  const cmsSections = [
    {
      id: 'hero',
      label: '🏠 Section Hero (Accueil)',
      keys: ['hero_title', 'hero_subtitle', 'hero_benefit_1', 'hero_benefit_2', 'hero_benefit_3', 'hero_stat_1', 'hero_stat_1_label', 'hero_stat_2', 'hero_stat_2_label']
    },
    {
      id: 'about_preview',
      label: '💬 Citation & Présentation (Accueil)',
      keys: ['about_quote', 'about_intro']
    },
    {
      id: 'about_page',
      label: '📖 Page À propos',
      keys: ['about_story_1', 'about_story_2', 'about_story_3', 'about_mission', 'about_vision']
    },
    {
      id: 'testimonials',
      label: '⭐ Témoignages',
      keys: ['testimonial_1_text', 'testimonial_1_author', 'testimonial_2_text', 'testimonial_2_author']
    },
    {
      id: 'cta',
      label: '🎯 Appel à l\'action (CTA)',
      keys: ['cta_title', 'cta_subtitle']
    },
    {
      id: 'contact',
      label: '📱 Réseaux sociaux & Liens',
      keys: ['contact_whatsapp', 'contact_facebook', 'contact_instagram', 'contact_telegram']
    }
  ];

  const handleFormationImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFormation({ ...newFormation, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateFormation = async (e) => {
    e.preventDefault();
    if (!newFormation.slug || !newFormation.title) {
      toast("Veuillez au moins remplir le titre et le slug (identifiant URL).");
      return;
    }

    const content_json = {
      subtitle: newFormation.subtitle,
      objectives: newFormation.objectives.split('\\n').filter(s => s.trim() !== ''),
      targetAudience: newFormation.targetAudience.split('\\n').filter(s => s.trim() !== ''),
      included: newFormation.included.split('\\n').filter(s => s.trim() !== ''),
      authorBio: newFormation.authorBio,
      expirationDate: newFormation.expirationDate,
      accessLink: newFormation.accessLink,
      testimonials: newFormation.testimonials
    };

    const payload = { ...newFormation, content_json };

    try {
      const method = editingFormationId ? 'PUT' : 'POST';
      const url = editingFormationId ? `${API_URL}/api/admin/formations/${editingFormationId}` : `${API_URL}/api/admin/formations`;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (response.ok) {
        toast(editingFormationId ? "Formation modifiée avec succès !" : "Formation créée avec succès !");
        setNewFormation({ slug: '', title: '', price: '', capacity: '', program: '', image: '', subtitle: '', objectives: '', targetAudience: '', included: '', authorBio: '', expirationDate: '', accessLink: '', testimonials: [] });
        setEditingFormationId(null);
        setShowFormationForm(false);
        fetchData();
      } else {
        toast(data.error || "Erreur de création.");
      }
    } catch (error) {
      console.error(error);
      toast("Erreur serveur.");
    }
  };

  const handleDeleteFormation = (id) => {
    customConfirm("Supprimer cette formation ? Le lien public ne marchera plus.", async () => {
      try {
      await fetch(`${API_URL}/api/admin/formations/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) {
      console.error(e);
    }
    });
  };

  const handleEditFormation = (f) => {
    let content = {};
    try { content = typeof f.content_json === 'string' ? JSON.parse(f.content_json) : (f.content_json || {}); } catch (e) { }

    setNewFormation({
      slug: f.slug,
      title: f.title,
      price: f.price,
      capacity: f.capacity,
      program: f.program,
      image: f.image || '',
      subtitle: content.subtitle || '',
      objectives: (content.objectives || []).join('\n'),
      targetAudience: (content.targetAudience || []).join('\n'),
      included: (content.included || []).join('\n'),
      authorBio: content.authorBio || '',
      expirationDate: content.expirationDate || '',
      accessLink: content.accessLink || '',
      testimonials: content.testimonials || []
    });
    setEditingFormationId(f.id);
    setShowFormationForm(true);
  };

  const handleEbookImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEbook({ ...newEbook, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateEbook = async (e) => {
    e.preventDefault();
    const url = editingEbookId ? `${API_URL}/api/admin/ebooks/${editingEbookId}` : `${API_URL}/api/admin/ebooks`;
    const method = editingEbookId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEbook, testimonials_json: JSON.stringify(newEbook.testimonials) })
      });
      if (response.ok) {
        setNewEbook({ slug: '', title: '', price: '', description: '', image: '', testimonials: [] });
        setShowEbookForm(false);
        setEditingEbookId(null);
        fetchData();
        toast(`Ebook ${editingEbookId ? 'modifié' : 'créé'} avec succès !`);
      } else {
        const data = await response.json();
        toast(data.error || "Erreur de création de l'ebook.");
      }
    } catch (e) {
      toast("Erreur de connexion.");
    }
  };

  const handleDeleteEbook = (id) => {
    customConfirm("Êtes-vous sûr de vouloir supprimer cet ebook ?", async () => {
      try {
      const response = await fetch(`${API_URL}/api/admin/ebooks/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchData();
      } else {
        toast("Erreur lors de la suppression.");
      }
    } catch (e) {
      toast("Erreur de connexion.");
    }
    });
  };

  const handleEditEbook = (f) => {
    setNewEbook({
      slug: f.slug,
      title: f.title,
      price: f.price,
      description: f.description,
      image: f.image || '',
      testimonials: f.testimonials_json ? JSON.parse(f.testimonials_json) : []
    });
    setEditingEbookId(f.id);
    setShowEbookForm(true);
  };

  const handleCreateCollaborator = async (e) => {
    e.preventDefault();
    if (!newCollab.username || !newCollab.password) {
      toast("Tous les champs sont requis.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/collaborators`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCollab)
      });
      const data = await response.json();

      if (response.ok) {
        toast("Collaborateur ajouté avec succès !");
        setNewCollab({ username: '', password: '', role: 'collaborateur' });
        fetchCollaborators();
      } else {
        toast(data.error || "Erreur de création.");
      }
    } catch (error) {
      console.error(error);
      toast("Erreur de connexion au serveur.");
    }
  };

  const handleDeleteCollaborator = (id) => {
    customConfirm("Voulez-vous vraiment supprimer ce collaborateur ?", async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/collaborators/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (response.ok) {
          toast("Collaborateur supprimé !");
          fetchCollaborators();
        } else {
          toast(data.error || "Erreur lors de la suppression.");
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser.username,
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword
        })
      });
      const data = await response.json();

      if (response.ok) {
        toast("Mot de passe modifié avec succès !");
        setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast(data.error || "Erreur lors du changement de mot de passe.");
      }
    } catch (error) {
      console.error(error);
      toast("Erreur de connexion.");
    }
  };

  const getWeeklyChartData = () => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const data = [];

    // Generate data for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const dayOfMonth = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const dateLabel = `${dayOfMonth}/${month}`;

      // Count registrations on this specific day
      const count = enrollments.filter(e => {
        const enrollDate = new Date(e.date);
        return enrollDate.toDateString() === d.toDateString();
      }).length;

      data.push({
        name: `${dayName} ${dateLabel}`,
        inscriptions: count
      });
    }

    return data;
  };

  const chartData = getWeeklyChartData();

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page section">
        <div className="container">
          <div className="admin-login-box glass-panel">
            <h2 className="text-gradient text-center mb-4">Accès Administrateur</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group mb-3">
                <label className="text-small text-gray mb-1 d-block">Identifiant</label>
                <input
                  type="text"
                  placeholder="Ex: rose"
                  className="glass-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group mb-4">
                <label className="text-small text-gray mb-1 d-block">Mot de passe</label>
                <input
                  type="password"
                  placeholder="Mot de passe"
                  className="glass-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary full-width">Se connecter</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const lowerQuery = searchQuery?.toLowerCase() || '';

  const filteredContacts = contacts.filter(c =>
    c.nom?.toLowerCase().includes(lowerQuery) ||
    c.email?.toLowerCase().includes(lowerQuery) ||
    c.message?.toLowerCase().includes(lowerQuery)
  );

  const filteredEnrollments = enrollments.filter(e =>
    e.firstname?.toLowerCase().includes(lowerQuery) ||
    e.lastname?.toLowerCase().includes(lowerQuery) ||
    e.email?.toLowerCase().includes(lowerQuery) ||
    e.program_id?.toLowerCase().includes(lowerQuery)
  );

  const filteredNewsletters = newsletters.filter(n =>
    n.email?.toLowerCase().includes(lowerQuery)
  );

  const filteredFormations = formations.filter(f =>
    f.title?.toLowerCase().includes(lowerQuery) ||
    f.slug?.toLowerCase().includes(lowerQuery)
  );

  const filteredArticles = articles.filter(a =>
    a.title?.toLowerCase().includes(lowerQuery) ||
    a.category?.toLowerCase().includes(lowerQuery)
  );

  const filteredCollaborators = collaborators.filter(c =>
    c.username?.toLowerCase().includes(lowerQuery) ||
    c.role?.toLowerCase().includes(lowerQuery)
  );

  return (
    <div className="admin-dashboard">
      <Toaster position="top-right" toastOptions={{ style: { background: "#fff", color: "#333", border: "1px solid rgba(244, 114, 182, 0.3)", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", borderRadius: "12px", padding: "16px", fontWeight: "600" }, success: { iconTheme: { primary: "#2E6F40", secondary: "#fff" } } }} />
      <div className="admin-sidebar glass-panel">
        <h3 className="mb-4" style={{ color: 'var(--color-brand-green)' }}>Dashboard</h3>
        <button className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          <LayoutDashboard size={18} /> Vue d'ensemble
        </button>
        <button className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
          <MessageSquare size={18} /> Messages reçus ({contacts.length})
        </button>
        <button className={`admin-tab ${activeTab === 'inscriptions' ? 'active' : ''}`} onClick={() => setActiveTab('inscriptions')}>
          <Users size={18} /> Inscriptions ({enrollments.length})
        </button>
        <button className={`admin-tab ${activeTab === 'manual-payments' ? 'active' : ''}`} onClick={() => setActiveTab('manual-payments')}>
          <CreditCard size={18} /> Paiements Manuels ({manualPayments?.length || 0})
        </button>
        <button className={`admin-tab ${activeTab === 'newsletter' ? 'active' : ''}`} onClick={() => setActiveTab('newsletter')}>
          <Mail size={18} /> Newsletter ({newsletters.length})
        </button>
        <button className={`admin-tab ${activeTab === 'formations' ? 'active' : ''}`} onClick={() => setActiveTab('formations')}>
          <BookOpen size={18} /> Mes Formations ({formations.length})
        </button>
        <button className={`admin-tab ${activeTab === 'ebooks' ? 'active' : ''}`} onClick={() => setActiveTab('ebooks')}>
          <BookOpen size={18} /> Mes Ebooks ({ebooks.length})
        </button>
        <button className={`admin-tab ${activeTab === 'testimonials' ? 'active' : ''}`} onClick={() => setActiveTab('testimonials')}>
          <Star size={18} /> Témoignages
        </button>
        <button className={`admin-tab ${activeTab === 'blog' ? 'active' : ''}`} onClick={() => setActiveTab('blog')}>
          <BookOpen size={18} /> Gérer le Blog ({articles.length})
        </button>
        <button className={`admin-tab ${activeTab === 'tarifs' ? 'active' : ''}`} onClick={() => setActiveTab('tarifs')}>
          <Tag size={18} /> Gérer les Tarifs ({prices.length})
        </button>
        <button className={`admin-tab ${activeTab === 'contenu' ? 'active' : ''}`} onClick={() => setActiveTab('contenu')}>
          <Edit3 size={18} /> Contenu du site
        </button>
        <button className={`admin-tab ${activeTab === 'securite' ? 'active' : ''}`} onClick={() => setActiveTab('securite')}>
          <Shield size={18} /> Sécurité & Collab.
        </button>
        <button className={`admin-tab ${activeTab === 'ceo' ? 'active' : ''}`} onClick={() => setActiveTab('ceo')} style={{ marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <Settings size={18} /> Paramètres CEO
        </button>
      </div>

      <div className="admin-content">
        <div className="admin-topbar glass-panel" style={{ position: 'relative', zIndex: 100 }}>
          <div className="admin-search" style={{ position: 'relative' }}>
            <Search size={18} className="text-gray" />
            <input type="text" placeholder="Rechercher partout..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

            {searchQuery.trim() !== '' && (
              <div className="glass-panel" style={{ position: 'absolute', top: '100%', left: 0, width: '400px', zIndex: 1000, marginTop: '0.5rem', maxHeight: '60vh', overflowY: 'auto', padding: '0.5rem 0', boxShadow: 'var(--shadow-lg)' }}>

                {filteredFormations.length > 0 && (
                  <div style={{ padding: '0.5rem 1rem' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-brand-green)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Formations</h5>
                    {filteredFormations.map(f => (
                      <div key={f.id} onClick={() => { setActiveTab('formations'); setSearchQuery(''); }} style={{ cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.03)', marginBottom: '0.2rem', fontSize: '0.9rem' }}>
                        📘 {f.title}
                      </div>
                    ))}
                  </div>
                )}

                {filteredEnrollments.length > 0 && (
                  <div style={{ padding: '0.5rem 1rem' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-brand-green)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Inscriptions</h5>
                    {filteredEnrollments.map(e => (
                      <div key={e.id} onClick={() => { setActiveTab('inscriptions'); setSearchQuery(''); }} style={{ cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.03)', marginBottom: '0.2rem', fontSize: '0.9rem' }}>
                        👥 {e.firstname} {e.lastname} <br /><small className="text-gray">{e.email}</small>
                      </div>
                    ))}
                  </div>
                )}

                {filteredContacts.length > 0 && (
                  <div style={{ padding: '0.5rem 1rem' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-brand-green)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Messages Reçus</h5>
                    {filteredContacts.map(c => (
                      <div key={c.id} onClick={() => { setActiveTab('messages'); setSearchQuery(''); }} style={{ cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.03)', marginBottom: '0.2rem', fontSize: '0.9rem' }}>
                        💬 {c.nom} <br /><small className="text-gray">{c.email}</small>
                      </div>
                    ))}
                  </div>
                )}

                {filteredArticles.length > 0 && (
                  <div style={{ padding: '0.5rem 1rem' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-brand-green)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Articles de Blog</h5>
                    {filteredArticles.map(a => (
                      <div key={a.id} onClick={() => { setActiveTab('blog'); setSearchQuery(''); }} style={{ cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.03)', marginBottom: '0.2rem', fontSize: '0.9rem' }}>
                        📝 {a.title}
                      </div>
                    ))}
                  </div>
                )}

                {filteredFormations.length === 0 && filteredEnrollments.length === 0 && filteredContacts.length === 0 && filteredArticles.length === 0 && (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-gray-500)', fontSize: '0.9rem' }}>
                    Aucun résultat trouvé pour "{searchQuery}".
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="admin-topbar-actions">
            <div style={{ position: 'relative' }}>
              <button className="btn-icon" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell size={20} className="text-gray" />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: 0, right: 0, background: 'var(--color-brand-pink)', color: 'white', fontSize: '0.6rem', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="notification-dropdown">
                  <div style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-gray-900)' }}>Dernières notifications</h4>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => {
                          const allIds = notifications.map(n => n.id);
                          setReadNotifications(allIds);
                          localStorage.setItem('rose_read_notifs', JSON.stringify(allIds));
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--color-brand-pink)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Tout marquer lu
                      </button>
                    )}
                  </div>
                  {notifications.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {notifications.map(n => {
                        const isRead = readNotifications.includes(n.id);
                        return (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            style={{
                              fontSize: '0.8rem', padding: '0.6rem', borderRadius: '8px',
                              borderBottom: '1px solid var(--color-gray-100)', cursor: 'pointer',
                              background: isRead ? 'transparent' : 'rgba(46, 111, 64, 0.05)',
                              display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
                            onMouseLeave={e => e.currentTarget.style.background = isRead ? 'transparent' : 'rgba(46, 111, 64, 0.05)'}
                          >
                            {!isRead && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-brand-green)', marginTop: '6px', flexShrink: 0 }}></span>}
                            <div style={{ flex: 1 }}>
                              <span style={{ display: 'block', fontWeight: isRead ? 500 : 700, color: 'var(--color-gray-900)' }}>{n.text}</span>
                              <span style={{ color: 'var(--color-gray-500)', fontSize: '0.7rem' }}>{new Date(n.date).toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Aucune notification.</p>
                  )}
                </div>
              )}
            </div>
            <div className="admin-profile">
              <img src="/photo5.jpeg" alt="Rose Kakpo" className="profile-img" />
              <span className="profile-name">Rose K.</span>
            </div>
            <button className="btn-icon text-pink ml-3" onClick={handleLogout} title="Se déconnecter">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="admin-panel animate-fade-up">
            <div className="admin-header-welcome mb-5">
              <h2 className="text-gradient">Bonjour Rose !</h2>
              <p className="text-gray">Voici un résumé de l'activité sur votre plateforme aujourd'hui.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card glass-panel" onClick={() => setActiveTab('messages')}>
                <div className="stat-icon pink-bg-light"><MessageSquare className="text-pink" size={24} /></div>
                <div className="stat-info">
                  <h3>{contacts.length}</h3>
                  <p>Messages reçus</p>
                </div>
              </div>

              <div className="stat-card glass-panel" onClick={() => setActiveTab('inscriptions')}>
                <div className="stat-icon green-bg-light"><Users className="text-green" size={24} /></div>
                <div className="stat-info">
                  <h3>{enrollments.length}</h3>
                  <p>Inscriptions Formations</p>
                </div>
              </div>

              <div className="stat-card glass-panel" onClick={() => setActiveTab('newsletter')}>
                <div className="stat-icon pink-bg-light"><Mail className="text-pink" size={24} /></div>
                <div className="stat-info">
                  <h3>{newsletters.length}</h3>
                  <p>Abonnés Newsletter</p>
                </div>
              </div>

              <div className="stat-card glass-panel" onClick={() => setActiveTab('blog')}>
                <div className="stat-icon green-bg-light"><BookOpen className="text-green" size={24} /></div>
                <div className="stat-info">
                  <h3>{articles.length}</h3>
                  <p>Articles publiés</p>
                </div>
              </div>
            </div>

            <div className="dashboard-overview-grid">
              <div className="chart-card glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0 }}>Inscriptions cette semaine</h3>
                  <span className="announcement-badge badge-success">+15% cette semaine</span>
                </div>
                <div className="chart-container" style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorInscriptions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-brand-pink)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-brand-pink)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Area type="monotone" dataKey="inscriptions" stroke="var(--color-brand-pink)" strokeWidth={3} fillOpacity={1} fill="url(#colorInscriptions)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="recent-activity glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 className="mb-4">Activité Récente</h3>
                <div className="activity-list" style={{ flex: 1, overflowY: 'auto' }}>
                  {enrollments.slice(0, 3).map(e => (
                    <div key={`e-${e.id}`} className="activity-item" style={{ borderBottom: '1px solid var(--color-gray-200)', padding: '0.85rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🎓</div>
                        <div>
                          <strong style={{ color: 'var(--color-gray-900)' }}>{e.nom}</strong> a rejoint <span style={{ color: 'var(--color-brand-green)', fontWeight: 600 }}>{e.programme}</span>
                          <span className="text-small text-gray d-block" style={{ fontSize: '0.75rem', marginTop: '2px' }}>{new Date(e.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {contacts.slice(0, 3).map(c => (
                    <div key={`c-${c.id}`} className="activity-item" style={{ borderBottom: '1px solid var(--color-gray-200)', padding: '0.85rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(244,114,182,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✉️</div>
                        <div>
                          <strong style={{ color: 'var(--color-gray-900)' }}>{c.nom}</strong> a envoyé un message
                          <span className="text-small text-gray d-block" style={{ fontSize: '0.75rem', marginTop: '2px' }}>{new Date(c.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(enrollments.length === 0 && contacts.length === 0) && (
                    <p className="text-gray text-center" style={{ marginTop: '2rem' }}>Aucune activité récente.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="dashboard-banner glass-panel">
              <div className="banner-content">
                <h3>Prête à partager votre expertise ?</h3>
                <p>Vos abonnés attendent vos prochains conseils en trading et mindset.</p>
                <button onClick={() => setActiveTab('blog')} className="btn btn-primary mt-3">Rédiger un nouvel article</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="admin-panel animate-fade-up">
            <h2 className="text-gradient mb-4">Messages de Contact</h2>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead><tr><th>Date</th><th>Nom</th><th>Email</th><th>Sujet</th><th>Message</th><th>Action</th></tr></thead>
                <tbody>
                  {contacts.map(c => (
                    <tr key={c.id} style={{ background: c.status === 'replied' ? 'rgba(46, 111, 64, 0.05)' : (c.status === 'waiting' ? 'rgba(244,114,182,0.1)' : 'transparent') }}>
                      <td>{new Date(c.date).toLocaleDateString()}</td>
                      <td>
                        {c.nom}
                        {c.status === 'replied' && (
                          <span style={{ marginLeft: '8px', fontSize: '0.7rem', background: 'var(--color-brand-green)', color: 'white', padding: '2px 6px', borderRadius: '12px' }}>
                            Répondu
                          </span>
                        )}
                        {c.status === 'waiting' && (
                          <span style={{ marginLeft: '8px', fontSize: '0.7rem', background: 'var(--color-pink)', color: 'white', padding: '2px 6px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
                            Non répondu
                          </span>
                        )}
                      </td>
                      <td>{c.email}</td>
                      <td>Message Site</td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.status === 'waiting' && <strong style={{ color: 'var(--color-pink)' }}>[Nouveau] </strong>}
                        {c.lastMessage || c.message}
                      </td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => {
                            setReplyingToContact(c);
                            setReplySubject(`Réponse à : ${c.sujet || 'Votre message sur Rose Kakpo'}`);

                            // Marquer la notification comme lue automatiquement
                            const notifId = `msg-${c.id}-${new Date(c.date).getTime()}`;
                            if (!readNotifications.includes(notifId)) {
                              const newReads = [...readNotifications, notifId];
                              setReadNotifications(newReads);
                              localStorage.setItem('rose_read_notifs', JSON.stringify(newReads));
                            }
                            // Fetch history is handled by useEffect
                          }}
                          className="btn btn-primary small-btn-admin"
                          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Mail size={14} /> Répondre
                        </button>
                        <button
                          onClick={() => handleDeleteContact(c.id)}
                          className="btn-icon text-pink"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && <tr><td colSpan="6" className="text-center">Aucun message pour le moment.</td></tr>}
                </tbody>
              </table>
            </div>


          </div>
        )}

        {activeTab === 'inscriptions' && (
          <div className="admin-panel animate-fade-up">
            <h2 className="text-gradient mb-4">Inscriptions aux Formations</h2>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead><tr><th>Date</th><th>Nom</th><th>WhatsApp</th><th>Niveau</th><th>Programme</th><th>Action</th></tr></thead>
                <tbody>
                  {enrollments.map(e => (
                    <tr key={e.id}>
                      <td>{new Date(e.date).toLocaleDateString()}</td>
                      <td>{e.nom}</td>
                      <td>{e.whatsapp}</td>
                      <td>{e.niveau}</td>
                      <td><strong style={{ color: 'var(--color-brand-green)' }}>{e.programme}</strong></td>
                      <td>
                        <button
                          onClick={() => handleDeleteEnrollment(e.id)}
                          className="btn-icon text-pink"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {enrollments.length === 0 && <tr><td colSpan="6" className="text-center">Aucune inscription pour le moment.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'newsletter' && (
          <div className="admin-panel animate-fade-up">
            <h2 className="text-gradient mb-4">Abonnés Newsletter</h2>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead><tr><th>Date d'inscription</th><th>Email</th><th>Action</th></tr></thead>
                <tbody>
                  {newsletters.map(n => (
                    <tr key={n.id}>
                      <td>{new Date(n.date).toLocaleDateString()}</td>
                      <td>{n.email}</td>
                      <td>
                        <button
                          onClick={() => handleDeleteNewsletter(n.id)}
                          className="btn-icon text-pink"
                          title="Désinscrire"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {newsletters.length === 0 && <tr><td colSpan="3" className="text-center">Aucun abonné pour le moment.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'formations' && (
          <div className="admin-panel animate-fade-up">
            <div className="admin-section-header">
              <h2 className="text-gradient m-0">Formations & Landing Pages</h2>
              {!showFormationForm && (
                <button onClick={() => { setShowFormationForm(true); setEditingFormationId(null); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} /> Nouvelle Formation
                </button>
              )}
            </div>

            {showFormationForm ? (
              <div className="glass-panel admin-form-container">
                <h3 className="mb-4">{editingFormationId ? 'Modifier la formation' : 'Créer une nouvelle page de formation'}</h3>
                <form onSubmit={handleCreateFormation}>

                  {/* Section 1: Informations */}
                  <div className="admin-form-section">
                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-brand-green)' }}>1. Informations de base</h4>
                    <div className="admin-form-grid-2">
                      <div className="form-group">
                        <label>Titre de la formation</label>
                        <input type="text" className="cms-input" placeholder="Ex: Woman King Trade" value={newFormation.title} onChange={e => {
                          const title = e.target.value;
                          const slug = title.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                          setNewFormation({ ...newFormation, title, slug });
                        }} />
                      </div>
                      <div className="form-group">
                        <label>Lien unique généré</label>
                        <input type="text" className="cms-input" readOnly value={newFormation.slug} placeholder="Généré automatiquement" style={{ backgroundColor: 'var(--color-gray-100)', cursor: 'not-allowed', color: 'var(--color-gray-500)' }} />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Tarification & Capacité */}
                  <div className="admin-form-section">
                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-brand-green)' }}>2. Tarification & Inscriptions</h4>
                    <div className="admin-form-grid-2">
                      <div className="form-group">
                        <label>Prix (en FCFA)</label>
                        <input type="number" className="cms-input" placeholder="Ex: 35000" value={newFormation.price} onChange={e => setNewFormation({ ...newFormation, price: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>Nombre de places disponibles</label>
                        <input type="number" className="cms-input" placeholder="Ex: 20" value={newFormation.capacity} onChange={e => setNewFormation({ ...newFormation, capacity: e.target.value })} />
                      </div>

                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Date limite d'inscription (Optionnel)</label>
                        <p className="text-small text-gray" style={{ marginBottom: '0.5rem' }}>Laissez vide pour un minuteur journalier (qui s'arrête à minuit tous les soirs).</p>
                        <input type="datetime-local" className="cms-input" value={newFormation.expirationDate || ''} onChange={e => setNewFormation({ ...newFormation, expirationDate: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Médias & Contenu */}
                  <div className="admin-form-section">
                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-brand-green)' }}>3. Visuels & Contenu de la page</h4>
                    <div className="form-group mb-4">
                      <label>Affiche / Flyer de la formation</label>
                      <div style={{ padding: '1rem', border: '2px dashed var(--color-gray-300)', borderRadius: '8px', background: '#fff', textAlign: 'center' }}>
                        <input type="file" accept="image/*" onChange={handleFormationImageUpload} style={{ display: 'block', margin: '0 auto 0.5rem auto' }} />
                        <small className="text-gray">Taille recommandée : 1080x1350px (Format Portrait)</small>
                        {newFormation.image && (
                          <div style={{ marginTop: '1rem' }}>
                            <img src={newFormation.image} alt="Aperçu" style={{ height: '150px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Sous-titre (Phrase d'accroche)</label>
                      <input type="text" className="cms-input" placeholder="Ex: Devenez experte en 14 jours" value={newFormation.subtitle} onChange={e => setNewFormation({ ...newFormation, subtitle: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label>Programme détaillé (Ce que vous allez apprendre)</label>
                      <p className="text-small text-gray" style={{ marginBottom: '0.5rem' }}>Mettez un tiret ou un point pour chaque ligne. Cela créera une belle liste sur la page publique.</p>
                      <textarea className="cms-textarea" rows="5" value={newFormation.program} onChange={e => setNewFormation({ ...newFormation, program: e.target.value })} placeholder="• Initiation au trading&#10;• Comprendre le fonctionnement du marché&#10;• Stratégies de trading..."></textarea>
                    </div>
                  </div>

                  {/* Section 4: Générateur Landing Page Pro */}
                  <div className="admin-form-section">
                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-brand-green)' }}>4. Sections Landing Page Pro</h4>

                    <div className="form-group mb-4">
                      <label>Objectifs de la Masterclass / Formation</label>
                      <p className="text-small text-gray" style={{ marginBottom: '0.5rem' }}>Une ligne = un objectif. (Entrée pour passer à la ligne)</p>
                      <textarea className="cms-textarea" rows="4" value={newFormation.objectives} onChange={e => setNewFormation({ ...newFormation, objectives: e.target.value })} placeholder="Atteindre la rentabilité&#10;Gérer ses émotions&#10;Comprendre l'analyse technique"></textarea>
                    </div>

                    <div className="form-group mb-4">
                      <label>Pour qui est cette formation ? (Audience)</label>
                      <p className="text-small text-gray" style={{ marginBottom: '0.5rem' }}>Une ligne = une catégorie de personnes. (Entrée pour passer à la ligne)</p>
                      <textarea className="cms-textarea" rows="4" value={newFormation.targetAudience} onChange={e => setNewFormation({ ...newFormation, targetAudience: e.target.value })} placeholder="Les femmes ambitieuses&#10;Les débutants en trading&#10;Celles qui veulent une nouvelle source de revenus"></textarea>
                    </div>

                    <div className="form-group mb-4">
                      <label>Ce qui est inclus (Bonus & Matériel)</label>
                      <p className="text-small text-gray" style={{ marginBottom: '0.5rem' }}>Une ligne = un bonus. (Entrée pour passer à la ligne)</p>
                      <textarea className="cms-textarea" rows="4" value={newFormation.included} onChange={e => setNewFormation({ ...newFormation, included: e.target.value })} placeholder="Accès au groupe privé Telegram&#10;Support 24/7&#10;Certificat de fin de formation"></textarea>
                    </div>

                    <div className="form-group mb-4">
                      <label>Lien d'accès (WhatsApp, Telegram, Drive...)</label>
                      <p className="text-small text-gray" style={{ marginBottom: '0.5rem' }}>Ce lien sera fourni automatiquement au client après paiement validé.</p>
                      <input type="url" className="cms-input" value={newFormation.accessLink || ''} onChange={e => setNewFormation({ ...newFormation, accessLink: e.target.value })} placeholder="Ex: https://chat.whatsapp.com/votre_lien" />
                    </div>

                    <div className="form-group mb-4">
                      <label>Qui suis-je ? (Bio auteur)</label>
                      <textarea className="cms-textarea" rows="4" value={newFormation.authorBio} onChange={e => setNewFormation({ ...newFormation, authorBio: e.target.value })} placeholder="Je suis Rose Kakpo, Trader indépendante et fondatrice de Woman King Trade. Ma mission est de..."></textarea>
                    </div>

                    <div className="form-group mb-4">
                      <label>Captures de témoignages (Optionnel)</label>
                      <input type="file" accept="image/*" multiple onChange={(e) => {
                        const files = Array.from(e.target.files);
                        const promises = files.map(file => {
                          return new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.readAsDataURL(file);
                          });
                        });
                        Promise.all(promises).then(base64Images => {
                          setNewFormation(prev => ({ ...prev, testimonials: [...(prev.testimonials || []), ...base64Images] }));
                        });
                      }} className="glass-input" />
                      {newFormation.testimonials && newFormation.testimonials.length > 0 && (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                          {newFormation.testimonials.map((img, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                              <img src={img} alt="Témoignage" style={{ height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                              <button type="button" onClick={() => setNewFormation(prev => ({ ...prev, testimonials: prev.testimonials.filter((_, idx) => idx !== i) }))} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', width: '20px', height: '20px', fontSize: '12px' }}>X</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button type="button" onClick={() => { setShowFormationForm(false); setEditingFormationId(null); setNewFormation({ slug: '', title: '', price: '', capacity: '', program: '', image: '', subtitle: '', objectives: '', targetAudience: '', included: '', authorBio: '', expirationDate: '', accessLink: '', testimonials: [] }); }} className="btn btn-secondary">Annuler</button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>{editingFormationId ? 'Mettre à jour la page' : 'Enregistrer et Publier la page'}</button>
                  </div>
                </form>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {formations.map(f => (
                  <div key={f.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                    {f.image && <img src={f.image} alt={f.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />}
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                    <div style={{ color: 'var(--color-gray-600)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>
                      <div>💰 Prix : {f.price} FCFA</div>
                      <div>👥 Places : {f.capacity}</div>
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-brand-green)' }}>
                        Lien : /formation/{f.slug}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          const fullUrl = `${window.location.origin}/formation/${f.slug}`;
                          copyToClipboard(fullUrl);
                        }}
                        className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>
                        Copier le lien
                      </button>
                      <button onClick={() => handleEditFormation(f)} className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--color-brand-gold)' }}>
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDeleteFormation(f.id)} className="btn btn-secondary text-pink" style={{ padding: '0.5rem' }}>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {formations.length === 0 && (
                  <div className="text-center text-gray" style={{ gridColumn: '1 / -1', padding: '3rem' }}>
                    Aucune formation créée. Cliquez sur "Nouvelle Formation" pour commencer.
                  </div>
                )}
              </div>
            )}
          </div>
        )}


        {activeTab === 'manual-payments' && (
          <div className="admin-section animate-fade-up">
            <div className="admin-header-flex">
              <h2><CreditCard size={24} className="text-pink" /> Preuves de Paiement (Mobile Money)</h2>
            </div>
            <div className="admin-card glass-panel" style={{ overflowX: 'auto', padding: '0' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Date</th>
                    <th style={{ padding: '1rem', minWidth: '200px' }}>Client</th>
                    <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>WhatsApp</th>
                    <th style={{ padding: '1rem', minWidth: '150px' }}>Programme</th>
                    <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Réseau</th>
                    <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Statut</th>
                    <th style={{ padding: '1rem' }}>Preuve</th>
                    <th style={{ padding: '1rem', whiteSpace: 'nowrap' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {manualPayments && manualPayments.length > 0 ? (
                    manualPayments.map(payment => (
                      <tr key={payment.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{new Date(payment.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td style={{ padding: '1rem' }}>{payment.customer_info ? `${payment.customer_info.firstname} ${payment.customer_info.lastname}` : payment.nom}<br /><small className="text-muted">{payment.customer_info?.email || payment.email}</small></td>
                        <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                          {(payment.customer_info?.whatsapp || payment.telephone) && (
                            <a
                              href={getWhatsAppLink(payment)}
                              target="_blank"
                              rel="noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#25D366', textDecoration: 'none', fontWeight: 'bold' }}
                              title="Envoyer le lien par WhatsApp"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                              {payment.customer_info?.whatsapp || payment.telephone}
                            </a>
                          )}
                        </td>
                        <td style={{ padding: '1rem' }}>{payment.program_id || payment.programme}</td>
                        <td style={{ padding: '1rem' }}><strong>{payment.network || payment.methode}</strong></td>
                        <td style={{ padding: '1rem' }}>
                          {payment.status === 'pending' ? <span style={{ color: '#ffcc00', fontWeight: 'bold', whiteSpace: 'nowrap' }}>En attente</span> : <span style={{ color: '#4caf50', fontWeight: 'bold', whiteSpace: 'nowrap' }}>Validé</span>}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <button onClick={() => handleViewImage(payment.proof_image || payment.preuve_paiement)} style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                            Voir l'image
                          </button>
                        </td>
                        <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>
                          {payment.status === 'pending' && (
                            <button onClick={() => handleApproveManualPayment(payment)} style={{ backgroundColor: '#4caf50', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', marginRight: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }} title="Valider et ouvrir WhatsApp">
                              Approuver
                            </button>
                          )}
                          <button onClick={() => handleRejectManualPayment(payment.id)} style={{ backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }} title="Supprimer">
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="8" className="text-center text-muted">Aucun paiement manuel enregistré.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ebooks' && (
          <div className="admin-card">
            <div className="flex-between mb-4">
              <h3 className="mb-0">Mes Ebooks ({ebooks.length})</h3>
              <button className="btn btn-primary" onClick={() => {
                setNewEbook({ slug: '', title: '', price: '', description: '', image: '', testimonials: [] });
                setEditingEbookId(null);
                setShowEbookForm(!showEbookForm);
              }}>
                {showEbookForm ? 'Annuler' : '+ Ajouter un Ebook'}
              </button>
            </div>

            {showEbookForm && (
              <div className="mb-5" style={{ background: 'var(--color-gray-100)', padding: '2rem', borderRadius: '12px' }}>
                <h3 className="mb-4">{editingEbookId ? 'Modifier l\'ebook' : 'Ajouter un ebook'}</h3>
                <form onSubmit={handleCreateEbook}>
                  <div className="admin-grid mb-4">
                    <div className="form-group">
                      <label>Titre de l'ebook</label>
                      <input type="text" className="cms-input" value={newEbook.title} onChange={e => setNewEbook({ ...newEbook, title: e.target.value })} placeholder="Ex: De la vision à la maîtrise" />
                    </div>
                    <div className="form-group">
                      <label>Lien (slug) unique</label>
                      <input type="text" className="cms-input" value={newEbook.slug} onChange={e => setNewEbook({ ...newEbook, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} placeholder="Ex: vision-maitrise" />
                    </div>
                    <div className="form-group">
                      <label>Prix (USD)</label>
                      <input type="number" step="0.01" className="cms-input" value={newEbook.price} onChange={e => setNewEbook({ ...newEbook, price: e.target.value })} placeholder="Ex: 15.00" />
                    </div>
                    <div className="form-group">
                      <label>Image de couverture (Optionnel)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center', cursor: 'pointer', margin: 0 }}>
                          <input type="file" accept="image/*" onChange={handleEbookImageUpload} style={{ display: 'none' }} />
                          <Upload size={18} /> Télécharger une image
                        </label>
                        {newEbook.image && (
                          <div style={{ marginTop: '1rem' }}>
                            <img src={newEbook.image} alt="Aperçu" style={{ height: '150px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-4">
                    <label>Description courte</label>
                    <textarea className="cms-textarea" rows="3" value={newEbook.description} onChange={e => setNewEbook({ ...newEbook, description: e.target.value })} placeholder="Courte description du contenu du livre..."></textarea>
                  </div>

                  <div className="form-group mb-4">
                    <label>Captures de témoignages (Optionnel)</label>
                    <input type="file" accept="image/*" multiple onChange={(e) => {
                      const files = Array.from(e.target.files);
                      const promises = files.map(file => {
                        return new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => resolve(reader.result);
                          reader.readAsDataURL(file);
                        });
                      });
                      Promise.all(promises).then(base64Images => {
                        setNewEbook(prev => ({ ...prev, testimonials: [...(prev.testimonials || []), ...base64Images] }));
                      });
                    }} className="glass-input" />
                    {newEbook.testimonials && newEbook.testimonials.length > 0 && (
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                        {newEbook.testimonials.map((img, i) => (
                          <div key={i} style={{ position: 'relative' }}>
                            <img src={img} alt="Témoignage" style={{ height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                            <button type="button" onClick={() => setNewEbook(prev => ({ ...prev, testimonials: prev.testimonials.filter((_, idx) => idx !== i) }))} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', width: '20px', height: '20px', fontSize: '12px' }}>X</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-end" style={{ gap: '1rem' }}>
                    <button type="button" className="btn btn-outline" onClick={() => setShowEbookForm(false)}>Annuler</button>
                    <button type="submit" className="btn btn-primary">{editingEbookId ? 'Enregistrer les modifications' : 'Créer l\'ebook'}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Titre</th>
                    <th>Lien (slug)</th>
                    <th>Prix</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ebooks.length === 0 ? (
                    <tr><td colSpan="6" className="text-center">Aucun ebook trouvé.</td></tr>
                  ) : ebooks.map(eb => (
                    <tr key={eb.id}>
                      <td>
                        {eb.image ? <img src={eb.image} alt="Couverture" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} /> : '-'}
                      </td>
                      <td><strong>{eb.title}</strong></td>
                      <td><code>{eb.slug}</code></td>
                      <td>${eb.price}</td>
                      <td><div style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{eb.description}</div></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem' }} onClick={() => handleEditEbook(eb)}>Modifier</button>
                          <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', color: 'var(--color-brand-pink)', borderColor: 'var(--color-brand-pink)' }} onClick={() => handleDeleteEbook(eb.id)}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="admin-panel animate-fade-up">
            <div className="blog-admin-header">
              <h2>Gestion du Blog</h2>
            </div>

            <div className="blog-admin-grid">
              <div className="blog-list glass-panel">
                <h3>Articles publiés</h3>
                {articles.map(a => (
                  <div key={a.id} className="admin-article-card">
                    <div>
                      <strong>{a.title}</strong>
                      <span className="text-small text-gray d-block">{a.category} - {a.date}</span>
                    </div>
                    <div>
                      <button onClick={() => handleDeleteArticle(a.id)} className="btn-icon text-pink" title="Supprimer">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="blog-create glass-panel">
                <h3><Plus size={18} /> Nouvel Article</h3>
                <form onSubmit={handleCreateArticle}>
                  <div className="form-group">
                    <label>Titre de l'article</label>
                    <input type="text" className="glass-input" value={newArticle.title} onChange={e => setNewArticle({ ...newArticle, title: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Catégorie</label>
                    <select
                      required
                      className="glass-input"
                      value={newArticle.category}
                      onChange={e => setNewArticle({ ...newArticle, category: e.target.value })}
                    >
                      <option value="" disabled>Sélectionner une catégorie</option>
                      <option value="Trading">Trading</option>
                      <option value="Psychologie">Psychologie</option>
                      <option value="Éducation Financière">Éducation Financière</option>
                      <option value="Erreurs de Débutants">Erreurs de Débutants</option>
                      <option value="Motivation & Productivité">Motivation & Productivité</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Court résumé (Excerpt)</label>
                    <textarea className="glass-input" rows="2" value={newArticle.excerpt} onChange={e => setNewArticle({ ...newArticle, excerpt: e.target.value })}></textarea>
                  </div>
                  <div className="form-group">
                    <label>Contenu Complet (Supporte l'HTML ex: &lt;h2&gt;, &lt;p&gt;)</label>
                    <textarea className="glass-input" rows="10" value={newArticle.content} onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}></textarea>
                  </div>
                  <div className="form-group">
                    <label>Image de couverture (Optionnel)</label>
                    <input type="file" accept="image/*" className="glass-input" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 3 * 1024 * 1024) {
                          toast("Cette image est trop lourde. Veuillez choisir une image de moins de 3 Mo.");
                          e.target.value = '';
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => setNewArticle({ ...newArticle, image: reader.result });
                        reader.readAsDataURL(file);
                      }
                    }} />
                    {newArticle.image && <img src={newArticle.image} alt="Preview" style={{ height: '80px', marginTop: '10px', borderRadius: '8px', objectFit: 'cover' }} />}
                  </div>
                  <button type="submit" className="btn btn-primary full-width" disabled={isPublishing}>
                    {isPublishing ? 'Publication en cours...' : 'Publier l\'article'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tarifs' && (
          <div className="admin-panel animate-fade-up">
            <h2 className="text-gradient mb-4">Gestion des Tarifs</h2>
            <p className="text-gray mb-4">Modifiez les tarifs des formations et ebooks en FCFA. La conversion en USD s'effectue automatiquement sur le site.</p>

            <div className="prices-admin-container glass-panel">
              <div className="prices-grid-admin">
                {prices.map(p => (
                  <div key={p.id} className="price-item-row">
                    <div className="price-item-info">
                      <strong>{p.name}</strong>
                      <span className="text-small text-gray d-block">ID: {p.id}</span>
                    </div>

                    <div className="price-item-actions">
                      <div className="price-input-wrapper">
                        <input
                          type="number"
                          className="glass-input price-input"
                          value={editingPrices[p.id] !== undefined ? editingPrices[p.id] : p.price}
                          onChange={(e) => setEditingPrices({
                            ...editingPrices,
                            [p.id]: e.target.value
                          })}
                        />
                        <span className="currency-suffix">FCFA</span>
                      </div>

                      <button
                        onClick={() => handleUpdatePrice(p.id)}
                        className="btn btn-primary small-btn-admin"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contenu' && (
          <div className="admin-panel animate-fade-up">
            <h2 className="text-gradient mb-2">Contenu du Site</h2>
            <p className="text-gray mb-4">Modifiez ici tous les textes affichés sur le site public. Les changements sont instantanés.</p>

            <div className="cms-intro-banner">
              <Info size={20} style={{ color: 'var(--color-brand-pink)', flexShrink: 0, marginTop: '2px' }} />
              <p>
                <strong>Comment ça marche ?</strong> Éditez le texte dans le champ souhaité, puis cliquez sur <strong>Sauvegarder</strong>. Le site public se met à jour automatiquement, sans aucune connaissance technique.
              </p>
            </div>

            <div className="cms-sections-grid">
              {cmsSections.map(section => (
                <div key={section.id} className="cms-section-block">
                  <div className="cms-section-header" onClick={() => toggleSection(section.id)}>
                    <h3>{section.label}</h3>
                    <ChevronDown size={20} className={`cms-chevron ${openSections[section.id] ? 'open' : ''}`} />
                  </div>
                  {openSections[section.id] && (
                    <div className="cms-section-body">
                      {section.keys.map(key => renderCmsField(key))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'securite' && (
          <div className="admin-panel animate-fade-up">
            <h2 className="text-gradient mb-4">Sécurité & Collaborateurs</h2>

            <div className="security-grid">
              {/* Change Password Panel */}
              <div className="security-card glass-panel">
                <h3><Key size={18} className="text-pink d-inline-block mr-2" /> Changer de mot de passe</h3>
                <p className="text-gray mb-4">Mettez à jour le mot de passe de votre compte administrateur ou collaborateur.</p>

                <form onSubmit={handleChangePassword} className="security-form">
                  <div className="form-group mb-3">
                    <label className="mb-1 d-block text-small font-bold text-gray-700">Mot de passe actuel</label>
                    <input
                      type="password"
                      required
                      placeholder="Mot de passe actuel"
                      className="glass-input"
                      value={securityForm.currentPassword}
                      onChange={(e) => setSecurityForm({
                        ...securityForm,
                        currentPassword: e.target.value
                      })}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label className="mb-1 d-block text-small font-bold text-gray-700">Nouveau mot de passe</label>
                    <input
                      type="password"
                      required
                      placeholder="Nouveau mot de passe"
                      className="glass-input"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({
                        ...securityForm,
                        newPassword: e.target.value
                      })}
                    />
                  </div>
                  <div className="form-group mb-4">
                    <label className="mb-1 d-block text-small font-bold text-gray-700">Confirmer le nouveau mot de passe</label>
                    <input
                      type="password"
                      required
                      placeholder="Confirmer le nouveau mot de passe"
                      className="glass-input"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({
                        ...securityForm,
                        confirmPassword: e.target.value
                      })}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary full-width">Modifier le mot de passe</button>
                </form>
              </div>

              {/* Collaborators Management Panel (Admin only) */}
              {currentUser && currentUser.role === 'admin' ? (
                <div className="security-card glass-panel">
                  <h3><Users size={18} className="text-green d-inline-block mr-2" /> Ajouter un Collaborateur</h3>
                  <p className="text-gray mb-4">Créez des accès pour vos collaborateurs. Ils pourront se connecter au dashboard.</p>

                  <form onSubmit={handleCreateCollaborator} className="security-form mb-5">
                    <div className="form-group mb-3">
                      <label className="mb-1 d-block text-small font-bold text-gray-700">Identifiant (Username)</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: assistant"
                        className="glass-input"
                        value={newCollab.username}
                        onChange={(e) => setNewCollab({
                          ...newCollab,
                          username: e.target.value
                        })}
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="mb-1 d-block text-small font-bold text-gray-700">Mot de passe</label>
                      <input
                        type="password"
                        required
                        placeholder="Mot de passe du collaborateur"
                        className="glass-input"
                        value={newCollab.password}
                        onChange={(e) => setNewCollab({
                          ...newCollab,
                          password: e.target.value
                        })}
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label className="mb-1 d-block text-small font-bold text-gray-700">Rôle</label>
                      <select
                        className="glass-input"
                        value={newCollab.role}
                        onChange={(e) => setNewCollab({
                          ...newCollab,
                          role: e.target.value
                        })}
                      >
                        <option value="collaborateur">Collaborateur (Accès restreint)</option>
                        <option value="admin">Administrateur (Contrôle total)</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary full-width">Ajouter le collaborateur</button>
                  </form>

                  <h3 className="mb-3 border-t pt-4">Collaborateurs existants ({collaborators.length})</h3>
                  <div className="collaborator-list">
                    {collaborators.map(collab => (
                      <div key={collab.id} className="collaborator-row">
                        <div className="collab-info">
                          <div className="collab-header-info">
                            <strong className="text-gray-900">{collab.username}</strong>
                            <span className={`badge-role ${collab.role === 'admin' ? 'role-admin' : 'role-collaborator'}`}>
                              {collab.role}
                            </span>
                          </div>
                          <span className="text-small text-gray d-block">Créé le : {new Date(collab.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {collab.username !== 'rose' && (
                          <button
                            onClick={() => handleDeleteCollaborator(collab.id)}
                            className="btn-icon text-pink"
                            title="Supprimer ce collaborateur"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                    {collaborators.length === 0 && <p className="text-gray text-center mt-3">Aucun collaborateur.</p>}
                  </div>
                </div>
              ) : (
                <div className="security-card glass-panel disabled-panel">
                  <h3><Users size={18} className="text-gray d-inline-block mr-2" /> Gestion des Collaborateurs</h3>
                  <p className="text-gray">Seul l'administrateur principal (Rose) peut gérer les accès des collaborateurs.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ceo' && (
          <div className="admin-panel animate-fade-up">
            <div className="admin-header-welcome mb-5">
              <h2 className="text-gradient">Paramètres CEO</h2>
              <p className="text-gray">
                Gérez ici le référencement de votre plateforme et les paramètres d'envoi d'e-mails professionnels.
              </p>
            </div>

            <div className="cms-sections-grid">
              {ceoSections.map(section => (
                <div key={section.id} className="cms-section-block">
                  <div className="cms-section-header" onClick={() => toggleSection(section.id)}>
                    <h3>{section.label}</h3>
                    <ChevronDown size={20} className={`cms-chevron ${openSections[section.id] ? 'open' : ''}`} />
                  </div>
                  {openSections[section.id] && (
                    <div className="cms-section-body">
                      {section.keys.map(key => renderCmsField(key))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="admin-panel animate-fade-up">
            <div className="admin-section-header">
              <h2 className="text-gradient">Témoignages</h2>
              <button className="btn btn-primary" onClick={() => {
                setEditingTestimonialId(null);
                setNewTestimonial({ nom: '', message: '', rating: 5, images: [] });
                setShowTestimonialForm(!showTestimonialForm);
              }}>
                {showTestimonialForm ? 'Annuler' : '+ Ajouter un témoignage'}
              </button>
            </div>

            {showTestimonialForm && (
              <div className="glass-panel p-6 mb-8 form-anim">
                <h3 className="mb-4">{editingTestimonialId ? 'Modifier le témoignage' : 'Ajouter un témoignage'}</h3>
                <div className="form-group mb-3">
                  <label>Nom du client</label>
                  <input type="text" className="glass-input" value={newTestimonial.nom} onChange={e => setNewTestimonial({ ...newTestimonial, nom: e.target.value })} placeholder="ex: Sarah K." />
                </div>
                <div className="form-group mb-3">
                  <label>Message</label>
                  <textarea className="glass-input" rows="4" value={newTestimonial.message} onChange={e => setNewTestimonial({ ...newTestimonial, message: e.target.value })} placeholder="Facultatif si vous ajoutez une capture d'écran"></textarea>
                </div>
                <div className="form-group mb-3">
                  <label>Captures d'écran (Optionnel - Plusieurs possibles)</label>
                  <input type="file" className="glass-input" accept="image/*" multiple onChange={(e) => {
                    const files = Array.from(e.target.files);
                    const promises = files.map(file => {
                      return new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(file);
                      });
                    });
                    Promise.all(promises).then(base64Images => {
                      setNewTestimonial(prev => ({ ...prev, images: [...(prev.images || []), ...base64Images] }));
                    });
                  }} />
                  {newTestimonial.images && newTestimonial.images.length > 0 && (
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                      {newTestimonial.images.map((img, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={img} alt="Preview" style={{ height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                          <button type="button" onClick={() => setNewTestimonial(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', width: '20px', height: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>&times;</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label>Note sur 5</label>
                  <select className="glass-input" value={newTestimonial.rating} onChange={e => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) })}>
                    {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} étoiles</option>)}
                  </select>
                </div>
                <button className="btn btn-primary" onClick={handleSaveTestimonial}>Enregistrer</button>
              </div>
            )}

            {!showTestimonialForm && (
              <div className="data-table-wrapper glass-panel">
                <table className="data-table">
                  <thead><tr><th>Nom</th><th>Message</th><th>Note</th><th>Action</th></tr></thead>
                  <tbody>
                    {testimonialsList.map(t => (
                      <tr key={t.id}>
                        <td><strong>{t.nom}</strong></td>
                        <td>
                          {t.image && <img src={t.image} alt="Capture" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }} />}
                          {t.images && t.images.map((img, i) => <img key={i} src={img} alt="Capture" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '10px' }} />)}
                          {t.message ? t.message.substring(0, 50) + '...' : <span className="text-gray italic">Image uniquement</span>}
                        </td>
                        <td>{'⭐'.repeat(t.rating)}</td>
                        <td>
                          <button className="btn-icon" onClick={() => {
                            setEditingTestimonialId(t.id);
                            const existingImages = t.images || [];
                            if (t.image && existingImages.length === 0) existingImages.push(t.image);
                            setNewTestimonial({ nom: t.nom, message: t.message, rating: t.rating, images: existingImages });
                            setShowTestimonialForm(true);
                          }} title="Modifier" style={{ marginRight: '10px' }}>
                            <Edit3 size={16} className="text-blue" />
                          </button>
                          <button className="btn-icon" onClick={() => handleDeleteTestimonial(t.id)} title="Supprimer">
                            <Trash2 size={16} className="text-pink" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {testimonialsList.length === 0 && <tr><td colSpan="4" className="text-center">Aucun témoignage.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de réponse (placé à la racine pour éviter les problèmes de z-index avec animate-fade-up) */}
      {replyingToContact && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '600px', width: '100%', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Conversation avec {replyingToContact.nom}</h3>
              <button className="btn-icon" onClick={() => setReplyingToContact(null)}><Trash2 size={20} opacity={0} /><span style={{fontSize:'1.5rem', cursor:'pointer'}}>&times;</span></button>
            </div>
            
            <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px', marginBottom: '1rem', border: '1px solid rgba(0,0,0,0.1)', padding: '10px', borderRadius: '8px' }}>
              {/* Message initial du client */}
              <div className="chat-bubble client-bubble" style={{ alignSelf: 'flex-start', background: 'rgba(0,0,0,0.05)', color: 'var(--color-text)', padding: '12px 18px', borderRadius: '18px 18px 18px 2px', maxWidth: '80%', position: 'relative' }}>
                <strong style={{ fontSize: '0.8rem', color: 'var(--color-text)', display: 'block', marginBottom: '4px' }}>Message initial</strong>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{replyingToContact.message}</p>
                <span style={{ fontSize: '0.7rem', opacity: 0.7, display: 'block', textAlign: 'left', marginTop: '5px' }}>{replyingToContact.date ? new Date(replyingToContact.date).toLocaleDateString('fr-FR') : ''}</span>
              </div>

              {/* Historique des réponses */}
              {loadingHistory ? (
                <p className="text-center text-gray">Chargement de l'historique...</p>
              ) : (
                (replyHistory || []).map((h, i) => (
                  <div key={i} className="chat-bubble" style={{ 
                    alignSelf: h.sender === 'admin' ? 'flex-end' : 'flex-start',
                    background: h.sender === 'admin' ? 'var(--gradient-pink)' : 'rgba(0,0,0,0.05)',
                    color: h.sender === 'admin' ? 'white' : 'var(--color-text)',
                    padding: '12px 18px', 
                    borderRadius: h.sender === 'admin' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                    maxWidth: '80%',
                    position: 'relative'
                  }}>
                    <button 
                      onClick={() => handleDeleteReply(i)}
                      style={{ position: 'absolute', top: '5px', right: h.sender === 'admin' ? '10px' : '-25px', background: 'none', border: 'none', color: h.sender === 'admin' ? 'rgba(255,255,255,0.8)' : 'var(--color-pink)', cursor: 'pointer' }}
                      title="Supprimer ce message"
                    >
                      <Trash2 size={14} />
                    </button>
                    {h.sender === 'client' && <strong style={{ fontSize: '0.8rem', color: 'var(--color-text)', display: 'block', marginBottom: '4px' }}>Client ({replyingToContact.nom})</strong>}
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{h.message}</p>
                    <span style={{ fontSize: '0.7rem', opacity: 0.7, display: 'block', textAlign: h.sender === 'admin' ? 'right' : 'left', marginTop: '5px' }}>{h.date ? new Date(h.date).toLocaleDateString('fr-FR') : ''}</span>
                  </div>
                ))
              )}
            </div>

            <div className="form-group mb-3">
              <input
                type="text"
                className="cms-input"
                placeholder="Sujet de la réponse (Optionnel)"
                value={replySubject}
                onChange={e => setReplySubject(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <textarea
                className="cms-textarea"
                rows="3"
                value={replyMessage}
                onChange={e => setReplyMessage(e.target.value)}
                placeholder={`Tapez votre nouvelle réponse à ${replyingToContact.email} ici...`}
              ></textarea>
            </div>
            <div className="flex-end gap-10 mt-4">
              <button className="btn btn-secondary" onClick={() => setReplyingToContact(null)}>Fermer</button>
              <button className="btn btn-primary" onClick={handleSendReply} disabled={replySending || !replyMessage.trim()}>
                {replySending ? 'Publication...' : (successMessage === 'Réponse publiée avec succès sur la page de Suivi !' ? 'Publié !' : 'Envoyer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
