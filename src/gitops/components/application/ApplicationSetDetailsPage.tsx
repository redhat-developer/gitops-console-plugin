import * as React from 'react';
import { useK8sWatchResource, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { useParams } from 'react-router-dom-v5-compat';
import { ApplicationSetKind, ApplicationSetModel } from '../../models/ApplicationSetModel';
import {
  Spinner,
  Badge,
  Tabs,
  Tab,
  TabTitleText,
} from '@patternfly/react-core';
import { useApplicationSetActionsProvider } from '../../hooks/useApplicationSetActionsProvider';
import ResourceDetailsTitle from '../../utils/components/DetailsPageTitle/ResourceDetailsTitle';
import ApplicationList from '../shared/ApplicationList';
import ResourceDetailsAttributes from '../../utils/components/ResourceDetails/ResourceDetailsAttributes';
import './ApplicationSetDetailsPage.scss';

const ApplicationSetDetailsPage: React.FC = () => {
  const { name, ns } = useParams<{ name: string; ns: string }>();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);

  const [appSet, loaded, loadError] = useK8sWatchResource<ApplicationSetKind>({
    groupVersionKind: {
      group: 'argoproj.io',
      version: 'v1alpha1',
      kind: 'ApplicationSet',
    },
    name,
    namespace: ns,
  });

  const [actions] = useApplicationSetActionsProvider(appSet);

  if (loadError) return <div>Error loading ApplicationSet details.</div>;
  if (!loaded || !appSet) return <Spinner />;

  const metadata = appSet.metadata || {};
  const status = appSet.status || {};

  const handleTabClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <div className="application-set-details-page__main-section">
      <ResourceDetailsTitle
        obj={appSet}
        model={ApplicationSetModel}
        name={name}
        namespace={ns}
        actions={actions}
        iconText="AS"
        iconTitle="Argo CD ApplicationSet"
        resourcePrefix="Argo CD"
      />

      {/* Main Content */}
      <div className="application-set-details-page__body">
        {/* Tabs Section */}
        <div className="application-set-details-page__pane-body">
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick} className="pf-v6-c-tabs">
            <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>} className="pf-v6-c-tab-content">
              <div className="application-set-details-page__pane-body">
                <div className="application-set-details-page__grid">
                  <div className="application-set-details-page__grid-item">
                    <div className="application-set-details-page__header">
                      <h2 className="application-set-details-page__header-title">Argo CD ApplicationSet details</h2>
                    </div>
                    <div className="application-set-details-page__content">
                      <ResourceDetailsAttributes
                        metadata={metadata}
                        resource={appSet}
                        showOwner={true}
                        showStatus={true}
                        showGeneratedApps={true}
                        showGenerators={true}
                        showAppProject={true}
                        showRepository={true}
                      />

                        {/* Conditions Section */}
                        {status.conditions && status.conditions.length > 0 && (
                          <div className="application-set-details-page__conditions">
                            <div className="application-set-details-page__conditions-title">Conditions</div>
                            <div className="application-set-details-page__conditions-table">
                              <div className="application-set-details-page__conditions-table-header">
                                <div className="application-set-details-page__conditions-table-header-cell application-set-details-page__conditions-table-header-cell--type">Type</div>
                                <div className="application-set-details-page__conditions-table-header-cell application-set-details-page__conditions-table-header-cell--status">Status</div>
                                <div className="application-set-details-page__conditions-table-header-cell application-set-details-page__conditions-table-header-cell--updated">Updated</div>
                                <div className="application-set-details-page__conditions-table-header-cell application-set-details-page__conditions-table-header-cell--reason">Reason</div>
                                <div className="application-set-details-page__conditions-table-header-cell application-set-details-page__conditions-table-header-cell--message">Message</div>
                              </div>
                              {status.conditions.map((condition: any, index: number) => (
                                <React.Fragment key={index}>
                                  <div className="application-set-details-page__conditions-table-row">
                                    <div className="application-set-details-page__conditions-table-row-cell application-set-details-page__conditions-table-row-cell--type">{condition.type}</div>
                                    <div className="application-set-details-page__conditions-table-row-cell application-set-details-page__conditions-table-row-cell--status">{condition.status}</div>
                                    <div className="application-set-details-page__conditions-table-row-cell application-set-details-page__conditions-table-row-cell--updated">
                                      <Timestamp timestamp={condition.lastTransitionTime} />
                                    </div>
                                    <div className="application-set-details-page__conditions-table-row-cell application-set-details-page__conditions-table-row-cell--reason">{condition.reason || ''}</div>
                                    <div className="application-set-details-page__conditions-table-row-cell application-set-details-page__conditions-table-row-cell--message">{condition.message || ''}</div>
                                  </div>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey={1} title={<TabTitleText>YAML</TabTitleText>} className="pf-v6-c-tab-content">
              <div className="application-set-details-page__pane-body">
                <div className="application-set-details-page__yaml-editor">
                  <div className="application-set-details-page__yaml-editor-header">
                    <div className="application-set-details-page__yaml-editor-header-buttons">
                      <button className="btn" aria-label="File">
                        <i className="fa fa-file"></i>
                      </button>
                      <button className="btn" aria-label="Settings">
                        <i className="fa fa-cog"></i>
                      </button>
                      <button className="btn" aria-label="Full screen">
                        <i className="fa fa-expand"></i>
                      </button>
                    </div>
                    <div className="application-set-details-page__yaml-editor-header-shortcuts">
                      <a href="#" className="application-set-details-page__yaml-editor-header-shortcuts-link">Shortcuts</a>
                    </div>
                  </div>
                  <div className="application-set-details-page__yaml-editor-content">
                    <pre>{JSON.stringify(appSet, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey={2} title={<TabTitleText>Generators</TabTitleText>} className="pf-v6-c-tab-content">
              <div className="application-set-details-page__grid">
                <div className="application-set-details-page__grid-item">
                  <div className="application-set-details-page__header">
                    <h2 className="application-set-details-page__header-title">Generators</h2>
                  </div>
                  <div className="application-set-details-page__content">
                        <div className="application-set-details-page__generators-container">
                          {appSet.spec?.generators?.map((generator: any, index: number) => {
                            const generatorType = Object.keys(generator)[0];
                            const generatorData = generator[generatorType];
                            
                            return (
                              <div key={index} className="application-set-details-page__generators-item">
                                <div className="application-set-details-page__generators-item-header">
                                  <div className="application-set-details-page__generators-item-header-icon">
                                    {generatorType.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="application-set-details-page__generators-item-header-title">{generatorType}</span>
                                </div>
                                
                                {/* Render different generator types */}
                                {generatorType === 'git' && (
                                  <div className="application-set-details-page__generators-item-content">
                                    {generatorData.repoURL && (
                                      <div className="application-set-details-page__generators-item-content-row">
                                        <span className="application-set-details-page__generators-item-content-row-label">Repository:</span>
                                        <span className="application-set-details-page__generators-item-content-row-value">
                                          {generatorData.repoURL}
                                        </span>
                                      </div>
                                    )}
                                    {generatorData.revision && (
                                      <div className="application-set-details-page__generators-item-content-row">
                                        <span className="application-set-details-page__generators-item-content-row-label">Revision:</span>
                                        <span>{generatorData.revision}</span>
                                      </div>
                                    )}
                                    {generatorData.directories && (
                                      <div className="application-set-details-page__generators-item-content-row">
                                        <span className="application-set-details-page__generators-item-content-row-label">Directories:</span>
                                        <span>{generatorData.directories.length} directory(ies)</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {generatorType === 'clusterDecisionResource' && (
                                  <div className="application-set-details-page__generators-item-content">
                                    {generatorData.configMapRef && (
                                      <div className="application-set-details-page__generators-item-content-row">
                                        <span className="application-set-details-page__generators-item-content-row-label">ConfigMap:</span>
                                        <span>{generatorData.configMapRef.name}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {generatorType === 'matrix' && (
                                  <div className="application-set-details-page__generators-item-content">
                                    <div style={{ color: '#8a8d90', fontSize: '14px' }}>
                                      Matrix generator with {Object.keys(generatorData).length} generators
                                    </div>
                                  </div>
                                )}
                                
                                {generatorType === 'clusters' && (
                                  <div className="application-set-details-page__generators-item-content">
                                    {generatorData.selector && (
                                      <div className="application-set-details-page__generators-item-content-row">
                                        <span className="application-set-details-page__generators-item-content-row-label">Selector:</span>
                                        <span style={{ fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace', fontSize: '12px' }}>
                                          {JSON.stringify(generatorData.selector)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          
                          {(!appSet.spec?.generators || appSet.spec.generators.length === 0) && (
                            <div style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              padding: '40px 20px',
                              color: '#8a8d90',
                              fontSize: '16px'
                            }}>
                              <div style={{ 
                                width: '48px', 
                                height: '48px', 
                                backgroundColor: '#393F44', 
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '16px',
                                fontSize: '24px'
                              }}>
                                ⚙️
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontWeight: '600', marginBottom: '8px' }}>No Generators</div>
                                <div style={{ fontSize: '14px' }}>
                                  This ApplicationSet has no generators configured.
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                </div>
            </Tab>

            <Tab eventKey={3} title={<TabTitleText>Applications</TabTitleText>} className="pf-v6-c-tab-content">
              <div className="application-set-details-page__pane-body">
                <div style={{ padding: '0' }}>
                  <ApplicationList 
                    namespace={ns}
                    hideNameLabelFilters={false}
                    showTitle={false}
                    appset={appSet}
                  />
                </div>
              </div>
            </Tab>

            <Tab eventKey={4} title={<TabTitleText>Events</TabTitleText>} className="pf-v6-c-tab-content">
              <div className="application-set-details-page__pane-body">
                <div className="application-set-details-page__grid">
                  <div className="application-set-details-page__grid-item">
                    <div className="application-set-details-page__header">
                      <h2 className="application-set-details-page__header-title">Events</h2>
                    </div>
                    <div className="application-set-details-page__content">
                        {status.conditions && status.conditions.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {status.conditions.map((condition: any, index: number) => (
                              <div key={index} style={{ 
                                border: '1px solid #393F44', 
                                borderRadius: '8px', 
                                padding: '16px',
                                backgroundColor: '#212427'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div style={{ 
                                      width: '24px', 
                                      height: '24px', 
                                      backgroundColor: condition.status === 'True' ? '#3e8635' : '#c9190b', 
                                      borderRadius: '4px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      marginRight: '8px',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      color: 'white'
                                    }}>
                                      {condition.status === 'True' ? '✓' : '✗'}
                                    </div>
                                    <span style={{ fontWeight: '600', fontSize: '16px' }}>
                                      {condition.type}
                                    </span>
                                  </div>
                                  <Badge isRead color={condition.status === 'True' ? 'green' : 'red'}>
                                    {condition.status}
                                  </Badge>
                                </div>
                                <div style={{ fontSize: '14px', color: '#8a8d90', marginBottom: '8px' }}>
                                  {condition.message || 'No message available'}
                                </div>
                                {condition.lastTransitionTime && (
                                  <div style={{ fontSize: '12px', color: '#8a8d90' }}>
                                    Last updated: {new Date(condition.lastTransitionTime).toLocaleString()}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            padding: '40px 20px',
                            color: '#8a8d90',
                            fontSize: '16px'
                          }}>
                            <div style={{ 
                              width: '48px', 
                              height: '48px', 
                              backgroundColor: '#393F44', 
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '16px',
                              fontSize: '24px'
                            }}>
                              📊
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontWeight: '600', marginBottom: '8px' }}>No Events</div>
                              <div style={{ fontSize: '14px' }}>
                                No events have been recorded for this ApplicationSet.
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSetDetailsPage;
