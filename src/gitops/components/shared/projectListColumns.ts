import { type GitOpsManagedColumn, buildGitOpsManagedColumns } from './ColumnManagement';

export const PROJECT_LIST_COLUMN_MANAGEMENT_ID = 'gitops.appprojects';

export const getProjectManagedColumns = (
  includeNamespaceColumn: boolean,
  t: (key: string) => string,
): GitOpsManagedColumn[] =>
  buildGitOpsManagedColumns(includeNamespaceColumn, t, [
    { id: 'description', title: t('Description'), isShownByDefault: false, additional: true },
    { id: 'applications', title: t('Applications'), isShownByDefault: true },
    { id: 'labels', title: t('Labels'), isShownByDefault: true },
    { id: 'last-updated', title: t('Last Updated'), isShownByDefault: false, additional: true },
  ]);
