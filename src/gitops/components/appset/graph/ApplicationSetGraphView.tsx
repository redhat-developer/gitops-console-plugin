import * as React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom-v5-compat';
import { observer } from 'mobx-react';

import {
  ApplicationKind,
  ApplicationModel,
  applicationModelRef,
} from '@gitops/models/ApplicationModel';
import { ApplicationSetKind, applicationSetModelRef } from '@gitops/models/ApplicationSetModel';
import { HealthStatus } from '@gitops/utils/constants';
import { ArgoServer, getArgoServer } from '@gitops/utils/gitops';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import {
  K8sModel,
  useAnnotationsModal,
  useDeleteModal,
  useK8sModel,
  useK8sModels,
  useLabelsModal,
  useUserSettings,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  EllipsisHIcon,
  ObjectGroupIcon,
  SitemapIcon,
  ToggleOffIcon,
  ToggleOnIcon,
} from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import {
  action,
  ComponentFactory,
  ContextMenuItem,
  ContextMenuSeparator,
  createTopologyControlButtons,
  DagreLayout,
  DEFAULT_SPACER_NODE_TYPE,
  defaultControlButtonsOptions,
  DefaultEdge,
  DefaultNode,
  Edge,
  EdgeStyle,
  EdgeTerminalType,
  Graph,
  GraphComponent,
  GraphElement,
  GROUPS_LAYER,
  Layer,
  Layout,
  LayoutFactory,
  Model,
  ModelKind,
  Node as TopologyNode,
  NodeStatus,
  SELECTION_EVENT,
  SpacerNode,
  TaskEdge,
  TopologyControlBar,
  TopologyView,
  Visualization,
  VisualizationProvider,
  VisualizationSurface,
  withContextMenu,
  withPanZoom,
  withSelection,
} from '@patternfly/react-topology';

import { GraphResourceMenuItem } from '../../application/graph/hooks/GraphResourceMenuItems';
import { ResourceNode } from '../../application/graph/nodes/ResourceNode';

import { ApplicationSetNode } from './nodes/ApplicationSetNode';
import { StepGroupComponent } from './nodes/StepGroupComponent';
import { getInitialEdges, getInitialNodes } from './graph-utils';

import '../../application/graph/ApplicationGraphView.scss';

const customLayoutFactory: (isOwnerRefView: boolean) => LayoutFactory =
  (isOwnerRefView: boolean) =>
  (type: string, graph: Graph): Layout | undefined => {
    if (type === 'Dagre') {
      return new DagreLayout(graph, {
        rankdir: 'LR',
        ranksep: isOwnerRefView ? 10 : 20,
        nodesep: 0,
        groupDistance: isOwnerRefView ? 1 : 50,
        collideDistance: 50,
        ignoreGroups: false,
        edgesep: 0,
        ranker: 'network-simplex',
        marginx: 50,
        marginy: 150,
      });
    }
    return undefined;
  };

const TransparentGroup: React.FC<{ element: TopologyNode }> = ({}) => {
  return (
    <Layer id={GROUPS_LAYER}>
      <g></g>
    </Layer>
  );
};

interface DataEdgeProps {
  element: Edge;
}

const DataEdge: React.FC<DataEdgeProps> = observer(({ element, ...rest }) => {
  const overallState = element.getData()?.overallState;
  return (
    <DefaultEdge
      className={css('step-edge', 'step-edge-' + overallState)}
      element={element}
      edgeStyle={EdgeStyle.dashedMd}
      endTerminalType={EdgeTerminalType.directional}
      animationDuration={0.8}
      canDrop={false}
      tagStatus={
        // eslint-disable-next-line no-nested-ternary
        overallState === 'healthy'
          ? NodeStatus.success
          : overallState === 'progressing'
          ? NodeStatus.info
          : NodeStatus.warning
      }
      endTerminalSize={15}
      endTerminalClass={css('step-edge-terminal', 'step-edge-terminal-' + overallState)}
      {...rest}
    />
  );
});

const GitOpsTaskEdge: React.FC<DataEdgeProps> = observer(({ element, ...rest }) => {
  return <TaskEdge element={element} {...rest} />;
});

interface AppSetContextMenuItemProps {
  routeModel: K8sModel;
  applications: ApplicationKind[];
  graphElement: GraphElement;
  label: string;
  index: number;
  applicationSet: ApplicationSetKind;
  launchLabelsModal: () => void;
  launchAnnotationsModal: () => void;
  launchDeleteModal: () => void;
  navigate: NavigateFunction;
}

const getArgoHref = (argoServer: ArgoServer, namespace: string, name: string): string => {
  if (!argoServer?.host) return '';
  return `${argoServer.protocol}://${argoServer.host}/applications/${namespace}/${name}`;
};

const AppSetContextMenuItem: React.FC<AppSetContextMenuItemProps> = ({
  routeModel,
  applications,
  graphElement,
  label,
  index,
  applicationSet,
  launchLabelsModal,
  launchAnnotationsModal,
  launchDeleteModal,
  navigate,
}) => {
  if (label === '-') {
    return <ContextMenuSeparator component="li" key={`separator:${index}`} />;
  }

  const { kind, name, namespace } = graphElement.getData();
  const isApplicationSet = kind === 'ApplicationSet';
  const editLabel = t('Edit {{x}}', { x: kind });
  const deleteLabel = t('Delete {{x}}', { x: kind });

  if (
    !isApplicationSet &&
    [t('Edit labels'), t('Edit annotations'), editLabel, deleteLabel].includes(label)
  ) {
    return <GraphResourceMenuItem key={label} graphElement={graphElement} label={label} />;
  }

  const handleClick = async () => {
    switch (label) {
      case t('View in Argo CD'): {
        const application = applications.find(
          (app) => app.metadata?.name === name && app.metadata?.namespace === namespace,
        );
        if (application) {
          try {
            const argoServer = await getArgoServer(routeModel, application);
            const href = getArgoHref(argoServer, namespace ?? '', name ?? '');
            if (href) window.open(href, '_blank');
          } catch (err) {
            console.error('Failed to get Argo server:', err);
          }
        }
        break;
      }
      case t('Edit labels'):
        launchLabelsModal();
        break;
      case t('Edit annotations'):
        launchAnnotationsModal();
        break;
      case t('Edit Application'):
        navigate(
          `/k8s/ns/${applicationSet.metadata?.namespace}/${applicationModelRef}/${applicationSet.metadata?.name}/yaml`,
        );
        break;
      case t('Edit ApplicationSet'):
        navigate(
          `/k8s/ns/${applicationSet.metadata?.namespace}/${applicationSetModelRef}/${applicationSet.metadata?.name}/yaml`,
        );
        break;
      case t('Delete Application'):
      case t('Delete ApplicationSet'):
        launchDeleteModal();
        break;
      case t('View Details'):
        navigate(graphElement.getData().resourcePath);
        break;
    }
  };

  return (
    <ContextMenuItem key={label} onClick={handleClick}>
      {label}
    </ContextMenuItem>
  );
};

interface ContextMenuFactoryParams {
  routeModel: K8sModel;
  applications: ApplicationKind[];
  applicationSet: ApplicationSetKind;
  launchLabelsModal: () => void;
  launchAnnotationsModal: () => void;
  launchDeleteModal: () => void;
  navigate: NavigateFunction;
}

const createContextMenuItems = (
  graphElement: GraphElement,
  paramsRef: React.RefObject<ContextMenuFactoryParams>,
  ...labels: string[]
): React.ReactElement[] => {
  const params = paramsRef.current;
  if (!params) return [];
  return labels.map((label, i) => (
    <AppSetContextMenuItem
      key={label === '-' ? `separator:${i}` : label}
      graphElement={graphElement}
      label={label}
      index={i}
      {...params}
    />
  ));
};

const getResourceMenuItems = (
  graphElement: GraphElement,
  paramsRef: React.RefObject<ContextMenuFactoryParams>,
): React.ReactElement[] => {
  const { kind, resourceHealthStatus } = graphElement.getData();

  if (resourceHealthStatus === HealthStatus.MISSING) {
    return createContextMenuItems(graphElement, paramsRef, t('View in Argo CD'));
  }

  if (kind === ApplicationModel.kind) {
    return createContextMenuItems(
      graphElement,
      paramsRef,
      t('Delete Application'),
      '-',
      t('View Details'),
      t('View in Argo CD'),
    );
  }

  return createContextMenuItems(graphElement, paramsRef, t('View in Argo CD'));
};

const createAppSetComponentFactory =
  (paramsRef: React.RefObject<ContextMenuFactoryParams>): ComponentFactory =>
  (kind: ModelKind, type: string) => {
    switch (type) {
      case 'group':
        return TransparentGroup;
      case 'step-group':
        return withSelection()(StepGroupComponent);
      case 'filler-node':
        return DefaultNode;
      case 'task-edge':
        return DataEdge;
      case 'gitops-task-edge':
        return GitOpsTaskEdge;
      case 'spacer-node':
      case DEFAULT_SPACER_NODE_TYPE:
        return SpacerNode;
      case 'applicationset-node':
        return withContextMenu((graphElement) =>
          createContextMenuItems(
            graphElement,
            paramsRef,
            t('Edit labels'),
            t('Edit annotations'),
            t('Edit ApplicationSet'),
            t('Delete ApplicationSet'),
          ),
        )(withSelection()(ApplicationSetNode));
      default:
        switch (kind) {
          case ModelKind.graph:
            return withPanZoom()(GraphComponent);
          case ModelKind.node:
            return withContextMenu((graphElement) => {
              return getResourceMenuItems(graphElement, paramsRef);
            })(withSelection()(ResourceNode));
          case ModelKind.edge:
            return TaskEdge;
          default:
            return undefined;
        }
    }
  };

export const TreeViewLayout = {
  OWNER_REFERENCE_LAYOUT: 'owner-reference-layout',
  PROGRESSIVE_SYNC_FLOW_LAYOUT: 'progressive-sync-flow-layout',
};

export const ApplicationSetGraphView: React.FC<{
  applicationSet: ApplicationSetKind;
  applications: ApplicationKind[];
}> = ({ applicationSet, applications }) => {
  const [model] = useK8sModel({ group: 'route.openshift.io', version: 'v1', kind: 'Route' });
  const [allK8sModels] = useK8sModels();
  const isProgressiveSyncEnabled = applicationSet.status?.applicationStatus?.length > 0;
  const [treeViewLayout, setTreeViewLayout] = useUserSettings(
    'redhat.gitops.appSetTreeViewLayout',
    isProgressiveSyncEnabled
      ? TreeViewLayout.PROGRESSIVE_SYNC_FLOW_LAYOUT
      : TreeViewLayout.OWNER_REFERENCE_LAYOUT,
    false,
  );
  const [resourceNodeLayout, setResourceNodeLayout] = useUserSettings(
    'redhat.gitops.resourceNodeLayout',
    true,
    false,
  );
  // Use a setting to save the expand group state instead of alway having it set to a default value
  const [expandGroups, setExpandGroups] = useUserSettings(
    'redhat.gitops.expandGroups',
    false,
    false,
  );
  // Track expanded step-groups - only expanded step-groups have their app nodes included in initialNodes
  const [expandedStepGroups, setExpandedStepGroups] = React.useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [renderKey, setRenderKey] = React.useState(0);
  // Track if initial collapse is pending - hide graph until complete to avoid flicker
  const skipExpandGroupsEffectRef = React.useRef(false);
  const launchLabelsModal = useLabelsModal(applicationSet);
  const launchAnnotationsModal = useAnnotationsModal(applicationSet);
  const launchDeleteModal = useDeleteModal(applicationSet);
  const navigate = useNavigate();
  let adjustedExpansionSetting = true;
  if (applicationSet.status?.applicationStatus?.length > 0) {
    adjustedExpansionSetting = treeViewLayout === TreeViewLayout.OWNER_REFERENCE_LAYOUT;
  } else {
    adjustedExpansionSetting = true;
  }
  const layoutRef = React.useRef<LayoutFactory>(customLayoutFactory(adjustedExpansionSetting));
  layoutRef.current = customLayoutFactory(adjustedExpansionSetting);
  const contextMenuParamsRef = React.useRef<ContextMenuFactoryParams>({
    routeModel: model,
    applications,
    applicationSet,
    launchLabelsModal,
    launchAnnotationsModal,
    launchDeleteModal,
    navigate,
  });

  React.useEffect(() => {
    contextMenuParamsRef.current = {
      routeModel: model,
      applications,
      applicationSet,
      launchLabelsModal,
      launchAnnotationsModal,
      launchDeleteModal,
      navigate,
    };
  }, [
    model,
    applications,
    applicationSet,
    launchLabelsModal,
    launchAnnotationsModal,
    launchDeleteModal,
    navigate,
  ]);

  const initialNodes = getInitialNodes(
    applicationSet,
    applications,
    allK8sModels,
    adjustedExpansionSetting,
    expandedStepGroups,
    resourceNodeLayout,
  );
  const initialEdges = getInitialEdges(
    applicationSet,
    applications,
    initialNodes,
    adjustedExpansionSetting,
    isProgressiveSyncEnabled,
    expandedStepGroups,
  );
  const nodes = initialNodes;
  const applicationSetUid = applicationSet.metadata?.uid;

  const controller = React.useMemo(() => {
    const newController = new Visualization();
    newController.registerLayoutFactory(layoutRef.current);
    newController.registerComponentFactory(createAppSetComponentFactory(contextMenuParamsRef));
    newController.addEventListener(SELECTION_EVENT, setSelectedIds);
    const modelWithLayout: Model = {
      nodes: nodes,
      edges: initialEdges,
      graph: {
        id: 'g1',
        type: 'graph',
        layout: 'Dagre',
      },
    };
    newController.fromModel(modelWithLayout, false);
    return newController;
  }, [applicationSetUid]);

  // Parts of the logic to refresh and update the graph is similar to application graph view.
  // Logic to handle unnecessary re-renders was aided by AI and NOT used verbatim, but, for exploratory purposes, and then customized.

  // Store expand callback on controller (not graph) so it persists across model updates
  React.useEffect(() => {
    (controller as any).updateExpandedStepGroups = (stepGroupId: string, expanded: boolean) => {
      // Update the ref so structural change logic knows about collapsed state
      if (expanded) {
        collapsedStepGroupsRef.current.delete(stepGroupId);
      } else {
        collapsedStepGroupsRef.current.add(stepGroupId);
      }
      // Update state to trigger re-render with new initialNodes
      setExpandedStepGroups((prev) => {
        const newSet = new Set(prev);
        if (expanded) {
          newSet.add(stepGroupId);
        } else {
          newSet.delete(stepGroupId);
        }
        return newSet;
      });
    };
  }, [controller]);

  // Re-register layout factory when setting changes and rebuild model
  const prevIsStepGroupExpandedRef = React.useRef(treeViewLayout);
  const prevViewType = React.useRef(expandGroups);
  React.useEffect(() => {
    if (
      prevIsStepGroupExpandedRef.current !== treeViewLayout ||
      prevViewType.current !== expandGroups
    ) {
      const expandGroupsChanged = prevViewType.current !== expandGroups;

      // If the button callback already handled the expand/collapse, skip this effect
      if (expandGroupsChanged && skipExpandGroupsEffectRef.current) {
        skipExpandGroupsEffectRef.current = false;
        prevViewType.current = expandGroups;
        return;
      }

      // Use scale/position saved by callback (in graphViewStateRef) for expandGroups changes
      // The callback saves to the ref BEFORE any state changes, so it has the correct values
      let savedScale: number | null = null;
      let savedPosition: { x: number; y: number } | null = null;
      if (expandGroupsChanged && graphViewStateRef.current) {
        savedScale = graphViewStateRef.current.scale;
        savedPosition = graphViewStateRef.current.position;
      }

      if (prevIsStepGroupExpandedRef.current !== treeViewLayout) {
        prevIsStepGroupExpandedRef.current = treeViewLayout;
      }
      if (prevViewType.current !== expandGroups) {
        prevViewType.current = expandGroups;
      }
      // Register new layout factory
      if (applicationSet.status?.applicationStatus?.length > 0) {
        adjustedExpansionSetting = treeViewLayout === TreeViewLayout.OWNER_REFERENCE_LAYOUT;
      } else {
        adjustedExpansionSetting = true;
      }
      controller.registerLayoutFactory(customLayoutFactory(adjustedExpansionSetting));

      const hasCollapsedStepGroups = collapsedStepGroupsRef.current.size > 0;

      // Rebuild model to use new layout factory (keep step-groups expanded for layout)
      const modelWithLayout: Model = {
        nodes: nodes,
        edges: initialEdges,
        graph: {
          id: 'g1',
          type: 'graph',
          layout: 'Dagre',
        },
      };
      controller.fromModel(modelWithLayout, false);

      // After layout, handle step-group expand/collapse
      if (hasCollapsedStepGroups || expandGroupsChanged) {
        requestAnimationFrame(() => {
          const graph2 = controller.getGraph();
          const stepGroupIds = nodes.filter((n) => n.type === 'step-group').map((n) => n.id);
          stepGroupIds.forEach((nodeId) => {
            const node = controller.getNodeById(nodeId);
            if (node) {
              // Set collapsed state based on whether it's in the collapsed ref
              const shouldBeCollapsed = collapsedStepGroupsRef.current.has(nodeId);
              node.setCollapsed(shouldBeCollapsed);
            }
          });
          graph2.layout();

          // Restore scale/position after layout if expandGroups changed
          if (savedScale !== null && savedPosition !== null) {
            graph2.setScale(savedScale);
            graph2.setBounds(graph2.getBounds().setLocation(savedPosition.x, savedPosition.y));
            // Clear the ref after use
            graphViewStateRef.current = null;
          }
        });
      }
    }
  }, [controller, nodes, initialEdges, treeViewLayout, applications, expandGroups]);

  const previousNodeCountRef = React.useRef<number>(0);
  const previousNodeIdsRef = React.useRef<string>('');
  // Track collapsed state of step-groups to preserve across model updates
  const collapsedStepGroupsRef = React.useRef<Set<string>>(new Set());
  // Track graph scale and position to preserve across refreshes
  const graphViewStateRef = React.useRef<{
    scale: number;
    position: { x: number; y: number };
  } | null>(null);
  // Track if initial collapse has been done
  const initialCollapseAppliedRef = React.useRef<boolean>(false);
  const controllerRef = React.useRef(controller);
  controllerRef.current = controller;
  const currentNodeCount = nodes.length;
  const previousNodeCount = previousNodeCountRef.current;
  const currentNodeIds = nodes
    .map((n) => n.id)
    .sort()
    .join(',');
  const previousNodeIds = previousNodeIdsRef.current;
  const resourceNodeLayoutRef = React.useRef<boolean>(resourceNodeLayout);
  const previousResourceNodeLayout = resourceNodeLayoutRef.current;

  const isStructuralChange =
    currentNodeCount !== previousNodeCount ||
    currentNodeIds !== previousNodeIds ||
    previousResourceNodeLayout != resourceNodeLayout;

  if (isStructuralChange || previousNodeCount === 0) {
    // Save graph scale and position before updating model
    const graph = controller.getGraph();
    if (graph && previousNodeCount > 0) {
      graphViewStateRef.current = {
        scale: graph.getScale(),
        position: graph.getPosition(),
      };
    }

    // Save collapsed state of step-groups before updating model
    // Use getNodeById since getNodes() doesn't return group nodes
    const stepGroupIds = nodes.filter((n) => n.type === 'step-group').map((n) => n.id);
    stepGroupIds.forEach((nodeId) => {
      const node = controller.getNodeById(nodeId);
      if (node) {
        if (node.isCollapsed()) {
          collapsedStepGroupsRef.current.add(nodeId);
        } else {
          collapsedStepGroupsRef.current.delete(nodeId);
        }
      }
    });

    const isInitialLoad = previousNodeCount === 0;
    const hasCollapsedStepGroups = collapsedStepGroupsRef.current.size > 0;

    // For non-initial loads, set collapsed state in the model to prevent flicker
    const nodesWithCollapsedState = isInitialLoad
      ? nodes
      : nodes.map((node) => {
          if (node.type === 'step-group' && !expandedStepGroups.has(node.id)) {
            return { ...node, collapsed: true };
          }
          return node;
        });

    // Structural change: Create model WITH layout
    const modelWithLayout: Model = {
      nodes: nodesWithCollapsedState,
      edges: initialEdges,
      graph: {
        id: 'g1',
        type: 'graph',
        layout: 'Dagre',
      },
    };
    controller.fromModel(modelWithLayout, false);

    // For non-initial loads, handle layout and show graph
    if (!isInitialLoad) {
      // Use requestAnimationFrame for smoother timing
      requestAnimationFrame(() => {
        const currentController = controllerRef.current;
        const graph2 = currentController.getGraph();

        // Collapse step-groups that should be collapsed
        if (hasCollapsedStepGroups) {
          stepGroupIds.forEach((nodeId) => {
            const node = currentController.getNodeById(nodeId);
            if (node && collapsedStepGroupsRef.current.has(nodeId)) {
              node.setCollapsed(true);
            }
          });
        }
        graph2.layout();
      });
    } else {
      if (expandGroups) {
        setExpandedStepGroups(new Set(stepGroupIds));
      }
    }

    // Restore graph scale and position after model update
    if (graphViewStateRef.current) {
      const graph3 = controller.getGraph();
      if (graph3) {
        graph3.setScale(graphViewStateRef.current.scale);
        graph3.setBounds(
          graph3
            .getBounds()
            .setLocation(
              graphViewStateRef.current.position.x,
              graphViewStateRef.current.position.y,
            ),
        );
      }
    }

    previousNodeCountRef.current = currentNodeCount;
    previousNodeIdsRef.current = currentNodeIds;
    resourceNodeLayoutRef.current = resourceNodeLayout;
  } else {
    // Data change only: Update ONLY changed nodes (no layout, no position changes)
    let updateCount = 0;
    nodes.forEach((nodeModel) => {
      const existingNode = controller.getNodeById(nodeModel.id);
      if (!existingNode) {
        return;
      }

      // For step-group nodes, only update data (for collapsed shape) - don't touch children
      if (nodeModel.type === 'step-group') {
        const oldData = existingNode.getData();
        const newData = nodeModel.data;
        const dataChanged = JSON.stringify(oldData) !== JSON.stringify(newData);
        if (dataChanged) {
          const freshData = JSON.parse(JSON.stringify(newData));
          existingNode.setData(freshData);
          updateCount++;
        }
        return;
      }

      if (existingNode) {
        const oldData = existingNode.getData();
        const newData = nodeModel.data;

        // Check if data actually changed
        const dataChanged = JSON.stringify(oldData) !== JSON.stringify(newData);

        if (dataChanged) {
          // Create a completely new object to ensure MobX detects the change
          const freshData = JSON.parse(JSON.stringify(newData));

          // Only update data and properties - don't call setModel as it breaks parent relationships
          existingNode.setData(freshData);

          // Update other properties directly
          if (nodeModel.label && existingNode.getLabel() !== nodeModel.label) {
            existingNode.setLabel(nodeModel.label);
          }
          if (nodeModel.status !== undefined && existingNode.getNodeStatus() !== nodeModel.status) {
            existingNode.setNodeStatus(nodeModel.status);
          }
          updateCount++;
        }
      }
    });

    // Also update edges with changed data
    initialEdges.forEach((edgeModel) => {
      const existingEdge = controller
        .getGraph()
        ?.getEdges()
        .find((e) => e.getId() === edgeModel.id);
      if (existingEdge && edgeModel.data) {
        const oldData = existingEdge.getData();
        const newData = edgeModel.data;
        const dataChanged = JSON.stringify(oldData) !== JSON.stringify(newData);
        if (dataChanged) {
          const freshData = JSON.parse(JSON.stringify(newData));
          existingEdge.setData(freshData);
          updateCount++;
        }
      }
    });

    if (updateCount > 0) {
      // Force React to re-render the VisualizationSurface by changing key
      setRenderKey((prev) => prev + 1);
    }
  }

  // Effect to handle initial collapse of step-groups after first render
  // This runs after Dagre has laid out the expanded graph, then collapses
  React.useEffect(() => {
    if (!initialCollapseAppliedRef.current) {
      initialCollapseAppliedRef.current = true;
      requestAnimationFrame(() => {
        const currentController = controllerRef.current;
        const graph = currentController.getGraph();
        if (!graph) {
          return;
        }
        // Get step-group IDs from the controller's elements
        const stepGroupIds: string[] = [];
        graph.getNodes().forEach((n) => {
          if (n.getType() === 'step-group') {
            stepGroupIds.push(n.getId());
          }
        });
        // If getNodes() doesn't return groups, try getting from initialNodes
        if (stepGroupIds.length === 0) {
          initialNodes
            .filter((n) => n.type === 'step-group')
            .forEach((n) => stepGroupIds.push(n.id));
        }
        // Check if nodes are available yet
        const firstNode = currentController.getNodeById(stepGroupIds[0]);
        if (!firstNode) {
          return;
        }
        // Only collapse step-groups that are NOT in expandedStepGroups
        stepGroupIds.forEach((nodeId) => {
          // Skip if this step-group is in expandedStepGroups
          if (expandedStepGroups.has(nodeId)) {
            return;
          }

          const node = currentController.getNodeById(nodeId);
          if (node) {
            node.setCollapsed(true);
            collapsedStepGroupsRef.current.add(nodeId);
          }
        });

        // Re-layout with collapsed sizes
        graph.layout();
      });
    }
  }, [
    controller,
    nodes.filter((n) => n.type !== 'filler-node'),
    treeViewLayout,
    expandedStepGroups,
    expandGroups,
  ]);
  return (
    <TopologyView
      className="gitops-topology-view"
      // style={{ opacity: graphReady ? 1 : 1 }}
      controlBar={
        <TopologyControlBar
          controlButtons={createTopologyControlButtons({
            ...defaultControlButtonsOptions,
            zoomInCallback: action(() => {
              controller.getGraph().scaleBy(4 / 3);
            }),
            zoomOutCallback: action(() => {
              controller.getGraph().scaleBy(0.75);
            }),
            fitToScreenCallback: action(() => {
              controller.getGraph().fit(80);
            }),
            resetViewCallback: action(() => {
              controller.getGraph().reset();
              controller.getGraph().layout();
            }),
            customButtons: [
              {
                id: 'toggle-node-layout',
                icon: resourceNodeLayout ? <ToggleOnIcon /> : <ToggleOffIcon />,
                tooltip: t(
                  'Toggle between OpenShift shapes and Argo CD shapes for tree nodes. Current setting: {{x}}',
                  { x: resourceNodeLayout ? 'Argo CD' : 'OpenShift' },
                ),
                ariaLabel: t(
                  'Toggle between OpenShift shapes and Argo CD shapes for tree nodes. Current setting: {{x}}',
                  { x: resourceNodeLayout ? 'Argo CD' : 'OpenShift' },
                ),
                callback: () => {
                  setResourceNodeLayout(!resourceNodeLayout);
                  controller.getGraph().layout();
                },
              },
              {
                id: 'setting-owner-reference-layout',
                icon: <SitemapIcon style={{ transform: 'rotate(-90deg)' }}></SitemapIcon>,
                tooltip: t('AppSet ownerReference Tree View'),
                ariaLabel: t('AppSet ownerReference Tree View'),
                callback: () => {
                  if (treeViewLayout !== TreeViewLayout.OWNER_REFERENCE_LAYOUT) {
                    setTreeViewLayout(TreeViewLayout.OWNER_REFERENCE_LAYOUT);
                    const graph = controller.getGraph();
                    graph.layout();
                  }
                },
              },
              {
                id: 'setting-progressive-sync-flow-layout',
                icon: <EllipsisHIcon />,
                disabled: !isProgressiveSyncEnabled,
                tooltip: t('Progressive Sync Flow View'),
                ariaLabel: t('Progressive Sync Flow View'),
                callback: () => {
                  if (
                    treeViewLayout !== TreeViewLayout.PROGRESSIVE_SYNC_FLOW_LAYOUT &&
                    isProgressiveSyncEnabled
                  ) {
                    setTreeViewLayout(TreeViewLayout.PROGRESSIVE_SYNC_FLOW_LAYOUT);
                    const graph = controller.getGraph();
                    graph.layout();
                  }
                },
              },
              {
                id: 'setting-expand-collapse-all-step-groups',
                icon: <ObjectGroupIcon />,
                disabled: !isProgressiveSyncEnabled,
                tooltip: t('Expand or collapse all progressive sync step groups'),
                ariaLabel: t('Expand or collapse all progressive sync step groups'),
                callback: () => {
                  const graph = controller.getGraph();
                  const savedScale = graph.getScale();
                  const savedPosition = graph.getPosition();

                  const shouldCollapse = expandGroups;
                  const stepGroupIds = nodes
                    .filter((n) => n.type === 'step-group')
                    .map((n) => n.id);

                  // Update collapsed refs
                  stepGroupIds.forEach((nodeId) => {
                    if (shouldCollapse) {
                      collapsedStepGroupsRef.current.add(nodeId);
                    } else {
                      collapsedStepGroupsRef.current.delete(nodeId);
                    }
                  });

                  // Update expandedStepGroups state
                  if (shouldCollapse) {
                    setExpandedStepGroups(new Set());
                  } else {
                    setExpandedStepGroups(new Set(stepGroupIds));
                  }

                  // Collapse/expand nodes directly without triggering useEffect's fromModel
                  stepGroupIds.forEach((nodeId) => {
                    const node = controller.getNodeById(nodeId);
                    if (node) {
                      node.setCollapsed(shouldCollapse);
                    }
                  });

                  // Layout and restore scale/position
                  graph.layout();
                  graph.setScale(savedScale);
                  graph.setBounds(graph.getBounds().setLocation(savedPosition.x, savedPosition.y));

                  // Skip the useEffect that would call fromModel
                  skipExpandGroupsEffectRef.current = true;

                  // Update expandGroups state
                  setExpandGroups(!expandGroups);
                },
              },
            ],
            legend: false,
          })}
        />
      }
    >
      <VisualizationProvider controller={controller}>
        <VisualizationSurface
          key={renderKey}
          state={{ selectedIds, viewOptions: { showStatusBackground: true } }}
        />
      </VisualizationProvider>
    </TopologyView>
  );
};
