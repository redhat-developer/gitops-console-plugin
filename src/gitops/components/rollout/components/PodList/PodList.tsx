import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  type GitOpsManagedColumn,
  buildManagedDataViewColumns,
  useGitOpsManagedDataView,
} from '@gitops/components/shared/ColumnManagement';
import {
  GitOpsDataViewTable,
  useGitOpsDataViewSort,
  useGitOpsListPagePagination,
} from '@gitops/components/shared/DataView';
import { GitOpsListPageToolbar } from '@gitops/components/shared/GitOpsListPageToolbar';
import {
  getRolloutPodsManagedColumns,
  ROLLOUT_PODS_COLUMN_MANAGEMENT_ID,
} from '@gitops/components/shared/rolloutPodColumns';
import { PodTraffic } from '@gitops/topology/console/pod-traffic';
import { podPhase } from '@gitops/topology/console/PodsOverview';
import { PodKind } from '@gitops/topology/console/types';
import { RolloutKind } from '@gitops/topology/types';
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
import { DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import { usePodActionsProvider } from '../../hooks/usePodActionsProvider';
import { topologyLink } from '../../utils/TopologyLink';

const useColumnsDV = (
  managedColumns: GitOpsManagedColumn[],
  getSortParams: (columnIndex: number) => ThProps['sort'],
  columnSortConfig: { key: string }[],
  t: (key: string) => string,
) =>
  buildManagedDataViewColumns(
    managedColumns,
    {
      name: t('Name'),
      namespace: t('Namespace'),
      traffic: t('Traffic'),
      status: t('Status'),
      ready: t('Ready'),
      restarts: t('Restarts'),
      owner: t('Owner'),
      memory: t('Memory'),
      cpu: t('CPU'),
      created: t('Created At'),
      actions: '',
    },
    getSortParams,
    columnSortConfig,
  );

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

const usePodRowsDV = (
  podsList: PodKind[],
  memResults,
  cpuResults,
  managedColumns: GitOpsManagedColumn[],
): DataViewTr[] => {
  const rows: DataViewTr[] = [];

  podsList.forEach((obj, index) => {
    const status = podPhase(obj);
    const { readyCount, totalContainers, restartCount } = podContainerStatuses(obj);
    const cellsById = {
      name: {
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
      namespace: {
        cell: <ResourceLink kind="Namespace" name={obj.metadata.namespace} />,
        id: obj.metadata.namespace,
        dataLabel: 'Namespace',
      },
      traffic: {
        id: obj.metadata?.name + '-traffic-' + index,
        cell: (
          <PodTraffic podName={obj.metadata.name} namespace={obj.metadata.namespace} tooltipFlag />
        ),
      },
      status: {
        id: obj.status?.phase,
        cell: <StatusComponent status={status} />,
      },
      ready: {
        id: 'ready-' + index,
        cell: <>{readyCount + '/' + totalContainers}</>,
      },
      restarts: {
        id: 'restart-' + index,
        cell: <>{restartCount}</>,
      },
      owner: {
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
      memory: {
        id: 'memory-' + index,
        cell: (
          <>
            {memResults && (
              <span>{formatMemoryMetric(getMetric(obj.metadata.name, memResults))}</span>
            )}
          </>
        ),
      },
      cpu: {
        id: 'cpu-' + index,
        cell: (
          <>
            {cpuResults && <span>{formatCPUMetric(getMetric(obj.metadata.name, cpuResults))}</span>}
          </>
        ),
      },
      created: {
        id: 'created-' + index,
        cell: <Timestamp timestamp={obj.metadata.creationTimestamp} />,
      },
      actions: {
        id: 'actions-' + index,
        cell: <PodRowActions pod={obj} index={index} />,
      },
    };

    rows.push(managedColumns.map((column) => cellsById[column.id]));
  });
  return rows;
};

const PodRowActions: React.FC<{
  pod: PodKind;
  index: number;
}> = ({ pod, index }) => {
  const actionList: [actions: Action[]] = usePodActionsProvider(pod);
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
  const includeNamespaceColumn = !namespace;
  const managedColumns = React.useMemo(
    () => getRolloutPodsManagedColumns(includeNamespaceColumn, t),
    [includeNamespaceColumn, t],
  );

  const [pods, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: gvk,
    namespaced: true,
    namespace,
    selector: selector,
  });

  const columnSortConfig = React.useMemo(
    () =>
      managedColumns
        .filter((column) => !column.alwaysShown && column.id !== 'traffic')
        .map((column) => ({ key: column.id })),
    [managedColumns],
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

  const columnsDV = useColumnsDV(managedColumns, getSortParams, columnSortConfig, t);
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

  const {
    pagination,
    pagedItems: pagedPods,
    itemCount,
  } = useGitOpsListPagePagination({
    items: filteredBySearch,
    namespace,
    searchParams,
  });

  const rows = usePodRowsDV(pagedPods, memResults, cpuResults, managedColumns);
  const {
    columns,
    rows: visibleRows,
    columnManagement,
    tableID,
  } = useGitOpsManagedDataView({
    columnManagementID: ROLLOUT_PODS_COLUMN_MANAGEMENT_ID,
    managedColumns,
    resourceType: t('Pod'),
    includeNamespaceColumn,
    columns: columnsDV,
    rows,
  });

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columns.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText={t('No pods')}>
            <EmptyStateBody>{t('There are no pods associated with the rollout.')}</EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );

  const isEmptyState = !loadError && filteredBySearch.length === 0;

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
        <GitOpsListPageToolbar
          filters={
            <ListPageFilter
              data={data}
              loaded={loaded}
              rowFilters={podFilters}
              onFilterChange={onFilterChange}
            />
          }
          columnManagement={columnManagement}
        />
        <GitOpsDataViewTable
          columns={columns}
          rows={visibleRows}
          tableID={tableID}
          isEmpty={isEmptyState}
          emptyState={empty}
          isError={!!loadError}
          itemCount={itemCount}
          pagination={pagination}
        />
      </ListPageBody>
    </div>
  );
};

function getMetric(podName: string, results): string {
  let value = '-';
  if (results?.data) {
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
