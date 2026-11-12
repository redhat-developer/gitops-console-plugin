import React from 'react';

import { ApplicationKind, ApplicationModel } from '@gitops/models/ApplicationModel';
import { dangerColor } from '@gitops/utils/components/Icons/Icons';
import { PhaseStatus } from '@gitops/utils/constants';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { modelToGroupVersionKind } from '@gitops/utils/utils';
import { K8sModel, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
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

import { OverviewCardForApplicationsProps } from '../chartHelpers';
import { FLEX_ALIGN_CENTER, FLEX_SPACE_SM } from '../infrastructure/shared/constants';
import InfrastructureCardTitle from '../infrastructure/shared/InfrastructureCardTitle';
import LoadingHeader from '../infrastructure/shared/LoadingHeader';

const PHASE_LABEL_COLOR: Record<PhaseStatus, React.ComponentProps<typeof Label>['color']> = {
  [PhaseStatus.FAILED]: 'red',
  [PhaseStatus.ERROR]: 'red',
  [PhaseStatus.RUNNING]: 'green',
  [PhaseStatus.SUCCEEDED]: 'green',
  [PhaseStatus.TERMINATING]: 'orange',
};

const RecentOperationsCard: React.FC<OverviewCardForApplicationsProps> = ({
  namespace,
  applications,
  isAppsLoaded,
  appsLoadedError,
}) => {
  const LIST_LIMIT = 5;
  const recentOps = applications
    .filter((a) => a.status?.operationState?.finishedAt)
    .sort((a, b) =>
      (b.status?.operationState?.finishedAt ?? '').localeCompare(
        a.status?.operationState?.finishedAt ?? '',
      ),
    )
    .slice(0, LIST_LIMIT); // Last 5 operations at most

  return (
    <Card className="gitops-dashboard__infrastructure-card-applications-needing-attention">
      <InfrastructureCardTitle
        title={t('Recent Operations')}
        titleDescription={t('(Last {{x}} operations)', { x: LIST_LIMIT })}
        total={recentOps?.length}
        showDivider={false}
        showTotal={false}
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
          <CardHeader style={{ paddingBottom: '2px', marginBottom: '0px', paddingTop: '5px' }}>
            <Flex
              alignItems={FLEX_ALIGN_CENTER}
              direction={{ default: 'row' }}
              flexWrap={{ default: 'nowrap' }}
              spaceItems={{ default: 'spaceItemsLg' }}
              columnGap={{ default: 'columnGapMd' }}
            >
              <Flex flex={{ default: 'flex_2' }}>
                <FlexItem>
                  <span>{t('Application')}</span>
                </FlexItem>
              </Flex>
              <Flex flex={{ default: 'flex_1' }}>
                <FlexItem align={{ default: 'alignLeft' }}>
                  <span>{t('Phase')}</span>
                </FlexItem>
              </Flex>
              <Flex flex={{ default: 'flex_3' }}>
                <FlexItem align={{ default: 'alignLeft' }}>
                  <span>{t('Message')}</span>
                </FlexItem>
              </Flex>
              <Flex
                flex={{ default: 'flex_1' }}
                justifyContent={{ default: 'justifyContentFlexStart' }}
              >
                <FlexItem align={{ default: 'alignLeft' }}>
                  <span>{t('Finished At')}</span>
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
            {recentOps && recentOps.length > 0 ? (
              <div>{createApplicationResourceEntries(recentOps, ApplicationModel, namespace)}</div>
            ) : (
              <Flex
                direction={{ default: 'column' }}
                spaceItems={FLEX_SPACE_SM}
                style={{ marginTop: '16px' }}
              >
                {t('No recent operations')}
              </Flex>
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
) => {
  const msg = instance.status?.operationState?.message ?? '-';
  const messageToShow = msg.length > 200 ? msg.slice(0, 200) : msg;
  const finishedAt = new Date(instance.status?.operationState?.finishedAt ?? '');
  const phaseColor = PHASE_LABEL_COLOR[instance.status?.operationState?.phase] ?? 'blue';

  return (
    <div
      key={instance.metadata?.uid ?? `${instance.metadata?.namespace}/${instance.metadata?.name}`}
      style={{ marginTop: '6px', marginBottom: '6px', fontSize: '90%' }}
    >
      <Flex
        direction={{ default: 'row' }}
        alignItems={{ default: 'alignItemsFlexStart' }}
        alignContent={{ default: 'alignContentFlexStart' }}
        flexWrap={{ default: 'nowrap' }}
        spaceItems={{ default: 'spaceItemsLg' }}
        columnGap={{ default: 'columnGapMd' }}
      >
        <Flex flex={{ default: 'flex_2' }} spaceItems={{ default: 'spaceItemsNone' }}>
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
        <Flex flex={{ default: 'flex_1' }} spaceItems={{ default: 'spaceItemsNone' }}>
          <FlexItem align={{ default: 'alignLeft' }} style={{ fontSize: '60%', paddingTop: '2px' }}>
            <Label isCompact color={phaseColor}>
              {instance.status?.operationState?.phase ?? '-'}
            </Label>
          </FlexItem>
        </Flex>
        <Flex flex={{ default: 'flex_3' }} spaceItems={{ default: 'spaceItemsNone' }}>
          <FlexItem align={{ default: 'alignLeft' }}>
            {msg.length > 200 ? (
              <span>
                {messageToShow}
                <Tooltip content={msg}>
                  <Label isCompact>{'...'}</Label>
                </Tooltip>
              </span>
            ) : (
              msg
            )}
          </FlexItem>
        </Flex>
        <Flex flex={{ default: 'flex_1' }} spaceItems={{ default: 'spaceItemsNone' }}>
          <FlexItem align={{ default: 'alignLeft' }}>
            {instance.status?.operationState?.finishedAt
              ? finishedAt.toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'medium',
                  hour12: false,
                })
              : '-'}
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
  recentOps: ApplicationKind[],
  k8sModel: K8sModel,
  projectNamespace: string,
) => {
  const entries = recentOps.map((instance, index) =>
    createApplicationResourceEntry(
      index == recentOps.length - 1,
      instance,
      k8sModel,
      projectNamespace,
    ),
  );
  return entries;
};

export default RecentOperationsCard;
