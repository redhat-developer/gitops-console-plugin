import * as React from 'react';

import { useApplicationActionsProvider } from '@gitops/hooks/useApplicationActionsProvider';
import { ApplicationKind, ApplicationModel } from '@gitops/models/ApplicationModel';
import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { HorizontalNav, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import DetailsPageHeader from '../shared/DetailsPageHeader/DetailsPageHeader';
import EventsTab from '../shared/EventsTab/EventsTab';
import ResourceYAMLTab from '../shared/ResourceYAMLTab/ResourceYAMLTab';

import ApplicationDetailsTab from './ApplicationDetailsTab';
import ApplicationHistoryTab from './ApplicationHistoryTab';
import ApplicationResourcesTab from './ApplicationResourcesTab';
import ApplicationSourcesTab from './ApplicationSourcesTab';
import ApplicationSyncStatusTab from './ApplicationSyncStatusTab';

type ApplicationPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const ApplicationNavPage: React.FC<ApplicationPageProps> = ({ name, namespace, kind }) => {
  const { t } = useGitOpsTranslation();
  const [application, loaded] = useK8sWatchResource<ApplicationKind>({
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'Application',
      version: 'v1alpha1',
    },
    kind,
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
