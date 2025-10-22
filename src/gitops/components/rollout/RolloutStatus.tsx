import * as React from 'react';

import {
  RolloutStatusDegradedIcon,
  RolloutStatusHealthyIcon,
  RolloutStatusPausedIcon,
  RolloutStatusProgressingIcon,
  RolloutStatusUnknownIcon,
} from '@gitops/utils/components/Icons/Icons';
import { Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

import { RolloutStatus } from './utils/rollout-utils';

interface RolloutStatusProps {
  status: RolloutStatus;
  message?: string;
}

export const RolloutStatusFragment: React.FC<RolloutStatusProps> = ({ status, message }) => {
  let icon: React.ReactNode;
  switch (status) {
    case RolloutStatus.Progressing: {
      icon = <RolloutStatusProgressingIcon />;
      break;
    }
    case RolloutStatus.Degraded: {
      icon = <RolloutStatusDegradedIcon />;
      break;
    }
    case RolloutStatus.Paused: {
      icon = <RolloutStatusPausedIcon />;
      break;
    }
    case RolloutStatus.Healthy: {
      icon = <RolloutStatusHealthyIcon />;
      break;
    }
    default:
      icon = <RolloutStatusUnknownIcon />;
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ paddingRight: '4px' }}>Phase:</span>
      {icon} <span style={{ paddingLeft: '4px' }}>{status}</span>{' '}
      {status == RolloutStatus.Degraded && message && (
        <Tooltip content={message}>
          <InfoCircleIcon style={{ paddingLeft: '4px' }} />
        </Tooltip>
      )}
    </span>
  );
};
