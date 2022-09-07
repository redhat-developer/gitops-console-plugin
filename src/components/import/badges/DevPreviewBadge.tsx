import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Label } from '@patternfly/react-core';

import './Badge.scss';

const DevPreviewBadge: React.FC = () => {
  const { t } = useTranslation();
  return <Label className="ocs-preview-badge">{t('console-shared~Dev preview')}</Label>;
};

export default DevPreviewBadge;
