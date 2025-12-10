import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { PodTraffic } from 'src/components/topology/console/pod-traffic';
import { podPhase } from 'src/components/topology/console/PodsOverview';
import { PodKind } from 'src/components/topology/console/types';
import { RolloutKind } from 'src/components/topology/types';

import { GitOpsDataViewTable, useGitOpsDataViewSort } from '@gitops/components/shared/DataView';
import ActionsDropdown from '@gitops/utils/components/ActionDropDown/ActionDropDown';
import {
  Action,
  K8sGroupVersionKind,
  K8sResourceCommon,
  ListPageBody,
  ListPageFilter,
  ListPageHeader,
  PrometheusEndpoint,
  ResourceLink,
  RowFilter,
  Selector,
  StatusComponent,
  Timestamp,
  useK8sWatchResource,
  useListPageFilter,
  usePrometheusPoll,
} from '@openshift-console/dynamic-plugin-sdk';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import { usePodActionsProvider } from '../../hooks/usePodActionsProvider';
import { topologyLink } from '../../utils/TopologyLink';

const useColumnsDV = (
  namespace: string,
  getSortParams: (columnIndex: number) => ThProps['sort'],
): DataViewTh[] => {
  const i: number = namespace ? 0 : 1;
  const { t } = useTranslation('plugin__gitops-plugin');
  const columns: DataViewTh[] = [
    {
      cell: t('Name'),
      props: {
        'aria-label': 'name',
        className: 'pf-m-width-20',
        sort: getSortParams(0),
      },
    },
    ...(!namespace
      ? [
          {
            cell: t('Namespace'),
            props: {
              'aria-label': 'namespace',
              className: 'pf-m-width-10',
              sort: getSortParams(1),
            },
          },
        ]
      : []),
    {
      cell: t('Traffic'),
      props: {
        'aria-label': 'traffic',
        className: 'pf-m-fit-content',
      },
    },
    {
      cell: t('Status'),
      props: {
        'aria-label': 'status',
        className: 'pf-m-fit-content',
        sort: getSortParams(1 + i),
      },
    },
    {
      cell: t('Ready'),
      props: {
        'aria-label': 'ready',
        className: 'pf-m-fit-content',
        sort: getSortParams(2 + i),
      },
    },
    {
      cell: t('Restarts'),
      props: {
        'aria-label': 'restarts',
        className: 'pf-m-fit-content',
        sort: getSortParams(3 + i),
      },
    },
    {
      cell: t('Owner'),
      props: {
        'aria-label': 'owner',
        className: 'pf-m-width-20',
        sort: getSortParams(4 + i),
      },
    },
    {
      cell: t('Memory'),
      props: {
        'aria-label': 'memory',
        className: 'pf-m-fit-content',
        sort: getSortParams(5 + i),
      },
    },
    {
      cell: t('CPU'),
      props: {
        'aria-label': 'cpu',
        className: 'pf-m-fit-content',
        sort: getSortParams(6 + i),
      },
    },
    {
      cell: t('Created At'),
      props: {
        'aria-label': 'created',
        className: 'pf-m-fit-content',
        sort: getSortParams(7 + i),
      },
    },
    {
      cell: ' ',
      props: {
        'aria-label': 'actions',
        className: 'pf-m-fit-content',
      },
    },
  ];
  return columns;
};

const sortData = (
  data: PodKind[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
  memResults: any,
  cpuResults: any,
) => {
  if (!(sortBy && direction)) return data;

  return [...data].sort((a, b) => {
    const { readyCount, totalContainers, restartCount } = podContainerStatuses(a);
    const {
      readyCount: readyCountB,
      totalContainers: totalContainersB,
      restartCount: restartCountB,
    } = podContainerStatuses(b);
    const aMemory = formatMemoryMetric(getMetric(a.metadata.name, memResults));
    const bMemory = formatMemoryMetric(getMetric(b.metadata.name, memResults));
    const aCpu = formatCPUMetric(getMetric(a.metadata.name, cpuResults));
    const bCpu = formatCPUMetric(getMetric(b.metadata.name, cpuResults));
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.metadata?.name || '';
        bValue = b.metadata?.name || '';
        break;
      case 'namespace':
        aValue = a.metadata?.namespace || '';
        bValue = b.metadata?.namespace || '';
        break;
      case 'status':
        aValue = a.status?.phase || '';
        bValue = b.status?.phase || '';
        break;
      case 'ready':
        aValue = readyCount + '/' + totalContainers || '';
        bValue = readyCountB + '/' + totalContainersB || '';
        break;
      case 'restarts':
        aValue = restartCount || '';
        bValue = restartCountB || '';
        break;
      case 'owner':
        aValue = a.metadata?.ownerReferences || '';
        bValue = b.metadata?.ownerReferences || '';
        break;
      case 'memory':
        aValue = aMemory;
        bValue = bMemory;
        break;
      case 'cpu':
        aValue = aCpu;
        bValue = bCpu;
        break;
      case 'created':
        aValue = a.metadata.creationTimestamp || '';
        bValue = b.metadata.creationTimestamp || '';
        break;
      default:
        return 0;
    }

    if (direction === 'asc') {
      // eslint-disable-next-line no-nested-ternary
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      // eslint-disable-next-line no-nested-ternary
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

const getFilters = (t: (key: string) => string): RowFilter[] => [
  {
    filterGroupName: t('Health Status'),
    type: 'app-health',
    reducer: (pod) => pod.status?.phase,
    filter: (input, pod) => {
      if (input.selected?.length && pod?.status?.phase) {
        return input.selected.includes(pod.status.phase);
      } else {
        return true;
      }
    },
    items: [
      { id: PodStatus.RUNNING, title: PodStatus.RUNNING },
      { id: PodStatus.PENDING, title: PodStatus.PENDING },
      { id: PodStatus.TERMINATING, title: PodStatus.TERMINATING },
      { id: PodStatus.CRASHLOOPBACKOFF, title: PodStatus.CRASHLOOPBACKOFF },
      { id: PodStatus.COMPLETED, title: PodStatus.COMPLETED },
      { id: PodStatus.FAILED, title: PodStatus.FAILED },
      { id: PodStatus.UNKNOWN, title: PodStatus.UNKNOWN },
    ],
  },
];

const usePodRowsDV = (podsList: PodKind[], memResults, cpuResults, namespace): DataViewTr[] => {
  const rows: DataViewTr[] = [];

  podsList.forEach((obj, index) => {
    const status = podPhase(obj);
    const { readyCount, totalContainers, restartCount } = podContainerStatuses(obj);
    rows.push([
      {
        cell: (
          <span>
            <ResourceLink
              groupVersionKind={gvk}
              name={obj.metadata.name}
              namespace={obj.metadata.namespace}
              inline={true}
            />
          </span>
        ),
        id: obj.metadata?.name,
        dataLabel: 'Name',
      },
      ...(!namespace
        ? [
            {
              cell: <ResourceLink kind="Namespace" name={obj.metadata.namespace} />,
              id: obj.metadata.namespace,
              dataLabel: 'Namespace',
            },
          ]
        : []),
      {
        id: obj.metadata?.name + '-traffic-' + index,
        cell: (
          <PodTraffic podName={obj.metadata.name} namespace={obj.metadata.namespace} tooltipFlag />
        ),
      },
      {
        id: obj.status?.phase,
        cell: <StatusComponent status={status} />,
      },
      {
        id: 'ready-' + index,
        cell: <>{readyCount + '/' + totalContainers}</>,
      },
      {
        id: 'restart-' + index,
        cell: <>{restartCount}</>,
      },
      {
        id: 'owner-' + index,
        cell: (
          <>
            {obj.metadata?.ownerReferences
              ? obj.metadata?.ownerReferences?.map((owner, i) => (
                  <React.Fragment key={`${owner.kind}-${owner.name}-${i}`}>
                    <ResourceLink kind={owner.kind} name={owner.name} />
                    <br />
                  </React.Fragment>
                ))
              : '-'}
          </>
        ),
      },
      {
        id: 'memory-' + index,
        cell: (
          <>
            {memResults && (
              <span>{formatMemoryMetric(getMetric(obj.metadata.name, memResults))}</span>
            )}
          </>
        ),
      },
      {
        id: 'cpu-' + index,
        cell: (
          <>
            {cpuResults && <span>{formatCPUMetric(getMetric(obj.metadata.name, cpuResults))}</span>}
          </>
        ),
      },
      {
        id: 'created-' + index,
        cell: <Timestamp timestamp={obj.metadata.creationTimestamp} />,
      },
      {
        id: 'actions-' + index,
        cell: <PodRowActions pod={obj} />,
        props: { className: 'dropdown-kebab-pf pf-c-table__action' },
      },
    ]);
  });
  return rows;
};

const PodRowActions: React.FC<{
  pod: PodKind;
}> = ({ pod }) => {
  const actionList: [actions: Action[]] = usePodActionsProvider(pod);
  return (
    <div style={{ textAlign: 'right' }}>
      <ActionsDropdown
        actions={actionList ? actionList[0] : []}
        id="gitops-rollout-actions"
        isKebabToggle={true}
      />
    </div>
  );
};

type PodListProps = {
  rollout: RolloutKind;
  namespace: string;
  selector: Selector;
};

const gvk: K8sGroupVersionKind = {
  kind: 'Pod',
  version: 'v1',
};

enum PodStatus {
  RUNNING = 'Running',
  COMPLETED = 'Completed',
  PENDING = 'Pending',
  TERMINATING = 'Terminating',
  FAILED = 'Failed',
  UNKNOWN = 'Unknown',
  CRASHLOOPBACKOFF = 'CrashLoopBackOff',
}

const podContainerStatuses = (
  pod: any,
): { readyCount: number; totalContainers: number; restartCount: number } => {
  // Don't include init containers in readiness count. This is consistent with the CLI.
  const containerStatuses = pod?.status?.containerStatuses || [];
  return containerStatuses.reduce(
    (acc, { ready, restartCount }) => {
      if (ready) {
        acc.readyCount = acc.readyCount + 1;
      }
      acc.restartCount = acc.restartCount + restartCount;
      return acc;
    },
    { readyCount: 0, totalContainers: containerStatuses.length, restartCount: 0 },
  );
};

export const PodList: React.FC<PodListProps> = ({ rollout, namespace, selector }) => {
  const { t } = useTranslation('plugin__gitops-plugin');

  const [pods, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: gvk,
    namespaced: true,
    namespace,
    selector: selector,
  });

  const columnSortConfig = React.useMemo(
    () =>
      [
        'name',
        ...(!namespace ? ['namespace'] : []),
        'status',
        'ready',
        'restarts',
        'owner',
        'memory',
        'cpu',
        'created',
        'actions',
      ].map((key) => ({ key })),
    [namespace],
  );
  const { searchParams, sortBy, direction, getSortParams } =
    useGitOpsDataViewSort(columnSortConfig);

  // Get search query from URL parameters
  const searchQuery = searchParams.get('q') || '';

  const [memResults] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    query:
      "sum(container_memory_working_set_bytes{namespace='" +
      namespace +
      "',container=''}) BY (pod, namespace)",
  });

  const [cpuResults] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    query: "pod:container_cpu_usage:sum{namespace='" + namespace + "'}",
  });

  const columnsDV = useColumnsDV(namespace, getSortParams);
  const sortedPods = React.useMemo(() => {
    return sortData(pods as PodKind[], sortBy, direction, memResults, cpuResults);
  }, [pods, sortBy, direction, memResults, cpuResults]);

  const podFilters = React.useMemo(() => getFilters(t), [t]);
  const [data, filteredData, onFilterChange] = useListPageFilter(sortedPods, podFilters);

  // Filter by search query if present (after other filters)
  const filteredBySearch = React.useMemo(() => {
    if (!searchQuery) return filteredData;

    return filteredData.filter((pod) => {
      const labels = pod.metadata?.labels || {};
      // Check if any label matches the search query
      return Object.entries(labels).some(([key, value]) => {
        const labelSelector = `${key}=${value}`;
        return labelSelector.includes(searchQuery) || key.includes(searchQuery);
      });
    });
  }, [filteredData, searchQuery]);

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText={t('No pods')}>
            <EmptyStateBody>{t('There are no pods associated with the rollout.')}</EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );

  const isEmptyState = !loadError && filteredBySearch.length === 0;

  const rows = usePodRowsDV(filteredBySearch, memResults, cpuResults, namespace);

  const topologyUrl = rollout?.metadata?.namespace
    ? '/topology/ns/' +
      rollout?.metadata?.namespace +
      '?view=graph&selectId=' +
      rollout?.metadata?.uid
    : '/topology/all-namespaces?view=graph&selectId=' + rollout?.metadata?.uid;

  return (
    <div>
      <ListPageHeader
        title={'Pods'}
        hideFavoriteButton={true}
        badge={topologyLink(topologyUrl, t)}
      />
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={loaded}
          rowFilters={podFilters}
          onFilterChange={onFilterChange}
        />
        <GitOpsDataViewTable
          columns={columnsDV}
          rows={rows}
          isEmpty={isEmptyState}
          emptyState={empty}
          isError={!!loadError}
        />
      </ListPageBody>
    </div>
  );
};

function getMetric(podName: string, results): string {
  let value = '-';
  if (results.data) {
    results.data.result.forEach((result) => {
      if (result.metric.pod == podName) {
        value = '' + result.value[1];
      }
    });
  }
  return value;
}

function formatMemoryMetric(value: string) {
  let metric = Number(value);
  metric = metric / 1024;
  if (metric < 100) return metric.toFixed(1) + ' KiB';
  metric = metric / 1024;
  if (metric < 100) return metric.toFixed(1) + ' MiB';
  metric = metric / 1024;
  if (metric < 100) return metric.toFixed(1) + ' GiB';
}

function formatCPUMetric(value: string) {
  const metric: number = Number(value) * 1000;
  return metric.toFixed(3) + ' cores';
}
