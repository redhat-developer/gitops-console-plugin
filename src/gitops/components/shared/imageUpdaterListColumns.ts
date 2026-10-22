import { type GitOpsManagedColumn, buildGitOpsManagedColumns } from './ColumnManagement';

export const IMAGE_UPDATER_LIST_COLUMN_MANAGEMENT_ID = 'gitops.imageupdaters';

export const getImageUpdaterManagedColumns = (
  includeNamespaceColumn: boolean,
  t: (key: string) => string,
): GitOpsManagedColumn[] =>
  buildGitOpsManagedColumns(includeNamespaceColumn, t, [
    { id: 'apps', title: t('Apps'), isShownByDefault: true },
    { id: 'images', title: t('Images'), isShownByDefault: true },
    { id: 'last-checked', title: t('Last Checked'), isShownByDefault: false, additional: true },
    { id: 'ready', title: t('Ready'), isShownByDefault: true },
    { id: 'labels', title: t('Labels'), isShownByDefault: true },
  ]);
