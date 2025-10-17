import * as React from 'react';

import { HorizontalNav, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import { useApplicationSetActionsProvider } from '../../hooks/useApplicationSetActionsProvider';
import { ApplicationSetKind, ApplicationSetModel } from '../../models/ApplicationSetModel';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import DetailsPageHeader from '../shared/DetailsPageHeader/DetailsPageHeader';
import EventsTab from '../shared/EventsTab/EventsTab';
import ResourceYAMLTab from '../shared/ResourceYAMLTab/ResourceYAMLTab';

import AppSetDetailsTab from './AppSetDetailsTab';
import AppsTab from './AppsTab';
import GeneratorsTab from './GeneratorsTab';

type AppSetPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const AppSetNavPage: React.FC<AppSetPageProps> = ({ name, namespace, kind }) => {
  const { t } = useGitOpsTranslation();
  const [appSet, loaded] = useK8sWatchResource<ApplicationSetKind>({
    groupVersionKind: {
      group: 'argoproj.io',
      version: 'v1alpha1',
      kind: 'ApplicationSet',
    },
    kind,
    name,
    namespace,
  });

  const [actions] = useApplicationSetActionsProvider(appSet);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: AppSetDetailsTab,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: ResourceYAMLTab,
      },
      {
        href: 'generators',
        name: t('Generators'),
        component: GeneratorsTab,
      },
      {
        href: 'applications',
        name: t('Applications'),
        component: AppsTab,
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
        obj={appSet}
        model={ApplicationSetModel}
        namespace={namespace}
        name={name}
        actions={actions}
        iconText="AS"
        iconTitle="Argo CD ApplicationSet"
      />
      {loaded ? (
        <div>
          <HorizontalNav pages={pages} resource={appSet} />
        </div>
      ) : (
        <Bullseye>
          <Spinner size="xl" />
        </Bullseye>
      )}
    </>
  );
};

export default AppSetNavPage;
