import { type GitOpsManagedColumn, buildGitOpsManagedColumns } from './ColumnManagement';

export const ROLLOUT_LIST_COLUMN_MANAGEMENT_ID = 'gitops.rollouts';

export const getRolloutManagedColumns = (
  includeNamespaceColumn: boolean,
  t: (key: string) => string,
): GitOpsManagedColumn[] =>
  buildGitOpsManagedColumns(includeNamespaceColumn, t, [
    { id: 'status', title: t('Status'), isShownByDefault: true },
    { id: 'pods', title: t('Pods'), isShownByDefault: true },
    { id: 'labels', title: t('Labels'), isShownByDefault: true },
    { id: 'selector', title: t('Selector'), isShownByDefault: false, additional: true },
    { id: 'last-updated', title: t('Last Updated'), isShownByDefault: false, additional: true },
  ]);
