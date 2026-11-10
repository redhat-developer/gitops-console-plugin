import {
  APPLICATION_SOURCES_COLUMN_MANAGEMENT_ID,
  getApplicationSourcesManagedColumns,
} from './applicationSourcesColumns';
import { getDefaultActiveColumnIds } from './ColumnManagement';

const t = (key: string) => key;

describe('APPLICATION_SOURCES_COLUMN_MANAGEMENT_ID', () => {
  it('uses a stable user-settings key', () => {
    expect(APPLICATION_SOURCES_COLUMN_MANAGEMENT_ID).toBe('gitops.application.sources');
  });
});

describe('getApplicationSourcesManagedColumns', () => {
  it('locks Repository first and puts Ref under Additional columns', () => {
    const columns = getApplicationSourcesManagedColumns(t);
    const byId = Object.fromEntries(columns.map((column) => [column.id, column]));

    expect(byId.repository.isUntoggleable).toBe(true);
    expect(byId.type.isUntoggleable).toBeUndefined();
    expect(byId.ref).toMatchObject({ isShownByDefault: false, additional: true });
    expect(columns.map((column) => column.id)).toEqual([
      'repository',
      'type',
      'targetRevision',
      'path',
      'ref',
    ]);
  });

  it('defaults to all columns except Ref', () => {
    expect(getDefaultActiveColumnIds(getApplicationSourcesManagedColumns(t))).toEqual([
      'repository',
      'type',
      'targetRevision',
      'path',
    ]);
  });
});
