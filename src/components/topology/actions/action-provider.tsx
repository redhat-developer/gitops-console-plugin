import * as React from 'react';

import { Action } from '@openshift-console/dynamic-plugin-sdk';
import { getResource } from '@openshift-console/dynamic-plugin-sdk-internal';
import { GraphElement, isGraph } from '@patternfly/react-topology';

import { editRollout } from './creators';

export const useGitOpsActionProviderForTopology = (element: GraphElement) => {
  const actions = React.useMemo(() => {
    const resource = getResource(element);
    if (!resource) {
      return [];
    }
    if (!isGraph(element) && element.getType() !== 'rollout') {
      return [];
    }
    const addActions: Action[] = [];
    addActions.push(editRollout(resource));
    // addActions.push(getDeleteRolloutAction(resource)) // Add Delete action later
    // Look at console/frontend/packages/dev-console/src/actions/add-resources.tsx : disabledActionsFilter
    return addActions;
  }, [element]);
  return [actions, true, undefined];
};
const TYPE_APPLICATION_GROUP = 'part-of';

export const useTopologyActionProvider = ({ element }: { element: GraphElement }) => {
  const isRolloutApp =
    element.getType() === TYPE_APPLICATION_GROUP &&
    element.getId() === 'group:argo-rollout-instances';
  return React.useMemo(() => {
    if (isRolloutApp) {
      return [];
    }
    return [[], true, undefined];
  }, [isRolloutApp]);
};
