/**
 * SearchBar — live keyword search with clear button and keyboard shortcut hint.
 */

import React, { memo, useRef } from 'react';
import { Box, InputBase, IconButton, Typography, alpha } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { tokens } from '../theme';

const SearchBar = memo(({ value, onChange, placeholder = 'Search notifications…', resultCount }) => {
  const inputRef = useRef(null);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 1.5,
        py: 0.9,
        borderRadius: '10px',
        background: tokens.bg.surface,
        border: `1.5px solid ${value ? tokens.indigo[200] : tokens.line.subtle}`,
        boxShadow: value ? tokens.shadow.focus : tokens.shadow.xs,
        transition: 'all 0.2s ease',
        '&:focus-within': {
          borderColor: tokens.indigo[300],
          boxShadow: tokens.shadow.focus,
        },
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <SearchRoundedIcon sx={{ fontSize: 18, color: value ? tokens.indigo[500] : tokens.text.tertiary, flexShrink: 0, transition: 'color 0.18s' }} />

      <InputBase
        inputRef={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        fullWidth
        sx={{
          fontSize: '0.875rem',
          color: tokens.text.primary,
          '& ::placeholder': { color: tokens.text.tertiary },
        }}
      />

      {value && typeof resultCount === 'number' && (
        <Typography variant="caption" sx={{
          color: tokens.indigo[600], fontWeight: 700, whiteSpace: 'nowrap',
          background: tokens.indigo[50], px: 0.8, borderRadius: '5px',
          border: `1px solid ${tokens.indigo[100]}`,
        }}>
          {resultCount} result{resultCount !== 1 ? 's' : ''}
        </Typography>
      )}

      {value && (
        <IconButton size="small" onClick={() => onChange('')} sx={{ color: tokens.text.tertiary, p: 0.3, '&:hover': { color: tokens.text.secondary } }}>
          <CloseRoundedIcon sx={{ fontSize: 15 }} />
        </IconButton>
      )}
    </Box>
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;
