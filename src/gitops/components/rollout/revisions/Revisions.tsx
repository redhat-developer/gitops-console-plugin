import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { PodKind } from 'src/components/topology/console/types';

import { getPodStatus } from '@gitops/components/shared/pod-utils';
import { isApplicationRefreshing } from '@gitops/utils/gitops';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { getResourceUrl, modelToGroupVersionKind, resourceAsArray } from '@gitops/utils/utils';
import {
  K8sModel,
  ResourceLink,
  Selector,
  useK8sModel,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Label, LabelGroup, Spinner, Tooltip } from '@patternfly/react-core';
import { DataViewTh, DataViewTrTree } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import DataViewTableTree from '@patternfly/react-data-view/dist/esm/DataViewTableTree';
import { FolderIcon, FolderOpenIcon } from '@patternfly/react-icons';
import ArrowCircleUpIcon from '@patternfly/react-icons/dist/esm/icons/arrow-circle-up-icon';
import { CubeIcon } from '@patternfly/react-icons/dist/esm/icons/cube-icon';
import { EyeIcon } from '@patternfly/react-icons/dist/esm/icons/eye-icon';
import { MigrationIcon } from '@patternfly/react-icons/dist/esm/icons/migration-icon';
import { RunningIcon } from '@patternfly/react-icons/dist/esm/icons/running-icon';

import { AnalysisRunStatusFragment } from '../components/AnalysisRunStatus/AnalysisRunStatus';
import { AnalysisRunKind } from '../model/AnalysisRunModel';
import { ReplicaSetKind, RolloutKind, RolloutModel } from '../model/RolloutModel';

import {
  getAnalysisRunSelector,
  getReplicaSetInfo,
  ImageInfo,
  ReplicaSetInfo,
  ReplicaSetStatus,
} from './ReplicaSetInfo';

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
  ];
  return columns;
};

const getRowsDV = (
  replicaSetInfo: ReplicaSetInfo[],
  replicaSetModel: K8sModel,
  obj: RolloutKind,
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
          namespace={obj.metadata?.namespace}
          inline={true}
        >
          <span className="pf-u-pl-sm">
            {isApplicationRefreshing(obj) && <Spinner size="sm" />}
          </span>
        </ResourceLink>
      </div>,
      obj.kind,
      obj.status?.phase,
      getAgeInMinutes(obj.metadata?.creationTimestamp) + 'm',
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
        replicaSet?.status,
        getAgeInMinutes(replicaSet?.replicaSet?.metadata?.creationTimestamp) + 'm',
        getStatusSection(replicaSet.statuses),
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

  const rows = getRowsDV(replicaSetInfo, replicaSetModel, rollout);
  return (
    <>
      {rollout.metadata && (
        <DataViewTableTree
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
            {image?.name}
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
        <Label variant="outline" color="blue" icon={<ArrowCircleUpIcon />}>
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
