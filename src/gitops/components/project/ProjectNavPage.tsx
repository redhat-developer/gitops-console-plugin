import * as React from 'react';

import { HorizontalNav, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { ErrorState } from '@patternfly/react-component-groups';
import { Bullseye, Spinner } from '@patternfly/react-core';

import { AppProjectKind, AppProjectModel } from '../../models/AppProjectModel';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import DetailsPageHeader from '../shared/DetailsPageHeader/DetailsPageHeader';
import EventsTab from '../shared/EventsTab/EventsTab';
import ResourceYAMLTab from '../shared/ResourceYAMLTab/ResourceYAMLTab';

import { useProjectActionsProvider } from './hooks/useProjectActionsProvider';
import ProjectAllowDenyTab from './ProjectAllowDenyTab';
import ProjectApplicationsTab from './ProjectApplicationsTab';
import ProjectDetailsTab from './ProjectDetailsTab';
import ProjectRolesTab from './ProjectRolesTab';
import ProjectSyncWindowsTab from './ProjectSyncWindowsTab';

type ProjectPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const ProjectNavPage: React.FC<ProjectPageProps> = ({ name, namespace, kind }) => {
  const { t } = useGitOpsTranslation();
  const [project, loaded, loadError] = useK8sWatchResource<AppProjectKind>({
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'AppProject',
      version: 'v1alpha1',
    },
    kind,
    name,
    namespace,
  });

  const actions = useProjectActionsProvider(project);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: ProjectDetailsTab,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: ResourceYAMLTab,
      },
      {
        href: 'allowdeny',
        name: t('Allow/Deny'),
        component: ProjectAllowDenyTab,
      },
      {
        href: 'applications',
        name: t('Applications'),
        component: ProjectApplicationsTab,
      },
      {
        href: 'roles',
        name: t('Roles'),
        component: ProjectRolesTab,
      },
      {
        href: 'syncWindows',
        name: t('Sync Windows'),
        component: ProjectSyncWindowsTab,
      },
      {
        href: 'events',
        name: t('Events'),
        component: EventsTab,
      },
    ],
    [t],
  );

  return (
    <>
      <DetailsPageHeader
        obj={project}
        model={AppProjectModel}
        namespace={namespace}
        name={name}
        actions={actions}
        iconText="AP"
        iconTitle={t('ArgoCD AppProject')}
      />
      {/* eslint-disable-next-line no-nested-ternary */}
      {loaded && !loadError ? (
        <div>
          <HorizontalNav pages={pages} resource={project} />
        </div>
      ) : loadError ? (
        <ErrorState
          titleText={t('Unable to load data')}
          bodyText={t(
            'There was an error retrieving the AppProject. Check your connection and reload the page.',
          )}
        />
      ) : (
        <Bullseye>
          <Spinner size="xl" />
        </Bullseye>
      )}
    </>
  );
};

export default ProjectNavPage;
