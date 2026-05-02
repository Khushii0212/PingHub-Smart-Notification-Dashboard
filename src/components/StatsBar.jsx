/**
 * StatsBar — colorful overview row: total, unread, bookmarked, and per-type counts.
 * Cards are now clickable to quick-filter.
 */

import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, alpha, Tooltip } from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import { tokens } from '../theme';

const STAT_CONFIGS = [
  {
    key: 'total',
    label: 'Total',
    icon: NotificationsRoundedIcon,
    color: tokens.indigo[500],
    bg: tokens.indigo[50],
    ring: tokens.indigo[100],
    filterPath: '/',
    tooltip: 'View all notifications',
  },
  {
    key: 'unread',
    label: 'Unread',
    icon: MailRoundedIcon,
    color: '#DC2626',
    bg: '#FEF2F2',
    ring: '#FECACA',
    filterPath: null, // Unread filtering would need backend support or special frontend logic
    tooltip: 'Total unread alerts',
  },
  {
    key: 'Placement',
    label: 'Placements',
    icon: WorkRoundedIcon,
    color: tokens.type.Placement.main,
    bg: tokens.type.Placement.bg,
    ring: alpha(tokens.type.Placement.main, 0.2),
    filterPath: '/filter?type=Placement',
    tooltip: 'Filter placements',
  },
  {
    key: 'Result',
    label: 'Results',
    icon: SchoolRoundedIcon,
    color: tokens.type.Result.main,
    bg: tokens.type.Result.bg,
    ring: alpha(tokens.type.Result.main, 0.2),
    filterPath: '/filter?type=Result',
    tooltip: 'Filter results',
  },
  {
    key: 'Event',
    label: 'Events',
    icon: EventRoundedIcon,
    color: tokens.type.Event.main,
    bg: tokens.type.Event.bg,
    ring: alpha(tokens.type.Event.main, 0.2),
    filterPath: '/filter?type=Event',
    tooltip: 'Filter events',
  },
  {
    key: 'bookmarked',
    label: 'Bookmarked',
    icon: BookmarkRoundedIcon,
    color: '#7C3AED',
    bg: '#F5F3FF',
    ring: '#DDD6FE',
    filterPath: null, // Bookmark filter could be added later
    tooltip: 'Your saved items',
  },
];

const StatCard = ({ icon: Icon, label, value, color, bg, ring, filterPath, tooltip }) => {
  const navigate = useNavigate();

  return (
    <Tooltip title={tooltip} arrow>
      <Box
        onClick={() => filterPath && navigate(filterPath)}
        sx={{
          flex: '1 1 0',
          minWidth: 90,
          display: 'flex', alignItems: 'center', gap: 1.25,
          px: 1.5, py: 1.25,
          borderRadius: '10px',
          background: bg,
          border: `1.5px solid ${ring}`,
          cursor: filterPath ? 'pointer' : 'default',
          transition: 'transform 0.18s ease, box-shadow 0.18s ease',
          '&:hover': {
            transform: filterPath ? 'translateY(-2px)' : 'none',
            boxShadow: filterPath ? tokens.shadow.sm : 'none',
            borderColor: filterPath ? alpha(color, 0.4) : ring,
          },
        }}
      >
        <Box sx={{
          width: 34, height: 34, borderRadius: '9px', flexShrink: 0,
          background: alpha(color, 0.12),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon sx={{ fontSize: 17, color }} />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1, color: tokens.text.primary, letterSpacing: '-0.02em' }}>
            {value}
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 600, color, fontSize: '0.65rem', letterSpacing: '0.02em' }}>
            {label}
          </Typography>
        </Box>
      </Box>
    </Tooltip>
  );
};

const StatsBar = memo(({ stats = {} }) => (
  <Box sx={{
    display: 'flex', gap: 1.25, flexWrap: 'wrap', mb: 3,
    p: 1.5,
    borderRadius: '14px',
    background: tokens.bg.surface,
    border: `1px solid ${tokens.line.subtle}`,
    boxShadow: tokens.shadow.xs,
  }}>
    {STAT_CONFIGS.map(({ key, ...rest }) => (
      <StatCard key={key} value={stats[key] ?? 0} {...rest} />
    ))}
  </Box>
));

StatsBar.displayName = 'StatsBar';
export default StatsBar;
