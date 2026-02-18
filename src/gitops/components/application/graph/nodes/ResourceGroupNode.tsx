import * as React from 'react';
import { observer } from 'mobx-react';

import SvgTextWithOverflow from '@gitops/components/graph/SvgTextWithOverflow';
import { dangerColor, successColor, warningColor } from '@gitops/utils/components/Icons/Icons';
import { HealthStatus, SyncStatus } from '@gitops/utils/constants';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import {
  GhostIcon,
  HeartBrokenIcon,
  HeartIcon,
  PauseCircleIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';
import {
  DefaultNode,
  Node as TopologyNode,
  WithContextMenuProps,
  WithSelectionProps,
} from '@patternfly/react-topology';

import { ResourceSvgIcon, StatusSvgIcon, SyncStatusSvgIcon } from '../icons/resource-icons';

interface CustomNodeProps {
  element: TopologyNode;
}

export const ResourceGroupNode: React.FC<
  CustomNodeProps & WithSelectionProps & WithContextMenuProps
> = observer(({ element, onContextMenu, contextMenuOpen, onSelect, selected }) => {
  const data = element.getData();
  // const Icon = data.icon ? data.icon : null;
  const kind = data.icon as string;
  return (
    <DefaultNode
      element={element}
      onContextMenu={(e) => onContextMenu(e)}
      contextMenuOpen={contextMenuOpen}
      onSelect={onSelect}
      selected={selected}
      badge={data.badge}
      badgeColor={data.badgeColor}
      badgeTextColor={'white'}
      hover={false} // Need to set this to false for proper selection
      badgeBorderColor={data.badgeColor}
    >
      <g transform={`translate(14, 19)`}>
        {kind !== null ? (
          <g transform={`translate(0, 5)`}>
            <ResourceSvgIcon kind={kind as string} badge={data.badge} />
          </g>
        ) : (
          <g>
            <circle
              transform={'translate(9, 17)'}
              r="16"
              fill="#495763"
              stroke="#495763"
              strokeWidth="1"
            />
            <text
              x={4 - 2 * data.badge.length}
              y={21}
              width={18}
              height={18}
              fill="lightgray"
              style={{ alignItems: 'center' }}
            >
              {data.badge}
            </text>
          </g>
        )}
      </g>
      <line x1="45" y1="25" x2="277" y2="25" stroke="gray" strokeWidth="1" />
      <svg xmlns="http://www.w3.org/2000/svg">
        <SvgTextWithOverflow
          text={`${data.totalKindCount + ' ' + data.kindPlural}`}
          maxWidth={200}
          x="69"
          y="19"
        />
        {data.healthyCount === data.resourceCount && (
          <SvgTextWithOverflow text={`${data.healthyCount} Healthy`} maxWidth={200} x="69" y="40" />
        )}
        {/* eslint-disable no-nested-ternary */}
        {data.hasProgressing ? (
          <SvgTextWithOverflow text={`Progressing`} maxWidth={200} x="69" y="40" />
        ) : data.hasDegraded ? (
          <SvgTextWithOverflow text={`Degraded`} maxWidth={200} x="69" y="40" />
        ) : data.hasMissing ? (
          <SvgTextWithOverflow text={`Missing`} maxWidth={200} x="69" y="40" />
        ) : data.hasSuspended ? (
          <SvgTextWithOverflow text={`Suspended`} maxWidth={200} x="69" y="40" />
        ) : data.hasUnknown ? (
          <SvgTextWithOverflow text={`Unknown`} maxWidth={200} x="69" y="40" />
        ) : (
          <></>
        )}
        {data.resourceSyncedCount === data.resourceCount && (
          <SvgTextWithOverflow
            text={`${data.resourceSyncedCount} Synced`}
            maxWidth={200}
            x="69"
            y="58"
          />
        )}
        {data.resourceOutOfSyncCount === data.resourceCount && (
          <SvgTextWithOverflow
            text={`${data.resourceOutOfSyncCount} OutOfSync`}
            maxWidth={200}
            x="69"
            y="58"
          />
        )}
      </svg>
      <line x1="45" y1="0" x2="45" y2="70" stroke="gray" strokeWidth="1" />
      {data.healthyCount === data.resourceCount && (
        <foreignObject x={48} y={27} width={16} height={16}>
          <div
            style={{
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HeartIcon style={{ fill: `${successColor}` }} />
          </div>
        </foreignObject>
      )}
      {data.hasProgressing ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg">
            <g transform={`translate(49, 28)`}>
              <StatusSvgIcon status={HealthStatus.PROGRESSING}>
                <title>{t('One or more resources are in Progressing state')}</title>
              </StatusSvgIcon>
            </g>
          </svg>
        </>
      ) : data.hasDegraded ? (
        <foreignObject x={48} y={27} width={16} height={16}>
          <div
            style={{
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HeartBrokenIcon style={{ fill: `${dangerColor}` }} />
          </div>
        </foreignObject>
      ) : data.hasMissing ? (
        <foreignObject x={48} y={27} width={16} height={16}>
          <div
            style={{
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GhostIcon style={{ fill: `${warningColor}` }} />
          </div>
        </foreignObject>
      ) : data.hasSuspended ? (
        <foreignObject x={48} y={27} width={16} height={16}>
          <div
            style={{
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PauseCircleIcon style={{ fill: `${warningColor}` }} />
          </div>
        </foreignObject>
      ) : data.hasUnknown ? (
        <foreignObject x={48} y={27} width={16} height={16}>
          <div
            style={{
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <QuestionCircleIcon style={{ fill: `${warningColor}` }} />
          </div>
        </foreignObject>
      ) : (
        <></>
      )}
      {data.resourceSyncedCount > 0 && (
        <SyncStatusSvgIcon status={SyncStatus.SYNCED} x={48} y={45} width={16} height={16} />
      )}
      {data.resourceOutOfSyncCount > 0 && (
        <SyncStatusSvgIcon status={SyncStatus.OUT_OF_SYNC} x={48} y={45} width={16} height={16} />
      )}
    </DefaultNode>
  );
});
