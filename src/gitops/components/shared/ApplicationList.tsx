import * as React from 'react';
import { useTranslation } from 'react-i18next';
import * as YamlFormatter from 'yaml';

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
  GitOpsDataViewTable,
  useGitOpsDataViewSort,
  useGitOpsListPagePagination,
} from './DataView';
import {
  filterByConsoleNameAndLabels,
  filterResourcesByLabelQuery,
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
  const columnSortConfig = React.useMemo(
    () =>
      [
        'name',
        ...(!listAllNamespaces || !namespace ? ['namespace'] : []),
        'sync-status',
        'health-status',
        'revision',
        'labels',
        'project',
        'actions',
      ].map((key) => ({ key })),
    [listAllNamespaces, namespace],
  );

  const { searchParams, sortBy, direction, getSortParams } =
    useGitOpsDataViewSort(columnSortConfig);

  // Get search query from URL parameters
  const searchQuery = searchParams.get('q') || '';

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
  const rows = useApplicationRowsDV(pagedApplications, namespace);

  // Check if there are applications owned by this ApplicationSet initially (before filters/search)
  const hasOwnedApplications = ownedApps.length > 0;
  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
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
        {!appset && !hideNameLabelFilters && hasOwnedApplications && (
          <ListPageFilter
            data={data}
            loaded={loaded}
            rowFilters={filters}
            onFilterChange={onFilterChange}
            nameFilterPlaceholder={t('plugin__gitops-plugin~Search by name...')}
          />
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
            columns={columnsDV}
            rows={rows}
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
            columns={columnsDV}
            rows={rows}
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
        aValue = YamlFormatter.stringify(a.metadata?.labels || {});
        bValue = YamlFormatter.stringify(b.metadata?.labels || {});
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

const useApplicationRowsDV = (applicationsList, namespace): DataViewTr[] => {
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
              <span className="pf-v6-u-pl-sm">
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
      {
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
      {
        id: app.spec?.project,
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
      {
        id: 'actions-' + index,
        cell: <ApplicationActionsCell app={app} index={index} />,
        props: { style: { paddingTop: 8, paddingRight: 0, paddingLeft: 0, width: 10 } },
      },
    ]);
  });
  return rows;
};

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
      cell: t('Labels'),
      props: {
        'aria-label': 'labels',
        className: 'pf-m-width-20',
        sort: getSortParams(4 + i),
      },
    },
    {
      cell: t('App Project'),
      props: {
        'aria-label': 'project',
        className: 'pf-m-width-20',
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

export default ApplicationList;
