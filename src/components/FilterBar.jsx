/**
 * FilterBar — colorful type filter chips with counts.
 */

import React, { memo } from 'react';
import { Box, Chip, Typography, alpha } from '@mui/material';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import { tokens } from '../theme';

const FILTER_OPTIONS = [
  { value: 'All',       label: 'All',       icon: AppsRoundedIcon,    color: tokens.indigo[500], bg: tokens.indigo[50],            ring: tokens.indigo[200]            },
  { value: 'Placement', label: 'Placement', icon: WorkRoundedIcon,    color: tokens.type.Placement.main, bg: tokens.type.Placement.bg, ring: alpha(tokens.type.Placement.main, 0.25) },
  { value: 'Result',    label: 'Result',    icon: SchoolRoundedIcon,  color: tokens.type.Result.main,    bg: tokens.type.Result.bg,    ring: alpha(tokens.type.Result.main, 0.25)    },
  { value: 'Event',     label: 'Event',     icon: EventRoundedIcon,   color: tokens.type.Event.main,     bg: tokens.type.Event.bg,     ring: alpha(tokens.type.Event.main, 0.25)     },
];

const FilterBar = memo(({ active, onChange, counts = {} }) => (
  <Box sx={{
    display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap',
    px: 1.5, py: 1.25, borderRadius: '10px',
    background: tokens.bg.surface,
    border: `1px solid ${tokens.line.subtle}`,
    boxShadow: tokens.shadow.xs,
  }}>
    <Typography variant="overline" sx={{ mr: 0.5 }}>Filter by</Typography>

    {FILTER_OPTIONS.map(({ value, label, icon: Icon, color, bg, ring }) => {
      const isActive = active === value;
      const count    = value !== 'All' ? counts[value] : undefined;

      return (
        <Chip
          key={value}
          icon={<Icon sx={{ fontSize: '15px !important', color: `${isActive ? color : tokens.text.tertiary} !important`, transition: 'color 0.18s' }} />}
          label={
            <Box component="span" display="flex" alignItems="center" gap={0.5}>
              {label}
              {count != null && (
                <Box component="span" sx={{
                  px: 0.65, borderRadius: '4px',
                  background: isActive ? alpha(color, 0.18) : tokens.line.hairline,
                  color: isActive ? color : tokens.text.tertiary,
                  fontSize: '0.62rem', fontWeight: 700, lineHeight: 1.6,
                  transition: 'all 0.18s',
                }}>
                  {count}
                </Box>
              )}
            </Box>
          }
          onClick={() => onChange(value)}
          sx={{
            height: 34, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
            letterSpacing: '-0.01em', transition: 'all 0.18s ease',
            background: isActive ? bg : tokens.bg.raised,
            color: isActive ? color : tokens.text.secondary,
            border: `1.5px solid ${isActive ? ring : tokens.line.subtle}`,
            boxShadow: isActive ? `0 0 0 2px ${alpha(color, 0.12)}` : 'none',
            '& .MuiChip-icon': { ml: 0.75 },
            '&:hover': { background: bg, color, borderColor: ring },
          }}
        />
      );
    })}
  </Box>
));

FilterBar.displayName = 'FilterBar';
export default FilterBar;
