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
  it('locks Name, keeps Labels default-visible, and always shows actions', () => {
    const columns = getImageUpdaterManagedColumns(true, t);
    const byId = Object.fromEntries(columns.map((column) => [column.id, column]));

    expect(byId.name.isUntoggleable).toBe(true);
    expect(byId.labels.isShownByDefault).toBe(true);
    expect(byId.actions.alwaysShown).toBe(true);
  });

  it('puts Last Checked under Additional columns', () => {
    const columns = getImageUpdaterManagedColumns(true, t);
    const byId = Object.fromEntries(columns.map((column) => [column.id, column]));

    expect(byId['last-checked']).toMatchObject({ isShownByDefault: false, additional: true });
    expect(columns.filter((column) => column.additional).map((column) => column.id)).toEqual([
      'last-checked',
    ]);
  });

  it('includes Namespace only for All projects', () => {
    expect(getImageUpdaterManagedColumns(true, t).map((column) => column.id)).toEqual([
      'name',
      'namespace',
      'apps',
      'images',
      'last-checked',
      'ready',
      'labels',
      'actions',
    ]);
    expect(getImageUpdaterManagedColumns(false, t).map((column) => column.id)).toEqual([
      'name',
      'apps',
      'images',
      'last-checked',
      'ready',
      'labels',
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
      'ready',
      'labels',
      'actions',
    ]);
  });
});
