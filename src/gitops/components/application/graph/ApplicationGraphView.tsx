import * as React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom-v5-compat';
import { observer } from 'mobx-react';

import {
  ApplicationKind,
  applicationModelRef,
  ApplicationResourceStatus,
} from '@gitops/models/ApplicationModel';
import { HealthStatus } from '@gitops/utils/constants';
import { ArgoServer, getArgoServer } from '@gitops/utils/gitops';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import {
  useAnnotationsModal,
  useDeleteModal,
  useK8sModels,
  useLabelsModal,
  useUserSettings,
} from '@openshift-console/dynamic-plugin-sdk';
import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { ObjectGroupIcon } from '@patternfly/react-icons';
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

import { GraphResourceMenuItem } from './hooks/GraphResourceMenuItems';
import { ApplicationNode } from './nodes/ApplicationNode';
import { ResourceGroupNode } from './nodes/ResourceGroupNode';
import { ResourceNode } from './nodes/ResourceNode';
import { getInitialEdges, getInitialNodes } from './graph-utils';

import './ApplicationGraphView.scss';

const customLayoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined => {
  return new DagreLayout(graph, {
    rankdir: 'LR',
    ranksep: 1,
    nodesep: 0,
    edgesep: 0,
    ranker: 'network-simplex',
    marginx: 50,
    marginy: 50,
  });
};

const customComponentFactory =
  (
    hrefRef: React.MutableRefObject<string>,
    application: ApplicationKind,
    navigate: NavigateFunction,
    launchLabelsModal: () => void,
    launchAnnotationsModal: () => void,
    launchDeleteModal: () => void,
    groupNodeStates: string[],
    setGroupNodeStates: React.Dispatch<React.SetStateAction<string[]>>,
  ): ComponentFactory =>
  (kind: ModelKind, type: string) => {
    const createContextMenuItems = (
      graphElement: GraphElement,
      resourceKind,
      ...labels: string[]
    ): React.ReactElement[] => {
      return labels.map((label, i) => contextMenuItem(graphElement, label, i));
    };
    const createContextMenuItems2 = (
      graphElement: GraphElement,
      labels: string[],
    ): React.ReactElement[] => {
      return labels.map((label, i) => contextMenuItem2(graphElement, label, i));
    };

    const contextMenuItem2 = (
      graphElement: GraphElement,
      label: string,
      i: number,
    ): React.ReactElement => {
      if (label === '-') {
        return <ContextMenuSeparator component="li" key={`separator:${i.toString()}`} />;
      }

      if (
        label === 'Edit labels' ||
        label === 'Edit annotations' ||
        label === 'Delete ' + graphElement.getData().kind ||
        label === 'Edit ' + graphElement.getData().kind
      ) {
        return <GraphResourceMenuItem key={label} graphElement={graphElement} label={label} />;
      }

      // For other actions that don't need resource-specific hooks
      return (
        <ContextMenuItem
          key={label}
          onClick={() => {
            if (label === t('View in Argo CD')) {
              window.open(hrefRef.current, '_blank');
            }
          }}
        >
          {label}
        </ContextMenuItem>
      );
    };

    const resourceItems = (graphElement: GraphElement) => {
      if (graphElement.getData().resourceHealthStatus === HealthStatus.MISSING) {
        return createContextMenuItems2(graphElement, [t('View in Argo CD')]);
      }
      if (graphElement.getData().kind === 'AppProject') {
        return createContextMenuItems2(graphElement, [
          t('Edit labels'),
          t('Edit annotations'),
          t('Edit {{x}}', {
            x: graphElement.getData().kind,
          }),
          '-',
          t('View in Argo CD'),
        ]);
      } else {
        return createContextMenuItems2(graphElement, [
          t('Edit labels'),
          t('Edit annotations'),
          t('Edit {{x}}', {
            x: graphElement.getData().kind,
          }),
          t('Delete {{x}}', {
            x: graphElement.getData().kind,
          }),
          '-',
          t('View in Argo CD'),
        ]);
      }
    };

    const contextMenuItem = (
      graphElement: GraphElement,
      label: string,
      i: number,
    ): React.ReactElement => {
      if (label === '-') {
        return <ContextMenuSeparator component="li" key={`separator:${i.toString()}`} />;
      }

      return (
        // eslint-disable-next-line no-alert
        <ContextMenuItem
          key={label}
          onClick={async () => {
            if (label === t('View in Argo CD')) {
              window.open(hrefRef.current, '_blank');
            } else if (label === t('Edit labels')) {
              launchLabelsModal();
            } else if (label === t('Edit annotations')) {
              launchAnnotationsModal();
            } else if (label === t('Edit Application')) {
              navigate(
                `/k8s/ns/${application.metadata.namespace}/${applicationModelRef}/${application.metadata.name}/yaml`,
              );
            } else if (label === t('Delete Application')) {
              launchDeleteModal();
            } else if (
              label === 'Show ' + graphElement.getData().kindPlural ||
              label === 'Hide ' + graphElement.getData().kindPlural
            ) {
              const key = graphElement.getData().kindPlural;
              setGroupNodeStates((prev) => {
                const isPresent = prev.includes(key);
                const newStates = isPresent ? prev.filter((node) => node !== key) : [...prev, key];
                return newStates;
              });
            }
          }}
        >
          {label}
        </ContextMenuItem>
      );
    };
    switch (type) {
      case 'group':
        return TransparentGroup;
      case 'data-edge':
        return DataEdge;
      case 'task-edge':
        return TaskEdge;
      case 'spacer-node':
        return SpacerNode;
      case DEFAULT_SPACER_NODE_TYPE:
        return SpacerNode;
      case 'node-group':
        return withContextMenu((graphElement) => {
          const resourceGroupExpandState = graphElement.getData().resourceGroupExpandState;
          return createContextMenuItems(
            graphElement,
            kind,
            !resourceGroupExpandState
              ? t('Show {{x}}', {
                  x: graphElement.getData().kindPlural,
                })
              : t('Hide {{x}}', {
                  x: graphElement.getData().kindPlural,
                }),
          );
        })(withSelection()(ResourceGroupNode));
      case 'application-node': {
        return withContextMenu((graphElement) =>
          createContextMenuItems(
            graphElement,
            t('Edit labels'),
            t('Edit annotations'),
            t('Edit Application'),
            t('Delete Application'),
            '-',
            t('View in Argo CD'),
          ),
        )(withSelection()(ApplicationNode));
      }
      default:
        switch (kind) {
          case ModelKind.graph:
            return withPanZoom()(GraphComponent);
          case ModelKind.node:
            return withContextMenu((graphElement) => resourceItems(graphElement))(
              withSelection()(ResourceNode),
            );
          case ModelKind.edge:
            return TaskEdge;
          default:
            return undefined;
        }
    }
  };

const TransparentGroup: React.FC<{ element: TopologyNode }> = observer(({}) => {
  return (
    <Layer id={GROUPS_LAYER}>
      <g></g>
    </Layer>
  );
});

interface DataEdgeProps {
  element: Edge;
}

const DataEdge: React.FC<DataEdgeProps> = ({ element, ...rest }) => (
  <DefaultEdge
    element={element}
    edgeStyle={EdgeStyle.solid}
    endTerminalType={EdgeTerminalType.none}
    {...rest}
  />
);

export const ApplicationGraphView: React.FC<{
  application: ApplicationKind;
  resources: ApplicationResourceStatus[];
}> = ({ application, resources }) => {
  const [model] = useK8sModel({ group: 'route.openshift.io', version: 'v1', kind: 'Route' });
  const [allK8sModels] = useK8sModels();
  const [groupNodeStates, setGroupNodeStates] = React.useState<string[]>([]);
  // Save the group node setting so it will be used whenever the user re-enters the graph view
  const [groupNodeState, setGroupNodeState] = useUserSettings(
    'redhat.gitops.groupNodeState',
    false,
    false,
  );
  const [argoServer, setArgoServer] = React.useState<ArgoServer>({ host: '', protocol: '' });
  const hrefRef = React.useRef<string>('');
  React.useEffect(() => {
    (async () => {
      getArgoServer(model, application)
        .then((server) => {
          setArgoServer(server);
        })
        .catch((err) => {
          console.error('Graph view error: ' + err);
        });
    })();
  }, [model, application]);
  const href = argoServer
    ? argoServer.protocol +
      '://' +
      argoServer.host +
      '/applications/' +
      application?.metadata?.namespace +
      '/' +
      application?.metadata?.name
    : '';
  hrefRef.current = href;

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [renderKey, setRenderKey] = React.useState(0);
  const launchLabelsModal = useLabelsModal(application);
  const launchAnnotationsModal = useAnnotationsModal(application);
  const launchDeleteModal = useDeleteModal(application);
  const navigate = useNavigate();

  const controller = React.useMemo(() => {
    const newController = new Visualization();
    newController.registerLayoutFactory(customLayoutFactory);
    newController.registerComponentFactory(
      customComponentFactory(
        hrefRef,
        application,
        navigate,
        launchLabelsModal,
        launchAnnotationsModal,
        launchDeleteModal,
        groupNodeStates,
        setGroupNodeStates,
      ),
    );
    newController.addEventListener(SELECTION_EVENT, setSelectedIds);
    return newController;
  }, []);

  const initialNodes = getInitialNodes(
    application,
    resources,
    allK8sModels,
    groupNodeState,
    groupNodeStates,
  );
  const initialEdges = getInitialEdges(application, initialNodes, groupNodeState);
  const nodes = [...initialNodes];

  // Logic to handle unnecessary re-renders was aided by AI. Examining structural changes to the tree to determine
  // when to refresh and layout seems like a good idea, versus, data-only changes, and we just simply want
  // to refresh the contents of the nodes.  This appears to work better than setting merge to true and false on the controller
  // Track the previous node count to detect structural changes
  const previousNodeCountRef = React.useRef<number>(0);
  const groupNodeRef = React.useRef<boolean>(groupNodeState);

  const currentNodeCount = nodes.length;
  const previousNodeCount = previousNodeCountRef.current;
  const previousGroupNodeState = groupNodeRef.current;
  const isStructuralChange =
    currentNodeCount !== previousNodeCount || previousGroupNodeState != groupNodeState;

  if (isStructuralChange || previousNodeCount === 0) {
    // Structural change: Create model WITH layout
    const modelWithLayout: Model = {
      nodes: nodes,
      edges: initialEdges,
      graph: {
        id: 'g1',
        type: 'graph',
        layout: 'PipleineDagreLayout',
      },
    };

    controller.fromModel(modelWithLayout, false);
    previousNodeCountRef.current = currentNodeCount;
    groupNodeRef.current = groupNodeState;
  } else {
    // Data change only: Update ONLY changed nodes (no layout, no position changes)
    let updateCount = 0;
    nodes.forEach((nodeModel) => {
      const existingNode = controller.getNodeById(nodeModel.id);
      if (!existingNode) {
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
          existingNode.setData(freshData);

          // Also update the model data to ensure consistency
          existingNode.setModel({
            ...existingNode.toModel(),
            data: freshData,
            status: nodeModel.status,
            label: nodeModel.label,
          });
          // Update other properties
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

    if (updateCount > 0) {
      // Force React to re-render the VisualizationSurface by changing key
      setRenderKey((prev) => prev + 1);
    }
  }

  return (
    <TopologyView
      className="gitops-topology-view"
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
                id: 'use-group-nodes',
                icon: <ObjectGroupIcon />,
                tooltip: t('Group resources of the same kind into one node'),
                ariaLabel: t('Group Nodes'),
                callback: () => {
                  setGroupNodeState(!groupNodeState);
                  controller.getGraph().layout();
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
//
