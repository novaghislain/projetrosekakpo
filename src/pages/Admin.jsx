import { useState, useEffect } from 'react';
import { Mail, Users, BookOpen, MessageSquare, Trash2, Plus, LayoutDashboard, Search, Bell, LogOut, Tag, Shield, Key, Edit3, ChevronDown, Info, Settings } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Admin.css';

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
    alert("Copié dans le presse-papier !");
  } catch (err) {
    alert("Copie manuelle requise : " + text);
  }
  textArea.remove();
};

const copyToClipboard = (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copié dans le presse-papier !");
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
  const [activeTab, setActiveTab] = useState('overview');

  const [contacts, setContacts] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [formations, setFormations] = useState([]);
  const [resources, setResources] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readNotifications, setReadNotifications] = useState(() => JSON.parse(localStorage.getItem('rose_read_notifs') || '[]'));

  // Derive notifications
  const notifications = [
    ...contacts.map(c => ({ id: `msg-${c.id}`, type: 'messages', text: `Nouveau message de ${c.nom}`, date: c.date })),
    ...enrollments.map(e => ({ id: `enr-${e.id}`, type: 'inscriptions', text: `Nouvelle inscription : ${e.nom}`, date: e.date })),
    ...newsletters.map(n => ({ id: `nsl-${n.id}`, type: 'newsletter', text: `Nouvel abonné : ${n.email}`, date: n.date }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);

  const unreadCount = notifications.filter(n => !readNotifications.includes(n.id)).length;

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
  const [prices, setPrices] = useState([]);
  const [editingPrices, setEditingPrices] = useState({});
  const [collaborators, setCollaborators] = useState([]);
  const [siteContent, setSiteContent] = useState({});
  const [editingContent, setEditingContent] = useState({});
  const [contentStatus, setContentStatus] = useState({});
  const [openSections, setOpenSections] = useState({ hero: true });

  const [newArticle, setNewArticle] = useState({
    title: '',
    category: '',
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
    readTime: '5 min',
    excerpt: '',
    content: ''
  });

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
    expirationDate: ''
  });
  const [showFormationForm, setShowFormationForm] = useState(false);
  const [editingFormationId, setEditingFormationId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginUser = username.trim() || 'rose';

    try {
      const response = await fetch('/api/admin/login', {
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
        alert(data.error || "Identifiant ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion avec le serveur.");
    }
  };

  const fetchCollaborators = async () => {
    try {
      const response = await fetch('/api/admin/collaborators');
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
      const [resContacts, resNewsletters, resEnrollments, resArticles, resPrices, resContent, resFormations] = await Promise.all([
        fetch('/api/admin/contacts').then(res => res.json()),
        fetch('/api/admin/newsletters').then(res => res.json()),
        fetch('/api/admin/enrollments').then(res => res.json()),
        fetch('/api/articles').then(res => res.json()),
        fetch('/api/prices').then(res => res.json()),
        fetch('/api/content').then(res => res.json()),
        fetch('/api/admin/formations').then(res => res.json())
      ]);
      setContacts(resContacts);
      setNewsletters(resNewsletters);
      setEnrollments(resEnrollments);
      setArticles(resArticles);
      setPrices(resPrices);
      setSiteContent(resContent);
      setFormations(resFormations);

      const editMap = {};
      resPrices.forEach(p => {
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
      alert("Impossible de charger les données du serveur.");
    }
  };

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle)
      });
      if (response.ok) {
        alert("Article publié avec succès !");
        setNewArticle({ ...newArticle, title: '', category: '', excerpt: '', content: '' });
        fetchData();
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la publication.");
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    try {
      await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDeleteNewsletter = async (id) => {
    if (!window.confirm('Supprimer cet abonné de la newsletter ?')) return;
    try {
      await fetch(`/api/admin/newsletters/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDeleteEnrollment = async (id) => {
    if (!window.confirm('Supprimer cette inscription ?')) return;
    try {
      await fetch(`/api/admin/enrollments/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) { console.error(e); }
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      try {
        await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUpdatePrice = async (id) => {
    const priceValue = parseFloat(editingPrices[id]);
    if (priceValue === undefined || isNaN(priceValue) || priceValue < 0) {
      alert("Veuillez saisir un prix numérique valide.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/prices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: priceValue })
      });

      if (response.ok) {
        alert("Tarif mis à jour avec succès !");
        fetchData();
      } else {
        const errData = await response.json();
        alert(errData.error || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
      alert("Impossible de se connecter au serveur.");
    }
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
      const response = await fetch(`/api/admin/content/${key}`, {
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
  const CmsField = ({ fieldKey }) => {
    const item = siteContent[fieldKey];
    if (!item) return null;
    const isLong = item.type === 'html' || (editingContent[fieldKey] || '').length > 80;
    const status = contentStatus[fieldKey];

    return (
      <div className="cms-field">
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
    if (!newFormation.slug || !newFormation.title || !newFormation.price || !newFormation.capacity || !newFormation.program) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const content_json = {
      subtitle: newFormation.subtitle,
      objectives: newFormation.objectives.split('\\n').filter(s => s.trim() !== ''),
      targetAudience: newFormation.targetAudience.split('\\n').filter(s => s.trim() !== ''),
      included: newFormation.included.split('\\n').filter(s => s.trim() !== ''),
      authorBio: newFormation.authorBio,
      expirationDate: newFormation.expirationDate
    };

    const payload = { ...newFormation, content_json };
    
    try {
      const method = editingFormationId ? 'PUT' : 'POST';
      const url = editingFormationId ? `/api/admin/formations/${editingFormationId}` : '/api/admin/formations';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (response.ok) {
        alert(editingFormationId ? "Formation modifiée avec succès !" : "Formation créée avec succès !");
        setNewFormation({ slug: '', title: '', price: '', capacity: '', program: '', image: '', subtitle: '', objectives: '', targetAudience: '', included: '', authorBio: '', expirationDate: '' });
        setEditingFormationId(null);
        setShowFormationForm(false);
        fetchData();
      } else {
        alert(data.error || "Erreur de création.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur.");
    }
  };

  const handleDeleteFormation = async (id) => {
    if (!window.confirm("Supprimer cette formation ? Le lien public ne marchera plus.")) return;
    try {
      await fetch(`/api/admin/formations/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditFormation = (f) => {
    let content = {};
    try { content = typeof f.content_json === 'string' ? JSON.parse(f.content_json) : (f.content_json || {}); } catch(e) {}
    
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
      expirationDate: content.expirationDate || ''
    });
    setEditingFormationId(f.id);
    setShowFormationForm(true);
  };

  const handleCreateCollaborator = async (e) => {
    e.preventDefault();
    if (!newCollab.username || !newCollab.password) {
      alert("Tous les champs sont requis.");
      return;
    }

    try {
      const response = await fetch('/api/admin/collaborators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCollab)
      });
      const data = await response.json();

      if (response.ok) {
        alert("Collaborateur ajouté avec succès !");
        setNewCollab({ username: '', password: '', role: 'collaborateur' });
        fetchCollaborators();
      } else {
        alert(data.error || "Erreur de création.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur.");
    }
  };

  const handleDeleteCollaborator = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce collaborateur ?")) {
      try {
        const response = await fetch(`/api/admin/collaborators/${id}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (response.ok) {
          alert("Collaborateur supprimé !");
          fetchCollaborators();
        } else {
          alert(data.error || "Erreur lors de la suppression.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch('/api/admin/change-password', {
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
        alert("Mot de passe modifié avec succès !");
        setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(data.error || "Erreur lors du changement de mot de passe.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion.");
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
        <button className={`admin-tab ${activeTab === 'newsletter' ? 'active' : ''}`} onClick={() => setActiveTab('newsletter')}>
          <Mail size={18} /> Newsletter ({newsletters.length})
        </button>
        <button className={`admin-tab ${activeTab === 'formations' ? 'active' : ''}`} onClick={() => setActiveTab('formations')}>
          <BookOpen size={18} /> Mes Formations ({formations.length})
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
                        👥 {e.firstname} {e.lastname} <br/><small className="text-gray">{e.email}</small>
                      </div>
                    ))}
                  </div>
                )}

                {filteredContacts.length > 0 && (
                  <div style={{ padding: '0.5rem 1rem' }}>
                    <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-brand-green)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Messages Reçus</h5>
                    {filteredContacts.map(c => (
                      <div key={c.id} onClick={() => { setActiveTab('messages'); setSearchQuery(''); }} style={{ cursor: 'pointer', padding: '0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.03)', marginBottom: '0.2rem', fontSize: '0.9rem' }}>
                        💬 {c.nom} <br/><small className="text-gray">{c.email}</small>
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
                    <tr key={c.id}>
                      <td>{new Date(c.date).toLocaleDateString()}</td>
                      <td>{c.nom}</td>
                      <td>{c.email}</td>
                      <td>{c.sujet}</td>
                      <td>{c.message}</td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <a 
                          href={`mailto:${c.email}?subject=Réponse à : ${encodeURIComponent(c.sujet || 'Votre message sur Rose Kakpo')}`} 
                          className="btn btn-primary small-btn-admin" 
                          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Mail size={14} /> Répondre
                        </a>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="text-gradient m-0">Formations & Landing Pages</h2>
              {!showFormationForm && (
                <button onClick={() => { setShowFormationForm(true); setEditingFormationId(null); }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={18} /> Nouvelle Formation
                </button>
              )}
            </div>

            {showFormationForm ? (
              <div className="glass-panel" style={{ padding: '2rem', marginTop: '1rem' }}>
                <h3 className="mb-4">{editingFormationId ? 'Modifier la formation' : 'Créer une nouvelle page de formation'}</h3>
                <form onSubmit={handleCreateFormation}>
                  
                  {/* Section 1: Informations */}
                  <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-gray-200)' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-brand-green)' }}>1. Informations de base</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div className="form-group">
                        <label>Titre de la formation</label>
                        <input type="text" className="cms-input" required placeholder="Ex: Woman King Trade" value={newFormation.title} onChange={e => {
                          const title = e.target.value;
                          const slug = title.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                          setNewFormation({...newFormation, title, slug});
                        }} />
                      </div>
                      <div className="form-group">
                        <label>Lien unique généré</label>
                        <input type="text" className="cms-input" readOnly value={newFormation.slug} placeholder="Généré automatiquement" style={{ backgroundColor: 'var(--color-gray-100)', cursor: 'not-allowed', color: 'var(--color-gray-500)' }} />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Tarification & Capacité */}
                  <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-gray-200)' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-brand-green)' }}>2. Tarification & Inscriptions</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div className="form-group">
                        <label>Prix (en FCFA)</label>
                        <input type="number" className="cms-input" required placeholder="Ex: 35000" value={newFormation.price} onChange={e => setNewFormation({...newFormation, price: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>Nombre de places disponibles</label>
                        <input type="number" className="cms-input" required placeholder="Ex: 20" value={newFormation.capacity} onChange={e => setNewFormation({...newFormation, capacity: e.target.value})} />
                      </div>
                      
                      <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Date limite d'inscription (Optionnel)</label>
                        <p className="text-small text-gray" style={{ marginBottom: '0.5rem' }}>Laissez vide pour un minuteur journalier (qui s'arrête à minuit tous les soirs).</p>
                        <input type="datetime-local" className="cms-input" value={newFormation.expirationDate || ''} onChange={e => setNewFormation({...newFormation, expirationDate: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Médias & Contenu */}
                  <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-gray-200)' }}>
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
                      <input type="text" className="cms-input" placeholder="Ex: Devenez experte en 14 jours" value={newFormation.subtitle} onChange={e => setNewFormation({...newFormation, subtitle: e.target.value})} />
                    </div>
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label>Programme détaillé (Ce que vous allez apprendre)</label>
                      <p className="text-small text-gray" style={{ marginBottom: '0.5rem' }}>Mettez un tiret ou un point pour chaque ligne. Cela créera une belle liste sur la page publique.</p>
                      <textarea className="cms-textarea" rows="5" required value={newFormation.program} onChange={e => setNewFormation({...newFormation, program: e.target.value})} placeholder="• Initiation au trading&#10;• Comprendre le fonctionnement du marché&#10;• Stratégies de trading..."></textarea>
                    </div>
                  </div>

                  {/* Section 4: Générateur Landing Page Pro */}
                  <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--color-gray-200)' }}>
                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-brand-green)' }}>4. Sections Landing Page Pro</h4>
                    
                    <div className="form-group mb-4">
                      <label>Objectifs de la Masterclass / Formation</label>
                      <p className="text-small text-gray" style={{ marginBottom: '0.5rem' }}>Une ligne = un objectif. (Entrée pour passer à la ligne)</p>
                      <textarea className="cms-textarea" rows="4" value={newFormation.objectives} onChange={e => setNewFormation({...newFormation, objectives: e.target.value})} placeholder="Atteindre la rentabilité&#10;Gérer ses émotions&#10;Comprendre l'analyse technique"></textarea>
                    </div>

                    <div className="form-group mb-4">
                      <label>Pour qui est cette formation ? (Audience)</label>
                      <p className="text-small text-gray" style={{ marginBottom: '0.5rem' }}>Une ligne = une catégorie de personnes. (Entrée pour passer à la ligne)</p>
                      <textarea className="cms-textarea" rows="4" value={newFormation.targetAudience} onChange={e => setNewFormation({...newFormation, targetAudience: e.target.value})} placeholder="Les femmes ambitieuses&#10;Les débutants en trading&#10;Celles qui veulent une nouvelle source de revenus"></textarea>
                    </div>

                    <div className="form-group mb-4">
                      <label>Ce qui est inclus (Bonus & Matériel)</label>
                      <p className="text-small text-gray" style={{ marginBottom: '0.5rem' }}>Une ligne = un bonus. (Entrée pour passer à la ligne)</p>
                      <textarea className="cms-textarea" rows="4" value={newFormation.included} onChange={e => setNewFormation({...newFormation, included: e.target.value})} placeholder="Accès au groupe privé Telegram&#10;Support 24/7&#10;Certificat de fin de formation"></textarea>
                    </div>

                    <div className="form-group">
                      <label>Biographie de l'auteur (Qui suis-je ?)</label>
                      <p className="text-small text-gray" style={{ marginBottom: '0.5rem' }}>Un paragraphe court pour vous présenter et asseoir votre autorité.</p>
                      <textarea className="cms-textarea" rows="4" value={newFormation.authorBio} onChange={e => setNewFormation({...newFormation, authorBio: e.target.value})} placeholder="Je suis Rose Kakpo, Trader indépendante et fondatrice de Woman King Trade. Ma mission est de..."></textarea>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    <button type="button" onClick={() => { setShowFormationForm(false); setEditingFormationId(null); setNewFormation({ slug: '', title: '', price: '', capacity: '', program: '', image: '', subtitle: '', objectives: '', targetAudience: '', included: '', authorBio: '', expirationDate: '' }); }} className="btn btn-secondary">Annuler</button>
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
                    <button onClick={() => handleDeleteArticle(a.id)} className="btn-icon text-pink"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>

              <div className="blog-create glass-panel">
                <h3><Plus size={18} /> Nouvel Article</h3>
                <form onSubmit={handleCreateArticle}>
                  <div className="form-group">
                    <label>Titre de l'article</label>
                    <input type="text" required className="glass-input" value={newArticle.title} onChange={e => setNewArticle({ ...newArticle, title: e.target.value })} />
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
                    <textarea required className="glass-input" rows="2" value={newArticle.excerpt} onChange={e => setNewArticle({ ...newArticle, excerpt: e.target.value })}></textarea>
                  </div>
                  <div className="form-group">
                    <label>Contenu Complet (Supporte l'HTML ex: &lt;h2&gt;, &lt;p&gt;)</label>
                    <textarea required className="glass-input" rows="10" value={newArticle.content} onChange={e => setNewArticle({ ...newArticle, content: e.target.value })}></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary full-width">Publier l'article</button>
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
                      {section.keys.map(key => (
                        <CmsField key={key} fieldKey={key} />
                      ))}
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
                      {section.keys.map(key => (
                        <CmsField key={key} fieldKey={key} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
