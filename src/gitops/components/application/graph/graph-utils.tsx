import { ApplicationKind, ApplicationResourceStatus } from '@gitops/models/ApplicationModel';
import { HealthStatus, SyncStatus } from '@gitops/utils/constants';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk';
import {
  EdgeStyle,
  LabelPosition,
  NodeModel,
  NodeShape,
  NodeStatus,
} from '@patternfly/react-topology';

import { RESOURCE_BADGE_COLORS, RESOURCE_COLORS } from './icons/resource-colours';

const NODE_DIAMETER = 50;

export const kindToAbbr = (kind: string) => {
  const abbrKind = (kind.replace(/[^A-Z]/g, '') || kind.toUpperCase()).slice(0, 4);
  return abbrKind;
};

const NODE_TYPE_APPLICATION = 'application-node';
const NODE_TYPE_APPLICATION_LABEL = 'Application';

// Map application health status with topology node status
const createApplicationNode = (application: ApplicationKind): NodeModel => {
  // This is for the border color of the application node.  It will be determined by the app's health status.
  let nodeStatus = NodeStatus.default;
  switch (application.status?.health?.status) {
    case HealthStatus.HEALTHY:
      nodeStatus = NodeStatus.success;
      break;
    case HealthStatus.MISSING:
      nodeStatus = NodeStatus.warning;
      break;
    case HealthStatus.PROGRESSING:
      nodeStatus = NodeStatus.info;
      break;
    case HealthStatus.DEGRADED:
      nodeStatus = NodeStatus.danger;
      break;
    default:
      nodeStatus = NodeStatus.default;
  }
  return {
    id:
      application.kind +
      '-' +
      (application?.metadata?.name ?? '') +
      '-' +
      application?.metadata?.namespace,
    type: NODE_TYPE_APPLICATION,
    label: NODE_TYPE_APPLICATION_LABEL,
    status: nodeStatus,
    width: 300,
    height: 75,
    data: {
      name: application?.metadata?.name,
      badge: 'A',
      badgeColor: RESOURCE_COLORS.get(
        RESOURCE_BADGE_COLORS.get('.co-m-resource-' + application?.kind.toLowerCase()),
      ),
      badgeBorderColor: RESOURCE_COLORS.get(
        RESOURCE_BADGE_COLORS.get('.co-m-resource-' + application?.kind.toLowerCase()),
      ),
      rank: 0,
      nodeStatus: nodeStatus,
      resourceHealthStatus: application?.status?.health?.status,
      appHealthStatus: application?.status?.health?.status,
      syncStatus: application?.status?.sync?.status,
    },
  };
};

export const getResourceNodeSyncStatus = (resource: ApplicationResourceStatus): NodeStatus => {
  switch (resource.status) {
    case 'Synced':
      return NodeStatus.success;
    case 'OutOfSync':
      return NodeStatus.warning;
    case 'Progressing':
      return NodeStatus.info;
    default:
      return NodeStatus.warning;
  }
};

// For the border color of the resource node to indicate the health status
// If the resource has no health status (from the CR) then the color is default
const getResourceNodeHealthStatus = (resource: ApplicationResourceStatus): NodeStatus => {
  switch (resource.health?.status) {
    case HealthStatus.HEALTHY:
      return NodeStatus.success;
    case HealthStatus.PROGRESSING:
      return NodeStatus.info;
    case HealthStatus.SUSPENDED:
    case HealthStatus.MISSING:
      return NodeStatus.warning;
    case HealthStatus.DEGRADED:
      return NodeStatus.danger;
    default:
      return NodeStatus.default;
  }
};

// For the border color of the group node to indicate the overall health status
const getGroupNodeHealthStatus = (
  resource: ApplicationResourceStatus,
  resources: ApplicationResourceStatus[],
): NodeStatus => {
  const resourceHealthyCount = resources.filter(
    (res) => res.kind === resource.kind && res.health?.status === HealthStatus.HEALTHY,
  ).length;
  const resourceProgressingCount = resources.filter(
    (res) => res.kind === resource.kind && res.health?.status === HealthStatus.PROGRESSING,
  ).length;
  const resourceNotHealthyCount = resources.filter(
    (res) =>
      res.kind === resource.kind &&
      (res.health?.status === HealthStatus.SUSPENDED ||
        res.health?.status === HealthStatus.DEGRADED ||
        res.health?.status === HealthStatus.MISSING),
  ).length;

  if (resourceNotHealthyCount === 0 && resourceProgressingCount === 0 && resourceHealthyCount > 0) {
    return NodeStatus.success;
  } else if (resourceProgressingCount > 0 && resourceNotHealthyCount === 0) {
    return NodeStatus.info;
  } else if (resourceNotHealthyCount > 0) {
    return NodeStatus.warning;
  }
  return NodeStatus.default;
};

const createSpacerNode = (rank: number, id: string): NodeModel => {
  return {
    id: id,
    type: 'spacer-node',
    data: {
      rank: rank,
    },
  };
};

const createGroupResourceNode = (
  kind: string,
  resource: ApplicationResourceStatus,
  groupResourceNodeMap: Map<string, NodeModel>,
  resources: ApplicationResourceStatus[],
  allK8sModels: { [key: string]: K8sModel },
  resourceGroupExpandState: boolean,
): Map<string, NodeModel> => {
  const resourceCount = resources.filter((res) => res.kind === resource.kind).length;
  const resourceHealthyCount = resource.health
    ? resources.filter(
        (res) =>
          res.kind === resource.kind &&
          res.health?.hasOwnProperty('status') &&
          res.health.status === HealthStatus.HEALTHY,
      ).length
    : -1;
  // For performance reasons, check if only one resource is in any one of these states, and show it in the group.  Then, users
  // can look at further details to find out which specific resources and how many are problematic.
  let degradedCount = -1;
  let missingCount = -1;
  let progressingCount = -1;
  let suspendedCount = -1;
  let unknownCount = -1;
  if (resource.health && resourceHealthyCount < resourceCount) {
    degradedCount =
      resources.findIndex(
        (res) =>
          res.kind === resource.kind &&
          res.health?.hasOwnProperty('status') &&
          res.health.status === HealthStatus.DEGRADED,
      ) >= 0
        ? 1
        : 0;
    missingCount =
      resources.findIndex(
        (res) =>
          res.kind === resource.kind &&
          res.health?.hasOwnProperty('status') &&
          res.health.status === HealthStatus.MISSING,
      ) >= 0
        ? 1
        : 0;
    progressingCount =
      resources.findIndex(
        (res) =>
          res.kind === resource.kind &&
          res.health?.hasOwnProperty('status') &&
          res.health.status === HealthStatus.PROGRESSING,
      ) >= 0
        ? 1
        : 0;
    suspendedCount =
      resources.findIndex(
        (res) =>
          res.kind === resource.kind &&
          res.health?.hasOwnProperty('status') &&
          res.health.status === HealthStatus.SUSPENDED,
      ) >= 0
        ? 1
        : 0;
    unknownCount =
      resources.findIndex(
        (res) =>
          res.kind === resource.kind &&
          res.health?.hasOwnProperty('status') &&
          res.health.status === HealthStatus.UNKNOWN,
      ) >= 0
        ? 1
        : 0;
  }

  const resourceSyncedCount = resources.filter(
    (res) => res.kind === resource.kind && res.status === 'Synced',
  ).length;
  const resourceOutOfSyncCount = resources.filter(
    (res) => res.kind === resource.kind && res.status === 'OutOfSync',
  ).length;
  const resourceSyncUnknownCount = resources.filter(
    (res) => res.kind === resource.kind && res.status === 'Unknown',
  ).length;
  const groupStatus = getGroupNodeHealthStatus(resource, resources);

  let groupResourceNode = groupResourceNodeMap.get(kind);
  if (groupResourceNode === undefined || groupResourceNode === null) {
    groupResourceNode = {
      id: kind + '-node-group',
      type: 'node-group',
      label: allK8sModels[kind]?.labelPlural || kind + 's',
      shape: NodeShape.stadium,
      status: groupStatus,
      width: 280,
      height: 70,
      data: {
        rank: 2,
        kind: kind, // Group's kind
        kindPlural: allK8sModels[kind]?.labelPlural || kind + 's',
        resourceGroupExpandState: resourceGroupExpandState,
        nodeStatus: groupStatus,
        healthStatus: groupStatus,
        healthyCount: resourceHealthyCount,
        hasDegraded: degradedCount > 0,
        hasMissing: missingCount > 0,
        hasProgressing: progressingCount > 0,
        hasSuspended: suspendedCount > 0,
        hasUnknown: unknownCount > 0,
        syncStatus: groupStatus,
        syncedCount: 0,
        outOfSyncCount: 0,
        syncUnknownCount: 0,
        totalKindCount: 0,
        resourceCount: resourceCount,
        resourceSyncedCount: resourceSyncedCount,
        resourceOutOfSyncCount: resourceOutOfSyncCount,
        resourceSyncUnknownCount: resourceSyncUnknownCount,
        badge: allK8sModels[kind]?.abbr || kindToAbbr(kind),
        badgeColor:
          RESOURCE_COLORS.get(RESOURCE_BADGE_COLORS.get('.co-m-resource-' + kind.toLowerCase())) ||
          RESOURCE_COLORS.get('color-container-dark'),
        icon: kind,
        resourceChildrenIds: [],
      },
    };
  }
  const nodeId = resource.kind + '-' + resource.name + '-' + resource.namespace;
  groupResourceNode.data.resourceChildrenIds = [
    ...groupResourceNode.data.resourceChildrenIds,
    nodeId,
  ];
  if (resource.status === SyncStatus.SYNCED) {
    const i = groupResourceNode.data?.syncedCount;
    groupResourceNode.data.syncedCount = i + 1;
  } else if (resource.status === SyncStatus.OUT_OF_SYNC) {
    const i = groupResourceNode.data?.outOfSyncCount;
    groupResourceNode.data.outOfSyncCount = i + 1;
  }
  groupResourceNode.data.totalKindCount++;
  groupResourceNodeMap.set(kind, groupResourceNode);
  return groupResourceNodeMap;
};

// Application Graph Nodes
export const getInitialNodes = (
  application: ApplicationKind,
  resources: ApplicationResourceStatus[],
  allK8sModels: { [key: string]: K8sModel },
  showGroupNodes: boolean,
  groupNodeStates: string[],
) => {
  // This contains all the nodes we want to add to the graph view
  const initialNodes: NodeModel[] = [];
  // This contains all the group nodes for each resource kind: kind to model map
  let groupResourceNodeMap = new Map<string, NodeModel>();

  // Step 1. Create the Application Node
  initialNodes.push(createApplicationNode(application));

  // Step 2: Proceed with adding more nodes only if the application has resources
  // If we use the resource tree in the future, this will change
  if (resources && resources.length > 0) {
    // Spacer node to the right of the application node. Fixed.
    initialNodes.push(createSpacerNode(1, 'application-node-spacer'));
    // Add child resources
    resources.forEach((resource) => {
      const kind = resource.kind;
      const badgeLabel = allK8sModels[kind]?.abbr || kindToAbbr(kind);
      const color =
        RESOURCE_COLORS.get(
          RESOURCE_BADGE_COLORS.get('.co-m-resource-' + resource.kind.toLowerCase()),
        ) || RESOURCE_COLORS.get('color-container-dark');
      const nodeId = resource.kind + '-' + resource.name + '-' + resource.namespace;
      const key = resource.kind + 's';
      const resourceGroupExpandState = groupNodeStates.includes(key);

      if (showGroupNodes && resources.filter((res) => res.kind === resource.kind).length > 1) {
        groupResourceNodeMap = createGroupResourceNode(
          kind,
          resource,
          groupResourceNodeMap,
          resources,
          allK8sModels,
          resourceGroupExpandState,
        );

        if (!initialNodes.includes(groupResourceNodeMap.get(kind))) {
          initialNodes.push(groupResourceNodeMap.get(kind));
        }
      }
      const healthStatus = getResourceNodeHealthStatus(resource);
      if (
        !showGroupNodes ||
        !groupResourceNodeMap.has(kind) ||
        (showGroupNodes && resourceGroupExpandState)
      ) {
        initialNodes.push({
          id: nodeId,
          type: 'node',
          label: resource.kind,
          width: 280,
          height: NODE_DIAMETER,
          labelPosition: LabelPosition.bottom,
          shape: NodeShape.rect,
          status: healthStatus,
          data: {
            name: resource.name,
            group: resource.group,
            kind: resource.kind,
            version: resource.version,
            namespace: resource.namespace,
            indent: 100,
            healthStatus: healthStatus,
            resourceHealthStatus: resource.health?.status || undefined,
            syncStatus: resource.status,
            rank: 5,
            badgeColor: color,
            badge: badgeLabel,
            icon: kind,
          },
        });
      }
    });
    showGroupNodes &&
      groupResourceNodeMap.forEach((groupNode) => {
        const idsOfChildren: string[] = [];
        initialNodes
          .filter((node) => node.data.kind === groupNode.data.kind && node.type === 'node')
          .forEach((n) => {
            idsOfChildren.push(n.id);
          });
        if (!initialNodes.includes(groupNode)) {
          initialNodes.push(groupNode);
        }
        const key = groupNode.data.kind + 's';
        const resourceGroupExpandState = groupNodeStates.includes(key);
        if (showGroupNodes && resourceGroupExpandState) {
          const organizerResourceNode = {
            id: groupNode.data.kind + '-container',
            type: 'group',
            group: true,
            rank: 3,
            children: [
              groupNode.data.kind + '-node-group',
              groupNode.data.kind + '-node-spacer',
              ...idsOfChildren,
            ],
            borderRadius: 0,
            collapsible: false,
            selectable: false,
            hideContextMenuKebab: true,
            hulledOutline: false,
            style: { padding: 40 },
            data: {
              kind: groupNode.data.kind,
            },
          };
          initialNodes.push({
            id: groupNode.data.kind + '-node-spacer',
            type: 'spacer-node',
            data: {
              rank: 4,
              kind: groupNode.data.kind,
              healthStatus: groupNode.data.healthStatus,
              syncStatus: groupNode.data.syncStatus,
            },
          });
          initialNodes.push(organizerResourceNode);
        }
      });
    if (showGroupNodes) {
      const idsOfChildren: string[] = [];
      groupResourceNodeMap.forEach((groupNode) => {
        idsOfChildren.push(groupNode.id);
      });
      const transparentGroupsOfGroups = {
        id: 'transparent-group-of-groups-container',
        type: 'group',
        group: true,
        children: [...idsOfChildren],
        borderRadius: 0,
        collapsible: false,
        selectable: false,
        hideContextMenuKebab: true,
        hulledOutline: false,
        style: { padding: 40 },
      };
      initialNodes.push(transparentGroupsOfGroups);
    }
  }
  return initialNodes;
};

export const getInitialEdges = (
  application: ApplicationKind,
  nodes: NodeModel[],
  showGroupNodes: boolean,
) => {
  const initialEdges = [];
  if (nodes.length > 1) {
    initialEdges.push({
      id: 'e-application',
      type: 'edge',
      source:
        application.kind +
        '-' +
        (application.metadata?.name ?? '') +
        '-' +
        application.metadata?.namespace,
      target: 'application-node-spacer',
      edgeStyle: EdgeStyle.default,
    });
    nodes.forEach((node: NodeModel, index: number) => {
      // Application spacer to group node edge
      if (showGroupNodes && node.type === 'node-group') {
        initialEdges.push({
          id: 'e-' + node.data.kind + '-node-group',
          type: 'edge',
          source: 'application-node-spacer',
          target: node.id,
          edgeStyle: EdgeStyle.dotted,
          data: {
            indent: 100,
          },
        });
      }
      if (showGroupNodes && node.data?.kind && node.type === 'spacer-node') {
        initialEdges.push({
          id: 'e-' + node.data.kind + '-node-group-connector',
          type: 'data-edge', //
          source: node.data.kind + '-node-group',
          target: node.data.kind + '-node-spacer',
          edgeStyle: EdgeStyle.dotted,
          data: {
            indent: 100,
          },
        });
      }
      if (
        node.type != 'application-node' &&
        node.type != 'spacer-node' &&
        node.type != 'node-group' &&
        node.type != 'group'
      ) {
        if (node.type === 'node') {
          const b =
            nodes.filter(
              (res) => res.type === 'node-group' && res.id === node.label + '-node-group',
            ).length > 0;
          initialEdges.push({
            id: 'e-' + node.label + '-' + index,
            type: 'edge',
            nodeSeparation: 0,
            source: showGroupNodes && b ? node.label + '-node-spacer' : 'application-node-spacer',
            target: node.id,
            edgeStyle: EdgeStyle.default,
            data: {
              indent: 100,
            },
          });
        }
      }
    });
  }
  return initialEdges;
};
