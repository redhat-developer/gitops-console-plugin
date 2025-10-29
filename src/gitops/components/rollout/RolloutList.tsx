import * as React from 'react';
import { Link, useSearchParams } from 'react-router-dom-v5-compat';
import classNames from 'classnames';
import DevPreviewBadge from 'src/components/import/badges/DevPreviewBadge';

import { AppProjectKind } from '@gitops/models/AppProjectModel';
import ActionsDropdown from '@gitops/utils/components/ActionDropDown/ActionDropDown';
import { isApplicationRefreshing } from '@gitops/utils/gitops';
import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import {
  getSelectorSearchURL,
  kindForReference,
  modelToGroupVersionKind,
  modelToRef,
} from '@gitops/utils/utils';
import {
  Action,
  K8sResourceCommon,
  K8sResourceKindReference,
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
import {
  Button,
  EmptyState,
  EmptyStateBody,
  Icon,
  LabelGroup,
  Spinner,
  Tooltip,
} from '@patternfly/react-core';
import { Label as PfLabel } from '@patternfly/react-core';
import DataView, { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import DataViewTable, {
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { useDataViewSort } from '@patternfly/react-data-view/dist/esm/Hooks';
import { CubesIcon, SearchIcon, TopologyIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import { useRolloutActionsProvider } from './hooks/useRolloutActionsProvider';
import { RolloutKind, RolloutModel } from './model/RolloutModel';
import { RolloutStatus } from './utils/rollout-utils';
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
  const [rollouts, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'Rollout',
      version: 'v1alpha1',
    },
    namespaced: true,
    namespace,
  });
  const initIndex: number = namespace ? 0 : 1;
  const COLUMNS_KEYS_INDEXES = React.useMemo(
    () => [
      { key: 'name', index: 0 },
      ...(!namespace ? [{ key: 'namespace', index: 1 }] : []),
      { key: 'status', index: 1 + initIndex },
      { key: 'pods', index: 2 + initIndex },
      { key: 'labels', index: 3 + initIndex },
      { key: 'selector', index: 4 + initIndex },
      { key: 'last-updated', index: 5 + initIndex },
    ],
    [namespace, initIndex],
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const { sortBy, direction, onSort } = useDataViewSort({ searchParams, setSearchParams });
  const sortByIndex = React.useMemo(
    () => COLUMNS_KEYS_INDEXES.findIndex((item) => item.key === sortBy),
    [COLUMNS_KEYS_INDEXES, sortBy],
  );

  // Get search query from URL parameters
  const searchQuery = searchParams.get('q') || '';

  const { t } = useGitOpsTranslation();

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: sortByIndex,
      direction,
      defaultDirection: 'asc',
    },
    onSort: (_event: any, index: number, dir: 'asc' | 'desc') => {
      onSort(_event, COLUMNS_KEYS_INDEXES[index].key, dir);
    },
    columnIndex,
  });
  const columnsDV = useColumnsDV(namespace, getSortParams);
  const sortedRollouts = React.useMemo(() => {
    return sortData(rollouts, sortBy, direction);
  }, [rollouts, sortBy, direction]);

  const [data, filteredData, onFilterChange] = useListPageFilter(sortedRollouts, filters);

  // TODO: use alternate filter since it is deprecated. See DataTableView potentially
  // Filter by search query if present (after other filters)
  const filteredBySearch = React.useMemo(() => {
    if (!searchQuery) return filteredData;

    return filteredData.filter((app) => {
      const labels = app.metadata?.labels || {};
      // Check if any label matches the search query
      return Object.entries(labels).some(([key, value]) => {
        const labelSelector = `${key}=${value}`;
        return labelSelector.includes(searchQuery) || key.includes(searchQuery);
      });
    });
  }, [filteredData, searchQuery]);

  const rows = useRolloutsRowsDV(filteredBySearch, namespace);

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
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
        <Td colSpan={columnsDV.length}>
          <ErrorState
            titleText={t('Unable to load data')}
            bodyText={t(
              'There was an error retrieving applications. Check your connection and reload the page.',
            )}
          />
        </Td>
      </Tr>
    </Tbody>
  );
  let currentActiveState = null;
  if (loadError) {
    currentActiveState = DataViewState.error;
  } else if (rows.length === 0) {
    currentActiveState = DataViewState.empty;
  }
  const topologyUrl = namespace
    ? '/topology/ns/' + namespace + '?view=graph'
    : '/topology/all-namespaces?view=graph';
  return (
    <>
      {showTitle == undefined && (
        <ListPageHeader
          title={'Rollouts'}
          badge={
            location.pathname?.includes('openshift-gitops-operator') ? null : <DevPreviewBadge />
          }
        >
          <ListPageCreate groupVersionKind={modelToRef(RolloutModel)}>
            Create Rollout
          </ListPageCreate>
        </ListPageHeader>
      )}
      <ListPageBody>
        {!hideNameLabelFilters && (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <span>
              <ListPageFilter
                data={data}
                loaded={loaded}
                rowFilters={filters}
                onFilterChange={onFilterChange}
              />
            </span>
            {rows.length > 0 && !loadError && (
              <span className="rollout-list-page__topology-link pf-m-mb-sm">
                <Tooltip position="top" content={'Topology view'}>
                  <Link
                    className="pf-v5-c-content"
                    rel="noopener noreferrer"
                    to={topologyUrl}
                    role="button"
                    aria-label={'Graph view'}
                  >
                    <Button
                      icon={
                        <Icon size="md">
                          <TopologyIcon />
                        </Icon>
                      }
                      variant="plain"
                      aria-label={'Topology view'}
                      className="pf-m-plain odc-topology__view-switcher"
                      data-test-id="topology-switcher-view"
                      onClick={() => console.log('Topology view')}
                    ></Button>
                  </Link>
                </Tooltip>
              </span>
            )}
          </span>
        )}
        {
          <DataView activeState={currentActiveState}>
            <DataViewTable
              columns={columnsDV}
              rows={rows}
              bodyStates={loadError ? { error } : { empty }}
            />
          </DataView>
        }
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
        aValue = a.metadata?.labels || '';
        bValue = b.metadata?.labels || '';
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

export const useColumnsDV = (namespace, getSortParams) => {
  const i: number = namespace ? 0 : 1;
  const { t } = useGitOpsTranslation();
  const columns: DataViewTh[] = [
    {
      cell: t('Name'),
      props: {
        'aria-label': 'name',
        className: 'pf-m-width-25',
        sort: getSortParams(0),
      },
    },
    ...(!namespace
      ? [
          {
            cell: 'Namespace',
            props: {
              'aria-label': 'namespace',
              className: 'pf-m-width-15',
              sort: getSortParams(1),
            },
          },
        ]
      : []),
    {
      cell: 'Status',
      props: {
        'aria-label': 'status',
        className: 'pf-m-width-10',
        sort: getSortParams(1 + i),
      },
    },
    {
      cell: 'Pods',
      props: {
        'aria-label': 'pods',
        className: 'pf-m-width-10',
        sort: getSortParams(2 + i),
      },
    },
    {
      cell: 'Labels',
      props: {
        'aria-label': 'labels',
        className: 'pf-m-width-15',
      },
    },
    {
      cell: 'Selector',
      props: {
        'aria-label': 'selector',
        className: 'pf-m-width-15',
        sort: getSortParams(4 + i),
      },
    },
    {
      cell: 'Last Updated',
      props: {
        'aria-label': 'last updated',
        className: 'pf-m-width-15',
        sort: getSortParams(5 + i),
      },
    },
    {
      cell: '',
      props: { 'aria-label': 'actions' },
    },
  ];

  return columns;
};

type MetadataLabelsProps = {
  kind: K8sResourceKindReference;
  labels?: { [key: string]: string };
};

const MetadataLabels: React.FC<MetadataLabelsProps> = ({ kind, labels }) => {
  return labels && Object.keys(labels).length > 0 ? (
    <LabelGroup numLabels={10} className="co-label-group metadata-labels-group">
      {Object.keys(labels || {})?.map((key) => {
        return (
          <LabelL key={key} kind={kind} name={key} value={labels[key]} expand={true}>
            {labels[key] ? `${key}=${labels[key]}` : key}
          </LabelL>
        );
      })}
    </LabelGroup>
  ) : (
    <span className="metadata-labels-no-labels">No labels</span>
  );
};

type LabelProps = {
  kind: K8sResourceKindReference;
  name: string;
  value: string;
  expand: boolean;
};

const LabelL: React.SFC<LabelProps> = ({ kind, name, value, expand }) => {
  const selector = value ? `${name}=${value}` : name;
  const href = getSelectorSearchURL('', kind, selector);
  const kindOf = `co-m-${kindForReference(kind.toLowerCase())}`;
  const klass = classNames(kindOf, { 'co-m-expand': expand }, 'co-label');
  return (
    <>
      <PfLabel className={klass} color={'blue'} href={href}>
        <span className="co-label__key" data-test="label-key">
          {name}
        </span>
        {value && <span className="co-label__eq">=</span>}
        {value && <span className="co-label__value">{value}</span>}
      </PfLabel>
    </>
  );
};

export const useRolloutsRowsDV = (rolloutsList, namespace): DataViewTr[] => {
  const rows: DataViewTr[] = [];
  if (rolloutsList == undefined || rolloutsList.length == 0) {
    return rows;
  }
  rolloutsList.forEach((obj, index) => {
    rows.push([
      {
        cell: (
          <div>
            <ResourceLink
              groupVersionKind={modelToGroupVersionKind(RolloutModel)}
              name={obj.metadata.name}
              namespace={obj.metadata.namespace}
              inline={true}
            >
              <span className="pf-u-pl-sm">
                {isApplicationRefreshing(obj) && <Spinner size="sm" />}
              </span>
            </ResourceLink>
          </div>
        ),
        id: 'name',
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
        id: 'status',
        cell: <RolloutStatusFragment status={obj.status?.phase as RolloutStatus} />,
      },
      {
        id: 'pods',
        cell: (
          <>
            {obj.status && obj.status.readyReplicas && obj.status.replicas
              ? obj.status.readyReplicas + ' of ' + obj.status.replicas
              : '-'}
          </>
        ),
      },
      {
        id: 'labels',
        cell: (
          <div className="pf-m-width-40">
            <MetadataLabels
              kind={RolloutModel.apiGroup + '~' + RolloutModel.apiVersion + '~' + RolloutModel.kind}
              labels={obj?.metadata?.labels}
            />
          </div>
        ),
      },
      {
        id: 'selector',
        cell: (
          <>
            {obj.status && obj.status.selector ? (
              <span style={{ display: 'inline', alignItems: 'center' }}>
                <SearchIcon className="pf-u-pr-xs" />
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
      {
        id: 'last-updated',
        cell: (
          <>
            {obj.status && obj ? <Timestamp timestamp={obj?.metadata?.creationTimestamp} /> : '-'}
          </>
        ),
      },
      {
        id: 'actions-' + index,
        cell: <RolloutActionsCell app={obj} />,
        props: { style: { paddingTop: 8, paddingRight: 0, paddingLeft: 0, width: 10 } },
      },
    ]);
  });
  return rows;
};

const RolloutActionsCell: React.FC<{
  app: RolloutKind;
}> = ({ app }) => {
  const actionList: [actions: Action[]] = useRolloutActionsProvider(app);
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

const filters: RowFilter[] = [
  {
    filterGroupName: 'Rollout Status',
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
