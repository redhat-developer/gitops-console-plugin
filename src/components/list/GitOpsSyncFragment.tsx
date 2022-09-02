import * as React from 'react';

import {
  GreenCheckCircleIcon,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import { Flex, FlexItem, Tooltip } from '@patternfly/react-core';
import { GrayUnknownIcon } from '../status/icons';

interface SyncProps {
  tooltip: any[];
  count: number;
  icon: string;
}

const GitOpsSyncFragment: React.FC<SyncProps> = ({ tooltip, count, icon }) => {
  let targetIcon: React.ReactNode;
  if (icon === 'check') {
    targetIcon = <GreenCheckCircleIcon />;
  } else if (icon === 'exclamation') {
    targetIcon = <YellowExclamationTriangleIcon />;
  } else {
    targetIcon = <GrayUnknownIcon />;
  }
  return (
    <Flex flex={{ default: 'flex_1' }}>
      <FlexItem>
        {count > 0 ? (
          <Tooltip isContentLeftAligned content={<div>{tooltip}</div>}>
            <div>
              {targetIcon} {count}
            </div>
          </Tooltip>
        ) : (
          <div>
            {targetIcon} {count}
          </div>
        )}
      </FlexItem>
    </Flex>
  );
};

export default GitOpsSyncFragment;
