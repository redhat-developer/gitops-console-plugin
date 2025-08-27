import * as React from 'react';
import { useK8sWatchResource, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { useParams } from 'react-router-dom-v5-compat';
import { ApplicationSetKind, ApplicationSetModel } from '../../models/ApplicationSetModel';
import {
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Spinner,
  Badge,
  Label,
  LabelGroup,
  DescriptionList,
  Tabs,
  Tab,
  TabTitleText,
  Button,
} from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import * as _ from 'lodash';
import { useApplicationSetActionsProvider } from '../../hooks/useApplicationSetActionsProvider';
import ApplicationDetailsTitle from './ApplicationDetailsTitle';
import { useLabelsModal, useAnnotationsModal } from '@openshift-console/dynamic-plugin-sdk';

import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';

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
  const launchLabelsModal = useLabelsModal(appSet);
  const launchAnnotationsModal = useAnnotationsModal(appSet);

  if (loadError) return <div>Error loading ApplicationSet details.</div>;
  if (!loaded || !appSet) return <Spinner />;

  const metadata = appSet.metadata || {};
  const status = appSet.status || {};

  const handleTabClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  const labelItems = metadata.labels || {};
  const annotationItems = metadata.annotations || {};
  // Helper to count object keys
  const countAnnotations = Object.keys(annotationItems).length;

  return (
    <div className="pf-v6-c-page__main-section pf-m-no-padding pf-m-fill pf-v6-c-page__main-section--no-gap pf-v6-u-flex-shrink-1">
      <ApplicationDetailsTitle
        obj={appSet}
        model={ApplicationSetModel}
        name={name}
        namespace={ns}
        actions={actions}
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
                    <Card>
                      <CardHeader>
                        <CardTitle>ApplicationSet details</CardTitle>
                      </CardHeader>
                      <CardBody>
                        <DescriptionList data-test-id="resource-summary">
                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Name">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">Name</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">{metadata.name}</div>
                              </div>
                            </dd>
                          </div>

                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Namespace">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">Namespace</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">
                                  <ResourceLink kind="Namespace" name={metadata.namespace} />
                                </div>
                              </div>
                            </dd>
                          </div>

                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Labels" style={{ margin: 0 }}>
                              <span>Labels</span>
                            </dt>
                            <dd className="pf-v6-c-description-list__description" style={{ padding: 0, marginTop: 0 }}>
                              <div style={{ display: 'inline-block' }}>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 4, width: '100%' }}>
                                  <a
                                    style={{
                                      fontSize: 13,
                                      color: '#73bcf7',
                                      textDecoration: 'underline',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                    }}
                                    tabIndex={0}
                                    role="button"
                                    onClick={launchLabelsModal}
                                    onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') launchLabelsModal(); }}
                                    aria-label="Edit labels"
                                  >
                                    Edit <PencilAltIcon style={{ marginLeft: 4, fontSize: 13, color: '#73bcf7' }} />
                                  </a>
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    border: '1px solid #8a8d90',
                                    borderRadius: 8,
                                    padding: '6px 10px',
                                    background: 'none',
                                    boxSizing: 'border-box',
                                    width: 'fit-content',
                                    maxWidth: '100%',
                                    gap: 8,
                                  }}
                                >
                                  {_.isEmpty(labelItems) ? (
                                    <span className="text-muted">No labels</span>
                                  ) : (
                                    <LabelGroup
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: '8px',
                                        margin: 0,
                                      }}
                                    >
                                      {Object.entries(labelItems).map(([key, value]) => (
                                        <Label key={key} color="grey">
                                          {key}={value}
                                        </Label>
                                      ))}
                                    </LabelGroup>
                                  )}
                                </div>
                              </div>
                            </dd>
                          </div>

                          {/* Annotations Section - matches Console style */}
                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Annotations" style={{ margin: 0 }}>
                              <span>Annotations</span>
                            </dt>
                            <dd className="pf-v6-c-description-list__description" style={{ padding: 0, marginTop: 0 }}>
                              <div style={{ display: 'inline-block' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4, width: '100%' }}>
                                  <a
                                    style={{
                                      fontSize: 15,
                                      color: '#73bcf7',
                                      textDecoration: 'underline',
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                    }}
                                    tabIndex={0}
                                    role="button"
                                    onClick={launchAnnotationsModal}
                                    onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') launchAnnotationsModal(); }}
                                    aria-label="Edit annotations"
                                  >
                                    {countAnnotations} annotation{countAnnotations !== 1 ? 's' : ''}
                                    <PencilAltIcon style={{ marginLeft: 6, fontSize: 15, color: '#73bcf7' }} />
                                  </a>
                                </div>
                              </div>
                            </dd>
                          </div>

                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Created">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                      <Button
                                        variant="link"
                                        icon={<PencilAltIcon />}
                                        onClick={launchLabelsModal}
                                        style={{
                                          padding: 0,
                                          position: 'absolute',
                                          top: -24,
                                          right: 0,
                                          fontSize: 13,
                                        }}
                                        aria-label="Edit labels"
                                      >
                                        Edit
                                      </Button>
                                <div className="pf-v6-l-split__item pf-m-fill">Created at</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">
                                  <Timestamp timestamp={metadata.creationTimestamp} />
                                </div>
                              </div>
                            </dd>
                          </div>

                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Status">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">Status</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">
                                  <Badge isRead color="green">Healthy</Badge>
                                </div>
                              </div>
                            </dd>
                          </div>

                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_GeneratedApps">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">Generated Apps</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">
                                  <Badge isRead color="blue">3 applications</Badge>
                                </div>
                              </div>
                            </dd>
                          </div>

                          {/* Generators Section */}
                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Generators">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">Generators</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">
                                  <Badge isRead color="grey">1 generators</Badge>
                                </div>
                              </div>
                            </dd>
                          </div>

                          {/* App Project Section (blue badge, no extra Created at) */}
                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_AppProject">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">App Project</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">
                                  <Badge isRead color="blue" style={{ backgroundColor: '#73bcf7', color: '#003a70' }}>AP</Badge> default
                                </div>
                              </div>
                            </dd>
                          </div>

                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Repository">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">Repository</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">
                                  <a href="https://github.com/aal/309/argocd-test-nested.git" target="_blank" rel="noopener noreferrer">
                                    https://github.com/aal/309/argocd-test-nested.git
                                  </a>
                                </div>
                              </div>
                            </dd>
                          </div>
                        </DescriptionList>

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
                      </CardBody>
                    </Card>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSetDetailsPage;
