import * as React from 'react';

import { Timestamp } from '@openshift-console/dynamic-plugin-sdk';
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

export const AgeCell: React.FC<{ creationTimestamp?: string }> = ({ creationTimestamp }) => {
  const age = getAge(creationTimestamp);
  if (!creationTimestamp) return <>{age}</>;

  return (
    <Tooltip content={<Timestamp timestamp={creationTimestamp} />}>
      <span>{age}</span>
    </Tooltip>
  );
};
