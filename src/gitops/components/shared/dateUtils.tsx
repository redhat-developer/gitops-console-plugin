import * as React from 'react';

import { Tooltip } from '@patternfly/react-core';

export const getAge = (creationTimestamp?: string): string => {
  if (!creationTimestamp) return '-';
  const diffInSeconds = Math.floor((Date.now() - new Date(creationTimestamp).getTime()) / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d`;
};

const formatCreationDate = (creationTimestamp: string): string =>
  new Date(creationTimestamp).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  });

export const AgeCell: React.FC<{ creationTimestamp?: string }> = ({ creationTimestamp }) => {
  const age = getAge(creationTimestamp);
  if (!creationTimestamp) return <>{age}</>;

  return (
    <Tooltip content={formatCreationDate(creationTimestamp)}>
      <span>{age}</span>
    </Tooltip>
  );
};
