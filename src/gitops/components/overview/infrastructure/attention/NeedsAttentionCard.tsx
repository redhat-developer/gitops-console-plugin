import React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { HealthStatus as HS, SyncStatus as SS } from 'src/gitops/utils/constants';

import {
  ApplicationCondition,
  ApplicationKind,
  ApplicationModel,
  ApplicationResourceStatus,
} from '@gitops/models/ApplicationModel';
import HealthStatus from '@gitops/Statuses/HealthStatus';
import SyncStatus from '@gitops/Statuses/SyncStatus';
import { dangerColor } from '@gitops/utils/components/Icons/Icons';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { modelToGroupVersionKind, modelToRef } from '@gitops/utils/utils';
import { K8sModel, ResourceLink, useAccessReview } from '@openshift-console/dynamic-plugin-sdk';
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  FlexItem,
  Label,
  Tooltip,
} from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

import { OverviewCardForApplicationsProps } from '../../chartHelpers';
import ResourcesStatus from '../resources/ResourcesStatus';
import {
  FLEX_ALIGN_CENTER,
  FLEX_SPACE_SM,
  LINK_MARGIN,
  LINK_MARGIN_FOR_EMPTY_LIST,
} from '../shared/constants';
import InfrastructureCardTitle from '../shared/InfrastructureCardTitle';
import LoadingHeader from '../shared/LoadingHeader';

import './NeedsAttentionCard.scss';

const NeedsAttentionCard: React.FC<OverviewCardForApplicationsProps> = ({
  namespace,
  applications,
  isAppsLoaded,
  appsLoadedError,
}) => {
  const applicationsNeedingAttention = applications.filter(
    (instance) =>
      instance.status?.health?.status !== HS.HEALTHY || instance.status?.sync?.status !== SS.SYNCED,
  );

  const modelRef = modelToRef(ApplicationModel);
  const linkToResourceList = namespace
    ? `/k8s/ns/${namespace}/${modelRef}`
    : `/k8s/all-namespaces/${modelRef}`;

  const canListAccess = useAccessReview({
    group: ApplicationModel.apiGroup,
    resource: ApplicationModel.plural,
    verb: 'list',
    namespace: namespace ? namespace : undefined,
  });
  const isEmpty = !applicationsNeedingAttention || applicationsNeedingAttention.length === 0;

  return (
    <Card className="gitops-dashboard__infrastructure-card-applications-needing-attention">
      <InfrastructureCardTitle
        title={t('Applications Needing Attention')}
        total={applicationsNeedingAttention?.length}
        showDivider={false}
      />
      {/* eslint-disable-next-line no-nested-ternary */}
      {!isAppsLoaded && !appsLoadedError ? (
        <LoadingHeader />
      ) : appsLoadedError ? (
        <CardHeader style={{ height: '60%' }}>
          <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ExclamationCircleIcon style={{ fill: dangerColor }} />
                {t('Error retrieving Applications')}
              </span>
            </FlexItem>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>{appsLoadedError}</FlexItem>
          </Flex>
        </CardHeader>
      ) : (
        <>
          <CardHeader style={{ paddingBottom: '2px', marginBottom: '0px' }}>
            <Flex
              alignItems={FLEX_ALIGN_CENTER}
              direction={{ default: 'row' }}
              flexWrap={{ default: 'nowrap' }}
              spaceItems={{ default: 'spaceItemsLg' }}
              columnGap={{ default: 'columnGapMd' }}
            >
              <Flex flex={{ default: 'flex_1' }}>
                <FlexItem>
                  <span>{t('Application')}</span>
                </FlexItem>
              </Flex>
              <Flex flex={{ default: 'flex_3' }}>
                <FlexItem align={{ default: 'alignLeft' }}>
                  <span>{t('Details')}</span>
                </FlexItem>
              </Flex>
              <Flex
                flex={{ default: 'flex_1' }}
                justifyContent={{ default: 'justifyContentFlexStart' }}
              >
                <FlexItem align={{ default: 'alignLeft' }}>
                  <span>{t('Status')}</span>
                </FlexItem>
              </Flex>
            </Flex>
            <Divider
              orientation={{ default: 'horizontal' }}
              component="hr"
              style={{ margin: '2px 0px 2px 0px' }}
            />
          </CardHeader>
          <CardBody className="gitops-dashboard__infrastructure-card-body">
            {applicationsNeedingAttention && applicationsNeedingAttention.length > 0 ? (
              <div>
                {createApplicationResourceEntries(
                  applicationsNeedingAttention,
                  'application',
                  ApplicationModel,
                  namespace,
                )}
              </div>
            ) : (
              <Flex
                direction={{ default: 'column' }}
                spaceItems={FLEX_SPACE_SM}
                style={{ marginTop: '16px' }}
              >
                {t('No {{x}} needing attention', { x: ApplicationModel.labelPlural })}
              </Flex>
            )}
            {canListAccess[0] && !canListAccess[1] && (
              <>
                <Divider style={isEmpty ? LINK_MARGIN_FOR_EMPTY_LIST : LINK_MARGIN} />
                <Flex key={`apps-needing-attention-resource-list-link`}>
                  <Link to={linkToResourceList}>{t('View Applications List Page')}</Link>
                </Flex>
              </>
            )}
          </CardBody>
        </>
      )}
    </Card>
  );
};

const createApplicationResourceEntry = (
  isLast: boolean,
  instance: ApplicationKind,
  model: K8sModel,
  projectNamespace: string,
  healthStatus?: string,
  syncStatus?: string,
) => {
  const unhealthyResources = instance.status?.resources?.filter(
    (resource: ApplicationResourceStatus) =>
      resource.health && resource.health.status !== HS.HEALTHY,
  );
  const missingResources = instance.status?.resources?.filter(
    (resource: ApplicationResourceStatus) =>
      resource.health && resource.health.status === HS.MISSING,
  );
  const operationStateMessage = instance.status?.operationState?.message;

  return (
    <div
      key={instance.metadata?.uid ?? `${instance.metadata?.namespace}/${instance.metadata?.name}`}
      style={{ marginTop: '6px', marginBottom: '6px' }}
    >
      <Flex
        direction={{ default: 'row' }}
        alignItems={{ default: 'alignItemsFlexStart' }}
        alignContent={{ default: 'alignContentFlexStart' }}
        flexWrap={{ default: 'nowrap' }}
        spaceItems={{ default: 'spaceItemsLg' }}
        columnGap={{ default: 'columnGapMd' }}
      >
        <Flex flex={{ default: 'flex_1' }} spaceItems={{ default: 'spaceItemsNone' }}>
          <FlexItem align={{ default: 'alignLeft' }}>
            <span style={{ display: 'inline', alignItems: 'left', columnGap: '4px' }}>
              <span style={{ display: 'block' }}>
                <ResourceLink
                  groupVersionKind={modelToGroupVersionKind(model)}
                  name={instance?.metadata?.name}
                  namespace={instance?.metadata?.namespace}
                  inline={false}
                />
              </span>
              {projectNamespace === undefined && (
                <span style={{ display: 'block', fontSize: '80%', paddingLeft: '22px' }}>
                  {t(`{{x}}`, { x: instance.metadata?.namespace })}
                </span>
              )}
            </span>
          </FlexItem>
        </Flex>
        <Flex flex={{ default: 'flex_3' }} spaceItems={{ default: 'spaceItemsNone' }}>
          <FlexItem align={{ default: 'alignLeft' }}>
            {unhealthyResources && unhealthyResources.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ display: 'inline', flexDirection: 'row', fontSize: '90%' }}>
                  {missingResources &&
                  unhealthyResources &&
                  missingResources.length !== unhealthyResources.length ? (
                    unhealthyResources.map((resource: ApplicationResourceStatus) => (
                      <div key={resource.name + resource.kind}>
                        <span style={{ display: 'inline', flexDirection: 'row', fontSize: '90%' }}>
                          {
                            <span>
                              <ResourceLink
                                title={resource.kind}
                                className="gitops-dashboard-resource-link"
                                groupVersionKind={{
                                  group: resource.group,
                                  version: resource.version,
                                  kind: resource.kind,
                                }}
                                name={resource.name}
                                namespace={resource.namespace}
                                inline={true}
                              />
                              {/* eslint-disable-next-line no-nested-ternary */}
                              {resource.health?.status === HS.MISSING
                                ? t('is not on the cluster (Missing).')
                                : resource.health?.status
                                ? t('is {{x}}.', { x: resource.health?.status?.toLowerCase() })
                                : ''}
                              {resource.health?.message &&
                                t(' {{x}}.', {
                                  x: resource.health.message,
                                })}
                            </span>
                          }
                        </span>
                        <div style={{ paddingLeft: '10px', fontSize: '90%', flexShrink: 0 }}>
                          <ResourcesStatus
                            resourceKind={{
                              group: resource.group,
                              version: resource.version,
                              kind: resource.kind,
                            }}
                            name={resource.name}
                            namespace={resource.namespace}
                          />
                        </div>
                        <Divider
                          orientation={{ default: 'horizontal' }}
                          component="hr"
                          style={{ margin: '2px 0px 2px 0px' }}
                        />
                      </div>
                    ))
                  ) : (
                    <span
                      key={'missing-all-resources'}
                      style={{ display: 'flex', flexDirection: 'row', fontSize: '90%' }}
                    >
                      {t(
                        `The application's resources are all missing. Try syncing the application.`,
                      )}
                    </span>
                  )}
                </span>
                {instance.status?.operationState?.phase && (
                  <Flex style={{ fontSize: '90%' }}>
                    {instance.status?.operationState?.operation?.sync && (
                      <span style={{ display: 'flex', fontSize: '90%' }}>
                        <Flex direction={{ default: 'row' }}>
                          <FlexItem>
                            {t('Operation: Sync')} {instance.status?.operationState?.phase}
                            {' - '}
                            {t('Finished At: {{x}}', {
                              x: instance.status?.operationState?.finishedAt
                                ? new Date(
                                    instance.status?.operationState?.finishedAt ?? '',
                                  ).toLocaleString(undefined, {
                                    dateStyle: 'medium',
                                    timeStyle: 'medium',
                                    hour12: false,
                                  })
                                : '-',
                            })}
                          </FlexItem>
                        </Flex>
                      </span>
                    )}
                    {operationStateMessage && (
                      <span style={{ paddingLeft: '10px', display: 'flex', fontSize: '90%' }}>
                        {operationStateMessage.length > 200 ? (
                          <span>
                            {t('Message: {{x}}', { x: operationStateMessage.slice(0, 200) })}
                            <Tooltip content={operationStateMessage}>
                              <Label isCompact>{'...'}</Label>
                            </Tooltip>
                          </span>
                        ) : (
                          t('Message: {{x}}.', { x: operationStateMessage })
                        )}
                      </span>
                    )}

                    {instance.status?.conditions && instance.status.conditions.length > 0 && (
                      <span style={{ display: 'inline', flexDirection: 'row', fontSize: '90%' }}>
                        {instance.status?.conditions.map((condition: ApplicationCondition) => (
                          <span
                            key={condition.type}
                            style={{ display: 'flex', flexDirection: 'row', fontSize: '90%' }}
                          >
                            {condition.type && condition.type.toLowerCase() + '.'}
                            {condition.message && condition.message.length > 200 ? (
                              <span>
                                <span>{condition.message.slice(0, 200)}</span>
                                <Tooltip content={condition.message}>
                                  <Label isCompact>{'...'}</Label>
                                </Tooltip>
                              </span>
                            ) : (
                              condition.message.toLowerCase() + '.'
                            )}
                          </span>
                        ))}
                      </span>
                    )}
                  </Flex>
                )}
              </div>
            )}
          </FlexItem>
        </Flex>
        <Flex
          flex={{ default: 'flex_1' }}
          spaceItems={{ default: 'spaceItemsNone' }}
          justifyContent={{ default: 'justifyContentFlexStart' }}
        >
          <FlexItem align={{ default: 'alignLeft' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'left',
                columnGap: '5px',
                flexDirection: 'row',
              }}
            >
              {healthStatus && <HealthStatus status={healthStatus} />}
              {syncStatus && <SyncStatus status={syncStatus} />}
            </span>
          </FlexItem>
        </Flex>
      </Flex>
      {!isLast && (
        <Divider
          orientation={{ default: 'horizontal' }}
          component="hr"
          style={{ margin: '8px 0px 8px 0px' }}
        />
      )}
    </div>
  );
};

const createApplicationResourceEntries = (
  resources: ApplicationKind[],
  uniqueKey: string,
  k8sModel: K8sModel,
  projectNamespace: string,
  listLimit?: number,
) => {
  const LIST_LIMIT = listLimit || 10;
  const onlyNeedsAttention = resources.filter(
    (instance) =>
      instance.status?.health?.status !== HS.HEALTHY || instance.status?.sync?.status !== SS.SYNCED,
  );

  if (onlyNeedsAttention.length <= LIST_LIMIT) {
    const entries = onlyNeedsAttention.map((instance, index) =>
      createApplicationResourceEntry(
        index == onlyNeedsAttention.length - 1,
        instance,
        k8sModel,
        projectNamespace,
        instance.status?.health?.status,
        instance.status?.sync?.status,
      ),
    );
    return entries;
  }
  const entries = onlyNeedsAttention
    .slice(0, LIST_LIMIT)
    .map((instance, index) =>
      createApplicationResourceEntry(
        index == LIST_LIMIT - 1,
        instance,
        k8sModel,
        projectNamespace,
        instance.status?.health?.status,
        instance.status?.sync?.status,
      ),
    );

  entries.push(
    <Flex key={uniqueKey + '-ellipsis'}>
      <FlexItem>
        <span>{t('...and {{x}} more', { x: onlyNeedsAttention.length - LIST_LIMIT })}</span>
      </FlexItem>
    </Flex>,
  );
  return entries;
};

export default NeedsAttentionCard;
