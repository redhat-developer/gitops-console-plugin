import type { GitOpsManagedColumn } from './ColumnManagement';
import { NAMESPACE_COLUMN_ID } from './ColumnManagement';

export const APPLICATION_LIST_COLUMN_MANAGEMENT_ID = 'gitops.applications';

/** Column management metadata for the Applications list (and shared AppSet/Project app tables). */
export const getApplicationManagedColumns = (
  includeNamespaceColumn: boolean,
  t: (key: string) => string,
): GitOpsManagedColumn[] => {
  const columns: GitOpsManagedColumn[] = [
    { id: 'name', title: t('Name'), isShownByDefault: true, isUntoggleable: true },
  ];
  if (includeNamespaceColumn) {
    columns.push({
      id: NAMESPACE_COLUMN_ID,
      title: t('Namespace'),
      isShownByDefault: true,
    });
  }
  columns.push(
    { id: 'sync-status', title: t('Sync Status'), isShownByDefault: true },
    { id: 'health-status', title: t('Health Status'), isShownByDefault: true },
    { id: 'revision', title: t('Revision'), isShownByDefault: true },
    { id: 'labels', title: t('Labels'), isShownByDefault: true },
    { id: 'project', title: t('App Project'), isShownByDefault: true },
    { id: 'actions', title: '', isShownByDefault: true, alwaysShown: true },
  );
  return columns;
};
