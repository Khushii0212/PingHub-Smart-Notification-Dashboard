/**
 * PriorityInbox — top-N notifications ranked by type weight + recency.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  Box, Typography, Grid, Chip, Slider,
  Tooltip, LinearProgress, alpha,
} from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NotificationCard from '../components/NotificationCard';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import NotificationDetailDrawer from '../components/NotificationDetailDrawer';
import { usePriorityNotifications, useReadTracker, useBookmarkTracker } from '../hooks/useNotifications';
import { tokens } from '../theme';
import logger from '../utils/logger';

const MODULE = 'PriorityInbox';

const RANK_PALETTE = [
  { bg: '#FFFBEB', color: '#D97706', ring: '#FDE68A', label: 'Gold' },
  { bg: '#F9FAFB', color: '#6B7280', ring: '#E5E7EB', label: 'Silver' },
  { bg: '#FFF7ED', color: '#C2410C', ring: '#FED7AA', label: 'Bronze' },
];

const RankBadge = ({ rank }) => {
  const pal = RANK_PALETTE[rank - 1] ?? { bg: tokens.bg.raised, color: tokens.text.tertiary, ring: tokens.line.subtle };
  return (
    <Chip
      icon={rank <= 3 ? <EmojiEventsRoundedIcon sx={{ fontSize: '13px !important', color: `${pal.color} !important` }} /> : null}
      label={`#${rank}`}
      size="small"
      sx={{ height: 22, fontSize: '0.68rem', fontWeight: 800, background: pal.bg, color: pal.color, border: `1.5px solid ${pal.ring}`, borderRadius: '6px' }}
    />
  );
};

const DemoBanner = () => (
  <Box display="flex" alignItems="center" gap={1} px={1.75} py={0.9} mb={2.5}
    sx={{ borderRadius: '8px', background: tokens.indigo[50], border: `1px solid ${tokens.indigo[200]}` }}>
    <InfoOutlinedIcon sx={{ fontSize: 15, color: tokens.indigo[500], flexShrink: 0 }} />
    <Typography variant="caption" sx={{ color: tokens.indigo[600], fontWeight: 500 }}>
      Demo mode — showing sample data. Connect a live API to see real notifications.
    </Typography>
  </Box>
);

const PriorityInbox = () => {
  const [topN, setTopN]     = useState(10);
  const [query, setQuery]   = useState('');
  const [selected, setSelected] = useState(null);

  const { prioritized, loading, isMock, reload } = usePriorityNotifications(topN);
  const { isRead, markRead } = useReadTracker();
  const { isBookmarked, toggleBookmark } = useBookmarkTracker();

  const filtered = useMemo(() => {
    if (!query.trim()) return prioritized;
    const q = query.toLowerCase();
    return prioritized.filter((n) =>
      (n.title ?? '').toLowerCase().includes(q) ||
      (n.company ?? '').toLowerCase().includes(q) ||
      (n.type ?? '').toLowerCase().includes(q)
    );
  }, [prioritized, query]);

  const maxScore = useMemo(() => prioritized[0]?.priorityScore ?? 0, [prioritized]);

  const breakdown = useMemo(() => {
    const c = { Placement: 0, Result: 0, Event: 0 };
    prioritized.forEach((n) => { const t = n.type ?? n.notificationType; if (t in c) c[t]++; });
    return c;
  }, [prioritized]);

  return (
    <Box>
      {/* ── Header ── */}
      <Box mb={3}>
        <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
          <Box sx={{
            width: 42, height: 42, borderRadius: '12px', flexShrink: 0,
            background: `linear-gradient(145deg, ${tokens.type.Event.main}, ${tokens.type.Event.dark})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 12px ${alpha(tokens.type.Event.main, 0.35)}`,
          }}>
            <StarRoundedIcon sx={{ fontSize: 22, color: '#fff' }} />
          </Box>
          <Box>
            <Typography variant="h2">Priority Inbox</Typography>
            <Typography variant="body2">Top {topN} by type weight &amp; recency</Typography>
          </Box>
        </Box>

        {/* Type breakdown chips */}
        <Box display="flex" gap={0.75} flexWrap="wrap">
          {Object.entries(breakdown).map(([type, count]) => {
            const t = tokens.type[type];
            return (
              <Chip key={type} label={`${count} ${type}`} size="small" sx={{
                background: t.bg, color: t.main,
                border: `1.5px solid ${alpha(t.main, 0.25)}`, fontWeight: 700,
              }} />
            );
          })}
        </Box>
      </Box>

      {/* ── Slider ── */}
      <Box sx={{ p: 2.25, mb: 3, borderRadius: '12px', background: tokens.bg.surface, border: `1px solid ${tokens.line.subtle}`, boxShadow: tokens.shadow.xs }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.75}>
          <Typography variant="overline">Showing top</Typography>
          <Chip label={`${topN} notifications`} size="small" sx={{ background: tokens.indigo[50], color: tokens.indigo[600], border: `1px solid ${tokens.indigo[100]}`, fontWeight: 700 }} />
        </Box>
        <Slider value={topN} onChange={(_, v) => setTopN(v)} min={1} max={50} step={1}
          marks={[{ value: 5, label: '5' }, { value: 10, label: '10' }, { value: 25, label: '25' }, { value: 50, label: '50' }]}
          valueLabelDisplay="auto" />
      </Box>

      {/* ── Search ── */}
      <Box mb={2.5}>
        <SearchBar value={query} onChange={setQuery} resultCount={query ? filtered.length : undefined} placeholder="Search priority notifications…" />
      </Box>

      {/* ── Content ── */}
      {isMock && <DemoBanner />}
      {loading && <SkeletonLoader count={6} />}

      {!loading && filtered.length === 0 && (
        <EmptyState title="Nothing to rank" message="Priority scoring kicks in once notifications are available." onRefresh={reload} />
      )}

      {!loading && filtered.length > 0 && (
        <Grid container spacing={2}>
          {filtered.map((n, idx) => {
            const id = n.id ?? n._id ?? n.notificationId ?? idx;
            const score = n.priorityScore;
            const pct   = maxScore > 0 && score != null ? Math.round((score / maxScore) * 100) : 0;
            return (
              <Grid item xs={12} key={id}>
                <Box>
                  {/* Rank + score bar */}
                  <Box display="flex" alignItems="center" gap={1.25} mb={0.75}>
                    <RankBadge rank={idx + 1} />
                    {score != null && (
                      <Tooltip title={`Score: ${score.toLocaleString()} · ${pct}% of max`} arrow>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress variant="determinate" value={pct} sx={{ height: 4, borderRadius: 2 }} />
                        </Box>
                      </Tooltip>
                    )}
                  </Box>
                  <NotificationCard
                    notification={n}
                    isRead={isRead(id)}
                    isBookmarked={isBookmarked(id)}
                    onMarkRead={markRead}
                    onToggleBookmark={toggleBookmark}
                    onOpen={setSelected}
                    showPriorityScore
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
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

export default PriorityInbox;
