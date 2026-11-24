import { type GitOpsManagedColumn, buildGitOpsManagedColumns } from './ColumnManagement';

export const IMAGE_UPDATER_LIST_COLUMN_MANAGEMENT_ID = 'gitops.imageupdaters';

export const getImageUpdaterManagedColumns = (
  includeNamespaceColumn: boolean,
  t: (key: string) => string,
): GitOpsManagedColumn[] =>
  buildGitOpsManagedColumns(includeNamespaceColumn, t, [
    { id: 'apps', title: t('Applications'), isShownByDefault: true },
    { id: 'images', title: t('Images'), isShownByDefault: true },
    { id: 'last-checked', title: t('Last checked'), isShownByDefault: true },
    { id: 'ready', title: t('Ready'), isShownByDefault: true },
    { id: 'age', title: t('Age'), isShownByDefault: true },
  ]);
