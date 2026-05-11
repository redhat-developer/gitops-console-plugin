import * as React from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { Label, Tooltip } from '@patternfly/react-core';

import './Badge.scss';

const getBadgeLabel = (t: TFunction) => {
  return (
    <Label className="gitops-plugin__preview-badge">
      {t('plugin__gitops-plugin~Tech preview')}
    </Label>
  );
};

const TechPreviewBadge: React.FC<{ tooltipContent?: string }> = ({ tooltipContent }) => {
  const { t } = useTranslation('plugin__gitops-plugin');
  return tooltipContent ? (
    <Tooltip content={tooltipContent}>{getBadgeLabel(t)}</Tooltip>
  ) : (
    getBadgeLabel(t)
  );
};

export default TechPreviewBadge;
