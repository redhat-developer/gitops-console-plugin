import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import {
  type GitOpsManagedColumn,
  buildManagedDataViewColumns,
  useGitOpsManagedDataView,
} from '@gitops/components/shared/ColumnManagement';
import { GitOpsListPageToolbar } from '@gitops/components/shared/GitOpsListPageToolbar';
import {
  getImageUpdaterRecentUpdatesManagedColumns,
  IMAGE_UPDATER_RECENT_UPDATES_COLUMN_MANAGEMENT_ID,
} from '@gitops/components/shared/imageUpdaterRecentUpdatesColumns';
import { Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import {
  EmptyState,
  EmptyStateBody,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';
import { DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import { ImageUpdaterKind, ImageUpdaterRecentUpdate } from '../../models/ImageUpdaterModel';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import {
  GitOpsDataViewTable,
  useGitOpsDataViewSort,
  useGitOpsListPagePagination,
} from '../shared/DataView';

type ImageUpdaterRecentUpdatesTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: ImageUpdaterKind;
};

const ImageUpdaterRecentUpdatesTab: React.FC<ImageUpdaterRecentUpdatesTabProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();

  const managedColumns = React.useMemo(() => getImageUpdaterRecentUpdatesManagedColumns(t), [t]);
  const columnSortConfig = React.useMemo(
    () => managedColumns.map((column) => ({ key: column.id })),
    [managedColumns],
  );

  const { searchParams, sortBy, direction, getSortParams } =
    useGitOpsDataViewSort(columnSortConfig);

  const columnsDV = useColumnsDV(managedColumns, getSortParams, columnSortConfig, t);

  const sortedUpdates = React.useMemo(() => {
    const updates = obj?.status?.recentUpdates || [];
    return sortData(updates, sortBy, direction);
  }, [obj, sortBy, direction]);

  const {
    pagination,
    pagedItems: pagedUpdates,
    itemCount,
  } = useGitOpsListPagePagination({
    items: sortedUpdates,
    namespace: obj?.metadata?.namespace,
    searchParams,
  });

  const rows = useRowsDV(pagedUpdates, managedColumns);
  const {
    columns,
    rows: visibleRows,
    columnManagement,
    tableID,
  } = useGitOpsManagedDataView({
    columnManagementID: IMAGE_UPDATER_RECENT_UPDATES_COLUMN_MANAGEMENT_ID,
    managedColumns,
    resourceType: t('Recent update'),
    columns: columnsDV,
    rows,
  });

  if (!obj) {
    return null;
  }

  const empty = (
    <Tbody>
      <Tr key="empty" ouiaId="table-tr-empty">
        <Td colSpan={columns.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText={t('No recent updates')}>
            <EmptyStateBody>
              {t('No image updates have been recorded in the most recent reconciliation cycle.')}
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
        className="co-m-pane__body co-m-pane__body--section-heading"
      >
        <Title headingLevel="h2" className="co-section-heading">
          {t('Recent Updates')}
        </Title>
        <GitOpsListPageToolbar columnManagement={columnManagement} />
        <GitOpsDataViewTable
          rows={visibleRows}
          columns={columns}
          tableID={tableID}
          emptyState={empty}
          isEmpty={sortedUpdates.length === 0}
          itemCount={itemCount}
          pagination={pagination}
        />
      </PageSection>
    </div>
  );
};

const useRowsDV = (
  updates: ImageUpdaterRecentUpdate[],
  managedColumns: GitOpsManagedColumn[],
): DataViewTr[] => {
  const rows: DataViewTr[] = [];

  updates.forEach((update) => {
    const cellsById = {
      alias: {
        cell: update.alias || '-',
        id: 'alias',
        dataLabel: 'Alias',
      },
      image: {
        cell: update.image || '-',
        id: 'image',
        dataLabel: 'Image',
      },
      'new-version': {
        cell: update.newVersion || '-',
        id: 'new-version',
        dataLabel: 'New Version',
      },
      'apps-updated': {
        cell: update.applicationsUpdated != null ? String(update.applicationsUpdated) : '-',
        id: 'apps-updated',
        dataLabel: 'Apps Updated',
      },
      'updated-at': {
        cell: update.updatedAt ? <Timestamp timestamp={update.updatedAt} /> : '-',
        id: 'updated-at',
        dataLabel: 'Updated At',
      },
      message: {
        cell: update.message || '-',
        id: 'message',
        dataLabel: 'Message',
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
  t: (key: string) => string,
) =>
  buildManagedDataViewColumns(
    managedColumns,
    {
      alias: t('Alias'),
      image: t('Image'),
      'new-version': t('New Version'),
      'apps-updated': t('Apps Updated'),
      'updated-at': t('Updated At'),
      message: t('Message'),
    },
    getSortParams,
    columnSortConfig,
  );

const sortData = (
  data: ImageUpdaterRecentUpdate[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
): ImageUpdaterRecentUpdate[] => {
  if (!sortBy || !direction) return data;

  return [...data].sort((a, b) => {
    let aValue: string | number, bValue: string | number;

    switch (sortBy) {
      case 'alias':
        aValue = a.alias || '';
        bValue = b.alias || '';
        break;
      case 'image':
        aValue = a.image || '';
        bValue = b.image || '';
        break;
      case 'new-version':
        aValue = a.newVersion || '';
        bValue = b.newVersion || '';
        break;
      case 'apps-updated':
        aValue = a.applicationsUpdated ?? -1;
        bValue = b.applicationsUpdated ?? -1;
        break;
      case 'updated-at':
        aValue = a.updatedAt || '';
        bValue = b.updatedAt || '';
        break;
      case 'message':
        aValue = a.message || '';
        bValue = b.message || '';
        break;
      default:
        return 0;
    }

    if (direction === 'asc') {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    }
    if (aValue > bValue) return -1;
    if (aValue < bValue) return 1;
    return 0;
  });
};

export default ImageUpdaterRecentUpdatesTab;
