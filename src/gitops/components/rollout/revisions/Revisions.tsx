import * as React from 'react';
import { Link } from 'react-router';
import moment from 'moment';

import { getPodStatus } from '@gitops/components/shared/pod-utils';
import { PodKind } from '@gitops/topology/console/types';
import ActionsDropdown from '@gitops/utils/components/ActionDropDown/ActionDropDown';
import { isApplicationRefreshing } from '@gitops/utils/gitops';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import {
  formatDuration,
  getResourceUrl,
  modelToGroupVersionKind,
  resourceAsArray,
} from '@gitops/utils/utils';
import {
  Action,
  K8sModel,
  ResourceLink,
  Selector,
  useK8sModel,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  Button,
  Divider,
  Flex,
  FlexItem,
  Label,
  LabelGroup,
  Spinner,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  // Popover,
  Tooltip,
} from '@patternfly/react-core';
import { DataViewTh, DataViewTrTree } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import DataViewTableTree from '@patternfly/react-data-view/dist/esm/DataViewTableTree';
import { FolderIcon, FolderOpenIcon } from '@patternfly/react-icons';
import ArrowCircleUpIcon from '@patternfly/react-icons/dist/esm/icons/arrow-circle-up-icon';
import { CubeIcon } from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import { EyeIcon } from '@patternfly/react-icons/dist/esm/icons/eye-icon';
import { MigrationIcon } from '@patternfly/react-icons/dist/esm/icons/migration-icon';
import { RunningIcon } from '@patternfly/react-icons/dist/esm/icons/running-icon';

import { Ticker } from '../../shared/Ticker/Ticker';
import { AnalysisRunStatusFragment } from '../components/AnalysisRunStatus/AnalysisRunStatus';
import {
  RevisionAlertGroup,
  useRevisionAlerts,
} from '../components/RevisionAlertGroup/RevisionAlertGroup';
import { useRolloutRevisionsActionsProvider } from '../hooks/useRolloutRevisionsActionsProvider';
import { useRolloutRevisionsRSActionsProvider } from '../hooks/useRolloutRevisionsRSActionsProvider';
import { AnalysisRunKind } from '../model/AnalysisRunModel';
import { ReplicaSetKind, RolloutKind, RolloutModel } from '../model/RolloutModel';
import { RolloutStatusFragment } from '../RolloutStatus';
import { abortRollout, promoteRollout, restartRollout, retryRollout } from '../services/Rollout';
import { isDeploying, RolloutStatus } from '../utils/rollout-utils';

import {
  getAnalysisRunSelector,
  getReplicaSetInfo,
  ImageInfo,
  ReplicaSetInfo,
  ReplicaSetStatus,
} from './ReplicaSetInfo';

import './Revisions.scss';

interface RevisionsProps {
  rollout: RolloutKind;
  replicaSets: ReplicaSetKind[];
  pods: PodKind[];
}

const getColumnsDV = (): DataViewTh[] => {
  const columns: DataViewTh[] = [
    {
      cell: t('Name'),
      props: {
        'aria-label': 'name',
      },
    },
    {
      cell: t('Kind'),
      props: {
        'aria-label': 'kind',
      },
    },
    {
      cell: t('Status'),
      props: {
        'aria-label': 'status',
      },
    },
    {
      cell: t('Age'),
      props: {
        'aria-label': 'age',
      },
    },
    {
      cell: t('Info'),
      props: {
        'aria-label': 'info',
      },
    },
    {
      cell: '',
      props: { 'aria-label': 'actions' },
    },
  ];
  return columns;
};

const RolloutActionsCell: React.FC<{
  app: RolloutKind;
  index: number;
  onError?: (error: Error | string, action: string) => void;
}> = ({ app, index, onError }) => {
  const actionList: [actions: Action[]] = useRolloutRevisionsActionsProvider(app, onError);
  return (
    <div style={{ textAlign: 'right' }}>
      <ActionsDropdown
        actions={actionList ? actionList[0] : []}
        id={'gitops-rollout-actions-' + index}
        isKebabToggle={true}
      />
    </div>
  );
};

const RolloutRevisionRSActionsCell: React.FC<{
  rollout: RolloutKind;
  replicaSet: ReplicaSetInfo;
  index: number;
  onError?: (error: Error | string, action: string) => void;
}> = ({ rollout, replicaSet, index, onError }) => {
  const actionList: [actions: Action[]] = useRolloutRevisionsRSActionsProvider(
    rollout,
    replicaSet,
    index,
    onError,
  );
  return (
    <div style={{ textAlign: 'right' }}>
      <ActionsDropdown
        actions={actionList ? actionList[0] : []}
        id={'gitops-rollout-rollback-action-' + index}
        isKebabToggle={true}
      />
    </div>
  );
};

const getRowsDV = (
  replicaSetInfo: ReplicaSetInfo[],
  replicaSetModel: K8sModel,
  obj: RolloutKind,
  onRevisionError?: (error: Error | string, action: string) => void,
): DataViewTrTree[] => {
  const rows: DataViewTrTree[] = [];
  const rsChildren: DataViewTrTree[] = [];
  let podsChildren: DataViewTrTree[] = [];

  rows.push({
    id: 'rollout-root',
    row: [
      <div key="rollout-root" style={{ display: 'inline-flex', marginLeft: '-25%' }}>
        <ResourceLink
          groupVersionKind={modelToGroupVersionKind(RolloutModel)}
          name={obj.metadata?.name}
          linkTo={false}
          namespace={obj.metadata?.namespace}
          inline={true}
        >
          <span className="pf-v6-u-pl-sm">
            {isApplicationRefreshing(obj) && <Spinner size="sm" />}
          </span>
        </ResourceLink>
      </div>,
      obj.kind,
      {
        cell: (
          <>
            {
              <RolloutStatusFragment
                showPhaseLabel={false}
                status={obj.status?.phase as RolloutStatus}
              />
            }
          </>
        ),
      },
      getAgeInMinutes(obj.metadata?.creationTimestamp) + 'm',
      {
        cell: <></>,
      },
      {
        cell: <RolloutActionsCell app={obj} index={0} onError={onRevisionError} />,
      },
    ],
  });

  replicaSetInfo.forEach((replicaSet, rsIndex) => {
    replicaSet.pods?.pods.forEach((pod, podIndex) => {
      let readyCount = 0;
      pod.status?.containerStatuses?.forEach((container) => {
        if (container.ready) {
          readyCount++;
        }
      });
      podsChildren.push({
        id: pod?.metadata?.name + '-' + podIndex,
        row: [
          <ResourceLink
            key={pod?.metadata?.name + '-' + podIndex}
            name={pod?.metadata?.name}
            namespace={pod?.metadata?.namespace}
            kind={pod?.kind}
          />,
          pod?.kind,
          getPodStatus(pod),
          getAgeInMinutes(pod?.metadata?.creationTimestamp) + 'm',
          <Tooltip key={pod?.metadata?.name + '-' + podIndex} content={t('Ready containers')}>
            <span>{t('ready') + ': ' + readyCount + '/' + pod.spec.containers.length}</span>
          </Tooltip>,
        ],
        ...{},
      });
    });
    rsChildren.push({
      id: replicaSet?.name + '-' + rsIndex,
      row: [
        {
          cell: (
            <div>
              <div style={{ display: 'inline-flex' }}>
                <>{`Revision ${replicaSet.revision} : `}</>
                <ResourceLink
                  name={replicaSet?.name}
                  namespace={replicaSet?.namespace}
                  kind="ReplicaSet"
                />
                <></>
              </div>
              <div>
                <span>Pods: </span>
                {replicaSet.pods && replicaSet.pods.readyReplicas ? (
                  <Link
                    to={
                      getResourceUrl({ model: replicaSetModel, resource: replicaSet.replicaSet }) +
                      '/pods'
                    }
                  >
                    {replicaSet.pods.readyReplicas + ' of ' + replicaSet.pods.replicas}
                  </Link>
                ) : (
                  t('0 Pods')
                )}
              </div>
              <div>
                <span>Images: </span>
                {getImages(replicaSet.images)}
              </div>
            </div>
          ),
        },
        replicaSet?.replicaSet.kind,
        {
          cell: (
            <div>
              <div>{replicaSet?.status}</div>
              {replicaSet.replicaSetScaleDownDeadline && (
                <div style={{ marginTop: '5px' }}>
                  <Ticker>
                    {(now) => {
                      const time = moment(replicaSet.replicaSetScaleDownDeadline).diff(
                        now.toDate(),
                        'second',
                      );
                      return time <= 0 ? null : (
                        <span>
                          <Label color="yellow">
                            <span style={{ marginRight: '5px' }}>{t('Scaling down in:')}</span>
                            <span>{formatDuration(time, 2)}</span>
                            <i style={{ marginLeft: '5px' }} className="fa fa-clock" />
                          </Label>
                        </span>
                      );
                    }}
                  </Ticker>
                </div>
              )}
            </div>
          ),
        },
        getAgeInMinutes(replicaSet?.replicaSet?.metadata?.creationTimestamp) + 'm',
        getStatusSection(replicaSet.statuses),
        {
          cell: (
            <RolloutRevisionRSActionsCell
              rollout={obj}
              index={rsIndex}
              replicaSet={replicaSet}
              onError={onRevisionError}
            />
          ),
        },
      ],
      ...{ children: podsChildren },
    });
    podsChildren = [];
  });
  rows.push(...rsChildren);
  return rows;
};

export const Revisions: React.FC<RevisionsProps> = ({ rollout, replicaSets, pods }) => {
  const [replicaSetInfo, setReplicaSetInfo] = React.useState<ReplicaSetInfo[]>([]);
  const { alerts, removeAlert, onRevisionError } = useRevisionAlerts();

  const selector: Selector = React.useMemo(
    () => getAnalysisRunSelector(resourceAsArray(replicaSets)),
    [replicaSets],
  );
  const [replicaSetModel] = useK8sModel({ group: 'apps', version: 'v1', kind: 'ReplicaSet' });

  const [analysisRuns] = useK8sWatchResource({
    groupVersionKind: { group: 'argoproj.io', version: 'v1alpha1', kind: 'AnalysisRun' },
    isList: true,
    namespaced: true,
    namespace: rollout.metadata?.namespace,
    selector: selector,
  });

  React.useEffect(() => {
    getReplicaSetInfo(
      rollout,
      resourceAsArray(replicaSets),
      pods as PodKind[],
      resourceAsArray(analysisRuns) as AnalysisRunKind[],
    ).then((result) => {
      setReplicaSetInfo(result.sort((a, b) => b.revision - a.revision));
    });
  }, [rollout, replicaSets, analysisRuns, pods]);

  const rows = getRowsDV(replicaSetInfo, replicaSetModel, rollout, onRevisionError);
  return (
    <>
      <Flex
        justifyContent={{ default: 'justifyContentFlexEnd' }}
        direction={{ default: 'column', sm: 'column', md: 'row', lg: 'row', xl: 'row' }}
        // className='pf-v6-c-table__td pf-v6-c-table__tree-view-title-cell'
        style={{ marginLeft: '20px', marginRight: '20px' }}
      >
        <Flex flex={{ default: 'flex_4', sm: 'flex_1' }} direction={{ default: 'column' }}>
          <FlexItem>
            <Title headingLevel="h2" className="co-section-heading">
              {t('Rollout Revisions')}
            </Title>
          </FlexItem>
        </Flex>
        <Flex>
          <FlexItem>
            <Toolbar>
              <ToolbarContent rowWrap={{ default: 'nowrap' }}>
                <ToolbarGroup variant="action-group">
                  <ToolbarItem>
                    <Button
                      variant="primary"
                      size="sm"
                      isDisabled={!isDeploying(rollout)}
                      onClick={() => {
                        promoteRollout(rollout, false).catch((err: unknown) => {
                          onRevisionError(err instanceof Error ? err : String(err), t('Promote'));
                        });
                      }}
                    >
                      {t('Promote')}
                    </Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      variant="primary"
                      size="sm"
                      isDisabled={!isDeploying(rollout)}
                      onClick={() => {
                        promoteRollout(rollout, true).catch((err: unknown) => {
                          onRevisionError(
                            err instanceof Error ? err : String(err),
                            t('Full Promote'),
                          );
                        });
                      }}
                    >
                      {t('Full Promote')}
                    </Button>
                  </ToolbarItem>
                  <ToolbarItem variant="separator"></ToolbarItem>
                  <ToolbarItem>
                    <Button
                      variant="primary"
                      size="sm"
                      isDisabled={!isDeploying(rollout)}
                      onClick={() => {
                        abortRollout(rollout).catch((err: unknown) => {
                          onRevisionError(err instanceof Error ? err : String(err), t('Abort'));
                        });
                      }}
                    >
                      {t('Abort')}
                    </Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      variant="primary"
                      size="sm"
                      isDisabled={rollout?.status?.phase !== RolloutStatus.Degraded}
                      onClick={() => {
                        retryRollout(rollout).catch((err: unknown) => {
                          onRevisionError(err instanceof Error ? err : String(err), t('Retry'));
                        });
                      }}
                    >
                      {t('Retry')}
                    </Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      variant="primary"
                      size="sm"
                      isDisabled={false}
                      onClick={() => {
                        restartRollout(rollout).catch((err: unknown) => {
                          onRevisionError(err instanceof Error ? err : String(err), t('Restart'));
                        });
                      }}
                    >
                      {t('Restart')}
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </ToolbarContent>
            </Toolbar>
          </FlexItem>
        </Flex>
      </Flex>
      <Divider style={{ marginTop: '20px' }} />
      <RevisionAlertGroup alerts={alerts} onRemove={removeAlert} />
      {rollout.metadata && (
        <DataViewTableTree
          className="gitops-revisions-table"
          isTreeTable
          borders={true}
          columns={getColumnsDV()}
          rows={rows}
          expandedIcon={<FolderOpenIcon aria-hidden />}
          collapsedIcon={<FolderIcon aria-hidden />}
        />
      )}
    </>
  );
};

const getImages = (images: ImageInfo[]) => {
  if (!images || images.length === 0) {
    return '-';
  }
  const imageNodes: React.ReactNode[] = [];
  images.forEach((image, index) => {
    imageNodes.push(
      <React.Fragment key={`image-${index}`}>
        <Tooltip content={image?.image}>
          <Label variant="outline" icon={<CubeIcon />}>
            {image?.image}
          </Label>
        </Tooltip>
      </React.Fragment>,
    );
  });
  return <LabelGroup>{imageNodes}</LabelGroup>;
};

export const getAnalysisRuns = (rsInfo: ReplicaSetInfo) => {
  if (!rsInfo.analysisRuns || rsInfo.analysisRuns.length === 0) {
    return '-';
  }
  const analysisRunNodes: React.ReactNode[] = [];
  rsInfo.analysisRuns.forEach((ar, index) => {
    analysisRunNodes.push(
      <React.Fragment key={`analysis-run-${index}`}>
        <AnalysisRunStatusFragment replicaSetInfo={rsInfo} analysisRunInfo={ar} />
      </React.Fragment>,
    );
  });
  return <LabelGroup>{analysisRunNodes}</LabelGroup>;
};

const getStatusSection = (statuses: ReplicaSetStatus[]) => {
  return (
    <LabelGroup>
      {statuses.includes(ReplicaSetStatus.Stable) && (
        <Label variant="outline" color="green" icon={<ArrowCircleUpIcon />}>
          {t('Stable')}
        </Label>
      )}
      {statuses.includes(ReplicaSetStatus.Active) && (
        <Label variant="outline" color="blue" icon={<RunningIcon />}>
          {t('Active')}
        </Label>
      )}
      {statuses.includes(ReplicaSetStatus.Preview) && (
        <Label variant="outline" icon={<EyeIcon />}>
          {t('Preview')}
        </Label>
      )}
      {statuses.includes(ReplicaSetStatus.Canary) && (
        <Label variant="outline" color="yellow" icon={<MigrationIcon />}>
          {t('Canary')}
        </Label>
      )}
    </LabelGroup>
  );
};

const getAgeInMinutes = (creationTimestamp: string) => {
  const currentTime = new Date().getTime();
  const creationTime = new Date(creationTimestamp).getTime() || 0;
  const age = currentTime - creationTime;
  const ageInMinutes = Math.floor(age / (1000 * 60));
  return ageInMinutes;
};
