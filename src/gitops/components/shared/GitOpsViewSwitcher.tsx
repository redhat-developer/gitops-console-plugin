import * as React from 'react';

import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { Button, Icon, Tooltip } from '@patternfly/react-core';
import { ListIcon, TopologyIcon } from '@patternfly/react-icons';

import { GitOpsViewType } from './GitOpsViewType';

type GitOpsViewSwitcherProps = {
  viewType: GitOpsViewType;
  onViewChange: (view: GitOpsViewType) => void;
  isDisabled?: boolean;
  testId?: string;
};

const GitOpsViewSwitcher: React.FC<GitOpsViewSwitcherProps> = ({
  viewType,
  onViewChange,
  isDisabled = false,
  testId = 'gitops-view-switcher',
}) => {
  const showGraphView = viewType === GitOpsViewType.graph;
  const viewChangeTooltipContent = showGraphView
    ? t('plugin__gitops-plugin~List view')
    : t('plugin__gitops-plugin~Graph view');

  return (
    <Tooltip position="left" content={viewChangeTooltipContent}>
      <Button
        type="button"
        icon={<Icon size="md">{showGraphView ? <ListIcon /> : <TopologyIcon />}</Icon>}
        variant="link"
        aria-label={viewChangeTooltipContent}
        className="pf-m-plain odc-topology__view-switcher"
        data-test-id={testId}
        isDisabled={isDisabled}
        onClick={(event) => {
          event.preventDefault();
          onViewChange(showGraphView ? GitOpsViewType.list : GitOpsViewType.graph);
        }}
      />
    </Tooltip>
  );
};

export default GitOpsViewSwitcher;
