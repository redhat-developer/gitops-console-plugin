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
  ButtonVariant
} from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import * as _ from 'lodash';
import { useApplicationSetActionsProvider } from '../../hooks/useApplicationSetActionsProvider';
import ApplicationDetailsTitle from './ApplicationDetailsTitle';

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

  const labelItems = metadata.labels || {};

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
                                  <Badge isRead color="green">NS</Badge> {metadata.namespace}
                                </div>
                              </div>
                            </dd>
                          </div>

                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Labels">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">Labels</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">
                                  {_.isEmpty(labelItems) ? (
                                    <span className="text-muted">No labels</span>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <LabelGroup>
                                        {Object.entries(labelItems).map(([key, value]) => (
                                          <Label key={key} color="grey">
                                            {key}={value}
                                          </Label>
                                        ))}
                                      </LabelGroup>
                                      <Button variant={ButtonVariant.link} icon={<PencilAltIcon />}>
                                        Edit
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </dd>
                          </div>

                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Created">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
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

                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Generators">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">Generators</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">
                                  <Badge isRead color="blue">1 generators</Badge>
                                </div>
                              </div>
                            </dd>
                          </div>

                          <div className="pf-v6-c-description-list__group">
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_AppProject">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">App Project</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">
                                  <Badge isRead color="blue">AP</Badge> default
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
                          <div className="co-m-pane__body">
                            <h2 data-test-section-heading="Conditions" className="pf-v6-c-title pf-m-h2 co-section-heading">
                              <span>Conditions</span>
                            </h2>
                            <table role="grid" className="pf-v6-c-table">
                              <thead>
                                <tr>
                                  <th>Type</th>
                                  <th>Status</th>
                                  <th>Updated</th>
                                  <th>Reason</th>
                                  <th>Message</th>
                                </tr>
                              </thead>
                              <tbody>
                                {status.conditions.map((condition: any, index: number) => (
                                  <tr key={index}>
                                    <td>{condition.type}</td>
                                    <td>
                                      <Badge isRead color={condition.status === 'True' ? 'green' : 'grey'}>
                                        {condition.status}
                                      </Badge>
                                    </td>
                                    <td>
                                      <Timestamp timestamp={condition.lastTransitionTime} />
                                    </td>
                                    <td>{condition.reason || ''}</td>
                                    <td>{condition.message || ''}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
