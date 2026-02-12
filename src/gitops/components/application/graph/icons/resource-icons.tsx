import * as React from 'react';

import { dangerColor, successColor, warningColor } from '@gitops/utils/components/Icons/Icons';
import { HealthStatus, SyncStatus } from '@gitops/utils/constants';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import ApplicationIcon from '@images/resources/application.svg';
import ConfigMapIcon from '@images/resources/cm.svg';
import DeploymentIcon from '@images/resources/deploy.svg';
import JobIcon from '@images/resources/job.svg';
import NamespaceIcon from '@images/resources/ns.svg';
import PodIcon from '@images/resources/pod.svg';
import PVCIcon from '@images/resources/pv.svg';
import RoleBindingIcon from '@images/resources/rb.svg';
import ServiceAccountIcon from '@images/resources/sa.svg';
import SecretIcon from '@images/resources/secret.svg';
import StatefulSetIcon from '@images/resources/sts.svg';
import ServiceIcon from '@images/resources/svc.svg';
import { Tooltip } from '@patternfly/react-core';
import {
  ArrowCircleUpIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  GhostIcon,
  HeartBrokenIcon,
  HeartIcon,
  OutlinedCircleIcon,
  PauseCircleIcon,
  SyncAltIcon,
} from '@patternfly/react-icons';

interface ResourceIconProps {
  kind: string;
  badge: string;
}

const iconHeight = 21;
const iconWidth = 21;

export const ResourceSvgIcon: React.FC<ResourceIconProps> = ({ kind, badge }) => {
  let targetIcon: React.ReactNode;
  switch (kind) {
    case 'Namespace':
      targetIcon = <NamespaceIcon width={iconWidth} height={iconHeight} />;
      break;
    case 'Secret':
      targetIcon = <SecretIcon width={iconWidth} height={iconHeight} />;
      break;
    case 'Service':
      targetIcon = <ServiceIcon width={iconWidth} height={iconHeight} />;
      break;
    case 'ServiceAccount':
      targetIcon = <ServiceAccountIcon width={iconWidth} height={iconHeight} />;
      break;
    case 'Pod':
      targetIcon = <PodIcon width={iconWidth} height={iconHeight} />;
      break;
    case 'PersistentVolumeClaim':
      targetIcon = <PVCIcon width={iconWidth} height={iconHeight} />;
      break;
    case 'Deployment':
      targetIcon = <DeploymentIcon width={iconWidth} height={iconHeight} />;
      break;
    case 'RoleBinding':
      targetIcon = <RoleBindingIcon width={iconWidth} height={iconHeight} />;
      break;
    case 'ConfigMap':
      targetIcon = <ConfigMapIcon width={iconWidth} height={iconHeight} />;
      break;
    case 'StatefulSet':
      targetIcon = <StatefulSetIcon width={iconWidth} height={iconHeight} />;
      break;
    case 'Job':
      targetIcon = <JobIcon width={iconWidth} height={iconHeight} />;
      break;
    case 'Application':
      targetIcon = <ApplicationIcon width={iconWidth} height={iconHeight} />;
      break;
    default:
      targetIcon = (
        <g>
          <circle
            transform={'translate(9, 10)'}
            r="16"
            fill="#495763"
            stroke="#495763"
            strokeWidth="1"
          />
          <text x={-1} y={14} width={18} height={18} fill="lightgray">
            {badge}
          </text>
        </g>
      );
      break;
  }
  return <>{targetIcon}</>;
};

interface StatusIconProps {
  status: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export const StatusSvgIcon: React.FC<StatusIconProps> = ({ status }) => {
  let targetIcon: React.ReactNode;
  switch (status) {
    case HealthStatus.PROGRESSING:
      targetIcon = (
        <g
          style={
            {
              transformOrigin: 'center',
              transformBox: 'fill-box',
              animation: 'fa-spin 2s linear infinite',
            } as React.CSSProperties
          }
        >
          <SyncAltIcon width={14} height={14} style={{ fill: 'lightblue' }} />
        </g>
      );
      break;
  }
  return <>{targetIcon}</>;
};

export const HealthStatusSvgIcon: React.FC<StatusIconProps> = ({ status, x, y, width, height }) => {
  let icon = null;
  if (status === HealthStatus.HEALTHY) {
    icon = <HeartIcon style={{ fill: `${successColor}` }} />;
  } else if (status === HealthStatus.SUSPENDED) {
    icon = <PauseCircleIcon style={{ fill: `${warningColor}` }} />;
  } else if (status === HealthStatus.DEGRADED) {
    icon = <HeartBrokenIcon style={{ fill: `${dangerColor}` }} />;
  } else if (status === HealthStatus.MISSING) {
    icon = <GhostIcon style={{ fill: `${warningColor}` }} />;
  } else if (status === HealthStatus.PROGRESSING) {
    icon = <SyncAltIcon width={14} height={14} style={{ fill: 'lightblue' }} />;
  } else {
    icon = <OutlinedCircleIcon style={{ fill: 'gray' }} />;
  }
  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      <div
        style={{
          width: '16px',
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Tooltip content={status || t('There is no health status for this resource')}>
          <>{icon}</>
        </Tooltip>
      </div>
    </foreignObject>
  );
};

export const SyncStatusSvgIcon: React.FC<StatusIconProps> = ({ status, x, y, width, height }) => {
  let icon = null;
  if (status === SyncStatus.SYNCED) {
    icon = <CheckCircleIcon style={{ fill: successColor }} />;
  } else if (status === SyncStatus.OUT_OF_SYNC) {
    icon = <ArrowCircleUpIcon style={{ fill: `${warningColor}` }} />;
  } else {
    // status === SyncStatus.UNKNOWN)
    icon = (
      <CircleNotchIcon className={'fa-spin'} title={t('Unknown')} style={{ fill: 'lightblue' }} />
    );
  }
  return (
    <foreignObject x={x} y={y} width={width} height={height}>
      <div
        style={{
          width: '16px',
          height: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Tooltip content={status}>
          <>{icon}</>
        </Tooltip>
      </div>
    </foreignObject>
  );
};
