/**
 * Structured logging middleware for CampusNotify.
 * Replaces all console.log calls with leveled, formatted output.
 * Format: { timestamp, level, message, module, data? }
 */

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

const STYLES = {
  INFO: 'color: #6366F1; font-weight: 600',
  WARN: 'color: #F59E0B; font-weight: 600',
  ERROR: 'color: #EF4444; font-weight: 600',
  DEBUG: 'color: #94A3B8; font-weight: 400',
};

const buildEntry = (level, message, module, data) => ({
  timestamp: new Date().toISOString(),
  level,
  message,
  module,
  ...(data !== undefined && { data }),
});

const emit = (level, message, module, data) => {
  const entry = buildEntry(level, message, module, data);
  const prefix = `[CampusNotify][${entry.timestamp}][${level}][${module}]`;

  if (level === LOG_LEVELS.ERROR) {
    console.error(`%c${prefix}`, STYLES[level], message, data ?? '');
  } else if (level === LOG_LEVELS.WARN) {
    console.warn(`%c${prefix}`, STYLES[level], message, data ?? '');
  } else {
    console.info(`%c${prefix}`, STYLES[level], message, data ?? '');
  }

  return entry;
};

const logger = {
  info: (message, module = 'App', data) =>
    emit(LOG_LEVELS.INFO, message, module, data),

  warn: (message, module = 'App', data) =>
    emit(LOG_LEVELS.WARN, message, module, data),

  error: (message, module = 'App', data) =>
    emit(LOG_LEVELS.ERROR, message, module, data),

  debug: (message, module = 'App', data) =>
    emit(LOG_LEVELS.DEBUG, message, module, data),
};

export default logger;
