import * as React from 'react';

const icon = (name: string): React.FC<any> => {
  const Icon: React.FC<any> = ({ className, title, color }) => (
    <svg data-icon={name} className={className} style={color ? { color } : undefined} aria-label={title} />
  );
  Icon.displayName = name;
  return Icon;
};

export const ArrowCircleUpIcon = icon('ArrowCircleUpIcon');
export const BanIcon = icon('BanIcon');
export const CheckIcon = icon('CheckIcon');
export const CircleNotchIcon = icon('CircleNotchIcon');
export const ExclamationCircleIcon = icon('ExclamationCircleIcon');
export const GhostIcon = icon('GhostIcon');
export const HeartBrokenIcon = icon('HeartBrokenIcon');
export const HeartIcon = icon('HeartIcon');
export const MonitoringIcon = icon('MonitoringIcon');
export const OutlinedPauseCircleIcon = icon('OutlinedPauseCircleIcon');
export const PausedIcon = icon('PausedIcon');
export const PendingIcon = icon('PendingIcon');
export const ResourcesAlmostFullIcon = icon('ResourcesAlmostFullIcon');
export const ResourcesFullIcon = icon('ResourcesFullIcon');
export const SyncAltIcon = icon('SyncAltIcon');
export const UnknownIcon = icon('UnknownIcon');
export const EllipsisVIcon = icon('EllipsisVIcon');
export const OutlinedQuestionCircleIcon = icon('OutlinedQuestionCircleIcon');
export const TopologyIcon = icon('TopologyIcon');
