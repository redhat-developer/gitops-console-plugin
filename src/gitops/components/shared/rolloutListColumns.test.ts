import { getDefaultActiveColumnIds } from './ColumnManagement';
import { getRolloutManagedColumns, ROLLOUT_LIST_COLUMN_MANAGEMENT_ID } from './rolloutListColumns';

const t = (key: string) => key;

describe('ROLLOUT_LIST_COLUMN_MANAGEMENT_ID', () => {
  it('uses a stable user-settings key', () => {
    expect(ROLLOUT_LIST_COLUMN_MANAGEMENT_ID).toBe('gitops.rollouts');
  });
});

describe('getRolloutManagedColumns', () => {
  it('locks Name, keeps Labels default-visible, and always shows actions', () => {
    const columns = getRolloutManagedColumns(true, t);
    const byId = Object.fromEntries(columns.map((column) => [column.id, column]));

    expect(byId.name.isUntoggleable).toBe(true);
    expect(byId.labels.isShownByDefault).toBe(true);
    expect(byId.actions.alwaysShown).toBe(true);
  });

  it('puts Selector and Last Updated under Additional columns', () => {
    const columns = getRolloutManagedColumns(true, t);
    const byId = Object.fromEntries(columns.map((column) => [column.id, column]));

    expect(byId.selector).toMatchObject({ isShownByDefault: false, additional: true });
    expect(byId['last-updated']).toMatchObject({ isShownByDefault: false, additional: true });
    expect(columns.filter((column) => column.additional).map((column) => column.id)).toEqual([
      'selector',
      'last-updated',
    ]);
  });

  it('includes Namespace only for All projects', () => {
    expect(getRolloutManagedColumns(true, t).map((column) => column.id)).toEqual([
      'name',
      'namespace',
      'status',
      'pods',
      'labels',
      'selector',
      'last-updated',
      'actions',
    ]);
    expect(getRolloutManagedColumns(false, t).map((column) => column.id)).toEqual([
      'name',
      'status',
      'pods',
      'labels',
      'selector',
      'last-updated',
      'actions',
    ]);
  });

  it('defaults to Default columns only (excludes Additional)', () => {
    const columns = getRolloutManagedColumns(true, t);
    expect(getDefaultActiveColumnIds(columns)).toEqual([
      'name',
      'namespace',
      'status',
      'pods',
      'labels',
      'actions',
    ]);
  });
});
