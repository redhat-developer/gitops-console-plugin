import type { DataViewTh } from '@patternfly/react-data-view/dist/esm/DataViewTable';

import { isDataViewThObject } from './gitOpsDataViewGuards';

/**
 * Stable id for a column (width prefs / layout).
 * Order: props.id → aria-label → column-${index}. Skip actions. Never use title text.
 */
export const getGitOpsDataViewColumnId = (
  column: DataViewTh,
  index: number,
): string | undefined => {
  if (!isDataViewThObject(column)) {
    return undefined;
  }
  const props = column.props;
  if (props?.id != null && props.id !== '') {
    return String(props.id);
  }
  const ariaLabel = props?.['aria-label'];
  if (ariaLabel === 'actions') {
    return undefined;
  }
  if (typeof ariaLabel === 'string' && ariaLabel) {
    return ariaLabel;
  }
  return `column-${index}`;
};
