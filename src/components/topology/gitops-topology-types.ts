import * as _ from 'lodash';

import { K8sResourceKind, K8sResourceKindReference } from '@openshift-console/dynamic-plugin-sdk';
import {
  OdcNodeModel,
  OverviewItem,
  TopologyDataObject,
  TopologyDataResources,
} from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { NodeModel, NodeShape } from '@patternfly/react-topology';

const NODE_PADDING = [0, 20];

const getOwnedResources = <T extends K8sResourceKind>(
  obj: K8sResourceKind,
  resources: T[],
): T[] => {
  const uid = obj?.metadata?.uid;
  if (!uid) {
    return [];
  }
  return _.filter(resources, ({ metadata: { ownerReferences } }) => {
    return _.some(ownerReferences, {
      uid,
      controller: true,
    });
  });
};

export const createRolloutItems = (
  resource: K8sResourceKind,
  resources: TopologyDataResources,
): OverviewItem => {
  let associatedDeployment = getOwnedResources(resource, resources.deployments.data);
  associatedDeployment = [...associatedDeployment];
  if (!_.isEmpty(associatedDeployment)) {
    const overviewItems: OverviewItem = {
      obj: resource,
    };
    return overviewItems;
  }
};

export const createRolloutServiceItems = (
  resource: K8sResourceKind,
  resources: TopologyDataResources,
): OverviewItem => {
  let associatedDeployment = getOwnedResources(resource, resources.deployments.data);
  associatedDeployment = [...associatedDeployment];
  if (!_.isEmpty(associatedDeployment)) {
    const overviewItems: OverviewItem = {
      obj: resource,
    };
    return overviewItems;
  }
};

export const getRolloutTopologyNodeItems = (
  resource: K8sResourceKind,
  type: string,
  data: TopologyDataObject,
): NodeModel[] => {
  const nodes = [];
  const children: string[] = [];
  const nodeItem = getTopologyNodeItem(resource, type, data, getGitOpsNodeModelProps(), children);
  nodes.push(nodeItem);
  return nodes;
};

export const getRolloutTopologyServiceNodeItems = (
  resource: K8sResourceKind,
  type: string,
  data: TopologyDataObject,
): NodeModel[] => {
  const nodes = [];
  const children: string[] = [];
  const nodeItem = getTopologyServiceNodeItem(
    resource,
    type,
    data,
    getGitOpsServiceNodeModelProps(type),
    children,
  );
  nodes.push(nodeItem);
  return nodes;
};

export const getTopologyNodeItem = (
  resource: K8sResourceKind,
  type: string,
  data: any,
  nodeProps?: Omit<OdcNodeModel, 'type' | 'data' | 'children' | 'id' | 'label'>,
  children?: string[],
  resourceKind?: K8sResourceKindReference,
  shape?: NodeShape,
): OdcNodeModel => {
  const uid = resource?.metadata.uid;
  const name = resource?.metadata.name;
  const label = resource?.metadata.labels?.['app.openshift.io/instance'];
  const kind = resource.kind;
  return {
    id: uid,
    type,
    label: label || name,
    shape,
    resource,
    resourceKind: kind,
    data,
    ...(children && children.length && { children }),
    ...(nodeProps || {}),
  };
};

export const getTopologyServiceNodeItem = (
  resource: K8sResourceKind,
  type: string,
  data: any,
  nodeProps?: Omit<OdcNodeModel, 'type' | 'data' | 'children' | 'id' | 'label'>,
  children?: string[],
): OdcNodeModel => {
  const uid = 'gitops-rollout-service-uid' + resource?.metadata.uid;
  const kind = 'gitops-rollout-group' + resource.kind;

  return {
    id: uid,
    type,
    resource,
    resourceKind: kind,
    children: [_.get(resource, ['metadata', 'uid'])],
    data: {
      ...data,
      groupResources: [resource],
      resources: [_.get(resource, ['metadata', 'uid'])],
      operatorKind: 'Rollout',
    },
    ...(children && children.length && { children }),
    ...(nodeProps || {}),
  };
};

export const getGitOpsNodeModelProps = () => {
  return {
    width: 104,
    height: 104,
    visible: true,
    collapsed: false,
    group: false,
    style: {
      padding: NODE_PADDING,
    },
  };
};

export const getGitOpsServiceNodeModelProps = (type: string) => {
  return {
    group: true,
    operatorKind: type,
  };
};
