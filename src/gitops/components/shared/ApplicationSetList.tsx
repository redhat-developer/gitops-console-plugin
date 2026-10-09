import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
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
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import type { DataViewTd } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import { useApplicationSetActionsProvider } from '../../hooks/useApplicationSetActionsProvider';
import { ApplicationSetKind, ApplicationSetModel } from '../../models/ApplicationSetModel';
import ApplicationSetStatusFragment from '../../Statuses/ApplicationSetStatus';
import ActionsDropdown from '../../utils/components/ActionDropDown/ActionDropDown';
import { ApplicationSetStatus } from '../../utils/constants';
import { getAppSetGeneratorCount, getAppSetStatus } from '../../utils/gitops';
import { modelToGroupVersionKind, modelToRef } from '../../utils/utils';

import {
  ShowOperandsInAllNamespacesRadioGroup,
  useShowOperandsInAllNamespaces,
} from './AllNamespaces';
import {
  APPLICATION_SET_LIST_COLUMN_MANAGEMENT_ID,
  getApplicationSetManagedColumns,
} from './applicationSetListColumns';
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

const formatCreationTimestamp = (timestamp: string): string => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

  if (diffInMinutes < 60) {
    return `${Math.floor(diffInMinutes)}m ago`;
  } else if (diffInMinutes < 60 * 24) {
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = Math.floor(diffInMinutes % 60);
    return minutes > 0 ? `${hours}h ${minutes}m ago` : `${hours}h ago`;
  } else if (diffInMinutes < 60 * 24 * 7) {
    const days = Math.floor(diffInMinutes / (60 * 24));
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Helper function to get generated applications count
const getGeneratedAppsCount = (
  appSet: ApplicationSetKind,
  applications: any[],
  appsLoaded: boolean,
): number => {
  if (!applications || !appsLoaded) return 0;

  return applications.filter((app: any) => {
    if (!app.metadata?.ownerReferences) return false;
    return app.metadata.ownerReferences.some(
      (owner: any) => owner.kind === 'ApplicationSet' && owner.name === appSet.metadata.name,
    );
  }).length;
};

interface ApplicationSetProps {
  namespace: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
}

const ApplicationSetList: React.FC<ApplicationSetProps> = ({
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

  const [applicationSets, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'ApplicationSet',
      version: 'v1alpha1',
    },
    namespaced: !listAllNamespaces,
    namespace,
  });

  // Watch Applications to count generated apps
  const [applications, appsLoaded] = useK8sWatchResource<K8sResourceCommon[]>({
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
  const includeNamespaceColumn = !namespace;
  const managedColumns = React.useMemo(() => getApplicationSetManagedColumns(true, t), [t]);

  const { activeColumnIds, columnManagement, filterDataView } = useGitOpsColumnManagement({
    columnManagementID: APPLICATION_SET_LIST_COLUMN_MANAGEMENT_ID,
    columns: managedColumns,
    resourceType: t('ApplicationSet'),
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

  const columnsDV = useColumnsDV(managedColumns, getSortParams, columnSortConfig);
  const sortedApplicationSets = React.useMemo(() => {
    return sortData(
      applicationSets as ApplicationSetKind[],
      sortBy,
      direction,
      applications,
      appsLoaded,
    );
  }, [applicationSets, sortBy, direction, applications, appsLoaded]);

  const filters = getFilters(t);
  const [data, filteredData, onFilterChange] = useListPageFilter(sortedApplicationSets, filters);

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
  const rows = useApplicationSetRowsDV(pagedItems, managedColumns, applications, appsLoaded);
  const columnIds = React.useMemo(
    () => managedColumns.map((column) => column.id),
    [managedColumns],
  );
  const { columns: visibleColumnsDV, rows: visibleRows } = React.useMemo(
    () => filterDataView(columnsDV, rows, columnIds, activeColumnIds),
    [filterDataView, columnsDV, rows, columnIds, activeColumnIds],
  );

  // Check if there are ApplicationSets initially (before search)
  const hasApplicationSets = React.useMemo(() => {
    return sortedApplicationSets.length > 0;
  }, [sortedApplicationSets]);

  const getEmptyStateBody = () => {
    if (searchQuery || (filteredBySearch.length === 0 && sortedApplicationSets.length > 0)) {
      return (
        <>
          {t('No Argo CD ApplicationSets match the filter')}
          <br />
          {t('Adjust the filter to see more ApplicationSets.')}
        </>
      );
    }
    return namespace
      ? t('There are no Argo CD ApplicationSets in this project.')
      : t('There are no Argo CD ApplicationSets in all projects.');
  };

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={visibleColumnsDV.length || columnsDV.length}>
          <EmptyState
            headingLevel="h4"
            icon={CubesIcon}
            titleText={
              searchQuery
                ? t('No matching Argo CD ApplicationSets')
                : t('No Argo CD ApplicationSets')
            }
          >
            <EmptyStateBody>{getEmptyStateBody()}</EmptyStateBody>
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
              'There was an error retrieving applicationsets. Check your connection and reload the page.',
            )}
          />
        </Td>
      </Tr>
    </Tbody>
  );

  const isEmptyState =
    applicationSets.length === 0 ||
    sortedApplicationSets.length === 0 ||
    filteredBySearch.length === 0;

  const listPageFilter = !hideNameLabelFilters && hasApplicationSets && (
    <ListPageFilter
      data={data}
      loaded={loaded}
      rowFilters={filters}
      onFilterChange={onFilterChange}
    />
  );

  return (
    <div>
      {showTitle == undefined && (
        <ListPageHeader
          title={t('ApplicationSets')}
          helpText={
            location.pathname?.includes('openshift-gitops-operator') ? (
              <ShowOperandsInAllNamespacesRadioGroup />
            ) : null
          }
          hideFavoriteButton={false}
        >
          <ListPageCreate groupVersionKind={modelToRef(ApplicationSetModel)}>
            {t('Create ApplicationSet')}
          </ListPageCreate>
        </ListPageHeader>
      )}
      <ListPageBody>
        {hasApplicationSets && (
          <GitOpsListPageToolbar filters={listPageFilter} columnManagement={columnManagement} />
        )}
        <GitOpsDataViewTable
          rows={visibleRows}
          columns={visibleColumnsDV}
          isEmpty={isEmptyState}
          emptyState={empty}
          isLoading={!loaded}
          isError={!!loadError}
          errorState={error}
          itemCount={itemCount}
          pagination={pagination}
          activeState={
            // eslint-disable-next-line no-nested-ternary
            !loaded ? DataViewState.loading : isEmptyState ? DataViewState.empty : undefined
          }
        />
      </ListPageBody>
    </div>
  );
};

const ApplicationSetActionsCell: React.FC<{ appSet: ApplicationSetKind; index: number }> = ({
  appSet,
  index,
}) => {
  const [actions] = useApplicationSetActionsProvider(appSet);
  return (
    <div style={{ textAlign: 'right' }}>
      <ActionsDropdown
        actions={actions}
        id={'gitops-applicationset-actions-' + index}
        isKebabToggle={true}
      />
    </div>
  );
};

const useApplicationSetRowsDV = (
  applicationSetsList: ApplicationSetKind[],
  managedColumns: GitOpsManagedColumn[],
  applications: K8sResourceCommon[],
  appsLoaded: boolean,
): DataViewTr[] => {
  const rows: DataViewTr[] = [];
  applicationSetsList.forEach((appSet: ApplicationSetKind, index: number) => {
    const cellsById: Record<string, DataViewTd> = {
      name: {
        cell: (
          <div>
            <ResourceLink
              groupVersionKind={modelToGroupVersionKind(ApplicationSetModel)}
              name={appSet.metadata.name}
              namespace={appSet.metadata.namespace}
              inline={true}
            />
          </div>
        ),
        id: appSet.metadata?.name,
        dataLabel: 'Name',
      },
      [NAMESPACE_COLUMN_ID]: {
        cell: <ResourceLink kind="Namespace" name={appSet.metadata.namespace} />,
        id: appSet.metadata.namespace,
        dataLabel: 'Namespace',
      },
      status: {
        id: getAppSetStatus(appSet),
        cell: <ApplicationSetStatusFragment status={getAppSetStatus(appSet)} />,
      },
      'generated-apps': {
        id: 'generated-apps-' + index,
        cell: <div>{getGeneratedAppsCount(appSet, applications, appsLoaded).toString()}</div>,
      },
      generators: {
        id: 'generators-' + index,
        cell: <div>{getAppSetGeneratorCount(appSet).toString()}</div>,
      },
      labels: {
        id: 'labels',
        dataLabel: 'Labels',
        cell: (
          <div>
            <MetadataLabels
              kind={
                ApplicationSetModel.apiGroup +
                '~' +
                ApplicationSetModel.apiVersion +
                '~' +
                ApplicationSetModel.kind
              }
              labels={appSet?.metadata?.labels}
              numLabels={3}
            />
          </div>
        ),
      },
      'created-at': {
        id: 'created-at-' + index,
        cell: <div>{formatCreationTimestamp(appSet.metadata.creationTimestamp)}</div>,
      },
      actions: {
        id: 'actions-' + index,
        cell: <ApplicationSetActionsCell appSet={appSet} index={index} />,
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
    status: t('Health Status'),
    'generated-apps': t('Generated Apps'),
    generators: t('Generators'),
    labels: t('Labels'),
    'created-at': t('Created At'),
    actions: '',
  };

  const widthById: Record<string, string> = {
    name: 'pf-m-width-25',
    [NAMESPACE_COLUMN_ID]: 'pf-m-width-15',
    status: 'pf-m-width-15',
    'generated-apps': 'pf-m-width-15',
    generators: 'pf-m-width-15',
    labels: 'pf-m-width-20',
    'created-at': 'pf-m-width-15',
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

const getFilters = (t: (key: string) => string): RowFilter[] => [
  {
    filterGroupName: t('Health Status'),
    type: 'application-set-status',
    reducer: (applicationSet) => getAppSetStatus(applicationSet),
    filter: (input, applicationSet) => {
      if (input.selected?.length && applicationSet) {
        return input.selected.includes(getAppSetStatus(applicationSet));
      } else {
        return true;
      }
    },
    items: [
      { id: ApplicationSetStatus.HEALTHY, title: ApplicationSetStatus.HEALTHY },
      { id: ApplicationSetStatus.ERROR, title: ApplicationSetStatus.ERROR },
      { id: ApplicationSetStatus.UNKNOWN, title: ApplicationSetStatus.UNKNOWN },
    ],
  },
];

export const sortData = (
  data: ApplicationSetKind[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
  applications: any[] = [],
  appsLoaded = false,
) => {
  if (!sortBy || !direction) return data;

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
        aValue = getAppSetStatus(a);
        bValue = getAppSetStatus(b);
        break;
      case 'generated-apps':
        aValue = getGeneratedAppsCount(a, applications, appsLoaded);
        bValue = getGeneratedAppsCount(b, applications, appsLoaded);
        break;
      case 'generators':
        aValue = getAppSetGeneratorCount(a);
        bValue = getAppSetGeneratorCount(b);
        break;
      case 'labels':
        aValue = getLabelsSortKey(a.metadata?.labels);
        bValue = getLabelsSortKey(b.metadata?.labels);
        break;
      case 'created-at':
        aValue = new Date(a.metadata?.creationTimestamp || 0).getTime();
        bValue = new Date(b.metadata?.creationTimestamp || 0).getTime();
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
    } else {
      if (aValue > bValue) {
        return -1;
      } else if (aValue < bValue) {
        return 1;
      }
      return 0;
    }
  });
};

export default ApplicationSetList;
