import * as React from 'react';
import { useParams } from 'react-router-dom-v5-compat';

import { useApplicationActionsProvider } from '@gitops/hooks/useApplicationActionsProvider';
import { ApplicationKind, ApplicationModel } from '@gitops/models/ApplicationModel';
import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { HorizontalNav } from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useFleetK8sWatchResource } from '@stolostron/multicluster-sdk';

import DetailsPageHeader from '../shared/DetailsPageHeader/DetailsPageHeader';
import EventsTab from '../shared/EventsTab/EventsTab';
import ResourceYAMLTab from '../shared/ResourceYAMLTab/ResourceYAMLTab';

import ApplicationDetailsTab from './ApplicationDetailsTab';
import ApplicationHistoryTab from './ApplicationHistoryTab';
import ApplicationResourcesTab from './ApplicationResourcesTab';
import ApplicationSourcesTab from './ApplicationSourcesTab';
import ApplicationSyncStatusTab from './ApplicationSyncStatusTab';

const ApplicationNavPage: React.FC = () => {
  const { t } = useGitOpsTranslation();
  const {
    cluster,
    name,
    ns: namespace,
  } = useParams<{
    cluster?: string;
    name: string;
    ns: string;
  }>();
  const [application, loaded] = useFleetK8sWatchResource<ApplicationKind>({
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'Application',
      version: 'v1alpha1',
    },
    cluster,
    name,
    namespace,
  });

  const [actions] = useApplicationActionsProvider(application);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: ApplicationDetailsTab,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: ResourceYAMLTab,
      },
      {
        href: 'sources',
        name: t('Sources'),
        component: ApplicationSourcesTab,
      },
      {
        href: 'resources',
        name: t('Resources'),
        component: ApplicationResourcesTab,
      },
      {
        href: 'syncStatus',
        name: t('Sync Status'),
        component: ApplicationSyncStatusTab,
      },
      {
        href: 'History',
        name: t('History'),
        component: ApplicationHistoryTab,
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
        obj={application}
        model={ApplicationModel}
        namespace={namespace}
        name={name}
        actions={actions}
        iconText="A"
        iconTitle="Argo CD Application"
      />
      {loaded ? (
        <div>
          <HorizontalNav pages={pages} resource={application} />
        </div>
      ) : (
        <Bullseye>
          <Spinner size="xl" />
        </Bullseye>
      )}
    </>
  );
};

export default ApplicationNavPage;
