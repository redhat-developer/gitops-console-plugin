import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom-v5-compat';

import ActionsDropdown from '@gitops/utils/components/ActionDropDown/ActionDropDown';
import { modelToGroupVersionKind } from '@gitops/utils/utils';
import {
  Action,
  K8sResourceCommon,
  ListPageBody,
  ListPageCreate,
  ListPageFilter,
  ListPageHeader,
  ResourceLink,
  RowFilter,
  Timestamp,
  useK8sWatchResource,
  useListPageFilter,
} from '@openshift-console/dynamic-plugin-sdk';
import { ErrorState } from '@patternfly/react-component-groups';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import type { DataViewTd } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import {
  ImageUpdaterKind,
  ImageUpdaterModel,
  imageUpdaterModelRef,
} from '../../models/ImageUpdaterModel';
import {
  ShowOperandsInAllNamespacesRadioGroup,
  useShowOperandsInAllNamespaces,
} from '../shared/AllNamespaces';
import {
  type GitOpsManagedColumn,
  NAMESPACE_COLUMN_ID,
  useGitOpsColumnManagement,
} from '../shared/ColumnManagement';
import {
  GitOpsDataViewTable,
  useGitOpsDataViewSort,
  useGitOpsListPagePagination,
} from '../shared/DataView';
import { GitOpsListPageToolbar } from '../shared/GitOpsListPageToolbar';
import {
  getImageUpdaterManagedColumns,
  IMAGE_UPDATER_LIST_COLUMN_MANAGEMENT_ID,
} from '../shared/imageUpdaterListColumns';
import {
  filterByConsoleNameAndLabels,
  getLabelsSortKey,
  parseLabelFilterParam,
} from '../shared/listPageTextFilters';
import MetadataLabels from '../shared/MetadataLabels';

import { useImageUpdaterActionsProvider } from './hooks/useImageUpdaterActionsProvider';

import './imageupdater-list.scss';

type ImageUpdaterListTabProps = {
  namespace?: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
};

const ImageUpdaterList: React.FC<ImageUpdaterListTabProps> = ({
  namespace,
  hideNameLabelFilters,
  showTitle,
}) => {
  const location = useLocation();
  const [showOperandsInAllNamespaces] = useShowOperandsInAllNamespaces();
  const listAllNamespaces =
    location.pathname?.includes('openshift-gitops-operator') && showOperandsInAllNamespaces;
  const effectiveNamespace = listAllNamespaces ? null : namespace;
  const [imageUpdaters, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: modelToGroupVersionKind(ImageUpdaterModel),
    namespaced: !listAllNamespaces,
    namespace: effectiveNamespace,
  });

  const { t } = useTranslation('plugin__gitops-plugin');
  const includeNamespaceColumn = !effectiveNamespace || effectiveNamespace === '';
  const managedColumns = React.useMemo(() => getImageUpdaterManagedColumns(true, t), [t]);

  const { activeColumnIds, columnManagement, filterDataView } = useGitOpsColumnManagement({
    columnManagementID: IMAGE_UPDATER_LIST_COLUMN_MANAGEMENT_ID,
    columns: managedColumns,
    resourceType: t('ImageUpdaters'),
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
  const sortedItems = React.useMemo(() => {
    return sortData(imageUpdaters as ImageUpdaterKind[], sortBy, direction);
  }, [imageUpdaters, sortBy, direction]);

  const filters = getFilters(t);
  const [data, filteredData, onFilterChange] = useListPageFilter(sortedItems, filters);

  const filteredByNameAndLabels = React.useMemo(
    () => filterByConsoleNameAndLabels(filteredData, nameQuery, parseLabelFilterParam(labelsParam)),
    [filteredData, nameQuery, labelsParam],
  );

  const filteredBySearch = React.useMemo(() => {
    if (!searchQuery) return filteredByNameAndLabels;

    const lowerQuery = searchQuery.toLowerCase();
    return filteredByNameAndLabels.filter((item) => {
      const name = item.metadata?.name || '';
      const labels = item.metadata?.labels || {};
      return (
        name.toLowerCase().includes(lowerQuery) ||
        Object.entries(labels).some(([key, value]) => {
          const labelSelector = `${key}=${value || ''}`;
          return (
            labelSelector.toLowerCase().includes(lowerQuery) ||
            key.toLowerCase().includes(lowerQuery)
          );
        })
      );
    });
  }, [filteredByNameAndLabels, searchQuery]);

  const { pagination, pagedItems, itemCount } = useGitOpsListPagePagination({
    items: filteredBySearch as ImageUpdaterKind[],
    namespace: effectiveNamespace,
    searchParams,
  });
  const rows = useImageUpdaterRowsDV(pagedItems, managedColumns);
  const columnIds = React.useMemo(
    () => managedColumns.map((column) => column.id),
    [managedColumns],
  );
  const { columns: visibleColumnsDV, rows: visibleRows } = React.useMemo(
    () => filterDataView(columnsDV, rows, columnIds, activeColumnIds),
    [filterDataView, columnsDV, rows, columnIds, activeColumnIds],
  );

  const hasItems = React.useMemo(() => {
    return sortedItems.length > 0;
  }, [sortedItems]);

  const getEmptyStateBody = () => {
    if (searchQuery) {
      return (
        <>
          {t('No ImageUpdaters match the search filter')} <strong>&quot;{searchQuery}&quot;</strong>
          .
          <br />
          {t(
            'Try removing the filter or searching for a different term to see more ImageUpdaters.',
          )}
        </>
      );
    }
    return effectiveNamespace
      ? t('There are no ImageUpdaters in this namespace.')
      : t('There are no ImageUpdaters in all namespaces.');
  };

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={visibleColumnsDV.length || columnsDV.length}>
          <EmptyState
            headingLevel="h4"
            icon={CubesIcon}
            titleText={searchQuery ? t('No matching ImageUpdaters') : t('No ImageUpdaters')}
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
              'There was an error retrieving ImageUpdaters. Check your connection and reload the page.',
            )}
          />
        </Td>
      </Tr>
    </Tbody>
  );
  const isEmptyState = !loadError && visibleRows.length === 0;

  const listPageFilter = !hideNameLabelFilters && hasItems && (
    <ListPageFilter
      data={data}
      loaded={loaded}
      rowFilters={filters}
      onFilterChange={onFilterChange}
      nameFilterPlaceholder={t('Search by name...')}
    />
  );

  return (
    <div>
      {showTitle == undefined && (
        <ListPageHeader
          title={t('ImageUpdaters')}
          helpText={
            location.pathname?.includes('openshift-gitops-operator') ? (
              <ShowOperandsInAllNamespacesRadioGroup />
            ) : null
          }
          hideFavoriteButton={false}
        >
          <ListPageCreate groupVersionKind={imageUpdaterModelRef}>
            {t('Create ImageUpdater')}
          </ListPageCreate>
        </ListPageHeader>
      )}
      <ListPageBody>
        {hasItems && (
          <GitOpsListPageToolbar filters={listPageFilter} columnManagement={columnManagement} />
        )}
        <GitOpsDataViewTable
          columns={visibleColumnsDV}
          rows={visibleRows}
          isEmpty={isEmptyState}
          emptyState={empty}
          isError={!!loadError}
          errorState={error || undefined}
          itemCount={itemCount}
          pagination={pagination}
        />
      </ListPageBody>
    </div>
  );
};

export const sortData = (
  data: ImageUpdaterKind[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
) => {
  if (!(sortBy && direction)) return data || [];
  if (!data) return [];

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
      case 'apps':
        aValue = a.status?.applicationsMatched ?? -1;
        bValue = b.status?.applicationsMatched ?? -1;
        break;
      case 'images':
        aValue = a.status?.imagesManaged ?? -1;
        bValue = b.status?.imagesManaged ?? -1;
        break;
      case 'last-checked':
        aValue = a.status?.lastCheckedAt || '';
        bValue = b.status?.lastCheckedAt || '';
        break;
      case 'ready':
        aValue = a.status?.conditions?.find((c) => c.type === 'Ready')?.status || '';
        bValue = b.status?.conditions?.find((c) => c.type === 'Ready')?.status || '';
        break;
      case 'labels':
        aValue = getLabelsSortKey(a.metadata?.labels);
        bValue = getLabelsSortKey(b.metadata?.labels);
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

export const useColumnsDV = (
  managedColumns: GitOpsManagedColumn[],
  getSortParams: (columnIndex: number) => ThProps['sort'],
  columnSortConfig: { key: string }[],
): DataViewTh[] => {
  const { t } = useTranslation('plugin__gitops-plugin');

  const titleById: Record<string, string> = {
    name: t('Name'),
    [NAMESPACE_COLUMN_ID]: t('Namespace'),
    apps: t('Apps'),
    images: t('Images'),
    'last-checked': t('Last Checked'),
    ready: t('Ready'),
    labels: t('Labels'),
    actions: '',
  };

  const widthById: Record<string, string> = {
    name: 'pf-m-width-30',
    [NAMESPACE_COLUMN_ID]: 'pf-m-width-15',
    apps: 'pf-m-width-20',
    images: 'pf-m-width-20',
    'last-checked': 'pf-m-width-20',
    ready: 'pf-m-width-10',
    labels: 'pf-m-width-10',
  };

  const styleById: Record<string, React.CSSProperties | undefined> = {
    name: { minWidth: '200px' },
    [NAMESPACE_COLUMN_ID]: { minWidth: '150px' },
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
        ...(styleById[column.id] ? { style: styleById[column.id] } : {}),
        ...(sortIndex >= 0 ? { sort: getSortParams(sortIndex) } : {}),
      },
    };
  });
};

export const useImageUpdaterRowsDV = (
  imageUpdaterList: ImageUpdaterKind[],
  managedColumns: GitOpsManagedColumn[],
): DataViewTr[] => {
  const rows: DataViewTr[] = [];
  if (imageUpdaterList === undefined || imageUpdaterList.length === 0) {
    return rows;
  }
  imageUpdaterList.forEach((obj, index) => {
    const readyCondition = obj.status?.conditions?.find((c) => c.type === 'Ready');
    const isReady = readyCondition?.status === 'True';

    const cellsById: Record<string, DataViewTd> = {
      name: {
        cell: (
          <div>
            <ResourceLink
              groupVersionKind={modelToGroupVersionKind(ImageUpdaterModel)}
              name={obj.metadata.name}
              namespace={obj.metadata.namespace}
              inline={true}
            />
          </div>
        ),
        id: 'name',
        dataLabel: 'Name',
      },
      [NAMESPACE_COLUMN_ID]: {
        cell: <ResourceLink kind="Namespace" name={obj.metadata.namespace} />,
        id: obj.metadata.namespace,
        dataLabel: 'Namespace',
      },
      apps: {
        id: 'apps',
        cell:
          obj.status?.applicationsMatched != null ? String(obj.status.applicationsMatched) : '-',
        dataLabel: 'Apps',
      },
      images: {
        id: 'images',
        cell: obj.status?.imagesManaged != null ? String(obj.status.imagesManaged) : '-',
        dataLabel: 'Images',
      },
      'last-checked': {
        id: 'last-checked',
        cell: obj.status?.lastCheckedAt ? (
          <div className="gitops-imageupdater-list__timestamp">
            <Timestamp timestamp={obj.status.lastCheckedAt} />
          </div>
        ) : (
          '-'
        ),
        dataLabel: 'Last Checked',
      },
      ready: {
        id: 'ready',
        cell: readyCondition ? String(isReady) : '-',
        dataLabel: 'Ready',
      },
      labels: {
        id: 'labels',
        dataLabel: 'Labels',
        cell: (
          <div>
            <MetadataLabels
              kind={
                ImageUpdaterModel.apiGroup +
                '~' +
                ImageUpdaterModel.apiVersion +
                '~' +
                ImageUpdaterModel.kind
              }
              labels={obj?.metadata?.labels}
              numLabels={3}
            />
          </div>
        ),
      },
      actions: {
        id: 'actions-' + index,
        cell: <ImageUpdaterActionsCell imageUpdater={obj} index={index} />,
        props: { className: 'gitops-imageupdater-list__actions-cell' },
      },
    };

    rows.push(managedColumns.map((column) => cellsById[column.id]));
  });
  return rows;
};

const ImageUpdaterActionsCell: React.FC<{
  imageUpdater: ImageUpdaterKind;
  index: number;
}> = ({ imageUpdater, index }) => {
  const actionList: Action[] = useImageUpdaterActionsProvider(imageUpdater);
  return (
    <div className="gitops-imageupdater-list__actions">
      <ActionsDropdown
        actions={actionList || []}
        id={'gitops-imageupdater-actions-' + index}
        isKebabToggle={true}
      />
    </div>
  );
};

const getFilters = (t: (key: string) => string): RowFilter[] => [
  {
    filterGroupName: t('Apps'),
    type: 'apps-status',
    reducer: (item) => {
      const apps = (item as ImageUpdaterKind).status?.applicationsMatched;
      return apps > 0 ? 'has-apps' : 'no-apps';
    },
    filter: (input, item) => {
      if (!input.selected?.length) return true;
      const apps = (item as ImageUpdaterKind).status?.applicationsMatched;
      const hasApps = apps > 0;
      return (
        (input.selected.includes('has-apps') && hasApps) ||
        (input.selected.includes('no-apps') && !hasApps)
      );
    },
    items: [
      { id: 'has-apps', title: t('Has Apps') },
      { id: 'no-apps', title: t('No Apps') },
    ],
  },
  {
    filterGroupName: t('Ready'),
    type: 'ready-status',
    reducer: (item) => {
      const readyCondition = (item as ImageUpdaterKind).status?.conditions?.find(
        (c) => c.type === 'Ready',
      );
      return readyCondition?.status === 'True' ? 'ready' : 'not-ready';
    },
    filter: (input, item) => {
      if (!input.selected?.length) return true;
      const readyCondition = (item as ImageUpdaterKind).status?.conditions?.find(
        (c) => c.type === 'Ready',
      );
      const isReady = readyCondition?.status === 'True';
      return (
        (input.selected.includes('ready') && isReady) ||
        (input.selected.includes('not-ready') && !isReady)
      );
    },
    items: [
      { id: 'ready', title: t('Ready') },
      { id: 'not-ready', title: t('Not Ready') },
    ],
  },
];

export default ImageUpdaterList;
