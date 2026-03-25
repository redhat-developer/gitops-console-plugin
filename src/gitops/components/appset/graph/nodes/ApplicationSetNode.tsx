import * as React from 'react';
import { observer } from 'mobx-react';

import SvgTextWithOverflow from '@gitops/components/graph/SvgTextWithOverflow';
import { dangerColor, successColor, warningColor } from '@gitops/utils/components/Icons/Icons';
import { HealthStatus } from '@gitops/utils/constants';
import ApplicationIcon from '@images/resources/application.svg';
import { Tooltip } from '@patternfly/react-core';
import {
  GhostIcon,
  HeartBrokenIcon,
  HeartIcon,
  OutlinedCircleIcon,
  PauseIcon,
} from '@patternfly/react-icons';
import {
  DefaultNode,
  Node,
  RectAnchor,
  ShapeProps,
  useAnchor,
  useCombineRefs,
  useSvgAnchor,
  WithContextMenuProps,
  WithSelectionProps,
} from '@patternfly/react-topology';

import { StatusSvgIcon } from '../../../application/graph/icons/resource-icons';

interface CustomNodeProps {
  element: Node;
}

const ApplicationHealthStatusIcon = ({ status }: { status: HealthStatus }) => {
  let icon = null;
  switch (status) {
    case HealthStatus.HEALTHY:
      icon = <HeartIcon style={{ fill: `${successColor}` }} />;
      break;
    case HealthStatus.MISSING:
      icon = <GhostIcon style={{ fill: `${warningColor}` }} />;
      break;
    case HealthStatus.DEGRADED:
      icon = <HeartBrokenIcon style={{ fill: `${dangerColor}` }} />;
      break;
    case HealthStatus.PROGRESSING:
      icon = (
        <g transform={`translate(74, 40)`}>
          <StatusSvgIcon status={HealthStatus.PROGRESSING} />
        </g>
      );
      return <>{icon}</>;
    case HealthStatus.UNKNOWN:
      icon = <OutlinedCircleIcon style={{ fill: 'gray' }} />;
      break;
    case HealthStatus.SUSPENDED:
      icon = <PauseIcon style={{ fill: `${warningColor}` }} />;
      break;
    default:
      return <></>;
  }
  return (
    <foreignObject x={74} y={40} width={16} height={16}>
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

const ApplicationSetShape: React.FunctionComponent<ShapeProps> = observer(
  ({ element, className, width, height, filter, dndDropRef }) => {
    useAnchor(RectAnchor);
    const data = element.getData();
    const anchorRef = useSvgAnchor();
    const refs = useCombineRefs(dndDropRef, anchorRef);
    // Arc first and then draw rectangular part
    const applicationShapePath = `M 35 0 A 45 45 200 1 0 35 75 l 0 0 ${
      width - 35
    } 0 l 0 0 0 ${-height} l 0 0 ${-width + 35} 0`;
    return (
      <g>
        <g>
          <path filter={filter} ref={refs} className={className} d={applicationShapePath} />
        </g>
        <g transform={`translate(-2, 11)`}>
          <circle
            transform={'translate(12, 26)'}
            r="37"
            fill="var(--pf-t--global--background--color--floating--default)"
            stroke="var(--pf-topology__node__background--Stroke)"
            strokeWidth="2"
          />
          <foreignObject
            x={-24}
            y={12}
            width={16}
            height={28}
            color="var(--pf-topology__node__background--Stroke)"
          >
            <div
              style={{
                fontSize: '24px',
                width: '16px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {`{`}
            </div>
          </foreignObject>
          <ApplicationIcon
            className={className}
            x={-12}
            y={0}
            width={50}
            height={50}
            style={{ fill: 'var(--pf-topology__node__background--Stroke)' }}
          />
          <foreignObject
            x={34}
            y={12}
            width={16}
            height={28} // style={{ transform: 'scale(200)'}}
            color="var(--pf-topology__node__background--Stroke)"
          >
            <div
              style={{
                fontSize: '24px',
                width: '16px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {`}`}
            </div>
          </foreignObject>
        </g>
        <g>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="280"
            height="50"
            viewBox="0 0 280 50"
            overflow="hidden"
          >
            <SvgTextWithOverflow text={element.getData().name} maxWidth={200} x="75" y="30" />
          </svg>
          <ApplicationHealthStatusIcon status={data.appHealthStatus} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="280"
            height="60"
            viewBox="0 0 280 60"
            overflow="hidden"
          >
            <SvgTextWithOverflow
              text={element.getData().appHealthStatus}
              maxWidth={200}
              x="95"
              y="52"
            />
          </svg>
        </g>
      </g>
    );
  },
);

export const ApplicationSetNode: React.FC<
  CustomNodeProps & WithSelectionProps & WithContextMenuProps
> = observer(({ element, onContextMenu, contextMenuOpen, onSelect, selected }) => {
  const data = element.getData();
  return (
    <DefaultNode
      element={element}
      showStatusDecorator={false}
      badge={data.badge}
      onContextMenu={onContextMenu}
      contextMenuOpen={contextMenuOpen}
      badgeColor={data.badgeColor}
      badgeTextColor={data.badgeTextColor}
      badgeBorderColor={data.badgeBorderColor}
      onSelect={onSelect}
      selected={selected}
      nodeStatus={data.nodeStatus}
      hover={false} // Need this to allow selection
      getCustomShape={() => {
        return ApplicationSetShape;
      }}
    />
  );
});
