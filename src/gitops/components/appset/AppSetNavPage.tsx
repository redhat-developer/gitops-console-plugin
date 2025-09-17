import * as React from 'react';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { ApplicationSetKind, ApplicationSetModel } from '../../models/ApplicationSetModel';
import {
  Spinner,
  Bullseye,
  Tabs,
  Tab,
  TabTitleText,
} from '@patternfly/react-core';
import DetailsPageHeader from '../shared/DetailsPageHeader/DetailsPageHeader';
import { useApplicationSetActionsProvider } from '../../hooks/useApplicationSetActionsProvider';
import AppSetDetailsTab from './AppSetDetailsTab';
import GeneratorsTab from './GeneratorsTab';
import AppsTab from './AppsTab';
import EventsTab from './EventsTab';
import YAMLTab from './YAMLTab';
import './AppSetNavPage.scss';
import { useLocation } from 'react-router-dom-v5-compat';

type AppSetPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const AppSetNavPage: React.FC<AppSetPageProps> = ({ name, namespace, kind }) => {
  const location = useLocation();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const [appSet, loaded, loadError] = useK8sWatchResource<ApplicationSetKind>({
    groupVersionKind: {
      group: 'argoproj.io',
      version: 'v1alpha1',
      kind: 'ApplicationSet',
    },
    name,
    namespace,
  });

  const [actions] = useApplicationSetActionsProvider(appSet);

  // Handle tab query parameter
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'yaml') {
      setActiveTabKey(1); // YAML tab is at index 1
    }
  }, [location.search]);

  if (loadError) return <div>Error loading ApplicationSet details.</div>;
  if (!loaded || !appSet) return (
    <Bullseye>
      <Spinner size="xl" />
    </Bullseye>
  );

  const handleTabClick = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: string | number,
  ) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <div className="application-set-details-page__main-section">
      <DetailsPageHeader
        obj={appSet}
        model={ApplicationSetModel}
        name={name}
        namespace={namespace}
        actions={actions}
        iconText="AS"
        iconTitle="Argo CD ApplicationSet"
      />
      <div className="application-set-details-page__body">
        <div className="application-set-details-page__pane-body">
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick} className="pf-v6-c-tabs">
            <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>} className="pf-v6-c-tab-content">
              <AppSetDetailsTab obj={appSet} namespace={namespace} name={name} />
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>YAML</TabTitleText>} className="pf-v6-c-tab-content">
              <YAMLTab obj={appSet} namespace={namespace} name={name} />
            </Tab>
            <Tab eventKey={2} title={<TabTitleText>Generators</TabTitleText>} className="pf-v6-c-tab-content">
              <GeneratorsTab obj={appSet} namespace={namespace} name={name} />
            </Tab>
            <Tab eventKey={3} title={<TabTitleText>Applications</TabTitleText>} className="pf-v6-c-tab-content">
              <AppsTab obj={appSet} namespace={namespace} name={name} />
            </Tab>
            <Tab eventKey={4} title={<TabTitleText>Events</TabTitleText>} className="pf-v6-c-tab-content">
              <EventsTab obj={appSet} namespace={namespace} name={name} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AppSetNavPage;
