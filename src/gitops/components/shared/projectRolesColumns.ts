import type { GitOpsManagedColumn } from './ColumnManagement';

export const PROJECT_ROLES_COLUMN_MANAGEMENT_ID = 'gitops.appproject.roles';

export const getProjectRolesManagedColumns = (
  t: (key: string) => string,
): GitOpsManagedColumn[] => [
  { id: 'name', title: t('Name'), isShownByDefault: true, isUntoggleable: true },
  { id: 'description', title: t('Description'), isShownByDefault: true },
  { id: 'groups', title: t('Groups'), isShownByDefault: true },
  { id: 'policies', title: t('Policies'), isShownByDefault: true },
];
