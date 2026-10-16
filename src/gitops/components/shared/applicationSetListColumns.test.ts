import {
  APPLICATION_SET_LIST_COLUMN_MANAGEMENT_ID,
  getApplicationSetManagedColumns,
} from './applicationSetListColumns';
import { getDefaultActiveColumnIds } from './ColumnManagement';

const t = (key: string) => key;

describe('APPLICATION_SET_LIST_COLUMN_MANAGEMENT_ID', () => {
  it('uses a stable user-settings key', () => {
    expect(APPLICATION_SET_LIST_COLUMN_MANAGEMENT_ID).toBe('gitops.applicationsets');
  });
});

describe('getApplicationSetManagedColumns', () => {
  it('locks Name, keeps Labels default-visible, and always shows actions', () => {
    const columns = getApplicationSetManagedColumns(true, t);
    const byId = Object.fromEntries(columns.map((column) => [column.id, column]));

    expect(byId.name.isUntoggleable).toBe(true);
    expect(byId.labels.isShownByDefault).toBe(true);
    expect(byId.actions.alwaysShown).toBe(true);
  });

  it('puts Generators and Created At under Additional columns', () => {
    const columns = getApplicationSetManagedColumns(true, t);
    const byId = Object.fromEntries(columns.map((column) => [column.id, column]));

    expect(byId.generators).toMatchObject({ isShownByDefault: false, additional: true });
    expect(byId['created-at']).toMatchObject({ isShownByDefault: false, additional: true });
    expect(columns.filter((column) => column.additional).map((column) => column.id)).toEqual([
      'generators',
      'created-at',
    ]);
  });

  it('includes Namespace only for All projects', () => {
    expect(getApplicationSetManagedColumns(true, t).map((column) => column.id)).toEqual([
      'name',
      'namespace',
      'status',
      'generated-apps',
      'generators',
      'labels',
      'created-at',
      'actions',
    ]);
    expect(getApplicationSetManagedColumns(false, t).map((column) => column.id)).toEqual([
      'name',
      'status',
      'generated-apps',
      'generators',
      'labels',
      'created-at',
      'actions',
    ]);
  });

  it('defaults to Default columns only (excludes Additional)', () => {
    const columns = getApplicationSetManagedColumns(true, t);
    expect(getDefaultActiveColumnIds(columns)).toEqual([
      'name',
      'namespace',
      'status',
      'generated-apps',
      'labels',
      'actions',
    ]);
  });
});
