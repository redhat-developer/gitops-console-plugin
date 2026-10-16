import { type GitOpsManagedColumn, NAMESPACE_COLUMN_ID } from './ColumnManagement/types';

export const IMAGE_UPDATER_LIST_COLUMN_MANAGEMENT_ID = 'gitops.imageupdaters';

export const getImageUpdaterManagedColumns = (
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
    { id: 'apps', title: t('Apps'), isShownByDefault: true },
    { id: 'images', title: t('Images'), isShownByDefault: true },
    { id: 'last-checked', title: t('Last Checked'), isShownByDefault: false, additional: true },
    { id: 'ready', title: t('Ready'), isShownByDefault: true },
    { id: 'labels', title: t('Labels'), isShownByDefault: true },
    { id: 'actions', title: '', isShownByDefault: true, alwaysShown: true },
  );
  return columns;
};
