import type {
  DataViewTd,
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/esm/DataViewTable';

/**
 * Type guards for DataView header/cell/row objects.
 * Local copies of PF helpers so Jest doesn't need to load ESM data-view.
 */
export const isDataViewThObject = (
  value: DataViewTh,
): value is Extract<DataViewTh, { cell: unknown }> =>
  value != null && typeof value === 'object' && 'cell' in value;

export const isDataViewTdObject = (
  value: DataViewTd,
): value is Extract<DataViewTd, { cell: unknown }> =>
  value != null && typeof value === 'object' && 'cell' in value;

export const isDataViewTrObject = (
  value: DataViewTr,
): value is Extract<DataViewTr, { row: unknown }> =>
  value != null && typeof value === 'object' && 'row' in value;
