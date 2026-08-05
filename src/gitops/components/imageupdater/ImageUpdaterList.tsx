import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom-v5-compat';
import TechPreviewBadge from 'src/plugin/import/badges/TechPreviewBadge';

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
import { GitOpsDataViewTable, useGitOpsDataViewSort } from '../shared/DataView';

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

  const showNamespaceColumn = !effectiveNamespace || effectiveNamespace === '';
  const columnSortConfig = React.useMemo(() => {
    return [
      'name',
      ...(showNamespaceColumn ? ['namespace'] : []),
      'apps',
      'images',
      'last-checked',
      'ready',
      'actions',
    ].map((key) => ({ key }));
  }, [showNamespaceColumn]);

  const { searchParams, sortBy, direction, getSortParams } =
    useGitOpsDataViewSort(columnSortConfig);

  // Get search query from URL parameters
  const searchQuery = searchParams.get('q') || '';

  const { t } = useTranslation('plugin__gitops-plugin');

  const columnsDV = useColumnsDV(effectiveNamespace, getSortParams);
  const sortedItems = React.useMemo(() => {
    return sortData(imageUpdaters as ImageUpdaterKind[], sortBy, direction);
  }, [imageUpdaters, sortBy, direction]);

  const filters = getFilters(t);
  const [data, filteredData, onFilterChange] = useListPageFilter(sortedItems, filters);

  const filteredBySearch = React.useMemo(() => {
    if (!searchQuery) return filteredData;

    const lowerQuery = searchQuery.toLowerCase();
    return filteredData.filter((item) => {
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
  }, [filteredData, searchQuery]);

  const rows = useImageUpdaterRowsDV(filteredBySearch as ImageUpdaterKind[], effectiveNamespace);

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
        <Td colSpan={columnsDV.length}>
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
        <Td colSpan={columnsDV.length}>
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
  const isEmptyState = !loadError && rows.length === 0;

  return (
    <div>
      {showTitle == undefined && (
        <ListPageHeader
          title={t('ImageUpdaters')}
          badge={
            location?.pathname?.includes('openshift-gitops-operator') ? null : (
              <TechPreviewBadge
                tooltipContent={t(
                  'This list page is under tech preview, but not necessarily the resources it represents',
                )}
              />
            )
          }
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
        {!hideNameLabelFilters && hasItems && (
          <ListPageFilter
            data={data}
            loaded={loaded}
            rowFilters={filters}
            onFilterChange={onFilterChange}
            nameFilterPlaceholder={t('Search by name...')}
          />
        )}
        <GitOpsDataViewTable
          columns={columnsDV}
          rows={rows}
          isEmpty={isEmptyState}
          emptyState={empty}
          isError={!!loadError}
          errorState={error || undefined}
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
  namespace: string | null | undefined,
  getSortParams: (columnIndex: number) => ThProps['sort'],
): DataViewTh[] => {
  const showNamespace = !namespace || namespace === '';
  const i: number = showNamespace ? 1 : 0;
  const { t } = useTranslation('plugin__gitops-plugin');
  const columns: DataViewTh[] = [
    {
      cell: t('Name'),
      props: {
        'aria-label': 'name',
        className: 'pf-m-width-20',
        sort: getSortParams(0),
        style: { minWidth: '200px' },
      },
    },
    ...(showNamespace
      ? [
          {
            cell: t('Namespace'),
            props: {
              'aria-label': 'namespace',
              className: 'pf-m-width-15',
              sort: getSortParams(1),
              style: { minWidth: '150px' },
            },
          },
        ]
      : []),
    {
      cell: t('Apps'),
      props: {
        'aria-label': 'apps',
        className: 'pf-m-width-10',
        sort: getSortParams(1 + i),
      },
    },
    {
      cell: t('Images'),
      props: {
        'aria-label': 'images',
        className: 'pf-m-width-10',
        sort: getSortParams(2 + i),
      },
    },
    {
      cell: t('Last Checked'),
      props: {
        'aria-label': 'last checked',
        className: 'pf-m-width-15',
        sort: getSortParams(3 + i),
      },
    },
    {
      cell: t('Ready'),
      props: {
        'aria-label': 'ready',
        className: 'pf-m-width-10',
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

export const useImageUpdaterRowsDV = (
  imageUpdaterList: ImageUpdaterKind[],
  namespace: string | null | undefined,
): DataViewTr[] => {
  const rows: DataViewTr[] = [];
  if (imageUpdaterList === undefined || imageUpdaterList.length === 0) {
    return rows;
  }
  const showNamespace = !namespace || namespace === '';
  imageUpdaterList.forEach((obj, index) => {
    const readyCondition = obj.status?.conditions?.find((c) => c.type === 'Ready');
    const isReady = readyCondition?.status === 'True';

    rows.push([
      {
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
      ...(showNamespace
        ? [
            {
              cell: <ResourceLink kind="Namespace" name={obj.metadata.namespace} />,
              id: obj.metadata.namespace,
              dataLabel: 'Namespace',
            },
          ]
        : []),
      {
        id: 'apps',
        cell:
          obj.status?.applicationsMatched != null ? String(obj.status.applicationsMatched) : '-',
        dataLabel: 'Apps',
      },
      {
        id: 'images',
        cell: obj.status?.imagesManaged != null ? String(obj.status.imagesManaged) : '-',
        dataLabel: 'Images',
      },
      {
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
      {
        id: 'ready',
        cell: readyCondition ? String(isReady) : '-',
        dataLabel: 'Ready',
      },
      {
        id: 'actions-' + index,
        cell: <ImageUpdaterActionsCell imageUpdater={obj} index={index} />,
        props: { className: 'gitops-imageupdater-list__actions-cell' },
      },
    ]);
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
