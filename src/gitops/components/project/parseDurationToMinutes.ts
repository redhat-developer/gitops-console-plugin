/** Max length for sync-window duration parse/sort. Real values are tiny (e.g. 1h, 2h30m). */
export const MAX_SYNC_WINDOW_DURATION_LENGTH = 64;

/** One or more bounded number+unit segments (e.g. 1h, 2h30m). Length-capped to avoid ReDoS. */
const SYNC_WINDOW_DURATION_PATTERN = /^(\d{1,9}[hms])+$/i;

/** Parse Argo CD sync-window duration to minutes. Empty → 0; invalid/overlong → NaN. */
export const parseDurationToMinutes = (duration: string): number => {
  if (!duration) {
    return 0;
  }
  if (duration.length > MAX_SYNC_WINDOW_DURATION_LENGTH) {
    return Number.NaN;
  }
  if (!SYNC_WINDOW_DURATION_PATTERN.test(duration)) {
    return Number.NaN;
  }

  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  const re = /(\d{1,9})([hms])/gi;
  let match: RegExpExecArray | null;
  while ((match = re.exec(duration)) !== null) {
    const value = parseInt(match[1], 10);
    switch (match[2].toLowerCase()) {
      case 'h':
        hours += value;
        break;
      case 'm':
        minutes += value;
        break;
      case 's':
        seconds += value;
        break;
      default:
        break;
    }
  }

  return hours * 60 + minutes + seconds / 60;
};

export const isValidSyncWindowDuration = (duration?: string): boolean => {
  if (!duration) {
    return true;
  }
  return !Number.isNaN(parseDurationToMinutes(duration));
};

/**
 * Ascending compare for sync-window durations.
 * Valid pairs: numeric. Invalid pairs: lexical. Invalids always after valids (to avoid mixed cycles).
 */
export const compareSyncWindowDurations = (a: string, b: string): number => {
  const aMinutes = parseDurationToMinutes(a);
  const bMinutes = parseDurationToMinutes(b);
  const aInvalid = Number.isNaN(aMinutes);
  const bInvalid = Number.isNaN(bMinutes);

  if (aInvalid && bInvalid) {
    return a.localeCompare(b);
  }
  if (aInvalid) {
    return 1;
  }
  if (bInvalid) {
    return -1;
  }
  if (aMinutes < bMinutes) {
    return -1;
  }
  if (aMinutes > bMinutes) {
    return 1;
  }
  return 0;
};
