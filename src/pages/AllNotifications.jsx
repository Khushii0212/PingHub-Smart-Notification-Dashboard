/**
 * AllNotifications — paginated, searchable notification feed.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box, Grid, Typography, Pagination,
  Select, MenuItem, FormControl, InputLabel,
  Button, Chip, alpha,
} from '@mui/material';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationCard from '../components/NotificationCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import StatsBar from '../components/StatsBar';
import SearchBar from '../components/SearchBar';
import NotificationDetailDrawer from '../components/NotificationDetailDrawer';
import { useNotifications, useAllNotifications, useReadTracker, useBookmarkTracker } from '../hooks/useNotifications';
import { tokens } from '../theme';
import logger from '../utils/logger';

const MODULE = 'AllNotifications';
const LIMIT_OPTIONS = [5, 10, 20, 50];

const DemoBanner = () => (
  <Box display="flex" alignItems="center" gap={1} px={1.75} py={0.9} mb={2.5}
    sx={{ borderRadius: '8px', background: tokens.indigo[50], border: `1px solid ${tokens.indigo[200]}` }}>
    <InfoOutlinedIcon sx={{ fontSize: 15, color: tokens.indigo[500], flexShrink: 0 }} />
    <Typography variant="caption" sx={{ color: tokens.indigo[600], fontWeight: 500 }}>
      Demo mode — showing sample data. Connect a live API to see real notifications.
    </Typography>
  </Box>
);

const AllNotifications = () => {
  const [page, setPage]     = useState(1);
  const [limit, setLimit]   = useState(10);
  const [query, setQuery]   = useState('');
  const [selected, setSelected] = useState(null);

  const { notifications, total, loading, isMock, reload } = useNotifications({ page, limit });
  const { all } = useAllNotifications();
  const { isRead, markRead, markAllRead } = useReadTracker();
  const { isBookmarked, toggleBookmark, bookmarkIds } = useBookmarkTracker();

  // Client-side search filter
  const filtered = useMemo(() => {
    if (!query.trim()) return notifications;
    const q = query.toLowerCase();
    return notifications.filter((n) =>
      (n.title ?? '').toLowerCase().includes(q) ||
      (n.message ?? n.description ?? '').toLowerCase().includes(q) ||
      (n.company ?? '').toLowerCase().includes(q) ||
      (n.type ?? '').toLowerCase().includes(q)
    );
  }, [notifications, query]);

  // Stats across ALL notifications
  const stats = useMemo(() => {
    const typeCounts = { Placement: 0, Result: 0, Event: 0 };
    all.forEach((n) => { const t = n.type ?? n.notificationType; if (t in typeCounts) typeCounts[t]++; });
    const unreadCount = all.filter((n) => !isRead(n.id ?? n._id ?? n.notificationId)).length;
    return {
      total: all.length,
      unread: unreadCount,
      bookmarked: bookmarkIds.size,
      ...typeCounts,
    };
  }, [all, isRead, bookmarkIds]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const handlePageChange = useCallback((_, v) => {
    setPage(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleMarkAllRead = useCallback(() => {
    const ids = notifications.map((n) => n.id ?? n._id ?? n.notificationId);
    markAllRead(ids);
    logger.info(`Marked all read (${ids.length})`, MODULE);
  }, [notifications, markAllRead]);

  const unreadOnPage = useMemo(
    () => filtered.filter((n) => !isRead(n.id ?? n._id ?? n.notificationId)).length,
    [filtered, isRead]
  );

  return (
    <Box>
      {/* ── Stats ── */}
      <StatsBar stats={stats} />

      {/* ── Header ── */}
      <Box display="flex" alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2} mb={2.5}>
        <Box>
          <Typography variant="h2" sx={{ mb: 0.5 }}>All Notifications</Typography>
          <Box display="flex" gap={0.75} alignItems="center" flexWrap="wrap">
            {total > 0 && (
              <Chip label={`${total} total`} size="small" sx={{ background: tokens.indigo[50], color: tokens.indigo[600], border: `1px solid ${tokens.indigo[100]}`, fontWeight: 700 }} />
            )}
            {unreadOnPage > 0 && (
              <Chip label={`${unreadOnPage} unread`} size="small" sx={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', fontWeight: 700 }} />
            )}
          </Box>
        </Box>

        <Box display="flex" gap={1} flexWrap="wrap" alignItems="center">
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel sx={{ fontSize: '0.8rem' }}>Per page</InputLabel>
            <Select value={limit} label="Per page" onChange={(e) => { setLimit(e.target.value); setPage(1); }}
              sx={{ fontSize: '0.875rem' }}>
              {LIMIT_OPTIONS.map((l) => <MenuItem key={l} value={l} sx={{ fontSize: '0.875rem' }}>{l}</MenuItem>)}
            </Select>
          </FormControl>
          {unreadOnPage > 0 && (
            <Button variant="outlined" size="small"
              startIcon={<DoneAllRoundedIcon sx={{ fontSize: '16px !important' }} />}
              onClick={handleMarkAllRead}
              sx={{ fontSize: '0.8rem' }}>
              Mark all read
            </Button>
          )}
        </Box>
      </Box>

      {/* ── Search ── */}
      <Box mb={2.5}>
        <SearchBar value={query} onChange={setQuery} resultCount={query ? filtered.length : undefined} placeholder="Search by title, company, or type…" />
      </Box>

      {/* ── Demo banner ── */}
      {isMock && <DemoBanner />}

      {/* ── Content ── */}
      {loading && <SkeletonLoader count={Math.min(limit, 8)} />}

      {!loading && filtered.length === 0 && (
        <EmptyState
          title={query ? 'No results found' : 'No notifications yet'}
          message={query ? `No notifications match "${query}". Try a different search term.` : 'Campus alerts will appear here as soon as they arrive.'}
          onRefresh={query ? () => setQuery('') : reload}
          actionLabel={query ? 'Clear search' : 'Retry'}
        />
      )}

      {!loading && filtered.length > 0 && (
        <>
          <Grid container spacing={2}>
            {filtered.map((n, idx) => {
              const id = n.id ?? n._id ?? n.notificationId ?? idx;
              return (
                <Grid item xs={12} key={id}>
                  <NotificationCard
                    notification={n}
                    isRead={isRead(id)}
                    isBookmarked={isBookmarked(id)}
                    onMarkRead={markRead}
                    onToggleBookmark={toggleBookmark}
                    onOpen={setSelected}
                    showPriorityScore={false}
                  />
                </Grid>
              );
            })}
          </Grid>

          {totalPages > 1 && !query && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" shape="rounded" showFirstButton showLastButton />
            </Box>
          )}
        </>
      )}

      {/* ── Detail drawer ── */}
      <NotificationDetailDrawer
        notification={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        isRead={selected ? isRead(selected.id ?? selected._id ?? selected.notificationId) : false}
        isBookmarked={selected ? isBookmarked(selected.id ?? selected._id ?? selected.notificationId) : false}
        onMarkRead={markRead}
        onToggleBookmark={toggleBookmark}
      />
    </Box>
  );
};

export default AllNotifications;
