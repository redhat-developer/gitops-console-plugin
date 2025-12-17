import * as React from 'react';
import classNames from 'classnames';
import { PodKind } from 'src/components/topology/console/types';

import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { resourceAsArray } from '@gitops/utils/utils';
import { K8sResourceCommon, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { ErrorState } from '@patternfly/react-component-groups';
import { Flex, FlexItem, PageSection, PageSectionVariants, Title } from '@patternfly/react-core';

import { ReplicaSetKind, RolloutKind } from './model/RolloutModel';
import { Revisions } from './revisions/Revisions';

type RolloutRevisionsTabProps = {
  obj?: RolloutKind;
};

const RolloutRevisionsTab: React.FC<RolloutRevisionsTabProps> = ({ obj: rollout }) => {
  const { t } = useGitOpsTranslation();

  const [replicaSets, loaded, loadError] = useK8sWatchResource<K8sResourceCommon>({
    groupVersionKind: { group: 'apps', version: 'v1', kind: 'ReplicaSet' },
    isList: true,
    namespaced: true,
    namespace: rollout.metadata?.namespace,
    selector: rollout.spec.selector,
  });
  const [pods, podsloaded, podsloadError] = useK8sWatchResource({
    isList: true,
    groupVersionKind: {
      kind: 'Pod',
      version: 'v1',
    },
    namespaced: true,
    namespace: rollout.metadata?.namespace,
  });

  const error = (
    <FlexItem>
      <ErrorState
        titleText={t('Unable to load data')}
        bodyText={t(
          'There was an error retrieving the rollout revisions. Check your connection and reload the page.',
        )}
      />
    </FlexItem>
  );
  return (
    <PageSection
      variant={PageSectionVariants.default}
      className={classNames('co-m-pane__body', { 'co-m-pane__body--section-heading': true })}
    >
      <Title headingLevel="h2" className="co-section-heading">
        {t('Rollout Revisions')}
      </Title>

      {loadError || !loaded || !podsloaded || podsloadError ? (
        <div>
          <Flex
            justifyContent={{ default: 'justifyContentSpaceEvenly' }}
            direction={{ default: 'column', lg: 'row' }}
          >
            <FlexItem fullWidth={{ default: 'fullWidth' }}>{error}</FlexItem>
          </Flex>
        </div>
      ) : (
        <Revisions
          rollout={rollout}
          replicaSets={resourceAsArray(replicaSets) as ReplicaSetKind[]}
          pods={resourceAsArray(pods) as PodKind[]}
        />
      )}
    </PageSection>
  );
};

export default RolloutRevisionsTab;
