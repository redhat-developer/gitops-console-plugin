import * as React from 'react';
import { useK8sWatchResource, Timestamp, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { useParams } from 'react-router-dom-v5-compat';
import { ApplicationSetKind } from '../../models/ApplicationSetModel';
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
  Title,
  TitleSizes,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonVariant
} from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import * as _ from 'lodash';
import DevPreviewBadge from '../../../components/import/badges/DevPreviewBadge';
import ActionsDropdown from '../../utils/components/ActionDropDown/ActionDropDown';
import { useApplicationSetActionsProvider } from '../../hooks/useApplicationSetActionsProvider';

const ApplicationSetDetailsPage: React.FC = () => {
  const { name, ns } = useParams<{ name: string; ns: string }>();
  const [activeTabKey, setActiveTabKey] = React.useState<string | number>(0);
  const [isFavorite, setIsFavorite] = React.useState<boolean>(false);
  
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
  const annotationItems = metadata.annotations || {};

  return (
    <div className="pf-v6-c-page__main-section pf-m-no-padding pf-m-fill pf-v6-c-page__main-section--no-gap pf-v6-u-flex-shrink-1">
      {/* Breadcrumb Navigation */}
      <div data-test="page-heading" className="co-page-heading">
        <div className="co-page-heading__left">
          <Breadcrumb>
            <BreadcrumbItem to="/k8s/all-namespaces/applicationsets.argoproj.io~v1alpha1~ApplicationSet">
              ApplicationSets
            </BreadcrumbItem>
            <BreadcrumbItem isActive>
              {name}
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="pf-v6-l-flex pf-m-column pf-m-nowrap pf-m-row-gap-none co-m-page__body co-m-argoproj.io~v1alpha1~ApplicationSet">
        {/* Header Section */}
        <div className="co-m-pane__heading">
          <div className="co-m-pane__heading-basics">
            <div className="co-m-pane__heading-icon">
              <div className="co-m-pane__heading-icon-bg">AS</div>
            </div>
            <div className="co-m-pane__heading-title">
              <Title headingLevel="h1" size={TitleSizes['2xl']}>
                {metadata.name}
              </Title>
            </div>
            <div className="co-m-pane__heading-badges">
              <DevPreviewBadge />
            </div>
          </div>
          <div className="co-m-pane__heading-actions">
            <button
              type="button"
              className="btn btn-link"
              aria-label="Toggle favorite"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <i className={isFavorite ? "fa fa-star" : "fa fa-star-o"}></i>
            </button>
            <ActionsDropdown
              actions={actions}
              id="gitops-applicationset-details-actions"
              isKebabToggle={false}
            />
          </div>
        </div>

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
                                      <div className="co-label-group-container">
                                        <LabelGroup>
                                          {Object.entries(labelItems).map(([key, value]) => (
                                            <Label key={key} color="grey">
                                              {key}={value}
                                            </Label>
                                          ))}
                                        </LabelGroup>
                                      </div>
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
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Annotations">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">Annotations</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {_.isEmpty(annotationItems) ? (
                                      <span className="text-muted">No annotations</span>
                                    ) : (
                                      <span>{Object.keys(annotationItems).length} annotation{Object.keys(annotationItems).length !== 1 ? 's' : ''}</span>
                                    )}
                                    <Button variant={ButtonVariant.link} icon={<PencilAltIcon />}>
                                      Edit
                                    </Button>
                                  </div>
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
                            <dt className="pf-v6-c-description-list__term" data-test-selector="details-item-label_Owner">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">Owner</div>
                              </div>
                            </dt>
                            <dd className="pf-v6-c-description-list__description">
                              <div className="pf-v6-l-split pf-v6-u-w-100">
                                <div className="pf-v6-l-split__item pf-m-fill">
                                  {metadata.ownerReferences && metadata.ownerReferences.length > 0 ? (
                                    metadata.ownerReferences.map((owner: any, idx: number) => (
                                      <div key={idx}>
                                        <ResourceLink kind={owner.kind} name={owner.name} namespace={owner.namespace || metadata.namespace} />
                                      </div>
                                    ))
                                  ) : (
                                    <span className="text-muted">No owner</span>
                                  )}
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
