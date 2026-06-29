import * as React from 'react';

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
  useListPageFilter,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, Tr } from '@patternfly/react-table';

import { GitOpsDataViewTable, useGitOpsDataViewSort } from '../shared/DataView';

import { ApplicationGraphView } from './graph/ApplicationGraphView';
import ApplicationResourcesToolbar from './ApplicationResourcesToolbar';
import { ApplicationResourcesViewType } from './ApplicationResourcesViewType';

import '../shared/GitOpsGraphListView.scss';

type ApplicationResourcesViewProps = {
  application: ApplicationKind;
  resources: ApplicationResourceStatus[];
  viewType: ApplicationResourcesViewType;
  onViewChange: (view: ApplicationResourcesViewType) => void;
  argoBaseURL: string;
};

const ApplicationResourcesView: React.FC<ApplicationResourcesViewProps> = ({
  application,
  resources,
  viewType,
  onViewChange,
  argoBaseURL,
}) => {
  const columnSortConfig = React.useMemo(
    () =>
      ['name', 'namespace', 'sync-wave', 'sync-status', 'health-status', 'actions'].map((key) => ({
        key,
      })),
    [],
  );

  const { sortBy, direction, getSortParams } = useGitOpsDataViewSort(columnSortConfig);
  const columnsDV = useResourceColumnsDV(getSortParams);
  const sortedResources = React.useMemo(
    () => sortData(resources, sortBy, direction),
    [resources, sortBy, direction],
  );

  const resourceFilters = React.useMemo(() => filters(sortedResources), [sortedResources]);
  const [data, filteredResources, onFilterChange] = useListPageFilter(
    sortedResources,
    resourceFilters,
  );

  const isEmptyResources = filteredResources.length === 0;
  const rows = useResourceRowsDV(filteredResources, application, argoBaseURL);
  const isListView = viewType === ApplicationResourcesViewType.list;

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText={t('No resources')}>
            <EmptyStateBody>
              {t('There are no resources associated with the application.')}
            </EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );

  return (
    <div
      className="gitops-graph-list-view"
      data-test-id={
        viewType === ApplicationResourcesViewType.graph
          ? 'application-resources-graph-view'
          : 'application-resources-list-view'
      }
    >
      <Stack>
        <StackItem isFilled={false} className="gitops-graph-list-view__toolbar-row">
          <Flex alignItems={{ default: 'alignItemsCenter' }}>
            <FlexItem flex={{ default: 'flex_1' }}>
              <ListPageFilter
                hideNameLabelFilters
                data={data}
                loaded={true}
                rowFilters={resourceFilters}
                onFilterChange={onFilterChange}
              />
            </FlexItem>
            <FlexItem className="gitops-graph-list-view__header">
              <ApplicationResourcesToolbar
                viewType={viewType}
                onViewChange={onViewChange}
                isDisabled={resources.length === 0}
              />
            </FlexItem>
          </Flex>
        </StackItem>
        <StackItem isFilled className="gitops-graph-list-view__content">
          <div
            className={
              isListView ? 'gitops-graph-list-view__list-panel' : 'gitops-graph-list-view__panel'
            }
          >
            {isListView ? (
              <GitOpsDataViewTable
                rows={rows}
                columns={columnsDV}
                emptyState={empty}
                isEmpty={isEmptyResources}
                activeState={isEmptyResources ? DataViewState.empty : null}
              />
            ) : (
              <div className="gitops-graph-list-view__graph">
                <ApplicationGraphView application={application} resources={filteredResources} />
              </div>
            )}
          </div>
        </StackItem>
      </Stack>
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
      // eslint-disable-next-line no-nested-ternary
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      // eslint-disable-next-line no-nested-ternary
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

export const useResourceColumnsDV = (getSortParams) => {
  const columns: DataViewTh[] = [
    {
      cell: t('Name'),
      props: {
        'aria-label': 'name',
        className: 'pf-m-width-25',
        sort: getSortParams(0),
      },
    },
    {
      cell: t('Namespace'),
      props: {
        'aria-label': 'namespace',
        className: 'pf-m-width-20',
        sort: getSortParams(1),
      },
    },
    {
      cell: t('Sync Wave'),
      props: {
        'aria-label': 'sync wave',
        className: 'pf-m-width-15',
        sort: getSortParams(2),
      },
    },
    {
      cell: t('Sync Status'),
      props: {
        'aria-label': 'sync status',
        className: 'pf-m-width-15',
        sort: getSortParams(3),
      },
    },
    {
      cell: t('Health Status'),
      props: {
        'aria-label': 'health status',
        className: 'pf-m-width-15',
        sort: getSortParams(4),
      },
    },
    {
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
      filterGroupName: t('Sync Status'),
      type: 'resource-sync',
      reducer: (resource) => (resource.status ? resource.status : 'No Sync Status'),
      filter: (input, resource) => {
        if (input.selected?.length) {
          if (resource?.status) {
            return input.selected.includes(resource.status);
          } else {
            return input.selected.includes('No Sync Status');
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
      filterGroupName: t('Health Status'),
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
      filterGroupName: t('Kind'),
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

export default ApplicationResourcesView;
