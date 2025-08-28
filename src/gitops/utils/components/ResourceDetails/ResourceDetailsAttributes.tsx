import * as React from 'react';
import { 
  DescriptionList, 
  DescriptionListGroup, 
  DescriptionListDescription,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  LabelGroup, 
  Label, 
  Badge,
  Popover
} from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { ResourceLink, Timestamp, useAccessReview } from '@openshift-console/dynamic-plugin-sdk';
import { useLabelsModal, useAnnotationsModal } from '@openshift-console/dynamic-plugin-sdk';
import * as _ from 'lodash';

interface ResourceDetailsAttributesProps {
  metadata: {
    name?: string;
    namespace?: string;
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
    creationTimestamp?: string;
    ownerReferences?: Array<{
      name: string;
      kind: string;
      apiVersion: string;
    }>;
  };
  resource: any; // The full resource object for modal hooks
  showOwner?: boolean;
  showStatus?: boolean;
  showGeneratedApps?: boolean;
  showGenerators?: boolean;
  showAppProject?: boolean;
  showRepository?: boolean;
}

const ResourceDetailsAttributes: React.FC<ResourceDetailsAttributesProps> = ({
  metadata,
  resource,
  showOwner = true,
  showStatus = false,
  showGeneratedApps = false,
  showGenerators = false,
  showAppProject = false,
  showRepository = false,
}) => {
    const launchLabelsModal = useLabelsModal(resource);
  const launchAnnotationsModal = useAnnotationsModal(resource);

  // Check if user has permission to update the resource
  // This enables/disables the Labels and Annotations edit buttons based on user permissions
  const [canUpdate] = useAccessReview({
    group: 'argoproj.io',
    verb: 'patch',
    resource: 'applicationsets',
    name: metadata.name,
    namespace: metadata.namespace,
  });

  const labelItems = metadata.labels || {};
  const annotationItems = metadata.annotations || {};
  const countAnnotations = Object.keys(annotationItems).length;

  return (
    <DescriptionList data-test-id="resource-summary">
      {/* Name */}
      <DescriptionListGroup>
        <DescriptionListTermHelpText>
          <Popover 
            headerContent={<div>Name</div>} 
            bodyContent={
              <div>
                <div>
                  Name must be unique within a namespace. Is required when creating resources, although some resources may allow a client to request the generation of an appropriate name automatically. Name is primarily intended for creation idempotence and configuration definition. Cannot be updated.
                </div>
                <div style={{ marginTop: '8px' }}>
                  More info: <a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names" target="_blank" rel="noopener noreferrer">https://kubernetes.io/docs/concepts/overview/working-with-objects/names#names</a>
                </div>
                <div style={{ fontSize: '14px', color: '#ffffff', borderTop: '1px solid #4f5255', paddingTop: '8px', marginTop: '8px', fontWeight: '500' }}>
                  Application {'>'} metadata {'>'} name
                </div>
              </div>
            }
          >
            <DescriptionListTermHelpTextButton data-test-selector="details-item-label_Name">
              Name
            </DescriptionListTermHelpTextButton>
          </Popover>
        </DescriptionListTermHelpText>
        <DescriptionListDescription>
          {metadata.name}
        </DescriptionListDescription>
      </DescriptionListGroup>

      {/* Namespace */}
      <DescriptionListGroup>
        <DescriptionListTermHelpText>
          <Popover 
            headerContent={<div>Namespace</div>} 
            bodyContent={
              <div>
                <div>
                  Namespace defines the space within which each name must be unique. An empty namespace is equivalent to the "default" namespace, but "default" is the canonical representation. Not all objects are required to be scoped to a namespace - the value of this field for those objects will be empty.
                </div>
                <div style={{ marginTop: '8px' }}>
                  Must be a DNS_LABEL. Cannot be updated. More info: <a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces" target="_blank" rel="noopener noreferrer">https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces</a>
                </div>
                <div style={{ fontSize: '14px', color: '#ffffff', borderTop: '1px solid #4f5255', paddingTop: '8px', marginTop: '8px', fontWeight: '500' }}>
                  Application {'>'} metadata {'>'} namespace
                </div>
              </div>
            }
          >
            <DescriptionListTermHelpTextButton data-test-selector="details-item-label_Namespace">
              Namespace
            </DescriptionListTermHelpTextButton>
          </Popover>
        </DescriptionListTermHelpText>
        <DescriptionListDescription>
          <ResourceLink kind="Namespace" name={metadata.namespace} />
        </DescriptionListDescription>
      </DescriptionListGroup>

      {/* Labels */}
      <DescriptionListGroup>
        <DescriptionListTermHelpText>
          <Popover 
            headerContent={<div>Labels</div>} 
            bodyContent={
              <div>
                <div>
                  Map of string keys and values that can be used to organize and categorize (scope and select) objects. May match selectors of replication controllers and services.
                </div>
                <div style={{ marginTop: '8px' }}>
                  More info: <a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/labels" target="_blank" rel="noopener noreferrer">https://kubernetes.io/docs/concepts/overview/working-with-objects/labels</a>
                </div>
                <div style={{ fontSize: '14px', color: '#ffffff', borderTop: '1px solid #4f5255', paddingTop: '8px', marginTop: '8px', fontWeight: '500' }}>
                  Application {'>'} metadata {'>'} labels
                </div>
              </div>
            }
          >
            <DescriptionListTermHelpTextButton data-test-selector="details-item-label_Labels">
              Labels
            </DescriptionListTermHelpTextButton>
          </Popover>
        </DescriptionListTermHelpText>
        <DescriptionListDescription>
          <div style={{ display: 'inline-block' }}>
            {canUpdate && (
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
            )}
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
        </DescriptionListDescription>
      </DescriptionListGroup>

      {/* Annotations */}
      <DescriptionListGroup>
        <DescriptionListTermHelpText>
          <Popover 
            headerContent={<div>Annotations</div>} 
            bodyContent={
              <div>
                <div>
                  Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects.
                </div>
                <div style={{ marginTop: '8px' }}>
                  More info: <a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations" target="_blank" rel="noopener noreferrer">https://kubernetes.io/docs/concepts/overview/working-with-objects/annotations</a>
                </div>
                <div style={{ fontSize: '14px', color: '#ffffff', borderTop: '1px solid #4f5255', paddingTop: '8px', marginTop: '8px', fontWeight: '500' }}>
                  Application {'>'} metadata {'>'} annotations
                </div>
              </div>
            }
          >
            <DescriptionListTermHelpTextButton data-test-selector="details-item-label_Annotations">
              Annotations
            </DescriptionListTermHelpTextButton>
          </Popover>
        </DescriptionListTermHelpText>
        <DescriptionListDescription>
          <div style={{ display: 'inline-block' }}>
            {canUpdate && (
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
            )}
          </div>
        </DescriptionListDescription>
      </DescriptionListGroup>

      {/* Created at */}
      <DescriptionListGroup>
        <DescriptionListTermHelpText>
          <Popover 
            headerContent={<div>Created at</div>} 
            bodyContent={
              <div>
                <div>
                  CreationTimestamp is a timestamp representing the server time when this object was created. It is not guaranteed to be set in happens-before order across separate operations. Clients may not set this value. It is represented in RFC3339 form and is in UTC.
                </div>
                <div style={{ marginTop: '8px' }}>
                  Populated by the system. Read-only. Null for lists.
                </div>
                <div style={{ marginTop: '8px' }}>
                  More info: <a href="https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata" target="_blank" rel="noopener noreferrer">https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#metadata</a>
                </div>
                <div style={{ fontSize: '14px', color: '#ffffff', borderTop: '1px solid #4f5255', paddingTop: '8px', marginTop: '8px', fontWeight: '500' }}>
                  Application {'>'} metadata {'>'} creationTimestamp
                </div>
              </div>
            }
          >
            <DescriptionListTermHelpTextButton data-test-selector="details-item-label_Created">
              Created at
            </DescriptionListTermHelpTextButton>
          </Popover>
        </DescriptionListTermHelpText>
        <DescriptionListDescription>
          <Timestamp timestamp={metadata.creationTimestamp} />
        </DescriptionListDescription>
      </DescriptionListGroup>

      {/* Owner - conditional */}
      {showOwner && (
        <DescriptionListGroup>
          <DescriptionListTermHelpText>
            <Popover 
              headerContent={<div>Owner</div>} 
              bodyContent={
                <div>
                  <div>
                    List of objects depended by this object. If ALL objects in the list have been deleted, this object will be garbage collected. If this object is managed by a controller, then an entry in this list will point to this controller, with the controller field set to true. There cannot be more than one managing controller.
                  </div>
                  <div style={{ fontSize: '14px', color: '#ffffff', borderTop: '1px solid #4f5255', paddingTop: '8px', marginTop: '8px', fontWeight: '500' }}>
                    Application {'>'} metadata {'>'} ownerReferences
                  </div>
                </div>
              }
            >
              <DescriptionListTermHelpTextButton data-test-selector="details-item-label_Owner">
                Owner
              </DescriptionListTermHelpTextButton>
            </Popover>
          </DescriptionListTermHelpText>
          <DescriptionListDescription>
            {metadata.ownerReferences && metadata.ownerReferences.length > 0 ? (
              <ResourceLink 
                kind={metadata.ownerReferences[0].kind} 
                name={metadata.ownerReferences[0].name} 
              />
            ) : (
              'No owner'
            )}
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}

      {/* Status - conditional */}
      {showStatus && (
        <DescriptionListGroup>
          <DescriptionListTermHelpText>
            <Popover 
              headerContent={<div>Status</div>} 
              bodyContent={
                <div>
                  <div>
                    Current status of the resource
                  </div>
                  <div style={{ fontSize: '14px', color: '#ffffff', borderTop: '1px solid #4f5255', paddingTop: '8px', marginTop: '8px', fontWeight: '500' }}>
                    Application {'>'} status
                  </div>
                </div>
              }
            >
              <DescriptionListTermHelpTextButton data-test-selector="details-item-label_Status">
                Status
              </DescriptionListTermHelpTextButton>
            </Popover>
          </DescriptionListTermHelpText>
          <DescriptionListDescription>
            <Badge isRead color="green">Healthy</Badge>
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}

      {/* Generated Apps - conditional */}
      {showGeneratedApps && (
        <DescriptionListGroup>
          <DescriptionListTermHelpText>
            <Popover 
              headerContent={<div>Generated Apps</div>} 
              bodyContent={
                <div>
                  <div>
                    Number of applications generated by this ApplicationSet
                  </div>
                  <div style={{ fontSize: '14px', color: '#ffffff', borderTop: '1px solid #4f5255', paddingTop: '8px', marginTop: '8px', fontWeight: '500' }}>
                    ApplicationSet {'>'} status {'>'} applications
                  </div>
                </div>
              }
            >
              <DescriptionListTermHelpTextButton data-test-selector="details-item-label_GeneratedApps">
                Generated Apps
              </DescriptionListTermHelpTextButton>
            </Popover>
          </DescriptionListTermHelpText>
          <DescriptionListDescription>
            <Badge isRead color="blue">3 applications</Badge>
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}

      {/* Generators - conditional */}
      {showGenerators && (
        <DescriptionListGroup>
          <DescriptionListTermHelpText>
            <Popover 
              headerContent={<div>Generators</div>} 
              bodyContent={
                <div>
                  <div>
                    Number of generators configured in this ApplicationSet
                  </div>
                  <div style={{ fontSize: '14px', color: '#ffffff', borderTop: '1px solid #4f5255', paddingTop: '8px', marginTop: '8px', fontWeight: '500' }}>
                    ApplicationSet {'>'} spec {'>'} generators
                  </div>
                </div>
              }
            >
              <DescriptionListTermHelpTextButton data-test-selector="details-item-label_Generators">
                Generators
              </DescriptionListTermHelpTextButton>
            </Popover>
          </DescriptionListTermHelpText>
          <DescriptionListDescription>
            <Badge isRead color="grey">1 generators</Badge>
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}

      {/* App Project - conditional */}
      {showAppProject && (
        <DescriptionListGroup>
          <DescriptionListTermHelpText>
            <Popover 
              headerContent={<div>App Project</div>} 
              bodyContent={
                <div>
                  <div>
                    Argo CD project that this ApplicationSet belongs to
                  </div>
                  <div style={{ fontSize: '14px', color: '#ffffff', borderTop: '1px solid #4f5255', paddingTop: '8px', marginTop: '8px', fontWeight: '500' }}>
                    ApplicationSet {'>'} spec {'>'} template {'>'} spec {'>'} project
                  </div>
                </div>
              }
            >
              <DescriptionListTermHelpTextButton data-test-selector="details-item-label_AppProject">
                App Project
              </DescriptionListTermHelpTextButton>
            </Popover>
          </DescriptionListTermHelpText>
          <DescriptionListDescription>
            <Badge isRead color="blue" style={{ backgroundColor: '#73bcf7', color: '#003a70' }}>AP</Badge> default
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}

      {/* Repository - conditional */}
      {showRepository && (
        <DescriptionListGroup>
          <DescriptionListTermHelpText>
            <Popover 
              headerContent={<div>Repository</div>} 
              bodyContent={
                <div>
                  <div>
                    Git repository URL where the ApplicationSet configuration is stored
                  </div>
                  <div style={{ fontSize: '14px', color: '#ffffff', borderTop: '1px solid #4f5255', paddingTop: '8px', marginTop: '8px', fontWeight: '500' }}>
                    ApplicationSet {'>'} spec {'>'} template {'>'} spec {'>'} source {'>'} repoURL
                  </div>
                </div>
              }
            >
              <DescriptionListTermHelpTextButton data-test-selector="details-item-label_Repository">
                Repository
              </DescriptionListTermHelpTextButton>
            </Popover>
          </DescriptionListTermHelpText>
          <DescriptionListDescription>
            <a href="https://github.com/aal/309/argocd-test-nested.git" target="_blank" rel="noopener noreferrer">
              https://github.com/aal/309/argocd-test-nested.git
            </a>
          </DescriptionListDescription>
        </DescriptionListGroup>
      )}
    </DescriptionList>
  );
};

export default ResourceDetailsAttributes;
