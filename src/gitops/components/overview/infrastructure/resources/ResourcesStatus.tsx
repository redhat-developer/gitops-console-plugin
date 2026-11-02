import { Fragment, useMemo } from 'react';

import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import {
  K8sGroupVersionKind,
  K8sResourceCommon,
  K8sResourceCondition,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Divider, Flex, FlexItem, Label, Tooltip } from '@patternfly/react-core';

// All of our cards will accept a namespace since the project can be specific or All Projects.
export interface ResourcesStatusProps {
  namespace: string;
  name: string;
  resourceKind: K8sGroupVersionKind;
}

type GitOpsK8sResourceKind = K8sResourceCommon & {
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
    conditions?: K8sResourceCondition[];
  };
};

const ResourcesStatus: React.FC<ResourcesStatusProps> = ({ namespace, name, resourceKind }) => {
  const [resources] = useK8sWatchResource<GitOpsK8sResourceKind[]>({
    groupVersionKind: {
      group: resourceKind.group,
      version: resourceKind.version,
      kind: resourceKind.kind,
    },
    isList: true,
    namespaced: !!namespace,
    ...(namespace ? { namespace: namespace } : {}),
  });

  const theResource = useMemo(() => {
    const res = (resources ?? []).find((c) => {
      const resName = (c.metadata as Record<string, string>)?.name ?? '';
      return resName === name;
    });
    if (!res) return null;
    const meta = res.metadata;
    const spec = res.spec;
    const status = res.status;
    return {
      name: meta.name,
      conditions: status?.conditions ?? [],
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
  }, [resources]);

  return (
    <div>
      <Flex spaceItems={{ default: 'spaceItemsNone' }}>
        <FlexItem>
          <Divider
            orientation={{ default: 'horizontal' }}
            component="hr"
            style={{ margin: '2px 0px 2px 0px' }}
          />
        </FlexItem>
      </Flex>
      {theResource?.conditions?.length > 0 && (
        <>
          <Flex>{t('Updated message(s) for the {{x}}:', { x: resourceKind.kind })}</Flex>
          <Flex spaceItems={{ default: 'spaceItemsNone' }}>
            <FlexItem>
              <Divider
                orientation={{ default: 'horizontal' }}
                component="hr"
                style={{ margin: '2px 0px 2px 0px' }}
              />
            </FlexItem>
          </Flex>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'max-content 1fr',
              columnGap: '8px',
              rowGap: '4px',
              alignItems: 'start',
            }}
          >
            {theResource?.conditions?.map((condition, index) => (
              <Fragment key={(condition.reason || condition.type || 'condition') + index}>
                <span style={{ whiteSpace: 'nowrap' }}>
                  {condition.lastTransitionTime
                    ? new Date(condition.lastTransitionTime).toLocaleString(undefined, {
                        dateStyle: 'medium',
                        timeStyle: 'medium',
                        hour12: false,
                      })
                    : ''}
                </span>
                {condition.message.length > 200 ? (
                  <span>
                    {condition.message.slice(0, 200)}
                    <Tooltip content={condition.message}>
                      <Label isCompact>{'...'}</Label>
                    </Tooltip>
                  </span>
                ) : (
                  <span>{condition.message}</span>
                )}
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ResourcesStatus;
