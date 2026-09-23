import * as React from 'react';

import { useUserSettings } from '@openshift-console/dynamic-plugin-sdk';

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
  getGitOpsColumnManagementSettingKey,
} from './types';

export type UseGitOpsColumnManagementOptions = {
  columnManagementID: string;
  columns: GitOpsManagedColumn[];
  resourceType: string;
  includeNamespaceColumn?: boolean;
  showNamespaceHelp?: boolean;
};

export type UseGitOpsColumnManagementResult = {
  loaded: boolean;
  activeColumnIds: string[];
  activeColumnIdSet: Set<string>;
  visibleColumns: GitOpsManagedColumn[];
  isColumnActive: (columnId: string) => boolean;
  columnManagement: React.ReactElement;
  applyColumns: (modalColumns: GitOpsColumnManagementModalColumn[]) => void;
  filterDataView: typeof filterDataViewColumnsAndRows;
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
      <GitOpsColumnManagementControl
        appliedColumns={appliedModalColumns}
        applyColumns={applyColumns}
        resourceType={resourceType}
        showNamespaceHelp={showNamespaceHelp}
      />
    ),
    [appliedModalColumns, applyColumns, resourceType, showNamespaceHelp],
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
  };
};
