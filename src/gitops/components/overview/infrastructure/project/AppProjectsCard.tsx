import * as React from 'react';

import { AppProjectModel } from '@gitops/models/AppProjectModel';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';

import { OverviewCardProps } from '../../chartHelpers';
import InfrastructureResourceCard from '../shared/InfrastructureResourceCard';

const AppProjectsCard: React.FC<OverviewCardProps> = ({ namespace }) => (
  <InfrastructureResourceCard
    namespace={namespace}
    model={AppProjectModel}
    title={t('App Projects')}
    entryKeyPrefix="id-app-project"
    errorTitle={t('Error retrieving App Projects')}
    viewListLinkText={t('View AppProjects List Page')}
    createLinkText={t('Create AppProject')}
  />
);

export default AppProjectsCard;
