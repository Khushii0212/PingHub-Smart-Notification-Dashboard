/**
 * Custom hooks — all notification state, including bookmarks.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchNotifications, fetchAllNotifications } from '../services/notificationService';
import { computePriorityScores } from '../utils/priorityEngine';
import logger from '../utils/logger';

const MODULE = 'useNotifications';

// ── Paginated hook ─────────────────────────────────────────────────────────────
export const useNotifications = ({ page = 1, limit = 10 } = {}) => {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock]   = useState(false);
  const abortRef = useRef(null);

  const load = useCallback(async (p, l) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const result = await fetchNotifications({ page: p, limit: l });
      setNotifications(result.data);
      setTotal(result.total);
      setIsMock(result.isMock ?? false);
    } catch (err) {
      if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
        logger.error('useNotifications error', MODULE, err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page, limit);
    return () => abortRef.current?.abort();
  }, [load, page, limit]);

  return { notifications, total, loading, isMock, reload: () => load(page, limit) };
};

// ── All notifications hook ─────────────────────────────────────────────────────
export const useAllNotifications = () => {
  const [all, setAll]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMock, setIsMock]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchAllNotifications();
      setAll(result.data);
      setIsMock(result.isMock ?? false);
    } catch (err) {
      logger.error('useAllNotifications error', MODULE, err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const scored = computePriorityScores(all);
  return { all: scored, loading, isMock, reload: load };
};

// ── Priority hook ──────────────────────────────────────────────────────────────
export const usePriorityNotifications = (topN = 10) => {
  const { all, loading, isMock, reload } = useAllNotifications();
  return { prioritized: all.slice(0, topN), loading, isMock, reload };
};

// ── Read tracker ───────────────────────────────────────────────────────────────
export const useReadTracker = () => {
  const [readIds, setReadIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('ph_read_ids') ?? '[]')); }
    catch { return new Set(); }
  });

  const persist = (next) => {
    try { localStorage.setItem('ph_read_ids', JSON.stringify([...next])); } catch {}
  };

  const markRead = useCallback((id) => {
    setReadIds((prev) => { const n = new Set(prev); n.add(String(id)); persist(n); return n; });
  }, []);

  const markAllRead = useCallback((ids) => {
    setReadIds((prev) => { const n = new Set(prev); ids.forEach((id) => n.add(String(id))); persist(n); return n; });
  }, []);

  const isRead = useCallback((id) => readIds.has(String(id)), [readIds]);
  return { readIds, markRead, isRead, markAllRead };
};

// ── Bookmark tracker ───────────────────────────────────────────────────────────
export const useBookmarkTracker = () => {
  const [bookmarkIds, setBookmarkIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('ph_bookmarks') ?? '[]')); }
    catch { return new Set(); }
  });

  const persist = (next) => {
    try { localStorage.setItem('ph_bookmarks', JSON.stringify([...next])); } catch {}
  };

  const toggleBookmark = useCallback((id) => {
    setBookmarkIds((prev) => {
      const n = new Set(prev);
      if (n.has(String(id))) n.delete(String(id));
      else n.add(String(id));
      persist(n);
      return n;
    });
  }, []);

  const isBookmarked = useCallback((id) => bookmarkIds.has(String(id)), [bookmarkIds]);
  return { bookmarkIds, toggleBookmark, isBookmarked };
};
