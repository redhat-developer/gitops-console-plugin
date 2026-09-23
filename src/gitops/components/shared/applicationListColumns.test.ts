import { getDefaultActiveColumnIds } from './ColumnManagement';

import {
  APPLICATION_LIST_COLUMN_MANAGEMENT_ID,
  getApplicationManagedColumns,
} from './applicationListColumns';

const t = (key: string) => key;

describe('APPLICATION_LIST_COLUMN_MANAGEMENT_ID', () => {
  it('uses a stable user-settings key', () => {
    expect(APPLICATION_LIST_COLUMN_MANAGEMENT_ID).toBe('gitops.applications');
  });
});

describe('getApplicationManagedColumns', () => {
  it('locks Name, keeps Labels default-visible, and always shows actions', () => {
    const columns = getApplicationManagedColumns(true, t);
    const byId = Object.fromEntries(columns.map((column) => [column.id, column]));

    expect(byId.name.isUntoggleable).toBe(true);
    expect(byId.labels.isShownByDefault).toBe(true);
    expect(byId.actions.alwaysShown).toBe(true);
    expect(columns.some((column) => column.additional)).toBe(false);
  });

  it('includes Namespace only for All projects', () => {
    expect(getApplicationManagedColumns(true, t).map((column) => column.id)).toEqual([
      'name',
      'namespace',
      'sync-status',
      'health-status',
      'revision',
      'labels',
      'project',
      'actions',
    ]);
    expect(getApplicationManagedColumns(false, t).map((column) => column.id)).toEqual([
      'name',
      'sync-status',
      'health-status',
      'revision',
      'labels',
      'project',
      'actions',
    ]);
  });

  it('defaults to every non-additional column visible', () => {
    const columns = getApplicationManagedColumns(true, t);
    expect(getDefaultActiveColumnIds(columns)).toEqual([
      'name',
      'namespace',
      'sync-status',
      'health-status',
      'revision',
      'labels',
      'project',
      'actions',
    ]);
  });
});
