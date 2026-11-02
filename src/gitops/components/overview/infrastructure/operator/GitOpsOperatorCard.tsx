import * as React from 'react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { dangerColor, successColor, warningColor } from '@gitops/utils/components/Icons/Icons';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { ALL_NAMESPACES_SESSION_KEY } from '@gitops/utils/utils';
import OpenshiftGitOpsIcon from '@images/OpenShift_GitOps.svg';
import { K8sResourceCommon, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Divider,
  Flex,
  FlexItem,
  Label,
  Spinner,
  Timestamp,
  TimestampFormat,
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, GlobeAmericasIcon } from '@patternfly/react-icons';

import {
  DEFAULT_GITOPS_OPERATOR_NAMESPACE,
  loadingState,
  OverviewCardProps,
} from '../../chartHelpers';
import { FLEX_ALIGN_CENTER, FLEX_SPACE_SM } from '../shared/constants';

export type CSVKind = K8sResourceCommon & {
  spec?: {
    version?: string;
    displayName?: string;
    provider?: {
      name?: string;
    };
  };
  status?: {
    phase?: string;
    message?: string;
    lastUpdateTime?: string;
  };
};

const GitOpsOperatorCard: React.FC<OverviewCardProps> = ({ namespace }) => {
  const [csvs, csvsLoaded, csvsError] = useK8sWatchResource<CSVKind[]>({
    isList: true,
    groupVersionKind: {
      group: 'operators.coreos.com',
      version: 'v1alpha1',
      kind: 'ClusterServiceVersion',
    },
    namespaced: !!namespace,
    ...(namespace && namespace !== ALL_NAMESPACES_SESSION_KEY ? { namespace: namespace } : {}),
  });

  const gitopsOperator = useMemo(() => {
    const csv = (csvs ?? []).find((c) => {
      const name = (c.metadata as Record<string, string>)?.name ?? '';
      return (
        name.startsWith(DEFAULT_GITOPS_OPERATOR_NAMESPACE) || name.startsWith('gitops-operator')
      );
    });
    if (!csv) return null;
    const meta = csv.metadata;
    const spec = csv.spec;
    const status = csv.status;
    return {
      name: meta.name,
      message: status?.message ?? '',
      phase: status?.phase ?? 'Unknown',
      displayName: spec?.displayName ?? '',
      provider: spec?.provider?.name ?? '',
      version: spec?.version ?? '',
      operatorNamespace: meta.namespace ?? '',
      createdAt: meta.creationTimestamp || undefined,
      currentNamespace: namespace || t('All Namespaces'),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvs]);

  return (
    <Card className="gitops-dashboard__infrastructure-card">
      <CardTitle>{t('GitOps Operator')}</CardTitle>
      {/* eslint-disable no-nested-ternary */}
      {!csvsLoaded && !csvsError ? (
        <CardHeader style={{ height: '60%' }}>
          <Flex style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FlexItem>
              <div>{loadingState()}</div>
            </FlexItem>
          </Flex>
        </CardHeader>
      ) : csvsError ? (
        <CardHeader style={{ height: '60%' }}>
          <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ExclamationCircleIcon style={{ fill: dangerColor }} />
                {t('Error retrieving CSV for the GitOps Operator')}
              </span>
            </FlexItem>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>{csvsError}</FlexItem>
          </Flex>
        </CardHeader>
      ) : gitopsOperator ? (
        <CardBody className="gitops-dashboard__infrastructure-card-body">
          <Flex direction={{ default: 'column' }}>
            <Flex spaceItems={FLEX_SPACE_SM} alignItems={FLEX_ALIGN_CENTER}>
              <Flex flex={{ default: 'flex_1' }}>
                <FlexItem>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <OpenshiftGitOpsIcon
                      style={{ flexShrink: 0, minWidth: '32px' }}
                      width={32}
                      height={32}
                    />
                    <Divider orientation={{ default: 'vertical' }} component="hr" />
                    <Link
                      to={`/k8s/ns/${gitopsOperator.operatorNamespace}/operators.coreos.com~v1alpha1~ClusterServiceVersion/${gitopsOperator.name}`}
                    >
                      {gitopsOperator.name}
                    </Link>
                  </span>
                </FlexItem>
              </Flex>
              <Flex alignSelf={{ default: 'alignSelfCenter' }}>
                <FlexItem>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      flexDirection: 'row',
                      gap: '4px',
                      flexShrink: 0,
                    }}
                  >
                    {/* eslint-disable no-nested-ternary */}
                    {gitopsOperator.phase === 'Succeeded' ||
                    gitopsOperator.phase === 'Available' ? (
                      <CheckCircleIcon style={{ fill: successColor }} />
                    ) : gitopsOperator.phase === 'Failure' ||
                      gitopsOperator.phase === 'Failed' ||
                      gitopsOperator.phase === 'Unknown' ? (
                      <ExclamationCircleIcon style={{ fill: dangerColor }} />
                    ) : gitopsOperator.phase === 'Pending' ? (
                      <Spinner size="sm" />
                    ) : (
                      <></>
                    )}
                    <Label
                      isCompact
                      color={
                        gitopsOperator.phase === 'Failed' ||
                        gitopsOperator.phase === 'Failure' ||
                        gitopsOperator.phase === 'Unknown'
                          ? 'red'
                          : gitopsOperator.phase === 'Succeeded' ||
                            gitopsOperator.phase === 'Available'
                          ? 'green'
                          : gitopsOperator.phase === 'Pending'
                          ? 'blue'
                          : 'grey'
                      }
                    >
                      {gitopsOperator.phase}
                    </Label>
                    {/* eslint-enable no-nested-ternary */}
                  </span>
                </FlexItem>
              </Flex>
            </Flex>
            <Divider orientation={{ default: 'horizontal', lg: 'horizontal' }} component="hr" />
            <Flex direction={{ default: 'column' }}>
              <FlexItem>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {t('Version: {{x}}', { x: gitopsOperator.version })}
                </span>
              </FlexItem>
              <FlexItem>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {t('Display Name: {{x}}', { x: gitopsOperator.displayName })}
                </span>
              </FlexItem>
              <FlexItem>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {t('Provider: {{x}}', { x: gitopsOperator.provider })}
                </span>
              </FlexItem>
              <FlexItem>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {t('Namspace: {{x}}', { x: gitopsOperator.currentNamespace })}
                </span>
              </FlexItem>
              <FlexItem>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {t('Message: {{x}}', { x: gitopsOperator.message })}
                </span>
              </FlexItem>
              <FlexItem>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {t('Created At:')}
                  {gitopsOperator.createdAt ? (
                    <Label isCompact variant="filled" color={'grey'} icon={<GlobeAmericasIcon />}>
                      <Timestamp
                        date={new Date(gitopsOperator.createdAt)}
                        dateFormat={TimestampFormat.medium}
                        timeFormat={TimestampFormat.short}
                      />
                    </Label>
                  ) : (
                    'N/A'
                  )}
                </span>
              </FlexItem>
            </Flex>
          </Flex>
        </CardBody>
      ) : (
        <CardHeader style={{ height: '60%' }}>
          <Flex direction={{ default: 'column' }} alignSelf={{ default: 'alignSelfCenter' }}>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ExclamationCircleIcon style={{ fill: warningColor }} />
                {t('Not found')}
              </span>
            </FlexItem>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
              {t('The OpenShift GitOps Operator is not installed or not found for this namespace')}
            </FlexItem>
          </Flex>
        </CardHeader>
      )}
      {/* eslint-enable no-nested-ternary */}
    </Card>
  );
};

export default GitOpsOperatorCard;
