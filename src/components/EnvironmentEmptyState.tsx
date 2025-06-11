import * as React from 'react';

import { EmptyState, EmptyStateBody, EmptyStateVariant } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

interface EnvironmentEmptyStateProps {
  emptyStateMsg: string;
}

// TODO find alternative for <EmptyStateIcon variant="container" component={CubesIcon} />
const EnvironmentEmptyState: React.FC<EnvironmentEmptyStateProps> = ({ emptyStateMsg }) => (
  <EmptyState variant={EmptyStateVariant.full} icon={CubesIcon}>
    <EmptyStateBody>{emptyStateMsg}</EmptyStateBody>
  </EmptyState>
);

export default EnvironmentEmptyState;
