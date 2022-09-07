import classNames from 'classnames';
import * as React from 'react';

import { RowProps, TableData, Timestamp } from '@openshift-console/dynamic-plugin-sdk';

import { GitOpsHistoryData } from '../utils/gitops-types';
import { CommitRevision } from './CommitRevision';
import { DeploymentHistoryTableColumnClasses } from './DeploymentHistoryTableColumnClasses';

export const DeploymentHistoryTableRow: React.FC<RowProps<GitOpsHistoryData>> = (props) => {
  const { obj: data, activeColumnIDs } = props;
  return (
    <>
      <TableData
        id="time"
        className={DeploymentHistoryTableColumnClasses[0]}
        activeColumnIDs={activeColumnIDs}
      >
        <Timestamp timestamp={data.deployed_at} key={data.deployed_at} />
      </TableData>
      <TableData
        id="message"
        className={classNames(DeploymentHistoryTableColumnClasses[1], 'co-break-word')}
        // id="description"
        activeColumnIDs={activeColumnIDs}
      >
        {data.message}
      </TableData>
      <TableData
        id="environment"
        className={classNames(DeploymentHistoryTableColumnClasses[2], 'co-break-word')}
        activeColumnIDs={activeColumnIDs}
      >
        {data.environment}
      </TableData>
      <TableData
        id="author"
        className={DeploymentHistoryTableColumnClasses[3]}
        activeColumnIDs={activeColumnIDs}
      >
        {data.author}
      </TableData>
      <TableData
        id="revision"
        className={classNames(DeploymentHistoryTableColumnClasses[4], 'pf-u-text-nowrap')}
        activeColumnIDs={activeColumnIDs}
      >
        <CommitRevision repoUrl={data.repo_url} revision={data.revision} />
      </TableData>
    </>
  );
};
