import * as React from 'react';

import { useUserSettings } from '@openshift-console/dynamic-plugin-sdk';

import {
  GitOpsResetColumnWidthsButton,
  useGitOpsResetColumnWidths,
} from '../DataView/resetColumnWidths';

import {
  filterDataViewColumnsAndRows,
  getDefaultActiveColumnIds,
  getSavableColumnIds,
  resolveActiveColumnIds,
  toColumnManagementModalColumns,
} from './columnManagementUtils';
import { GitOpsColumnManagementControl } from './GitOpsColumnManagementControl';
import {
  type GitOpsColumnManagementModalColumn,
  type GitOpsManagedColumn,
  type UseGitOpsColumnManagementOptions,
  getGitOpsColumnManagementSettingKey,
} from './types';

export type { UseGitOpsColumnManagementOptions };

export type UseGitOpsColumnManagementResult = {
  loaded: boolean;
  activeColumnIds: string[];
  activeColumnIdSet: Set<string>;
  visibleColumns: GitOpsManagedColumn[];
  isColumnActive: (columnId: string) => boolean;
  columnManagement: React.ReactElement;
  applyColumns: (modalColumns: GitOpsColumnManagementModalColumn[]) => void;
  filterDataView: typeof filterDataViewColumnsAndRows;
  /** Pass to GitOpsDataViewTable to save column widths. */
  tableID: string;
};

export const useGitOpsColumnManagement = ({
  columnManagementID,
  columns,
  resourceType,
  includeNamespaceColumn = true,
  showNamespaceHelp = false,
}: UseGitOpsColumnManagementOptions): UseGitOpsColumnManagementResult => {
  const settingKey = getGitOpsColumnManagementSettingKey(columnManagementID);
  const defaultIds = React.useMemo(() => getDefaultActiveColumnIds(columns), [columns]);

  const [savedColumnIds, setSavedColumnIds, loaded] = useUserSettings<string[]>(
    settingKey,
    defaultIds,
    true,
  );

  // Reset clears saved widths for this table.
  const { resetColumnWidths, canResetColumnWidths } =
    useGitOpsResetColumnWidths(columnManagementID);

  const activeColumnIds = React.useMemo(
    () =>
      resolveActiveColumnIds({
        columns,
        savedColumnIds: loaded ? savedColumnIds : defaultIds,
        includeNamespaceColumn,
      }),
    [columns, savedColumnIds, loaded, defaultIds, includeNamespaceColumn],
  );

  const activeColumnIdSet = React.useMemo(() => new Set(activeColumnIds), [activeColumnIds]);

  const visibleColumns = React.useMemo(
    () => columns.filter((column) => activeColumnIdSet.has(column.id)),
    [columns, activeColumnIdSet],
  );

  const appliedModalColumns = React.useMemo(
    () => toColumnManagementModalColumns(columns, activeColumnIdSet, includeNamespaceColumn),
    [columns, activeColumnIdSet, includeNamespaceColumn],
  );

  const applyColumns = React.useCallback(
    (modalColumns: GitOpsColumnManagementModalColumn[]) => {
      setSavedColumnIds(getSavableColumnIds(columns, modalColumns, savedColumnIds));
    },
    [columns, savedColumnIds, setSavedColumnIds],
  );

  const isColumnActive = React.useCallback(
    (columnId: string) => activeColumnIdSet.has(columnId),
    [activeColumnIdSet],
  );

  const columnManagement = React.useMemo(
    () => (
      <>
        <GitOpsColumnManagementControl
          appliedColumns={appliedModalColumns}
          applyColumns={applyColumns}
          resourceType={resourceType}
          showNamespaceHelp={showNamespaceHelp}
        />
        {canResetColumnWidths ? (
          <GitOpsResetColumnWidthsButton onReset={resetColumnWidths} />
        ) : null}
      </>
    ),
    [
      appliedModalColumns,
      applyColumns,
      resourceType,
      showNamespaceHelp,
      canResetColumnWidths,
      resetColumnWidths,
    ],
  );

  return {
    loaded,
    activeColumnIds,
    activeColumnIdSet,
    visibleColumns,
    isColumnActive,
    columnManagement,
    applyColumns,
    filterDataView: filterDataViewColumnsAndRows,
    tableID: columnManagementID,
  };
};
