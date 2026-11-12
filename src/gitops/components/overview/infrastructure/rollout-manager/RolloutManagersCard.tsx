import * as React from 'react';

import { RolloutManagerModel } from '@gitops/components/rollout/model/RolloutModel';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';

import { OverviewCardProps } from '../../chartHelpers';
import InfrastructureResourceCard from '../shared/InfrastructureResourceCard';

const RolloutManagersCard: React.FC<OverviewCardProps> = ({ namespace }) => (
  <InfrastructureResourceCard
    namespace={namespace}
    model={RolloutManagerModel}
    title={t('Rollout Managers')}
    entryKeyPrefix="id-rollout-manager"
    errorTitle={t('Error retrieving Rollout Managers')}
    viewListLinkText={t('View Rollout Managers List Page')}
    createLinkText={t('Create Rollout Manager')}
  />
);

export default RolloutManagersCard;
