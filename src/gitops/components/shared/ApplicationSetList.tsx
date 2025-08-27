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
import { Tbody, Td, Tr } from '@patternfly/react-table';

import { useApplicationSetActionsProvider } from '../../hooks/useApplicationSetActionsProvider';
import { ApplicationSetStatus } from '../../utils/constants';
import { ApplicationSetKind, ApplicationSetModel } from '../../models/ApplicationSetModel';
import { getAppSetStatus, getAppSetGeneratorCount } from '../../utils/gitops';
import ActionsDropdown from '../../utils/components/ActionDropDown/ActionDropDown';
import { modelToGroupVersionKind, modelToRef } from '../../utils/utils';

// Import status icons for consistency with ApplicationList
import {
  HealthDegradedIcon,
  HealthHealthyIcon,
  HealthUnknownIcon,
} from '../../utils/components/Icons/Icons';



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
const getGeneratedAppsCount = (appSet: ApplicationSetKind, applications: any[], appsLoaded: boolean): number => {
  if (!applications || !appsLoaded) return 0;
  
  return applications.filter((app: any) => {
    if (!app.metadata?.ownerReferences) return false;
    return app.metadata.ownerReferences.some((owner: any) => 
      owner.kind === 'ApplicationSet' && owner.name === appSet.metadata.name
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
  const sortedApplicationSets = React.useMemo(() => {
    return sortData(applicationSets as ApplicationSetKind[], sortBy, direction, applications, appsLoaded);
  }, [applicationSets, sortBy, direction, applications, appsLoaded]);
  const [data, filteredData, onFilterChange] = useListPageFilter(sortedApplicationSets, filters);
  const rows = useApplicationSetRowsDV(filteredData, namespace, applications, appsLoaded);

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText="No Argo CD ApplicationSets">
            <EmptyStateBody>
              There are no Argo CD ApplicationSets in {namespace ? 'this project' : 'all projects'}.
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
  } else if (applicationSets.length === 0) {
    currentActiveState = DataViewState.empty;
  }

  return (
    <div>
      {showTitle == undefined && (
        <ListPageHeader title={t('plugin__gitops-plugin~ApplicationSets')}>
          <ListPageCreate groupVersionKind={modelToRef(ApplicationSetModel)}>
            Create ApplicationSet
          </ListPageCreate>
        </ListPageHeader>
      )}
      <ListPageBody>
        {!hideNameLabelFilters && (
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
      <ActionsDropdown
        actions={actions}
        id="gitops-applicationset-actions"
        isKebabToggle={true}
      />
    </div>
  );
};

const useApplicationSetRowsDV = (applicationSetsList, namespace, applications, appsLoaded): DataViewTr[] => {
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
        cell: (
          <div>
            <ApplicationSetStatusFragment status={getAppSetStatus(appSet)} />
          </div>
        ),
      },
      {
        id: 'generated-apps-' + index,
        cell: getGeneratedAppsCount(appSet, applications, appsLoaded).toString(),
      },
      {
        id: 'generators-' + index,
        cell: getAppSetGeneratorCount(appSet).toString(),
      },
             {
         id: 'created-at-' + index,
         cell: formatCreationTimestamp(appSet.metadata.creationTimestamp),
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
        className: 'pf-m-width-20',
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
              className: 'pf-m-width-12',
              sort: getSortParams('namespace', 1),
            },
          },
        ]
      : []),
    {
      id: 'status',
      cell: 'Health Status',
      props: {
        key: 'status',
        'aria-label': 'health status',
        className: 'pf-m-width-12',
        sort: getSortParams('status', 1 + i),
      },
    },
    {
      id: 'generated-apps',
      cell: 'Generated Apps',
      props: {
        key: 'generated-apps',
        'aria-label': 'generated apps',
        className: 'pf-m-width-12',
        sort: getSortParams('generated-apps', 2 + i),
      },
    },
    {
      id: 'generators',
      cell: 'Generators',
      props: {
        key: 'generators',
        'aria-label': 'generators',
        className: 'pf-m-width-12',
        sort: getSortParams('generators', 3 + i),
      },
    },
         {
       id: 'created-at',
       cell: 'Created At',
       props: {
         key: 'created-at',
         'aria-label': 'created at',
         className: 'pf-m-width-15',
         sort: getSortParams('created-at', 4 + i),
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
  appsLoaded: boolean = false,
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
