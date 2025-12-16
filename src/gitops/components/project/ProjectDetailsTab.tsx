import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import classNames from 'classnames';

import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import {
  Badge,
  DescriptionList,
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';

import { ApplicationKind, ApplicationModel } from '../../models/ApplicationModel';
import { AppProjectKind, AppProjectModel } from '../../models/AppProjectModel';
import { Conditions } from '../../utils/components/Conditions/Conditions';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import BaseDetailsSummary, {
  DetailsDescriptionGroup,
} from '../shared/BaseDetailsSummary/BaseDetailsSummary';

type ProjectDetailsTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: AppProjectKind;
};

const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();
  const namespace = obj?.metadata?.namespace;

  const [applications] = useK8sWatchResource<ApplicationKind[]>({
    groupVersionKind: {
      group: ApplicationModel.apiGroup,
      version: ApplicationModel.apiVersion,
      kind: ApplicationModel.kind,
    },
    namespace: namespace || obj?.metadata?.namespace,
    isList: true,
  });

  if (!obj) return null;

  const spec = obj.spec || {};
  const status = obj.status || {};
  const isDefaultProject = obj.metadata?.name === 'default';

  const applicationsCount =
    applications?.filter((app) => app.spec?.project === obj.metadata?.name).length || 0;

  const destinationsCount = spec.destinations?.length || 0;
  const sourceReposCount = spec.sourceRepos?.length || 0;
  const sourceNamespacesCount = spec.sourceNamespaces?.length || 0;
  const rolesCount = spec.roles?.length || 0;
  const syncWindowsCount = spec.syncWindows?.length || 0;

  return (
    <>
      <PageSection
        variant={PageSectionVariants.default}
        className={classNames('co-m-pane__body', { 'co-m-pane__body--section-heading': true })}
      >
        <Title headingLevel="h2" className="co-section-heading">
          {t('AppProject details')}
        </Title>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceEvenly' }}
          direction={{ default: 'column', lg: 'row' }}
        >
          <Flex flex={{ default: 'flex_2' }}>
            <FlexItem fullWidth={{ default: 'fullWidth' }}>
              <BaseDetailsSummary obj={obj} model={AppProjectModel} showOwner={false} />
            </FlexItem>
          </Flex>
          <Flex flex={{ default: 'flex_2' }} direction={{ default: 'column' }}>
            <FlexItem>
              <DescriptionList className="pf-c-description-list">
                {isDefaultProject && (
                  <DetailsDescriptionGroup
                    title={t('Project Type')}
                    help={t(
                      'The default project is created automatically and cannot be deleted. It can be modified but is recommended to create dedicated projects for production use.',
                    )}
                  >
                    <Badge isRead color="orange">
                      {t('Default Project')}
                    </Badge>
                  </DetailsDescriptionGroup>
                )}

                {spec.description && (
                  <DetailsDescriptionGroup
                    title={t('Description')}
                    help={t('Description of the AppProject.')}
                  >
                    {spec.description}
                  </DetailsDescriptionGroup>
                )}

                <DetailsDescriptionGroup
                  title={t('Applications')}
                  help={t('Number of applications using this AppProject.')}
                >
                  <Badge isRead color="blue">
                    {applicationsCount}{' '}
                    {applicationsCount !== 1 ? t('applications') : t('application')}
                  </Badge>
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Destinations')}
                  help={t(
                    'Number of allowed destinations (clusters/namespaces) for this AppProject.',
                  )}
                >
                  <Badge isRead color="grey">
                    {destinationsCount}{' '}
                    {destinationsCount !== 1 ? t('destinations') : t('destination')}
                  </Badge>
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Source Repositories')}
                  help={t('Number of allowed source repositories for this AppProject.')}
                >
                  <Badge isRead color="grey">
                    {sourceReposCount}{' '}
                    {sourceReposCount !== 1 ? t('repositories') : t('repository')}
                  </Badge>
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Source Namespaces')}
                  help={t('Number of allowed source namespaces for this AppProject.')}
                >
                  <Badge isRead color="grey">
                    {sourceNamespacesCount}{' '}
                    {sourceNamespacesCount !== 1 ? t('namespaces') : t('namespace')}
                  </Badge>
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Roles')}
                  help={t('Number of roles configured in this AppProject.')}
                >
                  <Badge isRead color="grey">
                    {rolesCount} {rolesCount !== 1 ? t('roles') : t('role')}
                  </Badge>
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Sync Windows')}
                  help={t('Number of sync windows configured in this AppProject.')}
                >
                  <Badge isRead color="grey">
                    {syncWindowsCount}{' '}
                    {syncWindowsCount !== 1 ? t('sync windows') : t('sync window')}
                  </Badge>
                </DetailsDescriptionGroup>

                {spec.permitOnlyProjectScopedClusters !== undefined && (
                  <DetailsDescriptionGroup
                    title={t('Project-Scoped Clusters Only')}
                    help={t(
                      'When enabled, applications can only be deployed to clusters that are scoped to this project. This prevents deploying to clusters that are not part of the project.',
                    )}
                  >
                    <Badge isRead color={spec.permitOnlyProjectScopedClusters ? 'green' : 'grey'}>
                      {spec.permitOnlyProjectScopedClusters ? t('Enabled') : t('Disabled')}
                    </Badge>
                  </DetailsDescriptionGroup>
                )}
              </DescriptionList>
            </FlexItem>
          </Flex>
        </Flex>
      </PageSection>

      {status.conditions && status.conditions.length > 0 && (
        <PageSection>
          <Title headingLevel="h2" className="co-section-heading">
            {t('Conditions')}
          </Title>
          <Conditions conditions={status.conditions} />
        </PageSection>
      )}
    </>
  );
};

export default ProjectDetailsTab;
