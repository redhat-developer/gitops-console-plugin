import * as React from 'react';

import { ColoredIconProps } from '@openshift-console/dynamic-plugin-sdk';
import {
  ArrowCircleUpIcon,
  ResourcesAlmostFullIcon,
  ResourcesFullIcon,
  SyncAltIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
import dangerColor from '@patternfly/react-tokens/dist/esm/global_danger_color_100';
import disabledColor from '@patternfly/react-tokens/dist/esm/global_disabled_color_100';
import blueInfoColor from '@patternfly/react-tokens/dist/esm/global_palette_blue_300';
import blueDefaultColor from '@patternfly/react-tokens/dist/esm/global_primary_color_100';
import warningColor from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

export {
  BlueInfoCircleIcon,
  ColoredIconProps,
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';

export const GrayUnknownIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <UnknownIcon color={disabledColor.value} className={className} title={title} />
);

export const BlueSyncIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <SyncAltIcon color={blueInfoColor.value} className={className} title={title} />
);

export const RedResourcesFullIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ResourcesFullIcon color={dangerColor.value} className={className} title={title} />
);

export const YellowResourcesAlmostFullIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ResourcesAlmostFullIcon color={warningColor.value} className={className} title={title} />
);

export const BlueArrowCircleUpIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ArrowCircleUpIcon color={blueDefaultColor.value} className={className} title={title} />
);
