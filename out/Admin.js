(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // src/pages/Admin.jsx
  var import_react = __require("react");
  var import_react_hot_toast = __toESM(__require("react-hot-toast"), 1);
  var import_lucide_react = __require("lucide-react");
  var import_recharts = __require("recharts");

  // src/config.js
  var import_meta = {};
  var API_URL = import_meta.env.VITE_API_URL || "";

  // src/pages/Admin.jsx
  var fallbackCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      (0, import_react_hot_toast.default)("Copi\xE9 dans le presse-papier !");
    } catch (err) {
      (0, import_react_hot_toast.default)("Copie manuelle requise : " + text);
    }
    textArea.remove();
  };
  var copyToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        (0, import_react_hot_toast.default)("Copi\xE9 dans le presse-papier !");
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };
  var Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = (0, import_react.useState)(false);
    const [username, setUsername] = (0, import_react.useState)("");
    const [password, setPassword] = (0, import_react.useState)("");
    const [currentUser, setCurrentUser] = (0, import_react.useState)(null);
    const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
    const [contacts, setContacts] = (0, import_react.useState)([]);
    const [newsletters, setNewsletters] = (0, import_react.useState)([]);
    const [enrollments, setEnrollments] = (0, import_react.useState)([]);
    const [manualPayments, setManualPayments] = (0, import_react.useState)([]);
    const [formations, setFormations] = (0, import_react.useState)([]);
    const [ebooks, setEbooks] = (0, import_react.useState)([]);
    const [newEbook, setNewEbook] = (0, import_react.useState)({ slug: "", title: "", price: "", description: "", image: "", testimonials: [] });
    const [showEbookForm, setShowEbookForm] = (0, import_react.useState)(false);
    const [editingEbookId, setEditingEbookId] = (0, import_react.useState)(null);
    const [resources, setResources] = (0, import_react.useState)([]);
    const [showNotifications, setShowNotifications] = (0, import_react.useState)(false);
    const [readNotifications, setReadNotifications] = (0, import_react.useState)(() => JSON.parse(localStorage.getItem("rose_read_notifs") || "[]"));
    const [repliedContacts, setRepliedContacts] = (0, import_react.useState)(() => JSON.parse(localStorage.getItem("rose_replied_contacts") || "[]"));
    const notifications = [
      ...contacts.map((c) => ({ id: `msg-${c.id}`, type: "messages", text: `Nouveau message de ${c.nom}`, date: c.date })),
      ...enrollments.map((e) => ({ id: `enr-${e.id}`, type: "inscriptions", text: `Nouvelle inscription : ${e.nom}`, date: e.date })),
      ...newsletters.map((n) => ({ id: `nsl-${n.id}`, type: "newsletter", text: `Nouvel abonn\xE9 : ${n.email}`, date: n.date }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8);
    const unreadCount = notifications.filter((n) => !readNotifications.includes(n.id)).length;
    const handleNotificationClick = (n) => {
      if (!readNotifications.includes(n.id)) {
        const newReads = [...readNotifications, n.id];
        setReadNotifications(newReads);
        localStorage.setItem("rose_read_notifs", JSON.stringify(newReads));
      }
      setActiveTab(n.type);
      setShowNotifications(false);
    };
    const [articles, setArticles] = (0, import_react.useState)([]);
    const [editingArticleId, setEditingArticleId] = (0, import_react.useState)(null);
    const [prices, setPrices] = (0, import_react.useState)([]);
    const [editingPrices, setEditingPrices] = (0, import_react.useState)({});
    const [collaborators, setCollaborators] = (0, import_react.useState)([]);
    const [siteContent, setSiteContent] = (0, import_react.useState)({});
    const [editingContent, setEditingContent] = (0, import_react.useState)({});
    const [contentStatus, setContentStatus] = (0, import_react.useState)({});
    const [openSections, setOpenSections] = (0, import_react.useState)({ hero: true });
    const [testimonialsList, setTestimonialsList] = (0, import_react.useState)([]);
    const [showTestimonialForm, setShowTestimonialForm] = (0, import_react.useState)(false);
    const [editingTestimonialId, setEditingTestimonialId] = (0, import_react.useState)(null);
    const [newTestimonial, setNewTestimonial] = (0, import_react.useState)({ nom: "", message: "", rating: 5, images: [] });
    (0, import_react.useEffect)(() => {
      if (siteContent.testimonials && siteContent.testimonials.value) {
        try {
          setTestimonialsList(JSON.parse(siteContent.testimonials.value));
        } catch (e) {
        }
      }
    }, [siteContent]);
    const handleSaveTestimonial = async () => {
      if (!newTestimonial.nom || !newTestimonial.message && (!newTestimonial.images || newTestimonial.images.length === 0)) {
        (0, import_react_hot_toast.default)("Le nom est requis, ainsi qu'un message ou une image.");
        return;
      }
      let updated;
      if (editingTestimonialId) {
        updated = testimonialsList.map((t) => t.id === editingTestimonialId ? { ...newTestimonial, id: editingTestimonialId } : t);
      } else {
        updated = [{ ...newTestimonial, id: Date.now() }, ...testimonialsList];
      }
      try {
        const res = await fetch(`${API_URL}/api/admin/content/testimonials`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: JSON.stringify(updated) })
        });
        if (res.ok) {
          setTestimonialsList(updated);
          setShowTestimonialForm(false);
          setEditingTestimonialId(null);
          setNewTestimonial({ nom: "", message: "", rating: 5, images: [] });
        } else {
          const err = await res.json();
          (0, import_react_hot_toast.default)("Erreur lors de l'enregistrement: " + (err.error || "L'image est peut-\xEAtre trop lourde."));
        }
      } catch (e) {
        console.error(e);
        (0, import_react_hot_toast.default)("Erreur de connexion au serveur. L'image est probablement trop lourde pour \xEAtre envoy\xE9e.");
      }
    };
    const handleDeleteTestimonial = async (id) => {
      if (!window.confirm("Supprimer ce t\xE9moignage ?")) return;
      const updated = testimonialsList.filter((t) => t.id !== id);
      try {
        await fetch(`${API_URL}/api/admin/content/testimonials`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: JSON.stringify(updated) })
        });
        setTestimonialsList(updated);
      } catch (e) {
        console.error(e);
      }
    };
    const [newArticle, setNewArticle] = (0, import_react.useState)({
      title: "",
      category: "",
      date: (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
      readTime: "5 min",
      excerpt: "",
      content: "",
      image: ""
    });
    const [newCollab, setNewCollab] = (0, import_react.useState)({
      username: "",
      password: "",
      role: "collaborateur"
    });
    const [newFormation, setNewFormation] = (0, import_react.useState)({
      slug: "",
      title: "",
      price: "",
      capacity: "",
      program: "",
      image: "",
      subtitle: "",
      objectives: "",
      targetAudience: "",
      included: "",
      authorBio: "",
      expirationDate: "",
      accessLink: "",
      testimonials: []
    });
    const [showFormationForm, setShowFormationForm] = (0, import_react.useState)(false);
    const [editingFormationId, setEditingFormationId] = (0, import_react.useState)(null);
    const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
    const [replyingToContact, setReplyingToContact] = (0, import_react.useState)(null);
    const [replyMessage, setReplyMessage] = (0, import_react.useState)("");
    const [replySubject, setReplySubject] = (0, import_react.useState)("");
    const [replySending, setReplySending] = (0, import_react.useState)(false);
    const [securityForm, setSecurityForm] = (0, import_react.useState)({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    (0, import_react.useEffect)(() => {
      const session = localStorage.getItem("rose_admin_session");
      if (session) {
        try {
          const userData = JSON.parse(session);
          setIsAuthenticated(true);
          setCurrentUser(userData);
          fetchData();
          if (userData.role === "admin") {
            fetchCollaborators();
          }
        } catch (e) {
          console.error(e);
        }
      }
    }, []);
    const handleLogin = async (e) => {
      e.preventDefault();
      const loginUser = username.trim() || "rose";
      try {
        const response = await fetch(`${API_URL}/api/admin/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: loginUser, password })
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setIsAuthenticated(true);
          setCurrentUser({ username: data.username, role: data.role });
          localStorage.setItem("rose_admin_session", JSON.stringify({ username: data.username, role: data.role }));
          fetchData();
          if (data.role === "admin") {
            fetchCollaborators();
          }
        } else {
          (0, import_react_hot_toast.default)(data.error || "Identifiant ou mot de passe incorrect.");
        }
      } catch (error) {
        console.error(error);
        (0, import_react_hot_toast.default)("Erreur de connexion avec le serveur.");
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
        const [resContacts, resNewsletters, resEnrollments, resArticles, resPrices, resContent, resFormations, resEbooks, resManual] = await Promise.all([
          fetch(`${API_URL}/api/admin/contacts`).then((res) => res.json()),
          fetch(`${API_URL}/api/admin/newsletters`).then((res) => res.json()),
          fetch(`${API_URL}/api/admin/enrollments`).then((res) => res.json()),
          fetch(`${API_URL}/api/articles`).then((res) => res.json()),
          fetch(`${API_URL}/api/prices`).then((res) => res.json()),
          fetch(`${API_URL}/api/content`).then((res) => res.json()),
          fetch(`${API_URL}/api/admin/formations`).then((res) => res.json()),
          fetch(`${API_URL}/api/ebooks`).then((res) => res.json()),
          fetch(`${API_URL}/api/admin/manual-payments`).then((res) => res.json())
        ]);
        setContacts(resContacts);
        setNewsletters(resNewsletters);
        setEnrollments(resEnrollments);
        setArticles(resArticles);
        setPrices(resPrices);
        setSiteContent(resContent);
        setFormations(resFormations);
        setEbooks(resEbooks);
        if (Array.isArray(resManual)) setManualPayments(resManual);
        const editMap = {};
        resPrices.forEach((p) => {
          editMap[p.id] = p.price;
        });
        setEditingPrices(editMap);
        const contentEditMap = {};
        Object.keys(resContent).forEach((k) => {
          contentEditMap[k] = resContent[k].value;
        });
        setEditingContent(contentEditMap);
      } catch (error) {
        console.error("Erreur de r\xE9cup\xE9ration des donn\xE9es:", error);
        (0, import_react_hot_toast.default)("Impossible de charger les donn\xE9es du serveur.");
      }
    };
    const handleCreateArticle = async (e) => {
      e.preventDefault();
      try {
        let response;
        if (editingArticleId) {
          response = await fetch(`${API_URL}/api/admin/articles/${editingArticleId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newArticle)
          });
        } else {
          response = await fetch(`${API_URL}/api/admin/articles`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newArticle)
          });
        }
        if (response.ok) {
          const savedArticle = await response.json();
          if (editingArticleId) {
            setArticles(articles.map((a) => a.id === editingArticleId ? savedArticle : a));
          } else {
            setArticles([savedArticle, ...articles]);
          }
          (0, import_react_hot_toast.default)(`Article ${editingArticleId ? "modifi\xE9" : "publi\xE9"} avec succ\xE8s !`);
          setNewArticle({ title: "", category: "Tous", excerpt: "", content: "", author: "Rose Kakpo", authorRole: "Experte en Trading", image: "" });
          setShowArticleForm(false);
          setEditingArticleId(null);
        } else {
          fetchData();
        }
      } catch (error) {
        console.error(error);
        (0, import_react_hot_toast.default)("Erreur lors de la publication.");
      }
    };
    const handleDeleteAnnouncement = async (id) => {
      if (!window.confirm("Supprimer cette annonce ?")) return;
      try {
        await fetch(`${API_URL}/api/admin/announcements/${id}`, { method: "DELETE" });
        fetchData();
      } catch (e) {
        console.error(e);
      }
    };
    const handleSendReply = async () => {
      if (!replyMessage.trim() || !replyingToContact) return;
      setReplySending(true);
      try {
        const response = await fetch(`${API_URL}/api/admin/contacts/${replyingToContact.id}/reply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: replyMessage, subject: replySubject })
        });
        if (response.ok) {
          setSuccessMessage("R\xE9ponse envoy\xE9e avec succ\xE8s.");
          if (!repliedContacts.includes(replyingToContact.id)) {
            const newReplied = [...repliedContacts, replyingToContact.id];
            setRepliedContacts(newReplied);
            localStorage.setItem("rose_replied_contacts", JSON.stringify(newReplied));
          }
          setReplyingToContact(null);
          setReplyMessage("");
          setReplySubject("");
          setTimeout(() => setSuccessMessage(""), 3e3);
        } else {
          const err = await response.json().catch(() => ({ error: "Erreur inconnue du serveur" }));
          const errorMsg = err.error || "Erreur lors de l'envoi de la r\xE9ponse";
          setError(errorMsg);
          (0, import_react_hot_toast.default)(`\xC9chec de l'envoi : ${errorMsg}

Avez-vous bien red\xE9marr\xE9 le backend ?`);
        }
      } catch (err) {
        setError("Erreur de connexion");
        (0, import_react_hot_toast.default)("Erreur de connexion au serveur ! Avez-vous red\xE9marr\xE9 le backend Node.js ?");
      } finally {
        setReplySending(false);
      }
    };
    const handleDeleteContact = async (id) => {
      if (!window.confirm("Supprimer ce message ?")) return;
      try {
        await fetch(`${API_URL}/api/admin/contacts/${id}`, { method: "DELETE" });
        fetchData();
      } catch (e) {
        console.error(e);
      }
    };
    const handleDeleteNewsletter = async (id) => {
      if (!window.confirm("Supprimer cet abonn\xE9 de la newsletter ?")) return;
      try {
        await fetch(`${API_URL}/api/admin/newsletters/${id}`, { method: "DELETE" });
        fetchData();
      } catch (e) {
        console.error(e);
      }
    };
    const handleDeleteEnrollment = async (id) => {
      if (!window.confirm("Supprimer cette inscription ?")) return;
      try {
        await fetch(`${API_URL}/api/admin/enrollments/${id}`, { method: "DELETE" });
        fetchData();
      } catch (e) {
        console.error(e);
      }
    };
    const handleDeleteArticle = async (id) => {
      if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
        try {
          await fetch(`${API_URL}/api/admin/articles/${id}`, { method: "DELETE" });
          fetchData();
        } catch (error) {
          console.error(error);
        }
      }
    };
    const handleUpdatePrice = async (id) => {
      const priceValue = parseFloat(editingPrices[id]);
      if (priceValue === void 0 || isNaN(priceValue) || priceValue < 0) {
        (0, import_react_hot_toast.default)("Veuillez saisir un prix num\xE9rique valide.");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/admin/prices/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price: priceValue })
        });
        if (response.ok) {
          (0, import_react_hot_toast.default)("Tarif mis \xE0 jour avec succ\xE8s !");
          fetchData();
        } else {
          const errData = await response.json();
          (0, import_react_hot_toast.default)(errData.error || "Erreur lors de la mise \xE0 jour.");
        }
      } catch (error) {
        console.error("Erreur de mise \xE0 jour:", error);
        (0, import_react_hot_toast.default)("Impossible de se connecter au serveur.");
      }
    };
    const handleApproveManualPayment = async (payment) => {
      try {
        const response = await fetch(`${API_URL}/api/admin/manual-payments/${payment.id}/approve`, { method: "POST" });
        if (response.ok) {
          const waLink = getWhatsAppLink(payment);
          if (waLink !== "#") {
            window.open(waLink, "_blank");
          }
          fetchData();
        } else {
          const data = await response.json();
          (0, import_react_hot_toast.default)(data.error || "Erreur lors de la validation.");
        }
      } catch (err) {
        (0, import_react_hot_toast.default)("Erreur r\xE9seau");
      }
    };
    const handleRejectManualPayment = async (id) => {
      if (!window.confirm("\xCAtes-vous s\xFBr de vouloir rejeter/supprimer ce paiement ?")) return;
      try {
        const res = await fetch(`${API_URL}/api/admin/manual-payments/${id}`, { method: "DELETE" });
        if (res.ok) fetchData();
      } catch (err) {
        console.error(err);
      }
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
      const num = payment.customer_info?.whatsapp?.replace(/[^0-9+]/g, "");
      if (!num) return "#";
      let text = `Bonjour ${payment.customer_info?.firstname}, votre paiement a bien \xE9t\xE9 valid\xE9 !

`;
      if (payment.program_id === "woman-king") {
        text += `Voici le lien exclusif pour rejoindre la formation Woman King Trade :
https://chat.whatsapp.com/EpqfnVvALmuCKrJ9FlK70P?s=cl&p=i&mlu=4`;
      } else {
        text += `Veuillez rejoindre nos canaux de communication :
https://chat.whatsapp.com/JwQ5Bk2S8AmAmdhZHq6AlA`;
      }
      return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
    };
    const handleLogout = () => {
      setIsAuthenticated(false);
      setUsername("");
      setPassword("");
      setCurrentUser(null);
      localStorage.removeItem("rose_admin_session");
    };
    const handleSaveContent = async (key) => {
      const value = editingContent[key];
      if (value === void 0) return;
      setContentStatus((prev) => ({ ...prev, [key]: "saving" }));
      try {
        const response = await fetch(`${API_URL}/api/admin/content/${key}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value })
        });
        const data = await response.json();
        if (response.ok) {
          setContentStatus((prev) => ({ ...prev, [key]: "saved" }));
          setSiteContent((prev) => ({ ...prev, [key]: { ...prev[key], value } }));
          setTimeout(() => setContentStatus((prev) => ({ ...prev, [key]: null })), 2500);
        } else {
          setContentStatus((prev) => ({ ...prev, [key]: "error" }));
          console.error(data.error);
        }
      } catch {
        setContentStatus((prev) => ({ ...prev, [key]: "error" }));
      }
    };
    const toggleSection = (section) => {
      setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };
    const renderCmsField = (fieldKey) => {
      const item = siteContent[fieldKey];
      if (!item) return null;
      const isLong = item.type === "html" || (editingContent[fieldKey] || "").length > 80;
      const status = contentStatus[fieldKey];
      return /* @__PURE__ */ React.createElement("div", { className: "cms-field", key: fieldKey }, /* @__PURE__ */ React.createElement("label", null, item.label, item.type === "html" && /* @__PURE__ */ React.createElement("span", { className: "cms-field-hint" }, "(HTML accept\xE9 : <strong>, <span>...)")), /* @__PURE__ */ React.createElement("div", { className: "cms-input-row" }, isLong ? /* @__PURE__ */ React.createElement(
        "textarea",
        {
          className: "glass-input",
          rows: 3,
          value: editingContent[fieldKey] || "",
          onChange: (e) => setEditingContent((prev) => ({ ...prev, [fieldKey]: e.target.value }))
        }
      ) : /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          className: "glass-input",
          value: editingContent[fieldKey] || "",
          onChange: (e) => setEditingContent((prev) => ({ ...prev, [fieldKey]: e.target.value }))
        }
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          className: `cms-save-btn ${status === "saved" ? "saved" : ""}`,
          onClick: () => handleSaveContent(fieldKey)
        },
        status === "saving" ? "..." : status === "saved" ? "\u2713 Enregistr\xE9" : "Sauvegarder"
      )), status === "error" && /* @__PURE__ */ React.createElement("span", { className: "cms-field-status error" }, "\u274C Erreur de sauvegarde"));
    };
    const ceoSections = [
      {
        id: "seo",
        label: "\u{1F50D} R\xE9f\xE9rencement (SEO)",
        keys: ["seo_title", "seo_description"]
      },
      {
        id: "mail",
        label: "\u2709\uFE0F Configuration de r\xE9ception des E-mails",
        keys: ["ceo_forward_email", "smtp_host", "smtp_port", "smtp_user", "smtp_pass"]
      },
      {
        id: "contact_public",
        label: "\u{1F4DE} Contact Public (Visible sur le site)",
        keys: ["contact_email", "contact_phone"]
      }
    ];
    const cmsSections = [
      {
        id: "hero",
        label: "\u{1F3E0} Section Hero (Accueil)",
        keys: ["hero_title", "hero_subtitle", "hero_benefit_1", "hero_benefit_2", "hero_benefit_3", "hero_stat_1", "hero_stat_1_label", "hero_stat_2", "hero_stat_2_label"]
      },
      {
        id: "about_preview",
        label: "\u{1F4AC} Citation & Pr\xE9sentation (Accueil)",
        keys: ["about_quote", "about_intro"]
      },
      {
        id: "about_page",
        label: "\u{1F4D6} Page \xC0 propos",
        keys: ["about_story_1", "about_story_2", "about_story_3", "about_mission", "about_vision"]
      },
      {
        id: "testimonials",
        label: "\u2B50 T\xE9moignages",
        keys: ["testimonial_1_text", "testimonial_1_author", "testimonial_2_text", "testimonial_2_author"]
      },
      {
        id: "cta",
        label: "\u{1F3AF} Appel \xE0 l'action (CTA)",
        keys: ["cta_title", "cta_subtitle"]
      },
      {
        id: "contact",
        label: "\u{1F4F1} R\xE9seaux sociaux & Liens",
        keys: ["contact_whatsapp", "contact_facebook", "contact_instagram", "contact_telegram"]
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
        (0, import_react_hot_toast.default)("Veuillez au moins remplir le titre et le slug (identifiant URL).");
        return;
      }
      const content_json = {
        subtitle: newFormation.subtitle,
        objectives: newFormation.objectives.split("\\n").filter((s) => s.trim() !== ""),
        targetAudience: newFormation.targetAudience.split("\\n").filter((s) => s.trim() !== ""),
        included: newFormation.included.split("\\n").filter((s) => s.trim() !== ""),
        authorBio: newFormation.authorBio,
        expirationDate: newFormation.expirationDate,
        accessLink: newFormation.accessLink,
        testimonials: newFormation.testimonials
      };
      const payload = { ...newFormation, content_json };
      try {
        const method = editingFormationId ? "PUT" : "POST";
        const url = editingFormationId ? `${API_URL}/api/admin/formations/${editingFormationId}` : `${API_URL}/api/admin/formations`;
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (response.ok) {
          (0, import_react_hot_toast.default)(editingFormationId ? "Formation modifi\xE9e avec succ\xE8s !" : "Formation cr\xE9\xE9e avec succ\xE8s !");
          setNewFormation({ slug: "", title: "", price: "", capacity: "", program: "", image: "", subtitle: "", objectives: "", targetAudience: "", included: "", authorBio: "", expirationDate: "", accessLink: "", testimonials: [] });
          setEditingFormationId(null);
          setShowFormationForm(false);
          fetchData();
        } else {
          (0, import_react_hot_toast.default)(data.error || "Erreur de cr\xE9ation.");
        }
      } catch (error) {
        console.error(error);
        (0, import_react_hot_toast.default)("Erreur serveur.");
      }
    };
    const handleDeleteFormation = async (id) => {
      if (!window.confirm("Supprimer cette formation ? Le lien public ne marchera plus.")) return;
      try {
        await fetch(`${API_URL}/api/admin/formations/${id}`, { method: "DELETE" });
        fetchData();
      } catch (e) {
        console.error(e);
      }
    };
    const handleEditFormation = (f) => {
      let content = {};
      try {
        content = typeof f.content_json === "string" ? JSON.parse(f.content_json) : f.content_json || {};
      } catch (e) {
      }
      setNewFormation({
        slug: f.slug,
        title: f.title,
        price: f.price,
        capacity: f.capacity,
        program: f.program,
        image: f.image || "",
        subtitle: content.subtitle || "",
        objectives: (content.objectives || []).join("\n"),
        targetAudience: (content.targetAudience || []).join("\n"),
        included: (content.included || []).join("\n"),
        authorBio: content.authorBio || "",
        expirationDate: content.expirationDate || "",
        accessLink: content.accessLink || "",
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
      const method = editingEbookId ? "PUT" : "POST";
      try {
        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newEbook, testimonials_json: JSON.stringify(newEbook.testimonials) })
        });
        if (response.ok) {
          setNewEbook({ slug: "", title: "", price: "", description: "", image: "", testimonials: [] });
          setShowEbookForm(false);
          setEditingEbookId(null);
          fetchData();
          (0, import_react_hot_toast.default)(`Ebook ${editingEbookId ? "modifi\xE9" : "cr\xE9\xE9"} avec succ\xE8s !`);
        } else {
          const data = await response.json();
          (0, import_react_hot_toast.default)(data.error || "Erreur de cr\xE9ation de l'ebook.");
        }
      } catch (e2) {
        (0, import_react_hot_toast.default)("Erreur de connexion.");
      }
    };
    const handleDeleteEbook = async (id) => {
      if (!window.confirm("\xCAtes-vous s\xFBr de vouloir supprimer cet ebook ?")) return;
      try {
        const response = await fetch(`${API_URL}/api/admin/ebooks/${id}`, { method: "DELETE" });
        if (response.ok) {
          fetchData();
        } else {
          (0, import_react_hot_toast.default)("Erreur lors de la suppression.");
        }
      } catch (e) {
        (0, import_react_hot_toast.default)("Erreur de connexion.");
      }
    };
    const handleEditEbook = (f) => {
      setNewEbook({
        slug: f.slug,
        title: f.title,
        price: f.price,
        description: f.description,
        image: f.image || "",
        testimonials: f.testimonials_json ? JSON.parse(f.testimonials_json) : []
      });
      setEditingEbookId(f.id);
      setShowEbookForm(true);
    };
    const handleCreateCollaborator = async (e) => {
      e.preventDefault();
      if (!newCollab.username || !newCollab.password) {
        (0, import_react_hot_toast.default)("Tous les champs sont requis.");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/admin/collaborators`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCollab)
        });
        const data = await response.json();
        if (response.ok) {
          (0, import_react_hot_toast.default)("Collaborateur ajout\xE9 avec succ\xE8s !");
          setNewCollab({ username: "", password: "", role: "collaborateur" });
          fetchCollaborators();
        } else {
          (0, import_react_hot_toast.default)(data.error || "Erreur de cr\xE9ation.");
        }
      } catch (error) {
        console.error(error);
        (0, import_react_hot_toast.default)("Erreur de connexion au serveur.");
      }
    };
    const handleDeleteCollaborator = async (id) => {
      if (window.confirm("Voulez-vous vraiment supprimer ce collaborateur ?")) {
        try {
          const response = await fetch(`${API_URL}/api/admin/collaborators/${id}`, {
            method: "DELETE"
          });
          const data = await response.json();
          if (response.ok) {
            (0, import_react_hot_toast.default)("Collaborateur supprim\xE9 !");
            fetchCollaborators();
          } else {
            (0, import_react_hot_toast.default)(data.error || "Erreur lors de la suppression.");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    const handleChangePassword = async (e) => {
      e.preventDefault();
      if (securityForm.newPassword !== securityForm.confirmPassword) {
        (0, import_react_hot_toast.default)("Les nouveaux mots de passe ne correspondent pas.");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/api/admin/change-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: currentUser.username,
            currentPassword: securityForm.currentPassword,
            newPassword: securityForm.newPassword
          })
        });
        const data = await response.json();
        if (response.ok) {
          (0, import_react_hot_toast.default)("Mot de passe modifi\xE9 avec succ\xE8s !");
          setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } else {
          (0, import_react_hot_toast.default)(data.error || "Erreur lors du changement de mot de passe.");
        }
      } catch (error) {
        console.error(error);
        (0, import_react_hot_toast.default)("Erreur de connexion.");
      }
    };
    const getWeeklyChartData = () => {
      const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = /* @__PURE__ */ new Date();
        d.setDate(d.getDate() - i);
        const dayName = days[d.getDay()];
        const dayOfMonth = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const dateLabel = `${dayOfMonth}/${month}`;
        const count = enrollments.filter((e) => {
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
      return /* @__PURE__ */ React.createElement("div", { className: "admin-login-page section" }, /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("div", { className: "admin-login-box glass-panel" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gradient text-center mb-4" }, "Acc\xE8s Administrateur"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleLogin }, /* @__PURE__ */ React.createElement("div", { className: "form-group mb-3" }, /* @__PURE__ */ React.createElement("label", { className: "text-small text-gray mb-1 d-block" }, "Identifiant"), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          placeholder: "Ex: rose",
          className: "glass-input",
          value: username,
          onChange: (e) => setUsername(e.target.value)
        }
      )), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-4" }, /* @__PURE__ */ React.createElement("label", { className: "text-small text-gray mb-1 d-block" }, "Mot de passe"), /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "password",
          placeholder: "Mot de passe",
          className: "glass-input",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true
        }
      )), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary full-width" }, "Se connecter")))));
    }
    const lowerQuery = searchQuery?.toLowerCase() || "";
    const filteredContacts = contacts.filter(
      (c) => c.nom?.toLowerCase().includes(lowerQuery) || c.email?.toLowerCase().includes(lowerQuery) || c.message?.toLowerCase().includes(lowerQuery)
    );
    const filteredEnrollments = enrollments.filter(
      (e) => e.firstname?.toLowerCase().includes(lowerQuery) || e.lastname?.toLowerCase().includes(lowerQuery) || e.email?.toLowerCase().includes(lowerQuery) || e.program_id?.toLowerCase().includes(lowerQuery)
    );
    const filteredNewsletters = newsletters.filter(
      (n) => n.email?.toLowerCase().includes(lowerQuery)
    );
    const filteredFormations = formations.filter(
      (f) => f.title?.toLowerCase().includes(lowerQuery) || f.slug?.toLowerCase().includes(lowerQuery)
    );
    const filteredArticles = articles.filter(
      (a) => a.title?.toLowerCase().includes(lowerQuery) || a.category?.toLowerCase().includes(lowerQuery)
    );
    const filteredCollaborators = collaborators.filter(
      (c) => c.username?.toLowerCase().includes(lowerQuery) || c.role?.toLowerCase().includes(lowerQuery)
    );
    return /* @__PURE__ */ React.createElement("div", { className: "admin-dashboard" }, /* @__PURE__ */ React.createElement(import_react_hot_toast.Toaster, { position: "top-right", toastOptions: { style: { background: "#fff", color: "#333", border: "1px solid rgba(244, 114, 182, 0.3)", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", borderRadius: "12px", padding: "16px", fontWeight: "600" }, success: { iconTheme: { primary: "#2E6F40", secondary: "#fff" } } } }), /* @__PURE__ */ React.createElement("div", { className: "admin-sidebar glass-panel" }, /* @__PURE__ */ React.createElement("h3", { className: "mb-4", style: { color: "var(--color-brand-green)" } }, "Dashboard"), /* @__PURE__ */ React.createElement("button", { className: `admin-tab ${activeTab === "overview" ? "active" : ""}`, onClick: () => setActiveTab("overview") }, /* @__PURE__ */ React.createElement(import_lucide_react.LayoutDashboard, { size: 18 }), " Vue d'ensemble"), /* @__PURE__ */ React.createElement("button", { className: `admin-tab ${activeTab === "messages" ? "active" : ""}`, onClick: () => setActiveTab("messages") }, /* @__PURE__ */ React.createElement(import_lucide_react.MessageSquare, { size: 18 }), " Messages re\xE7us (", contacts.length, ")"), /* @__PURE__ */ React.createElement("button", { className: `admin-tab ${activeTab === "inscriptions" ? "active" : ""}`, onClick: () => setActiveTab("inscriptions") }, /* @__PURE__ */ React.createElement(import_lucide_react.Users, { size: 18 }), " Inscriptions (", enrollments.length, ")"), /* @__PURE__ */ React.createElement("button", { className: `admin-tab ${activeTab === "newsletter" ? "active" : ""}`, onClick: () => setActiveTab("newsletter") }, /* @__PURE__ */ React.createElement(import_lucide_react.Mail, { size: 18 }), " Newsletter (", newsletters.length, ")"), /* @__PURE__ */ React.createElement("button", { className: `admin-tab ${activeTab === "formations" ? "active" : ""}`, onClick: () => setActiveTab("formations") }, /* @__PURE__ */ React.createElement(import_lucide_react.BookOpen, { size: 18 }), " Mes Formations (", formations.length, ")"), /* @__PURE__ */ React.createElement("button", { className: `admin-tab ${activeTab === "ebooks" ? "active" : ""}`, onClick: () => setActiveTab("ebooks") }, /* @__PURE__ */ React.createElement(import_lucide_react.BookOpen, { size: 18 }), " Mes Ebooks (", ebooks.length, ")"), /* @__PURE__ */ React.createElement("button", { className: `admin-tab ${activeTab === "testimonials" ? "active" : ""}`, onClick: () => setActiveTab("testimonials") }, /* @__PURE__ */ React.createElement(import_lucide_react.Star, { size: 18 }), " T\xE9moignages"), /* @__PURE__ */ React.createElement("button", { className: `admin-tab ${activeTab === "blog" ? "active" : ""}`, onClick: () => setActiveTab("blog") }, /* @__PURE__ */ React.createElement(import_lucide_react.BookOpen, { size: 18 }), " G\xE9rer le Blog (", articles.length, ")"), /* @__PURE__ */ React.createElement("button", { className: `admin-tab ${activeTab === "tarifs" ? "active" : ""}`, onClick: () => setActiveTab("tarifs") }, /* @__PURE__ */ React.createElement(import_lucide_react.Tag, { size: 18 }), " G\xE9rer les Tarifs (", prices.length, ")"), /* @__PURE__ */ React.createElement("button", { className: `admin-tab ${activeTab === "contenu" ? "active" : ""}`, onClick: () => setActiveTab("contenu") }, /* @__PURE__ */ React.createElement(import_lucide_react.Edit3, { size: 18 }), " Contenu du site"), /* @__PURE__ */ React.createElement("button", { className: `admin-tab ${activeTab === "securite" ? "active" : ""}`, onClick: () => setActiveTab("securite") }, /* @__PURE__ */ React.createElement(import_lucide_react.Shield, { size: 18 }), " S\xE9curit\xE9 & Collab."), /* @__PURE__ */ React.createElement("button", { className: `admin-tab ${activeTab === "ceo" ? "active" : ""}`, onClick: () => setActiveTab("ceo"), style: { marginTop: "auto", borderTop: "1px solid rgba(0,0,0,0.05)" } }, /* @__PURE__ */ React.createElement(import_lucide_react.Settings, { size: 18 }), " Param\xE8tres CEO")), /* @__PURE__ */ React.createElement("div", { className: "admin-content" }, /* @__PURE__ */ React.createElement("div", { className: "admin-topbar glass-panel", style: { position: "relative", zIndex: 100 } }, /* @__PURE__ */ React.createElement("div", { className: "admin-search", style: { position: "relative" } }, /* @__PURE__ */ React.createElement(import_lucide_react.Search, { size: 18, className: "text-gray" }), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Rechercher partout...", className: "search-input", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) }), searchQuery.trim() !== "" && /* @__PURE__ */ React.createElement("div", { className: "glass-panel", style: { position: "absolute", top: "100%", left: 0, width: "400px", zIndex: 1e3, marginTop: "0.5rem", maxHeight: "60vh", overflowY: "auto", padding: "0.5rem 0", boxShadow: "var(--shadow-lg)" } }, filteredFormations.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "0.5rem 1rem" } }, /* @__PURE__ */ React.createElement("h5", { style: { margin: "0 0 0.5rem 0", color: "var(--color-brand-green)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" } }, "Formations"), filteredFormations.map((f) => /* @__PURE__ */ React.createElement("div", { key: f.id, onClick: () => {
      setActiveTab("formations");
      setSearchQuery("");
    }, style: { cursor: "pointer", padding: "0.5rem", borderRadius: "4px", background: "rgba(0,0,0,0.03)", marginBottom: "0.2rem", fontSize: "0.9rem" } }, "\u{1F4D8} ", f.title))), filteredEnrollments.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "0.5rem 1rem" } }, /* @__PURE__ */ React.createElement("h5", { style: { margin: "0 0 0.5rem 0", color: "var(--color-brand-green)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" } }, "Inscriptions"), filteredEnrollments.map((e) => /* @__PURE__ */ React.createElement("div", { key: e.id, onClick: () => {
      setActiveTab("inscriptions");
      setSearchQuery("");
    }, style: { cursor: "pointer", padding: "0.5rem", borderRadius: "4px", background: "rgba(0,0,0,0.03)", marginBottom: "0.2rem", fontSize: "0.9rem" } }, "\u{1F465} ", e.firstname, " ", e.lastname, " ", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("small", { className: "text-gray" }, e.email)))), filteredContacts.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "0.5rem 1rem" } }, /* @__PURE__ */ React.createElement("h5", { style: { margin: "0 0 0.5rem 0", color: "var(--color-brand-green)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" } }, "Messages Re\xE7us"), filteredContacts.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.id, onClick: () => {
      setActiveTab("messages");
      setSearchQuery("");
    }, style: { cursor: "pointer", padding: "0.5rem", borderRadius: "4px", background: "rgba(0,0,0,0.03)", marginBottom: "0.2rem", fontSize: "0.9rem" } }, "\u{1F4AC} ", c.nom, " ", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("small", { className: "text-gray" }, c.email)))), filteredArticles.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "0.5rem 1rem" } }, /* @__PURE__ */ React.createElement("h5", { style: { margin: "0 0 0.5rem 0", color: "var(--color-brand-green)", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" } }, "Articles de Blog"), filteredArticles.map((a) => /* @__PURE__ */ React.createElement("div", { key: a.id, onClick: () => {
      setActiveTab("blog");
      setSearchQuery("");
    }, style: { cursor: "pointer", padding: "0.5rem", borderRadius: "4px", background: "rgba(0,0,0,0.03)", marginBottom: "0.2rem", fontSize: "0.9rem" } }, "\u{1F4DD} ", a.title))), filteredFormations.length === 0 && filteredEnrollments.length === 0 && filteredContacts.length === 0 && filteredArticles.length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "1rem", textAlign: "center", color: "var(--color-gray-500)", fontSize: "0.9rem" } }, 'Aucun r\xE9sultat trouv\xE9 pour "', searchQuery, '".'))), /* @__PURE__ */ React.createElement("div", { className: "admin-topbar-actions" }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("button", { className: "btn-icon", onClick: () => setShowNotifications(!showNotifications) }, /* @__PURE__ */ React.createElement(import_lucide_react.Bell, { size: 20, className: "text-gray" }), unreadCount > 0 && /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", top: 0, right: 0, background: "var(--color-brand-pink)", color: "white", fontSize: "0.6rem", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center" } }, unreadCount)), showNotifications && /* @__PURE__ */ React.createElement("div", { className: "notification-dropdown" }, /* @__PURE__ */ React.createElement("div", { style: { padding: "1rem", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("h4", { style: { margin: 0, fontSize: "0.9rem", color: "var(--color-gray-900)" } }, "Derni\xE8res notifications"), unreadCount > 0 && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          const allIds = notifications.map((n) => n.id);
          setReadNotifications(allIds);
          localStorage.setItem("rose_read_notifs", JSON.stringify(allIds));
        },
        style: { background: "none", border: "none", color: "var(--color-brand-pink)", fontSize: "0.75rem", cursor: "pointer", fontWeight: 600 }
      },
      "Tout marquer lu"
    )), notifications.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "0.75rem" } }, notifications.map((n) => {
      const isRead = readNotifications.includes(n.id);
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: n.id,
          onClick: () => handleNotificationClick(n),
          style: {
            fontSize: "0.8rem",
            padding: "0.6rem",
            borderRadius: "8px",
            borderBottom: "1px solid var(--color-gray-100)",
            cursor: "pointer",
            background: isRead ? "transparent" : "rgba(46, 111, 64, 0.05)",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem",
            transition: "background 0.2s"
          },
          onMouseEnter: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.03)",
          onMouseLeave: (e) => e.currentTarget.style.background = isRead ? "transparent" : "rgba(46, 111, 64, 0.05)"
        },
        !isRead && /* @__PURE__ */ React.createElement("span", { style: { width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-brand-green)", marginTop: "6px", flexShrink: 0 } }),
        /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "block", fontWeight: isRead ? 500 : 700, color: "var(--color-gray-900)" } }, n.text), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--color-gray-500)", fontSize: "0.7rem" } }, new Date(n.date).toLocaleString()))
      );
    })) : /* @__PURE__ */ React.createElement("p", { style: { fontSize: "0.8rem", color: "var(--color-gray-500)" } }, "Aucune notification."))), /* @__PURE__ */ React.createElement("div", { className: "admin-profile" }, /* @__PURE__ */ React.createElement("img", { src: "/photo5.jpeg", alt: "Rose Kakpo", className: "profile-img" }), /* @__PURE__ */ React.createElement("span", { className: "profile-name" }, "Rose K.")), /* @__PURE__ */ React.createElement("button", { className: "btn-icon text-pink ml-3", onClick: handleLogout, title: "Se d\xE9connecter" }, /* @__PURE__ */ React.createElement(import_lucide_react.LogOut, { size: 20 })))), activeTab === "overview" && /* @__PURE__ */ React.createElement("div", { className: "admin-panel animate-fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "admin-header-welcome mb-5" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gradient" }, "Bonjour Rose !"), /* @__PURE__ */ React.createElement("p", { className: "text-gray" }, "Voici un r\xE9sum\xE9 de l'activit\xE9 sur votre plateforme aujourd'hui.")), /* @__PURE__ */ React.createElement("div", { className: "stats-grid" }, /* @__PURE__ */ React.createElement("div", { className: "stat-card glass-panel", onClick: () => setActiveTab("messages") }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon pink-bg-light" }, /* @__PURE__ */ React.createElement(import_lucide_react.MessageSquare, { className: "text-pink", size: 24 })), /* @__PURE__ */ React.createElement("div", { className: "stat-info" }, /* @__PURE__ */ React.createElement("h3", null, contacts.length), /* @__PURE__ */ React.createElement("p", null, "Messages re\xE7us"))), /* @__PURE__ */ React.createElement("div", { className: "stat-card glass-panel", onClick: () => setActiveTab("inscriptions") }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon green-bg-light" }, /* @__PURE__ */ React.createElement(import_lucide_react.Users, { className: "text-green", size: 24 })), /* @__PURE__ */ React.createElement("div", { className: "stat-info" }, /* @__PURE__ */ React.createElement("h3", null, enrollments.length), /* @__PURE__ */ React.createElement("p", null, "Inscriptions Formations"))), /* @__PURE__ */ React.createElement("div", { className: "stat-card glass-panel", onClick: () => setActiveTab("newsletter") }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon pink-bg-light" }, /* @__PURE__ */ React.createElement(import_lucide_react.Mail, { className: "text-pink", size: 24 })), /* @__PURE__ */ React.createElement("div", { className: "stat-info" }, /* @__PURE__ */ React.createElement("h3", null, newsletters.length), /* @__PURE__ */ React.createElement("p", null, "Abonn\xE9s Newsletter"))), /* @__PURE__ */ React.createElement("div", { className: "stat-card glass-panel", onClick: () => setActiveTab("blog") }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon green-bg-light" }, /* @__PURE__ */ React.createElement(import_lucide_react.BookOpen, { className: "text-green", size: 24 })), /* @__PURE__ */ React.createElement("div", { className: "stat-info" }, /* @__PURE__ */ React.createElement("h3", null, articles.length), /* @__PURE__ */ React.createElement("p", null, "Articles publi\xE9s")))), /* @__PURE__ */ React.createElement("div", { className: "dashboard-overview-grid" }, /* @__PURE__ */ React.createElement("div", { className: "chart-card glass-panel", style: { display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0 } }, "Inscriptions cette semaine"), /* @__PURE__ */ React.createElement("span", { className: "announcement-badge badge-success" }, "+15% cette semaine")), /* @__PURE__ */ React.createElement("div", { className: "chart-container", style: { width: "100%", height: 280 } }, /* @__PURE__ */ React.createElement(import_recharts.ResponsiveContainer, null, /* @__PURE__ */ React.createElement(import_recharts.AreaChart, { data: chartData, margin: { top: 10, right: 10, left: -20, bottom: 0 } }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", { id: "colorInscriptions", x1: "0", y1: "0", x2: "0", y2: "1" }, /* @__PURE__ */ React.createElement("stop", { offset: "5%", stopColor: "var(--color-brand-pink)", stopOpacity: 0.3 }), /* @__PURE__ */ React.createElement("stop", { offset: "95%", stopColor: "var(--color-brand-pink)", stopOpacity: 0 }))), /* @__PURE__ */ React.createElement(import_recharts.CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "rgba(0,0,0,0.05)" }), /* @__PURE__ */ React.createElement(import_recharts.XAxis, { dataKey: "name", axisLine: false, tickLine: false, tick: { fill: "#6b7280", fontSize: 12 } }), /* @__PURE__ */ React.createElement(import_recharts.YAxis, { axisLine: false, tickLine: false, tick: { fill: "#6b7280", fontSize: 12 } }), /* @__PURE__ */ React.createElement(
      import_recharts.Tooltip,
      {
        contentStyle: { borderRadius: "10px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }
      }
    ), /* @__PURE__ */ React.createElement(import_recharts.Area, { type: "monotone", dataKey: "inscriptions", stroke: "var(--color-brand-pink)", strokeWidth: 3, fillOpacity: 1, fill: "url(#colorInscriptions)" }))))), /* @__PURE__ */ React.createElement("div", { className: "recent-activity glass-panel", style: { display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("h3", { className: "mb-4" }, "Activit\xE9 R\xE9cente"), /* @__PURE__ */ React.createElement("div", { className: "activity-list", style: { flex: 1, overflowY: "auto" } }, enrollments.slice(0, 3).map((e) => /* @__PURE__ */ React.createElement("div", { key: `e-${e.id}`, className: "activity-item", style: { borderBottom: "1px solid var(--color-gray-200)", padding: "0.85rem 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, "\u{1F393}"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--color-gray-900)" } }, e.nom), " a rejoint ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--color-brand-green)", fontWeight: 600 } }, e.programme), /* @__PURE__ */ React.createElement("span", { className: "text-small text-gray d-block", style: { fontSize: "0.75rem", marginTop: "2px" } }, new Date(e.date).toLocaleDateString()))))), contacts.slice(0, 3).map((c) => /* @__PURE__ */ React.createElement("div", { key: `c-${c.id}`, className: "activity-item", style: { borderBottom: "1px solid var(--color-gray-200)", padding: "0.85rem 0" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "0.75rem" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "rgba(244,114,182,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, "\u2709\uFE0F"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--color-gray-900)" } }, c.nom), " a envoy\xE9 un message", /* @__PURE__ */ React.createElement("span", { className: "text-small text-gray d-block", style: { fontSize: "0.75rem", marginTop: "2px" } }, new Date(c.date).toLocaleDateString()))))), enrollments.length === 0 && contacts.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-gray text-center", style: { marginTop: "2rem" } }, "Aucune activit\xE9 r\xE9cente.")))), /* @__PURE__ */ React.createElement("div", { className: "dashboard-banner glass-panel" }, /* @__PURE__ */ React.createElement("div", { className: "banner-content" }, /* @__PURE__ */ React.createElement("h3", null, "Pr\xEAte \xE0 partager votre expertise ?"), /* @__PURE__ */ React.createElement("p", null, "Vos abonn\xE9s attendent vos prochains conseils en trading et mindset."), /* @__PURE__ */ React.createElement("button", { onClick: () => setActiveTab("blog"), className: "btn btn-primary mt-3" }, "R\xE9diger un nouvel article")))), activeTab === "messages" && /* @__PURE__ */ React.createElement("div", { className: "admin-panel animate-fade-up" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gradient mb-4" }, "Messages de Contact"), /* @__PURE__ */ React.createElement("div", { className: "data-table-wrapper" }, /* @__PURE__ */ React.createElement("table", { className: "data-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Date"), /* @__PURE__ */ React.createElement("th", null, "Nom"), /* @__PURE__ */ React.createElement("th", null, "Email"), /* @__PURE__ */ React.createElement("th", null, "Sujet"), /* @__PURE__ */ React.createElement("th", null, "Message"), /* @__PURE__ */ React.createElement("th", null, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, contacts.map((c) => /* @__PURE__ */ React.createElement("tr", { key: c.id, style: { background: repliedContacts.includes(c.id) ? "rgba(46, 111, 64, 0.05)" : "transparent" } }, /* @__PURE__ */ React.createElement("td", null, new Date(c.date).toLocaleDateString()), /* @__PURE__ */ React.createElement("td", null, c.nom, repliedContacts.includes(c.id) && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "8px", fontSize: "0.7rem", background: "var(--color-brand-green)", color: "white", padding: "2px 6px", borderRadius: "12px" } }, "R\xE9pondu")), /* @__PURE__ */ React.createElement("td", null, c.email), /* @__PURE__ */ React.createElement("td", null, c.sujet), /* @__PURE__ */ React.createElement("td", null, c.message), /* @__PURE__ */ React.createElement("td", { style: { display: "flex", gap: "8px" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setReplyingToContact(c);
          setReplySubject(`R\xE9ponse \xE0 : ${c.sujet || "Votre message sur Rose Kakpo"}`);
          const notifId = `msg-${c.id}`;
          if (!readNotifications.includes(notifId)) {
            const newReads = [...readNotifications, notifId];
            setReadNotifications(newReads);
            localStorage.setItem("rose_read_notifs", JSON.stringify(newReads));
          }
        },
        className: "btn btn-primary small-btn-admin",
        style: { display: "flex", alignItems: "center", gap: "4px" }
      },
      /* @__PURE__ */ React.createElement(import_lucide_react.Mail, { size: 14 }),
      " R\xE9pondre"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => handleDeleteContact(c.id),
        className: "btn-icon text-pink",
        title: "Supprimer"
      },
      /* @__PURE__ */ React.createElement(import_lucide_react.Trash2, { size: 16 })
    )))), contacts.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "6", className: "text-center" }, "Aucun message pour le moment.")))))), activeTab === "inscriptions" && /* @__PURE__ */ React.createElement("div", { className: "admin-panel animate-fade-up" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gradient mb-4" }, "Inscriptions aux Formations"), /* @__PURE__ */ React.createElement("div", { className: "data-table-wrapper" }, /* @__PURE__ */ React.createElement("table", { className: "data-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Date"), /* @__PURE__ */ React.createElement("th", null, "Nom"), /* @__PURE__ */ React.createElement("th", null, "WhatsApp"), /* @__PURE__ */ React.createElement("th", null, "Niveau"), /* @__PURE__ */ React.createElement("th", null, "Programme"), /* @__PURE__ */ React.createElement("th", null, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, enrollments.map((e) => /* @__PURE__ */ React.createElement("tr", { key: e.id }, /* @__PURE__ */ React.createElement("td", null, new Date(e.date).toLocaleDateString()), /* @__PURE__ */ React.createElement("td", null, e.nom), /* @__PURE__ */ React.createElement("td", null, e.whatsapp), /* @__PURE__ */ React.createElement("td", null, e.niveau), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--color-brand-green)" } }, e.programme)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => handleDeleteEnrollment(e.id),
        className: "btn-icon text-pink",
        title: "Supprimer"
      },
      /* @__PURE__ */ React.createElement(import_lucide_react.Trash2, { size: 16 })
    )))), enrollments.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "6", className: "text-center" }, "Aucune inscription pour le moment.")))))), activeTab === "newsletter" && /* @__PURE__ */ React.createElement("div", { className: "admin-panel animate-fade-up" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gradient mb-4" }, "Abonn\xE9s Newsletter"), /* @__PURE__ */ React.createElement("div", { className: "data-table-wrapper" }, /* @__PURE__ */ React.createElement("table", { className: "data-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Date d'inscription"), /* @__PURE__ */ React.createElement("th", null, "Email"), /* @__PURE__ */ React.createElement("th", null, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, newsletters.map((n) => /* @__PURE__ */ React.createElement("tr", { key: n.id }, /* @__PURE__ */ React.createElement("td", null, new Date(n.date).toLocaleDateString()), /* @__PURE__ */ React.createElement("td", null, n.email), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => handleDeleteNewsletter(n.id),
        className: "btn-icon text-pink",
        title: "D\xE9sinscrire"
      },
      /* @__PURE__ */ React.createElement(import_lucide_react.Trash2, { size: 16 })
    )))), newsletters.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "3", className: "text-center" }, "Aucun abonn\xE9 pour le moment.")))))), activeTab === "formations" && /* @__PURE__ */ React.createElement("div", { className: "admin-panel animate-fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "admin-section-header" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gradient m-0" }, "Formations & Landing Pages"), !showFormationForm && /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setShowFormationForm(true);
      setEditingFormationId(null);
    }, className: "btn btn-primary", style: { display: "flex", alignItems: "center", gap: "0.5rem" } }, /* @__PURE__ */ React.createElement(import_lucide_react.Plus, { size: 18 }), " Nouvelle Formation")), showFormationForm ? /* @__PURE__ */ React.createElement("div", { className: "glass-panel admin-form-container" }, /* @__PURE__ */ React.createElement("h3", { className: "mb-4" }, editingFormationId ? "Modifier la formation" : "Cr\xE9er une nouvelle page de formation"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleCreateFormation }, /* @__PURE__ */ React.createElement("div", { className: "admin-form-section" }, /* @__PURE__ */ React.createElement("h4", { style: { marginBottom: "1rem", color: "var(--color-brand-green)" } }, "1. Informations de base"), /* @__PURE__ */ React.createElement("div", { className: "admin-form-grid-2" }, /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Titre de la formation"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "cms-input", placeholder: "Ex: Woman King Trade", value: newFormation.title, onChange: (e) => {
      const title = e.target.value;
      const slug = title.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      setNewFormation({ ...newFormation, title, slug });
    } })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Lien unique g\xE9n\xE9r\xE9"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "cms-input", readOnly: true, value: newFormation.slug, placeholder: "G\xE9n\xE9r\xE9 automatiquement", style: { backgroundColor: "var(--color-gray-100)", cursor: "not-allowed", color: "var(--color-gray-500)" } })))), /* @__PURE__ */ React.createElement("div", { className: "admin-form-section" }, /* @__PURE__ */ React.createElement("h4", { style: { marginBottom: "1rem", color: "var(--color-brand-green)" } }, "2. Tarification & Inscriptions"), /* @__PURE__ */ React.createElement("div", { className: "admin-form-grid-2" }, /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Prix (en FCFA)"), /* @__PURE__ */ React.createElement("input", { type: "number", className: "cms-input", placeholder: "Ex: 35000", value: newFormation.price, onChange: (e) => setNewFormation({ ...newFormation, price: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Nombre de places disponibles"), /* @__PURE__ */ React.createElement("input", { type: "number", className: "cms-input", placeholder: "Ex: 20", value: newFormation.capacity, onChange: (e) => setNewFormation({ ...newFormation, capacity: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("label", null, "Date limite d'inscription (Optionnel)"), /* @__PURE__ */ React.createElement("p", { className: "text-small text-gray", style: { marginBottom: "0.5rem" } }, "Laissez vide pour un minuteur journalier (qui s'arr\xEAte \xE0 minuit tous les soirs)."), /* @__PURE__ */ React.createElement("input", { type: "datetime-local", className: "cms-input", value: newFormation.expirationDate || "", onChange: (e) => setNewFormation({ ...newFormation, expirationDate: e.target.value }) })))), /* @__PURE__ */ React.createElement("div", { className: "admin-form-section" }, /* @__PURE__ */ React.createElement("h4", { style: { marginBottom: "1rem", color: "var(--color-brand-green)" } }, "3. Visuels & Contenu de la page"), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-4" }, /* @__PURE__ */ React.createElement("label", null, "Affiche / Flyer de la formation"), /* @__PURE__ */ React.createElement("div", { style: { padding: "1rem", border: "2px dashed var(--color-gray-300)", borderRadius: "8px", background: "#fff", textAlign: "center" } }, /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", onChange: handleFormationImageUpload, style: { display: "block", margin: "0 auto 0.5rem auto" } }), /* @__PURE__ */ React.createElement("small", { className: "text-gray" }, "Taille recommand\xE9e : 1080x1350px (Format Portrait)"), newFormation.image && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "1rem" } }, /* @__PURE__ */ React.createElement("img", { src: newFormation.image, alt: "Aper\xE7u", style: { height: "150px", borderRadius: "8px", objectFit: "cover", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" } })))), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Sous-titre (Phrase d'accroche)"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "cms-input", placeholder: "Ex: Devenez experte en 14 jours", value: newFormation.subtitle, onChange: (e) => setNewFormation({ ...newFormation, subtitle: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "form-group", style: { marginTop: "1rem" } }, /* @__PURE__ */ React.createElement("label", null, "Programme d\xE9taill\xE9 (Ce que vous allez apprendre)"), /* @__PURE__ */ React.createElement("p", { className: "text-small text-gray", style: { marginBottom: "0.5rem" } }, "Mettez un tiret ou un point pour chaque ligne. Cela cr\xE9era une belle liste sur la page publique."), /* @__PURE__ */ React.createElement("textarea", { className: "cms-textarea", rows: "5", value: newFormation.program, onChange: (e) => setNewFormation({ ...newFormation, program: e.target.value }), placeholder: "\u2022 Initiation au trading\n\u2022 Comprendre le fonctionnement du march\xE9\n\u2022 Strat\xE9gies de trading..." }))), /* @__PURE__ */ React.createElement("div", { className: "admin-form-section" }, /* @__PURE__ */ React.createElement("h4", { style: { marginBottom: "1rem", color: "var(--color-brand-green)" } }, "4. Sections Landing Page Pro"), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-4" }, /* @__PURE__ */ React.createElement("label", null, "Objectifs de la Masterclass / Formation"), /* @__PURE__ */ React.createElement("p", { className: "text-small text-gray", style: { marginBottom: "0.5rem" } }, "Une ligne = un objectif. (Entr\xE9e pour passer \xE0 la ligne)"), /* @__PURE__ */ React.createElement("textarea", { className: "cms-textarea", rows: "4", value: newFormation.objectives, onChange: (e) => setNewFormation({ ...newFormation, objectives: e.target.value }), placeholder: "Atteindre la rentabilit\xE9\nG\xE9rer ses \xE9motions\nComprendre l'analyse technique" })), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-4" }, /* @__PURE__ */ React.createElement("label", null, "Pour qui est cette formation ? (Audience)"), /* @__PURE__ */ React.createElement("p", { className: "text-small text-gray", style: { marginBottom: "0.5rem" } }, "Une ligne = une cat\xE9gorie de personnes. (Entr\xE9e pour passer \xE0 la ligne)"), /* @__PURE__ */ React.createElement("textarea", { className: "cms-textarea", rows: "4", value: newFormation.targetAudience, onChange: (e) => setNewFormation({ ...newFormation, targetAudience: e.target.value }), placeholder: "Les femmes ambitieuses\nLes d\xE9butants en trading\nCelles qui veulent une nouvelle source de revenus" })), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-4" }, /* @__PURE__ */ React.createElement("label", null, "Ce qui est inclus (Bonus & Mat\xE9riel)"), /* @__PURE__ */ React.createElement("p", { className: "text-small text-gray", style: { marginBottom: "0.5rem" } }, "Une ligne = un bonus. (Entr\xE9e pour passer \xE0 la ligne)"), /* @__PURE__ */ React.createElement("textarea", { className: "cms-textarea", rows: "4", value: newFormation.included, onChange: (e) => setNewFormation({ ...newFormation, included: e.target.value }), placeholder: "Acc\xE8s au groupe priv\xE9 Telegram\nSupport 24/7\nCertificat de fin de formation" })), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-4" }, /* @__PURE__ */ React.createElement("label", null, "Lien d'acc\xE8s (WhatsApp, Telegram, Drive...)"), /* @__PURE__ */ React.createElement("p", { className: "text-small text-gray", style: { marginBottom: "0.5rem" } }, "Ce lien sera fourni automatiquement au client apr\xE8s paiement valid\xE9."), /* @__PURE__ */ React.createElement("input", { type: "url", className: "cms-input", value: newFormation.accessLink || "", onChange: (e) => setNewFormation({ ...newFormation, accessLink: e.target.value }), placeholder: "Ex: https://chat.whatsapp.com/votre_lien" })), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-4" }, /* @__PURE__ */ React.createElement("label", null, "Qui suis-je ? (Bio auteur)"), /* @__PURE__ */ React.createElement("textarea", { className: "cms-textarea", rows: "4", value: newFormation.authorBio, onChange: (e) => setNewFormation({ ...newFormation, authorBio: e.target.value }), placeholder: "Je suis Rose Kakpo, Trader ind\xE9pendante et fondatrice de Woman King Trade. Ma mission est de..." })), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-4" }, /* @__PURE__ */ React.createElement("label", null, "Captures de t\xE9moignages (Optionnel)"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", multiple: true, onChange: (e) => {
      const files = Array.from(e.target.files);
      const promises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(promises).then((base64Images) => {
        setNewFormation((prev) => ({ ...prev, testimonials: [...prev.testimonials || [], ...base64Images] }));
      });
    }, className: "glass-input" }), newFormation.testimonials && newFormation.testimonials.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" } }, newFormation.testimonials.map((img, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: img, alt: "T\xE9moignage", style: { height: "80px", borderRadius: "4px", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setNewFormation((prev) => ({ ...prev, testimonials: prev.testimonials.filter((_, idx) => idx !== i) })), style: { position: "absolute", top: "-5px", right: "-5px", background: "red", color: "white", border: "none", borderRadius: "50%", cursor: "pointer", width: "20px", height: "20px", fontSize: "12px" } }, "X")))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "2rem" } }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => {
      setShowFormationForm(false);
      setEditingFormationId(null);
      setNewFormation({ slug: "", title: "", price: "", capacity: "", program: "", image: "", subtitle: "", objectives: "", targetAudience: "", included: "", authorBio: "", expirationDate: "", accessLink: "", testimonials: [] });
    }, className: "btn btn-secondary" }, "Annuler"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary", style: { padding: "0.8rem 2rem" } }, editingFormationId ? "Mettre \xE0 jour la page" : "Enregistrer et Publier la page")))) : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" } }, formations.map((f) => /* @__PURE__ */ React.createElement("div", { key: f.id, className: "glass-panel", style: { padding: "1.5rem", display: "flex", flexDirection: "column" } }, f.image && /* @__PURE__ */ React.createElement("img", { src: f.image, alt: f.title, style: { width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px", marginBottom: "1rem" } }), /* @__PURE__ */ React.createElement("h3", { style: { fontSize: "1.2rem", marginBottom: "0.5rem" } }, f.title), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--color-gray-600)", fontSize: "0.9rem", marginBottom: "1rem", flex: 1 } }, /* @__PURE__ */ React.createElement("div", null, "\u{1F4B0} Prix : ", f.price, " FCFA"), /* @__PURE__ */ React.createElement("div", null, "\u{1F465} Places : ", f.capacity), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--color-brand-green)" } }, "Lien : /formation/", f.slug)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "0.5rem" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          const fullUrl = `${window.location.origin}/formation/${f.slug}`;
          copyToClipboard(fullUrl);
        },
        className: "btn btn-primary",
        style: { flex: 1, padding: "0.5rem", fontSize: "0.9rem" }
      },
      "Copier le lien"
    ), /* @__PURE__ */ React.createElement("button", { onClick: () => handleEditFormation(f), className: "btn btn-secondary", style: { padding: "0.5rem", color: "var(--color-brand-gold)" } }, /* @__PURE__ */ React.createElement(import_lucide_react.Edit3, { size: 18 })), /* @__PURE__ */ React.createElement("button", { onClick: () => handleDeleteFormation(f.id), className: "btn btn-secondary text-pink", style: { padding: "0.5rem" } }, /* @__PURE__ */ React.createElement(import_lucide_react.Trash2, { size: 18 }))))), formations.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center text-gray", style: { gridColumn: "1 / -1", padding: "3rem" } }, 'Aucune formation cr\xE9\xE9e. Cliquez sur "Nouvelle Formation" pour commencer.'))), activeTab === "manual-payments" && /* @__PURE__ */ React.createElement("div", { className: "admin-section animate-fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "admin-header-flex" }, /* @__PURE__ */ React.createElement("h2", null, /* @__PURE__ */ React.createElement(import_lucide_react.CreditCard, { size: 24, className: "text-pink" }), " Preuves de Paiement (Mobile Money)")), /* @__PURE__ */ React.createElement("div", { className: "admin-card glass-panel", style: { overflowX: "auto", padding: "0" } }, /* @__PURE__ */ React.createElement("table", { className: "admin-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { style: { padding: "1rem", whiteSpace: "nowrap" } }, "Date"), /* @__PURE__ */ React.createElement("th", { style: { padding: "1rem", minWidth: "200px" } }, "Client"), /* @__PURE__ */ React.createElement("th", { style: { padding: "1rem", whiteSpace: "nowrap" } }, "WhatsApp"), /* @__PURE__ */ React.createElement("th", { style: { padding: "1rem", minWidth: "150px" } }, "Programme"), /* @__PURE__ */ React.createElement("th", { style: { padding: "1rem", whiteSpace: "nowrap" } }, "R\xE9seau"), /* @__PURE__ */ React.createElement("th", { style: { padding: "1rem", whiteSpace: "nowrap" } }, "Statut"), /* @__PURE__ */ React.createElement("th", { style: { padding: "1rem" } }, "Preuve"), /* @__PURE__ */ React.createElement("th", { style: { padding: "1rem", whiteSpace: "nowrap" } }, "Actions"))), /* @__PURE__ */ React.createElement("tbody", null, manualPayments && manualPayments.length > 0 ? manualPayments.map((payment) => /* @__PURE__ */ React.createElement("tr", { key: payment.id, style: { borderBottom: "1px solid rgba(0,0,0,0.05)" } }, /* @__PURE__ */ React.createElement("td", { style: { padding: "1rem", whiteSpace: "nowrap" } }, new Date(payment.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })), /* @__PURE__ */ React.createElement("td", { style: { padding: "1rem" } }, payment.customer_info?.firstname, " ", payment.customer_info?.lastname, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("small", { className: "text-muted" }, payment.customer_info?.email)), /* @__PURE__ */ React.createElement("td", { style: { padding: "1rem", whiteSpace: "nowrap" } }, payment.customer_info?.whatsapp && /* @__PURE__ */ React.createElement(
      "a",
      {
        href: getWhatsAppLink(payment),
        target: "_blank",
        rel: "noreferrer",
        style: { display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "#25D366", textDecoration: "none", fontWeight: "bold" },
        title: "Envoyer le lien par WhatsApp"
      },
      /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" })),
      payment.customer_info?.whatsapp
    )), /* @__PURE__ */ React.createElement("td", { style: { padding: "1rem" } }, payment.program_id), /* @__PURE__ */ React.createElement("td", { style: { padding: "1rem" } }, /* @__PURE__ */ React.createElement("strong", null, payment.network)), /* @__PURE__ */ React.createElement("td", { style: { padding: "1rem" } }, payment.status === "pending" ? /* @__PURE__ */ React.createElement("span", { style: { color: "#ffcc00", fontWeight: "bold", whiteSpace: "nowrap" } }, "En attente") : /* @__PURE__ */ React.createElement("span", { style: { color: "#4caf50", fontWeight: "bold", whiteSpace: "nowrap" } }, "Valid\xE9")), /* @__PURE__ */ React.createElement("td", { style: { padding: "1rem" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleViewImage(payment.proof_image), style: { background: "none", border: "none", color: "#007bff", textDecoration: "underline", cursor: "pointer", padding: 0, fontSize: "0.9rem", whiteSpace: "nowrap" } }, "Voir l'image")), /* @__PURE__ */ React.createElement("td", { style: { padding: "1rem", whiteSpace: "nowrap" } }, payment.status === "pending" && /* @__PURE__ */ React.createElement("button", { onClick: () => handleApproveManualPayment(payment), style: { backgroundColor: "#4caf50", color: "#fff", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", marginRight: "0.5rem", cursor: "pointer", fontSize: "0.8rem", fontWeight: "500" }, title: "Valider et ouvrir WhatsApp" }, "Approuver"), /* @__PURE__ */ React.createElement("button", { onClick: () => handleRejectManualPayment(payment.id), style: { backgroundColor: "#f44336", color: "#fff", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "500" }, title: "Supprimer" }, "Supprimer")))) : /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "8", className: "text-center text-muted" }, "Aucun paiement manuel enregistr\xE9.")))))), activeTab === "ebooks" && /* @__PURE__ */ React.createElement("div", { className: "admin-card" }, /* @__PURE__ */ React.createElement("div", { className: "flex-between mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "mb-0" }, "Mes Ebooks (", ebooks.length, ")"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: () => {
      setNewEbook({ slug: "", title: "", price: "", description: "", image: "", testimonials: [] });
      setEditingEbookId(null);
      setShowEbookForm(!showEbookForm);
    } }, showEbookForm ? "Annuler" : "+ Ajouter un Ebook")), showEbookForm && /* @__PURE__ */ React.createElement("div", { className: "mb-5", style: { background: "var(--color-gray-100)", padding: "2rem", borderRadius: "12px" } }, /* @__PURE__ */ React.createElement("h3", { className: "mb-4" }, editingEbookId ? "Modifier l'ebook" : "Ajouter un ebook"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleCreateEbook }, /* @__PURE__ */ React.createElement("div", { className: "admin-grid mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Titre de l'ebook"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "cms-input", value: newEbook.title, onChange: (e) => setNewEbook({ ...newEbook, title: e.target.value }), placeholder: "Ex: De la vision \xE0 la ma\xEEtrise" })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Lien (slug) unique"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "cms-input", value: newEbook.slug, onChange: (e) => setNewEbook({ ...newEbook, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }), placeholder: "Ex: vision-maitrise" })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Prix (USD)"), /* @__PURE__ */ React.createElement("input", { type: "number", step: "0.01", className: "cms-input", value: newEbook.price, onChange: (e) => setNewEbook({ ...newEbook, price: e.target.value }), placeholder: "Ex: 15.00" })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Image de couverture (Optionnel)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "1rem" } }, /* @__PURE__ */ React.createElement("label", { className: "btn btn-outline", style: { display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", justifyContent: "center", cursor: "pointer", margin: 0 } }, /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", onChange: handleEbookImageUpload, style: { display: "none" } }), /* @__PURE__ */ React.createElement(import_lucide_react.Upload, { size: 18 }), " T\xE9l\xE9charger une image"), newEbook.image && /* @__PURE__ */ React.createElement("div", { style: { marginTop: "1rem" } }, /* @__PURE__ */ React.createElement("img", { src: newEbook.image, alt: "Aper\xE7u", style: { height: "150px", borderRadius: "8px", objectFit: "cover", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" } }))))), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-4" }, /* @__PURE__ */ React.createElement("label", null, "Description courte"), /* @__PURE__ */ React.createElement("textarea", { className: "cms-textarea", rows: "3", value: newEbook.description, onChange: (e) => setNewEbook({ ...newEbook, description: e.target.value }), placeholder: "Courte description du contenu du livre..." })), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-4" }, /* @__PURE__ */ React.createElement("label", null, "Captures de t\xE9moignages (Optionnel)"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", multiple: true, onChange: (e) => {
      const files = Array.from(e.target.files);
      const promises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(promises).then((base64Images) => {
        setNewEbook((prev) => ({ ...prev, testimonials: [...prev.testimonials || [], ...base64Images] }));
      });
    }, className: "glass-input" }), newEbook.testimonials && newEbook.testimonials.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" } }, newEbook.testimonials.map((img, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: img, alt: "T\xE9moignage", style: { height: "80px", borderRadius: "4px", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setNewEbook((prev) => ({ ...prev, testimonials: prev.testimonials.filter((_, idx) => idx !== i) })), style: { position: "absolute", top: "-5px", right: "-5px", background: "red", color: "white", border: "none", borderRadius: "50%", cursor: "pointer", width: "20px", height: "20px", fontSize: "12px" } }, "X"))))), /* @__PURE__ */ React.createElement("div", { className: "flex-end", style: { gap: "1rem" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-outline", onClick: () => setShowEbookForm(false) }, "Annuler"), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary" }, editingEbookId ? "Enregistrer les modifications" : "Cr\xE9er l'ebook")))), /* @__PURE__ */ React.createElement("div", { className: "table-responsive" }, /* @__PURE__ */ React.createElement("table", { className: "admin-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Image"), /* @__PURE__ */ React.createElement("th", null, "Titre"), /* @__PURE__ */ React.createElement("th", null, "Lien (slug)"), /* @__PURE__ */ React.createElement("th", null, "Prix"), /* @__PURE__ */ React.createElement("th", null, "Description"), /* @__PURE__ */ React.createElement("th", null, "Actions"))), /* @__PURE__ */ React.createElement("tbody", null, ebooks.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "6", className: "text-center" }, "Aucun ebook trouv\xE9.")) : ebooks.map((eb) => /* @__PURE__ */ React.createElement("tr", { key: eb.id }, /* @__PURE__ */ React.createElement("td", null, eb.image ? /* @__PURE__ */ React.createElement("img", { src: eb.image, alt: "Couverture", style: { width: "40px", height: "40px", borderRadius: "4px", objectFit: "cover" } }) : "-"), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("strong", null, eb.title)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("code", null, eb.slug)), /* @__PURE__ */ React.createElement("td", null, "$", eb.price), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, eb.description)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "0.5rem" } }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-outline", style: { padding: "0.25rem 0.5rem" }, onClick: () => handleEditEbook(eb) }, "Modifier"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-outline", style: { padding: "0.25rem 0.5rem", color: "var(--color-brand-pink)", borderColor: "var(--color-brand-pink)" }, onClick: () => handleDeleteEbook(eb.id) }, "Supprimer"))))))))), activeTab === "blog" && /* @__PURE__ */ React.createElement("div", { className: "admin-panel animate-fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "blog-admin-header" }, /* @__PURE__ */ React.createElement("h2", null, "Gestion du Blog")), /* @__PURE__ */ React.createElement("div", { className: "blog-admin-grid" }, /* @__PURE__ */ React.createElement("div", { className: "blog-list glass-panel" }, /* @__PURE__ */ React.createElement("h3", null, "Articles publi\xE9s"), articles.map((a) => /* @__PURE__ */ React.createElement("div", { key: a.id, className: "admin-article-card" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", null, a.title), /* @__PURE__ */ React.createElement("span", { className: "text-small text-gray d-block" }, a.category, " - ", a.date)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setEditingArticleId(a.id);
      setNewArticle({
        title: a.title,
        category: a.category,
        excerpt: a.excerpt,
        content: a.content,
        author: a.author || "Rose Kakpo",
        authorRole: a.authorRole || "Experte en Trading",
        image: a.image || ""
      });
    }, className: "btn-icon text-blue", style: { marginRight: "10px" }, title: "Modifier" }, /* @__PURE__ */ React.createElement(import_lucide_react.Edit3, { size: 18 })), /* @__PURE__ */ React.createElement("button", { onClick: () => handleDeleteArticle(a.id), className: "btn-icon text-pink", title: "Supprimer" }, /* @__PURE__ */ React.createElement(import_lucide_react.Trash2, { size: 18 })))))), /* @__PURE__ */ React.createElement("div", { className: "blog-create glass-panel" }, /* @__PURE__ */ React.createElement("h3", null, /* @__PURE__ */ React.createElement(import_lucide_react.Plus, { size: 18 }), " ", editingArticleId ? "Modifier l'Article" : "Nouvel Article"), /* @__PURE__ */ React.createElement("form", { onSubmit: handleCreateArticle }, /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Titre de l'article"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "glass-input", value: newArticle.title, onChange: (e) => setNewArticle({ ...newArticle, title: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Cat\xE9gorie"), /* @__PURE__ */ React.createElement(
      "select",
      {
        required: true,
        className: "glass-input",
        value: newArticle.category,
        onChange: (e) => setNewArticle({ ...newArticle, category: e.target.value })
      },
      /* @__PURE__ */ React.createElement("option", { value: "", disabled: true }, "S\xE9lectionner une cat\xE9gorie"),
      /* @__PURE__ */ React.createElement("option", { value: "Trading" }, "Trading"),
      /* @__PURE__ */ React.createElement("option", { value: "Psychologie" }, "Psychologie"),
      /* @__PURE__ */ React.createElement("option", { value: "\xC9ducation Financi\xE8re" }, "\xC9ducation Financi\xE8re"),
      /* @__PURE__ */ React.createElement("option", { value: "Erreurs de D\xE9butants" }, "Erreurs de D\xE9butants"),
      /* @__PURE__ */ React.createElement("option", { value: "Motivation & Productivit\xE9" }, "Motivation & Productivit\xE9")
    )), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Court r\xE9sum\xE9 (Excerpt)"), /* @__PURE__ */ React.createElement("textarea", { className: "glass-input", rows: "2", value: newArticle.excerpt, onChange: (e) => setNewArticle({ ...newArticle, excerpt: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Contenu Complet (Supporte l'HTML ex: <h2>, <p>)"), /* @__PURE__ */ React.createElement("textarea", { className: "glass-input", rows: "10", value: newArticle.content, onChange: (e) => setNewArticle({ ...newArticle, content: e.target.value }) })), /* @__PURE__ */ React.createElement("div", { className: "form-group" }, /* @__PURE__ */ React.createElement("label", null, "Image de couverture (Optionnel)"), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", className: "glass-input", onChange: (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setNewArticle({ ...newArticle, image: reader.result });
        reader.readAsDataURL(file);
      }
    } }), newArticle.image && /* @__PURE__ */ React.createElement("img", { src: newArticle.image, alt: "Preview", style: { height: "80px", marginTop: "10px", borderRadius: "8px", objectFit: "cover" } })), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary full-width" }, editingArticleId ? "Mettre \xE0 jour l'article" : "Publier l'article"), editingArticleId && /* @__PURE__ */ React.createElement("button", { type: "button", className: "btn btn-outline full-width", style: { marginTop: "10px" }, onClick: () => {
      setEditingArticleId(null);
      setNewArticle({ title: "", category: "Tous", excerpt: "", content: "", author: "Rose Kakpo", authorRole: "Experte en Trading", image: "" });
    } }, "Annuler la modification"))))), activeTab === "tarifs" && /* @__PURE__ */ React.createElement("div", { className: "admin-panel animate-fade-up" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gradient mb-4" }, "Gestion des Tarifs"), /* @__PURE__ */ React.createElement("p", { className: "text-gray mb-4" }, "Modifiez les tarifs des formations et ebooks en FCFA. La conversion en USD s'effectue automatiquement sur le site."), /* @__PURE__ */ React.createElement("div", { className: "prices-admin-container glass-panel" }, /* @__PURE__ */ React.createElement("div", { className: "prices-grid-admin" }, prices.map((p) => /* @__PURE__ */ React.createElement("div", { key: p.id, className: "price-item-row" }, /* @__PURE__ */ React.createElement("div", { className: "price-item-info" }, /* @__PURE__ */ React.createElement("strong", null, p.name), /* @__PURE__ */ React.createElement("span", { className: "text-small text-gray d-block" }, "ID: ", p.id)), /* @__PURE__ */ React.createElement("div", { className: "price-item-actions" }, /* @__PURE__ */ React.createElement("div", { className: "price-input-wrapper" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        className: "glass-input price-input",
        value: editingPrices[p.id] !== void 0 ? editingPrices[p.id] : p.price,
        onChange: (e) => setEditingPrices({
          ...editingPrices,
          [p.id]: e.target.value
        })
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "currency-suffix" }, "FCFA")), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => handleUpdatePrice(p.id),
        className: "btn btn-primary small-btn-admin"
      },
      "Enregistrer"
    ))))))), activeTab === "contenu" && /* @__PURE__ */ React.createElement("div", { className: "admin-panel animate-fade-up" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gradient mb-2" }, "Contenu du Site"), /* @__PURE__ */ React.createElement("p", { className: "text-gray mb-4" }, "Modifiez ici tous les textes affich\xE9s sur le site public. Les changements sont instantan\xE9s."), /* @__PURE__ */ React.createElement("div", { className: "cms-intro-banner" }, /* @__PURE__ */ React.createElement(import_lucide_react.Info, { size: 20, style: { color: "var(--color-brand-pink)", flexShrink: 0, marginTop: "2px" } }), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Comment \xE7a marche ?"), " \xC9ditez le texte dans le champ souhait\xE9, puis cliquez sur ", /* @__PURE__ */ React.createElement("strong", null, "Sauvegarder"), ". Le site public se met \xE0 jour automatiquement, sans aucune connaissance technique.")), /* @__PURE__ */ React.createElement("div", { className: "cms-sections-grid" }, cmsSections.map((section) => /* @__PURE__ */ React.createElement("div", { key: section.id, className: "cms-section-block" }, /* @__PURE__ */ React.createElement("div", { className: "cms-section-header", onClick: () => toggleSection(section.id) }, /* @__PURE__ */ React.createElement("h3", null, section.label), /* @__PURE__ */ React.createElement(import_lucide_react.ChevronDown, { size: 20, className: `cms-chevron ${openSections[section.id] ? "open" : ""}` })), openSections[section.id] && /* @__PURE__ */ React.createElement("div", { className: "cms-section-body" }, section.keys.map((key) => renderCmsField(key))))))), activeTab === "securite" && /* @__PURE__ */ React.createElement("div", { className: "admin-panel animate-fade-up" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gradient mb-4" }, "S\xE9curit\xE9 & Collaborateurs"), /* @__PURE__ */ React.createElement("div", { className: "security-grid" }, /* @__PURE__ */ React.createElement("div", { className: "security-card glass-panel" }, /* @__PURE__ */ React.createElement("h3", null, /* @__PURE__ */ React.createElement(import_lucide_react.Key, { size: 18, className: "text-pink d-inline-block mr-2" }), " Changer de mot de passe"), /* @__PURE__ */ React.createElement("p", { className: "text-gray mb-4" }, "Mettez \xE0 jour le mot de passe de votre compte administrateur ou collaborateur."), /* @__PURE__ */ React.createElement("form", { onSubmit: handleChangePassword, className: "security-form" }, /* @__PURE__ */ React.createElement("div", { className: "form-group mb-3" }, /* @__PURE__ */ React.createElement("label", { className: "mb-1 d-block text-small font-bold text-gray-700" }, "Mot de passe actuel"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        required: true,
        placeholder: "Mot de passe actuel",
        className: "glass-input",
        value: securityForm.currentPassword,
        onChange: (e) => setSecurityForm({
          ...securityForm,
          currentPassword: e.target.value
        })
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-3" }, /* @__PURE__ */ React.createElement("label", { className: "mb-1 d-block text-small font-bold text-gray-700" }, "Nouveau mot de passe"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        required: true,
        placeholder: "Nouveau mot de passe",
        className: "glass-input",
        value: securityForm.newPassword,
        onChange: (e) => setSecurityForm({
          ...securityForm,
          newPassword: e.target.value
        })
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-4" }, /* @__PURE__ */ React.createElement("label", { className: "mb-1 d-block text-small font-bold text-gray-700" }, "Confirmer le nouveau mot de passe"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        required: true,
        placeholder: "Confirmer le nouveau mot de passe",
        className: "glass-input",
        value: securityForm.confirmPassword,
        onChange: (e) => setSecurityForm({
          ...securityForm,
          confirmPassword: e.target.value
        })
      }
    )), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary full-width" }, "Modifier le mot de passe"))), currentUser && currentUser.role === "admin" ? /* @__PURE__ */ React.createElement("div", { className: "security-card glass-panel" }, /* @__PURE__ */ React.createElement("h3", null, /* @__PURE__ */ React.createElement(import_lucide_react.Users, { size: 18, className: "text-green d-inline-block mr-2" }), " Ajouter un Collaborateur"), /* @__PURE__ */ React.createElement("p", { className: "text-gray mb-4" }, "Cr\xE9ez des acc\xE8s pour vos collaborateurs. Ils pourront se connecter au dashboard."), /* @__PURE__ */ React.createElement("form", { onSubmit: handleCreateCollaborator, className: "security-form mb-5" }, /* @__PURE__ */ React.createElement("div", { className: "form-group mb-3" }, /* @__PURE__ */ React.createElement("label", { className: "mb-1 d-block text-small font-bold text-gray-700" }, "Identifiant (Username)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        required: true,
        placeholder: "Ex: assistant",
        className: "glass-input",
        value: newCollab.username,
        onChange: (e) => setNewCollab({
          ...newCollab,
          username: e.target.value
        })
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-3" }, /* @__PURE__ */ React.createElement("label", { className: "mb-1 d-block text-small font-bold text-gray-700" }, "Mot de passe"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "password",
        required: true,
        placeholder: "Mot de passe du collaborateur",
        className: "glass-input",
        value: newCollab.password,
        onChange: (e) => setNewCollab({
          ...newCollab,
          password: e.target.value
        })
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-4" }, /* @__PURE__ */ React.createElement("label", { className: "mb-1 d-block text-small font-bold text-gray-700" }, "R\xF4le"), /* @__PURE__ */ React.createElement(
      "select",
      {
        className: "glass-input",
        value: newCollab.role,
        onChange: (e) => setNewCollab({
          ...newCollab,
          role: e.target.value
        })
      },
      /* @__PURE__ */ React.createElement("option", { value: "collaborateur" }, "Collaborateur (Acc\xE8s restreint)"),
      /* @__PURE__ */ React.createElement("option", { value: "admin" }, "Administrateur (Contr\xF4le total)")
    )), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn-primary full-width" }, "Ajouter le collaborateur")), /* @__PURE__ */ React.createElement("h3", { className: "mb-3 border-t pt-4" }, "Collaborateurs existants (", collaborators.length, ")"), /* @__PURE__ */ React.createElement("div", { className: "collaborator-list" }, collaborators.map((collab) => /* @__PURE__ */ React.createElement("div", { key: collab.id, className: "collaborator-row" }, /* @__PURE__ */ React.createElement("div", { className: "collab-info" }, /* @__PURE__ */ React.createElement("div", { className: "collab-header-info" }, /* @__PURE__ */ React.createElement("strong", { className: "text-gray-900" }, collab.username), /* @__PURE__ */ React.createElement("span", { className: `badge-role ${collab.role === "admin" ? "role-admin" : "role-collaborator"}` }, collab.role)), /* @__PURE__ */ React.createElement("span", { className: "text-small text-gray d-block" }, "Cr\xE9\xE9 le : ", new Date(collab.date).toLocaleDateString("fr-FR"))), collab.username !== "rose" && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => handleDeleteCollaborator(collab.id),
        className: "btn-icon text-pink",
        title: "Supprimer ce collaborateur"
      },
      /* @__PURE__ */ React.createElement(import_lucide_react.Trash2, { size: 16 })
    ))), collaborators.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-gray text-center mt-3" }, "Aucun collaborateur."))) : /* @__PURE__ */ React.createElement("div", { className: "security-card glass-panel disabled-panel" }, /* @__PURE__ */ React.createElement("h3", null, /* @__PURE__ */ React.createElement(import_lucide_react.Users, { size: 18, className: "text-gray d-inline-block mr-2" }), " Gestion des Collaborateurs"), /* @__PURE__ */ React.createElement("p", { className: "text-gray" }, "Seul l'administrateur principal (Rose) peut g\xE9rer les acc\xE8s des collaborateurs.")))), activeTab === "ceo" && /* @__PURE__ */ React.createElement("div", { className: "admin-panel animate-fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "admin-header-welcome mb-5" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gradient" }, "Param\xE8tres CEO"), /* @__PURE__ */ React.createElement("p", { className: "text-gray" }, "G\xE9rez ici le r\xE9f\xE9rencement de votre plateforme et les param\xE8tres d'envoi d'e-mails professionnels.")), /* @__PURE__ */ React.createElement("div", { className: "cms-sections-grid" }, ceoSections.map((section) => /* @__PURE__ */ React.createElement("div", { key: section.id, className: "cms-section-block" }, /* @__PURE__ */ React.createElement("div", { className: "cms-section-header", onClick: () => toggleSection(section.id) }, /* @__PURE__ */ React.createElement("h3", null, section.label), /* @__PURE__ */ React.createElement(import_lucide_react.ChevronDown, { size: 20, className: `cms-chevron ${openSections[section.id] ? "open" : ""}` })), openSections[section.id] && /* @__PURE__ */ React.createElement("div", { className: "cms-section-body" }, section.keys.map((key) => renderCmsField(key))))))), activeTab === "testimonials" && /* @__PURE__ */ React.createElement("div", { className: "admin-panel animate-fade-up" }, /* @__PURE__ */ React.createElement("div", { className: "admin-section-header" }, /* @__PURE__ */ React.createElement("h2", { className: "text-gradient" }, "T\xE9moignages"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: () => {
      setEditingTestimonialId(null);
      setNewTestimonial({ nom: "", message: "", rating: 5, images: [] });
      setShowTestimonialForm(!showTestimonialForm);
    } }, showTestimonialForm ? "Annuler" : "+ Ajouter un t\xE9moignage")), showTestimonialForm && /* @__PURE__ */ React.createElement("div", { className: "glass-panel p-6 mb-8 form-anim" }, /* @__PURE__ */ React.createElement("h3", { className: "mb-4" }, editingTestimonialId ? "Modifier le t\xE9moignage" : "Ajouter un t\xE9moignage"), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-3" }, /* @__PURE__ */ React.createElement("label", null, "Nom du client"), /* @__PURE__ */ React.createElement("input", { type: "text", className: "glass-input", value: newTestimonial.nom, onChange: (e) => setNewTestimonial({ ...newTestimonial, nom: e.target.value }), placeholder: "ex: Sarah K." })), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-3" }, /* @__PURE__ */ React.createElement("label", null, "Message"), /* @__PURE__ */ React.createElement("textarea", { className: "glass-input", rows: "4", value: newTestimonial.message, onChange: (e) => setNewTestimonial({ ...newTestimonial, message: e.target.value }), placeholder: "Facultatif si vous ajoutez une capture d'\xE9cran" })), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-3" }, /* @__PURE__ */ React.createElement("label", null, "Captures d'\xE9cran (Optionnel - Plusieurs possibles)"), /* @__PURE__ */ React.createElement("input", { type: "file", className: "glass-input", accept: "image/*", multiple: true, onChange: (e) => {
      const files = Array.from(e.target.files);
      const promises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(promises).then((base64Images) => {
        setNewTestimonial((prev) => ({ ...prev, images: [...prev.images || [], ...base64Images] }));
      });
    } }), newTestimonial.images && newTestimonial.images.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" } }, newTestimonial.images.map((img, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: img, alt: "Preview", style: { height: "80px", borderRadius: "4px", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setNewTestimonial((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) })), style: { position: "absolute", top: "-5px", right: "-5px", background: "red", color: "white", borderRadius: "50%", width: "20px", height: "20px", border: "none", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" } }, "\xD7"))))), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-3" }, /* @__PURE__ */ React.createElement("label", null, "Note sur 5"), /* @__PURE__ */ React.createElement("select", { className: "glass-input", value: newTestimonial.rating, onChange: (e) => setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) }) }, [5, 4, 3, 2, 1].map((n) => /* @__PURE__ */ React.createElement("option", { key: n, value: n }, n, " \xE9toiles")))), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: handleSaveTestimonial }, "Enregistrer")), !showTestimonialForm && /* @__PURE__ */ React.createElement("div", { className: "data-table-wrapper glass-panel" }, /* @__PURE__ */ React.createElement("table", { className: "data-table" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Nom"), /* @__PURE__ */ React.createElement("th", null, "Message"), /* @__PURE__ */ React.createElement("th", null, "Note"), /* @__PURE__ */ React.createElement("th", null, "Action"))), /* @__PURE__ */ React.createElement("tbody", null, testimonialsList.map((t) => /* @__PURE__ */ React.createElement("tr", { key: t.id }, /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("strong", null, t.nom)), /* @__PURE__ */ React.createElement("td", null, t.image && /* @__PURE__ */ React.createElement("img", { src: t.image, alt: "Capture", style: { width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", marginRight: "10px" } }), t.images && t.images.map((img, i) => /* @__PURE__ */ React.createElement("img", { key: i, src: img, alt: "Capture", style: { width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", marginRight: "10px" } })), t.message ? t.message.substring(0, 50) + "..." : /* @__PURE__ */ React.createElement("span", { className: "text-gray italic" }, "Image uniquement")), /* @__PURE__ */ React.createElement("td", null, "\u2B50".repeat(t.rating)), /* @__PURE__ */ React.createElement("td", null, /* @__PURE__ */ React.createElement("button", { className: "btn-icon", onClick: () => {
      setEditingTestimonialId(t.id);
      const existingImages = t.images || [];
      if (t.image && existingImages.length === 0) existingImages.push(t.image);
      setNewTestimonial({ nom: t.nom, message: t.message, rating: t.rating, images: existingImages });
      setShowTestimonialForm(true);
    }, title: "Modifier", style: { marginRight: "10px" } }, /* @__PURE__ */ React.createElement(import_lucide_react.Edit3, { size: 16, className: "text-blue" })), /* @__PURE__ */ React.createElement("button", { className: "btn-icon", onClick: () => handleDeleteTestimonial(t.id), title: "Supprimer" }, /* @__PURE__ */ React.createElement(import_lucide_react.Trash2, { size: 16, className: "text-pink" }))))), testimonialsList.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "4", className: "text-center" }, "Aucun t\xE9moignage."))))))), replyingToContact && /* @__PURE__ */ React.createElement("div", { className: "modal-overlay" }, /* @__PURE__ */ React.createElement("div", { className: "modal-content glass-panel", style: { maxWidth: "600px" } }, /* @__PURE__ */ React.createElement("h3", null, "R\xE9pondre \xE0 ", replyingToContact.nom), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-3 mt-3" }, /* @__PURE__ */ React.createElement("label", null, "Sujet"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "glass-input",
        value: replySubject,
        onChange: (e) => setReplySubject(e.target.value)
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "form-group mb-3" }, /* @__PURE__ */ React.createElement("label", null, "Message de r\xE9ponse"), /* @__PURE__ */ React.createElement(
      "textarea",
      {
        className: "glass-input",
        rows: "6",
        value: replyMessage,
        onChange: (e) => setReplyMessage(e.target.value),
        placeholder: `Tapez votre r\xE9ponse \xE0 ${replyingToContact.email} ici...`
      }
    )), /* @__PURE__ */ React.createElement("div", { className: "modal-actions", style: { display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px" } }, /* @__PURE__ */ React.createElement("button", { className: "btn btn-secondary", onClick: () => setReplyingToContact(null) }, "Annuler"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-primary", onClick: handleSendReply, disabled: replySending || !replyMessage.trim() }, replySending ? "Envoi..." : "Envoyer")))));
  };
  var Admin_default = Admin;
})();
