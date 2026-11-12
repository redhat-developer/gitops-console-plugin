import * as React from 'react';

import { useApplicationActionsProvider } from '@gitops/hooks/useApplicationActionsProvider';
import { useArgoServer } from '@gitops/hooks/useArgoServer';
import { ApplicationKind, ApplicationModel } from '@gitops/models/ApplicationModel';
import { getApplicationArgoUrl } from '@gitops/utils/gitops';
import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { HorizontalNav, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { Alert, Bullseye, Flex, Spinner } from '@patternfly/react-core';

import { AgenticRunLink } from '../shared/AgenticRunLink/AgenticRunLink';
import DetailsPageHeader from '../shared/DetailsPageHeader/DetailsPageHeader';
import EventsTab from '../shared/EventsTab/EventsTab';
import ResourceYAMLTab from '../shared/ResourceYAMLTab/ResourceYAMLTab';
import TechPreviewBadge from '../shared/TechPreviewBadge/TechPreviewBadge';

import ApplicationDetailsTab from './ApplicationDetailsTab';
import ApplicationHistoryTab from './ApplicationHistoryTab';
import ApplicationResourcesTab from './ApplicationResourcesTab';
import ApplicationSourcesTab from './ApplicationSourcesTab';
import ApplicationSyncStatusTab from './ApplicationSyncStatusTab';

import './application-details-title.scss';

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

  const argoServer = useArgoServer(application);
  const argoUrl = getApplicationArgoUrl(argoServer, application);
  const [actions] = useApplicationActionsProvider(application, argoUrl);

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
        alertSection={
          <AgenticRunLink application={application} namespace={namespace}>
            {(link) =>
              link && loaded && application ? (
                <Alert style={{ marginTop: '10px'}}
                  variant="info"
                  isInline
                  title={
                    <React.Fragment>
                      <Flex direction={{ default: 'row' }}>
                        <Flex flex={{ default: 'flex_3' }}>{t('AI remediation available')}</Flex>
                        <Flex
                          flex={{ default: 'flex_1' }}
                          justifyContent={{ default: 'justifyContentFlexEnd' }}
                        >
                          <TechPreviewBadge />
                        </Flex>
                      </Flex>
                    </React.Fragment>
                  }
                  actionLinks={link}
                >
                  {t('OpenShift Lightspeed analyzed this resource and proposed a fix.')}
                </Alert>
              ) : null
            }
          </AgenticRunLink>
        }
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
