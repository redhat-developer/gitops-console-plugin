import * as React from 'react';

import { ImageUpdaterModel } from '@gitops/models/ImageUpdaterModel';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';

import { OverviewCardProps } from '../../chartHelpers';
import InfrastructureResourceCard from '../shared/InfrastructureResourceCard';

const ImageUpdatersCard: React.FC<OverviewCardProps> = ({ namespace }) => (
  <InfrastructureResourceCard
    namespace={namespace}
    model={ImageUpdaterModel}
    title={t('Image Updaters')}
    entryKeyPrefix="id-image-updater"
    errorTitle={t('Error retrieving Image Updaters')}
    viewListLinkText={t('View Image Updaters List Page')}
    createLinkText={t('Create Image Updater')}
  />
);

export default ImageUpdatersCard;
