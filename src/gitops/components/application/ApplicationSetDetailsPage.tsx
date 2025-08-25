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
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
  Tabs,
  Tab,
  TabTitleText,
  Page,
  PageSection,
  Title,
  TitleSizes,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonVariant,
  Flex,
  FlexItem,
  Dropdown,
  DropdownItem,
  MenuToggle
} from '@patternfly/react-core';
import { StarIcon, PencilAltIcon } from '@patternfly/react-icons';

// Helper to render status with icon
const Status = ({ conditions }: { conditions: any[] }) => {
  if (!conditions || conditions.length === 0) {
    return <span>Unknown</span>;
  }

  // Check for error conditions first
  const errorCondition = conditions.find(cond => cond.type === 'ErrorOccurred' && cond.status === 'True');
  if (errorCondition) {
    return <Badge isRead color="red">Error</Badge>;
  }

  // Check for ready/healthy conditions
  const readyCondition = conditions.find(cond => cond.type === 'ParametersGenerated' && cond.status === 'True');
  if (readyCondition) {
    return <Badge isRead color="green">Ready</Badge>;
  }

  // Default to first condition type
  return <span>{conditions[0]?.type || 'Unknown'}</span>;
};

const ApplicationSetDetailsPage: React.FC = () => {
  const { name, ns } = useParams<{ name: string; ns: string }>();
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isActionsOpen, setIsActionsOpen] = React.useState(false);
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

  if (loadError) return <div>Error loading ApplicationSet details.</div>;
  if (!loaded || !appSet) return <Spinner />;

  const metadata = appSet.metadata || {};
  const spec = (appSet.spec || {}) as any;
  const status = appSet.status || {};

  const handleTabClick = (event: React.MouseEvent<HTMLElement, MouseEvent>, tabIndex: string | number) => {
    setActiveTabKey(tabIndex);
  };

  const onActionsToggle = () => {
    setIsActionsOpen(!isActionsOpen);
  };

  const onActionsSelect = () => {
    setIsActionsOpen(false);
  };

  const actionsDropdownItems = [
    <DropdownItem key="edit" icon={<PencilAltIcon />}>
      Edit ApplicationSet
    </DropdownItem>,
    <DropdownItem key="delete">
      Delete ApplicationSet
    </DropdownItem>
  ];

    return (
    <Page>
      {/* Breadcrumb Navigation */}
      <PageSection>
        <Breadcrumb>
          <BreadcrumbItem to="/k8s/all-namespaces/applicationsets.argoproj.io~v1alpha1~ApplicationSet">
            ApplicationSets
          </BreadcrumbItem>
          <BreadcrumbItem isActive>
            {name}
          </BreadcrumbItem>
        </Breadcrumb>
      </PageSection>

      {/* Header Section */}
      <PageSection>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '16px',
          padding: '16px 0',
          borderBottom: '1px solid var(--pf-v5-global--BorderColor--100)'
        }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            backgroundColor: '#E9654B', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            AS
          </div>
          <Title headingLevel="h1" size={TitleSizes['2xl']} style={{ margin: 0 }}>
            {metadata.name}
          </Title>
          <Badge isRead>Dev preview</Badge>
          <div style={{ marginLeft: 'auto' }}>
            <Flex>
              <FlexItem>
                <Button
                  variant={ButtonVariant.plain}
                  onClick={() => setIsFavorite(!isFavorite)}
                  aria-label="Toggle favorite"
                >
                  <StarIcon />
                </Button>
              </FlexItem>
              <FlexItem>
                <Dropdown
                  onSelect={onActionsSelect}
                  toggle={(toggleRef) => (
                    <MenuToggle
                      ref={toggleRef}
                      onClick={onActionsToggle}
                      isExpanded={isActionsOpen}
                      variant="plain"
                      aria-label="Actions"
                    >
                      Actions
                    </MenuToggle>
                  )}
                  isOpen={isActionsOpen}
                  onOpenChange={(isOpen) => setIsActionsOpen(isOpen)}
                >
                  {actionsDropdownItems}
                </Dropdown>
              </FlexItem>
            </Flex>
          </div>
        </div>
        <p style={{ margin: '0 0 24px 0', color: 'var(--pf-v5-global--Color--200)' }}>
          Argo CD ApplicationSet
        </p>
      </PageSection>

      {/* Tabs Section */}
      <PageSection>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
            <PageSection>
              <Card>
                <CardHeader>
                  <CardTitle>ApplicationSet details</CardTitle>
                </CardHeader>
                <CardBody>
                  <DescriptionList isHorizontal>
                    {/* Left Column - Basic Info */}
                    <DescriptionListGroup>
                      <DescriptionListTerm>Name</DescriptionListTerm>
                      <DescriptionListDescription>{metadata.name}</DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Namespace</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Badge isRead color="green">NS</Badge>
                        {' '}
                        <ResourceLink kind="Namespace" name={metadata.namespace} />
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Labels</DescriptionListTerm>
                      <DescriptionListDescription>
                        {metadata.labels ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <LabelGroup>
                              {Object.entries(metadata.labels).map(([key, value]) => (
                                <Label key={key} color="grey">
                                  {key}={value}
                                </Label>
                              ))}
                            </LabelGroup>
                            <Button variant={ButtonVariant.link} icon={<PencilAltIcon />}>
                              Edit
                            </Button>
                          </div>
                        ) : (
                          'No labels'
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Annotations</DescriptionListTerm>
                      <DescriptionListDescription>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {metadata.annotations ? `${Object.keys(metadata.annotations).length} annotation${Object.keys(metadata.annotations).length !== 1 ? 's' : ''}` : 'No annotations'}
                          <Button variant={ButtonVariant.link} icon={<PencilAltIcon />}>
                            Edit
                          </Button>
                        </div>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Created at</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Timestamp timestamp={metadata.creationTimestamp} />
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Owner</DescriptionListTerm>
                      <DescriptionListDescription>
                        {metadata.ownerReferences && metadata.ownerReferences.length > 0 ? (
                          metadata.ownerReferences.map((owner: any, idx: number) => (
                            <div key={idx}>
                              <ResourceLink 
                                kind={owner.kind} 
                                name={owner.name} 
                                namespace={owner.namespace || metadata.namespace}
                              />
                            </div>
                          ))
                        ) : (
                          'No owner'
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    
                    {/* Right Column - Status & Configuration */}
                    <DescriptionListGroup>
                      <DescriptionListTerm>Status</DescriptionListTerm>
                      <DescriptionListDescription>
                        <Status conditions={status?.conditions || []} />
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Generated Apps</DescriptionListTerm>
                      <DescriptionListDescription>
                        {status.conditions && status.conditions.find(c => c.type === 'ApplicationsGenerated') ? 
                          <Badge isRead color="blue">{status.conditions.find(c => c.type === 'ApplicationsGenerated')?.message || 'Applications generated'}</Badge> :
                          'No generated applications'
                        }
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Sync Status</DescriptionListTerm>
                      <DescriptionListDescription>
                        {status.conditions && status.conditions.find(c => c.type === 'ResourcesUpToDate') ? 
                          <Badge isRead color="green">Up to Date</Badge> :
                          <Badge isRead color="orange">Unknown</Badge>
                        }
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>App Project</DescriptionListTerm>
                      <DescriptionListDescription>
                        {spec.template?.spec?.project ? (
                          <ResourceLink 
                            kind="AppProject" 
                            name={spec.template.spec.project} 
                            namespace={metadata.namespace}
                          />
                        ) : (
                          'default'
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Target Revision</DescriptionListTerm>
                      <DescriptionListDescription>
                        {spec.template?.spec?.source?.targetRevision || 'HEAD'}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Repository</DescriptionListTerm>
                      <DescriptionListDescription>
                        {spec.template?.spec?.source?.repoURL ? (
                          <a href={spec.template.spec.source.repoURL} target="_blank" rel="noopener noreferrer">
                            {spec.template.spec.source.repoURL}
                          </a>
                        ) : (
                          'Not specified'
                        )}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Path</DescriptionListTerm>
                      <DescriptionListDescription>
                        {spec.template?.spec?.source?.path || '/'}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
                </CardBody>
              </Card>

              {/* Generators Section */}
              <Card style={{ marginTop: '24px' }}>
                <CardHeader>
                  <CardTitle>Generators ({spec.generators ? spec.generators.length : 0})</CardTitle>
                </CardHeader>
                <CardBody>
                  {spec.generators && spec.generators.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {spec.generators.map((generator: any, idx: number) => (
                        <Card key={idx} style={{ border: '1px solid var(--pf-v5-global--BorderColor--100)' }}>
                          <CardBody>
                            {generator.git && (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                  <Badge isRead color="blue">Git</Badge>
                                  <strong>Git Directory Generator</strong>
                                </div>
                                <DescriptionList isHorizontal isCompact>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>Repository</DescriptionListTerm>
                                    <DescriptionListDescription>
                                      <a href={generator.git.repoURL} target="_blank" rel="noopener noreferrer">
                                        {generator.git.repoURL}
                                      </a>
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>Revision</DescriptionListTerm>
                                    <DescriptionListDescription>{generator.git.revision || 'HEAD'}</DescriptionListDescription>
                                  </DescriptionListGroup>
                                  {generator.git.directories && (
                                    <DescriptionListGroup>
                                      <DescriptionListTerm>Directories</DescriptionListTerm>
                                      <DescriptionListDescription>
                                        {generator.git.directories.map((dir: any, dirIdx: number) => (
                                          <Badge key={dirIdx} isRead style={{ marginRight: '4px' }}>
                                            {dir.path}
                                          </Badge>
                                        ))}
                                      </DescriptionListDescription>
                                    </DescriptionListGroup>
                                  )}
                                </DescriptionList>
                              </div>
                            )}
                            {generator.cluster && (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                  <Badge isRead color="green">Cluster</Badge>
                                  <strong>Cluster Generator</strong>
                                </div>
                                <DescriptionList isHorizontal isCompact>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>Selector</DescriptionListTerm>
                                    <DescriptionListDescription>
                                      {generator.cluster.selector ? (
                                        <pre style={{ fontSize: '12px', margin: 0 }}>
                                          {JSON.stringify(generator.cluster.selector, null, 2)}
                                        </pre>
                                      ) : (
                                        'All clusters'
                                      )}
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                </DescriptionList>
                              </div>
                            )}
                            {generator.list && (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                  <Badge isRead color="purple">List</Badge>
                                  <strong>List Generator</strong>
                                </div>
                                <DescriptionList isHorizontal isCompact>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>Elements</DescriptionListTerm>
                                    <DescriptionListDescription>
                                      {generator.list.elements ? `${generator.list.elements.length} item${generator.list.elements.length !== 1 ? 's' : ''}` : 'No elements'}
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                </DescriptionList>
                              </div>
                            )}
                            {generator.matrix && (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                  <Badge isRead color="orange">Matrix</Badge>
                                  <strong>Matrix Generator</strong>
                                </div>
                                <DescriptionList isHorizontal isCompact>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>Generators</DescriptionListTerm>
                                    <DescriptionListDescription>
                                      {generator.matrix.generators ? `${generator.matrix.generators.length} nested generator${generator.matrix.generators.length !== 1 ? 's' : ''}` : 'No nested generators'}
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                </DescriptionList>
                              </div>
                            )}
                            {generator.merge && (
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                  <Badge isRead color="cyan">Merge</Badge>
                                  <strong>Merge Generator</strong>
                                </div>
                                <DescriptionList isHorizontal isCompact>
                                  <DescriptionListGroup>
                                    <DescriptionListTerm>Generators</DescriptionListTerm>
                                    <DescriptionListDescription>
                                      {generator.merge.generators ? `${generator.merge.generators.length} generator${generator.merge.generators.length !== 1 ? 's' : ''}` : 'No generators'}
                                    </DescriptionListDescription>
                                  </DescriptionListGroup>
                                </DescriptionList>
                              </div>
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px', color: 'var(--pf-v5-global--Color--200)' }}>
                      No generators configured
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Template Section */}
              {spec.template && (
                <Card style={{ marginTop: '24px' }}>
                  <CardHeader>
                    <CardTitle>Application Template</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <DescriptionList isHorizontal>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Destination Server</DescriptionListTerm>
                        <DescriptionListDescription>
                          {spec.template.spec?.destination?.server || 'https://kubernetes.default.svc'}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Destination Namespace</DescriptionListTerm>
                        <DescriptionListDescription>
                          {spec.template.spec?.destination?.namespace || 'default'}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      <DescriptionListGroup>
                        <DescriptionListTerm>Sync Policy</DescriptionListTerm>
                        <DescriptionListDescription>
                          {spec.template.spec?.syncPolicy?.automated ? (
                            <Badge isRead color="green">Automated</Badge>
                          ) : (
                            <Badge isRead color="orange">Manual</Badge>
                          )}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                      {spec.template.spec?.syncPolicy?.automated && (
                        <>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Auto Prune</DescriptionListTerm>
                            <DescriptionListDescription>
                              {spec.template.spec.syncPolicy.automated.prune ? 
                                <Badge isRead color="green">Enabled</Badge> : 
                                <Badge isRead color="red">Disabled</Badge>
                              }
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                          <DescriptionListGroup>
                            <DescriptionListTerm>Self Heal</DescriptionListTerm>
                            <DescriptionListDescription>
                              {spec.template.spec.syncPolicy.automated.selfHeal ? 
                                <Badge isRead color="green">Enabled</Badge> : 
                                <Badge isRead color="red">Disabled</Badge>
                              }
                            </DescriptionListDescription>
                          </DescriptionListGroup>
                        </>
                      )}
                    </DescriptionList>
                  </CardBody>
                </Card>
              )}
            </PageSection>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>YAML</TabTitleText>}>
            <PageSection>
              <Card>
                <CardBody>
                  <pre style={{ 
                    whiteSpace: 'pre-wrap', 
                    fontSize: '12px',
                    backgroundColor: 'var(--pf-v5-global--BackgroundColor--100)',
                    padding: '16px',
                    borderRadius: '4px',
                    border: '1px solid var(--pf-v5-global--BorderColor--100)'
                  }}>
                    {JSON.stringify(appSet, null, 2)}
                  </pre>
                </CardBody>
              </Card>
            </PageSection>
          </Tab>
        </Tabs>
      </PageSection>
    </Page>
  );
};

export default ApplicationSetDetailsPage;
