import { type GitOpsManagedColumn, NAMESPACE_COLUMN_ID } from './ColumnManagement/types';

export const PROJECT_LIST_COLUMN_MANAGEMENT_ID = 'gitops.appprojects';

export const getProjectManagedColumns = (
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
    { id: 'description', title: t('Description'), isShownByDefault: false, additional: true },
    { id: 'applications', title: t('Applications'), isShownByDefault: true },
    { id: 'labels', title: t('Labels'), isShownByDefault: true },
    { id: 'last-updated', title: t('Last Updated'), isShownByDefault: false, additional: true },
    { id: 'actions', title: '', isShownByDefault: true, alwaysShown: true },
  );
  return columns;
};
