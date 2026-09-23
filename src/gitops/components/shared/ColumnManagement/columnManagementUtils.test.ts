import type { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';

import {
  filterDataViewColumnsAndRows,
  getDefaultActiveColumnIds,
  getManageableColumns,
  getSavableColumnIds,
  resolveActiveColumnIds,
  toColumnManagementModalColumns,
} from './columnManagementUtils';
import {
  type GitOpsManagedColumn,
  getGitOpsColumnManagementSettingKey,
  NAMESPACE_COLUMN_ID,
} from './types';

const baseColumns: GitOpsManagedColumn[] = [
  { id: 'name', title: 'Name', isShownByDefault: true, isUntoggleable: true },
  { id: NAMESPACE_COLUMN_ID, title: 'Namespace', isShownByDefault: true },
  { id: 'status', title: 'Status', isShownByDefault: true },
  { id: 'labels', title: 'Labels', isShownByDefault: true },
  { id: 'extra', title: 'Extra', isShownByDefault: false },
  { id: 'actions', title: '', isShownByDefault: true, alwaysShown: true },
];

describe('getGitOpsColumnManagementSettingKey', () => {
  it('prefixes the table id', () => {
    expect(getGitOpsColumnManagementSettingKey('applications')).toBe(
      'gitops.columnManagement.applications',
    );
  });
});

describe('getManageableColumns', () => {
  it('omits always-shown columns from the modal list', () => {
    expect(getManageableColumns(baseColumns).map((c) => c.id)).toEqual([
      'name',
      'namespace',
      'status',
      'labels',
      'extra',
    ]);
  });
});

describe('getDefaultActiveColumnIds', () => {
  it('includes default and always-shown columns in definition order', () => {
    expect(getDefaultActiveColumnIds(baseColumns)).toEqual([
      'name',
      'namespace',
      'status',
      'labels',
      'actions',
    ]);
  });
});

describe('resolveActiveColumnIds', () => {
  it('uses defaults when nothing is saved', () => {
    expect(resolveActiveColumnIds({ columns: baseColumns })).toEqual([
      'name',
      'namespace',
      'status',
      'labels',
      'actions',
    ]);
  });

  it('applies saved preferences and keeps always-shown columns', () => {
    expect(
      resolveActiveColumnIds({
        columns: baseColumns,
        savedColumnIds: ['name', 'extra'],
      }),
    ).toEqual(['name', 'extra', 'actions']);
  });

  it('drops unknown saved ids', () => {
    expect(
      resolveActiveColumnIds({
        columns: baseColumns,
        savedColumnIds: ['name', 'stale', 'labels'],
      }),
    ).toEqual(['name', 'labels', 'actions']);
  });

  it('always keeps untoggleable columns', () => {
    expect(
      resolveActiveColumnIds({
        columns: baseColumns,
        savedColumnIds: ['labels'],
      }),
    ).toEqual(['name', 'labels', 'actions']);
  });

  it('hides namespace when includeNamespaceColumn is false', () => {
    expect(
      resolveActiveColumnIds({
        columns: baseColumns,
        savedColumnIds: ['name', 'namespace', 'status'],
        includeNamespaceColumn: false,
      }),
    ).toEqual(['name', 'status', 'actions']);
  });
});

describe('toColumnManagementModalColumns', () => {
  it('maps manageable columns for the Manage columns modal', () => {
    const active = new Set(['name', 'status', 'actions']);
    expect(toColumnManagementModalColumns(baseColumns, active)).toEqual([
      {
        id: 'name',
        title: 'Name',
        isShown: true,
        isShownByDefault: true,
        isUntoggleable: true,
        additional: undefined,
      },
      {
        id: 'namespace',
        title: 'Namespace',
        isShown: false,
        isShownByDefault: true,
        isUntoggleable: undefined,
        additional: undefined,
      },
      {
        id: 'status',
        title: 'Status',
        isShown: true,
        isShownByDefault: true,
        isUntoggleable: undefined,
        additional: undefined,
      },
      {
        id: 'labels',
        title: 'Labels',
        isShown: false,
        isShownByDefault: true,
        isUntoggleable: undefined,
        additional: undefined,
      },
      {
        id: 'extra',
        title: 'Extra',
        isShown: false,
        isShownByDefault: false,
        isUntoggleable: undefined,
        additional: undefined,
      },
    ]);
  });

  it('omits namespace from the modal when includeNamespaceColumn is false', () => {
    const ids = toColumnManagementModalColumns(baseColumns, ['name', 'status'], false).map(
      (c) => c.id,
    );
    expect(ids).not.toContain('namespace');
  });
});

describe('getSavableColumnIds', () => {
  it('persists only shown manageable column ids in definition order', () => {
    const modalColumns = toColumnManagementModalColumns(
      baseColumns,
      new Set(['name', 'extra', 'actions']),
    );
    expect(getSavableColumnIds(baseColumns, modalColumns)).toEqual(['name', 'extra']);
  });

  it('keeps previously saved ids that the current modal does not manage', () => {
    const projectScopedColumns = baseColumns.filter(
      (column) => column.id !== NAMESPACE_COLUMN_ID,
    );
    const modalColumns = toColumnManagementModalColumns(
      projectScopedColumns,
      new Set(['name', 'status', 'actions']),
      false,
    );

    expect(
      getSavableColumnIds(projectScopedColumns, modalColumns, [
        'name',
        'namespace',
        'labels',
        'extra',
      ]),
    ).toEqual(['namespace', 'name', 'status']);
  });
});

describe('filterDataViewColumnsAndRows', () => {
  const columns: DataViewTh[] = [
    { cell: 'Name' },
    { cell: 'Namespace' },
    { cell: 'Status' },
    { cell: '' },
  ];
  const columnIds = ['name', 'namespace', 'status', 'actions'];
  const rows: DataViewTr[] = [
    [{ cell: 'a' }, { cell: 'ns-a' }, { cell: 'ok' }, { cell: '…' }],
    {
      id: 'row-2',
      row: [{ cell: 'b' }, { cell: 'ns-b' }, { cell: 'err' }, { cell: '…' }],
    },
  ];

  it('filters headers and both array and object rows by active ids', () => {
    const result = filterDataViewColumnsAndRows(
      columns,
      rows,
      columnIds,
      new Set(['name', 'status', 'actions']),
    );

    expect(
      result.columns.map((c) => (typeof c === 'object' && c && 'cell' in c ? c.cell : c)),
    ).toEqual(['Name', 'Status', '']);
    expect(result.rows).toEqual([
      [{ cell: 'a' }, { cell: 'ok' }, { cell: '…' }],
      {
        id: 'row-2',
        row: [{ cell: 'b' }, { cell: 'err' }, { cell: '…' }],
      },
    ]);
  });
});
