import {
  APPLICATION_LIST_COLUMN_MANAGEMENT_ID,
  getApplicationManagedColumns,
} from './applicationListColumns';
import { getDefaultActiveColumnIds } from './ColumnManagement';

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
  });

  it('puts Revision and App Project under Additional columns', () => {
    const columns = getApplicationManagedColumns(true, t);
    const byId = Object.fromEntries(columns.map((column) => [column.id, column]));

    expect(byId.revision).toMatchObject({ isShownByDefault: false, additional: true });
    expect(byId.project).toMatchObject({ isShownByDefault: false, additional: true });
    expect(columns.filter((column) => column.additional).map((column) => column.id)).toEqual([
      'revision',
      'project',
    ]);
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

  it('defaults to Default columns only (excludes Additional)', () => {
    const columns = getApplicationManagedColumns(true, t);
    expect(getDefaultActiveColumnIds(columns)).toEqual([
      'name',
      'namespace',
      'sync-status',
      'health-status',
      'labels',
      'actions',
    ]);
  });
});
