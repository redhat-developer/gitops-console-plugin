import * as React from 'react';

import { DetailsDescriptionGroup } from '@gitops/components/shared/BaseDetailsSummary/BaseDetailsSummary';
import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { Flex, FlexItem } from '@patternfly/react-core';

import { RolloutKind } from '../model/RolloutModel';

type BlueGreenServicesProps = {
  rollout: RolloutKind;
};

const BlueGreenServices: React.FC<BlueGreenServicesProps> = ({ rollout }) => {
  const { t } = useGitOpsTranslation();

  return (
    <>
      <DetailsDescriptionGroup
        title={t('Active Service')}
        help={t('The active blue-green service')}
      >
        <Flex>
          <FlexItem>
            {rollout.spec.strategy.blueGreen.activeService ? (
              <ResourceLink
                groupVersionKind={{ version: 'v1', kind: 'Service' }}
                name={rollout.spec.strategy.blueGreen.activeService}
                namespace={rollout.metadata.namespace}
              />
            ) : (
              '-'
            )}
          </FlexItem>
        </Flex>
      </DetailsDescriptionGroup>

      <DetailsDescriptionGroup
        title={t('Preview Service')}
        help={t('The preview blue-green service')}
      >
        <Flex>
          <FlexItem>
            {rollout.spec.strategy.blueGreen.previewService ? (
              <ResourceLink
                groupVersionKind={{ version: 'v1', kind: 'Service' }}
                name={rollout.spec.strategy.blueGreen.previewService}
                namespace={rollout.metadata.namespace}
              />
            ) : (
              '-'
            )}
          </FlexItem>
        </Flex>
      </DetailsDescriptionGroup>
    </>
  );
};

export default BlueGreenServices;
