import * as React from 'react';
import { useSearchParams } from 'react-router-dom-v5-compat';

import DataView, { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import DataViewTable, {
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { useDataViewSort } from '@patternfly/react-data-view/dist/esm/Hooks';
import { ThProps } from '@patternfly/react-table';

type BodyStateKey = 'empty' | 'error';

export type GitOpsDataViewBodyStates = Partial<Record<BodyStateKey, React.ReactNode>>;

export type GitOpsDataViewTableProps = {
  columns: DataViewTh[];
  rows: DataViewTr[];
  /**
   * Whether the table should display its empty state.
   */
  isEmpty?: boolean;
  /**
   * Optional custom empty state body.
   */
  emptyState?: React.ReactNode;
  /**
   * Whether the table should display its error state.
   */
  isError?: boolean;
  /**
   * Optional custom error state body.
   */
  errorState?: React.ReactNode;
  /**
   * Additional body states to pass through to the DataViewTable.
   * These are merged with the computed empty and error states (if provided).
   */
  bodyStates?: Record<string, React.ReactNode>;
  /**
   * Explicit active state override. When omitted, the component determines
   * the appropriate state based on isEmpty and isError.
   */
  activeState?: DataViewState | null;
};

const mergeBodyStates = (
  baseStates: Record<string, React.ReactNode> | undefined,
  additions: GitOpsDataViewBodyStates,
): Record<string, React.ReactNode> | undefined => {
  const states: Record<string, React.ReactNode> = { ...(baseStates || {}) };

  Object.entries(additions).forEach(([key, value]) => {
    if (value) {
      states[key] = value;
    }
  });

  return Object.keys(states).length > 0 ? states : undefined;
};

export const GitOpsDataViewTable: React.FC<GitOpsDataViewTableProps> = ({
  columns,
  rows,
  isEmpty,
  emptyState,
  isError,
  errorState,
  bodyStates,
  activeState,
}) => {
  const resolvedBodyStates = React.useMemo(
    () =>
      mergeBodyStates(bodyStates, {
        empty: isEmpty ? emptyState : undefined,
        error: isError ? errorState : undefined,
      }),
    [bodyStates, emptyState, errorState, isEmpty, isError],
  );

  const resolvedActiveState = React.useMemo(() => {
    if (activeState !== undefined) {
      return activeState;
    }
    if (isError) {
      return DataViewState.error;
    }
    if (isEmpty) {
      return DataViewState.empty;
    }
    return null;
  }, [activeState, isEmpty, isError]);

  return (
    <DataView activeState={resolvedActiveState}>
      <DataViewTable columns={columns} rows={rows} bodyStates={resolvedBodyStates} />
    </DataView>
  );
};

export interface GitOpsDataViewSortConfig {
  key: string;
}

export interface UseGitOpsDataViewSortResult {
  searchParams: URLSearchParams;
  setSearchParams: GitOpsSetSearchParams;
  sortBy: string | undefined;
  direction: 'asc' | 'desc' | undefined;
  getSortParams: (columnIndex: number) => ThProps['sort'];
  sortByIndex: number;
}

/**
 * Hook that encapsulates common sorting behaviour for PatternFly DataView tables.
 * It keeps sort state synchronised with the page URL search params for consistency
 * across GitOps plugin tables.
 */
export const useGitOpsDataViewSort = (
  columns: GitOpsDataViewSortConfig[],
): UseGitOpsDataViewSortResult => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { sortBy, direction, onSort } = useDataViewSort({ searchParams, setSearchParams });

  const sortByIndex = React.useMemo(
    () => columns.findIndex((column) => column.key === sortBy),
    [columns, sortBy],
  );

  const getSortParams = React.useCallback(
    (columnIndex: number): ThProps['sort'] => ({
      sortBy: {
        index: sortByIndex,
        direction,
        defaultDirection: 'asc',
      },
      onSort: (_event: any, index: number, dir: 'asc' | 'desc') => {
        const target = columns[index];

        // Only attempt to update the sort if the column configuration exists.
        if (target) {
          onSort(_event, target.key, dir);
        }
      },
      columnIndex,
    }),
    [columns, direction, onSort, sortByIndex],
  );

  return {
    searchParams,
    setSearchParams,
    sortBy,
    direction,
    getSortParams,
    sortByIndex,
  };
};

type GitOpsSetSearchParams = ReturnType<typeof useSearchParams>[1];
