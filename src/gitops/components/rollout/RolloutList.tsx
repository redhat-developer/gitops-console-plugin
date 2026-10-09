import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { AppProjectKind } from '@gitops/models/AppProjectModel';
import ActionsDropdown from '@gitops/utils/components/ActionDropDown/ActionDropDown';
import { isApplicationRefreshing } from '@gitops/utils/gitops';
import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { getSelectorSearchURL, modelToGroupVersionKind, modelToRef } from '@gitops/utils/utils';
import {
  Action,
  K8sResourceCommon,
  ListPageBody,
  ListPageCreate,
  ListPageFilter,
  ListPageHeader,
  RowFilter,
  Timestamp,
  useK8sWatchResource,
  useListPageFilter,
} from '@openshift-console/dynamic-plugin-sdk';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { ErrorState } from '@patternfly/react-component-groups';
import { EmptyState, EmptyStateBody, Spinner } from '@patternfly/react-core';
import type { DataViewTd } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon, SearchIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import {
  ShowOperandsInAllNamespacesRadioGroup,
  useShowOperandsInAllNamespaces,
} from '../shared/AllNamespaces';
import {
  type GitOpsManagedColumn,
  NAMESPACE_COLUMN_ID,
  useGitOpsColumnManagement,
} from '../shared/ColumnManagement';
import {
  GitOpsDataViewTable,
  useGitOpsDataViewSort,
  useGitOpsListPagePagination,
} from '../shared/DataView';
import { GitOpsListPageToolbar } from '../shared/GitOpsListPageToolbar';
import {
  filterByConsoleNameAndLabels,
  filterResourcesByLabelQuery,
  getLabelsSortKey,
  parseLabelFilterParam,
} from '../shared/listPageTextFilters';
import { MetadataLabels } from '../shared/MetadataLabels/MetadataLabels';
import {
  getRolloutManagedColumns,
  ROLLOUT_LIST_COLUMN_MANAGEMENT_ID,
} from '../shared/rolloutListColumns';

import { useRolloutActionsProvider } from './hooks/useRolloutActionsProvider';
import { RolloutKind, RolloutModel } from './model/RolloutModel';
import { RolloutStatus } from './utils/rollout-utils';
import { topologyLink } from './utils/TopologyLink';
import { RolloutStatusFragment } from './RolloutStatus';

import './rollout-list.scss';

type RolloutListTabProps = {
  namespace: string;
  project?: AppProjectKind;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
};

export function filterApp(project: AppProjectKind, rollout: K8sResourceCommon) {
  return function (app: RolloutKind) {
    if (project != undefined) {
      return app.metadata.namespace == project.metadata.name;
    } else if (rollout != undefined) {
      if (app.metadata.ownerReferences == undefined) return false;
      let matched = false;
      app.metadata.ownerReferences.forEach((owner) => {
        matched = owner.kind == rollout.kind && owner.name == rollout.metadata.name;
        if (matched) return;
      });
      return matched;
    }
    return true;
  };
}

const RolloutList: React.FC<RolloutListTabProps> = ({
  namespace,
  hideNameLabelFilters,
  showTitle,
}) => {
  const [showOperandsInAllNamespaces] = useShowOperandsInAllNamespaces();
  const listAllNamespaces =
    location.pathname?.includes('openshift-gitops-operator') && showOperandsInAllNamespaces;
  if (listAllNamespaces) {
    namespace = null;
  }
  const [rollouts, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'Rollout',
      version: 'v1alpha1',
    },
    namespaced: !listAllNamespaces,
    namespace,
  });

  const { t } = useGitOpsTranslation();
  const includeNamespaceColumn = !namespace;
  const managedColumns = React.useMemo(() => getRolloutManagedColumns(true, t), [t]);

  const { activeColumnIds, columnManagement, filterDataView } = useGitOpsColumnManagement({
    columnManagementID: ROLLOUT_LIST_COLUMN_MANAGEMENT_ID,
    columns: managedColumns,
    resourceType: t('Rollouts'),
    includeNamespaceColumn,
    showNamespaceHelp: includeNamespaceColumn,
  });

  const columnSortConfig = React.useMemo(
    () =>
      managedColumns.filter((column) => !column.alwaysShown).map((column) => ({ key: column.id })),
    [managedColumns],
  );

  const { searchParams, sortBy, direction, getSortParams } =
    useGitOpsDataViewSort(columnSortConfig);

  // Get search query from URL parameters
  const searchQuery = searchParams.get('q') || '';
  const nameQuery = searchParams.get('name') || '';
  const labelsParam = searchParams.get('labels') || '';

  const columnsDV = useColumnsDV(managedColumns, getSortParams, columnSortConfig, t);
  const sortedRollouts = React.useMemo(() => {
    return sortData(rollouts as RolloutKind[], sortBy, direction);
  }, [rollouts, sortBy, direction]);

  const filters = getFilters(t);
  const [data, filteredData, onFilterChange] = useListPageFilter(sortedRollouts, filters);

  const filteredByNameAndLabels = React.useMemo(
    () => filterByConsoleNameAndLabels(filteredData, nameQuery, parseLabelFilterParam(labelsParam)),
    [filteredData, nameQuery, labelsParam],
  );

  const filteredBySearch = React.useMemo(
    () => filterResourcesByLabelQuery(filteredByNameAndLabels, searchQuery),
    [filteredByNameAndLabels, searchQuery],
  );

  const { pagination, pagedItems, itemCount } = useGitOpsListPagePagination({
    items: filteredBySearch,
    namespace,
    searchParams,
  });
  const rows = useRolloutsRowsDV(pagedItems, managedColumns, t);
  const columnIds = React.useMemo(
    () => managedColumns.map((column) => column.id),
    [managedColumns],
  );
  const { columns: visibleColumnsDV, rows: visibleRows } = React.useMemo(
    () => filterDataView(columnsDV, rows, columnIds, activeColumnIds),
    [filterDataView, columnsDV, rows, columnIds, activeColumnIds],
  );

  const hasRollouts = sortedRollouts.length > 0;

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={visibleColumnsDV.length || columnsDV.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText={t('No Argo Rollouts')}>
            <EmptyStateBody>
              {namespace
                ? t('There are no Argo Rollouts in this project.')
                : t('There are no Argo Rollouts in all projects.')}
            </EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );
  const error = loadError && (
    <Tbody>
      <Tr key="loading" ouiaId={'table-tr-loading'}>
        <Td colSpan={visibleColumnsDV.length || columnsDV.length}>
          <ErrorState
            titleText={t('Unable to load data')}
            bodyText={t(
              'There was an error retrieving rollouts. Check your connection and reload the page.',
            )}
          />
        </Td>
      </Tr>
    </Tbody>
  );
  const isEmptyState = !loadError && visibleRows.length === 0;
  const topologyUrl = namespace
    ? '/topology/ns/' + namespace + '?view=graph'
    : '/topology/all-namespaces?view=graph';

  const listPageFilter = !hideNameLabelFilters && (
    <ListPageFilter
      data={data}
      loaded={loaded}
      rowFilters={filters}
      onFilterChange={onFilterChange}
    />
  );

  const topologyControl =
    filteredBySearch.length > 0 && !loadError ? (
      <span className="rollout-list-page__topology-link">{topologyLink(topologyUrl, t)}</span>
    ) : null;

  const columnAndTopologyControls =
    hasRollouts || topologyControl ? (
      <span className="rollout-list-page__column-controls">
        {hasRollouts ? columnManagement : null}
        {topologyControl}
      </span>
    ) : undefined;

  return (
    <>
      {showTitle == undefined && (
        <ListPageHeader
          title={t('Rollouts')}
          helpText={
            location.pathname?.includes('openshift-gitops-operator') ? (
              <ShowOperandsInAllNamespacesRadioGroup />
            ) : null
          }
        >
          <ListPageCreate groupVersionKind={modelToRef(RolloutModel)}>
            {t('Create Rollout')}
          </ListPageCreate>
        </ListPageHeader>
      )}
      <ListPageBody>
        {(hasRollouts || !hideNameLabelFilters) && (
          <GitOpsListPageToolbar
            filters={listPageFilter}
            columnManagement={columnAndTopologyControls}
          />
        )}
        <GitOpsDataViewTable
          columns={visibleColumnsDV}
          rows={visibleRows}
          isEmpty={isEmptyState}
          emptyState={empty}
          isError={!!loadError}
          errorState={error || undefined}
          itemCount={itemCount}
          pagination={pagination}
        />
      </ListPageBody>
    </>
  );
};

export const sortData = (
  data: RolloutKind[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
) => {
  return [...data].sort((a, b) => {
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
      case 'pods':
        aValue = a.status?.readyReplicas || '';
        bValue = b.status?.readyReplicas || '';
        break;
      case 'labels':
        aValue = getLabelsSortKey(a.metadata?.labels);
        bValue = getLabelsSortKey(b.metadata?.labels);
        break;
      case 'selector':
        aValue = a.status?.selector || '';
        bValue = b.status?.selector || '';
        break;
      case 'last-updated':
        aValue = a.metadata?.creationTimestamp || '';
        bValue = b.metadata?.creationTimestamp || '';
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

export const useColumnsDV = (
  managedColumns: GitOpsManagedColumn[],
  getSortParams: (columnIndex: number) => ThProps['sort'],
  columnSortConfig: { key: string }[],
  t: (key: string) => string,
): DataViewTh[] => {
  const titleById: Record<string, string> = {
    name: t('Name'),
    [NAMESPACE_COLUMN_ID]: t('Namespace'),
    status: t('Status'),
    pods: t('Pods'),
    labels: t('Labels'),
    selector: t('Selector'),
    'last-updated': t('Last Updated'),
    actions: '',
  };

  const widthById: Record<string, string> = {
    name: 'pf-m-width-25',
    [NAMESPACE_COLUMN_ID]: 'pf-m-width-15',
    status: 'pf-m-width-10',
    pods: 'pf-m-width-10',
    labels: 'pf-m-width-15',
    selector: 'pf-m-width-15',
    'last-updated': 'pf-m-width-15',
  };

  return managedColumns.map((column) => {
    if (column.id === 'actions') {
      return {
        cell: '',
        props: { 'aria-label': 'actions' },
      };
    }
    const sortIndex = columnSortConfig.findIndex((entry) => entry.key === column.id);
    return {
      cell: titleById[column.id] ?? column.title,
      props: {
        'aria-label': column.id,
        className: widthById[column.id],
        ...(sortIndex >= 0 ? { sort: getSortParams(sortIndex) } : {}),
      },
    };
  });
};

export const useRolloutsRowsDV = (
  rolloutsList: RolloutKind[],
  managedColumns: GitOpsManagedColumn[],
  t: (key: string) => string,
): DataViewTr[] => {
  const rows: DataViewTr[] = [];
  if (rolloutsList == undefined || rolloutsList.length == 0) {
    return rows;
  }
  rolloutsList.forEach((obj, index) => {
    const cellsById: Record<string, DataViewTd> = {
      name: {
        cell: (
          <div>
            <ResourceLink
              groupVersionKind={modelToGroupVersionKind(RolloutModel)}
              name={obj.metadata.name}
              namespace={obj.metadata.namespace}
              inline={true}
            >
              <span className="pf-v6-u-pl-sm">
                {isApplicationRefreshing(obj) && <Spinner size="sm" />}
              </span>
            </ResourceLink>
          </div>
        ),
        id: 'name',
        dataLabel: 'Name',
      },
      [NAMESPACE_COLUMN_ID]: {
        cell: <ResourceLink kind="Namespace" name={obj.metadata.namespace} />,
        id: obj.metadata.namespace,
        dataLabel: 'Namespace',
      },
      status: {
        id: 'status',
        cell: (
          <RolloutStatusFragment
            status={obj.status?.phase as RolloutStatus}
            message={
              obj?.status === undefined
                ? t(
                    'There is no rollout status. Check that the Rollout Manager is created and is available.',
                  )
                : undefined
            }
          />
        ),
      },
      pods: {
        id: 'pods',
        cell: (
          <>
            {obj.status && obj.status.readyReplicas && obj.status.replicas
              ? obj.status.readyReplicas + ' of ' + obj.status.replicas
              : '-'}
          </>
        ),
      },
      labels: {
        id: 'labels',
        dataLabel: 'Labels',
        cell: (
          <div>
            <MetadataLabels
              kind={RolloutModel.apiGroup + '~' + RolloutModel.apiVersion + '~' + RolloutModel.kind}
              labels={obj?.metadata?.labels}
              numLabels={3}
            />
          </div>
        ),
      },
      selector: {
        id: 'selector',
        cell: (
          <>
            {obj.status && obj.status.selector ? (
              <span style={{ display: 'inline', alignItems: 'center' }}>
                <SearchIcon className="pf-v6-u-pr-xs" />
                <Link
                  to={getSelectorSearchURL(
                    obj.metadata.namespace,
                    'argoproj.io~v1alpha1~Rollout',
                    obj.status.selector,
                  )}
                >
                  <span style={{ display: 'inline', alignItems: 'center', marginLeft: '5px' }}>
                    {obj.status.selector}
                  </span>
                </Link>
              </span>
            ) : (
              '-'
            )}
          </>
        ),
      },
      'last-updated': {
        id: 'last-updated',
        cell: (
          <>
            {obj.status && obj ? <Timestamp timestamp={obj?.metadata?.creationTimestamp} /> : '-'}
          </>
        ),
      },
      actions: {
        id: 'actions-' + index,
        cell: <RolloutActionsCell app={obj} index={index} />,
        props: { style: { paddingTop: 8, paddingRight: 0, paddingLeft: 0, width: 10 } },
      },
    };

    rows.push(managedColumns.map((column) => cellsById[column.id]));
  });
  return rows;
};

const RolloutActionsCell: React.FC<{
  app: RolloutKind;
  index: number;
}> = ({ app, index }) => {
  const actionList: [actions: Action[]] = useRolloutActionsProvider(app);
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

const getFilters = (t: (key: string) => string): RowFilter[] => [
  {
    filterGroupName: t('Rollout Status'),
    type: 'rollout-status',
    reducer: (rollout) => rollout.status?.phase,
    filter: (input, rollout) => {
      if (input.selected?.length && rollout?.status?.phase) {
        return input.selected.includes(rollout.status.phase);
      } else {
        return true;
      }
    },
    items: [
      { id: RolloutStatus.Healthy, title: RolloutStatus.Healthy },
      { id: RolloutStatus.Paused, title: RolloutStatus.Paused },
      { id: RolloutStatus.Progressing, title: RolloutStatus.Progressing },
      { id: RolloutStatus.Degraded, title: RolloutStatus.Degraded },
    ],
  },
];

export default RolloutList;
