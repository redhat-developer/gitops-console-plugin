import type { MouseEvent } from 'react';
import * as React from 'react';

import { useUserSettings } from '@openshift-console/dynamic-plugin-sdk';
import type { DataViewTh } from '@patternfly/react-data-view/dist/esm/DataViewTable';

import { getGitOpsDataViewColumnId } from './gitOpsDataViewColumnId';
import { isDataViewThObject } from './gitOpsDataViewGuards';

/** Same shape as Console `ColumnWidthUserSettings` — widths by table ID then column ID. */
export type GitOpsColumnWidthSettings = Record<string, Record<string, number>>;

export const GITOPS_COLUMN_WIDTH_SETTING_KEY = 'gitops.tableColumnsWidth';

const isResizableColumn = (column: DataViewTh): boolean =>
  isDataViewThObject(column) && Boolean(column.resizableProps?.isResizable);

const tableHasSavedWidths = (
  columnWidths: GitOpsColumnWidthSettings | undefined,
  tableID: string,
): boolean => Boolean(columnWidths?.[tableID] && Object.keys(columnWidths[tableID]).length > 0);

type UseGitOpsDataViewResizableColumnsOptions = {
  columns: DataViewTh[];
  tableID?: string;
  isResizable?: boolean;
};

/** Mirror Console `useConsoleDataViewResizableColumns`. */
export const useGitOpsDataViewResizableColumns = ({
  columns,
  tableID,
  isResizable = true,
}: UseGitOpsDataViewResizableColumnsOptions): {
  columns: DataViewTh[];
  /** False until user settings have loaded. */
  widthsLoaded: boolean;
  /** Bumps only when Reset clears this table's widths (not on each resize). */
  resetEpoch: number;
  /** `pending` → `ready` after settings load; remount once to apply saved widths. */
  widthsReadyKey: string;
  /** Visible column ids — include in DataViewTable key. */
  tableColumnsKey: string;
} => {
  const enabled = Boolean(tableID && isResizable);
  // `undefined` default so an empty object is not written to settings.
  const [columnWidths, setColumnWidths, widthsLoaded] = useUserSettings<
    GitOpsColumnWidthSettings | undefined
  >(GITOPS_COLUMN_WIDTH_SETTING_KEY, undefined, enabled);

  const setColumnWidth = React.useCallback(
    (columnID: string, width: number) => {
      if (!tableID || !isResizable) {
        return;
      }
      setColumnWidths((previous) => ({
        ...previous,
        [tableID]: {
          ...previous?.[tableID],
          [columnID]: width,
        },
      }));
    },
    [tableID, isResizable, setColumnWidths],
  );

  const resizableColumns = React.useMemo(() => {
    if (!enabled || !tableID) {
      return columns;
    }

    return columns.map((column, index) => {
      if (
        !isDataViewThObject(column) ||
        !isResizableColumn(column) ||
        column.resizableProps?.onResize
      ) {
        return column;
      }

      const columnID = getGitOpsDataViewColumnId(column, index);
      if (!columnID) {
        return column;
      }

      const savedWidth = columnWidths?.[tableID]?.[columnID];
      // Seed via resizableProps.width only (layout strips style.width).
      return {
        ...column,
        resizableProps: {
          ...column.resizableProps,
          isResizable: true as const,
          width: savedWidth ?? column.resizableProps?.width,
          onResize: (
            _event: MouseEvent<HTMLDivElement>,
            _id: string | number | undefined,
            width: number,
          ) => setColumnWidth(columnID, width),
        },
      };
    });
  }, [columns, columnWidths, enabled, tableID, setColumnWidth]);

  const tableColumnsKey = React.useMemo(
    () =>
      JSON.stringify(
        resizableColumns.map((column, index) => getGitOpsDataViewColumnId(column, index) ?? index),
      ),
    [resizableColumns],
  );

  const [resetEpoch, setResetEpoch] = React.useState(0);
  const hadSavedWidthsRef = React.useRef(false);
  React.useEffect(() => {
    if (!enabled || !tableID || !widthsLoaded) {
      return;
    }
    const hasSaved = tableHasSavedWidths(columnWidths, tableID);
    if (hadSavedWidthsRef.current && !hasSaved) {
      setResetEpoch((epoch) => epoch + 1);
    }
    hadSavedWidthsRef.current = hasSaved;
  }, [columnWidths, enabled, tableID, widthsLoaded]);

  let widthsReadyKey = 'pending';
  if (!enabled) {
    widthsReadyKey = 'none';
  } else if (widthsLoaded) {
    widthsReadyKey = 'ready';
  }

  return {
    columns: resizableColumns,
    widthsLoaded: enabled ? widthsLoaded : true,
    resetEpoch,
    widthsReadyKey,
    tableColumnsKey,
  };
};

/** Toolbar reset — clears this table's widths; table hook bumps `resetEpoch`. */
export const useGitOpsResetColumnWidths = (
  tableID: string,
): { resetColumnWidths: () => void; canResetColumnWidths: boolean } => {
  const [, setColumnWidths, loaded] = useUserSettings<GitOpsColumnWidthSettings | undefined>(
    GITOPS_COLUMN_WIDTH_SETTING_KEY,
    undefined,
    true,
  );

  const resetColumnWidths = React.useCallback(() => {
    setColumnWidths((previous) => {
      if (!previous?.[tableID]) {
        return previous;
      }
      const remaining = { ...previous };
      delete remaining[tableID];
      return Object.keys(remaining).length > 0 ? remaining : undefined;
    });
  }, [setColumnWidths, tableID]);

  return {
    resetColumnWidths,
    canResetColumnWidths: loaded,
  };
};
