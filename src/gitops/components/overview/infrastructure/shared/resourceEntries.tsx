import { RolloutModel } from '@gitops/components/rollout/model/RolloutModel';
import { RolloutStatusFragment } from '@gitops/components/rollout/RolloutStatus';
import { RolloutStatus } from '@gitops/components/rollout/utils/rollout-utils';
import { ApplicationModel } from '@gitops/models/ApplicationModel';
import { AppProjectModel } from '@gitops/models/AppProjectModel';
import HealthStatus from '@gitops/Statuses/HealthStatus';
import SyncStatus from '@gitops/Statuses/SyncStatus';
import { dangerColor, successColor } from '@gitops/utils/components/Icons/Icons';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { modelToGroupVersionKind } from '@gitops/utils/utils';
import {
  K8sModel,
  K8sResourceCommon,
  K8sResourceCondition,
  K8sResourceKind,
  ResourceLink,
} from '@openshift-console/dynamic-plugin-sdk';
import { Flex, FlexItem, Label, Spinner, Tooltip } from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

import { FLEX_ALIGN_CENTER, FLEX_SPACE_SM } from './constants';

/**
 * Currently all our model kinds (eg. ArgoCDKind, RolloutManagerKind, etc.) are specialized types, OR-ed with K8sResourceCommon,
 * but for this common helper function, we need a general one to accomodate status.phase, health (for apps) and sync fields, etc.
 */
export type ResourceWithStatus = K8sResourceCommon & {
  status?: {
    phase?: string;
    health?: { status?: string };
    sync?: { status?: string };
    conditions?: K8sResourceCondition[];
  };
};

/**
 * Shared/Common function intended to be called from createK8sResourceEntries only.
 *
 * @param instance - This is typed to K8sResourceCommon, since we only need the metadata
 * @param model
 * @param phase
 * @returns
 */
export const createK8sResourceEntry = (
  instance: ResourceWithStatus,
  model: K8sModel,
  phase: string | undefined,
  projectNamespace: string,
  healthStatus?: string,
  syncStatus?: string,
) => {
  return (
    <Flex
      key={instance.metadata?.uid ?? `${instance.metadata?.namespace}/${instance.metadata?.name}`}
      spaceItems={FLEX_SPACE_SM}
      alignItems={FLEX_ALIGN_CENTER}
    >
      <Flex flex={{ default: 'flex_1' }} spaceItems={FLEX_SPACE_SM}>
        <FlexItem>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ResourceLink
              groupVersionKind={modelToGroupVersionKind(model)}
              name={instance?.metadata?.name}
              namespace={instance?.metadata?.namespace}
              inline={false}
            />
            {model.kind === AppProjectModel.kind && projectNamespace === undefined && (
              <span
                style={{ display: 'inline', fontSize: '80%', padding: '2px', borderRadius: '4px' }}
              >
                {t(`ns={{x}}`, { x: instance.metadata?.namespace })}
              </span>
            )}
          </span>
        </FlexItem>
      </Flex>
      <Flex alignSelf={{ default: 'alignSelfFlexStart' }}>
        <FlexItem>
          {/* eslint-disable no-nested-ternary */}
          {model.kind === ApplicationModel.kind ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {healthStatus && <HealthStatus status={healthStatus} />}
              {syncStatus && <SyncStatus status={syncStatus} />}
            </span>
          ) : model.kind === RolloutModel.kind ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tooltip
                content={
                  instance.status?.conditions?.length > 0 &&
                  instance.status?.conditions[instance.status?.conditions?.length - 1].message
                }
              >
                <RolloutStatusFragment showPhaseLabel={false} status={phase as RolloutStatus} />
              </Tooltip>
            </span>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tooltip
                content={
                  instance.status?.conditions?.length > 0 && instance.status?.conditions[0]?.message
                }
              >
                {phase === 'Available' ? (
                  <CheckCircleIcon style={{ fill: successColor }} />
                ) : phase === 'Failure' ? (
                  <ExclamationCircleIcon style={{ fill: dangerColor }} />
                ) : phase === 'Pending' ? (
                  <Spinner size="sm" />
                ) : (
                  <></>
                )}
              </Tooltip>
              {phase && (
                <Tooltip
                  content={
                    instance.status?.conditions?.length > 0 &&
                    instance.status?.conditions[instance.status?.conditions?.length - 1].message
                  }
                >
                  <Label
                    isCompact
                    color={
                      // eslint-disable-next-line no-nested-ternary
                      phase === 'Available'
                        ? 'green'
                        : phase === 'Pending'
                        ? 'blue'
                        : phase === 'Paused'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {phase}
                  </Label>
                </Tooltip>
              )}
              {healthStatus && <HealthStatus status={healthStatus} />}
            </span>
          )}
          {/* eslint-enable no-nested-ternary */}
        </FlexItem>
      </Flex>
    </Flex>
  );
};

/**
 * Shared/Common function to create a list of resource entries for the resource list in a dashboard card
 *
 * @param resources - List of Argo Resource Kind specialized type of K8sResourceCommon
 * @param uniqueKey - unique key prefix for repeatable elements in the list. Must be unique for each list or call to this function for this dashboard
 * @param linkToResourceList - link to the console's resource list page for the resource type
 * @param linkText - the link's text to display
 * @returns
 */
export const createK8sResourceEntries = (
  resources: ResourceWithStatus[] | K8sResourceKind[],
  uniqueKey: string,
  k8sModel: K8sModel,
  projectNamespace: string,
  listLimit?: number,
) => {
  const LIST_LIMIT = listLimit || 5;
  const entries =
    resources.length > LIST_LIMIT
      ? resources
          .slice(0, LIST_LIMIT)
          .map((instance) =>
            createK8sResourceEntry(
              instance,
              k8sModel,
              instance.status?.phase,
              projectNamespace,
              instance.status?.health?.status,
              instance.status?.sync?.status,
            ),
          )
      : resources.map((instance) =>
          createK8sResourceEntry(
            instance,
            k8sModel,
            instance.status?.phase,
            projectNamespace,
            instance.status?.health?.status,
            instance.status?.sync?.status,
          ),
        );
  if (resources.length > LIST_LIMIT) {
    entries.push(
      <Flex key={uniqueKey + '-ellipsis'}>
        <FlexItem>
          <span>{t('...and {{x}} more', { x: resources.length - LIST_LIMIT })}</span>
        </FlexItem>
      </Flex>,
    );
  }
  return entries;
};
