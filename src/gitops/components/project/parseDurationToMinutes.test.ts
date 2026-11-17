import {
  compareSyncWindowDurations,
  isValidSyncWindowDuration,
  MAX_SYNC_WINDOW_DURATION_LENGTH,
  parseDurationToMinutes,
} from './parseDurationToMinutes';

describe('parseDurationToMinutes', () => {
  it('parses common Argo CD sync-window durations', () => {
    expect(parseDurationToMinutes('')).toBe(0);
    expect(parseDurationToMinutes('1h')).toBe(60);
    expect(parseDurationToMinutes('30m')).toBe(30);
    expect(parseDurationToMinutes('90s')).toBe(1.5);
    expect(parseDurationToMinutes('2h30m')).toBe(150);
    expect(parseDurationToMinutes('1h30m45s')).toBe(90.75);
    expect(parseDurationToMinutes('24h')).toBe(1440);
  });

  it('is case-insensitive for unit suffixes', () => {
    expect(parseDurationToMinutes('1H')).toBe(60);
    expect(parseDurationToMinutes('30M')).toBe(30);
    expect(parseDurationToMinutes('90S')).toBe(1.5);
  });

  it('returns NaN for malformed or unsupported durations', () => {
    expect(parseDurationToMinutes('garbage')).toBeNaN();
    expect(parseDurationToMinutes('1d')).toBeNaN();
    expect(parseDurationToMinutes('xyz')).toBeNaN();
    expect(parseDurationToMinutes('1111')).toBeNaN();
    expect(parseDurationToMinutes('1h 30m')).toBeNaN();
    expect(isValidSyncWindowDuration('1d')).toBe(false);
    expect(isValidSyncWindowDuration('garbage')).toBe(false);
  });

  it('returns NaN for overlong durations instead of matching', () => {
    const overlong = `${'1'.repeat(MAX_SYNC_WINDOW_DURATION_LENGTH + 1)}h`;
    expect(parseDurationToMinutes(overlong)).toBeNaN();
    expect(isValidSyncWindowDuration(overlong)).toBe(false);
  });

  it('parses a 65536-character digit-only duration in under 100ms (ReDoS regression)', () => {
    const hostile = '1'.repeat(65536);
    const start = Date.now();
    const result = parseDurationToMinutes(hostile);
    const elapsed = Date.now() - start;

    expect(result).toBeNaN();
    expect(elapsed).toBeLessThan(100);
  });

  it('treats empty / missing duration as valid for display', () => {
    expect(isValidSyncWindowDuration(undefined)).toBe(true);
    expect(isValidSyncWindowDuration('')).toBe(true);
    expect(isValidSyncWindowDuration('1h')).toBe(true);
    expect(isValidSyncWindowDuration('2h30m')).toBe(true);
  });
});

describe('compareSyncWindowDurations', () => {
  it('orders valid durations numerically', () => {
    expect(compareSyncWindowDurations('90m', '2h')).toBeLessThan(0);
    expect(compareSyncWindowDurations('2h', '90m')).toBeGreaterThan(0);
    expect(compareSyncWindowDurations('1h', '60m')).toBe(0);
  });

  it('treats invalid durations as equal', () => {
    expect(compareSyncWindowDurations('3x', 'garbage')).toBe(0);
    expect(compareSyncWindowDurations('garbage', '3x')).toBe(0);
  });

  it('sorts invalid durations after all valid ones', () => {
    // Keep invalids after valids. Mixing numeric + lexical compare is not
    // transitive (e.g. 90m < 2h < 3x < 90m) and makes Array.sort unstable.
    expect(compareSyncWindowDurations('90m', '2h')).toBeLessThan(0);
    expect(compareSyncWindowDurations('2h', '3x')).toBeLessThan(0);
    expect(compareSyncWindowDurations('3x', '90m')).toBeGreaterThan(0);

    const mixed = ['3x', '90m', '2h', 'garbage'];
    const sorted = [...mixed].sort(compareSyncWindowDurations);
    expect(sorted.slice(0, 2)).toEqual(['90m', '2h']);
    expect(sorted.slice(2).sort()).toEqual(['3x', 'garbage'].sort());
  });

  it('is a total order over mixed valid and invalid values', () => {
    const values = ['1h', '2h', '90m', '30m', '0s', '', '3x', 'garbage', '1d', '1111'];
    const violations: string[] = [];

    for (const a of values) {
      for (const b of values) {
        if (
          Math.sign(compareSyncWindowDurations(a, b)) !==
          -Math.sign(compareSyncWindowDurations(b, a))
        ) {
          violations.push(`antisymmetry: ${a} vs ${b}`);
        }
        for (const c of values) {
          if (
            compareSyncWindowDurations(a, b) <= 0 &&
            compareSyncWindowDurations(b, c) <= 0 &&
            compareSyncWindowDurations(a, c) > 0
          ) {
            violations.push(`transitivity: ${a} <= ${b} <= ${c} but ${a} > ${c}`);
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
