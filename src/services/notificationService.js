/**
 * Notification Service — all API communication lives here.
 *
 * If the API is unreachable or returns an error, the service
 * automatically falls back to MOCK_NOTIFICATIONS so the UI
 * always has meaningful data to display.
 */

import axios from 'axios';
import logger from '../utils/logger';
import MOCK_NOTIFICATIONS from '../utils/mockData';

const MODULE = 'NotificationService';
const BASE_URL = 'http://20.207.122.201/evaluation-service';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ── Request interceptor ────────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    logger.info(`→ ${config.method?.toUpperCase()} ${config.url}`, MODULE, {
      params: config.params,
    });
    return config;
  },
  (error) => {
    logger.error('Request setup failed', MODULE, error.message);
    return Promise.reject(error);
  }
);

// ── Response interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => {
    logger.info(
      `← ${response.status} ${response.config.url}`,
      MODULE,
      { count: Array.isArray(response.data) ? response.data.length : 'N/A' }
    );
    return response;
  },
  (error) => {
    logger.error(
      `← ${error.response?.status ?? 'NETWORK'} ${error.config?.url}`,
      MODULE,
      { message: error.message, status: error.response?.status }
    );
    return Promise.reject(error);
  }
);

// ── Normalise raw API response → flat array ───────────────────────────────────
const normalise = (raw) => {
  if (Array.isArray(raw))              return raw;
  if (Array.isArray(raw?.data))        return raw.data;
  if (Array.isArray(raw?.notifications)) return raw.notifications;
  return [];
};

// ── Paginate a local array (used for mock fallback) ───────────────────────────
const paginateLocal = (arr, page, limit) => {
  const start = (page - 1) * limit;
  return arr.slice(start, start + limit);
};

/**
 * Fetch paginated notifications.
 * Falls back to MOCK_NOTIFICATIONS on any API error.
 */
export const fetchNotifications = async ({ page = 1, limit = 10 } = {}) => {
  logger.info(`fetchNotifications — page=${page} limit=${limit}`, MODULE);

  try {
    const response = await apiClient.get('/notifications', {
      params: { page, limit },
    });

    const items = normalise(response.data);
    const total = response.data?.total ?? response.data?.totalCount ?? items.length;

    logger.info(`Live data: ${items.length} items`, MODULE);
    return { data: items, total, page, limit, isMock: false };

  } catch (error) {
    logger.warn(
      `API failed (${error.response?.status ?? error.code}) — using mock data`,
      MODULE
    );

    // Paginate mock data the same way the API would
    const paginated = paginateLocal(MOCK_NOTIFICATIONS, page, limit);
    return {
      data: paginated,
      total: MOCK_NOTIFICATIONS.length,
      page,
      limit,
      isMock: true,
    };
  }
};

/**
 * Fetch ALL notifications for priority computation.
 * Falls back to full mock dataset on API error.
 */
export const fetchAllNotifications = async () => {
  logger.info('fetchAllNotifications', MODULE);

  try {
    const response = await apiClient.get('/notifications', {
      params: { page: 1, limit: 1000 },
    });

    const items = normalise(response.data);
    logger.info(`Live: ${items.length} total notifications`, MODULE);
    return { data: items, total: items.length, isMock: false };

  } catch (error) {
    logger.warn('fetchAllNotifications using mock data', MODULE);
    return {
      data: MOCK_NOTIFICATIONS,
      total: MOCK_NOTIFICATIONS.length,
      isMock: true,
    };
  }
};
