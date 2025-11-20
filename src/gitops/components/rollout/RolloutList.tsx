import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';
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
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon, SearchIcon, TopologyIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import { GitOpsDataViewTable, useGitOpsDataViewSort } from '../shared/DataView';

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
  const columnSortConfig = React.useMemo(
    () =>
      [
        'name',
        ...(!namespace ? ['namespace'] : []),
        'status',
        'pods',
        'labels',
        'selector',
        'last-updated',
        'actions',
      ].map((key) => ({ key })),
    [namespace],
  );

  const { searchParams, sortBy, direction, getSortParams } =
    useGitOpsDataViewSort(columnSortConfig);

  // Get search query from URL parameters
  const searchQuery = searchParams.get('q') || '';

  const { t } = useGitOpsTranslation();

  const columnsDV = useColumnsDV(namespace, getSortParams);
  const sortedRollouts = React.useMemo(() => {
    return sortData(rollouts, sortBy, direction);
  }, [rollouts, sortBy, direction]);

  const filters = getFilters(t);
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
  const isEmptyState = !loadError && rows.length === 0;
  const topologyUrl = namespace
    ? '/topology/ns/' + namespace + '?view=graph'
    : '/topology/all-namespaces?view=graph';
  return (
    <>
      {showTitle == undefined && (
        <ListPageHeader
          title={t('Argo Rollouts')}
          badge={
            location.pathname?.includes('openshift-gitops-operator') ? null : <DevPreviewBadge />
          }
        >
          <ListPageCreate groupVersionKind={modelToRef(RolloutModel)}>
            {t('Create Rollout')}
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
                <Tooltip position="top" content={t('Topology view')}>
                  <Link
                    className="pf-v5-c-content"
                    rel="noopener noreferrer"
                    to={topologyUrl}
                    role="button"
                    aria-label={t('Graph view')}
                  >
                    <Button
                      icon={
                        <Icon size="md">
                          <TopologyIcon />
                        </Icon>
                      }
                      variant="plain"
                      aria-label={t('Topology view')}
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
        <GitOpsDataViewTable
          columns={columnsDV}
          rows={rows}
          isEmpty={isEmptyState}
          emptyState={empty}
          isError={!!loadError}
          errorState={error || undefined}
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

export const useColumnsDV = (
  namespace: string,
  getSortParams: (columnIndex: number) => ThProps['sort'],
) => {
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
            cell: t('Namespace'),
            props: {
              'aria-label': 'namespace',
              className: 'pf-m-width-15',
              sort: getSortParams(1),
            },
          },
        ]
      : []),
    {
      cell: t('Status'),
      props: {
        'aria-label': 'status',
        className: 'pf-m-width-10',
        sort: getSortParams(1 + i),
      },
    },
    {
      cell: t('Pods'),
      props: {
        'aria-label': 'pods',
        className: 'pf-m-width-10',
        sort: getSortParams(2 + i),
      },
    },
    {
      cell: t('Labels'),
      props: {
        'aria-label': 'labels',
        className: 'pf-m-width-15',
      },
    },
    {
      cell: t('Selector'),
      props: {
        'aria-label': 'selector',
        className: 'pf-m-width-15',
        sort: getSortParams(4 + i),
      },
    },
    {
      cell: t('Last Updated'),
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
  const { t } = useGitOpsTranslation();
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
    <span className="metadata-labels-no-labels">{t('No labels')}</span>
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
