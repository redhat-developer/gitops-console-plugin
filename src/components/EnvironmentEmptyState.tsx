import * as React from 'react';

import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

interface EnvironmentEmptyStateProps {
  emptyStateMsg: string;
}

const EnvironmentEmptyState: React.FC<EnvironmentEmptyStateProps> = ({ emptyStateMsg }) => (
  <EmptyState variant={EmptyStateVariant.full}>
    <EmptyStateIcon variant="container" component={CubesIcon} />
    <EmptyStateBody>{emptyStateMsg}</EmptyStateBody>
  </EmptyState>
);

export default EnvironmentEmptyState;
