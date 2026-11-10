import type { GitOpsManagedColumn } from './ColumnManagement';

export const APPLICATION_RESOURCES_COLUMN_MANAGEMENT_ID = 'gitops.application.resources';

export const getApplicationResourcesManagedColumns = (
  t: (key: string) => string,
): GitOpsManagedColumn[] => [
  { id: 'name', title: t('Name'), isShownByDefault: true, isUntoggleable: true },
  { id: 'namespace', title: t('Namespace'), isShownByDefault: true },
  { id: 'sync-wave', title: t('Sync Wave'), isShownByDefault: false, additional: true },
  { id: 'sync-status', title: t('Sync Status'), isShownByDefault: true },
  { id: 'health-status', title: t('Health Status'), isShownByDefault: true },
  { id: 'actions', title: '', isShownByDefault: true, alwaysShown: true },
];
