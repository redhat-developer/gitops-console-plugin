import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Label } from '@patternfly/react-core';

import './Badge.scss';

const DevPreviewBadge: React.FC = () => {
  const { t } = useTranslation('plugin__gitops-plugin');
  return (
    <Label className="gitops-plugin__preview-badge">{t('plugin__gitops-plugin~Dev preview')}</Label>
  );
};

export default DevPreviewBadge;
