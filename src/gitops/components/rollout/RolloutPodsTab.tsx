import * as React from 'react';

import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { RolloutKind } from '@gitops/topology/types';
import { PageSection, Title } from '@patternfly/react-core';

import { PodList } from './components/PodList/PodList';

type RolloutPodsTabProps = {
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
