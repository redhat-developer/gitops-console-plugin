import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom-v5-compat';

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
import {
  DataViewTable,
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/dynamic/DataViewTable';
import { useDataViewSort } from '@patternfly/react-data-view/dist/dynamic/Hooks';
import DataView, { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import DevPreviewBadge from '../../../components/import/badges/DevPreviewBadge';
import { useApplicationSetActionsProvider } from '../../hooks/useApplicationSetActionsProvider';
import { ApplicationSetKind, ApplicationSetModel } from '../../models/ApplicationSetModel';
import ActionsDropdown from '../../utils/components/ActionDropDown/ActionDropDown';
// Import status icons for consistency with ApplicationList
import {
  HealthDegradedIcon,
  HealthHealthyIcon,
  HealthUnknownIcon,
} from '../../utils/components/Icons/Icons';
import { ApplicationSetStatus } from '../../utils/constants';
import { getAppSetGeneratorCount, getAppSetStatus } from '../../utils/gitops';
import { modelToGroupVersionKind, modelToRef } from '../../utils/utils';

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

const ApplicationSetStatusFragment: React.FC<{ status: string }> = ({ status }) => {
  let targetIcon: React.ReactNode;

  switch (status) {
    case ApplicationSetStatus.HEALTHY:
      targetIcon = <HealthHealthyIcon />;
      break;
    case ApplicationSetStatus.ERROR:
      targetIcon = <HealthDegradedIcon />;
      break;
    default:
      targetIcon = <HealthUnknownIcon />;
  }

  return (
    <span>
      {targetIcon} {status}
    </span>
  );
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
  const [applicationSets, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'ApplicationSet',
      version: 'v1alpha1',
    },
    namespaced: true,
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

  const initIndex: number = namespace ? 0 : 1;
  const COLUMNS_KEYS_INDEXES = React.useMemo(
    () => [
      { key: 'name', index: 0 },
      ...(!namespace ? [{ key: 'namespace', index: 1 }] : []),
      { key: 'status', index: 1 + initIndex },
      { key: 'generated-apps', index: 2 + initIndex },
      { key: 'generators', index: 3 + initIndex },
      { key: 'created-at', index: 4 + initIndex },
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
  const sortedApplicationSets = React.useMemo(() => {
    return sortData(
      applicationSets as ApplicationSetKind[],
      sortBy,
      direction,
      applications,
      appsLoaded,
    );
  }, [applicationSets, sortBy, direction, applications, appsLoaded]);

  const [data, filteredData, onFilterChange] = useListPageFilter(sortedApplicationSets, filters);

  // Filter by search query if present (after other filters)
  const filteredBySearch = React.useMemo(() => {
    if (!searchQuery) return filteredData;

    return filteredData.filter((appSet) => {
      const labels = appSet.metadata?.labels || {};
      // Check if any label matches the search query
      return Object.entries(labels).some(([key, value]) => {
        const labelSelector = `${key}=${value}`;
        return labelSelector.includes(searchQuery) || key.includes(searchQuery);
      });
    });
  }, [filteredData, searchQuery]);

  const rows = useApplicationSetRowsDV(filteredBySearch, namespace, applications, appsLoaded);

  // Check if there are ApplicationSets initially (before search)
  const hasApplicationSets = React.useMemo(() => {
    return sortedApplicationSets.length > 0;
  }, [sortedApplicationSets]);

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
          <EmptyState
            headingLevel="h4"
            icon={CubesIcon}
            titleText={
              searchQuery ? 'No matching Argo CD ApplicationSets' : 'No Argo CD ApplicationSets'
            }
          >
            <EmptyStateBody>
              {searchQuery ? (
                <>
                  No Argo CD ApplicationSets match the label filter{' '}
                  <strong>&quot;{searchQuery}&quot;</strong>
                  .
                  <br />
                  Try removing the filter or selecting a different label to see more
                  ApplicationSets.
                </>
              ) : (
                `There are no Argo CD ApplicationSets in ${
                  namespace ? 'this project' : 'all projects'
                }.`
              )}
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
            bodyText="There was an error retrieving applicationsets. Check your connection and reload the page."
          />
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
      {showTitle == undefined && (
        <ListPageHeader
          title={t('plugin__gitops-plugin~ApplicationSets')}
          badge={
            location.pathname?.includes('openshift-gitops-operator') ? null : <DevPreviewBadge />
          }
          hideFavoriteButton={false}
        >
          <ListPageCreate groupVersionKind={modelToRef(ApplicationSetModel)}>
            Create ApplicationSet
          </ListPageCreate>
        </ListPageHeader>
      )}
      <ListPageBody>
        {!hideNameLabelFilters && hasApplicationSets && (
          <ListPageFilter
            data={data}
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

const ApplicationSetActionsCell: React.FC<{ appSet: ApplicationSetKind }> = ({ appSet }) => {
  const [actions] = useApplicationSetActionsProvider(appSet);
  return (
    <div style={{ textAlign: 'right' }}>
      <ActionsDropdown actions={actions} id="gitops-applicationset-actions" isKebabToggle={true} />
    </div>
  );
};

const useApplicationSetRowsDV = (
  applicationSetsList,
  namespace,
  applications,
  appsLoaded,
): DataViewTr[] => {
  const rows: DataViewTr[] = [];
  applicationSetsList.forEach((appSet: ApplicationSetKind, index: number) => {
    rows.push([
      {
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
      ...(!namespace
        ? [
            {
              cell: <ResourceLink kind="Namespace" name={appSet.metadata.namespace} />,
              id: appSet.metadata.namespace,
              dataLabel: 'Namespace',
            },
          ]
        : []),
      {
        id: getAppSetStatus(appSet),
        cell: <ApplicationSetStatusFragment status={getAppSetStatus(appSet)} />,
      },
      {
        id: 'generated-apps-' + index,
        cell: <div>{getGeneratedAppsCount(appSet, applications, appsLoaded).toString()}</div>,
      },
      {
        id: 'generators-' + index,
        cell: <div>{getAppSetGeneratorCount(appSet).toString()}</div>,
      },
      {
        id: 'created-at-' + index,
        cell: <div>{formatCreationTimestamp(appSet.metadata.creationTimestamp)}</div>,
      },
      {
        id: 'actions-' + index,
        cell: <ApplicationSetActionsCell appSet={appSet} />,
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
      cell: t('plugin__gitops-plugin~Name'),
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
      cell: 'Health Status',
      props: {
        'aria-label': 'health status',
        className: 'pf-m-width-15',
        sort: getSortParams(1 + i),
      },
    },
    {
      cell: 'Generated Apps',
      props: {
        'aria-label': 'generated apps',
        className: 'pf-m-width-15',
        sort: getSortParams(2 + i),
      },
    },
    {
      cell: 'Generators',
      props: {
        'aria-label': 'generators',
        className: 'pf-m-width-15',
        sort: getSortParams(3 + i),
      },
    },
    {
      cell: 'Created At',
      props: {
        'aria-label': 'created at',
        className: 'pf-m-width-15',
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

export const filters: RowFilter[] = [
  {
    filterGroupName: 'Health Status',
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
