import { type GitOpsManagedColumn, NAMESPACE_COLUMN_ID } from './ColumnManagement/types';

export const APPLICATION_SET_LIST_COLUMN_MANAGEMENT_ID = 'gitops.applicationsets';

export const getApplicationSetManagedColumns = (
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
    { id: 'status', title: t('Health Status'), isShownByDefault: true },
    { id: 'generated-apps', title: t('Generated Apps'), isShownByDefault: true },
    { id: 'generators', title: t('Generators'), isShownByDefault: false, additional: true },
    { id: 'labels', title: t('Labels'), isShownByDefault: true },
    { id: 'created-at', title: t('Created At'), isShownByDefault: false, additional: true },
    { id: 'actions', title: '', isShownByDefault: true, alwaysShown: true },
  );
  return columns;
};
