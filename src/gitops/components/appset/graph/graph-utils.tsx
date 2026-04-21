import {
  APP_NODE_HEIGHT,
  APP_NODE_WIDTH,
  createSpacerNode,
  getResourceNodeHealthStatus,
  getTopologyNodeStatus,
  kindToAbbr,
  NODE_DIAMETER,
} from '@gitops/components/graph/utils';
import { ApplicationKind, ApplicationModel } from '@gitops/models/ApplicationModel';
import { ApplicationSetKind, ApplicationStatusContent } from '@gitops/models/ApplicationSetModel';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk';
import {
  CenterAnchor,
  EdgeStyle,
  LabelPosition,
  NodeModel,
  NodeShape,
  NodeStatus,
} from '@patternfly/react-topology';

import {
  RESOURCE_BADGE_COLORS,
  RESOURCE_COLORS,
} from '../../application/graph/icons/resource-colours';

import { getAppSetHealthStatus } from './AppSetUtils';

const NODE_TYPE_APPLICATIONSET = 'applicationset-node';
const NODE_TYPE_APPLICATIONSET_LABEL = 'ApplicationSet';
const STEP_GROUP_WIDTH = 300;

const createApplicationSetNode = (
  applicationSet: ApplicationSetKind,
  resourceNodeLayout: boolean,
): NodeModel => {
  const appSetHealthStatus = getAppSetHealthStatus(applicationSet);
  const nodeStatus = getTopologyNodeStatus(getAppSetHealthStatus(applicationSet));
  return {
    id:
      applicationSet.kind +
      '-' +
      (applicationSet?.metadata?.name ?? '') +
      '-' +
      applicationSet?.metadata?.namespace,
    type: NODE_TYPE_APPLICATIONSET,
    label: resourceNodeLayout ? ' ' : NODE_TYPE_APPLICATIONSET_LABEL,
    status: nodeStatus,
    width: APP_NODE_WIDTH,
    height: APP_NODE_HEIGHT,
    data: {
      name: applicationSet?.metadata?.name,
      kind: applicationSet?.kind,
      resourceNodeLayout: resourceNodeLayout,
      badge: 'AS',
      badgeColor: RESOURCE_COLORS.get(
        RESOURCE_BADGE_COLORS.get('.co-m-resource-' + applicationSet?.kind.toLowerCase()),
      ),
      badgeTextColor: 'white',
      badgeBorderColor: RESOURCE_COLORS.get(
        RESOURCE_BADGE_COLORS.get('.co-m-resource-' + applicationSet?.kind.toLowerCase()),
      ),
      rank: 0,
      nodeStatus: nodeStatus,
      appHealthStatus: appSetHealthStatus,
    },
  };
};

const createApplicationNode = (
  application: ApplicationKind,
  nodeId: string,
  healthStatus: NodeStatus,
  appResource: ApplicationStatusContent,
  appIndex: number,
  color: string,
  badgeLabel: string,
  kind: string,
  resourceNodeLayout: boolean,
): NodeModel => {
  return {
    id: nodeId,
    type: 'node',
    label: resourceNodeLayout ? ' ' : application.kind,
    width: 280,
    height: NODE_DIAMETER,
    labelPosition: LabelPosition.bottom,
    shape: NodeShape.rect,
    status: healthStatus,
    data: {
      name: application.metadata?.name,
      id: nodeId,
      step: appResource?.step || undefined,
      resourceNodeLayout: resourceNodeLayout,
      resourcesLength: application?.status?.resources?.length || 0,
      group: ApplicationModel.apiGroup || 'argoproj.io',
      appIndex: appIndex,
      kind: application.kind,
      version: ApplicationModel.apiVersion || 'v1alpha1',
      namespace: application.metadata?.namespace,
      healthStatus: healthStatus,
      resourceHealthStatus: application.status?.health?.status || undefined,
      syncStatus: application.status?.sync?.status,
      badgeColor: color,
      badgeTextColor: 'white',
      badge: badgeLabel,
      icon: kind,
    },
  };
};

// ApplicationSet Graph Nodes
export const getInitialNodes = (
  applicationSet: ApplicationSetKind,
  applications: ApplicationKind[],
  allK8sModels: { [key: string]: K8sModel },
  isOwnerReferenceView: boolean, // OwnerReference view or Progressive Sync flow view
  expandedStepGroups: Set<string> = new Set(),
  resourceNodeLayout: boolean,
) => {
  // This contains all the nodes we want to add to the graph view
  const initialNodes: NodeModel[] = [];
  const ownerRefOnlyNodes: NodeModel[] = [];
  // Progressive Sync - Group of Apps with the same step
  const definedSteps = applicationSet.spec?.strategy?.rollingSync?.steps?.length;
  const hasApplicationStatus = applicationSet.status?.applicationStatus?.length > 0 ? true : false;

  const stepGroupAppsMap = new Map<string, string[]>();
  if (hasApplicationStatus) {
    for (let i = 1; i <= definedSteps; i++) {
      stepGroupAppsMap.set(i.toString(), []);
    }
  }
  // Step 1. Create the ApplicationSet Node
  initialNodes.push(createApplicationSetNode(applicationSet, resourceNodeLayout));

  // Step 2: Proceed with adding apps

  if ((applications && applications.length > 0) || definedSteps > 0) {
    // Spacer node to the right of the application node
    if (isOwnerReferenceView) {
      initialNodes.push(createSpacerNode(1, 'applicationset-node-spacer'));
    }
    // Add applications to nodes list
    applications.forEach((application, appIndex) => {
      const kind = application.kind;
      const badgeLabel = allK8sModels[kind]?.abbr || kindToAbbr(kind);
      const color =
        RESOURCE_COLORS.get(
          RESOURCE_BADGE_COLORS.get('.co-m-resource-' + application.kind.toLowerCase()),
        ) || RESOURCE_COLORS.get('color-container-dark');
      const nodeId =
        appIndex +
        '-' +
        application.kind +
        '-' +
        application.metadata?.name +
        '-' +
        application.metadata?.namespace;
      const healthStatus = getResourceNodeHealthStatus(application.status?.health?.status);
      const appResource = applicationSet.status?.applicationStatus?.find(
        (status) => status.application === application.metadata.name,
      );
      // Check if this app's step-group is manually expanded (in expandedStepGroups)
      const stepGroupId = appResource?.step ? appResource.step + '-step-group' : null;
      const isStepGroupExpanded = stepGroupId ? expandedStepGroups.has(stepGroupId) : false;

      let isOwnerRefOnly = false;
      if (isStepGroupExpanded && parseInt(appResource?.step) > 0) {
        const targetApp = applicationSet.status?.applicationStatus?.find(
          (appStatus) => appStatus.application === application.metadata.name,
        );
        if (targetApp) {
          const stepGroupApps = stepGroupAppsMap.get(appResource.step) || [];
          stepGroupApps.push(nodeId);
          stepGroupAppsMap.set(appResource.step, stepGroupApps);
        }
      } else if (isOwnerReferenceView && appResource?.step === '-1') {
        isOwnerRefOnly = true;
      }

      // Add application node if its step-group is expanded, or if there is no app status in which case it has an owner ref, and progressive sync is disabled
      if (isStepGroupExpanded || (!hasApplicationStatus && !isOwnerRefOnly)) {
        initialNodes.push(
          createApplicationNode(
            application,
            nodeId,
            healthStatus,
            appResource,
            appIndex,
            color,
            badgeLabel,
            kind,
            resourceNodeLayout,
          ),
        );
      } else if (isOwnerRefOnly) {
        ownerRefOnlyNodes.push(
          createApplicationNode(
            application,
            nodeId,
            healthStatus,
            appResource,
            appIndex,
            color,
            badgeLabel,
            kind,
            resourceNodeLayout,
          ),
        );
      }
    });
    const sortedSteps = Array.from(stepGroupAppsMap.keys()).sort();
    sortedSteps.forEach((step) => {
      const stepGroupApps = stepGroupAppsMap.get(step);
      if (stepGroupApps.length === 0 && hasApplicationStatus) {
        stepGroupAppsMap.set(step.toString(), [step + '-filler-node']);
        initialNodes.push({
          id: step + '-filler-node',
          type: 'filler-node',
          label: t('No Applications In This Step'),
          width: STEP_GROUP_WIDTH,
          height: NODE_DIAMETER,
          labelPosition: LabelPosition.bottom,
          shape: NodeShape.rect,
          status: NodeStatus.default,
          data: {
            stepGroupId: step + '-step-group',
          },
        });
        stepGroupApps.push(step + '-filler-node');
      }
      const appsWithStepCount = applicationSet.status?.applicationStatus?.reduce(
        (acc, status) => acc + (status.step === step ? 1 : 0),
        0,
      );
      const healthyCount = applicationSet.status?.applicationStatus?.reduce(
        (acc, status) => acc + (status.step === step && status.status === 'Healthy' ? 1 : 0),
        0,
      );
      const progressingCount = applicationSet.status?.applicationStatus?.reduce(
        (acc, status) => acc + (status.step === step && status.status === 'Progressing' ? 1 : 0),
        0,
      );
      const pendingCount = applicationSet.status?.applicationStatus?.reduce(
        (acc, status) => acc + (status.step === step && status.status === 'Pending' ? 1 : 0),
        0,
      );
      const waitingCount = applicationSet.status?.applicationStatus?.reduce(
        (acc, status) => acc + (status.step === step && status.status === 'Waiting' ? 1 : 0),
        0,
      );
      const stepGroup = {
        anchor: CenterAnchor,
        id: step + '-step-group',
        type: 'step-group',
        group: true,
        rank: 3,
        label: 'Progressive Sync Step ' + step,
        children: [...stepGroupApps],
        data: {
          step: step,
          groupHealthy: healthyCount === appsWithStepCount,
          appCount: appsWithStepCount,
          healthyCount: healthyCount,
          progressingCount: progressingCount,
          pendingCount: pendingCount,
          waitingCount: waitingCount,
        },
        borderRadius: 0,
        width: STEP_GROUP_WIDTH,
        height: 50,
        collapsible: true,
        hulledOutline: true,
        style: { padding: 40 },
      };
      initialNodes.push(stepGroup);
      if (isOwnerReferenceView) {
        initialNodes.push(createSpacerNode(3, 'step-group-node-spacer-' + step, 10));
        const transparentGroupsOfStepGroups = {
          id: 'transparent-group-of-step-groups-' + step,
          type: 'group',
          rank: 3,
          group: true,
          children: isOwnerReferenceView
            ? [step + '-step-group', 'step-group-node-spacer-' + step]
            : [step + '-step-group'],
          collapsible: true,
          selectable: false,
          hideContextMenuKebab: true,
          hulledOutline: false,
          width: STEP_GROUP_WIDTH,
          height: NODE_DIAMETER,
          data: {
            step: step,
          },
        };
        initialNodes.push(transparentGroupsOfStepGroups);
      }
    });
  }

  if (ownerRefOnlyNodes.length > 0) {
    const transparentOwnerRefOnlyGroup = {
      id: 'transparent-group-of-step-groups-nostep',
      type: 'group',
      rank: 2,
      group: true,
      children: [...ownerRefOnlyNodes.map((node) => node.id)],
      collapsible: true,
      selectable: false,
      hideContextMenuKebab: true,
      hulledOutline: false,
      width: STEP_GROUP_WIDTH,
      height: NODE_DIAMETER,
      data: {
        step: '-1',
      },
    };
    initialNodes.push(transparentOwnerRefOnlyGroup, ...ownerRefOnlyNodes);
  }
  return initialNodes;
};

export const getInitialEdges = (
  applicationSet: ApplicationSetKind,
  applications: ApplicationKind[],
  nodes: NodeModel[],
  isOwnerReferenceView: boolean,
  isProgressiveSyncEnabled: boolean,
  expandedStepGroups: Set<string> = new Set(),
) => {
  const initialEdges = [];
  if (nodes.length > 1) {
    const firstStepGroup = nodes.find(
      (node) => node.type === 'step-group' && node.id === '1-step-group',
    );
    if (
      (isOwnerReferenceView && !isProgressiveSyncEnabled && applications.length > 0) ||
      (isOwnerReferenceView && isProgressiveSyncEnabled) ||
      !isOwnerReferenceView
    ) {
      initialEdges.push({
        id: 'e-applicationset',
        type: isOwnerReferenceView ? 'edge' : 'task-edge',
        source:
          applicationSet.kind +
          '-' +
          (applicationSet.metadata?.name ?? '') +
          '-' +
          applicationSet.metadata?.namespace,
        target: isOwnerReferenceView ? 'applicationset-node-spacer' : '1-step-group',
        nodeSeparation: 0,
        edgeStyle: EdgeStyle.default,
        data: {
          // eslint-disable-next-line no-nested-ternary
          overallState: firstStepGroup?.data?.groupHealthy
            ? 'healthy'
            : firstStepGroup?.data?.progressingCount > 0
            ? 'progressing'
            : 'waiting',
          isVisible: applications.length > 0,
        },
      });
    }
    if (isOwnerReferenceView) {
      nodes.forEach((node: NodeModel, index: number) => {
        if (node.type === 'node') {
          if (node.data.kind === 'Application' && applications.length > 0) {
            initialEdges.push({
              id: 'e-' + node.label + '-' + index,
              type: 'gitops-task-edge',
              nodeSeparation: 0,
              source: 'applicationset-node-spacer',
              target: node.id,
              edgeStyle: EdgeStyle.default,
            });
          }
        } else if (node.type === 'step-group') {
          const stepGroupId = node.id;
          const isStepGroupExpanded = stepGroupId ? expandedStepGroups.has(stepGroupId) : false;
          if (!isStepGroupExpanded && node.id.endsWith('-step-group')) {
            initialEdges.push({
              id: 'e-' + node.label + '-' + index,
              type: 'gitops-task-edge',
              nodeSeparation: 0,
              source: 'applicationset-node-spacer',
              target: node.id,
              edgeStyle: EdgeStyle.default,
            });
          }
        }
      });
      const groups = nodes.filter((node) => node.type === 'filler-node');
      groups.forEach((group, index: number) => {
        if (expandedStepGroups.has(group.data.stepGroupId)) {
          initialEdges.push({
            id: 'e-appsetedge-stepgroup-' + index,
            type: 'gitops-task-edge',
            nodeSeparation: 0,
            source: 'applicationset-node-spacer',
            target: group.id,
          });
        }
      });
    } else {
      const stepGroups = nodes.filter((node: NodeModel) => node.type === 'step-group');
      const length = stepGroups.length;
      stepGroups.forEach((node: NodeModel, index: number) => {
        const n = parseInt(node.data.step) + 1;
        if (index < length - 1) {
          initialEdges.push({
            id: 'e-step-group-' + index,
            type: 'task-edge',
            nodeSeparation: 0,
            source: node.id,
            target: n + '-step-group',
            data: {
              step: node.data.step,
              // Use index+1 to get the target step-group's data (array is 0-indexed)
              // eslint-disable-next-line no-nested-ternary
              overallState: stepGroups[index + 1]?.data?.groupHealthy
                ? 'healthy'
                : stepGroups[index + 1]?.data?.progressingCount > 0
                ? 'progressing'
                : 'warning',
              groupHealth: stepGroups[index + 1]?.data?.groupHealthy,
              progressingCount: stepGroups[index + 1]?.data?.progressingCount,
              appCount: stepGroups[index + 1]?.data?.appCount,
            },
          });
        }
      });
    }
  }
  return initialEdges;
};
