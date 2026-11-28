import { getDefaultActiveColumnIds } from './ColumnManagement';
import {
  getImageUpdaterManagedColumns,
  IMAGE_UPDATER_LIST_COLUMN_MANAGEMENT_ID,
} from './imageUpdaterListColumns';

const t = (key: string) => key;

describe('IMAGE_UPDATER_LIST_COLUMN_MANAGEMENT_ID', () => {
  it('uses a stable user-settings key', () => {
    expect(IMAGE_UPDATER_LIST_COLUMN_MANAGEMENT_ID).toBe('gitops.imageupdaters');
  });
});

describe('getImageUpdaterManagedColumns', () => {
  it('locks Name and always shows actions', () => {
    const columns = getImageUpdaterManagedColumns(true, t);
    const byId = Object.fromEntries(columns.map((column) => [column.id, column]));

    expect(byId.name.isUntoggleable).toBe(true);
    expect(byId.actions.alwaysShown).toBe(true);
  });

  it('includes Namespace only for All projects', () => {
    expect(getImageUpdaterManagedColumns(true, t).map((column) => column.id)).toEqual([
      'name',
      'namespace',
      'apps',
      'images',
      'last-checked',
      'ready',
      'age',
      'actions',
    ]);
    expect(getImageUpdaterManagedColumns(false, t).map((column) => column.id)).toEqual([
      'name',
      'apps',
      'images',
      'last-checked',
      'ready',
      'age',
      'actions',
    ]);
  });

  it('defaults to Default columns only (excludes Additional)', () => {
    const columns = getImageUpdaterManagedColumns(true, t);
    expect(getDefaultActiveColumnIds(columns)).toEqual([
      'name',
      'namespace',
      'apps',
      'images',
      'last-checked',
      'ready',
      'age',
      'actions',
    ]);
  });
});
