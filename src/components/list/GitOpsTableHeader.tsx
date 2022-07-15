import { sortable, Th, Thead } from '@patternfly/react-table';
import * as classNames from 'classnames';
import * as React from 'react';
// import i18n from '@console/internal/i18n';
// import { TableColumn } from '@openshift-console/dynamic-plugin-sdk';

const tableColumnClasses = [
  classNames.default('pf-m-width-20'), // Application name
  classNames.default('pf-m-width-30'), // Git repository
  classNames.default('pf-m-hidden', 'pf-m-visible-on-md', 'pf-m-width-20'), // Environments
  classNames.default('pf-m-hidden', 'pf-m-visible-on-lg', 'pf-m-width-30'), // Last deployment
];

export const GitOpsTableColumn = (hasSyncStatus: boolean) => {
  // let columns = new Array<TableColumn<1>>();
  return [
    {
      // title: i18n.t('gitops-plugin~Application name'),
      title: 'Application name',
      id: 'name',
      sortField: 'name',
      transforms: [sortable],
      props: { className: tableColumnClasses[0] },
    },
    {
      // title: i18n.t('gitops-plugin~Git repository'),
      title: 'Git repository',
      id: 'gitRepository',
      sortField: 'gitRepository',
      transforms: [sortable],
      props: { className: tableColumnClasses[1] },
    },
    {
      title: hasSyncStatus
        ? 'Environment status' // i18n.t('gitops-plugin~Environment status')
        : 'Environment', // i18n.t('gitops-plugin~Environment'),
      id: 'environments',
      sortField: 'environments',
      transforms: [sortable],
      props: { className: tableColumnClasses[2] },
    },
    {
      // title: i18n.t('gitops-plugin~Last deployment'),
      title: 'Last deployment',
      id: 'lastDeployment',
      sortField: 'lastDeployment',
      transforms: [sortable],
      props: { className: tableColumnClasses[3] },
    },  ];
}

export interface Column {
  group?: string;
  name: string;
  isSelected: boolean;
  value: string;
  width: number;
}

export const GitOpsTableHeader: React.FC<{
  columns?: Column[],
  hasSyncStatus: boolean;
 }> = ({hasSyncStatus, columns}) => {
  return (
    <Thead>
      <Th hasRightBorder={true} width={10} rowSpan={1}>
        Application name
      </Th>
      <Th hasRightBorder={true} width={10} rowSpan={1}>
        Git repository
      </Th>
      <Th hasRightBorder={true} width={10} rowSpan={1}>
        Environment status
      </Th>
      <Th hasRightBorder={true} width={10} rowSpan={1}>
        Last deployment
      </Th>
    </Thead>
    
  )
  // return [
  //   {
  //     // title: i18n.t('gitops-plugin~Application name'),
  //     title: 'Application name',
  //     id: 'name',
  //     sortField: 'name',
  //     transforms: [sortable],
  //     props: { className: tableColumnClasses[0] },
  //   },
  //   {
  //     // title: i18n.t('gitops-plugin~Git repository'),
  //     title: 'Git repository',
  //     id: 'gitRepository',
  //     sortField: 'gitRepository',
  //     transforms: [sortable],
  //     props: { className: tableColumnClasses[1] },
  //   },
  //   {
  //     title: hasSyncStatus
  //       ? 'Environment status' // i18n.t('gitops-plugin~Environment status')
  //       : 'Environment', // i18n.t('gitops-plugin~Environment'),
  //     id: 'environments',
  //     sortField: 'environments',
  //     transforms: [sortable],
  //     props: { className: tableColumnClasses[2] },
  //   },
  //   {
  //     // title: i18n.t('gitops-plugin~Last deployment'),
  //     title: 'Last deployment',
  //     id: 'lastDeployment',
  //     sortField: 'lastDeployment',
  //     transforms: [sortable],
  //     props: { className: tableColumnClasses[3] },
  //   },
  // ];
};

// export default GitOpsTableHeader;
