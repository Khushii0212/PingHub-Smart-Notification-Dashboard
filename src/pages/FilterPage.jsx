/**
 * FilterPage — instant client-side filtering by notification type.
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Grid, Typography, Chip, alpha } from '@mui/material';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationCard from '../components/NotificationCard';
import FilterBar from '../components/FilterBar';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import NotificationDetailDrawer from '../components/NotificationDetailDrawer';
import { useAllNotifications, useReadTracker, useBookmarkTracker } from '../hooks/useNotifications';
import { tokens } from '../theme';
import logger from '../utils/logger';

const MODULE = 'FilterPage';

const DemoBanner = () => (
  <Box display="flex" alignItems="center" gap={1} px={1.75} py={0.9} mb={2.5}
    sx={{ borderRadius: '8px', background: tokens.indigo[50], border: `1px solid ${tokens.indigo[200]}` }}>
    <InfoOutlinedIcon sx={{ fontSize: 15, color: tokens.indigo[500], flexShrink: 0 }} />
    <Typography variant="caption" sx={{ color: tokens.indigo[600], fontWeight: 500 }}>
      Demo mode — showing sample data. Connect a live API to see real notifications.
    </Typography>
  </Box>
);

const VALID_TYPES = ['Placement', 'Result', 'Event'];

const FilterPage = () => {
  const [searchParams] = useSearchParams();
  const urlType = searchParams.get('type');
  const [activeFilter, setActiveFilter] = useState(
    VALID_TYPES.includes(urlType) ? urlType : 'All'
  );
  const [query, setQuery]               = useState('');
  const [selected, setSelected]         = useState(null);

  // Sync when URL param changes (e.g. navigating from sidebar)
  useEffect(() => {
    const t = searchParams.get('type');
    setActiveFilter(VALID_TYPES.includes(t) ? t : 'All');
  }, [searchParams]);

  const { all, loading, isMock, reload } = useAllNotifications();
  const { isRead, markRead }             = useReadTracker();
  const { isBookmarked, toggleBookmark } = useBookmarkTracker();

  const typeCounts = useMemo(() => {
    const c = { Placement: 0, Result: 0, Event: 0 };
    all.forEach((n) => { const t = n.type ?? n.notificationType; if (t in c) c[t]++; });
    return c;
  }, [all]);

  const filtered = useMemo(() => {
    let list = activeFilter === 'All' ? all : all.filter((n) => (n.type ?? n.notificationType) === activeFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((n) =>
        (n.title ?? '').toLowerCase().includes(q) ||
        (n.company ?? '').toLowerCase().includes(q) ||
        (n.message ?? '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [all, activeFilter, query]);

  const handleFilter = useCallback((v) => {
    logger.info(`Filter → "${v}"`, MODULE);
    setActiveFilter(v);
  }, []);

  const activeCfg = tokens.type[activeFilter];

  return (
    <Box>
      {/* ── Header ── */}
      <Box mb={3}>
        <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
          <Box sx={{
            width: 42, height: 42, borderRadius: '12px',
            background: activeCfg ? activeCfg.bg : tokens.indigo[50],
            border: `1.5px solid ${activeCfg ? alpha(activeCfg.main, 0.25) : tokens.indigo[200]}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s', flexShrink: 0,
          }}>
            <TuneRoundedIcon sx={{ fontSize: 21, color: activeCfg ? activeCfg.main : tokens.indigo[500], transition: 'color 0.2s' }} />
          </Box>
          <Box>
            <Typography variant="h2">Filter Notifications</Typography>
            <Typography variant="body2">
              Viewing{' '}
              <Box component="span" sx={{ color: activeCfg ? activeCfg.main : tokens.indigo[500], fontWeight: 600, transition: 'color 0.2s' }}>
                {activeFilter === 'All' ? 'all types' : activeFilter}
              </Box>
              {' '}— {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Filter bar ── */}
      <Box mb={2}>
        <FilterBar active={activeFilter} onChange={handleFilter} counts={typeCounts} />
      </Box>

      {/* ── Search ── */}
      <Box mb={2.5}>
        <SearchBar value={query} onChange={setQuery} resultCount={query ? filtered.length : undefined} placeholder={`Search ${activeFilter === 'All' ? 'all' : activeFilter.toLowerCase()} notifications…`} />
      </Box>

      {/* ── Content ── */}
      {isMock && <DemoBanner />}
      {loading && <SkeletonLoader count={8} />}

      {!loading && filtered.length === 0 && (
        <EmptyState
          title={query ? 'No results' : `No ${activeFilter === 'All' ? '' : activeFilter} notifications`}
          message={query ? `No matches for "${query}".` : `Try a different filter.`}
          onRefresh={activeFilter !== 'All' || query ? () => { handleFilter('All'); setQuery(''); } : reload}
          actionLabel={activeFilter !== 'All' || query ? 'Clear filters' : 'Retry'}
        />
      )}

      {!loading && filtered.length > 0 && (
        <>
          <Box display="flex" alignItems="center" gap={0.75} mb={2} px={0.25}>
            <Typography variant="caption">{filtered.length} of {all.length} notifications</Typography>
            {activeFilter !== 'All' && (
              <Chip label={activeFilter} size="small" onDelete={() => handleFilter('All')} sx={{
                height: 20, fontSize: '0.67rem', fontWeight: 700,
                background: activeCfg?.bg, color: activeCfg?.main,
                border: `1px solid ${alpha(activeCfg?.main ?? '#000', 0.2)}`,
                '& .MuiChip-deleteIcon': { color: activeCfg?.main, fontSize: 14, opacity: 0.6, '&:hover': { opacity: 1 } },
              }} />
            )}
            {query && (
              <Chip label={`"${query}"`} size="small" onDelete={() => setQuery('')} sx={{
                height: 20, fontSize: '0.67rem', fontWeight: 700,
                background: tokens.indigo[50], color: tokens.indigo[600],
                border: `1px solid ${tokens.indigo[100]}`,
                '& .MuiChip-deleteIcon': { color: tokens.indigo[500], fontSize: 14 },
              }} />
            )}
          </Box>

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
        </>
      )}

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

export default FilterPage;
