import * as React from 'react';
import * as _ from 'lodash';

import { K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';
import {
  OverviewItem,
  TopologyDataObject,
  TopologyDataResources,
} from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import {
  contextMenuActions,
  withContextMenu,
} from '@openshift-console/dynamic-plugin-sdk-internal';
import {
  GraphElement,
  nodeDragSourceSpec,
  NodeModel,
  withDragNode,
  withSelection,
} from '@patternfly/react-topology';
import { Model } from '@patternfly/react-topology/dist/esm/types';

import RolloutNode from './nodes/RolloutNode';
import { createRolloutItems, getRolloutTopologyNodeItems } from './gitops-topology-types';

export const mergeGroup = (newGroup: NodeModel, existingGroups: NodeModel[]): void => {
  if (!newGroup) {
    return;
  }
  // Remove any children from the new group that already belong to another group
  newGroup.children = newGroup.children?.filter(
    (c) => !existingGroups?.find((g) => g.children?.includes(c)),
  );
  // find and add the groups
  const existingGroup = existingGroups.find((g) => g.group && g.id === newGroup.id);
  if (!existingGroup) {
    existingGroups.push(newGroup);
  } else {
    newGroup.children.forEach((id) => {
      if (!existingGroup.children.includes(id)) {
        existingGroup.children.push(id);
      }
      mergeGroupData(newGroup, existingGroup);
    });
  }
};

const mergeGroupData = (newGroup: NodeModel, existingGroup: NodeModel): void => {
  if (!existingGroup.data?.groupResources && !newGroup.data?.groupResources) {
    return;
  }
  if (!existingGroup.data?.groupResources) {
    existingGroup.data.groupResources = [];
  }
  if (newGroup?.data?.groupResources) {
    newGroup.data.groupResources.forEach((obj) => {
      if (!existingGroup.data.groupResources.includes(obj)) {
        existingGroup.data.groupResources.push(obj);
      }
    });
  }
};

export const getRolloutTopologyDataModel = (
  namespace: string,
  resources: TopologyDataResources,
): Promise<Model> => {
  const rolloutsTopologyGraphModel: Model = { nodes: [], edges: [] };
  const rollouts = resources?.rollouts?.data;
  rollouts.forEach((res: K8sResourceKind) => {
    const item = createRolloutItems(res, resources);
    const data = createTopologyRolloutNodeData(res, item, 'rollout');
    rolloutsTopologyGraphModel.nodes.push(...getRolloutTopologyNodeItems(res, 'rollout', data));
    // This adds rollout to an application group
    mergeGroup(getRolloutTopologyGroupItems(res), rolloutsTopologyGraphModel.nodes);
  });
  return Promise.resolve(rolloutsTopologyGraphModel);
};

export const DEFAULT_NODE_PAD = 20;
export const DEFAULT_GROUP_PAD = 40;
export const GROUP_WIDTH = 300;
export const GROUP_HEIGHT = 180;
export const GROUP_PADDING = [
  DEFAULT_GROUP_PAD,
  DEFAULT_GROUP_PAD,
  DEFAULT_GROUP_PAD + 20,
  DEFAULT_GROUP_PAD,
];

export const getRolloutTopologyGroupItems = (rollout: K8sResourceKind): NodeModel => {
  const TYPE_APPLICATION_GROUP = 'part-of';
  return {
    id: 'group:argo-rollout-instances', // Group all instances of rollout nodes into one group per namespace
    type: TYPE_APPLICATION_GROUP,
    group: true,
    label: 'Argo Rollouts',
    children: [_.get(rollout, ['metadata', 'uid'])],
    width: GROUP_WIDTH,
    height: GROUP_HEIGHT,
    data: {
      groupResources: [rollout],
      resources: [_.get(rollout, ['metadata', 'uid'])],
      operatorKind: 'Rollout',
    },
    visible: false,
    collapsed: false,
    style: {
      padding: GROUP_PADDING,
    },
  };
};

export const createTopologyRolloutNodeData = (
  resource: K8sResourceKind,
  overviewItem: OverviewItem,
  type: string,
): TopologyDataObject => {
  const uid = _.get(resource, 'metadata.uid');
  const labels = _.get(resource, 'metadata.labels', {});
  const annotations = _.get(resource, 'metadata.annotations', {});
  return {
    id: uid,
    name: _.get(resource, 'metadata.name') || labels['app.kubernetes.io/instance'],
    type,
    resource,
    resources: { ...overviewItem },
    data: {
      kind: 'Rollout',
      obj: resource,
      resources: { ...overviewItem },
      builderImage: 'https://avatars.githubusercontent.com/u/30269780?s=200&v=4',
      editURL: annotations['app.openshift.io/edit-url'],
      vcsURI: annotations['app.openshift.io/vcs-uri'],
      vcsRef: annotations['app.openshift.io/vcs-ref'],
    },
  };
};

export const createTopologyRolloutServiceNodeData = (
  resource: K8sResourceKind,
  overviewItem: OverviewItem,
  childItem: OverviewItem,
  type: string,
): TopologyDataObject => {
  // const uid = _.get(resource, 'metadata.uid');
  const labels = _.get(resource, 'metadata.labels', {});
  // const annotations = _.get(resource, 'metadata.annotations', {});
  return {
    id: 'operator-backed-service-groupid', //uid,
    name: _.get(resource, 'metadata.name') || labels['app.kubernetes.io/instance'],
    type,
    resource,
    resources: { ...overviewItem },
    data: {
      kind: 'operator-backed-service',
      isOperatorBackedService: true,
      operatorKind: 'Rollout222',
      obj: resource,
      builderImage: 'https://avatars.githubusercontent.com/u/30269780?s=200&v=4',
    },
  };
};

// From console.topology/component/factory ViewComponentFactory
export const getRolloutViewComponentFactory = (
  kind,
  type,
): React.ComponentType<{ element: GraphElement }> | undefined => {
  switch (type) {
    case 'rollout':
      return withDragNode(nodeDragSourceSpec(type))(
        withSelection({ controlled: true })(withContextMenu(contextMenuActions)(RolloutNode)),
      );
  }
  return undefined;
};
