import { ApplicationResourceStatus } from '@gitops/models/ApplicationModel';
import { HealthStatusCode } from '@gitops/Statuses/HealthStatus';
import { HealthStatus } from '@gitops/utils/constants';
import { NodeModel, NodeStatus } from '@patternfly/react-topology';

export const NODE_DIAMETER = 50;
export const APP_NODE_WIDTH = 300;
export const APP_NODE_HEIGHT = 75;

export const kindToAbbr = (kind: string) => {
  const abbrKind = (kind.replace(/[^A-Z]/g, '') || kind.toUpperCase()).slice(0, 4);
  return abbrKind;
};

/**
 * Map health status with the Topology-specific node status
 * Use for the border color of the node
 * @param healthStatus
 * @returns
 */
export const getTopologyNodeStatus = (healthStatus: HealthStatusCode) => {
  let nodeStatus = NodeStatus.default;
  switch (healthStatus) {
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
  return nodeStatus;
};

// For the border color of the resource node to indicate the health status
// If the resource has no health status (from the CR) then the color is default
export const getResourceNodeHealthStatus = (healthStatus: string): NodeStatus => {
  switch (healthStatus) {
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

export const createSpacerNode = (rank: number, id: string, padding?: number): NodeModel => {
  return {
    id: id,
    type: 'spacer-node',
    data: {
      rank: rank,
    },
    style: { padding: padding || 0 },
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
