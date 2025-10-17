import * as React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import * as _ from 'lodash';

import {
  DetailsTabSectionExtensionHook,
  GroupVersionKind,
  K8sResourceKind,
  K8sResourceKindReference,
  ResourceLink,
  useAccessReview,
  useAnnotationsModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';
import { getK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { getResource } from '@openshift-console/dynamic-plugin-sdk-internal';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Popover,
  Split,
  SplitItem,
  Title,
} from '@patternfly/react-core';
import { Label as PfLabel, LabelGroup as PfLabelGroup } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { GraphElement } from '@patternfly/react-topology';

import DevPreviewBadge from '../../../components/import/badges/DevPreviewBadge';
import { RolloutKind } from '../types';

export type LabelProps = {
  kind: K8sResourceKindReference;
  name: string;
  value: string;
  expand: boolean;
};

export const isGroupVersionKind = (ref: GroupVersionKind | string) => ref?.split('~').length === 3;

export const kindForReference = (ref: K8sResourceKindReference) =>
  isGroupVersionKind(ref) ? ref.split('~')[2] : ref;

export const Label: React.SFC<LabelProps> = ({ kind, name, value, expand }) => {
  const href = `/search?kind=${kind}&q=${value ? encodeURIComponent(`${name}=${value}`) : name}`;
  const kindOf = `co-m-${kindForReference(kind.toLowerCase())}`;
  const klass = classNames(kindOf, { 'co-m-expand': expand }, 'co-label');

  return (
    <>
      <PfLabel className={klass} href={href}>
        <span className="co-label__key" data-test="label-key">
          {name}
        </span>
        {value && <span className="co-label__eq">=</span>}
        {value && <span className="co-label__value">{value}</span>}
      </PfLabel>
    </>
  );
};

// From /console/frontend/public/components/utils/details-item.tsx
export const PropertyPath: React.FC<{ kind: string; path: string | string[] }> = ({
  kind,
  path,
}) => {
  const pathArray: string[] = _.toPath(path);
  return (
    <Breadcrumb>
      <BreadcrumbItem>{kind}</BreadcrumbItem>
      {pathArray.map((property, i) => {
        const isLast = i === pathArray.length - 1;
        return (
          <BreadcrumbItem key={i} isActive={isLast}>
            {property}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

type EditButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  testId?: string;
  children?: React.ReactNode;
};

const EditButton: React.FunctionComponent<EditButtonProps> = (props) => {
  return (
    <Button
      icon={<PencilAltIcon />}
      iconPosition="end"
      type="button"
      variant="link"
      isInline
      onClick={props.onClick}
      data-test={
        props.testId ? `${props.testId}-details-item__edit-button` : 'details-item__edit-button'
      }
    >
      {props.children}
    </Button>
  );
};

export type DetailsItemProps = {
  canEdit?: boolean;
  defaultValue?: React.ReactNode;
  description?: string;
  editAsGroup?: boolean;
  hideEmpty?: boolean;
  label: string;
  labelClassName?: string;
  obj?: K8sResourceKind;
  onEdit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  path?: string | string[];
  valueClassName?: string;
};

export const DetailsItem: React.FC<DetailsItemProps> = ({
  children,
  defaultValue = '-',
  description,
  editAsGroup,
  hideEmpty,
  label,
  labelClassName,
  obj,
  onEdit,
  canEdit = false,
  path,
  valueClassName,
}) => {
  const { t } = useTranslation();
  const model = getK8sModel(obj);
  const hide = hideEmpty && _.isEmpty(_.get(obj, path));
  const popoverContent: string = description; // ?? getPropertyDescription(model, path);
  const value: React.ReactNode = children || _.get(obj, path, defaultValue);
  const editable = onEdit && canEdit;
  return hide ? null : (
    <DescriptionListGroup>
      <DescriptionListTermHelpText
        data-test-selector={`details-item-label__${label}`}
        className={labelClassName}
      >
        <Split className="pf-v6-u-w-100">
          <SplitItem isFilled>
            {popoverContent || path ? (
              <Popover
                headerContent={label}
                {...(popoverContent && {
                  bodyContent: <div className="co-pre-line">{popoverContent}</div>,
                })}
                {...(path && { footerContent: <PropertyPath kind={model?.kind} path={path} /> })}
                maxWidth="30rem"
              >
                <DescriptionListTermHelpTextButton data-test={label}>
                  {label}
                </DescriptionListTermHelpTextButton>
              </Popover>
            ) : (
              label
            )}
          </SplitItem>

          {editable && editAsGroup && (
            <SplitItem>
              <EditButton testId={label} onClick={onEdit}>
                {t('public~Edit')}
              </EditButton>
            </SplitItem>
          )}
        </Split>
      </DescriptionListTermHelpText>
      <DescriptionListDescription
        className={classNames(valueClassName, {
          'co-editable-label-group': editable && editAsGroup && canEdit,
        })}
        data-test-selector={`details-item-value__${label}`}
      >
        {editable && !editAsGroup ? (
          <EditButton testId={label} onClick={onEdit}>
            {value}
          </EditButton>
        ) : (
          value
        )}
      </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

type DeploymentSideBarDetailsProps = {
  rollout: K8sResourceKind;
  rolloutKind?: RolloutKind;
};

export const DeploymentSideBarDetails: React.FC<DeploymentSideBarDetailsProps> = ({
  rollout: d,
}) => {
  const { t } = useTranslation();
  const model = getK8sModel(d);
  const labelsModalLauncher = useLabelsModal(d);
  const annotationsModalLauncher = useAnnotationsModal(d);

  const canUpdateAccess = useAccessReview({
    group: model?.apiGroup,
    resource: model?.plural,
    verb: 'patch',
    name: d.metadata?.name,
    namespace: d.metadata?.namespace,
  });
  const canUpdate = canUpdateAccess && true;
  const labelItems = _.map(d.metadata?.labels, (label, key) => (
    <Label
      key={key}
      kind={d.apiVersion.replace('/', '~') + '~' + d.kind}
      name={key}
      value={label}
      expand={true}
    />
  ));
  const annotationItems = _.map(d.metadata?.annotations, (annotation, key) => (
    <Label
      key={key}
      kind={d.apiVersion.replace('/', '~') + '~' + d.kind}
      name={key}
      value={annotation}
      expand={true}
    />
  ));
  const strategy = d.spec?.strategy?.blueGreen ? 'Blue Green' : 'Canary';
  return (
    <>
      <div className="ocs-sidebar-tabsection">
        <div className="co-m-pane__heading-owner">
          <DevPreviewBadge />
          <SidebarSectionHeading text={'Rollout'} />
        </div>
      </div>
      <div className="overview__sidebar-pane-body resource-overview__body">
        <div className="resource-overview__summary">
          <DescriptionList>
            <DetailsItem label={t('public~Name')} obj={d} path={'metadata.name'} />
            <DetailsItem label={t('public~Namespace')} obj={d} path="metadata.namespace">
              <ResourceLink
                kind="Namespace"
                name={d.metadata?.namespace}
                title={d.metadata?.uid}
                namespace={null}
              />
            </DetailsItem>
            <DetailsItem
              label={t('public~Annotations')}
              obj={d}
              path="metadata.annotations"
              onEdit={annotationsModalLauncher}
              canEdit={canUpdate}
              editAsGroup
            >
              <>
                {_.isEmpty(annotationItems) ? (
                  <div className="text-muted" key="0">
                    {t('public~No annotations')}
                  </div>
                ) : (
                  <PfLabelGroup
                    className="co-label-group"
                    defaultIsOpen={true}
                    numLabels={20}
                    data-test="label-list"
                  >
                    {annotationItems}
                  </PfLabelGroup>
                )}
              </>
            </DetailsItem>
            <DetailsItem
              label={t('public~Labels')}
              obj={d}
              path="metadata.labels"
              onEdit={labelsModalLauncher}
              canEdit={canUpdate}
              editAsGroup
            >
              <>
                {_.isEmpty(labelItems) ? (
                  <div className="text-muted" key="0">
                    {t('public~No labels')}
                  </div>
                ) : (
                  <PfLabelGroup
                    className="co-label-group"
                    defaultIsOpen={true}
                    numLabels={20}
                    data-test="label-list"
                  >
                    {labelItems}
                  </PfLabelGroup>
                )}
              </>
            </DetailsItem>
            <DetailsItem label={t('public~Update Strategy')} obj={d} path="spec.strategy">
              {strategy}
            </DetailsItem>
          </DescriptionList>
        </div>
        <div className="resource-overview__details">
          <DescriptionList>
            <DetailsItem label={t('public~Replicas')} obj={d} path={'spec.replicas'} />
            <DetailsItem
              label={t('public~Revision History Limit')}
              obj={d}
              path={'spec.revisionHistoryLimit'}
            />
          </DescriptionList>
        </div>
      </div>
    </>
  );
};

export const useRolloutSideBarDetails: DetailsTabSectionExtensionHook = (element: GraphElement) => {
  const resource = getResource(element);

  if (!resource || resource.kind !== 'Rollout') {
    return [undefined, true, undefined];
  }
  const section = (
    <DeploymentSideBarDetails rollout={resource} rolloutKind={resource as RolloutKind} />
  );
  return [section, true, undefined];
};

export type SidebarSectionHeadingProps = {
  children?: any;
  style?: any;
  className?: string;
  text: string;
};

export type SectionHeadingProps = {
  children?: any;
  style?: any;
  text: string;
  required?: boolean;
  id?: string;
};

export const SidebarSectionHeading: React.SFC<SidebarSectionHeadingProps> = ({
  text,
  children,
  style,
  className,
}) => (
  <Title headingLevel="h2" className={`sidebar__section-heading ${className}`} style={style}>
    {text}
    {children}
  </Title>
);
