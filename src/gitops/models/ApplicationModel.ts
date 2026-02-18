import { HealthStatus, PhaseStatus, SyncStatus } from 'src/gitops/utils/constants';
import { modelToRef, SyncStatusCode } from 'src/gitops/utils/utils';

import { HealthStatusCode } from '@gitops/Statuses/HealthStatus';
import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

export const ApplicationModel: K8sModel = {
  label: 'Application',
  labelPlural: 'Applications',
  apiVersion: 'v1alpha1',
  apiGroup: 'argoproj.io',
  plural: 'applications',
  abbr: 'app',
  namespaced: true,
  kind: 'Application',
  id: 'application',
  crd: true,
};

export type ApplicationSource = {
  chart: string;
  directory: {
    exclude?: string;
    include?: string;
    recurse?: boolean;
  };
  helm: {
    releaseName?: string;
    version?: string;
  };
  kustomize: {
    namePrefix?: string;
    nameSuffix?: string;
    version?: string;
  };
  plugin?: {
    name: string;
  };
  path?: string;
  ref?: string;
  repoURL?: string;
  targetRevision?: string;
};

export type Retry = {
  limit?: number;
  backoff?: {
    duration?: string;
    factor?: number;
    maxDuration?: string;
  };
};

export type SyncPolicy = {
  automated?: {
    selfHeal?: boolean;
    prune?: boolean;
    allowEmpty?: boolean;
  };
  retry?: Retry;
  syncOptions?: string[];
};

export type ApplicationSpec = {
  destination?: {
    namespace?: string;
    server?: string;
  };
  project?: string;
  source?: ApplicationSource;
  sources?: ApplicationSource[];
  syncPolicy?: SyncPolicy;
};

export type ApplicationHistory = {
  id?: number;
  initiatedBy?: InitiatedBy;
  deployStartedAt?: string;
  deployedAt?: string;
  revision?: string;
  revisions?: string[];
  source: ApplicationSource;
};

export type Resource = {
  kind: string;
  group?: string;
  name: string;
  namespace?: string;
};

export type ApplicationResourceStatus = Resource & {
  hookPhase?: string;
  hookType?: string;
  message?: string;
  version?: string;
  syncWave?: number;
  status?: string;
  health?: {
    status?: string;
    message?: string;
  };
};

export type ApplicationCondition = {
  lastTransitionTime?: string;
  message?: string;
  type?: string;
};

export type InitiatedBy = {
  username?: string;
  automated?: boolean;
};

export type OperationState = {
  finishedAt?: string;
  message?: string;
  operation?: {
    initiatedBy?: InitiatedBy;
    retry?: {
      limit?: number;
    };
    sync?: {
      revision: string;
    };
  };
  phase?: PhaseStatus;
  startedAt?: string;
  syncResult?: {
    resources?: ApplicationResourceStatus[];
  };
};

export type CurrentSyncStatus = {
  revision?: string;
  status?: SyncStatus;
};

export type ApplicationStatus = {
  conditions?: ApplicationCondition[];
  // Added in Argo CD 2.8
  controllerNamespace?: string;
  sync?: CurrentSyncStatus;
  health?: {
    status?: HealthStatus;
  };
  history?: ApplicationHistory[];
  operationState?: OperationState;
  reconciledAt?: string;
  resources?: ApplicationResourceStatus[];
  sourceType?: string;
};

export type Info = {
  name: string;
  value: string;
};

export type SyncOperation = {
  dryRun?: boolean;
  manifests?: string[];
  prune?: boolean;
  resources?: Resource[];
  revisions?: string[];
  source?: ApplicationSource;
  sources?: ApplicationSource[];
  syncOptions?: string[];
};

export type ApplicationOperation = {
  info?: Info[];
  initiatedBy?: InitiatedBy;
  retry?: Retry;
  sync?: SyncOperation;
};

export type ApplicationKind = K8sResourceCommon & {
  spec?: ApplicationSpec;
  operation?: ApplicationOperation;
  status?: ApplicationStatus;
};

export const applicationModelRef = modelToRef(ApplicationModel);

export interface ApplicationTree {
  nodes: ResourceNode[];
  orphanedNodes: ResourceNode[];
  hosts: Node[];
}

export interface Node {
  name: string;
  systemInfo: NodeSystemInfo;
  resourcesInfo: HostResourceInfo[];
  labels: { [name: string]: string };
}

export interface NodeSystemInfo {
  architecture: string;
  operatingSystem: string;
  kernelVersion: string;
}

export interface NodeId {
  kind: string;
  namespace: string;
  name: string;
  group: string;
  createdAt?: Time;
}

export function nodeKey(node: NodeId) {
  return [node.group, node.kind, node.namespace, node.name].join('/');
}

export interface ResourceRef {
  uid: string;
  kind: string;
  namespace: string;
  name: string;
  version: string;
  group: string;
}

export interface InfoItem {
  name: string;
  value: string;
}

export interface ResourceNetworkingInfo {
  targetLabels: { [name: string]: string };
  targetRefs: ResourceRef[];
  labels: { [name: string]: string };
  ingress: LoadBalancerIngress[];
  externalURLs: string[];
}

export interface LoadBalancerIngress {
  hostname: string;
  ip: string;
}

export type Time = string;

export interface ResourceNode extends ResourceRef {
  parentRefs: ResourceRef[];
  info: InfoItem[];
  networkingInfo?: ResourceNetworkingInfo;
  images?: string[];
  resourceVersion: string;
  createdAt?: Time;
}

export type PodGroupType = 'topLevelResource' | 'parentResource' | 'node';
export type SortOrder = 'asc' | 'desc';

export interface Pod extends ResourceNode {
  fullName: string;
  metadata: ObjectMeta;
  spec: PodSpec;
  health: HealthStatusCode;
}

export interface PodSpec {
  nodeName: string;
}

export enum ResourceName {
  ResourceCPU = 'cpu',
  ResourceMemory = 'memory',
  ResourceStorage = 'storage',
}

export interface ResourceStatus {
  group: string;
  version: string;
  kind: string;
  namespace: string;
  name: string;
  status: SyncStatusCode;
  health: HealthStatus;
  createdAt?: Time;
  hook?: boolean;
  requiresPruning?: boolean;
  requiresDeletionConfirmation?: boolean;
  syncWave?: number;
  orphaned?: boolean;
}

export interface HostResourceInfo {
  resourceName: ResourceName;
  requestedByApp: number;
  requestedByNeighbors: number;
  capacity: number;
}

export interface PodGroup extends Partial<ResourceNode> {
  timestamp?: number;
  type: PodGroupType;
  pods: Pod[];
  info?: InfoItem[];
  hostResourcesInfo?: HostResourceInfo[];
  resourceStatus?: Partial<ResourceStatus>;
  renderMenu?: () => React.ReactNode;
  renderQuickStarts?: () => React.ReactNode;
  fullName?: string;
  hostLabels?: { [name: string]: string };
}

export interface ResourceTreeNode extends ResourceNode {
  status?: SyncStatusCode;
  health?: HealthStatus;
  hook?: boolean;
  root?: ResourceTreeNode;
  requiresPruning?: boolean;
  orphaned?: boolean;
  podGroup?: PodGroup;
  isExpanded?: boolean;
}

export interface ObjectMeta {
  name?: string;
  generateName?: string;
  namespace?: string;
  selfLink?: string;
  uid?: string;
  resourceVersion?: string;
  generation?: number;
  creationTimestamp?: Time;
  deletionTimestamp?: Time;
  deletionGracePeriodSeconds?: number;
  labels?: { [name: string]: string };
  annotations?: { [name: string]: string };
  ownerReferences?: any[];
  initializers?: any;
  finalizers?: string[];
  clusterName?: string;
}
