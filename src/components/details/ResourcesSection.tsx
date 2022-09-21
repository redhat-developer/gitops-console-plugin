import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { ResourceIcon } from '@openshift-console/dynamic-plugin-sdk';
import { Card, CardBody, Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';

import { GitOpsEnvironmentService, GitOpsHealthResources } from '../utils/gitops-types';

import ResourceRow from './ResourceRow';

import './ResourcesSection.scss';

interface GitOpsResourcesSectionProps {
  services: GitOpsEnvironmentService[];
  secrets: GitOpsHealthResources[];
  deployments: GitOpsHealthResources[];
  routes: GitOpsHealthResources[];
  roleBindings: GitOpsHealthResources[];
  clusterRoles: GitOpsHealthResources[];
  clusterRoleBindings: GitOpsHealthResources[];
}

export enum HealthStatus {
  DEGRADED = 'Degraded',
  PROGRESSING = 'Progressing',
  MISSING = 'Missing',
  UNKNOWN = 'Unknown',
}

const getUnhealthyResources =
  () =>
  (acc: string[], current: GitOpsHealthResources): string[] =>
    current.health === HealthStatus.DEGRADED ||
    current.health === HealthStatus.PROGRESSING ||
    current.health === HealthStatus.MISSING ||
    current.health === HealthStatus.UNKNOWN
      ? [...acc, current.health]
      : acc;

const getNonSyncedResources =
  () =>
  (acc: string[], current: GitOpsHealthResources): string[] =>
    current.status !== 'Synced' ? [...acc, current.status] : acc;

const GitOpsResourcesSection: React.FC<GitOpsResourcesSectionProps> = ({
  services,
  secrets,
  deployments,
  routes,
  roleBindings,
  clusterRoles,
  clusterRoleBindings,
}) => {
  const { t } = useTranslation();

  const resourcesList = [
    {
      resources: deployments,
      degradedResources: deployments ? deployments.reduce(getUnhealthyResources(), []) : [],
      nonSyncedResources: deployments ? deployments.reduce(getNonSyncedResources(), []) : [],
      kind: 'Deployments',
      name: 'Deployments',
    },
    {
      resources: secrets,
      degradedResources: secrets ? secrets.reduce(getUnhealthyResources(), []) : [],
      nonSyncedResources: secrets ? secrets.reduce(getNonSyncedResources(), []) : [],
      kind: 'Secret',
      name: 'Secrets',
    },
    {
      resources: services,
      degradedResources: services ? services.reduce(getUnhealthyResources(), []) : [],
      nonSyncedResources: services ? services.reduce(getNonSyncedResources(), []) : [],
      kind: 'Services',
      name: 'Services',
    },
    {
      resources: routes,
      degradedResources: routes ? routes.reduce(getUnhealthyResources(), []) : [],
      nonSyncedResources: routes ? routes.reduce(getNonSyncedResources(), []) : [],
      kind: 'Route',
      name: 'Routes',
    },
    {
      resources: roleBindings,
      degradedResources: null,
      nonSyncedResources: roleBindings ? roleBindings.reduce(getNonSyncedResources(), []) : [],
      kind: 'RoleBinding',
      name: 'Role Bindings',
    },
    {
      resources: clusterRoles,
      degradedResources: null,
      nonSyncedResources: clusterRoles ? clusterRoles.reduce(getNonSyncedResources(), []) : [],
      kind: 'ClusterRole',
      name: 'Cluster Roles',
    },
    {
      resources: clusterRoleBindings,
      degradedResources: null,
      nonSyncedResources: clusterRoleBindings
        ? clusterRoleBindings.reduce(getNonSyncedResources(), [])
        : [],
      kind: 'ClusterRoleBinding',
      name: 'Cluster Role Bindings',
    },
  ];

  return (
    <>
      <StackItem className="gitops-plugin__resources">
        <Card>
          <h3 className="gitops-plugin__resources__title co-nowrap">
            {t('gitops-plugin~Resources')}
          </h3>
          <CardBody>
            <Split hasGutter>
              <span className="gitops-plugin__resources__list">
                <SplitItem>
                  <Stack style={{ marginRight: 'var(--pf-global--spacer--sm)' }}>
                    {resourcesList.map((eachResource) => (
                      <StackItem>
                        {eachResource.resources ? eachResource.resources.length : 'N/A'}
                      </StackItem>
                    ))}
                  </Stack>
                </SplitItem>
                <SplitItem>
                  <Stack style={{ marginRight: 'var(--pf-global--spacer--sm)' }}>
                    {resourcesList.map((eachResource) => (
                      <StackItem>
                        <ResourceIcon kind={eachResource.kind} />{' '}
                        {t(`gitops-plugin~${eachResource.name}`)}
                      </StackItem>
                    ))}
                  </Stack>
                </SplitItem>
              </span>
              <SplitItem>
                <Stack style={{ alignItems: 'flex-end' }}>
                  {resourcesList.map((eachResource) => (
                    <ResourceRow
                      resources={eachResource.resources}
                      degradedResources={eachResource.degradedResources}
                      nonSyncedResources={eachResource.nonSyncedResources}
                    />
                  ))}
                </Stack>
              </SplitItem>
            </Split>
          </CardBody>
        </Card>
      </StackItem>
    </>
  );
};

export default GitOpsResourcesSection;
