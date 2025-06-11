import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Split, SplitItem, Tooltip } from '@patternfly/react-core';
import { ExclamationTriangleIcon, HeartBrokenIcon } from '@patternfly/react-icons';
import RedColor from '@patternfly/react-tokens/dist/esm/t_global_color_status_danger_100';
import YellowColor from '@patternfly/react-tokens/dist/esm/t_global_color_status_warning_100';

import { GitOpsEnvironmentService, GitOpsHealthResources } from '../utils/gitops-types';

import './ResourcesSection.scss';

interface ResourceRowProps {
  resources: GitOpsHealthResources[] | GitOpsEnvironmentService[];
  degradedResources: string[] | null;
  nonSyncedResources: string[];
}

const ResourceRow: React.FC<ResourceRowProps> = ({
  resources,
  degradedResources,
  nonSyncedResources,
}) => {
  const { t } = useTranslation('plugin__gitops-plugin');
  return (
    <Split hasGutter>
      {degradedResources?.length > 0 && (
        <Tooltip
          content={t('plugin__gitops-plugin~{{x}} of {{total}} Unhealthy', {
            x: degradedResources.length.toString(),
            total: resources?.length.toString() ?? '0',
          })}
        >
          <SplitItem>
            <>
              {degradedResources.length}
              <HeartBrokenIcon color={RedColor.value} className="co-icon-space-l" />
            </>
          </SplitItem>
        </Tooltip>
      )}
      {nonSyncedResources.length > 0 && (
        <Tooltip
          content={t('plugin__gitops-plugin~{{x}} of {{total}} OutOfSync', {
            x: nonSyncedResources.length.toString(),
            total: resources?.length.toString() ?? '0',
          })}
        >
          <SplitItem>
            <>
              {nonSyncedResources.length}
              <ExclamationTriangleIcon color={YellowColor.value} className="co-icon-space-l" />
            </>
          </SplitItem>
        </Tooltip>
      )}
      {(degradedResources === null || degradedResources.length === 0) &&
        nonSyncedResources.length === 0 && <>&nbsp;</>}
    </Split>
  );
};

export default ResourceRow;
