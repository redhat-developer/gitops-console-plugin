import { type GitOpsManagedColumn, buildGitOpsManagedColumns } from './ColumnManagement';

export const APPLICATION_SET_LIST_COLUMN_MANAGEMENT_ID = 'gitops.applicationsets';

export const getApplicationSetManagedColumns = (
  includeNamespaceColumn: boolean,
  t: (key: string) => string,
): GitOpsManagedColumn[] =>
  buildGitOpsManagedColumns(includeNamespaceColumn, t, [
    { id: 'status', title: t('Health Status'), isShownByDefault: true },
    { id: 'generated-apps', title: t('Generated Apps'), isShownByDefault: true },
    { id: 'generators', title: t('Generators'), isShownByDefault: false, additional: true },
    { id: 'labels', title: t('Labels'), isShownByDefault: true },
    { id: 'created-at', title: t('Created At'), isShownByDefault: false, additional: true },
  ]);
