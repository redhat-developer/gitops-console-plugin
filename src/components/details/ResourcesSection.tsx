import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
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
  const { t } = useTranslation('plugin__gitops-plugin');

  const resourcesList = [
    {
      resources: deployments,
      degradedResources: deployments ? deployments.reduce(getUnhealthyResources(), []) : [],
      nonSyncedResources: deployments ? deployments.reduce(getNonSyncedResources(), []) : [],
      kind: 'Deployments',
      label: t(`plugin__gitops-plugin~Deployments`),
    },
    {
      resources: secrets,
      degradedResources: secrets ? secrets.reduce(getUnhealthyResources(), []) : [],
      nonSyncedResources: secrets ? secrets.reduce(getNonSyncedResources(), []) : [],
      kind: 'Secret',
      label: t(`plugin__gitops-plugin~Secrets`),
    },
    {
      resources: services,
      degradedResources: services ? services.reduce(getUnhealthyResources(), []) : [],
      nonSyncedResources: services ? services.reduce(getNonSyncedResources(), []) : [],
      kind: 'Services',
      label: t(`plugin__gitops-plugin~Deployments`),
    },
    {
      resources: routes,
      degradedResources: routes ? routes.reduce(getUnhealthyResources(), []) : [],
      nonSyncedResources: routes ? routes.reduce(getNonSyncedResources(), []) : [],
      kind: 'Route',
      label: t(`plugin__gitops-plugin~Routes`),
    },
    {
      resources: roleBindings,
      degradedResources: null,
      nonSyncedResources: roleBindings ? roleBindings.reduce(getNonSyncedResources(), []) : [],
      kind: 'RoleBinding',
      label: t(`plugin__gitops-plugin~Role Bindings`),
    },
    {
      resources: clusterRoles,
      degradedResources: null,
      nonSyncedResources: clusterRoles ? clusterRoles.reduce(getNonSyncedResources(), []) : [],
      kind: 'ClusterRole',
      label: t(`plugin__gitops-plugin~Cluster Roles`),
    },
    {
      resources: clusterRoleBindings,
      degradedResources: null,
      nonSyncedResources: clusterRoleBindings
        ? clusterRoleBindings.reduce(getNonSyncedResources(), [])
        : [],
      kind: 'ClusterRoleBinding',
      label: t(`plugin__gitops-plugin~Cluster Role Bindings`),
    },
  ];

  return (
    <>
      <StackItem className="gitops-plugin__resources">
        <Card>
          <h3 className="gitops-plugin__resources__title co-nowrap">
            {t('plugin__gitops-plugin~Resources')}
          </h3>
          <CardBody>
            <Split hasGutter>
              <SplitItem className="gitops-plugin__resources__list">
                <SplitItem>
                  <Stack style={{ marginRight: 'var(--pf-global--spacer--sm)' }}>
                    {resourcesList.map((eachResource) => (
                      <StackItem key={eachResource.kind}>
                        {eachResource.resources ? eachResource.resources.length : 'N/A'}
                      </StackItem>
                    ))}
                  </Stack>
                </SplitItem>
                <SplitItem>
                  <Stack style={{ marginRight: 'var(--pf-global--spacer--sm)' }}>
                    {resourcesList.map((eachResource) => (
                      <StackItem key={eachResource.kind}>
                        <ResourceLink inline kind={eachResource.kind} />
                        {eachResource.label}
                      </StackItem>
                    ))}
                  </Stack>
                </SplitItem>
              </SplitItem>
              <SplitItem>
                <Stack style={{ alignItems: 'flex-end' }}>
                  {resourcesList.map((eachResource) => (
                    <ResourceRow
                      key={eachResource.kind}
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
