/**
 * ErrorBanner — light theme error state with HTTP-status-aware messaging.
 */

import React, { memo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

const getMessage = (error) => {
  const s = error?.response?.status;
  if (s === 401) return 'This endpoint requires authentication. Provide valid credentials to load live notifications.';
  if (s === 403) return 'Access denied — your account does not have permission to view this data.';
  if (s === 404) return 'The notifications endpoint could not be found.';
  if (s === 429) return 'Rate limit reached. Please wait a moment before retrying.';
  if (s >= 500)  return 'The server ran into an issue. Please try again in a moment.';
  return error?.message ?? 'Something went wrong while loading notifications.';
};

const ErrorBanner = memo(({ error, onRetry }) => (
  <Box sx={{
    p: 2.5, borderRadius: '12px',
    background: '#FEF2F2', border: '1.5px solid #FECACA',
  }}>
    <Box display="flex" gap={1.75} alignItems="flex-start">
      <Box sx={{
        width: 36, height: 36, borderRadius: '9px',
        background: '#FEE2E2', border: '1px solid #FECACA',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <ErrorOutlineRoundedIcon sx={{ color: '#DC2626', fontSize: 18 }} />
      </Box>
      <Box flex={1}>
        <Typography variant="h5" sx={{ color: '#991B1B', mb: 0.4 }}>
          {error?.response?.status ? `Error ${error.response.status}` : 'Connection Error'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#B91C1C', lineHeight: 1.65, mb: onRetry ? 1.75 : 0 }}>
          {getMessage(error)}
        </Typography>
        {onRetry && (
          <Button variant="outlined" size="small"
            startIcon={<RefreshRoundedIcon sx={{ fontSize: '15px !important' }} />}
            onClick={onRetry}
            sx={{ color: '#DC2626', borderColor: '#FECACA', fontSize: '0.8rem', fontWeight: 600, px: 1.5, '&:hover': { borderColor: '#DC2626', background: '#FEE2E2' } }}>
            Retry
          </Button>
        )}
      </Box>
    </Box>
  </Box>
));

ErrorBanner.displayName = 'ErrorBanner';
export default ErrorBanner;
