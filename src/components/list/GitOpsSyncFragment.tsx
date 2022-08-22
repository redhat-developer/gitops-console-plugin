import * as React from 'react';

import {
  ColoredIconProps,
  GreenCheckCircleIcon,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import { Flex, FlexItem, Tooltip } from '@patternfly/react-core';
import { UnknownIcon } from '@patternfly/react-icons';
import { global_disabled_color_100 as disabledColor } from '@patternfly/react-tokens/dist/js/global_disabled_color_100';

interface SyncProps {
  tooltip: any[];
  count: number;
  icon: string;
}

export const GrayUnknownIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <UnknownIcon color={disabledColor.value} className={className} title={title} />
);

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
