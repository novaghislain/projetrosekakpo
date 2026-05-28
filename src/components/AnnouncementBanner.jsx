import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import './AnnouncementBanner.css';
import { API_URL } from '../config';

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/api/announcements`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setAnnouncements(data);
      })
      .catch(() => {});
  }, []);

  const visible = announcements.filter(a => !dismissed.includes(a.id));

  if (visible.length === 0) return null;

  const ann = visible[current % visible.length];

  const dismiss = () => {
    setDismissed(prev => [...prev, ann.id]);
    setCurrent(0);
  };

  const typeConfig = {
    info:    { bg: 'linear-gradient(90deg, #3b82f6, #6366f1)', icon: 'ℹ️' },
    success: { bg: 'linear-gradient(90deg, #10b981, #2E6F40)', icon: '🎉' },
    warning: { bg: 'linear-gradient(90deg, #f59e0b, #ef4444)', icon: '⚠️' },
    promo:   { bg: 'var(--gradient-pink)', icon: '🔥' },
  };

  const cfg = typeConfig[ann.type] || typeConfig.info;

  return (
    <div className="announcement-banner" style={{ background: cfg.bg }}>
      <div className="announcement-inner">
        <span className="ann-icon">{cfg.icon}</span>
        <p className="ann-message">{ann.message}</p>
        {ann.link && (
          <a href={ann.link} target="_blank" rel="noreferrer" className="ann-link">
            {ann.link_label || 'En savoir plus'} <ExternalLink size={13} />
          </a>
        )}
      </div>
      <button className="ann-close" onClick={dismiss} aria-label="Fermer">
        <X size={16} />
      </button>
    </div>
  );
};

export default AnnouncementBanner;
