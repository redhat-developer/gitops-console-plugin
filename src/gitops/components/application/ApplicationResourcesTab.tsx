import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useSearchParams } from 'react-router-dom-v5-compat';
import classNames from 'classnames';

import { useResourceActionsProvider } from '@gitops/hooks/useResourceActionsProvider';
import HealthStatus from '@gitops/Statuses/HealthStatus';
import SyncStatus from '@gitops/Statuses/SyncStatus';
import ActionDropDown from '@gitops/utils/components/ActionDropDown/ActionDropDown';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { ApplicationKind, ApplicationResourceStatus } from '@gitops-models/ApplicationModel';
import {
  Action,
  K8sGroupVersionKind,
  ListPageFilter,
  ResourceLink,
  RowFilter,
  RowFilterItem,
  useK8sModel,
  useListPageFilter,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  EmptyState,
  EmptyStateBody,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';
import DataView, { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import DataViewTable, {
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { useDataViewSort } from '@patternfly/react-data-view/dist/esm/Hooks';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, Tr } from '@patternfly/react-table';

import { ArgoServer, getArgoServer } from '../../utils/gitops';

type ApplicationResourcesTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: ApplicationKind;
};

const ApplicationResourcesTab: React.FC<ApplicationResourcesTabProps> = ({ obj }) => {
  const [model] = useK8sModel({ group: 'route.openshift.io', version: 'v1', kind: 'Route' });

  const [argoServer, setArgoServer] = React.useState<ArgoServer>({ host: '', protocol: '' });

  React.useEffect(() => {
    (async () => {
      getArgoServer(model, obj)
        .then((server) => {
          setArgoServer(server);
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    })();
  }, [model, obj]);

  let resources: ApplicationResourceStatus[];
  if (obj?.status?.resources) {
    resources = obj?.status?.resources;
  } else {
    resources = [];
  }

  let currentActiveState = null;
  if (resources.length === 0) {
    currentActiveState = DataViewState.empty;
  }
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
  const columnsDV = useResourceColumnsDV(getSortParams);
  const sortedResources = React.useMemo(() => {
    return sortData(resources, sortBy, direction);
  }, [resources, sortBy, direction]);

  // TODO: use alternate filter since it is deprecated. See DataTableView potentially
  const resourceFilters = React.useMemo(() => filters(sortedResources), [sortedResources]);
  const [data, filteredData, onFilterChange] = useListPageFilter(sortedResources, resourceFilters);

  const memoizedFilteredResources = React.useMemo(() => [...filteredData], [filteredData]);

  const rows = useResourceRowsDV(
    memoizedFilteredResources,
    obj,
    argoServer.protocol +
      '://' +
      argoServer.host +
      '/applications/' +
      obj?.metadata?.namespace +
      '/' +
      obj?.metadata?.name,
  );

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText="No resources">
            <EmptyStateBody>
              There are no resources asssociated with the application.
            </EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );
  return (
    <div>
      <PageSection
        variant={PageSectionVariants.default}
        className={classNames('co-m-pane__body', { 'co-m-pane__body--section-heading': true })}
      >
        <Title headingLevel="h2" className="co-section-heading">
          {t('Application resources')}
        </Title>
        {obj.metadata && (
          <>
            <ListPageFilter
              hideNameLabelFilters
              data={data}
              loaded={true}
              rowFilters={resourceFilters}
              onFilterChange={onFilterChange}
            />
            <DataView activeState={currentActiveState}>
              <DataViewTable rows={rows} columns={columnsDV} bodyStates={empty && { empty }} />
            </DataView>
          </>
        )}
      </PageSection>
    </div>
  );
};

const sortData = (
  data: ApplicationResourceStatus[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
) => {
  if (!sortBy || !direction) return data;

  return [...data].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name || '';
        bValue = b.name || '';
        break;
      case 'namespace':
        aValue = a.namespace || '';
        bValue = b.namespace || '';
        break;
      case 'sync-wave':
        aValue = a.syncWave || '';
        bValue = b.syncWave || '';
        break;
      case 'sync-status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      case 'health-status':
        aValue = a.health?.status || '';
        bValue = b.health?.status || '';
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
    }
  });
};

export const useResourceColumnsDV = (getSortParams) => {
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
    {
      id: 'namespace',
      cell: 'Namespace',
      props: {
        key: 'namespace',
        'aria-label': 'namespace',
        className: 'pf-m-width-20',
        sort: getSortParams('namespace', 1),
      },
    },
    {
      id: 'sync-wave',
      cell: 'Sync Wave',
      props: {
        key: 'sync-wave',
        'aria-label': 'sync wave',
        className: 'pf-m-width-15',
        sort: getSortParams('sync-wave', 2),
      },
    },
    {
      id: 'sync-status',
      cell: 'Sync Status',
      props: {
        key: 'sync-status',
        'aria-label': 'sync status',
        className: 'pf-m-width-15',
        sort: getSortParams('sync-status', 3),
      },
    },
    {
      id: 'health-status',
      cell: 'Health Status',
      props: {
        key: 'health-status',
        'aria-label': 'health status',
        className: 'pf-m-width-15',
        sort: getSortParams('health-status', 4),
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

const useResourceRowsDV = (
  resources: ApplicationResourceStatus[],
  obj: ApplicationKind,
  argoBaseURL: string,
): DataViewTr[] => {
  const rows: DataViewTr[] = [];

  resources.forEach((resource, index) => {
    const gvk: K8sGroupVersionKind = {
      version: resource.version,
      group: resource.group,
      kind: resource.kind,
    };

    rows.push([
      {
        cell: (
          <div>
            <ResourceLink
              groupVersionKind={gvk}
              name={resource.name}
              namespace={resource.namespace}
            />
          </div>
        ),
        id: resource.name + '-' + index,
        dataLabel: 'Name',
      },
      {
        cell: resource.namespace ? resource.namespace : '-',
        id: resource.namespace,
        dataLabel: 'Namespace',
      },
      {
        id: 'sync-wave-' + index,
        cell: <>{resource.syncWave || '-'}</>,
        dataLabel: 'Sync Order',
      },
      {
        id: 'sync-status-' + index,
        cell: <>{resource.status ? <SyncStatus status={resource.status} /> : '-'}</>,
      },
      {
        id: 'health-status-' + index,
        cell: (
          <>
            {resource.health?.status && (
              <HealthStatus status={resource.health.status} message={resource.health.message} />
            )}
            {!resource.health?.status && '-'}
          </>
        ),
      },
      {
        id: 'actions-' + index,
        cell: <ResourceActionsCell resource={resource} app={obj} argoBaseURL={argoBaseURL} />,
        props: { style: { paddingTop: 8, paddingRight: 0, paddingLeft: 0, width: 10 } },
      },
    ]);
  });
  return rows;
};

const ResourceActionsCell: React.FC<{
  resource: ApplicationResourceStatus;
  app: ApplicationKind;
  argoBaseURL: string;
}> = ({ resource, app, argoBaseURL }) => {
  const actionList: [actions: Action[]] = useResourceActionsProvider(resource, app, argoBaseURL);
  return (
    <div style={{ textAlign: 'right' }}>
      <ActionDropDown
        actions={actionList ? actionList[0] : []}
        id="gitops-application-actions"
        isKebabToggle={true}
      />
    </div>
  );
};

const filters = (resources: ApplicationResourceStatus[]): RowFilter[] => {
  return [
    {
      filterGroupName: 'Sync Status',
      type: 'resource-sync',
      reducer: (resource) => (resource.status ? resource.status : 'No Sync Status'),
      filter: (input, resource) => {
        if (input.selected?.length) {
          if (resource?.status) {
            return input.selected.includes(resource.status);
          } else {
            return input.selected.includes('No Sync Status'); // The resource has no health status and the None filter is selected
          }
        }
        return true;
      },
      items: resources
        .map((resource) => {
          return {
            id: resource.status ? resource.status : 'No Sync Status',
            title: resource.status ? resource.status : 'No Sync Status',
          };
        })
        .reduce<RowFilterItem[]>(function (result: RowFilterItem[], resource: RowFilterItem) {
          if (!result.some((item) => item.id === resource.id)) {
            result.push(resource);
          }
          return result;
        }, []),
    },
    {
      filterGroupName: 'Health Status',
      type: 'resource-health',
      reducer: (resource) => (resource.health ? resource.health.status : 'None'),
      filter: (input, resource) => {
        if (input.selected?.length) {
          if (resource?.health?.status) {
            return input.selected.includes(resource.health.status);
          } else if (input.selected.includes('None')) {
            return true;
          }
          return false;
        }
        return true;
      },
      items: resources
        .map((resource) => {
          return {
            id: resource.health && resource.health.status ? resource.health.status : 'None',
            title: resource.health && resource.health.status ? resource.health.status : 'None',
          };
        })
        .reduce<RowFilterItem[]>(function (result: RowFilterItem[], resource: RowFilterItem) {
          if (!result.some((item) => item.id === resource.id)) {
            result.push(resource);
          }
          return result;
        }, []),
    },
    {
      filterGroupName: 'Kind',
      type: 'resource-kind',
      reducer: (resource) => resource.kind,
      filter: (input, resource) => {
        if (input.selected?.length) {
          return input.selected.includes(resource.kind);
        } else {
          return true;
        }
      },
      items: resources
        .map((resource) => {
          return { id: resource.kind, title: resource.kind };
        })
        .reduce<RowFilterItem[]>(function (result: RowFilterItem[], resource: RowFilterItem) {
          if (!result.some((item) => item.id === resource.id)) {
            result.push(resource);
          }
          return result;
        }, []),
    },
  ];
};

export default ApplicationResourcesTab;
