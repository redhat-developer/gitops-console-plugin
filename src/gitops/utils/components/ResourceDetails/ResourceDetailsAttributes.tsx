import * as React from 'react';
import { DescriptionList, LabelGroup, Label, Badge } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { ResourceLink, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
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

  const labelItems = metadata.labels || {};
  const annotationItems = metadata.annotations || {};
  const countAnnotations = Object.keys(annotationItems).length;

  return (
    <DescriptionList data-test-id="resource-summary">
      {/* Name */}
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

      {/* Namespace */}
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

      {/* Labels */}
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

      {/* Annotations */}
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

            {/* Created at */}
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

      {/* Owner - conditional */}
      {showOwner && (
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
                  <ResourceLink 
                    kind={metadata.ownerReferences[0].kind} 
                    name={metadata.ownerReferences[0].name} 
                  />
                ) : (
                  'No owner'
                )}
              </div>
            </div>
          </dd>
        </div>
      )}

      {/* Status - conditional */}
      {showStatus && (
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
      )}

      {/* Generated Apps - conditional */}
      {showGeneratedApps && (
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
      )}

      {/* Generators - conditional */}
      {showGenerators && (
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
      )}

      {/* App Project - conditional */}
      {showAppProject && (
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
      )}

      {/* Repository - conditional */}
      {showRepository && (
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
      )}
    </DescriptionList>
  );
};

export default ResourceDetailsAttributes;
