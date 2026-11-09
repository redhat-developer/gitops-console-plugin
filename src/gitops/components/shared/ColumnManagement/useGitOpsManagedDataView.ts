import * as React from 'react';

import type { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import type { ThProps } from '@patternfly/react-table';

import type { GitOpsManagedColumn } from './types';
import { useGitOpsColumnManagement } from './useGitOpsColumnManagement';

type UseGitOpsManagedDataViewOptions = {
  columnManagementID: string;
  managedColumns: GitOpsManagedColumn[];
  resourceType: string;
  includeNamespaceColumn?: boolean;
  columns: DataViewTh[];
  rows: DataViewTr[];
};

/** Wire Manage columns + Reset + tableID filtering for detail/list DataView tables. */
export const useGitOpsManagedDataView = ({
  columnManagementID,
  managedColumns,
  resourceType,
  includeNamespaceColumn = false,
  columns,
  rows,
}: UseGitOpsManagedDataViewOptions) => {
  const { activeColumnIds, columnManagement, filterDataView, tableID } = useGitOpsColumnManagement({
    columnManagementID,
    columns: managedColumns,
    resourceType,
    includeNamespaceColumn,
  });

  const columnIds = React.useMemo(
    () => managedColumns.map((column) => column.id),
    [managedColumns],
  );

  const { columns: visibleColumns, rows: visibleRows } = filterDataView(
    columns,
    rows,
    columnIds,
    activeColumnIds,
  );

  return {
    columns: visibleColumns,
    rows: visibleRows,
    columnManagement,
    tableID,
  };
};

/** Build DataViewTh[] from a managed-column catalog (optional per-column sort + props). */
export const buildManagedDataViewColumns = (
  managedColumns: GitOpsManagedColumn[],
  titleById: Record<string, string>,
  getSortParams?: (columnIndex: number) => ThProps['sort'],
  columnSortConfig?: { key: string }[],
  extraPropsById?: Record<string, Record<string, unknown>>,
): DataViewTh[] =>
  managedColumns.map((column) => {
    const sortIndex = columnSortConfig?.findIndex((entry) => entry.key === column.id) ?? -1;
    return {
      id: column.id,
      cell: titleById[column.id] ?? column.title,
      props: {
        'aria-label': column.id,
        ...(getSortParams && sortIndex >= 0 ? { sort: getSortParams(sortIndex) } : {}),
        ...extraPropsById?.[column.id],
      },
    };
  });
