import * as React from 'react';

import { ApplicationModel } from '@gitops/models/ApplicationModel';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';

import { OverviewCardProps } from '../../chartHelpers';
import InfrastructureResourceCard from '../shared/InfrastructureResourceCard';

const ApplicationsCard: React.FC<OverviewCardProps> = ({ namespace }) => (
  <InfrastructureResourceCard
    namespace={namespace}
    model={ApplicationModel}
    title={t('Applications')}
    entryKeyPrefix="id-application"
    errorTitle={t('Error retrieving Applications')}
    viewListLinkText={t('View Applications List Page')}
    createLinkText={t('Create Application')}
  />
);

export default ApplicationsCard;
