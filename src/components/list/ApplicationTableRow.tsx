import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import {
  GreenCheckCircleIcon,
  RowProps,
  TableData,
  Timestamp,
  YellowExclamationTriangleIcon,
} from '@openshift-console/dynamic-plugin-sdk';
import { Flex, FlexItem, Split, SplitItem } from '@patternfly/react-core';

import { routeDecoratorIcon } from '../import/render-utils';
import { GrayUnknownIcon } from '../status/icons';
import ExternalLink from '../utils/ExternalLink/ExternalLink';
import { GitOpsAppGroupData } from '../utils/gitops-types';

import SyncFragment from './SyncFragment';

import './ApplicationTableRow.scss';

const tableColumnClasses = [
  classNames('pf-m-width-20'), // Application name
  classNames('pf-m-width-30'), // Git repository
  classNames('pf-m-hidden', 'pf-m-visible-on-md', 'pf-m-width-20'), // Environments
  classNames('pf-m-hidden', 'pf-m-visible-on-lg', 'pf-m-width-30'), // Last deployment
];

const getMatchingEnvs =
  (envs: string[], desiredStatus: string) =>
  (acc: string[], status: string, idx: number): string[] =>
    desiredStatus === status
      ? [...acc, envs[idx]] // 1:1 between a status and an env
      : acc;

const ApplicationTableRow: React.FC<RowProps<GitOpsAppGroupData>> = (props) => {
  const { obj: appGroup, activeColumnIDs } = props;

  const {
    name,
    sync_status: syncStatuses = [],
    environments: envs,
    last_deployed: lastDeployed = [],
    repo_url: repoUrl,
  } = appGroup;

  const { t } = useTranslation('plugin__gitops-plugin');
  const syncedEnvs: string[] = syncStatuses.reduce(getMatchingEnvs(envs, 'Synced'), []);
  const outOfSyncEnvs: string[] = syncStatuses.reduce(getMatchingEnvs(envs, 'OutOfSync'), []);
  const unknownEnvs: string[] = syncStatuses.reduce(getMatchingEnvs(envs, 'Unknown'), []);
  const latestDeployedTime = lastDeployed.reduce(
    (leadingDeployedTime, deployedTime) =>
      leadingDeployedTime < deployedTime ? deployedTime : leadingDeployedTime,
    '',
  );
  const latestDeployedEnv = latestDeployedTime
    ? envs[lastDeployed.indexOf(latestDeployedTime)]
    : '';
  return (
    <>
      <TableData id="name" className={tableColumnClasses[0]} activeColumnIDs={activeColumnIDs}>
        <Link to={`/envdynamic/${appGroup.name}/overview?url=${appGroup.repo_url}`} title={name}>
          {name}
        </Link>
      </TableData>
      <TableData
        id="gitRepository"
        className={classNames(tableColumnClasses[1])}
        activeColumnIDs={activeColumnIDs}
      >
        <ExternalLink href={repoUrl} additionalClassName={'co-break-all'}>
          <span style={{ marginRight: 'var(--pf-global--spacer--xs)' }}>
            {routeDecoratorIcon(repoUrl, 12, t)}
          </span>
          <span style={{ marginRight: 'var(--pf-global--spacer--xs)' }}>{repoUrl}</span>
        </ExternalLink>
      </TableData>
      <TableData
        id="environments"
        className={classNames(tableColumnClasses[2])}
        activeColumnIDs={activeColumnIDs}
      >
        {syncStatuses.length > 0 ? (
          <Flex className="gitops-plugin__syncStatus">
            <SyncFragment
              tooltip={syncedEnvs.map((env) => (
                <Split className="gitops-plugin__tooltip-text" hasGutter key={`${name}-${env}`}>
                  <SplitItem>
                    <GreenCheckCircleIcon />
                  </SplitItem>
                  <SplitItem isFilled>{env}</SplitItem>
                  <SplitItem>{t('plugin__gitops-plugin~Synced')}</SplitItem>
                </Split>
              ))}
              count={syncedEnvs.length}
              icon="check"
            />
            <SyncFragment
              tooltip={outOfSyncEnvs.map((env) => (
                <Split className="gitops-plugin__tooltip-text" hasGutter key={`${name}-${env}`}>
                  <SplitItem>
                    <YellowExclamationTriangleIcon />
                  </SplitItem>
                  <SplitItem isFilled>{env}</SplitItem>
                  <SplitItem>{t('plugin__gitops-plugin~OutOfSync')}</SplitItem>
                </Split>
              ))}
              count={outOfSyncEnvs.length}
              icon="exclamation"
            />
            <SyncFragment
              tooltip={unknownEnvs.map((env) => (
                <Split className="gitops-plugin__tooltip-text" hasGutter key={`${name}-${env}`}>
                  <SplitItem>
                    <GrayUnknownIcon />
                  </SplitItem>
                  <SplitItem isFilled>{env}</SplitItem>
                  <SplitItem>{t('plugin__gitops-plugin~Unknown')}</SplitItem>
                </Split>
              ))}
              count={unknownEnvs.length}
              icon="unknown"
            />
          </Flex>
        ) : (
          <span>{envs.join(', ')}</span>
        )}
      </TableData>
      <TableData
        id="lastDeployment"
        className={tableColumnClasses[3]}
        activeColumnIDs={activeColumnIDs}
      >
        {latestDeployedTime !== '' ? (
          <Flex>
            <FlexItem
              className="gitops-plugin__lastDeploymentTime"
              spacer={{ default: 'spacerXs' }}
            >
              <span>
                <Timestamp timestamp={latestDeployedTime} />
              </span>
            </FlexItem>
            <FlexItem>({latestDeployedEnv})</FlexItem>
          </Flex>
        ) : (
          <span>-</span>
        )}
      </TableData>
    </>
  );
};

export default ApplicationTableRow;
