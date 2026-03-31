import * as React from 'react';
import { observer } from 'mobx-react';

import {
  RESOURCE_BADGE_COLORS,
  RESOURCE_COLORS,
} from '@gitops/components/application/graph/icons/resource-colours';
import { APP_NODE_HEIGHT } from '@gitops/components/graph/utils';
import { successColor, warningColor } from '@gitops/utils/components/Icons/Icons';
import ApplicationIcon from '@images/resources/application.svg';
import { Tooltip } from '@patternfly/react-core';
import { HeartIcon, PauseIcon, SyncAltIcon, WarningTriangleIcon } from '@patternfly/react-icons';
import { css } from '@patternfly/react-styles';
import {
  AbstractAnchor,
  AnchorEnd,
  BadgeLocation,
  DefaultGroup,
  LabelPosition,
  Node as TopologyNode,
  Point,
  RectAnchor,
  ShapeProps,
  useAnchor,
  WithSelectionProps,
} from '@patternfly/react-topology';
import styles from '@patternfly/react-topology/dist/esm/css/topology-components';

const ProgressiveSyncStatus = ({ status, x, y }: { status: string; x: number; y: number }) => {
  let icon = null;
  switch (status) {
    case 'Healthy':
      icon = <HeartIcon style={{ fill: `${successColor}` }} />;
      break;
    case 'Waiting':
      icon = <PauseIcon style={{ fill: `${warningColor}` }} />;
      break;
    case 'Pending':
      icon = <WarningTriangleIcon style={{ fill: `${warningColor}` }} />;
      break;
    case 'Progressing':
      icon = <SyncAltIcon width={14} height={14} style={{ fill: 'lightblue' }} />;
      break;
    default:
      return <></>;
  }
  return (
    <foreignObject x={x} y={y} width={16} height={16}>
      <div
        style={{
          width: '16px',
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Tooltip content={status}>{icon}</Tooltip>
      </div>
    </foreignObject>
  );
};

type RectangleProps = ShapeProps & {
  cornerRadius?: number;
  strokeColor?: string;
  strokeWidth?: number;
};

const ShapeComponent: React.FunctionComponent<RectangleProps> = ({
  width,
  height,
  cornerRadius,
  filter,
  className,
  strokeColor,
  strokeWidth,
}) => {
  useAnchor(RectAnchor);
  return (
    <rect
      className={className}
      style={{ stroke: `${strokeColor}`, strokeWidth: `${strokeWidth}` }}
      rx={cornerRadius}
      ry={cornerRadius}
      width={width}
      height={height}
      filter={filter}
    />
  );
};

const CollapsedGroup: React.FunctionComponent<RectangleProps & WithSelectionProps> = ({
  className = css(styles.topologyNodeBackground, 'gitops-collapsed-step-group'),
  element,
  cornerRadius = 15,
  width = 300,
  height = 50,
  filter,
  strokeColor,
  strokeWidth = 1,
  selected,
}) => {
  useAnchor(RectAnchor);
  const data = element.getData();
  // eslint-disable-next-line no-nested-ternary
  const borderColor = data.groupHealthy
    ? successColor
    : // eslint-disable-next-line no-nested-ternary
    data.waitingCount > 0
    ? warningColor
    : // eslint-disable-next-line no-nested-ternary
    data.pendingCount > 0
    ? warningColor
    : data.progressingCount
    ? 'lightblue'
    : undefined;
  (width = 300), (height = 50);
  return (
    <g>
      <g transform={`translate(12, 12)`}>
        <ShapeComponent
          element={element}
          width={width}
          height={height}
          cornerRadius={cornerRadius}
          className={className}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
        />
      </g>
      <g transform={`translate(6, 6)`}>
        <ShapeComponent
          element={element}
          width={width}
          height={height}
          cornerRadius={cornerRadius}
          className={className}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
        />
      </g>
      <ShapeComponent
        element={element}
        width={width}
        height={height}
        cornerRadius={cornerRadius}
        filter={filter}
        className={className}
        strokeColor={borderColor}
        strokeWidth={selected ? 4 : 2}
      />
      <g className={'gitops-step-group-collapsed-text'}>
        <g>
          <ApplicationIcon
            x={10}
            y={4}
            width={19}
            height={19}
            style={{ stroke: 'var(--pf-topology__node__background--Stroke)' }}
          />
          <text x={34} y={19} className={'gitops-step-group-collapsed'}>
            {'Applications: ' + element.getData().appCount}
          </text>
        </g>
        <g>
          <ProgressiveSyncStatus x={10} y={27} status={'Healthy'} />
          <text x={30} y={40} className={'gitops-step-group-collapsed'}>
            {element.getData().healthyCount}
          </text>
        </g>
        <g>
          <text x={100} y={40} className={'gitops-step-group-collapsed'}>
            {element.getData().progressingCount}
          </text>
          <ProgressiveSyncStatus x={80} y={27} status={'Progressing'} />
        </g>
        <g>
          <text x={170} y={40} className={'gitops-step-group-collapsed'}>
            {element.getData().pendingCount}
          </text>
          <ProgressiveSyncStatus x={150} y={27} status={'Pending'} />
        </g>
        <g>
          <text x={240} y={40} className={'gitops-step-group-collapsed'}>
            {element.getData().waitingCount}
          </text>
          <ProgressiveSyncStatus x={220} y={27} status={'Waiting'} />
        </g>
      </g>
    </g>
  );
};

class RightAnchor extends AbstractAnchor {
  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();
    const node = this.owner as TopologyNode;
    const isCollapsed = node.isCollapsed?.();

    if (isCollapsed) {
      return new Point(bounds.x + bounds.width, bounds.y + bounds.height / 2);
    }

    // For expanded, get the top-most child application node's vertical center
    const firstChild = node
      .getChildren?.()
      ?.find(
        (c) =>
          c.getType() === 'node' && (c as TopologyNode).getBounds().y - bounds.y < APP_NODE_HEIGHT,
      ) as TopologyNode | undefined;
    if (firstChild) {
      const childBounds = firstChild.getBounds();
      return new Point(bounds.x + bounds.width, childBounds.y + childBounds.height / 2);
    }

    return new Point(bounds.x + bounds.width, bounds.y + bounds.height / 2);
  }
}

class LeftAnchor extends AbstractAnchor {
  getLocation(): Point {
    return this.getReferencePoint();
  }

  getReferencePoint(): Point {
    const bounds = this.owner.getBounds();
    const node = this.owner as TopologyNode;
    const isCollapsed = node.isCollapsed?.();

    if (isCollapsed) {
      return new Point(bounds.x, bounds.y + bounds.height / 2);
    }

    // For expanded, get the top-most child application node's vertical center
    const firstChild = node
      .getChildren?.()
      ?.find(
        (c) =>
          c.getType() === 'node' && (c as TopologyNode).getBounds().y - bounds.y < APP_NODE_HEIGHT,
      ) as TopologyNode | undefined;
    if (firstChild) {
      const childBounds = firstChild.getBounds();
      return new Point(bounds.x, childBounds.y + childBounds.height / 2);
    }

    return new Point(bounds.x, bounds.y + bounds.height / 2);
  }
}

// Need this for collapsed step group as a dummy shape. It is hidden. Will use child node instead in StepGroupComponent
const DummyShape: React.FunctionComponent<RectangleProps> = ({
  className = css(styles.topologyNodeBackground),
  filter,
}) => {
  return (
    <g opacity={0}>
      <rect className={className} width={50} height={25} filter={filter}></rect>
    </g>
  );
};

// This is the collapsible group of applications that have the same step, determined by the matched expression defined in the ApplicationSet
export const StepGroupComponent: React.FC<WithSelectionProps & { element: TopologyNode }> =
  observer(({ element, onSelect, selected }) => {
    useAnchor(RightAnchor, AnchorEnd.source, 'task-edge');
    useAnchor(LeftAnchor, AnchorEnd.target, 'task-edge');

    const handleCollapseChange = React.useCallback((group: TopologyNode, collapsed: boolean) => {
      const stepGroup = group
        .getGraph()
        .getChildren()
        .find((c) => c.getId() === 'transparent-group-of-step-groups-' + group.getData()?.step);
      if (stepGroup) {
        stepGroup.getData().isCollapsed = collapsed;
      }
      // Update expanded step-groups state to trigger structural refresh
      // Get callback from controller (not graph) since graph may be replaced during model updates
      const graph = group.getGraph();
      const controller = graph?.getController?.();
      const updateExpanded = (controller as any)?.updateExpandedStepGroups;
      if (updateExpanded) {
        updateExpanded(group.getId(), !collapsed);
      }
    }, []);

    return (
      <DefaultGroup
        element={element}
        className={css('gitops-step-group', selected && 'pf-m-selected')}
        borderRadius={5}
        collapsible={true}
        hulledOutline={true}
        showLabelOnHover={false}
        showLabel={true}
        labelPosition={LabelPosition.top}
        badgeLocation={BadgeLocation.inner}
        badgeColor="var(--pf-t--global--background--color--floating--default)"
        badgeBorderColor={RESOURCE_COLORS.get(
          RESOURCE_BADGE_COLORS.get('.co-m-resource-application'),
        )}
        badgeTextColor="var(--pf-t--global--text--color--regular)"
        badge={element.getData().step}
        collapsedShadowOffset={0}
        collapsedWidth={300}
        collapsedHeight={50}
        getCollapsedShape={() => DummyShape}
        labelClassName={css('gitops-step-group-label', selected && 'pf-m-selected')}
        onCollapseChange={handleCollapseChange}
        onSelect={onSelect}
        selected={selected}
      >
        <CollapsedGroup element={element} width={300} height={50} selected={selected} />
      </DefaultGroup>
    );
  });

export default StepGroupComponent;
