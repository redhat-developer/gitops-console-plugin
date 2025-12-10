import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { PageSection, Title } from '@patternfly/react-core';

import { PodList } from './components/PodList/PodList';
import { RolloutKind } from './model/RolloutModel';

type RolloutPodsTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: RolloutKind;
};

const RolloutPodsTab: React.FC<RolloutPodsTabProps> = ({ obj: rollout }) => {
  const { t } = useGitOpsTranslation();
  return !rollout ? (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Rollout details')}
        </Title>
      </PageSection>
    </div>
  ) : (
    <PodList
      rollout={rollout}
      namespace={rollout.metadata.namespace}
      selector={rollout.spec.selector}
    />
  );
};

export default RolloutPodsTab;
