import { type GitOpsManagedColumn, buildGitOpsManagedColumns } from './ColumnManagement';

export const APPLICATION_LIST_COLUMN_MANAGEMENT_ID = 'gitops.applications';

export const getApplicationManagedColumns = (
  includeNamespaceColumn: boolean,
  t: (key: string) => string,
): GitOpsManagedColumn[] =>
  buildGitOpsManagedColumns(includeNamespaceColumn, t, [
    { id: 'sync-status', title: t('Sync Status'), isShownByDefault: true },
    { id: 'health-status', title: t('Health Status'), isShownByDefault: true },
    { id: 'revision', title: t('Revision'), isShownByDefault: false, additional: true },
    { id: 'labels', title: t('Labels'), isShownByDefault: true },
    { id: 'project', title: t('App Project'), isShownByDefault: false, additional: true },
  ]);
