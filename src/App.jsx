/**
 * App.jsx — PingHub root with unread notification state passed to Navbar.
 */

import React, { lazy, Suspense, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  ThemeProvider, CssBaseline, Box, Toolbar,
  useMediaQuery, useTheme as useMuiTheme,
} from '@mui/material';
import theme from './theme';
import Navbar, { SIDEBAR_WIDTH } from './components/Navbar';
import SkeletonLoader from './components/SkeletonLoader';
import { useAllNotifications, useReadTracker, useBookmarkTracker } from './hooks/useNotifications';
import logger from './utils/logger';

const AllNotifications = lazy(() => import('./pages/AllNotifications'));
const PriorityInbox    = lazy(() => import('./pages/PriorityInbox'));
const FilterPage       = lazy(() => import('./pages/FilterPage'));

const PageLoader = () => (
  <Box sx={{ p: 3 }}>
    <SkeletonLoader count={5} />
  </Box>
);

// Inner component that has access to Router context
const AppInner = () => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const { all }                          = useAllNotifications();
  const { isRead, markRead, markAllRead } = useReadTracker();
  const { isBookmarked, toggleBookmark } = useBookmarkTracker();

  // Derive unread notifications list for the bell
  const unreadNotifications = useMemo(
    () => all.filter((n) => !isRead(n.id ?? n._id ?? n.notificationId)),
    [all, isRead]
  );

  logger.debug('AppInner render', 'App', { unread: unreadNotifications.length, isMobile });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar
        unreadNotifications={unreadNotifications}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
      />

      <Box
        component="main"
        sx={{
          flex: 1,
          ml: isMobile ? 0 : `${SIDEBAR_WIDTH}px`,
          mb: isMobile ? '60px' : 0,
          minHeight: '100vh',
          transition: 'margin 0.25s ease',
        }}
      >
        <Toolbar sx={{ minHeight: '56px !important' }} />

        <Box sx={{
          maxWidth: 860,
          mx: 'auto',
          px: { xs: 2, sm: 3, md: 3.5 },
          py: { xs: 2.5, md: 3.5 },
        }}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/"         element={<AllNotifications />} />
              <Route path="/priority" element={<PriorityInbox />} />
              <Route path="/filter"   element={<FilterPage />} />
              <Route path="*"         element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
};

const App = () => {
  logger.info('PingHub initialising', 'App');
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
