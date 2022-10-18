import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { GitOpsHistoryData } from 'src/components/utils/gitops-types';

import { TableColumn } from '@openshift-console/dynamic-plugin-sdk';
import { sortable } from '@patternfly/react-table';

import { GitOpsDeploymentHistoryTableColumnClasses } from './GitOpsDeploymentHistoryTableColumnClasses';

export const GitOpsDeploymentHistoryColumns = () => {
  const { t } = useTranslation();

  const columns: TableColumn<GitOpsHistoryData>[] = React.useMemo(
    () => [
      {
        title: t('gitops-plugin~Deployment Time'),
        id: 'time',
        sort: 'deployed_at',
        transforms: [sortable],
        props: { className: GitOpsDeploymentHistoryTableColumnClasses[0] },
      },
      {
        title: t('gitops-plugin~Message'),
        id: 'message',
        sort: 'message',
        transforms: [sortable],
        props: { className: GitOpsDeploymentHistoryTableColumnClasses[1] },
      },
      {
        title: t('gitops-plugin~Environment'),
        id: 'environment',
        sort: 'environment',
        transforms: [sortable],
        props: { className: GitOpsDeploymentHistoryTableColumnClasses[2] },
      },
      {
        title: t('gitops-plugin~Author'),
        id: 'author',
        sort: 'author',
        transforms: [sortable],
        props: { className: GitOpsDeploymentHistoryTableColumnClasses[3] },
      },
      {
        title: t('gitops-plugin~Revision'),
        id: 'revision',
        sort: 'revision',
        transforms: [sortable],
        props: { className: GitOpsDeploymentHistoryTableColumnClasses[4] },
      },
    ],
    [t],
  );

  return columns;
};
