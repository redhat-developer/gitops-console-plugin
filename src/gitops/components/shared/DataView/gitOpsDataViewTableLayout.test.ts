import type { DataViewTh } from '@patternfly/react-data-view/dist/esm/DataViewTable';

import { enhanceGitOpsDataViewLayout } from './gitOpsDataViewTableLayout';

type DataViewThObject = Extract<DataViewTh, { cell: unknown }>;
type DataViewTdObject = { cell: unknown; props?: Record<string, unknown> };

const asThObject = (column: DataViewTh): DataViewThObject => {
  if (column == null || typeof column !== 'object' || !('cell' in column)) {
    throw new Error('expected DataViewTh object');
  }
  return column as DataViewThObject;
};

const asTdObject = (cell: unknown): DataViewTdObject => {
  if (cell == null || typeof cell !== 'object' || !('cell' in cell)) {
    throw new Error('expected DataViewTd object');
  }
  return cell as DataViewTdObject;
};

describe('enhanceGitOpsDataViewLayout', () => {
  it('matches Console nameCellProps / actionsCellProps and enables resize', () => {
    const { columns, rows } = enhanceGitOpsDataViewLayout({
      columns: [
        { cell: 'Name', props: { 'aria-label': 'name', className: 'pf-m-width-20' } },
        { cell: 'Namespace', props: { 'aria-label': 'namespace', className: 'pf-m-width-15' } },
        { cell: 'Sync Status', props: { 'aria-label': 'sync-status' } },
        { cell: '', props: { 'aria-label': 'actions' } },
      ],
      rows: [
        [
          { cell: 'app-1' },
          { cell: 'openshift-gitops' },
          { cell: 'Synced' },
          { cell: '⋮', props: { style: { width: 10, paddingTop: 8 } } },
        ],
      ],
    });

    const nameCol = asThObject(columns[0]);
    const nsCol = asThObject(columns[1]);
    const syncCol = asThObject(columns[2]);
    const actionsCol = asThObject(columns[3]);

    // Console nameCellProps exactly
    expect(nameCol.props).toMatchObject({
      isStickyColumn: true,
      hasRightBorder: true,
      stickyMinWidth: '0',
      modifier: 'nowrap',
    });
    expect(nameCol.props?.stickyLeftOffset).toBeUndefined();
    expect(nameCol.props?.stickyRightOffset).toBeUndefined();
    // Width utilities stripped; no leftover className
    expect(nameCol.props?.className).toBeUndefined();
    expect(nsCol.props?.className).toBeUndefined();
    expect(nameCol.resizableProps).toMatchObject({
      isResizable: true,
      resizeButtonAriaLabel: 'Resize Name column',
    });
    expect(nameCol.resizableProps?.minWidth).toBeUndefined();
    expect(nsCol.resizableProps?.isResizable).toBe(true);
    expect(nsCol.props?.modifier).toBe('nowrap');
    // Console does not force nowrap on other data columns
    expect(syncCol.props?.modifier).toBeUndefined();

    // Console actions header (no isActionCell)
    expect(actionsCol.resizableProps).toBeUndefined();
    expect(actionsCol.props).toMatchObject({
      isStickyColumn: true,
      hasLeftBorder: true,
      stickyMinWidth: '0',
      'aria-label': 'actions',
    });
    expect(actionsCol.props?.stickyLeftOffset).toBeUndefined();
    expect(actionsCol.props?.stickyRightOffset).toBeUndefined();
    expect(actionsCol.props?.className).toBeUndefined();
    expect(actionsCol.props).not.toHaveProperty('isActionCell');

    const row = rows[0];
    expect(Array.isArray(row)).toBe(true);
    if (!Array.isArray(row)) {
      throw new Error('expected row cells');
    }
    const nameCell = asTdObject(row[0]);
    const nsCell = asTdObject(row[1]);
    const syncCell = asTdObject(row[2]);
    const actionsCell = asTdObject(row[3]);

    expect(nameCell.props).toMatchObject({
      isStickyColumn: true,
      hasRightBorder: true,
      modifier: 'nowrap',
    });
    expect(nsCell.props?.modifier).toBe('nowrap');
    expect(syncCell.props?.modifier).toBeUndefined();
    // Console actionsCellProps exactly
    expect(actionsCell.props).toEqual({
      isStickyColumn: true,
      stickyMinWidth: '0',
      hasLeftBorder: true,
      isActionCell: true,
    });
  });

  it('does not treat the last column as actions when it has a title', () => {
    const { columns, rows } = enhanceGitOpsDataViewLayout({
      columns: [{ cell: 'Name' }, { cell: 'Status' }],
      rows: [[{ cell: 'a' }, { cell: 'ok' }]],
    });

    const statusCol = asThObject(columns[1]);
    expect(statusCol.resizableProps?.isResizable).toBe(true);
    expect(statusCol.props?.isStickyColumn).toBeUndefined();

    const row = rows[0];
    if (!Array.isArray(row)) {
      throw new Error('expected row cell');
    }
    const statusCell = asTdObject(row[1]);
    expect(statusCell.props?.isStickyColumn).toBeUndefined();
    expect(statusCell.props?.modifier).toBeUndefined();
  });

  it('still marks actions cells when stickyActionsColumn is false', () => {
    const { rows } = enhanceGitOpsDataViewLayout({
      columns: [
        { cell: 'Name', props: { 'aria-label': 'name' } },
        { cell: '', props: { 'aria-label': 'actions' } },
      ],
      rows: [[{ cell: 'a' }, { cell: '⋮' }]],
      stickyActionsColumn: false,
    });

    const row = rows[0];
    if (!Array.isArray(row)) {
      throw new Error('expected row cells');
    }
    expect(asTdObject(row[1]).props).toEqual({ isActionCell: true });
  });

  it('preserves non-width header classNames (e.g. History id column)', () => {
    const { columns } = enhanceGitOpsDataViewLayout({
      columns: [
        {
          cell: 'Id',
          props: {
            'aria-label': 'id',
            className: 'gitops-plugin__history-id-column pf-m-width-20',
          },
        },
        { cell: '', props: { 'aria-label': 'actions' } },
      ],
      rows: [[{ cell: '1' }, { cell: '⋮' }]],
    });
    expect(asThObject(columns[0]).props?.className).toBe('gitops-plugin__history-id-column');
  });

  it('does not stamp index-fallback ids as aria-label (History-style headers)', () => {
    const { columns } = enhanceGitOpsDataViewLayout({
      columns: [
        { cell: 'Deployed At', props: { sort: {} } },
        { cell: 'Initiated By', props: { sort: {} } },
        { cell: '', props: { 'aria-label': 'actions' } },
      ],
      rows: [[{ cell: 'a' }, { cell: 'b' }, { cell: '⋮' }]],
    });
    expect(asThObject(columns[0]).props).toMatchObject({ id: 'column-0' });
    expect(asThObject(columns[0]).props?.['aria-label']).toBeUndefined();
    expect(asThObject(columns[1]).props).toMatchObject({ id: 'column-1' });
    expect(asThObject(columns[1]).props?.['aria-label']).toBeUndefined();
  });

  it('skips resize handles when isResizable is false', () => {
    const { columns } = enhanceGitOpsDataViewLayout({
      columns: [
        { cell: 'Name', props: { 'aria-label': 'name' } },
        { cell: '', props: { 'aria-label': 'actions' } },
      ],
      rows: [[{ cell: 'a' }, { cell: '⋮' }]],
      isResizable: false,
    });
    expect(asThObject(columns[0]).resizableProps).toBeUndefined();
  });

  it('enhances object-form rows', () => {
    const { rows } = enhanceGitOpsDataViewLayout({
      columns: [
        { cell: 'Name', props: { 'aria-label': 'name' } },
        { cell: '', props: { 'aria-label': 'actions' } },
      ],
      rows: [{ id: 'r1', row: [{ cell: 'a' }, { cell: '⋮' }] }],
    });
    expect(rows[0]).toMatchObject({ id: 'r1' });
    if (!rows[0] || typeof rows[0] !== 'object' || !('row' in rows[0])) {
      throw new Error('expected object-form row');
    }
    expect(asTdObject(rows[0].row[0]).props).toMatchObject({ isStickyColumn: true });
    expect(asTdObject(rows[0].row[1]).props).toMatchObject({ isActionCell: true });
  });
});
