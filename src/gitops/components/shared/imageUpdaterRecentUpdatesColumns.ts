import type { GitOpsManagedColumn } from './ColumnManagement';

export const IMAGE_UPDATER_RECENT_UPDATES_COLUMN_MANAGEMENT_ID =
  'gitops.imageupdater.recentUpdates';

export const getImageUpdaterRecentUpdatesManagedColumns = (
  t: (key: string) => string,
): GitOpsManagedColumn[] => [
  { id: 'when', title: t('When'), isShownByDefault: true },
  { id: 'image', title: t('Image'), isShownByDefault: true },
  { id: 'alias', title: t('Alias'), isShownByDefault: true, isUntoggleable: true },
  { id: 'new-version', title: t('New version'), isShownByDefault: true },
  { id: 'apps-updated', title: t('Apps updated'), isShownByDefault: true },
  { id: 'message', title: t('Message'), isShownByDefault: false, additional: true },
];
