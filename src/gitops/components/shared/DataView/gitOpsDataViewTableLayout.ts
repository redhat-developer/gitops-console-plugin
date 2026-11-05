import type { CSSProperties } from 'react';

import type {
  DataViewTd,
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/esm/DataViewTable';

import { getGitOpsDataViewColumnId } from './gitOpsDataViewColumnId';
import { isDataViewTdObject, isDataViewThObject, isDataViewTrObject } from './gitOpsDataViewGuards';

/** Shared sticky cell bits (match Console). */
const cellIsStickyProps = {
  isStickyColumn: true,
  stickyMinWidth: '0',
} as const;

/** Sticky Name + right border + nowrap. */
const GITOPS_NAME_STICKY_PROPS = {
  ...cellIsStickyProps,
  modifier: 'nowrap' as const,
  hasRightBorder: true,
};

/** Namespace: nowrap only. */
const GITOPS_NAMESPACE_CELL_PROPS = {
  modifier: 'nowrap' as const,
};

/** Sticky Actions header + left border. */
const GITOPS_ACTIONS_STICKY_TH_PROPS = {
  ...cellIsStickyProps,
  hasLeftBorder: true,
};

/** Sticky Actions body cell + left border. */
const GITOPS_ACTIONS_STICKY_TD_PROPS = {
  ...cellIsStickyProps,
  hasLeftBorder: true,
  isActionCell: true,
};

type DataViewThObject = Extract<DataViewTh, { cell: unknown }>;
type DataViewTdObject = Extract<DataViewTd, { cell: unknown }>;

const isActionsHeader = (column: DataViewTh): boolean => {
  if (!isDataViewThObject(column)) {
    return column === '' || column === null || column === undefined;
  }
  if (column.props?.['aria-label'] === 'actions') {
    return true;
  }
  return column.cell === '' || column.cell === null || column.cell === undefined;
};

const isNamespaceColumn = (columnId: string | undefined) => columnId === 'namespace';

const stripWidthStyles = (style: CSSProperties | undefined): CSSProperties | undefined => {
  if (!style) {
    return undefined;
  }
  const rest = { ...style };
  delete rest.width;
  delete rest.minWidth;
  delete rest.maxWidth;
  return Object.keys(rest).length > 0 ? rest : undefined;
};

/** Match pf-m-width-* / pf-m-fit-content only. */
const WIDTH_CLASS_RE = /\bpf-m-width-\S+\b|\bpf-m-fit-content\b/g;

const stripWidthClassName = (className: string | undefined): string | undefined => {
  if (!className) {
    return undefined;
  }
  const cleaned = className.replace(WIDTH_CLASS_RE, '').replace(/\s+/g, ' ').trim();
  return cleaned || undefined;
};

/** Remove fixed width styles/classes; keep other props (e.g. History class). */
const withoutWidthStyles = <T extends { style?: CSSProperties; className?: string }>(
  props: T | undefined,
): Omit<T, 'style' | 'className'> & { style?: CSSProperties; className?: string } => {
  const { style, className, ...rest } = (props ?? {}) as T;
  const cleanedStyle = stripWidthStyles(style);
  const cleanedClassName = stripWidthClassName(className);
  return {
    ...(rest as Omit<T, 'style' | 'className'>),
    ...(cleanedStyle ? { style: cleanedStyle } : {}),
    ...(cleanedClassName ? { className: cleanedClassName } : {}),
  };
};

const toThObject = (column: DataViewTh): DataViewThObject =>
  isDataViewThObject(column) ? { ...column } : { cell: column };

const toTdObject = (cell: DataViewTd): DataViewTdObject =>
  isDataViewTdObject(cell) ? { ...cell } : { cell };

const getColumnLabel = (columnObj: DataViewThObject, index: number): string => {
  if (typeof columnObj.cell === 'string' && columnObj.cell) {
    return columnObj.cell;
  }
  return columnObj.props?.['aria-label'] || `column ${index + 1}`;
};

const enhanceActionsHeader = (
  columnObj: DataViewThObject,
  stickyActionsColumn: boolean,
): DataViewTh => ({
  ...columnObj,
  props: {
    ...columnObj.props,
    style: undefined,
    className: undefined,
    ...(stickyActionsColumn ? GITOPS_ACTIONS_STICKY_TH_PROPS : {}),
    'aria-label': columnObj.props?.['aria-label'] ?? 'actions',
  },
  // Actions column is not resizable.
  resizableProps: undefined,
});

const enhanceDataHeader = (
  columnObj: DataViewThObject,
  index: number,
  {
    isFirst,
    isResizable,
    stickyNameColumn,
  }: { isFirst: boolean; isResizable: boolean; stickyNameColumn: boolean },
): DataViewTh => {
  const columnLabel = getColumnLabel(columnObj, index);
  const cleanedProps = withoutWidthStyles(columnObj.props);
  const columnId = getGitOpsDataViewColumnId({ ...columnObj, props: cleanedProps }, index);
  // Don't put column-N into aria-label (History has visible titles).
  const hasExplicitId = Boolean(columnId && columnId !== `column-${index}`);

  const namespaceNowrap =
    !isFirst && isNamespaceColumn(columnId) ? GITOPS_NAMESPACE_CELL_PROPS : undefined;
  const nonNameProps = {
    ...namespaceNowrap,
    ...(cleanedProps.modifier ? { modifier: cleanedProps.modifier } : {}),
  };

  return {
    ...columnObj,
    props: {
      ...cleanedProps,
      ...(columnId
        ? {
            id: columnId,
            ...(hasExplicitId ? { 'aria-label': cleanedProps['aria-label'] ?? columnId } : {}),
          }
        : {}),
      ...(isFirst && stickyNameColumn ? GITOPS_NAME_STICKY_PROPS : nonNameProps),
    },
    // Enable resize; width hook adds onResize later.
    resizableProps: isResizable
      ? {
          isResizable: true,
          resizeButtonAriaLabel: `Resize ${columnLabel} column`,
          ...columnObj.resizableProps,
        }
      : columnObj.resizableProps,
  };
};

const enhanceHeaderColumn = (
  column: DataViewTh,
  index: number,
  {
    lastIndex,
    hasActionsColumn,
    isResizable,
    stickyNameColumn,
    stickyActionsColumn,
  }: {
    lastIndex: number;
    hasActionsColumn: boolean;
    isResizable: boolean;
    stickyNameColumn: boolean;
    stickyActionsColumn: boolean;
  },
): DataViewTh => {
  const columnObj = toThObject(column);
  if (hasActionsColumn && index === lastIndex) {
    return enhanceActionsHeader(columnObj, stickyActionsColumn);
  }
  return enhanceDataHeader(columnObj, index, {
    isFirst: index === 0,
    isResizable,
    stickyNameColumn,
  });
};

const enhanceBodyCell = (
  cell: DataViewTd,
  index: number,
  {
    columns,
    lastIndex,
    hasActionsColumn,
    stickyNameColumn,
    stickyActionsColumn,
  }: {
    columns: DataViewTh[];
    lastIndex: number;
    hasActionsColumn: boolean;
    stickyNameColumn: boolean;
    stickyActionsColumn: boolean;
  },
): DataViewTd => {
  const cellObj = toTdObject(cell);
  const isFirst = index === 0;
  const isActions = hasActionsColumn && index === lastIndex;

  if (isFirst && stickyNameColumn) {
    return {
      ...cellObj,
      props: {
        ...withoutWidthStyles(cellObj.props),
        ...GITOPS_NAME_STICKY_PROPS,
      },
    };
  }
  if (isActions) {
    // Mark kebab cells (PF sizes via __action).
    return {
      ...cellObj,
      props: stickyActionsColumn ? { ...GITOPS_ACTIONS_STICKY_TD_PROPS } : { isActionCell: true },
    };
  }

  const headerId = getGitOpsDataViewColumnId(columns[index], index);
  return {
    ...cellObj,
    props: {
      ...withoutWidthStyles(cellObj.props),
      ...(isNamespaceColumn(headerId) ? GITOPS_NAMESPACE_CELL_PROPS : undefined),
    },
  };
};

/**
 * Apply sticky Name/Actions + resize handles (Console-style).
 * Called once from GitOpsDataViewTable for all lists.
 */
export const enhanceGitOpsDataViewLayout = ({
  columns,
  rows,
  isResizable = true,
  stickyNameColumn = true,
  stickyActionsColumn = true,
}: {
  columns: DataViewTh[];
  rows: DataViewTr[];
  isResizable?: boolean;
  stickyNameColumn?: boolean;
  stickyActionsColumn?: boolean;
}): { columns: DataViewTh[]; rows: DataViewTr[] } => {
  const lastIndex = columns.length - 1;
  const hasActionsColumn = lastIndex >= 0 && isActionsHeader(columns[lastIndex]);
  const layoutOpts = {
    lastIndex,
    hasActionsColumn,
    isResizable,
    stickyNameColumn,
    stickyActionsColumn,
  };

  const enhancedColumns = columns.map((column, index) =>
    enhanceHeaderColumn(column, index, layoutOpts),
  );

  const enhancedRows = rows.map((row) => {
    const cells = isDataViewTrObject(row) ? row.row : row;
    const enhancedCells = cells.map((cell, index) =>
      enhanceBodyCell(cell, index, { columns, ...layoutOpts }),
    );
    return isDataViewTrObject(row) ? { ...row, row: enhancedCells } : enhancedCells;
  });

  return { columns: enhancedColumns, rows: enhancedRows };
};
