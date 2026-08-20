import { HealthStatus, SyncStatus } from '../../utils/constants';

import {
  APPLICATION_SYNC_UNKNOWN_FILTER_ID,
  filterApplicationsByStatus,
  getApplicationHealthStatus,
  getApplicationSyncFilterId,
  matchesApplicationHealthFilter,
  matchesApplicationSyncFilter,
  parseRowFilterParam,
} from './applicationListFilters';
import { paginateItems } from './DataView/gitOpsDataViewPagination';

const app = (name: string, health?: string, sync?: string, labels?: Record<string, string>) =>
  ({
    metadata: { name, labels },
    spec: { project: 'default' },
    status: {
      health: health ? { status: health } : undefined,
      sync: sync ? { status: sync } : undefined,
    },
  } as any);

describe('parseRowFilterParam', () => {
  it('splits Console rowFilter query values', () => {
    expect(parseRowFilterParam('Healthy,Degraded')).toEqual(['Healthy', 'Degraded']);
  });

  it('returns an empty list when unset', () => {
    expect(parseRowFilterParam(null)).toEqual([]);
    expect(parseRowFilterParam('')).toEqual([]);
  });
});

describe('application health filter', () => {
  it('treats missing health as Unknown', () => {
    expect(getApplicationHealthStatus(app('none'))).toBe(HealthStatus.UNKNOWN);
    expect(getApplicationHealthStatus(app('ok', HealthStatus.HEALTHY))).toBe(HealthStatus.HEALTHY);
  });

  it('passes all apps when nothing is selected', () => {
    expect(matchesApplicationHealthFilter([], app('missing', HealthStatus.MISSING))).toBe(true);
    expect(matchesApplicationHealthFilter(undefined, app('none'))).toBe(true);
  });

  it('keeps Healthy and Degraded and drops Missing', () => {
    const selected = [HealthStatus.HEALTHY, HealthStatus.DEGRADED];
    expect(matchesApplicationHealthFilter(selected, app('ok', HealthStatus.HEALTHY))).toBe(true);
    expect(matchesApplicationHealthFilter(selected, app('bad', HealthStatus.DEGRADED))).toBe(true);
    expect(matchesApplicationHealthFilter(selected, app('gone', HealthStatus.MISSING))).toBe(false);
    expect(matchesApplicationHealthFilter(selected, app('wait', HealthStatus.PROGRESSING))).toBe(
      false,
    );
  });

  it('does not keep apps with no health status when Healthy is selected', () => {
    expect(matchesApplicationHealthFilter([HealthStatus.HEALTHY], app('none'))).toBe(false);
  });

  it('filters a list to the selected health statuses', () => {
    const apps = [
      app('a', HealthStatus.HEALTHY),
      app('b', HealthStatus.MISSING),
      app('c', HealthStatus.PROGRESSING),
      app('d', HealthStatus.HEALTHY),
    ];
    expect(
      filterApplicationsByStatus(apps, [HealthStatus.HEALTHY, HealthStatus.DEGRADED], []),
    ).toHaveLength(2);
  });
});

describe('application sync filter', () => {
  it('maps missing and Unknown sync to the Unknown filter id', () => {
    expect(getApplicationSyncFilterId(app('none'))).toBe(APPLICATION_SYNC_UNKNOWN_FILTER_ID);
    expect(
      getApplicationSyncFilterId(app('unknown', HealthStatus.HEALTHY, SyncStatus.UNKNOWN)),
    ).toBe(APPLICATION_SYNC_UNKNOWN_FILTER_ID);
    expect(getApplicationSyncFilterId(app('ok', HealthStatus.HEALTHY, SyncStatus.SYNCED))).toBe(
      SyncStatus.SYNCED,
    );
  });

  it('does not keep unknown/missing sync when Synced is selected', () => {
    expect(
      matchesApplicationSyncFilter([SyncStatus.SYNCED], app('none', HealthStatus.HEALTHY)),
    ).toBe(false);
    expect(
      matchesApplicationSyncFilter(
        [SyncStatus.SYNCED],
        app('unknown', HealthStatus.HEALTHY, SyncStatus.UNKNOWN),
      ),
    ).toBe(false);
  });

  it('filters by sync independently of health', () => {
    const apps = [
      app('synced', HealthStatus.HEALTHY, SyncStatus.SYNCED),
      app('out', HealthStatus.HEALTHY, SyncStatus.OUT_OF_SYNC),
    ];
    expect(filterApplicationsByStatus(apps, [], [SyncStatus.SYNCED])).toHaveLength(1);
    expect(filterApplicationsByStatus(apps, [], [SyncStatus.SYNCED])[0].metadata.name).toBe(
      'synced',
    );
  });
});

describe('application list sort, filter, and pagination', () => {
  const apps = [
    app('zeta', HealthStatus.HEALTHY, SyncStatus.SYNCED, { app: 'guestbook' }),
    app('alpha', HealthStatus.MISSING, SyncStatus.OUT_OF_SYNC, { team: 'platform' }),
    app('beta', HealthStatus.HEALTHY, SyncStatus.SYNCED, { env: 'prod' }),
    app('gamma', HealthStatus.DEGRADED, SyncStatus.OUT_OF_SYNC),
    app('delta', HealthStatus.HEALTHY, SyncStatus.SYNCED, { app: 'demo' }),
  ];

  const byName = (items: { metadata: { name: string } }[]) =>
    [...items].sort((left, right) => left.metadata.name.localeCompare(right.metadata.name));

  it('sorts then filters by health, then paginates', () => {
    const sorted = byName(apps);
    expect(sorted.map((item) => item.metadata.name)).toEqual([
      'alpha',
      'beta',
      'delta',
      'gamma',
      'zeta',
    ]);

    const healthy = filterApplicationsByStatus(sorted, [HealthStatus.HEALTHY], []);
    expect(healthy.map((item) => item.metadata.name)).toEqual(['beta', 'delta', 'zeta']);

    expect(paginateItems(healthy, 1, 2).map((item) => item.metadata.name)).toEqual([
      'beta',
      'delta',
    ]);
    expect(paginateItems(healthy, 2, 2).map((item) => item.metadata.name)).toEqual(['zeta']);
  });

  it('applies health and sync together before paging', () => {
    const healthySynced = filterApplicationsByStatus(
      byName(apps),
      [HealthStatus.HEALTHY],
      [SyncStatus.SYNCED],
    );
    expect(healthySynced.map((item) => item.metadata.name)).toEqual(['beta', 'delta', 'zeta']);
    expect(paginateItems(healthySynced, 1, 2)).toHaveLength(2);
    expect(paginateItems(healthySynced, 1, 2)[0].metadata.name).toBe('beta');
  });
});
