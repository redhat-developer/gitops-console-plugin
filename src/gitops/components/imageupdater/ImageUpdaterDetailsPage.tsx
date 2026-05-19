import * as React from 'react';
import { useParams } from 'react-router-dom-v5-compat';

import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';

import ImageUpdaterNavPage from './ImageUpdaterNavPage';

const ImageUpdaterDetailsPage: React.FC = () => {
  const { t } = useGitOpsTranslation();
  const { name, ns } = useParams<{ name?: string; ns?: string }>();

  if (!name || !ns) {
    return <div>{t('Error: Missing required route parameters')}</div>;
  }

  return <ImageUpdaterNavPage name={name} namespace={ns} kind="ImageUpdater" />;
};

export default ImageUpdaterDetailsPage;
