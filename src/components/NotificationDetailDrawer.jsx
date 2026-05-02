/**
 * NotificationDetailDrawer — full detail panel sliding in from the right.
 *
 * Shows: type header, company, full message, metadata grid,
 * tags, deadline urgency, and a primary action button.
 */

import React, { memo, useCallback } from 'react';
import {
  Drawer, Box, Typography, IconButton, Button, Chip,
  Divider, Tooltip, alpha, Grid,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import BusinessRoundedIcon from '@mui/icons-material/BusinessRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import BookmarkRoundedIcon from '@mui/icons-material/BookmarkRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import TagRoundedIcon from '@mui/icons-material/TagRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { tokens } from '../theme';

// ── Helpers ────────────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  Placement: { icon: WorkRoundedIcon,   ...tokens.type.Placement },
  Result:    { icon: SchoolRoundedIcon, ...tokens.type.Result },
  Event:     { icon: EventRoundedIcon,  ...tokens.type.Event },
};

const resolveField = (obj, ...keys) => {
  for (const k of keys) if (obj?.[k] != null) return obj[k];
  return null;
};

const formatDate = (raw) => {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d) ? null : new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(d);
};

const deadlineInfo = (raw) => {
  if (!raw) return null;
  const days = Math.ceil((new Date(raw) - Date.now()) / 86_400_000);
  if (days < 0)  return { label: 'Deadline passed', ...tokens.urgency.critical };
  if (days === 0) return { label: 'Due today!', ...tokens.urgency.critical };
  if (days <= 3) return { label: `${days} day${days > 1 ? 's' : ''} left`, ...tokens.urgency.critical };
  if (days <= 7) return { label: `${days} days left`, ...tokens.urgency.warning };
  return { label: `Due ${formatDate(raw)}`, ...tokens.urgency.safe };
};

// ── Meta row component ─────────────────────────────────────────────────────────
const MetaRow = ({ icon: Icon, label, value, color }) => (
  <Box display="flex" alignItems="flex-start" gap={1.25} py={1.1}
    sx={{ borderBottom: `1px solid ${tokens.line.hairline}`, '&:last-child': { borderBottom: 'none' } }}>
    <Box sx={{ width: 30, height: 30, borderRadius: '8px', background: tokens.bg.raised, border: `1px solid ${tokens.line.subtle}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon sx={{ fontSize: 15, color: color ?? tokens.text.tertiary }} />
    </Box>
    <Box>
      <Typography variant="caption" sx={{ display: 'block', mb: 0.2, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: tokens.text.tertiary, fontSize: '0.6rem' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: tokens.text.primary, fontWeight: 500, lineHeight: 1.45 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

// ── Main component ─────────────────────────────────────────────────────────────
const NotificationDetailDrawer = memo(({
  notification,
  open,
  onClose,
  isRead,
  isBookmarked,
  onMarkRead,
  onToggleBookmark,
}) => {
  if (!notification) return null;

  const rawType  = resolveField(notification, 'type', 'notificationType') ?? 'Event';
  const cfg      = TYPE_CONFIG[rawType] ?? TYPE_CONFIG.Event;
  const TypeIcon = cfg.icon;

  const id          = resolveField(notification, 'id', '_id', 'notificationId');
  const title       = resolveField(notification, 'title', 'subject') ?? 'Untitled';
  const message     = resolveField(notification, 'message', 'description', 'body') ?? '';
  const company     = notification.company ?? notification.organizer;
  const location    = notification.location;
  const eligibility = notification.eligibility;
  const ctc         = notification.ctc;
  const prize       = notification.prize;
  const tags        = notification.tags ?? [];
  const deadline    = notification.deadline;
  const actionLabel = notification.actionLabel ?? 'View Details';
  const createdAt   = resolveField(notification, 'createdAt', 'timestamp', 'created_at');

  const dl = deadlineInfo(deadline);

  const handleMarkRead = useCallback(() => {
    if (!isRead && onMarkRead) onMarkRead(id);
  }, [id, isRead, onMarkRead]);

  const handleBookmark = useCallback(() => {
    if (onToggleBookmark) onToggleBookmark(id);
  }, [id, onToggleBookmark]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 460 },
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* ── Coloured header ── */}
      <Box sx={{
        background: `linear-gradient(135deg, ${cfg.bg} 0%, ${alpha(cfg.main, 0.06)} 100%)`,
        borderBottom: `2px solid ${alpha(cfg.main, 0.15)}`,
        p: 2.5,
        flexShrink: 0,
      }}>
        {/* Top row: type icon + close */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1.25}>
            <Box sx={{
              width: 40, height: 40, borderRadius: '11px',
              background: alpha(cfg.main, 0.12),
              border: `1.5px solid ${alpha(cfg.main, 0.3)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <TypeIcon sx={{ fontSize: 21, color: cfg.main }} />
            </Box>
            <Box>
              <Chip label={rawType} size="small" sx={{
                background: alpha(cfg.main, 0.1), color: cfg.text ?? cfg.main,
                border: `1px solid ${alpha(cfg.main, 0.25)}`,
                fontWeight: 700, fontSize: '0.68rem', height: 20,
              }} />
              {notification.isNew && (
                <Chip label="NEW" size="small" sx={{
                  ml: 0.5, background: `linear-gradient(135deg, ${tokens.indigo[500]}, ${tokens.indigo[600]})`,
                  color: '#fff', fontWeight: 800, fontSize: '0.6rem', height: 18,
                }} />
              )}
            </Box>
          </Box>
          <IconButton size="small" onClick={onClose} sx={{ color: tokens.text.secondary, '&:hover': { background: 'rgba(0,0,0,0.06)' } }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Title */}
        <Typography variant="h3" sx={{ lineHeight: 1.3, mb: 0.75, color: tokens.text.primary, letterSpacing: '-0.02em' }}>
          {title}
        </Typography>

        {/* Posted date */}
        <Typography variant="caption">
          Posted {formatDate(createdAt) ?? 'Unknown date'}
        </Typography>

        {/* Deadline urgency */}
        {dl && (
          <Box mt={1.25}>
            <Chip
              icon={<CalendarTodayRoundedIcon sx={{ fontSize: '13px !important', color: `${dl.color} !important` }} />}
              label={`Deadline: ${dl.label}`}
              size="small"
              sx={{
                background: dl.bg, color: dl.color,
                border: `1px solid ${dl.ring}`,
                fontWeight: 700, height: 24, fontSize: '0.73rem',
              }}
            />
          </Box>
        )}
      </Box>

      {/* ── Scrollable body ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2 }}>
        {/* Message */}
        <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.75, color: tokens.text.secondary, mb: 2.5 }}>
          {message}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Metadata */}
        <Typography variant="h6" sx={{ mb: 1 }}>Details</Typography>
        <Box sx={{ borderRadius: '10px', border: `1px solid ${tokens.line.subtle}`, overflow: 'hidden', mb: 2.5 }}>
          {company && <MetaRow icon={BusinessRoundedIcon} label="Company / Organizer" value={company} color={cfg.main} />}
          {location && <MetaRow icon={LocationOnRoundedIcon} label="Location / Mode" value={location} color={tokens.indigo[500]} />}
          {eligibility && <MetaRow icon={PeopleRoundedIcon} label="Eligibility" value={eligibility} color={tokens.type.Event.main} />}
          {(ctc || prize) && (
            <MetaRow
              icon={MonetizationOnRoundedIcon}
              label={ctc ? 'CTC / Stipend' : 'Prize / Benefit'}
              value={ctc ?? prize}
              color={tokens.type.Placement.main}
            />
          )}
        </Box>

        {/* Tags */}
        {tags.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 1 }}>Skills & Tags</Typography>
            <Box display="flex" gap={0.75} flexWrap="wrap" mb={2.5}>
              {tags.map((tag) => (
                <Chip
                  key={tag}
                  icon={<TagRoundedIcon sx={{ fontSize: '12px !important', color: `${tokens.indigo[500]} !important` }} />}
                  label={tag}
                  size="small"
                  sx={{
                    background: tokens.indigo[50],
                    color: tokens.indigo[700],
                    border: `1px solid ${tokens.indigo[100]}`,
                    fontWeight: 600, height: 26,
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* ── Footer actions ── */}
      <Box sx={{
        px: 2.5, py: 2, flexShrink: 0,
        borderTop: `1px solid ${tokens.line.subtle}`,
        background: tokens.bg.raised,
        display: 'flex', gap: 1, alignItems: 'center',
      }}>
        <Button
          variant="contained"
          size="medium"
          endIcon={<OpenInNewRoundedIcon sx={{ fontSize: '15px !important' }} />}
          href={notification.actionUrl ?? '#'}
          target="_blank"
          sx={{ flex: 1, fontWeight: 700 }}
        >
          {actionLabel}
        </Button>

        <Tooltip title={isBookmarked ? 'Remove bookmark' : 'Bookmark'} arrow>
          <IconButton
            onClick={handleBookmark}
            sx={{
              color: isBookmarked ? tokens.indigo[500] : tokens.text.tertiary,
              background: isBookmarked ? tokens.indigo[50] : 'transparent',
              border: `1px solid ${isBookmarked ? tokens.indigo[200] : tokens.line.subtle}`,
              borderRadius: '8px', width: 40, height: 40,
              '&:hover': { background: tokens.indigo[50], color: tokens.indigo[500], borderColor: tokens.indigo[200] },
            }}
          >
            {isBookmarked ? <BookmarkRoundedIcon fontSize="small" /> : <BookmarkBorderRoundedIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        {!isRead && (
          <Tooltip title="Mark as read" arrow>
            <IconButton
              onClick={handleMarkRead}
              sx={{
                color: cfg.main, background: cfg.bg,
                border: `1px solid ${alpha(cfg.main, 0.2)}`,
                borderRadius: '8px', width: 40, height: 40,
                '&:hover': { background: alpha(cfg.main, 0.15) },
              }}
            >
              <CheckCircleRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Drawer>
  );
});

NotificationDetailDrawer.displayName = 'NotificationDetailDrawer';
export default NotificationDetailDrawer;
