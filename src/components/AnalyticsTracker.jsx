import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config';

// Obtenir ou générer un ID de visiteur unique anonyme
export const getVisitorId = () => {
  if (typeof window === 'undefined') return 'anon';
  let id = localStorage.getItem('rk_visitor_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
    localStorage.setItem('rk_visitor_id', id);
  }
  return id;
};

// Fonction manuelle pour logger un clic ou un événement
export const trackSiteEvent = (eventType, additionalPath = '') => {
  if (typeof window === 'undefined') return;
  try {
    const visitorId = getVisitorId();
    const currentPath = window.location.pathname + (additionalPath ? `#${additionalPath}` : '');
    const referrer = document.referrer || 'direct';

    fetch(`${API_URL}/api/track/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: currentPath,
        visitorId,
        referrer,
        eventType,
      }),
    }).catch(() => {});
  } catch (e) {}
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Ne pas tracker les pages d'administration
    if (location.pathname.startsWith('/admin')) return;

    try {
      const visitorId = getVisitorId();
      const referrer = document.referrer || 'direct';

      fetch(`${API_URL}/api/track/visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: location.pathname,
          visitorId,
          referrer,
          eventType: 'pageview',
        }),
      }).catch(() => {});
    } catch (e) {}
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;
