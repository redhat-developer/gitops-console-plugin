import * as React from 'react';

import { RolloutModel } from '@gitops/components/rollout/model/RolloutModel';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';

import { OverviewCardProps } from '../../chartHelpers';
import InfrastructureResourceCard from '../shared/InfrastructureResourceCard';

const RolloutsCard: React.FC<OverviewCardProps> = ({ namespace }) => (
  <InfrastructureResourceCard
    namespace={namespace}
    model={RolloutModel}
    title={t('Rollouts')}
    entryKeyPrefix="id-rollout"
    errorTitle={t('Error retrieving Rollouts')}
    viewListLinkText={t('View Rollouts List Page')}
    createLinkText={t('Create Rollout')}
  />
);

export default RolloutsCard;
