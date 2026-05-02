/**
 * NotificationBell — clickable bell with popover showing recent unread alerts.
 * Features: unread count badge, list of unread notifications, mark-all-read,
 * navigate to full list, empty state.
 */

import React, { memo, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IconButton, Badge, Popover, Box, Typography, Button,
  Divider, Tooltip, alpha, Chip,
} from '@mui/material';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import { tokens } from '../theme';

const TYPE_CONFIG = {
  Placement: { icon: WorkRoundedIcon,   color: tokens.type.Placement.main, bg: tokens.type.Placement.bg },
  Result:    { icon: SchoolRoundedIcon, color: tokens.type.Result.main,    bg: tokens.type.Result.bg    },
  Event:     { icon: EventRoundedIcon,  color: tokens.type.Event.main,     bg: tokens.type.Event.bg     },
};

const timeAgo = (raw) => {
  if (!raw) return '';
  const ms = Date.now() - new Date(raw).getTime();
  if (ms < 60_000) return 'just now';
  const m = Math.floor(ms / 60_000);
  if (m < 60)  return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const BellItem = ({ notification, onMarkRead, onNavigate }) => {
  const rawType = notification.type ?? notification.notificationType ?? 'Event';
  const cfg     = TYPE_CONFIG[rawType] ?? TYPE_CONFIG.Event;
  const Icon    = cfg.icon;
  const id      = notification.id ?? notification._id ?? notification.notificationId;

  return (
    <Box
      onClick={() => { onMarkRead(id); onNavigate(); }}
      sx={{
        display: 'flex', gap: 1.25, p: 1.5, cursor: 'pointer',
        borderRadius: '8px', transition: 'background 0.15s ease',
        '&:hover': { background: tokens.bg.raised },
      }}
    >
      <Box sx={{
        width: 34, height: 34, borderRadius: '9px', flexShrink: 0,
        background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${alpha(cfg.color, 0.2)}`,
      }}>
        <Icon sx={{ fontSize: 17, color: cfg.color }} />
      </Box>
      <Box flex={1} minWidth={0}>
        <Typography sx={{
          fontSize: '0.82rem', fontWeight: 600, lineHeight: 1.3, mb: 0.25,
          color: tokens.text.primary,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {notification.title ?? 'Notification'}
        </Typography>
        <Box display="flex" gap={0.75} alignItems="center">
          <Chip label={rawType} size="small" sx={{
            height: 16, fontSize: '0.6rem', fontWeight: 700,
            background: cfg.bg, color: cfg.color, px: 0.25,
          }} />
          <Typography variant="caption" sx={{ color: tokens.text.tertiary, fontSize: '0.68rem' }}>
            {timeAgo(notification.createdAt ?? notification.timestamp)}
          </Typography>
        </Box>
      </Box>
      {/* Unread dot */}
      <Box sx={{
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
        background: cfg.color, mt: 0.75,
        boxShadow: `0 0 0 2px ${alpha(cfg.color, 0.2)}`,
      }} />
    </Box>
  );
};

const NotificationBell = memo(({ unreadNotifications = [], onMarkRead, onMarkAllRead }) => {
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);

  const open  = Boolean(anchor);
  const count = unreadNotifications.length;

  const handleOpen  = useCallback((e) => setAnchor(e.currentTarget), []);
  const handleClose = useCallback(() => setAnchor(null), []);

  const handleMarkAll = useCallback(() => {
    const ids = unreadNotifications.map((n) => n.id ?? n._id ?? n.notificationId);
    onMarkAllRead(ids);
  }, [unreadNotifications, onMarkAllRead]);

  const handleViewAll = useCallback(() => {
    navigate('/');
    handleClose();
  }, [navigate, handleClose]);

  // Show max 5 in the popover
  const visible = unreadNotifications.slice(0, 5);

  return (
    <>
      <Tooltip title={count > 0 ? `${count} unread notification${count !== 1 ? 's' : ''}` : 'All caught up!'} arrow>
        <IconButton
          onClick={handleOpen}
          size="small"
          sx={{
            width: 38, height: 38, borderRadius: '10px',
            background: open ? tokens.indigo[50] : 'transparent',
            border: `1px solid ${open ? tokens.indigo[200] : 'transparent'}`,
            transition: 'all 0.18s ease',
            '&:hover': { background: tokens.indigo[50], borderColor: tokens.indigo[200] },
          }}
        >
          <Badge
            badgeContent={count}
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                background: count > 0
                  ? `linear-gradient(135deg, ${tokens.indigo[500]}, ${tokens.indigo[600]})`
                  : 'transparent',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.6rem',
                minWidth: 17,
                height: 17,
                boxShadow: count > 0 ? `0 0 0 2px ${tokens.bg.surface}` : 'none',
              },
            }}
          >
            <NotificationsRoundedIcon
              sx={{
                fontSize: 20,
                color: open ? tokens.indigo[500] : tokens.text.secondary,
                transition: 'color 0.18s',
              }}
            />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 360,
            mt: 1,
            borderRadius: '14px',
            border: `1px solid ${tokens.line.subtle}`,
            boxShadow: `0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)`,
            overflow: 'hidden',
          },
        }}
      >
        {/* ── Header ── */}
        <Box sx={{
          px: 2, py: 1.5,
          background: `linear-gradient(135deg, ${tokens.indigo[50]}, ${tokens.bg.surface})`,
          borderBottom: `1px solid ${tokens.line.subtle}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Box display="flex" alignItems="center" gap={1}>
            <NotificationsRoundedIcon sx={{ fontSize: 17, color: tokens.indigo[500] }} />
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: tokens.text.primary }}>
              Notifications
            </Typography>
            {count > 0 && (
              <Chip label={`${count} new`} size="small" sx={{
                height: 19, fontSize: '0.65rem', fontWeight: 800,
                background: `linear-gradient(135deg, ${tokens.indigo[500]}, ${tokens.indigo[600]})`,
                color: '#fff',
              }} />
            )}
          </Box>

          {count > 0 && (
            <Button
              size="small"
              startIcon={<DoneAllRoundedIcon sx={{ fontSize: '13px !important' }} />}
              onClick={handleMarkAll}
              sx={{ fontSize: '0.72rem', fontWeight: 600, color: tokens.indigo[500], py: 0.4, px: 1 }}
            >
              Mark all read
            </Button>
          )}
        </Box>

        {/* ── List ── */}
        <Box sx={{ maxHeight: 340, overflowY: 'auto', px: 1, py: 0.75 }}>
          {visible.length === 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" py={4} gap={1.25}>
              <Box sx={{
                width: 50, height: 50, borderRadius: '14px',
                background: tokens.indigo[50],
                border: `1.5px solid ${tokens.indigo[100]}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <NotificationsNoneRoundedIcon sx={{ fontSize: 26, color: tokens.indigo[300] }} />
              </Box>
              <Box textAlign="center">
                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: tokens.text.primary, mb: 0.25 }}>
                  You're all caught up!
                </Typography>
                <Typography variant="caption" sx={{ color: tokens.text.tertiary }}>
                  No unread notifications right now.
                </Typography>
              </Box>
            </Box>
          ) : (
            visible.map((n) => (
              <BellItem
                key={n.id ?? n._id ?? n.notificationId}
                notification={n}
                onMarkRead={onMarkRead}
                onNavigate={handleClose}
              />
            ))
          )}

          {count > 5 && (
            <Typography variant="caption" sx={{
              display: 'block', textAlign: 'center', py: 0.75,
              color: tokens.text.tertiary, fontWeight: 500,
            }}>
              +{count - 5} more unread notifications
            </Typography>
          )}
        </Box>

        {/* ── Footer ── */}
        <Divider />
        <Box sx={{ px: 2, py: 1.25 }}>
          <Button
            fullWidth
            size="small"
            endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: '14px !important' }} />}
            onClick={handleViewAll}
            sx={{
              fontSize: '0.8rem', fontWeight: 700,
              color: tokens.indigo[600],
              background: tokens.indigo[50],
              border: `1px solid ${tokens.indigo[100]}`,
              borderRadius: '8px', py: 0.85,
              '&:hover': { background: tokens.indigo[100] },
            }}
          >
            View all notifications
          </Button>
        </Box>
      </Popover>
    </>
  );
});

NotificationBell.displayName = 'NotificationBell';
export default NotificationBell;
