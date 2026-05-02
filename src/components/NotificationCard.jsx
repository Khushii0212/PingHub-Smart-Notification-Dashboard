/**
 * NotificationCard — bright, colorful, information-rich card.
 * Clicking opens the detail drawer.
 */

import React, { memo, useCallback } from 'react';
import {
  Card, CardContent, Box, Typography, Chip, Tooltip,
  IconButton, alpha, Avatar,
} from '@mui/material';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { tokens } from '../theme';

// ── Config ─────────────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  Placement: { icon: WorkRoundedIcon,   ...tokens.type.Placement, accentBar: tokens.type.Placement.main },
  Result:    { icon: SchoolRoundedIcon, ...tokens.type.Result,    accentBar: tokens.type.Result.main },
  Event:     { icon: EventRoundedIcon,  ...tokens.type.Event,     accentBar: tokens.type.Event.main },
};
const FALLBACK = { icon: EventRoundedIcon, ...tokens.type.Event };

// ── Deadline helper ────────────────────────────────────────────────────────────
const getDeadlineChip = (raw) => {
  if (!raw) return null;
  const days = Math.ceil((new Date(raw) - Date.now()) / 86_400_000);
  if (days < 0)   return { label: 'Expired', ...tokens.urgency.critical };
  if (days === 0) return { label: 'Due today!', ...tokens.urgency.critical };
  if (days <= 3)  return { label: `${days}d left`, ...tokens.urgency.critical };
  if (days <= 7)  return { label: `${days}d left`, ...tokens.urgency.warning };
  return { label: `${days}d left`, ...tokens.urgency.safe };
};

const resolveField = (obj, ...keys) => {
  for (const k of keys) if (obj?.[k] != null) return obj[k];
  return null;
};

const timeAgo = (raw) => {
  if (!raw) return '';
  const ms = Date.now() - new Date(raw).getTime();
  if (ms < 60_000) return 'just now';
  const m = Math.floor(ms / 60_000);
  if (m < 60)   return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)   return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

// ── Component ──────────────────────────────────────────────────────────────────
const NotificationCard = memo(({
  notification,
  isRead,
  isBookmarked,
  onMarkRead,
  onToggleBookmark,
  onOpen,
  showPriorityScore,
}) => {
  const rawType  = resolveField(notification, 'type', 'notificationType') ?? 'Event';
  const cfg      = TYPE_CONFIG[rawType] ?? FALLBACK;
  const TypeIcon = cfg.icon;

  const id          = resolveField(notification, 'id', '_id', 'notificationId');
  const title       = resolveField(notification, 'title', 'subject') ?? 'Untitled';
  const message     = resolveField(notification, 'message', 'description', 'body') ?? '';
  const createdAt   = resolveField(notification, 'createdAt', 'timestamp', 'created_at');
  const company     = notification.company ?? notification.organizer;
  const location    = notification.location;
  const ctc         = notification.ctc ?? notification.prize;
  const tags        = notification.tags ?? [];
  const dl          = getDeadlineChip(notification.deadline);

  // Company initial for avatar
  const initial = (company ?? rawType)[0]?.toUpperCase() ?? '?';

  const handleClick = useCallback(() => {
    if (!isRead && onMarkRead) onMarkRead(id);
    if (onOpen) onOpen(notification);
  }, [id, isRead, onMarkRead, onOpen, notification]);

  const handleBookmark = useCallback((e) => {
    e.stopPropagation();
    if (onToggleBookmark) onToggleBookmark(id);
  }, [id, onToggleBookmark]);

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        opacity: isRead ? 0.75 : 1,
        // Top accent bar
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${cfg.accentBar} 0%, ${alpha(cfg.accentBar, 0.3)} 100%)`,
        },
      }}
    >
      <CardContent sx={{ pt: 2.5, pb: 2, px: 2.5, '&:last-child': { pb: 2 } }}>
        {/* ── Row 1: Avatar + meta ── */}
        <Box display="flex" gap={1.5} alignItems="flex-start">
          {/* Company avatar */}
          <Avatar
            sx={{
              width: 42, height: 42, borderRadius: '11px', flexShrink: 0,
              background: `linear-gradient(145deg, ${cfg.bg}, ${alpha(cfg.main, 0.15)})`,
              border: `1.5px solid ${alpha(cfg.main, 0.2)}`,
              color: cfg.main,
              fontSize: '1rem',
              fontWeight: 800,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {initial}
          </Avatar>

          <Box flex={1} minWidth={0}>
            {/* Title + badges */}
            <Box display="flex" alignItems="flex-start" gap={0.75} mb={0.4} flexWrap="wrap">
              <Typography
                variant="h5"
                sx={{
                  flex: 1, minWidth: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontWeight: isRead ? 500 : 700,
                  color: isRead ? tokens.text.secondary : tokens.text.primary,
                  lineHeight: 1.3, letterSpacing: '-0.01em',
                }}
              >
                {title}
              </Typography>

              <Box display="flex" gap={0.5} alignItems="center" flexShrink={0}>
                {/* NEW badge */}
                {notification.isNew && !isRead && (
                  <Chip label="NEW" size="small" sx={{
                    height: 18, fontSize: '0.6rem', fontWeight: 800,
                    background: `linear-gradient(135deg, ${tokens.indigo[500]}, ${tokens.indigo[600]})`,
                    color: '#fff', letterSpacing: '0.05em',
                  }} />
                )}
                {/* Type badge */}
                <Chip label={rawType} size="small" sx={{
                  height: 20, fontSize: '0.67rem', fontWeight: 700,
                  background: cfg.bg, color: cfg.text ?? cfg.main,
                  border: `1px solid ${alpha(cfg.main, 0.2)}`,
                }} />
                {/* Unread dot */}
                {!isRead && (
                  <FiberManualRecordIcon sx={{ fontSize: 8, color: cfg.main, filter: `drop-shadow(0 0 2px ${cfg.main})` }} />
                )}
              </Box>
            </Box>

            {/* Company + time */}
            <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
              {company && (
                <Typography variant="caption" sx={{ fontWeight: 600, color: tokens.text.secondary }}>
                  {company}
                </Typography>
              )}
              <Typography variant="caption">{timeAgo(createdAt)}</Typography>

              {showPriorityScore && notification.priorityScore != null && (
                <Chip label={`Score ${notification.priorityScore.toLocaleString()}`} size="small" sx={{
                  height: 17, fontSize: '0.6rem', fontWeight: 700,
                  background: tokens.indigo[50], color: tokens.indigo[600],
                  border: `1px solid ${tokens.indigo[100]}`,
                }} />
              )}
            </Box>
          </Box>

          {/* Bookmark button */}
          <IconButton size="small" onClick={handleBookmark} sx={{
            flexShrink: 0, width: 30, height: 30,
            color: isBookmarked ? tokens.indigo[500] : tokens.text.tertiary,
            background: isBookmarked ? tokens.indigo[50] : 'transparent',
            border: `1px solid ${isBookmarked ? tokens.indigo[200] : 'transparent'}`,
            borderRadius: '8px',
            transition: 'all 0.18s',
            '&:hover': { background: tokens.indigo[50], color: tokens.indigo[500], borderColor: tokens.indigo[200] },
          }}>
            {isBookmarked
              ? <BookmarkRoundedIcon sx={{ fontSize: 15 }} />
              : <BookmarkBorderRoundedIcon sx={{ fontSize: 15 }} />}
          </IconButton>
        </Box>

        {/* ── Row 2: Message preview ── */}
        <Typography
          variant="body2"
          sx={{
            mt: 1.25, mb: 1.25, pl: '54px',
            color: isRead ? tokens.text.tertiary : tokens.text.secondary,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            lineHeight: 1.6,
          }}
        >
          {message}
        </Typography>

        {/* ── Row 3: Meta chips ── */}
        <Box display="flex" alignItems="center" gap={0.75} flexWrap="wrap" pl="54px">
          {/* Deadline */}
          {dl && (
            <Chip
              icon={<CalendarTodayRoundedIcon sx={{ fontSize: '12px !important', color: `${dl.color} !important` }} />}
              label={dl.label}
              size="small"
              sx={{
                height: 22, fontSize: '0.68rem', fontWeight: 700,
                background: dl.bg, color: dl.color,
                border: `1px solid ${dl.ring}`,
              }}
            />
          )}

          {/* Location */}
          {location && (
            <Chip
              icon={<LocationOnRoundedIcon sx={{ fontSize: '12px !important', color: `${tokens.indigo[400]} !important` }} />}
              label={location}
              size="small"
              sx={{
                height: 22, fontSize: '0.68rem', fontWeight: 500,
                background: tokens.indigo[50], color: tokens.indigo[600],
                border: `1px solid ${tokens.indigo[100]}`,
                maxWidth: 160, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' },
              }}
            />
          )}

          {/* CTC / Prize */}
          {ctc && (
            <Chip
              label={ctc}
              size="small"
              sx={{
                height: 22, fontSize: '0.68rem', fontWeight: 700,
                background: tokens.type.Placement.bg,
                color: tokens.type.Placement.text ?? tokens.type.Placement.main,
                border: `1px solid ${alpha(tokens.type.Placement.main, 0.2)}`,
              }}
            />
          )}

          {/* Tags (first 2) */}
          {tags.slice(0, 2).map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={{
              height: 22, fontSize: '0.65rem', fontWeight: 600,
              background: tokens.bg.raised, color: tokens.text.secondary,
              border: `1px solid ${tokens.line.subtle}`,
            }} />
          ))}

          {/* View details CTA */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.4, color: tokens.indigo[500] }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600 }}>View details</Typography>
            <ArrowForwardRoundedIcon sx={{ fontSize: 13 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
});

NotificationCard.displayName = 'NotificationCard';
export default NotificationCard;
