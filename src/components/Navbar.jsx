/**
 * Navbar — light theme, PingHub branding.
 * Desktop: 240px left sidebar. Mobile: top bar + bottom nav.
 *
 * Quick-stat pills navigate to /filter?type=Placement etc.
 * Bell uses <NotificationBell> popover component.
 */

import React, { memo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, AppBar, Toolbar, IconButton, Tooltip,
  Divider, alpha, useMediaQuery, useTheme as useMuiTheme,
  BottomNavigation, BottomNavigationAction, Paper,
} from '@mui/material';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import NotificationBell from './NotificationBell';
import { tokens } from '../theme';

export const SIDEBAR_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'All Notifications', shortLabel: 'All',      path: '/',         icon: ViewListRoundedIcon, hint: 'Browse every campus alert'  },
  { label: 'Priority Inbox',    shortLabel: 'Priority',  path: '/priority', icon: StarRoundedIcon,     hint: 'Top-ranked by importance'    },
  { label: 'Filter',            shortLabel: 'Filter',    path: '/filter',   icon: TuneRoundedIcon,     hint: 'Browse by category'          },
];

const QUICK_STATS = [
  { label: 'Placement', color: tokens.type.Placement.main, bg: tokens.type.Placement.bg },
  { label: 'Result',    color: tokens.type.Result.main,    bg: tokens.type.Result.bg    },
  { label: 'Event',     color: tokens.type.Event.main,     bg: tokens.type.Event.bg     },
];

// ── Brand logo ─────────────────────────────────────────────────────────────────
const LogoMark = () => (
  <Box sx={{
    width: 36, height: 36, borderRadius: '10px', flexShrink: 0,
    background: `linear-gradient(145deg, ${tokens.indigo[500]}, ${tokens.indigo[700]})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: `0 4px 12px ${alpha(tokens.indigo[500], 0.4)}, inset 0 1px 0 rgba(255,255,255,0.2)`,
  }}>
    <NotificationsRoundedIcon sx={{ fontSize: 19, color: '#fff' }} />
  </Box>
);

// ── Sidebar content ────────────────────────────────────────────────────────────
const SidebarContent = ({ location, navigate, onClose }) => (
  <Box sx={{
    height: '100%', display: 'flex', flexDirection: 'column',
    background: tokens.bg.surface, borderRight: `1px solid ${tokens.line.subtle}`,
  }}>
    {/* Logo */}
    <Box sx={{ px: 2.5, pt: 3, pb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <LogoMark />
      <Box>
        <Typography variant="h4" sx={{ lineHeight: 1.15, letterSpacing: '-0.03em', color: tokens.text.primary }}>
          Ping<Box component="span" sx={{ color: tokens.indigo[500], fontStyle: 'italic' }}>Hub</Box>
        </Typography>
        <Typography variant="caption" sx={{ color: tokens.text.tertiary, fontSize: '0.63rem', fontWeight: 600, letterSpacing: '0.04em' }}>
          Smart Notification System
        </Typography>
      </Box>
    </Box>

    <Divider />

    {/* Nav links */}
    <List sx={{ px: 1.5, pt: 2, flex: 1 }} disablePadding>
      <Typography variant="h6" sx={{ px: 1.5, mb: 1.25 }}>Navigation</Typography>

      {NAV_ITEMS.map(({ label, path, icon: Icon, hint }) => {
        const isActive = location.pathname === path;
        return (
          <Tooltip key={path} title={hint} placement="right" arrow>
            <ListItemButton
              onClick={() => { navigate(path); onClose?.(); }}
              sx={{
                mb: 0.5, px: 1.5, py: 1, borderRadius: '9px', border: '1px solid transparent',
                background: isActive ? tokens.indigo[50] : 'transparent',
                borderColor: isActive ? tokens.indigo[200] : 'transparent',
                '&:hover': { background: tokens.indigo[50], borderColor: tokens.indigo[100] },
              }}
            >
              <ListItemIcon sx={{ minWidth: 34 }}>
                <Icon sx={{ fontSize: 19, color: isActive ? tokens.indigo[500] : tokens.text.tertiary, transition: 'color 0.18s' }} />
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? tokens.indigo[700] : tokens.text.secondary,
                }}
              />
              {isActive && (
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: tokens.indigo[500], flexShrink: 0 }} />
              )}
            </ListItemButton>
          </Tooltip>
        );
      })}
    </List>

    {/* Quick stats — clickable, navigate to /filter?type=X */}
    <Box sx={{ mx: 1.5, mb: 1.5, p: 1.5, borderRadius: '10px', background: tokens.indigo[50], border: `1px solid ${tokens.indigo[100]}` }}>
      <Typography variant="h6" sx={{ mb: 1, color: tokens.indigo[600] }}>Quick Filter</Typography>
      <Box display="flex" gap={0.75} flexWrap="wrap">
        {QUICK_STATS.map(({ label, color, bg }) => (
          <Tooltip key={label} title={`Filter by ${label}`} arrow>
            <Box
              component="button"
              onClick={() => { navigate(`/filter?type=${label}`); onClose?.(); }}
              sx={{
                px: 1.1, py: 0.5, borderRadius: '7px',
                background: bg, cursor: 'pointer',
                border: `1.5px solid ${alpha(color, 0.25)}`,
                outline: 'none',
                transition: 'all 0.18s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: `0 3px 8px ${alpha(color, 0.25)}`,
                  borderColor: alpha(color, 0.45),
                },
                '&:active': { transform: 'scale(0.97)' },
              }}
            >
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color, lineHeight: 1 }}>
                {label}
              </Typography>
            </Box>
          </Tooltip>
        ))}
      </Box>
      <Typography variant="caption" sx={{ mt: 1, display: 'block', color: tokens.text.tertiary }}>
        Tap to filter notifications by type
      </Typography>
    </Box>

    {/* Footer */}
    <Box sx={{ px: 2.5, py: 2, borderTop: `1px solid ${tokens.line.subtle}`, display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 0 2px #DCFCE7', flexShrink: 0 }} />
      <Typography variant="caption" sx={{ color: tokens.text.tertiary, fontSize: '0.67rem' }}>
        PingHub v1.0 · 2026
      </Typography>
    </Box>
  </Box>
);

// ── Main Navbar ────────────────────────────────────────────────────────────────
const Navbar = memo(({ unreadNotifications = [], onMarkRead, onMarkAllRead }) => {
  const navigate   = useNavigate();
  const location   = useLocation();
  const muiTheme   = useMuiTheme();
  const isMobile   = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const mobileVal  = NAV_ITEMS.findIndex((n) => n.path === location.pathname);
  const currentItem = NAV_ITEMS.find((n) => n.path === location.pathname);

  if (isMobile) {
    return (
      <>
        <AppBar position="fixed" elevation={0}>
          <Toolbar sx={{ minHeight: '56px !important', gap: 1.5 }}>
            <IconButton edge="start" size="small" onClick={() => setOpen(true)} sx={{ color: tokens.text.secondary }}>
              <MenuRoundedIcon />
            </IconButton>
            <Box display="flex" alignItems="center" gap={1} flex={1}>
              <Box sx={{ width: 26, height: 26, borderRadius: '7px', background: `linear-gradient(145deg, ${tokens.indigo[500]}, ${tokens.indigo[700]})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <NotificationsRoundedIcon sx={{ fontSize: 14, color: '#fff' }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.03em', fontSize: '0.95rem', color: tokens.text.primary }}>
                Ping<Box component="span" sx={{ color: tokens.indigo[500], fontStyle: 'italic' }}>Hub</Box>
              </Typography>
            </Box>
            <NotificationBell
              unreadNotifications={unreadNotifications}
              onMarkRead={onMarkRead}
              onMarkAllRead={onMarkAllRead}
            />
          </Toolbar>
        </AppBar>

        <Drawer variant="temporary" open={open} onClose={() => setOpen(false)} ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: SIDEBAR_WIDTH, border: 'none' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: tokens.text.secondary }}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
          <SidebarContent location={location} navigate={navigate} onClose={() => setOpen(false)} />
        </Drawer>

        <Paper elevation={0} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200, borderTop: `1px solid ${tokens.line.subtle}` }}>
          <BottomNavigation value={mobileVal} showLabels sx={{ background: tokens.bg.surface, height: 60 }}>
            {NAV_ITEMS.map(({ shortLabel, path, icon: Icon }) => (
              <BottomNavigationAction key={path} label={shortLabel} icon={<Icon sx={{ fontSize: 22 }} />} onClick={() => navigate(path)}
                sx={{ color: tokens.text.tertiary, '&.Mui-selected': { color: tokens.indigo[500] }, '& .MuiBottomNavigationAction-label': { fontSize: '0.65rem', fontWeight: 600 } }} />
            ))}
          </BottomNavigation>
        </Paper>

        <Toolbar sx={{ minHeight: '56px !important' }} />
      </>
    );
  }

  // ── Desktop ──────────────────────────────────────────────────────────────────
  return (
    <>
      <Drawer variant="permanent" PaperProps={{ sx: { width: SIDEBAR_WIDTH, border: 'none' } }}>
        <SidebarContent location={location} navigate={navigate} />
      </Drawer>

      <AppBar position="fixed" elevation={0} sx={{ left: SIDEBAR_WIDTH, width: `calc(100% - ${SIDEBAR_WIDTH}px)` }}>
        <Toolbar sx={{ gap: 2, minHeight: '56px !important' }}>
          <Box flex={1} minWidth={0}>
            <Typography variant="h4" sx={{ lineHeight: 1.2, letterSpacing: '-0.02em', color: tokens.text.primary }}>
              {currentItem?.label ?? 'Dashboard'}
            </Typography>
            <Typography variant="caption">{currentItem?.hint}</Typography>
          </Box>

          <NotificationBell
            unreadNotifications={unreadNotifications}
            onMarkRead={onMarkRead}
            onMarkAllRead={onMarkAllRead}
          />
        </Toolbar>
      </AppBar>
    </>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;
