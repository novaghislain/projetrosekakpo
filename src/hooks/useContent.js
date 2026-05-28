import { useState, useEffect } from 'react';

const contentCache = { data: null, timestamp: 0 };
const CACHE_TTL = 30000; // 30 secondes

export function useContent() {
  const [content, setContent] = useState(contentCache.data || {});
  const [loading, setLoading] = useState(!contentCache.data);

  useEffect(() => {
    const now = Date.now();
    if (contentCache.data && (now - contentCache.timestamp) < CACHE_TTL) {
      setContent(contentCache.data);
      setLoading(false);
      return;
    }

    fetch('http://localhost:3001/api/content')
      .then(res => res.json())
      .then(data => {
        contentCache.data = data;
        contentCache.timestamp = Date.now();
        setContent(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Retourne la valeur d'une clé, ou la valeur de secours si absente
  const c = (key, fallback = '') => {
    return content[key]?.value ?? fallback;
  };

  return { content, loading, c };
}

// Invalidate cache (called after admin update)
export function invalidateContentCache() {
  contentCache.data = null;
  contentCache.timestamp = 0;
}
