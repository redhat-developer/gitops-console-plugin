import type { GitOpsManagedColumn } from './ColumnManagement';

export const APPLICATION_SOURCES_COLUMN_MANAGEMENT_ID = 'gitops.application.sources';

export const getApplicationSourcesManagedColumns = (
  t: (key: string) => string,
): GitOpsManagedColumn[] => [
  { id: 'repository', title: t('Repository'), isShownByDefault: true, isUntoggleable: true },
  { id: 'type', title: t('Type'), isShownByDefault: true },
  { id: 'targetRevision', title: t('Target Revision'), isShownByDefault: true },
  { id: 'path', title: t('Path / Chart'), isShownByDefault: true },
  { id: 'ref', title: t('Ref'), isShownByDefault: false, additional: true },
];
