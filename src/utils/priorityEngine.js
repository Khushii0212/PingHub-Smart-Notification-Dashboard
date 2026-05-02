/**
 * Priority Engine — computes a composite priority score for each notification.
 *
 * Score formula:
 *   priorityScore = (typeWeight * 1_000_000) + recencyScore
 *
 * Type weights:
 *   Placement → 3 (highest)
 *   Result    → 2
 *   Event     → 1 (lowest)
 *
 * Recency score:
 *   Normalized millisecond timestamp so newer items score higher.
 *   Capped to 999_999 so type weight always dominates across same-type comparison.
 */

import logger from './logger';

const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

const MODULE = 'PriorityEngine';

/**
 * Derives the type weight. Falls back to 0 for unknown types.
 */
const getTypeWeight = (type) => {
  const weight = TYPE_WEIGHTS[type];
  if (weight === undefined) {
    logger.warn(`Unknown notification type "${type}" — defaulting weight to 0`, MODULE);
    return 0;
  }
  return weight;
};

/**
 * Normalises an array of timestamps to a 0–999_999 scale.
 * The most recent timestamp gets the highest score.
 */
const buildRecencyScores = (notifications) => {
  const timestamps = notifications.map((n) =>
    new Date(n.createdAt ?? n.timestamp ?? n.created_at ?? 0).getTime()
  );

  const min = Math.min(...timestamps);
  const max = Math.max(...timestamps);
  const range = max - min || 1; // avoid division by zero

  return notifications.map((n) => {
    const ts = new Date(n.createdAt ?? n.timestamp ?? n.created_at ?? 0).getTime();
    return Math.round(((ts - min) / range) * 999_999);
  });
};

/**
 * Attaches a `priorityScore` field to each notification and returns them
 * sorted from highest to lowest score.
 *
 * @param {Array} notifications - Raw notification objects from the API
 * @returns {Array} Scored and sorted notifications
 */
export const computePriorityScores = (notifications) => {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    logger.warn('computePriorityScores received empty or invalid input', MODULE);
    return [];
  }

  logger.info(`Computing priority scores for ${notifications.length} notifications`, MODULE);

  const recencyScores = buildRecencyScores(notifications);

  const scored = notifications.map((notification, idx) => {
    const typeWeight = getTypeWeight(notification.type ?? notification.notificationType);
    const recency = recencyScores[idx];
    const priorityScore = typeWeight * 1_000_000 + recency;

    return { ...notification, priorityScore };
  });

  const sorted = scored.sort((a, b) => b.priorityScore - a.priorityScore);

  logger.info('Priority scoring complete', MODULE, {
    total: sorted.length,
    topScore: sorted[0]?.priorityScore,
    topType: sorted[0]?.type ?? sorted[0]?.notificationType,
  });

  return sorted;
};

/**
 * Returns only the top N notifications by priority.
 *
 * @param {Array} notifications - Raw notification objects
 * @param {number} topN - How many to return (default 10)
 */
export const getTopNByPriority = (notifications, topN = 10) => {
  const scored = computePriorityScores(notifications);
  logger.info(`Slicing top ${topN} from ${scored.length} scored notifications`, MODULE);
  return scored.slice(0, topN);
};
