import * as React from 'react';

import { ColoredIconProps } from '@openshift-console/dynamic-plugin-sdk';
import {
  ArrowCircleUpIcon,
  BanIcon,
  CheckIcon,
  CircleNotchIcon,
  ExclamationCircleIcon,
  GhostIcon,
  HeartBrokenIcon,
  HeartIcon,
  MonitoringIcon,
  OutlinedPauseCircleIcon,
  PausedIcon,
  PendingIcon,
  ResourcesAlmostFullIcon,
  ResourcesFullIcon,
  SyncAltIcon,
  UnknownIcon,
} from '@patternfly/react-icons';
// import { global_danger_color_100 as dangerColor } from '@patternfly/react-tokens/dist/js/global_danger_color_100';
// import { global_primary_color_200 as blueDefaultColor } from '@patternfly/react-tokens/dist/js/global_primary_color_200';
// import { global_disabled_color_100 as disabledColor } from '@patternfly/react-tokens/dist/c_about_modal_box_Heightjs/global_disabled_color_100';
// import { global_palette_blue_300 as blueInfoColor } from '@patternfly/react-tokens/dist/js/global_palette_blue_300';
// import { global_warning_color_100 as warningColor } from '@patternfly/react-tokens/dist/js/global_warning_color_100';
// import { global_success_color_100 as successColor } from '@patternfly/react-tokens/dist/js/global_success_color_100';

// Modern PatternFly v5 CSS variables approach
export const dangerColor = 'var(--pf-v5-global--danger-color--100)';
export const blueDefaultColor = 'var(--pf-v5-global--primary-color--200)';
export const disabledColor = 'var(--pf-v5-global--disabled-color--100)';
export const blueInfoColor = 'var(--pf-v5-global--palette--blue-300)';
export const warningColor = 'var(--pf-v5-global--warning-color--100)';
export const successColor = 'var(--pf-v5-global--success-color--100)';

export {
  BlueInfoCircleIcon,
  ColoredIconProps,
  GreenCheckCircleIcon,
  RedExclamationCircleIcon,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';

export const BlueSyncIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <SyncAltIcon color={blueInfoColor} className={className} title={title} />
);

export const RedResourcesFullIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ResourcesFullIcon color={dangerColor} className={className} title={title} />
);

export const YellowResourcesAlmostFullIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ResourcesAlmostFullIcon color={warningColor} className={className} title={title} />
);

export const BlueArrowCircleUpIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ArrowCircleUpIcon color={blueDefaultColor} className={className} title={title} />
);

export const OutOfSyncIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ArrowCircleUpIcon color={warningColor} className={className} title={title} />
);

export const SyncUnknownIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <UnknownIcon color={disabledColor} className={className} title={title} />
);

export const HealthUnknownIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <UnknownIcon color={disabledColor} className={className} title={title} />
);

export const HealthProgressingIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <CircleNotchIcon color={blueDefaultColor} className={className + ' fa-spin'} title={title} />
);

export const HealthSuspendedIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <OutlinedPauseCircleIcon color={disabledColor} className={className} title={title} />
);

export const HealthHealthyIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <HeartIcon color={successColor} className={className} title={title} />
);

export const HealthDegradedIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <HeartBrokenIcon color={dangerColor} className={className} title={title} />
);

export const HealthMissingIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <GhostIcon color={warningColor} className={className} title={title} />
);

export const PhaseErrorIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <ExclamationCircleIcon color={dangerColor} className={className} title={title} />
);

export const SyncFailedIcon = PhaseErrorIcon;

export const PhaseFailedIcon = PhaseErrorIcon;
export const PhaseRunningIcon = HealthProgressingIcon;
export const PhaseSucceededIcon = HealthHealthyIcon;
export const PhaseTerminatingIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <BanIcon color={disabledColor} className={className} title={title} />
);

export const RolloutStatusProgressingIcon = HealthProgressingIcon;
export const RolloutStatusDegradedIcon = HealthDegradedIcon;
export const RolloutStatusHealthyIcon = HealthHealthyIcon;
export const RolloutStatusPausedIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <PausedIcon color={blueDefaultColor} className={className} title={title} />
);
// Should never see this one but if rollouts introduces a new status before this is updated good to show something
export const RolloutStatusUnknownIcon = SyncUnknownIcon;

export const AnalysisRunStatusSuccessfulIcon: React.FC<ColoredIconProps> = ({
  className,
  title,
}) => <CheckIcon color={successColor} className={className} title={title} />;
export const AnalysisRunStatusFailureIcon = HealthDegradedIcon;
export const AnalysisRunStatusErrorIcon = HealthDegradedIcon;
export const AnalysisRunInconclusiveErrorIcon = SyncUnknownIcon;
export const AnalysisRunStatusUnknownIcon = SyncUnknownIcon;
export const AnalysisRunStatusRunningIcon = HealthProgressingIcon;
export const AnalysisRunStatusPendingIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <PendingIcon color={blueDefaultColor} className={className} title={title} />
);

export const MeasurementSuccessfulIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <MonitoringIcon color={successColor} className={className} title={title} />
);

export const MeasurementFailedIcon: React.FC<ColoredIconProps> = ({ className, title }) => (
  <MonitoringIcon color={dangerColor} className={className} title={title} />
);

export const SpinningIcon = ({
  color,
  className,
  title,
}: {
  color?: string;
  className?: string;
  title?: string;
}) => {
  return (
    <CircleNotchIcon
      color={color || blueDefaultColor}
      className={className + ' fa-spin'}
      title={title || ''}
    />
  );
};
