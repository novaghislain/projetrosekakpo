import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config';


export const trackFbEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, params);
  }
};

/**
 * Dédoublonnage strict des événements Lead (anti-double clic / anti-refresh)
 * Enregistre l'événement dans le sessionStorage et localStorage pendant 24h.
 * @param {string} identifier - Identifiant de l'action (ex: 'whatsapp_group', 'contact_rose', etc.)
 * @param {object} params - Paramètres optionnels pour Meta Pixel
 */
export const trackLeadOnce = (identifier = 'general_lead', params = {}) => {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return false;

  const storageKey = `fb_lead_tracked_${identifier}`;
  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  try {
    // 1. Vérifier si déjà tracké dans la session actuelle
    const sessionTracked = sessionStorage.getItem(storageKey);
    if (sessionTracked) {
      console.log(`[Pixel] Lead déjà compté pour cette session (${identifier}) - ignoré.`);
      return false;
    }

    // 2. Vérifier si déjà tracké dans les dernières 24h
    const localTimestamp = localStorage.getItem(storageKey);
    if (localTimestamp && (now - parseInt(localTimestamp, 10)) < TWENTY_FOUR_HOURS) {
      console.log(`[Pixel] Lead déjà compté récemment (${identifier}) - ignoré.`);
      return false;
    }

    // 3. Marquer immédiatement comme tracké (bloque les double-clics instantanés)
    sessionStorage.setItem(storageKey, 'true');
    localStorage.setItem(storageKey, now.toString());
  } catch (e) {
    // Fallback silencieux si localStorage restreint
  }

  // ID unique d'événement pour la déduplication automatique côté serveurs Meta
  const eventID = `lead_${identifier}_${Math.random().toString(36).substring(2, 9)}_${now}`;

  window.fbq('track', 'Lead', params, { eventID });
  console.log(`[Pixel] Événement Lead unique envoyé avec succès (${identifier})`);

  // Enregistrer également dans nos analytics internes
  try {
    const vId = localStorage.getItem('rk_visitor_id') || 'anon';
    fetch(`${API_URL}/api/track/visit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
        visitorId: vId,
        referrer: document.referrer || 'direct',
        eventType: `lead_${identifier}`,
      }),
    }).catch(() => {});
  } catch (e) {}

  return true;
};

let pixelLoaded = false;
let pixelId = null;

function initPixel(id) {
  if (pixelLoaded || !id) return;
  pixelLoaded = true;
  pixelId = id;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    'script',
    'https://connect.facebook.net/en_US/fbevents.js'
  );
  /* eslint-enable */

  window.fbq('init', id);
  window.fbq('track', 'PageView');

  // Noscript fallback
  const noscript = document.createElement('noscript');
  const img = document.createElement('img');
  img.height = '1';
  img.width = '1';
  img.style.display = 'none';
  img.src = `https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`;
  noscript.appendChild(img);
  document.body.appendChild(noscript);
}

const FacebookPixel = () => {
  const location = useLocation();

  useEffect(() => {
    // Charger la config pixel depuis l'API (une seule fois)
    if (!pixelLoaded) {
      fetch(`${API_URL}/api/pixel`)
        .then(r => r.json())
        .then(data => {
          if (data.fb_pixel_enabled === 'true' && data.fb_pixel_id) {
            initPixel(data.fb_pixel_id);
          }
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    // PageView à chaque changement de page
    if (pixelLoaded && pixelId) {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname]);

  return null;
};

export default FacebookPixel;
