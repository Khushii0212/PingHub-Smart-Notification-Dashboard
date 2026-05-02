/**
 * EmptyState — cheerful empty state with icon and message.
 */

import React, { memo } from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import { tokens } from '../theme';

const EmptyState = memo(({ title = 'Nothing here', message = 'No notifications found.', onRefresh, actionLabel = 'Retry' }) => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={10} gap={2}>
    <Box sx={{
      width: 68, height: 68, borderRadius: '18px',
      background: `linear-gradient(135deg, ${tokens.indigo[50]}, ${tokens.indigo[100]})`,
      border: `1.5px solid ${tokens.indigo[200]}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: tokens.shadow.md,
    }}>
      <InboxRoundedIcon sx={{ fontSize: 32, color: tokens.indigo[400] }} />
    </Box>
    <Box textAlign="center">
      <Typography variant="h3" sx={{ mb: 0.75, letterSpacing: '-0.02em' }}>{title}</Typography>
      <Typography variant="body2" sx={{ maxWidth: 280, mx: 'auto', lineHeight: 1.7 }}>{message}</Typography>
    </Box>
    {onRefresh && (
      <Button variant="contained" color="primary" onClick={onRefresh} sx={{ mt: 0.5, px: 3 }}>
        {actionLabel}
      </Button>
    )}
  </Box>
));

EmptyState.displayName = 'EmptyState';
export default EmptyState;
