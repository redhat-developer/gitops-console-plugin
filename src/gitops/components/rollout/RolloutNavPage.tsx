import * as React from 'react';

import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { HorizontalNav, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { ErrorState } from '@patternfly/react-component-groups';
import { Bullseye, Spinner } from '@patternfly/react-core';

import DetailsPageHeader from '../shared/DetailsPageHeader/DetailsPageHeader';
import EventsTab from '../shared/EventsTab/EventsTab';
import ResourceYAMLTab from '../shared/ResourceYAMLTab/ResourceYAMLTab';

import { useRolloutActionsProvider } from './hooks/useRolloutActionsProvider';
import { RolloutKind, RolloutModel } from './model/RolloutModel';
import RolloutDetailsTab from './RolloutDetailsTab';
import RolloutPodsTab from './RolloutPodsTab';

type RolloutPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const RolloutNavPage: React.FC<RolloutPageProps> = ({ name, namespace, kind }) => {
  const { t } = useGitOpsTranslation();
  const [rollout, loaded, loadError] = useK8sWatchResource<RolloutKind>({
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'Rollout',
      version: 'v1alpha1',
    },
    kind,
    name,
    namespace,
  });

  const [actions] = useRolloutActionsProvider(rollout);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: RolloutDetailsTab,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: ResourceYAMLTab,
      },
      {
        href: 'pods',
        name: t('Pods'),
        component: RolloutPodsTab,
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
        obj={rollout}
        model={RolloutModel}
        namespace={namespace}
        name={name}
        actions={actions}
        iconText="AR"
        iconTitle="Argo Rollout"
      />
      {/* eslint-disable-next-line no-nested-ternary */}
      {loaded && !loadError ? (
        <div>
          <HorizontalNav pages={pages} resource={rollout} />
        </div>
      ) : loadError ? (
        <ErrorState
          titleText={t('Unable to load data')}
          bodyText={t(
            'There was an error retrieving the rollout. Check your connection and reload the page.',
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

export default RolloutNavPage;
