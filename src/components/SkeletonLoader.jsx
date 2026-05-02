/**
 * SkeletonLoader — light-theme skeleton matching the new card layout.
 */

import React, { memo } from 'react';
import { Grid, Card, CardContent, Box, Skeleton } from '@mui/material';
import { tokens } from '../theme';

const SkeletonCard = () => (
  <Card>
    {/* Top accent bar */}
    <Box sx={{ height: 3, background: `linear-gradient(90deg, ${tokens.line.subtle}, ${tokens.line.hairline})` }} />
    <CardContent sx={{ pt: 2.5, pb: 2, px: 2.5, '&:last-child': { pb: 2 } }}>
      <Box display="flex" gap={1.5} alignItems="flex-start">
        <Skeleton variant="rounded" width={42} height={42} sx={{ borderRadius: '11px', flexShrink: 0 }} />
        <Box flex={1}>
          <Box display="flex" gap={1} mb={0.5} alignItems="center">
            <Skeleton variant="text" sx={{ flex: 1, height: 22 }} />
            <Skeleton variant="rounded" width={68} height={20} sx={{ borderRadius: '6px' }} />
          </Box>
          <Box display="flex" gap={1} mb={1.25}>
            <Skeleton variant="text" width={80} height={14} />
            <Skeleton variant="text" width={50} height={14} />
          </Box>
          <Skeleton variant="text" height={15} />
          <Skeleton variant="text" height={15} sx={{ mb: 1 }} />
          <Box display="flex" gap={0.75}>
            <Skeleton variant="rounded" width={80} height={22} sx={{ borderRadius: '6px' }} />
            <Skeleton variant="rounded" width={100} height={22} sx={{ borderRadius: '6px' }} />
            <Skeleton variant="rounded" width={60} height={22} sx={{ borderRadius: '6px' }} />
          </Box>
        </Box>
        <Skeleton variant="rounded" width={30} height={30} sx={{ borderRadius: '8px', flexShrink: 0 }} />
      </Box>
    </CardContent>
  </Card>
);

const SkeletonLoader = memo(({ count = 6 }) => (
  <Grid container spacing={2}>
    {Array.from({ length: count }, (_, i) => (
      <Grid item xs={12} key={i}>
        <SkeletonCard />
      </Grid>
    ))}
  </Grid>
));

SkeletonLoader.displayName = 'SkeletonLoader';
export default SkeletonLoader;
