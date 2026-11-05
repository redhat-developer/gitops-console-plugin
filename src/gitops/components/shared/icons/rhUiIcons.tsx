import { createIcon } from '@patternfly/react-icons/dist/esm/createIcon';

/**
 * RhUi* icons ship in react-icons ≥6.6; we're on 6.4. Remove when we bump.
 */
export const RhUiColumnsIcon = createIcon({
  name: 'RhUiColumnsIcon',
  width: 32,
  height: 32,
  svgPath:
    'M15 24V14a1 1 0 0 1 2 0v10a1 1 0 0 1-2 0ZM31 4.5v23c0 .827-.673 1.5-1.5 1.5h-27c-.827 0-1.5-.673-1.5-1.5v-23C1 3.673 1.673 3 2.5 3h27c.827 0 1.5.673 1.5 1.5ZM29 11H3v16h26V11Z',
});

export const RhUiUndoIcon = createIcon({
  name: 'RhUiUndoIcon',
  width: 32,
  height: 32,
  svgPath:
    'M31 20c0 5.514-4.486 10-10 10H6a1 1 0 1 1 0-2h15c4.411 0 8-3.589 8-8s-3.589-8-8-8H4.414l6.293 6.293a.999.999 0 1 1-1.414 1.414l-7.647-7.646c-.283-.283-.439-.66-.439-1.061s.156-.777.439-1.061l7.646-7.646a.999.999 0 1 1 1.414 1.414L4.413 10h16.586c5.514 0 10 4.486 10 10Z',
});
