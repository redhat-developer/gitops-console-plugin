import type { GitOpsManagedColumn } from './ColumnManagement';

export const ROLLOUT_PODS_COLUMN_MANAGEMENT_ID = 'gitops.rollout.pods';

export const getRolloutPodsManagedColumns = (
  includeNamespaceColumn: boolean,
  t: (key: string) => string,
): GitOpsManagedColumn[] => {
  const columns: GitOpsManagedColumn[] = [
    { id: 'name', title: t('Name'), isShownByDefault: true, isUntoggleable: true },
  ];
  if (includeNamespaceColumn) {
    columns.push({ id: 'namespace', title: t('Namespace'), isShownByDefault: true });
  }
  columns.push(
    { id: 'traffic', title: t('Traffic'), isShownByDefault: true },
    { id: 'status', title: t('Status'), isShownByDefault: true },
    { id: 'ready', title: t('Ready'), isShownByDefault: true },
    { id: 'restarts', title: t('Restarts'), isShownByDefault: false, additional: true },
    { id: 'owner', title: t('Owner'), isShownByDefault: true },
    { id: 'memory', title: t('Memory'), isShownByDefault: false, additional: true },
    { id: 'cpu', title: t('CPU'), isShownByDefault: false, additional: true },
    { id: 'created', title: t('Created At'), isShownByDefault: true },
    { id: 'actions', title: '', isShownByDefault: true, alwaysShown: true },
  );
  return columns;
};
