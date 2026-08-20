import * as React from 'react';
import { useSearchParams } from 'react-router-dom-v5-compat';

import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { Pagination, PaginationVariant } from '@patternfly/react-core';
import DataView, { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import DataViewTable, {
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/esm/DataViewTable';
import DataViewToolbar from '@patternfly/react-data-view/dist/esm/DataViewToolbar';
import { useDataViewPagination, useDataViewSort } from '@patternfly/react-data-view/dist/esm/Hooks';
import { ThProps } from '@patternfly/react-table';

import {
  getGitOpsPaginationResetKey,
  GITOPS_DEFAULT_PER_PAGE,
  GITOPS_PER_PAGE_OPTIONS,
  paginateItems,
} from './gitOpsDataViewPagination';

let gitOpsPaginationInstanceCounter = 0;

const useGitOpsPaginationWidgetIdBase = (): string => {
  const idRef = React.useRef<string>();
  if (!idRef.current) {
    gitOpsPaginationInstanceCounter += 1;
    idRef.current = `gitops-pagination-${gitOpsPaginationInstanceCounter}`;
  }
  return idRef.current;
};

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
   * Whether the table should display its loading state.
   */
  isLoading?: boolean;
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
  /**
   * Total number of filtered items. Required when pagination is enabled so the
   * pager can show "1-50 of N" against the full result set, not the current page.
   */
  itemCount?: number;
  /**
   * Optional PF pagination state. When omitted, the table renders every row.
   */
  pagination?: GitOpsDataViewPagination;
};

export type GitOpsDataViewPagination = {
  page: number;
  perPage: number;
  onSetPage: (
    event: React.MouseEvent | React.KeyboardEvent | MouseEvent | undefined,
    newPage: number,
  ) => void;
  onPerPageSelect: (
    event: React.MouseEvent | React.KeyboardEvent | MouseEvent | undefined,
    newPerPage: number,
  ) => void;
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
  isLoading,
  emptyState,
  isError,
  errorState,
  bodyStates,
  activeState,
  itemCount,
  pagination,
}) => {
  const paginationWidgetIdBase = useGitOpsPaginationWidgetIdBase();
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
    if (isLoading) {
      return DataViewState.loading;
    }
    if (isError) {
      return DataViewState.error;
    }
    if (isEmpty) {
      return DataViewState.empty;
    }
    return null;
  }, [activeState, isEmpty, isError, isLoading]);

  const paginationItemCount = itemCount ?? 0;
  const showPagination = !!pagination && paginationItemCount > 0 && !isError && !isLoading;

  return (
    <DataView activeState={resolvedActiveState}>
      {showPagination && pagination && (
        <DataViewToolbar
          pagination={
            <GitOpsPagination
              itemCount={paginationItemCount}
              pagination={pagination}
              variant={PaginationVariant.top}
              widgetId={`${paginationWidgetIdBase}-top`}
            />
          }
        />
      )}
      <DataViewTable columns={columns} rows={rows} bodyStates={resolvedBodyStates} />
      {showPagination && pagination && (
        <DataViewToolbar
          pagination={
            <GitOpsPagination
              itemCount={paginationItemCount}
              pagination={pagination}
              variant={PaginationVariant.bottom}
              widgetId={`${paginationWidgetIdBase}-bottom`}
            />
          }
        />
      )}
    </DataView>
  );
};

const GitOpsPagination: React.FC<{
  itemCount: number;
  pagination: GitOpsDataViewPagination;
  variant: PaginationVariant;
  widgetId: string;
}> = ({ itemCount, pagination, variant, widgetId }) => {
  const { t } = useGitOpsTranslation();

  return (
    <Pagination
      itemCount={itemCount}
      perPageOptions={GITOPS_PER_PAGE_OPTIONS}
      variant={variant}
      widgetId={widgetId}
      titles={{
        paginationAriaLabel: t('Pagination'),
        toFirstPageAriaLabel: t('Go to first page'),
        toPreviousPageAriaLabel: t('Go to previous page'),
        toNextPageAriaLabel: t('Go to next page'),
        toLastPageAriaLabel: t('Go to last page'),
        itemsPerPage: t('Items per page'),
        perPageSuffix: t('per page'),
        ofWord: t('of'),
      }}
      {...pagination}
    />
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
  const { sortBy, direction, onSort } = useDataViewSort({
    initialSort: { sortBy: 'name', direction: 'asc' },
    searchParams,
    setSearchParams,
  });

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

/**
 * Client-side pagination for GitOps DataView tables. Matches Console: 10/20/50/100,
 * default 50, page and perPage stored in the URL. Resets to page 1 when resetKey changes
 * (filters, search, namespace) and clamps when the result set shrinks.
 */
export const useGitOpsDataViewPagination = ({
  itemCount,
  resetKey,
}: {
  itemCount: number;
  resetKey?: string;
}): GitOpsDataViewPagination => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setMergedSearchParams = React.useCallback(
    (params: URLSearchParams) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        params.forEach((value, key) => {
          next.set(key, value);
        });
        return next;
      });
    },
    [setSearchParams],
  );

  const pagination = useDataViewPagination({
    perPage: GITOPS_DEFAULT_PER_PAGE,
    searchParams,
    setSearchParams: setMergedSearchParams,
  });
  const { page, perPage, onSetPage } = pagination;
  const previousResetKey = React.useRef(resetKey);

  React.useEffect(() => {
    if (resetKey === undefined || previousResetKey.current === resetKey) {
      return;
    }
    previousResetKey.current = resetKey;
    if (page > 1) {
      onSetPage(undefined, 1);
    }
  }, [onSetPage, page, resetKey]);

  React.useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(itemCount / perPage) || 1);
    if (page > maxPage) {
      onSetPage(undefined, maxPage);
    }
  }, [itemCount, onSetPage, page, perPage]);

  return pagination;
};

/**
 * Wires URL pagination for a filtered GitOps list: reset on filter/search/namespace
 * changes, then return the current page of items for the table.
 */
export const useGitOpsListPagePagination = <T,>({
  items,
  namespace,
  searchParams,
}: {
  items: T[] | undefined;
  namespace?: string | null;
  searchParams: URLSearchParams;
}): {
  pagination: GitOpsDataViewPagination;
  pagedItems: T[];
  itemCount: number;
} => {
  const searchParamsKey = searchParams.toString();
  const paginationResetKey = React.useMemo(
    () => getGitOpsPaginationResetKey(namespace, new URLSearchParams(searchParamsKey)),
    [namespace, searchParamsKey],
  );
  const itemCount = items?.length ?? 0;
  const pagination = useGitOpsDataViewPagination({
    itemCount,
    resetKey: paginationResetKey,
  });
  const pagedItems = React.useMemo(
    () => paginateItems(items, pagination.page, pagination.perPage),
    [items, pagination.page, pagination.perPage],
  );

  return { pagination, pagedItems, itemCount };
};

type GitOpsSetSearchParams = ReturnType<typeof useSearchParams>[1];
