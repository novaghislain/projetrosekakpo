const fs = require('fs');

let content = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

// 1. Add state
if (!content.includes('const [manualPayments, setManualPayments] = useState([]);')) {
  content = content.replace(
    'const [enrollments, setEnrollments] = useState([]);',
    'const [enrollments, setEnrollments] = useState([]);\n  const [manualPayments, setManualPayments] = useState([]);'
  );
}

// 2. Add fetch in Promise.all
if (!content.includes('/api/admin/manual-payments')) {
  content = content.replace(
    'const [resContacts, resNewsletters, resEnrollments, resArticles, resPrices, resContent, resFormations, resEbooks] = await Promise.all([',
    'const [resContacts, resNewsletters, resEnrollments, resArticles, resPrices, resContent, resFormations, resEbooks, resManual] = await Promise.all(['
  );
  content = content.replace(
    "fetch(`${API_URL}/api/ebooks`).then(res => res.json())",
    "fetch(`${API_URL}/api/ebooks`).then(res => res.json()),\n        fetch(`${API_URL}/api/admin/manual-payments`).then(res => res.json())"
  );
  content = content.replace(
    'setEbooks(resEbooks);',
    'setEbooks(resEbooks);\n      if(Array.isArray(resManual)) setManualPayments(resManual);'
  );
}

// 3. Add handlers
if (!content.includes('handleApproveManualPayment')) {
  const handlers = `
  const handleApproveManualPayment = async (id) => {
    try {
      const response = await fetch(\`\${API_URL}/api/admin/manual-payments/\${id}/approve\`, { method: 'POST' });
      if (response.ok) {
        alert("Paiement validé avec succès ! Le client a reçu son accès par email.");
        fetchData();
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de la validation.");
      }
    } catch(err) { alert("Erreur réseau"); }
  };

  const handleRejectManualPayment = async (id) => {
    if(!window.confirm("Êtes-vous sûr de vouloir supprimer cette preuve de paiement ?")) return;
    try {
      const response = await fetch(\`\${API_URL}/api/admin/manual-payments/\${id}\`, { method: 'DELETE' });
      if (response.ok) fetchData();
    } catch(err) { alert("Erreur réseau"); }
  };
`;
  content = content.replace('const handleLogout = () => {', handlers + '\n  const handleLogout = () => {');
}

// 4. Add Tab button
if (!content.includes("setActiveTab('manual-payments')")) {
  content = content.replace(
    '<button className={`admin-tab ${activeTab === \'ebooks\' ? \'active\' : \'\'}`} onClick={() => setActiveTab(\'ebooks\')}>',
    '<button className={`admin-tab ${activeTab === \'manual-payments\' ? \'active\' : \'\'}`} onClick={() => setActiveTab(\'manual-payments\')}>\n          <CreditCard size={18} /> Preuves de Paiement\n          {manualPayments && manualPayments.filter(m => m.status === \'pending\').length > 0 && (\n            <span style={{background:\'#e5007d\', color:\'white\', borderRadius:\'50%\', padding:\'2px 6px\', fontSize:\'0.7rem\', marginLeft:\'auto\'}}>\n              {manualPayments.filter(m => m.status === \'pending\').length}\n            </span>\n          )}\n        </button>\n        <button className={`admin-tab ${activeTab === \'ebooks\' ? \'active\' : \'\'}`} onClick={() => setActiveTab(\'ebooks\')}>'
  );
}

// 5. Add UI Section
if (!content.includes("activeTab === 'manual-payments' && (")) {
  const uiSection = `
        {activeTab === 'manual-payments' && (
          <div className="admin-section animate-fade-up">
            <div className="admin-header-flex">
              <h2><CreditCard size={24} className="text-pink" /> Preuves de Paiement (Mobile Money)</h2>
            </div>
            <div className="admin-card glass-panel" style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>WhatsApp</th>
                    <th>Programme</th>
                    <th>Réseau</th>
                    <th>Statut</th>
                    <th>Preuve</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {manualPayments && manualPayments.length > 0 ? (
                    manualPayments.map(payment => (
                      <tr key={payment.id}>
                        <td>{new Date(payment.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td>{payment.customer_info?.firstname} {payment.customer_info?.lastname}<br/><small>{payment.customer_info?.email}</small></td>
                        <td>{payment.customer_info?.whatsapp}</td>
                        <td>{payment.program_id}</td>
                        <td><strong>{payment.network}</strong></td>
                        <td>
                          {payment.status === 'pending' ? <span style={{color: '#ffcc00', fontWeight: 'bold'}}>En attente</span> : <span style={{color: '#4caf50', fontWeight: 'bold'}}>Validé</span>}
                        </td>
                        <td>
                          <a href={payment.proof_image} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                            Voir image
                          </a>
                        </td>
                        <td>
                          {payment.status === 'pending' && (
                            <button onClick={() => handleApproveManualPayment(payment.id)} className="action-btn text-green mr-2" title="Valider et envoyer email">
                              <CheckCircle2 size={18} />
                            </button>
                          )}
                          <button onClick={() => handleRejectManualPayment(payment.id)} className="action-btn text-red" title="Supprimer">
                            <Trash2 size={18} />
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
`;
  content = content.replace(
    "{activeTab === 'ebooks' && (",
    uiSection + "\n        {activeTab === 'ebooks' && ("
  );
}

// 6. Add lucide-react imports
if (!content.includes('CreditCard,')) {
  content = content.replace(
    'Trash2,',
    'Trash2, CreditCard, CheckCircle2,'
  );
}

fs.writeFileSync('src/pages/Admin.jsx', content, 'utf8');
console.log('Admin.jsx patched');
