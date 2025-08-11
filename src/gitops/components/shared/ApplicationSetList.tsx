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
import { EmptyState, EmptyStateBody, Spinner } from '@patternfly/react-core';
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

const getGeneratorType = (appSet: ApplicationSetKind): string => {
  if (!appSet.spec?.generators || appSet.spec.generators.length === 0) {
    return 'None';
  }
  
  const firstGenerator = appSet.spec.generators[0];
  if (firstGenerator.list) return 'List';
  if (firstGenerator.clusters) return 'Clusters';
  if (firstGenerator.git) return 'Git';
  if (firstGenerator.matrix) return 'Matrix';
  if (firstGenerator.merge) return 'Merge';
  if (firstGenerator.union) return 'Union';
  if (firstGenerator.scmProvider) return 'SCM Provider';
  if (firstGenerator.pullRequest) return 'Pull Request';
  
  return 'Unknown';
};
import ActionsDropdown from '../../utils/components/ActionDropDown/ActionDropDown';
import { modelToGroupVersionKind, modelToRef } from '../../utils/utils';

interface ApplicationSetProps {
  namespace: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
}

const ApplicationSetList: React.FC<ApplicationSetProps> = ({
  namespace,
  hideNameLabelFilters,
  showTitle = true,
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

  const rowFilters: RowFilter[] = React.useMemo(
    () => [
      {
        filterGroupName: t('Status'),
        type: 'application-set-status',
        reducer: (appSet: ApplicationSetKind) => getAppSetStatus(appSet),
        filter: (input, appSet: ApplicationSetKind) => {
          if (!input.selected?.length) {
            return true;
          }
          return input.selected.includes(getAppSetStatus(appSet));
        },
        items: [
          { id: ApplicationSetStatus.HEALTHY, title: t('Healthy') },
          { id: ApplicationSetStatus.ERROR, title: t('Error') },
          { id: ApplicationSetStatus.UNKNOWN, title: t('Unknown') },
        ],
      },
    ],
    [t],
  );

  const columns = useColumnsDV(namespace, getSortParams);
  const sortedApplicationSets = React.useMemo(() => {
    return sortData(applicationSets as ApplicationSetKind[], sortBy, direction);
  }, [applicationSets, sortBy, direction]);
  const [data, filteredData, onFilterChange] = useListPageFilter(sortedApplicationSets, rowFilters);
  const rows = useApplicationSetRowsDV(filteredData, namespace);

  if (loadError) {
    return <ErrorState />;
  }

  if (!loaded) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Spinner />
      </div>
    );
  }

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columns.length}>
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
        <Td colSpan={columns.length}>
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
      {showTitle && (
        <ListPageHeader title={t('ApplicationSets')}>
          <ListPageCreate groupVersionKind={modelToRef(ApplicationSetModel)}>
            {t('Create ApplicationSet')}
          </ListPageCreate>
        </ListPageHeader>
      )}
      <ListPageBody>
        {!hideNameLabelFilters && (
          <ListPageFilter
            data={data}
            loaded={loaded}
            rowFilters={rowFilters}
            onFilterChange={onFilterChange}
          />
        )}
        <DataView activeState={currentActiveState}>
          <DataViewTable
            rows={rows}
            columns={columns}
            bodyStates={loadError ? { error } : { empty }}
          />
        </DataView>
      </ListPageBody>
    </div>
  );
};

export const sortData = (
  data: ApplicationSetKind[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
) => {
  if (!sortBy || !direction) {
    return data;
  }

  return [...data].sort((a, b) => {
    let aValue: any;
    let bValue: any;

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
      case 'generators':
        aValue = getAppSetGeneratorCount(a);
        bValue = getAppSetGeneratorCount(b);
        break;
      case 'generator-type':
        aValue = getGeneratorType(a);
        bValue = getGeneratorType(b);
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

const useApplicationSetRowsDV = (applicationSetsList, namespace): DataViewTr[] => {
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
            <span style={{ 
              color: getAppSetStatus(appSet) === 'Healthy' ? '#3e8635' : 
                     getAppSetStatus(appSet) === 'Error' ? '#c9190b' : '#6a6e73'
            }}>
              {getAppSetStatus(appSet)}
            </span>
          </div>
        ),
      },
      {
        id: getAppSetGeneratorCount(appSet).toString(),
        cell: getAppSetGeneratorCount(appSet).toString(),
      },
      {
        id: 'generator-type-' + index.toString(),
        cell: getGeneratorType(appSet),
      },
      {
        id: 'actions-' + index.toString(),
        cell: <ApplicationSetActionsCell appSet={appSet} />,
        props: { style: { paddingTop: 8, paddingRight: 0, paddingLeft: 0, width: 10 } },
      },
    ]);
  });
  return rows;
};

const useColumnsDV = (namespace, getSortParams) => {
  const i: number = namespace ? 1 : 0;
  const { t } = useTranslation();
  const columns: DataViewTh[] = [
    {
      id: 'name',
      cell: t('Name'),
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
            cell: t('Namespace'),
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
      id: 'status',
      cell: t('Status'),
      props: {
        key: 'status',
        'aria-label': 'status',
        className: 'pf-m-width-15',
        sort: getSortParams('status', 1 + i),
      },
    },
    {
      id: 'generators',
      cell: t('Generators'),
      props: {
        key: 'generators',
        'aria-label': 'generators',
        className: 'pf-m-width-15',
        sort: getSortParams('generators', 2 + i),
      },
    },
    {
      id: 'generator-type',
      cell: t('Generator Type'),
      props: {
        key: 'generator-type',
        'aria-label': 'generator type',
        className: 'pf-m-width-20',
        sort: getSortParams('generator-type', 3 + i),
      },
    },
    {
      id: 'actions',
      cell: '',
      props: {
        key: 'actions',
        'aria-label': 'actions',
        className: 'pf-m-width-10',
      },
    },
  ];
  return columns;
};

export default ApplicationSetList;
