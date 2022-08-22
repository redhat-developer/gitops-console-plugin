import './GitOpsEmptyState.scss';

import * as React from 'react';

import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';

interface GitOpsEmptyStateProps {
  emptyStateMsg: string;
}

const GitOpsEmptyState: React.FC<GitOpsEmptyStateProps> = ({ emptyStateMsg }) => (
  <EmptyState variant={EmptyStateVariant.full}>
    <EmptyStateIcon variant="container" component={CubesIcon} />
    <EmptyStateBody>{emptyStateMsg}</EmptyStateBody>
  </EmptyState>
);

export default GitOpsEmptyState;
