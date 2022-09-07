import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Split, SplitItem, Tooltip } from '@patternfly/react-core';
import { ExclamationTriangleIcon, HeartBrokenIcon } from '@patternfly/react-icons';
import {
  global_danger_color_100 as RedColor,
  global_warning_color_100 as YellowColor,
} from '@patternfly/react-tokens';

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
  const { t } = useTranslation();
  return (
    <Split hasGutter>
      {degradedResources?.length > 0 && (
        <Tooltip
          content={t('gitops-plugin~{{x}} of {{total}} Unhealthy', {
            x: degradedResources.length.toString(),
            total: resources?.length.toString() ?? '0',
          })}
        >
          <SplitItem>
            <>
              {degradedResources.length}{' '}
              <HeartBrokenIcon color={RedColor.value} className="co-icon-space-r" />
            </>
          </SplitItem>
        </Tooltip>
      )}
      {nonSyncedResources.length > 0 && (
        <Tooltip
          content={t('gitops-plugin~{{x}} of {{total}} OutOfSync', {
            x: nonSyncedResources.length.toString(),
            total: resources?.length.toString() ?? '0',
          })}
        >
          <SplitItem>
            <>
              {nonSyncedResources.length}{' '}
              <ExclamationTriangleIcon color={YellowColor.value} className="co-icon-space-r" />
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
