import * as React from 'react';

import { Node } from '@patternfly/react-topology/src/types';

import ArgoRolloutNodeDecorator from './ArgoRolloutNodeDecorator';

export const getArgoRolloutNodeDecorator = (
  element: Node,
  radius: number,
  x: number,
  y: number,
): React.ReactNode => {
  if (element.getType() !== 'rollout' || element.isCollapsed()) {
    return <></>;
  }
  return <ArgoRolloutNodeDecorator element={element} radius={radius} x={x} y={y} />;
};
