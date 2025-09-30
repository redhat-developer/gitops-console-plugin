import * as React from 'react';
import {
  HealthDegradedIcon,
  HealthHealthyIcon,
  HealthMissingIcon,
  HealthProgressingIcon,
  HealthSuspendedIcon,
  HealthUnknownIcon,
  SpinningIcon,
} from 'src/gitops/utils/components/Icons/Icons';
import { HealthStatus as HS } from 'src/gitops/utils/constants';

import { COLORS } from '@gitops/components/shared/colors';
import { Button, Popover } from '@patternfly/react-core';

interface HealthProps {
  status: string;
  message?: string;
}

const HealthStatus: React.FC<HealthProps> = ({ status, message }) => {
  let targetIcon: React.ReactNode;
  switch (status) {
    case HS.HEALTHY:
      targetIcon = <HealthHealthyIcon />;
      break;
    case HS.DEGRADED:
      targetIcon = <HealthDegradedIcon />;
      break;
    case HS.SUSPENDED:
      targetIcon = <HealthSuspendedIcon />;
      break;
    case HS.MISSING:
      targetIcon = <HealthMissingIcon />;
      break;
    case HS.PROGRESSING:
      targetIcon = <HealthProgressingIcon />;
      break;
    default:
      targetIcon = <HealthUnknownIcon />;
  }

  let showStatus: React.ReactFragment;
  if (message) {
    showStatus = (
      <div>
        <Popover
          aria-label="Health Status"
          headerContent={<div>{status}</div>}
          bodyContent={<div>{message}</div>}
        >
          <Button variant="link" isInline component="span">
            {targetIcon} {status}
          </Button>
        </Popover>
      </div>
    );
  } else {
    showStatus = (
      <div>
        {targetIcon} {status}
      </div>
    );
  }

  return <div>{showStatus}</div>;
};

export type HealthStatusCode =
  | 'Unknown'
  | 'Progressing'
  | 'Healthy'
  | 'Suspended'
  | 'Degraded'
  | 'Missing';

export interface HealthStatusModel {
  status: HealthStatusCode;
  message: string;
}

export const HealthStatusIcon = ({ status }: { status: HealthStatusCode }) => {
  let color = COLORS.health.unknown;
  let icon = 'fa-question-circle';

  switch (status) {
    case HS.HEALTHY:
      color = COLORS.health.healthy;
      icon = 'fa-heart';
      break;
    case HS.SUSPENDED:
      color = COLORS.health.suspended;
      icon = 'fa-pause-circle';
      break;
    case HS.DEGRADED:
      color = COLORS.health.degraded;
      icon = 'fa-heart-broken';
      break;
    case HS.PROGRESSING:
      color = COLORS.health.progressing;
      icon = `fa fa-circle-notch fa-spin`;
      break;
    case HS.MISSING:
      color = COLORS.health.missing;
      icon = 'fa-ghost';
      break;
  }
  return icon.includes('fa-spin') ? (
    <SpinningIcon color={color} title={status} />
  ) : (
    <i title={status} className={'fa ' + icon + ' utils-health-status-icon'} style={{ color }} />
  );
};

export default HealthStatus;
