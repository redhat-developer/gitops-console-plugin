import type { GitOpsManagedColumn } from './ColumnManagement';

export const PROJECT_SYNC_WINDOWS_COLUMN_MANAGEMENT_ID = 'gitops.appproject.syncWindows';

export const getProjectSyncWindowsManagedColumns = (
  t: (key: string) => string,
): GitOpsManagedColumn[] => [
  { id: 'kind', title: t('Kind'), isShownByDefault: true, isUntoggleable: true },
  { id: 'schedule', title: t('Schedule'), isShownByDefault: true },
  { id: 'duration', title: t('Duration'), isShownByDefault: true },
  { id: 'applications', title: t('Applications'), isShownByDefault: true },
  { id: 'clusters', title: t('Clusters'), isShownByDefault: false, additional: true },
  { id: 'namespaces', title: t('Namespaces'), isShownByDefault: false, additional: true },
  { id: 'manualSync', title: t('Manual Sync'), isShownByDefault: true },
  { id: 'timeZone', title: t('Time Zone'), isShownByDefault: false, additional: true },
];
