import type { GitOpsManagedColumn } from './ColumnManagement';

export const APPLICATION_SYNC_STATUS_RESOURCES_COLUMN_MANAGEMENT_ID =
  'gitops.application.syncStatusResources';

export const getApplicationSyncStatusResourcesManagedColumns = (
  t: (key: string) => string,
): GitOpsManagedColumn[] => [
  { id: 'name', title: t('Name'), isShownByDefault: true, isUntoggleable: true },
  { id: 'namespace', title: t('Namespace'), isShownByDefault: true },
  { id: 'status', title: t('Status'), isShownByDefault: true },
  { id: 'hook', title: t('Hook'), isShownByDefault: false, additional: true },
  { id: 'message', title: t('Message'), isShownByDefault: true },
  { id: 'actions', title: '', isShownByDefault: true, alwaysShown: true },
];
