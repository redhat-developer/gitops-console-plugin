import * as classNames from 'classnames';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { TableColumn } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';

import { GitOpsAppGroupData } from '../utils/gitops-types';

const tableColumnClasses = [
  classNames.default('pf-m-width-20'), // Application name
  classNames.default('pf-m-width-30'), // Git repository
  classNames.default('pf-m-hidden', 'pf-m-visible-on-md', 'pf-m-width-20'), // Environments
  classNames.default('pf-m-hidden', 'pf-m-visible-on-lg', 'pf-m-width-30'), // Last deployment
];

export const GitOpsColumns = (hasSyncStatus: boolean) => {
  const { t } = useTranslation();

  const columns: TableColumn<GitOpsAppGroupData>[] = React.useMemo(
    () => [
      {
        title: t('gitops-plugin~Application name'),
        id: 'name',
        sort: 'name',
        transforms: [sortable],
        props: { className: tableColumnClasses[0] },
      },
      {
        title: t('gitops-plugin~Git repository'),
        id: 'gitRepository',
        sort: 'gitRepository',
        transforms: [sortable],
        props: { className: tableColumnClasses[1] },
      },
      {
        title: hasSyncStatus
          ? t('gitops-plugin~Environment status')
          : t('gitops-plugin~Environment'),
        id: 'environments',
        sort: 'environments',
        transforms: [sortable],
        props: { className: tableColumnClasses[2] },
      },
      {
        title: t('gitops-plugin~Last deployment'),
        id: 'lastDeployment',
        sort: 'lastDeployment',
        transforms: [sortable],
        props: { className: tableColumnClasses[3] },
      },
    ],
    [t],
  );

  return columns;
};
