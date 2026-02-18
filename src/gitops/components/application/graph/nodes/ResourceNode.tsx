/**
 * Resource Node for Argo CD Resources
 */
import * as React from 'react';
import { observer } from 'mobx-react';

import SvgTextWithOverflow from '@gitops/components/graph/SvgTextWithOverflow';
import { HealthStatus } from '@gitops/utils/constants';
import {
  BadgeLocation,
  DefaultNode,
  LabelPosition,
  Node as TopologyNode,
  WithContextMenuProps,
  WithSelectionProps,
} from '@patternfly/react-topology';

import {
  HealthStatusSvgIcon,
  ResourceSvgIcon,
  StatusSvgIcon,
  SyncStatusSvgIcon,
} from '../icons/resource-icons';

interface CustomNodeProps {
  element: TopologyNode;
}

export const ResourceNode: React.FC<CustomNodeProps & WithSelectionProps & WithContextMenuProps> =
  observer(({ element, onContextMenu, contextMenuOpen, onSelect, selected }) => {
    const data = element.getData();
    const kind = data.icon as string;
    return (
      <DefaultNode
        element={element}
        onContextMenu={onContextMenu}
        contextMenuOpen={contextMenuOpen}
        onSelect={onSelect}
        selected={selected}
        badge={data.badge}
        badgeLocation={BadgeLocation.inner}
        labelPosition={LabelPosition.top}
        badgeColor={data.badgeColor}
        badgeTextColor={'white'}
        hover={false} // Need to set this to false for proper selection
        badgeBorderColor={data.badgeColor}
      >
        <g transform={`translate(14, 14)`}>
          <g width={21} height={21}>
            <ResourceSvgIcon kind={kind} badge={data.badge} />
          </g>
        </g>
        <line x1="45" y1="0" x2="45" y2="50" stroke="gray" strokeWidth="1" />
        <svg xmlns="http://www.w3.org/2000/svg">
          <SvgTextWithOverflow text={data.name} maxWidth={200} x="54" y="20" />
        </svg>
        {data.resourceHealthStatus === HealthStatus.PROGRESSING ? (
          <g transform={`translate(55, 29)`}>
            <StatusSvgIcon status={HealthStatus.PROGRESSING} />
          </g>
        ) : (
          <HealthStatusSvgIcon
            status={data.resourceHealthStatus}
            x={54}
            y={28}
            width={16}
            height={16}
          />
        )}
        <SyncStatusSvgIcon status={data.syncStatus} x={71} y={28} width={16} height={16} />
      </DefaultNode>
    );
  });
