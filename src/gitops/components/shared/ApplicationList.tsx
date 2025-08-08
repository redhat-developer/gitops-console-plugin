import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom-v5-compat';

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
import { ErrorState } from '@patternfly/react-component-groups';
import { EmptyState, EmptyStateBody, Flex, FlexItem, Spinner } from '@patternfly/react-core';
import {
  DataViewTable,
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/dynamic/DataViewTable';
import { useDataViewSort } from '@patternfly/react-data-view/dist/dynamic/Hooks';
import DataView, { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, Tr } from '@patternfly/react-table';

import { useApplicationActionsProvider } from '../..//hooks/useApplicationActionsProvider';
import RevisionFragment from '../..//Revision/Revision';
import HealthStatusFragment from '../..//Statuses/HealthStatus';
import { HealthStatus, SyncStatus } from '../..//utils/constants';
import { ApplicationKind, ApplicationModel } from '../../models/ApplicationModel';
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

  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const { sortBy, direction, onSort } = useDataViewSort({ searchParams, setSearchParams });
  const getSortParams = (columnId: string, columnIndex: number) => ({
    sortBy: {
      index: columnIndex,
      direction,
      defaultDirection: 'asc' as const,
    },
    onSort: (_event: any, index: number, dir: 'asc' | 'desc') => {
      onSort(_event, columnId, dir);
    },
    columnIndex,
  });

  const columnsDV = useColumnsDV(namespace, getSortParams);
  const sortedApplications = React.useMemo(() => {
    return sortData(applications, sortBy, direction);
  }, [applications, sortBy, direction]);
  // TODO: use alternate filter since it is deprecated. See DataTableView potentially
  const [data, filteredData, onFilterChange] = useListPageFilter(sortedApplications, filters);
  const rows = useApplicationRowsDV(filteredData, namespace);
  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText="No Argo CD Applications">
            <EmptyStateBody>
              There are no Argo CD Applications in {namespace ? 'this project' : 'all projects'}.
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
            titleText="Unable to load data"
            bodyText="There was an error retrieving applications. Check your connection and reload the page."
          />
        </Td>
      </Tr>
    </Tbody>
  );
  let currentActiveState = null;
  if (loadError) {
    currentActiveState = DataViewState.error;
  } else if (applications.length === 0) {
    currentActiveState = DataViewState.empty;
  }
  return (
    <div>
      {showTitle == undefined && (project == undefined || appset == undefined) && (
        <ListPageHeader title={t('plugin__gitops-plugin~Applications')}>
          <ListPageCreate groupVersionKind={modelToRef(ApplicationModel)}>
            Create Application
          </ListPageCreate>
        </ListPageHeader>
      )}
      <ListPageBody>
        {!hideNameLabelFilters && (
          <ListPageFilter
            data={data.filter(filterApp(project, appset))}
            loaded={loaded}
            rowFilters={filters}
            onFilterChange={onFilterChange}
          />
        )}
        <DataView activeState={currentActiveState}>
          <DataViewTable
            rows={rows}
            columns={columnsDV}
            bodyStates={loadError ? { error } : { empty }}
          />
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
  if (!sortBy || !direction) return data;

  return [...data].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.metadata?.name || '';
        bValue = b.metadata?.name || '';
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
      if (aValue < bValue) {
        return -1;
      } else if (aValue > bValue) {
        return 1;
      }
      return 0;
      // return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      if (aValue > bValue) {
        return -1;
      } else if (aValue < bValue) {
        return 1;
      }
      return 0; // return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
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
            {app?.spec?.source?.targetRevision ? app?.spec?.source?.targetRevision : 'HEAD'}&nbsp;
            <RevisionFragment
              revision={app.status?.sync?.revision || ''}
              repoURL={app.spec?.source?.repoURL}
              helm={app.status?.sourceType == 'Helm'}
            />
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

const useColumnsDV = (namespace, getSortParams) => {
  const i: number = namespace ? 1 : 0;
  const { t } = useTranslation('plugin__gitops-plugin');
  const columns: DataViewTh[] = [
    {
      id: 'name',
      cell: t('plugin__gitops-plugin~Name'),
      props: {
        key: 'name',
        'aria-label': 'name',
        className: 'pf-m-width-25',
        sort: getSortParams('name', 0),
      },
    },
    ...(!namespace
      ? [
          {
            id: 'namespace',
            cell: 'Namespace',
            props: {
              key: 'namespace',
              'aria-label': 'namespace',
              className: 'pf-m-width-15',
              sort: getSortParams('namespace', 1),
            },
          },
        ]
      : []),
    {
      id: 'sync-status',
      cell: 'Sync Status',
      props: {
        key: 'sync-status',
        'aria-label': 'sync status',
        className: 'pf-m-width-15',
        sort: getSortParams('sync-status', 1 + i),
      },
    },
    {
      id: 'health-status',
      cell: 'Health Status',
      props: {
        key: 'health-status',
        'aria-label': 'health status',
        className: 'pf-m-width-15',
        sort: getSortParams('health-status', 2 + i),
      },
    },
    {
      id: 'revision',
      cell: 'Revision',
      props: {
        key: 'revision',
        'aria-label': 'revision',
        className: 'pf-m-width-12',
        sort: getSortParams('revision', 3 + i),
      },
    },
    {
      id: 'project',
      cell: 'App Project',
      props: {
        key: 'project',
        'aria-label': 'project',
        className: 'pf-m-width-20',
        sort: getSortParams('project', 4 + i),
      },
    },
    {
      id: 'actions',
      cell: '',
      props: { 'aria-label': 'actions' },
    },
  ];

  return columns;
};

const FilterUnknownStatus: string = 'Sync.' + SyncStatus.UNKNOWN;

export const filters: RowFilter[] = [
  {
    filterGroupName: 'Sync Status',
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
    filterGroupName: 'Health Status',
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
