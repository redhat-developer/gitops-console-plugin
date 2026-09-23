import type { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';

import {
  type GitOpsColumnManagementModalColumn,
  type GitOpsManagedColumn,
  type ResolveActiveColumnIdsOptions,
  NAMESPACE_COLUMN_ID,
} from './types';

export const getManageableColumns = (columns: GitOpsManagedColumn[]): GitOpsManagedColumn[] =>
  columns.filter((column) => !column.alwaysShown);

export const getAlwaysShownColumnIds = (columns: GitOpsManagedColumn[]): string[] =>
  columns.filter((column) => column.alwaysShown).map((column) => column.id);

export const getDefaultActiveColumnIds = (columns: GitOpsManagedColumn[]): string[] => {
  const active = new Set(
    columns
      .filter((column) => column.alwaysShown || column.isShownByDefault)
      .map((column) => column.id),
  );
  return columns.map((column) => column.id).filter((id) => active.has(id));
};

export const resolveActiveColumnIds = ({
  columns,
  savedColumnIds,
  includeNamespaceColumn = true,
}: ResolveActiveColumnIdsOptions): string[] => {
  const manageable = getManageableColumns(columns);
  const knownIds = new Set(manageable.map((column) => column.id));
  const alwaysShownIds = getAlwaysShownColumnIds(columns);

  const defaultManageableIds = manageable
    .filter((column) => column.isShownByDefault)
    .map((column) => column.id);

  let activeManageableIds =
    savedColumnIds && savedColumnIds.length > 0
      ? savedColumnIds.filter((id) => knownIds.has(id))
      : defaultManageableIds;

  manageable.forEach((column) => {
    if (column.isUntoggleable && !activeManageableIds.includes(column.id)) {
      activeManageableIds = [...activeManageableIds, column.id];
    }
  });

  if (!includeNamespaceColumn) {
    activeManageableIds = activeManageableIds.filter((id) => id !== NAMESPACE_COLUMN_ID);
  }

  const active = new Set([...activeManageableIds, ...alwaysShownIds]);
  return columns.map((column) => column.id).filter((id) => active.has(id));
};

export const toColumnManagementModalColumns = (
  columns: GitOpsManagedColumn[],
  activeColumnIds: ReadonlySet<string> | string[],
  includeNamespaceColumn = true,
): GitOpsColumnManagementModalColumn[] => {
  const active = activeColumnIds instanceof Set ? activeColumnIds : new Set(activeColumnIds);

  return getManageableColumns(columns)
    .filter((column) => includeNamespaceColumn || column.id !== NAMESPACE_COLUMN_ID)
    .map((column) => ({
      id: column.id,
      title: column.title,
      isShown: active.has(column.id),
      isShownByDefault: column.isShownByDefault,
      isUntoggleable: column.isUntoggleable,
      additional: column.additional,
    }));
};

export const getSavableColumnIds = (
  columns: GitOpsManagedColumn[],
  modalColumns: GitOpsColumnManagementModalColumn[],
  previouslySavedIds?: string[] | null,
): string[] => {
  const managedByModal = new Set(modalColumns.map((column) => column.id));
  const shownFromModal = new Set(
    modalColumns.filter((column) => column.isShown).map((column) => column.id),
  );

  // Keep prefs for columns this modal did not offer (e.g. namespace while project-scoped).
  const preserved =
    previouslySavedIds?.filter((id) => !managedByModal.has(id)) ?? [];

  const fromModal = getManageableColumns(columns)
    .map((column) => column.id)
    .filter((id) => shownFromModal.has(id));

  return [...new Set([...preserved, ...fromModal])];
};

export const filterDataViewColumnsAndRows = (
  columns: DataViewTh[],
  rows: DataViewTr[],
  columnIds: string[],
  activeColumnIds: ReadonlySet<string> | string[],
): { columns: DataViewTh[]; rows: DataViewTr[] } => {
  const active = activeColumnIds instanceof Set ? activeColumnIds : new Set(activeColumnIds);
  const indexes = columnIds
    .map((id, index) => (active.has(id) ? index : -1))
    .filter((index) => index >= 0);

  const filteredColumns = indexes.map((index) => columns[index]);
  const filteredRows = rows.map((row) => {
    if (Array.isArray(row)) {
      return indexes.map((index) => row[index]);
    }
    return {
      ...row,
      row: indexes.map((index) => row.row[index]),
    };
  });

  return { columns: filteredColumns, rows: filteredRows };
};
