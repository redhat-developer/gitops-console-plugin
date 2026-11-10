import type { GitOpsManagedColumn } from './ColumnManagement';

export const APPLICATION_HISTORY_COLUMN_MANAGEMENT_ID = 'gitops.application.history';

export const getApplicationHistoryManagedColumns = (
  t: (key: string) => string,
): GitOpsManagedColumn[] => [
  { id: 'id', title: t('ID'), isShownByDefault: true, isUntoggleable: true },
  { id: 'started-at', title: t('Deploy Started At'), isShownByDefault: true },
  { id: 'deployed-at', title: t('Deployed At'), isShownByDefault: true },
  { id: 'initiated-by', title: t('Initiated By'), isShownByDefault: true },
  {
    id: 'revision',
    title: t('Revision(s) and Source Repo URL(s)'),
    isShownByDefault: true,
  },
];
