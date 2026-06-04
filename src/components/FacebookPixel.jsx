import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config';

/**
 * FacebookPixel — Charge dynamiquement le Meta (Facebook) Pixel sur toutes les pages.
 * Il récupère l'ID et le statut d'activation depuis l'API backend.
 * Envoie automatiquement PageView à chaque changement de route.
 */

// Expose une fonction fbq() globale sécurisée pour les événements
export const trackFbEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, params);
  }
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
