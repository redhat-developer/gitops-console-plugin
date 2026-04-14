/**
 * Resource Node for Argo CD Resources
 */
import * as React from 'react';
import { useLocation } from 'react-router-dom-v5-compat';
import { observer } from 'mobx-react';

import SvgTextWithOverflow from '@gitops/components/graph/SvgTextWithOverflow';
import { ApplicationModel } from '@gitops/models/ApplicationModel';
import { HealthStatus } from '@gitops/utils/constants';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import {
  BadgeLocation,
  DefaultNode,
  LabelBadge,
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
    const resourceNodeLayout = data.resourceNodeLayout as boolean;
    const location = useLocation();
    const truncatedBadge = data.badge.length > 3 ? data.badge.slice(0, 3) : data.badge;
    let dx = 8;
    if (truncatedBadge.length === 1) {
      dx = 17;
    } else if (truncatedBadge.length === 2) {
      dx = 12;
    }
    const transform = resourceNodeLayout ? `scale(0.6) translate(8, 6)` : '';
    return (
      <DefaultNode
        element={element}
        onContextMenu={onContextMenu}
        contextMenuOpen={contextMenuOpen}
        onSelect={onSelect}
        selected={selected}
        badge={data.badge}
        badgeLocation={resourceNodeLayout ? BadgeLocation.below : BadgeLocation.inner}
        labelPosition={resourceNodeLayout ? LabelPosition.left : LabelPosition.top}
        labelClassName={
          resourceNodeLayout
            ? 'gitops-resource-node-label gitops-resource-node-menu'
            : 'gitops-node-layout'
        }
        badgeClassName={resourceNodeLayout ? 'gitops-resource-node-label-badge-opaque' : ''}
        badgeColor={data.badgeColor}
        badgeTextColor={'white'}
        hover={false} // Need to set this to false for proper selection
        badgeBorderColor={data.badgeColor}
      >
        <g transform={resourceNodeLayout ? `translate(14, 5)` : `translate(14, 14)`}>
          <g width={21} height={21}>
            <ResourceSvgIcon kind={kind} badge={data.badge} badgeIconTransform={transform} />
          </g>
        </g>
        {resourceNodeLayout ? (
          <>
            <g transform={`scale(0.85)`}>
              <LabelBadge
                x={dx}
                y={34}
                badge={truncatedBadge}
                badgeClassName={'gitops-resource-node-label-badge'}
                badgeColor={data.badgeColor}
                badgeTextColor={data.badgeTextColor}
                badgeBorderColor={'var(--pf-topology__node__background--Stroke)'}
              />
            </g>
            <line x1="47" y1="0" x2="47" y2="50" stroke="gray" strokeWidth="1" />
          </>
        ) : (
          <line x1="45" y1="0" x2="45" y2="50" stroke="gray" strokeWidth="1" />
        )}
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
        {kind === ApplicationModel.kind && (
          <>
            <foreignObject
              x={90}
              y={25}
              width={100}
              height={20}
              color="var(--pf-topology__node__background--Stroke)"
            >
              <a
                href={
                  location.pathname +
                  '/../../../argoproj.io~v1alpha1~Application/' +
                  data.name +
                  '/resources'
                }
                target={undefined}
                rel={undefined}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                title={t('Go to application')}
              >
                <i className="fa fa-external-link-alt" />
              </a>
            </foreignObject>
            {data.step && (
              <svg transform={`translate(55, 29)`}>
                <text x="70" y="12">
                  {data.step !== '-1'
                    ? t('Step {{x}}', {
                        x: data.step,
                      })
                    : t('Step: unmatched')}
                </text>
              </svg>
            )}
          </>
        )}
      </DefaultNode>
    );
  });
