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
    <div className="pf-v6-c-page__main-section pf-m-no-padding pf-m-fill pf-v6-c-page__main-section--no-gap pf-v6-u-flex-shrink-1">
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
      <div className="pf-v6-l-flex pf-m-column pf-m-nowrap pf-m-row-gap-none co-m-page__body co-m-argoproj.io~v1alpha1~ApplicationSet">
        {/* Tabs Section */}
        <div className="co-m-pane__body">
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick} className="pf-v6-c-tabs">
            <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>} className="pf-v6-c-tab-content">
              <div className="co-m-pane__body">
                <div className="pf-v6-l-grid pf-m-gutter">
                  <div className="pf-v6-l-grid__item pf-m-12-col-on-md">
                    <div style={{ marginBottom: '24px', paddingLeft: '24px', paddingTop: '24px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Argo CD ApplicationSet details</h2>
                    </div>
                    <div style={{ paddingLeft: '24px' }}>
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
                          <div className="co-m-pane__body" style={{ marginTop: 32 }}>
                            <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 20, marginTop: 8 }}>Conditions</div>
                            <div style={{ borderTop: '1px solid #393F44', marginBottom: 0 }} />
                            <div style={{ width: '100%' }}>
                              <div style={{ display: 'flex', fontWeight: 600, fontSize: 16, padding: '16px 0 8px 0' }}>
                                <div style={{ flex: 2, textAlign: 'left', paddingLeft: 0 }}>Type</div>
                                <div style={{ flex: 1, textAlign: 'left' }}>Status</div>
                                <div style={{ flex: 2, textAlign: 'left' }}>Updated</div>
                                <div style={{ flex: 2, textAlign: 'left' }}>Reason</div>
                                <div style={{ flex: 4, textAlign: 'left' }}>Message</div>
                              </div>
                              <div style={{ borderTop: '1px solid #393F44' }} />
                              {status.conditions.map((condition: any, index: number) => (
                                <React.Fragment key={index}>
                                  <div style={{ display: 'flex', fontSize: 15, padding: '16px 0', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 2, textAlign: 'left', paddingLeft: 0 }}>{condition.type}</div>
                                    <div style={{ flex: 1, textAlign: 'left' }}>{condition.status}</div>
                                    <div style={{ flex: 2, textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                                      <Timestamp timestamp={condition.lastTransitionTime} />
                                    </div>
                                    <div style={{ flex: 2, textAlign: 'left' }}>{condition.reason || ''}</div>
                                    <div style={{ flex: 4, textAlign: 'left' }}>{condition.message || ''}</div>
                                  </div>
                                  {index !== status.conditions.length - 1 && (
                                    <div style={{ borderTop: '1px solid #393F44' }} />
                                  )}
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
              <div className="co-m-pane__body">
                <div className="co-yaml-editor">
                  <div className="co-yaml-editor__header">
                    <div className="co-yaml-editor__header-buttons">
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
                    <div className="co-yaml-editor__header-shortcuts">
                      <a href="#" className="co-yaml-editor__header-shortcuts-link">Shortcuts</a>
                    </div>
                  </div>
                  <div className="co-yaml-editor__content" style={{ background: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', fontSize: 14, borderRadius: 4, padding: 0 }}>
                    <pre style={{ margin: 0, padding: 16, overflow: 'auto' }}>{JSON.stringify(appSet, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey={2} title={<TabTitleText>Generators</TabTitleText>} className="pf-v6-c-tab-content">
              <div className="pf-v6-l-grid pf-m-gutter">
                <div className="pf-v6-l-grid__item pf-m-12-col-on-md">
                  <div style={{ marginBottom: '24px', paddingLeft: '24px', paddingTop: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Generators</h2>
                  </div>
                  <div style={{ paddingLeft: '24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {appSet.spec?.generators?.map((generator: any, index: number) => {
                            const generatorType = Object.keys(generator)[0];
                            const generatorData = generator[generatorType];
                            
                            return (
                              <div key={index} style={{ 
                                border: '1px solid #393F44', 
                                borderRadius: '8px', 
                                padding: '16px',
                                backgroundColor: '#212427'
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                  <div style={{ 
                                    width: '24px', 
                                    height: '24px', 
                                    backgroundColor: '#73bcf7', 
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: '8px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    color: '#003a70'
                                  }}>
                                    {generatorType.charAt(0).toUpperCase()}
                                  </div>
                                  <span style={{ fontWeight: '600', fontSize: '16px' }}>{generatorType}</span>
                                </div>
                                
                                {/* Render different generator types */}
                                {generatorType === 'git' && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {generatorData.repoURL && (
                                      <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '500', minWidth: '80px', color: '#8a8d90' }}>Repository:</span>
                                        <span style={{ color: '#73bcf7', textDecoration: 'underline', cursor: 'pointer' }}>
                                          {generatorData.repoURL}
                                        </span>
                                      </div>
                                    )}
                                    {generatorData.revision && (
                                      <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '500', minWidth: '80px', color: '#8a8d90' }}>Revision:</span>
                                        <span>{generatorData.revision}</span>
                                      </div>
                                    )}
                                    {generatorData.directories && (
                                      <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '500', minWidth: '80px', color: '#8a8d90' }}>Directories:</span>
                                        <span>{generatorData.directories.length} directory(ies)</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {generatorType === 'clusterDecisionResource' && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {generatorData.configMapRef && (
                                      <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '500', minWidth: '80px', color: '#8a8d90' }}>ConfigMap:</span>
                                        <span>{generatorData.configMapRef.name}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {generatorType === 'matrix' && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ color: '#8a8d90', fontSize: '14px' }}>
                                      Matrix generator with {Object.keys(generatorData).length} generators
                                    </div>
                                  </div>
                                )}
                                
                                {generatorType === 'clusters' && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {generatorData.selector && (
                                      <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '500', minWidth: '80px', color: '#8a8d90' }}>Selector:</span>
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
              <div className="co-m-pane__body">
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
              <div className="co-m-pane__body">
                <div className="pf-v6-l-grid pf-m-gutter">
                  <div className="pf-v6-l-grid__item pf-m-12-col-on-md">
                    <div style={{ marginBottom: '24px', paddingLeft: '24px', paddingTop: '24px' }}>
                      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>Events</h2>
                    </div>
                    <div style={{ paddingLeft: '24px' }}>
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
