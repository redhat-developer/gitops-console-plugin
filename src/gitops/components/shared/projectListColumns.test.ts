import { getDefaultActiveColumnIds } from './ColumnManagement';
import { getProjectManagedColumns, PROJECT_LIST_COLUMN_MANAGEMENT_ID } from './projectListColumns';

const t = (key: string) => key;

describe('PROJECT_LIST_COLUMN_MANAGEMENT_ID', () => {
  it('uses a stable user-settings key', () => {
    expect(PROJECT_LIST_COLUMN_MANAGEMENT_ID).toBe('gitops.appprojects');
  });
});

describe('getProjectManagedColumns', () => {
  it('locks Name, keeps Labels default-visible, and always shows actions', () => {
    const columns = getProjectManagedColumns(true, t);
    const byId = Object.fromEntries(columns.map((column) => [column.id, column]));

    expect(byId.name.isUntoggleable).toBe(true);
    expect(byId.labels.isShownByDefault).toBe(true);
    expect(byId.actions.alwaysShown).toBe(true);
  });

  it('puts Description and Last Updated under Additional columns', () => {
    const columns = getProjectManagedColumns(true, t);
    const byId = Object.fromEntries(columns.map((column) => [column.id, column]));

    expect(byId.description).toMatchObject({ isShownByDefault: false, additional: true });
    expect(byId['last-updated']).toMatchObject({ isShownByDefault: false, additional: true });
    expect(columns.filter((column) => column.additional).map((column) => column.id)).toEqual([
      'description',
      'last-updated',
    ]);
  });

  it('includes Namespace only for All projects', () => {
    expect(getProjectManagedColumns(true, t).map((column) => column.id)).toEqual([
      'name',
      'namespace',
      'description',
      'applications',
      'labels',
      'last-updated',
      'actions',
    ]);
    expect(getProjectManagedColumns(false, t).map((column) => column.id)).toEqual([
      'name',
      'description',
      'applications',
      'labels',
      'last-updated',
      'actions',
    ]);
  });

  it('defaults to Default columns only (excludes Additional)', () => {
    const columns = getProjectManagedColumns(true, t);
    expect(getDefaultActiveColumnIds(columns)).toEqual([
      'name',
      'namespace',
      'applications',
      'labels',
      'actions',
    ]);
  });
});
