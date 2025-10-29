import * as React from 'react';
import classNames from 'classnames';

import { OwnerReferences } from '@gitops/utils/components/OwnerReferences/owner-references';
import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import {
  getSelectorSearchURL,
  kindForReference,
  useObjectModifyPermissions,
} from '@gitops/utils/utils';
import {
  K8sModel,
  K8sResourceKind,
  K8sResourceKindReference,
  ResourceLink,
  Timestamp,
  useAnnotationsModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Flex,
  FlexItem,
  LabelGroup,
  Popover,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { Label as PfLabel } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';

type DetailsDescriptionGroupProps = {
  title: string;
  help: string;
};

export const DetailsDescriptionGroup = (
  props: React.PropsWithChildren<DetailsDescriptionGroupProps>,
) => {
  return (
    <DescriptionListGroup className="pf-c-description-list__group">
      <DescriptionListTermHelpText className="pf-c-description-list__term">
        <Popover headerContent={<div>{props.title}</div>} bodyContent={<div>{props.help}</div>}>
          <DescriptionListTermHelpTextButton>{props.title}</DescriptionListTermHelpTextButton>
        </Popover>
      </DescriptionListTermHelpText>
      <DescriptionListDescription>{props.children}</DescriptionListDescription>
    </DescriptionListGroup>
  );
};

type LabelProps = {
  kind: K8sResourceKindReference;
  name: string;
  value: string;
  expand: boolean;
};

const LabelL: React.SFC<LabelProps> = ({ kind, name, value, expand }) => {
  const selector = value ? `${name}=${value}` : name;
  const href = getSelectorSearchURL('', kind, selector);
  const kindOf = `co-m-${kindForReference(kind.toLowerCase())}`;
  const klass = classNames(kindOf, { 'co-m-expand': expand }, 'co-label');
  return (
    <>
      <PfLabel className={klass} color={'blue'} href={href}>
        <span className="co-label__key" data-test="label-key">
          {name}
        </span>
        {value && <span className="co-label__eq">=</span>}
        {value && <span className="co-label__value">{value}</span>}
      </PfLabel>
    </>
  );
};

type MetadataLabelsProps = {
  kind: K8sResourceKindReference;
  labels?: { [key: string]: string };
};

const MetadataLabels: React.FC<MetadataLabelsProps> = ({ kind, labels }) => {
  const { t } = useGitOpsTranslation();
  return labels && Object.keys(labels).length > 0 ? (
    <LabelGroup numLabels={10} className="co-label-group metadata-labels-group">
      {Object.keys(labels || {})?.map((key) => {
        return (
          <LabelL key={key} kind={kind} name={key} value={labels[key]} expand={true}>
            {labels[key] ? `${key}=${labels[key]}` : key}
          </LabelL>
        );
      })}
    </LabelGroup>
  ) : (
    <span className="metadata-labels-no-labels">{t('No labels')}</span>
  );
};

export const BaseDetailsSummary: React.FC<BaseDetailsSummaryProps> = ({ obj, model, nameLink }) => {
  const { t } = useGitOpsTranslation();
  const [canPatch, canUpdate] = useObjectModifyPermissions(obj, model);
  const launchLabelsModal = useLabelsModal(obj);
  const launchAnnotationsModal = useAnnotationsModal(obj);

  return (
    <>
      <DescriptionList className="pf-c-description-list">
        <DescriptionListGroup className="pf-c-description-list__group">
          <DescriptionListTermHelpText className="pf-c-description-list__term">
            <Popover
              headerContent={<div>{t('Name')}</div>}
              bodyContent={<div>{t('Name must be unique within a namespace.')}</div>}
            >
              <DescriptionListTermHelpTextButton>{t('Name')}</DescriptionListTermHelpTextButton>
            </Popover>
          </DescriptionListTermHelpText>
          <DescriptionListDescription>
            <Flex alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>{obj?.metadata?.name}</FlexItem>
              {nameLink && <FlexItem>{nameLink}</FlexItem>}
            </Flex>
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DetailsDescriptionGroup
          title={t('Namespace')}
          help={t('Namespace defines the space within which each name must be unique.')}
        >
          <ResourceLink kind="Namespace" name={obj?.metadata?.namespace} />
        </DetailsDescriptionGroup>
        <DescriptionListGroup className="pf-c-description-list__group">
          <Split>
            <SplitItem isFilled>
              <DescriptionListTermHelpText className="pf-c-description-list__term">
                <Popover
                  headerContent={<div>{t('Labels')}</div>}
                  bodyContent={
                    <div>
                      {t(
                        'Map of string keys and values that can be used to organize and categorize (scope and select) objects.',
                      )}
                    </div>
                  }
                >
                  <DescriptionListTermHelpTextButton>
                    {t('Labels')}
                  </DescriptionListTermHelpTextButton>
                </Popover>
              </DescriptionListTermHelpText>
            </SplitItem>
            <SplitItem>
              <Button
                variant="link"
                isInline
                isDisabled={!canPatch}
                icon={<PencilAltIcon />}
                iconPosition={'right'}
                onClick={launchLabelsModal}
              >
                {t(' Edit')}
              </Button>
            </SplitItem>
          </Split>
          <DescriptionListDescription
            className={classNames('valueClassName', {
              'co-editable-label-group': canPatch || canUpdate,
            })}
          >
            <MetadataLabels
              kind={model.apiGroup + '~' + model.apiVersion + '~' + model.kind}
              labels={obj?.metadata?.labels}
            />
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DescriptionListGroup className="pf-c-description-list__group">
          <DescriptionListTermHelpText className="pf-c-description-list__term">
            <Popover
              headerContent={<div>{t('Annotations')}</div>}
              bodyContent={
                <div>
                  {t(
                    'Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects.',
                  )}
                </div>
              }
            >
              <DescriptionListTermHelpTextButton>
                {t('Annotations')}
              </DescriptionListTermHelpTextButton>
            </Popover>
          </DescriptionListTermHelpText>
          <DescriptionListDescription>
            <div>
              <Button
                variant="link"
                isInline
                isDisabled={!canPatch}
                icon={<PencilAltIcon />}
                iconPosition={'right'}
                onClick={launchAnnotationsModal}
              >
                {(obj.metadata?.annotations ? Object.keys(obj.metadata.annotations).length : 0) +
                  t(' Annotations')}
              </Button>
            </div>
          </DescriptionListDescription>
        </DescriptionListGroup>

        <DetailsDescriptionGroup
          title={t('Created at')}
          help={t(
            'Time is a wrapper around time. Time which supports correct marshaling to YAML and JSON.',
          )}
        >
          <Timestamp timestamp={obj?.metadata?.creationTimestamp} />
        </DetailsDescriptionGroup>
        <DetailsDescriptionGroup
          title={t('Owner')}
          help={t(
            'Owner references link this resource to its parent object. For example, Applications generated by an ApplicationSet will have that ApplicationSet as their owner. This relationship enables proper resource lifecycle management and garbage collection.',
          )}
        >
          <OwnerReferences resource={obj} />
        </DetailsDescriptionGroup>
      </DescriptionList>
    </>
  );
};

export type BaseDetailsSummaryProps = {
  obj: K8sResourceKind;
  model: K8sModel;
  nameLink?: React.ReactNode;
};

export default BaseDetailsSummary;
