import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom-v5-compat';
import DevPreviewBadge from 'src/components/import/badges/DevPreviewBadge';

import {
  Action,
  K8sResourceCommon,
  ListPageBody,
  ListPageCreate,
  ListPageFilter,
  ListPageHeader,
  ResourceLink,
  RowFilter,
  useK8sWatchResource,
  useListPageFilter,
} from '@openshift-console/dynamic-plugin-sdk';
import { EmptyState, EmptyStateBody, Flex, FlexItem, Spinner } from '@patternfly/react-core';
import {
  DataViewTable,
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/dynamic/DataViewTable';
import { useDataViewSort } from '@patternfly/react-data-view/dist/dynamic/Hooks';
import DataView, { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import { useApplicationActionsProvider } from '../..//hooks/useApplicationActionsProvider';
import RevisionFragment from '../..//Revision/Revision';
import HealthStatusFragment from '../..//Statuses/HealthStatus';
import { HealthStatus, SyncStatus } from '../..//utils/constants';
import {
  ApplicationKind,
  ApplicationModel,
  ApplicationSource,
} from '../../models/ApplicationModel';
import { AppProjectKind } from '../../models/AppProjectModel';
import { OperationState } from '../../Statuses/OperationState';
import SyncStatusFragment from '../../Statuses/SyncStatus';
import ActionsDropdown from '../../utils/components/ActionDropDown/ActionDropDown';
import { isApplicationRefreshing } from '../../utils/gitops';
import { modelToGroupVersionKind, modelToRef } from '../../utils/utils';

interface ApplicationProps {
  namespace: string;
  // Here to support plugging in view in Projects (i.e. show list of apps that belong to project)
  // Needs the console API to support defining your own static filter though since neither a label
  // or a field-selector is available to select just the project apps based on k8s watch api.
  project?: AppProjectKind;
  appset?: K8sResourceCommon;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
}

function filterApp(project: AppProjectKind, appset: K8sResourceCommon) {
  return function (app: ApplicationKind) {
    if (project != undefined) {
      return app.spec.project == project.metadata.name;
    } else if (appset != undefined) {
      if (app.metadata.ownerReferences == undefined) return false;
      let matched = false;
      app.metadata.ownerReferences.forEach((owner) => {
        matched = owner.kind == appset.kind && owner.name == appset.metadata.name;
        if (matched) return;
      });
      return matched;
    }
    return true;
  };
}

const ApplicationList: React.FC<ApplicationProps> = ({
  namespace,
  project,
  appset,
  hideNameLabelFilters,
  showTitle,
}) => {
  const [applications, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'Application',
      version: 'v1alpha1',
    },
    namespaced: true,
    namespace,
  });

  const { t } = useTranslation('plugin__gitops-plugin');
  const initIndex: number = namespace ? 0 : 1;
  const COLUMNS_KEYS_INDEXES = React.useMemo(
    () => [
      { key: 'name', index: 0 },
      ...(!namespace ? [{ key: 'namespace', index: 1 }] : []),
      { key: 'sync-status', index: 1 + initIndex },
      { key: 'health-status', index: 2 + initIndex },
      { key: 'revision', index: 3 + initIndex },
      { key: 'project', index: 4 + initIndex },
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

  const getSortParams = (columnIndex: number): ThProps['sort'] => ({
    sortBy: {
      index: sortByIndex,
      direction,
      defaultDirection: 'asc',
    },
    onSort: (_event: any, index: number, dir) => {
      onSort(_event, COLUMNS_KEYS_INDEXES[index].key, dir);
    },
    columnIndex,
  });

  const columnsDV = useColumnsDV(namespace, getSortParams);
  const sortedApplications = React.useMemo(() => {
    return sortData(applications, sortBy, direction);
  }, [applications, sortBy, direction]);

  // Filter applications by project or appset FIRST - before PatternFly filters
  // This ensures PF filters work on the correct dataset (owned apps only)
  const ownedApps = React.useMemo(
    () => sortedApplications.filter(filterApp(project, appset)),
    [sortedApplications, project, appset],
  );

  // TODO: use alternate filter since it is deprecated. See DataTableView potentially
  // PatternFly filters work on owned apps only (the dataset that will be displayed)
  const filters = getFilters(t);
  const [data, filteredData, onFilterChange] = useListPageFilter(ownedApps, filters);

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
  const rows = useApplicationRowsDV(filteredBySearch, namespace);

  // Check if there are applications owned by this ApplicationSet initially (before filters/search)
  const hasOwnedApplications = ownedApps.length > 0;
  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
          <EmptyState
            headingLevel="h4"
            icon={CubesIcon}
            titleText={
              searchQuery ? t('No matching Argo CD Applications') : t('No Argo CD Applications')
            }
          >
            <EmptyStateBody>
              {(() => {
                if (searchQuery) {
                  return (
                    <>
                      {t('No Argo CD Applications match the label filter')}{' '}
                      <strong>&quot;{searchQuery}&quot;</strong>.
                      <br />
                      {t(
                        'Try removing the filter or selecting a different label to see more applications.',
                      )}
                    </>
                  );
                }
                return namespace
                  ? t('There are no Argo CD Applications in this project.')
                  : t('There are no Argo CD Applications in all projects.');
              })()}
            </EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );
  let currentActiveState = null;
  if (loadError) {
    currentActiveState = DataViewState.error;
  } else if (filteredBySearch.length === 0) {
    currentActiveState = DataViewState.empty;
  }
  return (
    <div>
      {showTitle == undefined && (project == undefined || appset == undefined) && (
        <ListPageHeader
          title={t('plugin__gitops-plugin~Applications')}
          badge={
            location.pathname?.includes('openshift-gitops-operator') ? null : <DevPreviewBadge />
          }
          hideFavoriteButton={false}
        >
          <ListPageCreate groupVersionKind={modelToRef(ApplicationModel)}>
            Create Application
          </ListPageCreate>
        </ListPageHeader>
      )}
      <ListPageBody>
        {!hideNameLabelFilters && hasOwnedApplications && (
          <ListPageFilter
            data={data}
            loaded={loaded}
            rowFilters={filters}
            onFilterChange={onFilterChange}
            nameFilterPlaceholder={t('plugin__gitops-plugin~Search by name...')}
          />
        )}
        <DataView activeState={currentActiveState}>
          <DataViewTable columns={columnsDV} rows={rows} bodyStates={empty && { empty }} />
        </DataView>
      </ListPageBody>
    </div>
  );
};

export const sortData = (
  data: ApplicationKind[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
) => {
  if (!(sortBy && direction)) return data;

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
      case 'sync-status':
        aValue = a.status?.sync?.status || '';
        bValue = b.status?.sync?.status || '';
        break;
      case 'health-status':
        aValue = a.status?.health?.status || '';
        bValue = b.status?.health?.status || '';
        break;
      case 'revision':
        aValue = a.status?.sync?.revision || '';
        bValue = b.status?.sync?.revision || '';
        break;
      case 'project':
        aValue = a.spec?.project || '';
        bValue = b.spec?.project || '';
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

const ApplicationActionsCell: React.FC<{ app: ApplicationKind }> = ({ app }) => {
  const actionList: [actions: Action[]] = useApplicationActionsProvider(app);

  return (
    <div style={{ textAlign: 'right' }}>
      <ActionsDropdown
        actions={actionList ? actionList[0] : []}
        id="gitops-application-actions"
        isKebabToggle={true}
      />
    </div>
  );
};

const useApplicationRowsDV = (applicationsList, namespace): DataViewTr[] => {
  const rows: DataViewTr[] = [];
  applicationsList.forEach((app, index) => {
    let sources: ApplicationSource[];
    let revisions: string[];
    if (app.spec?.source) {
      sources = [app.spec?.source];
      revisions = [app.status?.sync?.revision];
    } else if (app.spec?.sources) {
      sources = app.spec.sources;
      revisions = app.status?.sync?.revisions;
    } else {
      //Should never fall here since there always has to be a source or sources
      sources = [];
      revisions = [];
    }
    rows.push([
      {
        cell: (
          <div>
            <ResourceLink
              groupVersionKind={modelToGroupVersionKind(ApplicationModel)}
              name={app.metadata.name}
              namespace={app.metadata.namespace}
              inline={true}
            >
              <span className="pf-u-pl-sm">
                {isApplicationRefreshing(app) && <Spinner size="sm" />}
              </span>
            </ResourceLink>
          </div>
        ),
        id: app.metadata?.name,
        dataLabel: 'Name',
      },
      ...(!namespace
        ? [
            {
              cell: <ResourceLink kind="Namespace" name={app.metadata.namespace} />,
              id: app.metadata.namespace,
              dataLabel: 'Namespace',
            },
          ]
        : []),
      {
        id: app.status?.sync?.status,
        cell: (
          <div className="pf-m-width-40">
            <Flex>
              <FlexItem>
                <SyncStatusFragment status={app.status?.sync?.status || SyncStatus.UNKNOWN} />
              </FlexItem>
              <FlexItem>
                <OperationState app={app} quiet={true} />
              </FlexItem>
            </Flex>
          </div>
        ),
      },
      {
        id: app.status?.health?.status,
        cell: <HealthStatusFragment status={app.status?.health?.status || HealthStatus.UNKNOWN} />,
      },
      {
        id: app?.status?.sync?.revision,
        cell: (
          <>
            {sources[0].targetRevision ? sources[0].targetRevision : 'HEAD'}&nbsp;
            {!(app.status?.sourceType == 'Helm' && sources[0].chart) && (
              <RevisionFragment
                revision={revisions[0] || ''}
                repoURL={sources[0].repoURL}
                helm={app.status?.sourceType == 'Helm' && sources[0].chart ? true : false}
                revisionExtra={revisions.length > 1 && ' and ' + (revisions.length - 1) + ' more'}
              />
            )}
          </>
        ),
      },
      {
        id: app.spec?.project,
        cell: app.spec?.project && (
          <ResourceLink
            groupVersionKind={{ group: 'argoproj.io', version: 'v1alpha1', kind: 'AppProject' }}
            name={app.spec.project}
          />
        ),
      },
      {
        id: 'actions-' + index,
        cell: <ApplicationActionsCell app={app} />,
        props: { style: { paddingTop: 8, paddingRight: 0, paddingLeft: 0, width: 10 } },
      },
    ]);
  });
  return rows;
};

const useColumnsDV = (namespace, getSortParams): DataViewTh[] => {
  const i: number = namespace ? 0 : 1;
  const { t } = useTranslation('plugin__gitops-plugin');
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
      cell: t('Sync Status'),
      props: {
        'aria-label': 'sync status',
        className: 'pf-m-width-15',
        sort: getSortParams(1 + i),
      },
    },
    {
      cell: t('Health Status'),
      props: {
        'aria-label': 'health status',
        className: 'pf-m-width-15',
        sort: getSortParams(2 + i),
      },
    },
    {
      cell: t('Revision'),
      props: {
        'aria-label': 'revision',
        className: 'pf-m-width-12',
        sort: getSortParams(3 + i),
      },
    },
    {
      cell: t('App Project'),
      props: {
        'aria-label': 'project',
        className: 'pf-m-width-20',
        sort: getSortParams(4 + i),
      },
    },
    {
      cell: '',
      props: { 'aria-label': 'actions' },
    },
  ];
  return columns;
};

const FilterUnknownStatus: string = 'Sync.' + SyncStatus.UNKNOWN;

const getFilters = (t: (key: string) => string): RowFilter[] => [
  {
    filterGroupName: t('Sync Status'),
    type: 'app-sync',
    reducer: (application) =>
      application.status?.sync?.status == SyncStatus.UNKNOWN ||
      application.status?.sync?.status == undefined
        ? FilterUnknownStatus
        : application.status?.sync?.status,
    filter: (input, application) => {
      if (input.selected?.length && application?.status?.sync?.status) {
        return (
          input.selected.includes(application.status?.sync?.status) ||
          (input.selected.includes(FilterUnknownStatus) &&
            application.status?.sync?.status == SyncStatus.UNKNOWN)
        );
      } else if (application.status?.sync?.status == undefined) {
        return true;
      } else if (!application?.status?.sync?.status) {
        return false;
      }
      return true;
    },
    items: [
      { id: SyncStatus.SYNCED, title: SyncStatus.SYNCED },
      { id: SyncStatus.OUT_OF_SYNC, title: SyncStatus.OUT_OF_SYNC },
      { id: FilterUnknownStatus, title: SyncStatus.UNKNOWN },
    ],
  },
  {
    filterGroupName: t('Health Status'),
    type: 'app-health',
    reducer: (application) => application.status?.health?.status,
    filter: (input, application) => {
      if (input.selected?.length && application?.status?.health?.status) {
        return input.selected.includes(application.status?.health?.status);
      } else {
        return true;
      }
    },
    items: [
      { id: HealthStatus.UNKNOWN, title: HealthStatus.UNKNOWN },
      { id: HealthStatus.PROGRESSING, title: HealthStatus.PROGRESSING },
      { id: HealthStatus.SUSPENDED, title: HealthStatus.SUSPENDED },
      { id: HealthStatus.HEALTHY, title: HealthStatus.HEALTHY },
      { id: HealthStatus.DEGRADED, title: HealthStatus.DEGRADED },
      { id: HealthStatus.MISSING, title: HealthStatus.MISSING },
    ],
  },
];

export default ApplicationList;
