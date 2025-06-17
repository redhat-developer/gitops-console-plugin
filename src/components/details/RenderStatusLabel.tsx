import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  GreenCheckCircleIcon,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import { Label } from '@patternfly/react-core';

import { GrayUnknownIcon } from '../status/icons';

interface RenderStatusLabelProps {
  status: string;
}

const RenderStatusLabel: React.FC<RenderStatusLabelProps> = ({ status }) => {
  const { t } = useTranslation('plugin__gitops-plugin');
  switch (status) {
    case 'Synced':
      return <Label icon={<GreenCheckCircleIcon />}>{t('plugin__gitops-plugin~Synced')}</Label>;
    case 'OutOfSync':
      return (
        <Label icon={<YellowExclamationTriangleIcon />}>
          {t('plugin__gitops-plugin~OutOfSync')}
        </Label>
      );
    case 'Unknown':
      return <Label icon={<GrayUnknownIcon />}>{t('plugin__gitops-plugin~Unknown')}</Label>;
    default:
      return null;
  }
};

export default RenderStatusLabel;
