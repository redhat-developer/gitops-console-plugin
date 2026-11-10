import * as React from 'react';

import { ApplicationSetModel } from '@gitops/models/ApplicationSetModel';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';

import { OverviewCardProps } from '../../chartHelpers';
import InfrastructureResourceCard from '../shared/InfrastructureResourceCard';

const ApplicationSetsCard: React.FC<OverviewCardProps> = ({ namespace }) => (
  <InfrastructureResourceCard
    namespace={namespace}
    model={ApplicationSetModel}
    title={t('ApplicationSets')}
    entryKeyPrefix="id-applicationset"
    errorTitle={t('Error retrieving ApplicationSets')}
    viewListLinkText={t('View ApplicationSets List Page')}
    createLinkText={t('Create ApplicationSet')}
  />
);

export default ApplicationSetsCard;
