import { type GitOpsManagedColumn, NAMESPACE_COLUMN_ID } from './ColumnManagement/types';

export const ROLLOUT_LIST_COLUMN_MANAGEMENT_ID = 'gitops.rollouts';

export const getRolloutManagedColumns = (
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
    { id: 'status', title: t('Status'), isShownByDefault: true },
    { id: 'pods', title: t('Pods'), isShownByDefault: true },
    { id: 'labels', title: t('Labels'), isShownByDefault: true },
    { id: 'selector', title: t('Selector'), isShownByDefault: false, additional: true },
    { id: 'last-updated', title: t('Last Updated'), isShownByDefault: false, additional: true },
    { id: 'actions', title: '', isShownByDefault: true, alwaysShown: true },
  );
  return columns;
};
