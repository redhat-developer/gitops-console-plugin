import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { ApplicationSetKind } from '@gitops/models/ApplicationSetModel';
import {
  Action,
  K8sResourceCommon,
  ListPageBody,
  ListPageCreate,
  ListPageFilter,
  ListPageHeader,
  ResourceLink,
  useK8sWatchResource,
  useListPageFilter,
} from '@openshift-console/dynamic-plugin-sdk';
import { ErrorState } from '@patternfly/react-component-groups';
import { EmptyState, EmptyStateBody, Flex, FlexItem, Spinner, Title } from '@patternfly/react-core';
import type { DataViewTd } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import { useApplicationActionsProvider } from '../..//hooks/useApplicationActionsProvider';
import RevisionFragment from '../..//Revision/Revision';
import HealthStatusFragment from '../..//Statuses/HealthStatus';
import { HealthStatus, SyncStatus } from '../..//utils/constants';
import { labelControllerNamespaceKey } from '../..//utils/gitops';
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

import {
  ShowOperandsInAllNamespacesRadioGroup,
  useShowOperandsInAllNamespaces,
} from './AllNamespaces';
import {
  APPLICATION_HEALTH_FILTER_PARAM,
  APPLICATION_SYNC_FILTER_PARAM,
  filterApplicationsByStatus,
  getApplicationRowFilters,
  parseRowFilterParam,
} from './applicationListFilters';
import ApplicationSetApplicationsView from './ApplicationSetApplicationsView';
import {
  APPLICATION_LIST_COLUMN_MANAGEMENT_ID,
  getApplicationManagedColumns,
} from './applicationListColumns';
import {
  type GitOpsManagedColumn,
  NAMESPACE_COLUMN_ID,
  useGitOpsColumnManagement,
} from './ColumnManagement';
import {
  GitOpsDataViewTable,
  useGitOpsDataViewSort,
  useGitOpsListPagePagination,
} from './DataView';
import { GitOpsListPageToolbar } from './GitOpsListPageToolbar';
import {
  filterByConsoleNameAndLabels,
  filterResourcesByLabelQuery,
  getLabelsSortKey,
  parseLabelFilterParam,
} from './listPageTextFilters';
import MetadataLabels from './MetadataLabels';

interface ApplicationProps {
  namespace: string;
  // Here to support plugging in view in Projects (i.e. show list of apps that belong to project)
  // Needs the console API to support defining your own static filter though since neither a label
  // or a field-selector is available to select just the project apps based on k8s watch api.
  project?: AppProjectKind;
  appset?: K8sResourceCommon | ApplicationSetKind;
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
  const [showOperandsInAllNamespaces] = useShowOperandsInAllNamespaces();
  const listAllNamespaces =
    location.pathname?.includes('openshift-gitops-operator') && showOperandsInAllNamespaces;
  if (listAllNamespaces) {
    namespace = null;
  }
  const [applications, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'Application',
      version: 'v1alpha1',
    },
    namespaced: !listAllNamespaces,
    namespace,
  });

  const { t } = useTranslation('plugin__gitops-plugin');
  const includeNamespaceColumn = !namespace;
  const managedColumns = React.useMemo(
    () => getApplicationManagedColumns(includeNamespaceColumn, t),
    [includeNamespaceColumn, t],
  );

  const { activeColumnIds, columnManagement, filterDataView } = useGitOpsColumnManagement({
    columnManagementID: APPLICATION_LIST_COLUMN_MANAGEMENT_ID,
    columns: managedColumns,
    resourceType: t('Application'),
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

  const columnsDV = useColumnsDV(managedColumns, getSortParams, columnSortConfig);
  const sortedApplications = React.useMemo(() => {
    return sortData(applications, sortBy, direction);
  }, [applications, sortBy, direction]);

  // Filter applications by project or appset FIRST - before PatternFly filters
  // This ensures PF filters work on the correct dataset (owned apps only)
  const ownedApps = React.useMemo(
    () => sortedApplications.filter(filterApp(project, appset)),
    [sortedApplications, project, appset],
  );

  // Apply the URL chips to the full owned list so the table and pager match
  // what the user selected, even if the Console filter hook is out of date.
  const filters = React.useMemo(() => getApplicationRowFilters(t), [t]);
  const [data, , onFilterChange] = useListPageFilter(ownedApps, filters);
  const healthFilterParam = searchParams.get(APPLICATION_HEALTH_FILTER_PARAM);
  const syncFilterParam = searchParams.get(APPLICATION_SYNC_FILTER_PARAM);
  const nameQuery = searchParams.get('name') || '';
  const labelsParam = searchParams.get('labels') || '';
  const filteredByStatus = React.useMemo(
    () =>
      filterApplicationsByStatus(
        data as ApplicationKind[],
        parseRowFilterParam(healthFilterParam),
        parseRowFilterParam(syncFilterParam),
      ),
    [data, healthFilterParam, syncFilterParam],
  );

  const filteredByNameAndLabels = React.useMemo(
    () =>
      filterByConsoleNameAndLabels(filteredByStatus, nameQuery, parseLabelFilterParam(labelsParam)),
    [filteredByStatus, nameQuery, labelsParam],
  );

  const filteredBySearch = React.useMemo(
    () => filterResourcesByLabelQuery(filteredByNameAndLabels, searchQuery),
    [filteredByNameAndLabels, searchQuery],
  );

  const {
    pagination,
    pagedItems: pagedApplications,
    itemCount,
  } = useGitOpsListPagePagination({
    items: filteredBySearch,
    namespace,
    searchParams,
  });
  const rows = useApplicationRowsDV(pagedApplications, managedColumns);
  const columnIds = React.useMemo(
    () => managedColumns.map((column) => column.id),
    [managedColumns],
  );
  const { columns: visibleColumnsDV, rows: visibleRows } = React.useMemo(
    () => filterDataView(columnsDV, rows, columnIds, activeColumnIds),
    [filterDataView, columnsDV, rows, columnIds, activeColumnIds],
  );

  // Check if there are applications owned by this ApplicationSet initially (before filters/search)
  const hasOwnedApplications = ownedApps.length > 0;
  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={visibleColumnsDV.length || columnsDV.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText={t('No Argo CD Applications')}>
            <EmptyStateBody>
              {(() => {
                if (!loaded) {
                  return t('Loading Argo CD Applications...');
                }
                if (
                  searchQuery ||
                  (filteredBySearch.length === 0 && sortedApplications.length !== 0)
                ) {
                  return (
                    <>
                      {t('No Argo CD Applications match the filter')} <br />
                      {t('Adjust the filter to see more applications.')}
                    </>
                  );
                }
                // eslint-disable-next-line no-nested-ternary
                return appset
                  ? namespace
                    ? t('There are no Argo CD Applications in this application set.')
                    : t('There are no Argo CD Applications in all projects.')
                  : namespace
                  ? t('There are no Argo CD Applications in this project.')
                  : t('There are no Argo CD Applications in all projects.');
              })()}
            </EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );
  const error = loadError && (
    <Tbody>
      <Tr key="loading-error" ouiaId={'table-tr-loading-error'}>
        <Td colSpan={visibleColumnsDV.length || columnsDV.length}>
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

  const listPageFilter = !hideNameLabelFilters && hasOwnedApplications && (
    <ListPageFilter
      data={data}
      loaded={loaded}
      rowFilters={filters}
      onFilterChange={onFilterChange}
      nameFilterPlaceholder={t('plugin__gitops-plugin~Search by name...')}
    />
  );

  return (
    <div>
      {showTitle == undefined && (project == undefined || appset == undefined) && (
        <ListPageHeader
          title={t('plugin__gitops-plugin~Applications')}
          helpText={
            location.pathname?.includes('openshift-gitops-operator') ? (
              <ShowOperandsInAllNamespacesRadioGroup />
            ) : null
          }
          hideFavoriteButton={false}
        >
          <ListPageCreate groupVersionKind={modelToRef(ApplicationModel)}>
            Create Application
          </ListPageCreate>
        </ListPageHeader>
      )}
      <ListPageBody>
        {/* Show an AppSet specific title if showTitle is undefined. We don't want a duplicate title from above */}
        {appset && (
          <Flex flex={{ default: 'flexDefault' }}>
            <Title headingLevel="h2" className="co-section-heading">
              {t('ApplicationSet Applications')}
            </Title>
            <FlexItem fullWidth={{ default: 'fullWidth' }}>
              {t(
                "The graph and table views show the ApplicationSet's applications. Use the filter to filter applications based on their health and sync status.",
              )}
            </FlexItem>
          </Flex>
        )}
        {!appset && hasOwnedApplications && (
          <GitOpsListPageToolbar filters={listPageFilter} columnManagement={columnManagement} />
        )}
        {appset && (
          <ApplicationSetApplicationsView
            applicationSet={appset as ApplicationSetKind}
            filteredApplications={filteredBySearch as ApplicationKind[]}
            hideNameLabelFilters={hideNameLabelFilters}
            hasOwnedApplications={hasOwnedApplications}
            rowFilters={filters}
            listPageFilterData={data as ApplicationKind[]}
            onFilterChange={onFilterChange}
            nameFilterPlaceholder={t('plugin__gitops-plugin~Search by name...')}
            loaded={loaded}
            columns={visibleColumnsDV}
            rows={visibleRows}
            columnManagement={columnManagement}
            isEmpty={filteredBySearch.length === 0}
            emptyState={empty}
            errorState={error || undefined}
            isError={!!loadError}
            itemCount={itemCount}
            pagination={pagination}
          />
        )}
        {!appset && (
          <GitOpsDataViewTable
            columns={visibleColumnsDV}
            rows={visibleRows}
            isEmpty={filteredBySearch.length === 0}
            emptyState={empty}
            errorState={error || undefined}
            isError={!!loadError}
            itemCount={itemCount}
            pagination={pagination}
          />
        )}
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
      case 'labels':
        aValue = getLabelsSortKey(a.metadata?.labels);
        bValue = getLabelsSortKey(b.metadata?.labels);
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

const ApplicationActionsCell: React.FC<{ app: ApplicationKind; index: number }> = ({
  app,
  index,
}) => {
  const actionList: [actions: Action[]] = useApplicationActionsProvider(app);

  return (
    <div style={{ textAlign: 'right' }}>
      <ActionsDropdown
        actions={actionList ? actionList[0] : []}
        id={'gitops-application-actions-' + index}
        isKebabToggle={true}
      />
    </div>
  );
};

const useApplicationRowsDV = (
  applicationsList: ApplicationKind[],
  managedColumns: GitOpsManagedColumn[],
): DataViewTr[] => {
  const includeNamespaceColumn = managedColumns.some((column) => column.id === NAMESPACE_COLUMN_ID);
  const rows: DataViewTr[] = [];
  applicationsList.forEach((app, index) => {
    let sources: ApplicationSource[];
    let revisions: string[] = [];
    if (app.spec?.source) {
      sources = [app.spec?.source];
      revisions = [app.status?.sync?.revision];
    } else if (app.spec?.sources) {
      sources = app.spec.sources || [];
      revisions = app.status?.sync?.revisions || [];
    } else {
      //Should never fall here since there always has to be a source or sources
      sources = [];
      revisions = [];
    }

    const cellsById: Record<string, DataViewTd> = {
      name: {
        cell: (
          <div>
            <ResourceLink
              groupVersionKind={modelToGroupVersionKind(ApplicationModel)}
              name={app.metadata.name}
              namespace={app.metadata.namespace}
              inline={true}
            >
              <span className="pf-v6-u-pl-sm">
                {isApplicationRefreshing(app) && <Spinner size="sm" />}
              </span>
            </ResourceLink>
          </div>
        ),
        id: 'name',
        dataLabel: 'Name',
      },
      ...(includeNamespaceColumn
        ? {
            [NAMESPACE_COLUMN_ID]: {
              cell: <ResourceLink kind="Namespace" name={app.metadata.namespace} />,
              id: NAMESPACE_COLUMN_ID,
              dataLabel: 'Namespace',
            },
          }
        : {}),
      'sync-status': {
        id: 'sync-status',
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
      'health-status': {
        id: 'health-status',
        cell: <HealthStatusFragment status={app.status?.health?.status || HealthStatus.UNKNOWN} />,
      },
      revision: {
        id: 'revision',
        cell: (
          <>
            {sources[0]?.targetRevision ? sources[0].targetRevision : 'HEAD'}&nbsp;
            {!(app.status?.sourceType == 'Helm' && sources[0].chart) && (
              <RevisionFragment
                revision={revisions[0] || ''}
                repoURL={sources[0]?.repoURL || ''}
                helm={app.status?.sourceType == 'Helm' && sources[0].chart ? true : false}
                revisionExtra={revisions.length > 1 && ' and ' + (revisions.length - 1) + ' more'}
              />
            )}
          </>
        ),
      },
      labels: {
        id: 'labels',
        dataLabel: 'Labels',
        cell: (
          <div>
            <MetadataLabels
              kind={
                ApplicationModel.apiGroup +
                '~' +
                ApplicationModel.apiVersion +
                '~' +
                ApplicationModel.kind
              }
              labels={app?.metadata?.labels}
              numLabels={3}
            />
          </div>
        ),
      },
      project: {
        id: 'project',
        cell: app.spec?.project && (
          <ResourceLink
            namespace={
              app.status?.controllerNamespace ||
              app.metadata?.labels?.[labelControllerNamespaceKey] ||
              app.metadata?.namespace
            }
            groupVersionKind={{ group: 'argoproj.io', version: 'v1alpha1', kind: 'AppProject' }}
            name={app.spec.project}
          />
        ),
      },
      actions: {
        id: 'actions',
        cell: <ApplicationActionsCell app={app} index={index} />,
        props: { style: { paddingTop: 8, paddingRight: 0, paddingLeft: 0, width: 10 } },
      },
    };

    rows.push(managedColumns.map((column) => cellsById[column.id]));
  });
  return rows;
};

const useColumnsDV = (
  managedColumns: GitOpsManagedColumn[],
  getSortParams: (columnIndex: number) => ThProps['sort'],
  columnSortConfig: { key: string }[],
): DataViewTh[] => {
  const { t } = useTranslation('plugin__gitops-plugin');

  const titleById: Record<string, string> = {
    name: t('Name'),
    [NAMESPACE_COLUMN_ID]: t('Namespace'),
    'sync-status': t('Sync Status'),
    'health-status': t('Health Status'),
    revision: t('Revision'),
    labels: t('Labels'),
    project: t('App Project'),
    actions: '',
  };

  const widthById: Record<string, string> = {
    name: 'pf-m-width-25',
    [NAMESPACE_COLUMN_ID]: 'pf-m-width-15',
    'sync-status': 'pf-m-width-15',
    'health-status': 'pf-m-width-15',
    revision: 'pf-m-width-12',
    labels: 'pf-m-width-20',
    project: 'pf-m-width-20',
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

export default ApplicationList;
