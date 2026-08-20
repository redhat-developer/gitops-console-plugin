import { RowFilter } from '@openshift-console/dynamic-plugin-sdk';

import { ApplicationKind } from '../../models/ApplicationModel';
import { HealthStatus, SyncStatus } from '../../utils/constants';

export const APPLICATION_SYNC_FILTER_TYPE = 'app-sync';
export const APPLICATION_HEALTH_FILTER_TYPE = 'app-health';
export const APPLICATION_SYNC_FILTER_PARAM = `rowFilter-${APPLICATION_SYNC_FILTER_TYPE}`;
export const APPLICATION_HEALTH_FILTER_PARAM = `rowFilter-${APPLICATION_HEALTH_FILTER_TYPE}`;
export const APPLICATION_SYNC_UNKNOWN_FILTER_ID = `Sync.${SyncStatus.UNKNOWN}`;

export const getApplicationHealthStatus = (
  application: Pick<ApplicationKind, 'status'> | undefined,
): HealthStatus => (application?.status?.health?.status as HealthStatus) || HealthStatus.UNKNOWN;

export const getApplicationSyncFilterId = (
  application: Pick<ApplicationKind, 'status'> | undefined,
): string => {
  const status = application?.status?.sync?.status;
  if (!status || status === SyncStatus.UNKNOWN) {
    return APPLICATION_SYNC_UNKNOWN_FILTER_ID;
  }
  return status;
};

export const parseRowFilterParam = (value: string | null | undefined): string[] =>
  (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

export const matchesApplicationHealthFilter = (
  selected: string[] | undefined,
  application: Pick<ApplicationKind, 'status'> | undefined,
): boolean => {
  if (!selected?.length) {
    return true;
  }
  return selected.includes(getApplicationHealthStatus(application));
};

export const matchesApplicationSyncFilter = (
  selected: string[] | undefined,
  application: Pick<ApplicationKind, 'status'> | undefined,
): boolean => {
  if (!selected?.length) {
    return true;
  }
  return selected.includes(getApplicationSyncFilterId(application));
};

export const filterApplicationsByStatus = (
  applications: ApplicationKind[] | undefined,
  healthSelected: string[],
  syncSelected: string[],
): ApplicationKind[] =>
  (applications ?? []).filter(
    (application) =>
      matchesApplicationHealthFilter(healthSelected, application) &&
      matchesApplicationSyncFilter(syncSelected, application),
  );

export const getApplicationRowFilters = (t: (key: string) => string): RowFilter[] => [
  {
    filterGroupName: t('Sync Status'),
    type: APPLICATION_SYNC_FILTER_TYPE,
    reducer: (application) => getApplicationSyncFilterId(application),
    filter: (input, application) => matchesApplicationSyncFilter(input.selected, application),
    items: [
      { id: SyncStatus.SYNCED, title: SyncStatus.SYNCED },
      { id: SyncStatus.OUT_OF_SYNC, title: SyncStatus.OUT_OF_SYNC },
      { id: APPLICATION_SYNC_UNKNOWN_FILTER_ID, title: SyncStatus.UNKNOWN },
    ],
  },
  {
    filterGroupName: t('Health Status'),
    type: APPLICATION_HEALTH_FILTER_TYPE,
    reducer: (application) => getApplicationHealthStatus(application),
    filter: (input, application) => matchesApplicationHealthFilter(input.selected, application),
    items: [
      { id: HealthStatus.UNKNOWN, title: HealthStatus.UNKNOWN },
      { id: HealthStatus.PROGRESSING, title: HealthStatus.PROGRESSING },
      { id: HealthStatus.SUSPENDED, title: HealthStatus.SUSPENDED },
      { id: HealthStatus.HEALTHY, title: HealthStatus.HEALTHY },
      { id: HealthStatus.DEGRADED, title: HealthStatus.DEGRADED },
      { id: HealthStatus.MISSING, title: HealthStatus.MISSING },
    ],
  },
];
