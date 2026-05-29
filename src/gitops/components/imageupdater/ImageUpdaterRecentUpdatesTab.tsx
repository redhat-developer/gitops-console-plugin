import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { EmptyState, EmptyStateBody, PageSection, PageSectionVariants, Title } from '@patternfly/react-core';
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import { ImageUpdaterKind, ImageUpdaterRecentUpdate } from '../../models/ImageUpdaterModel';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import { GitOpsDataViewTable, useGitOpsDataViewSort } from '../shared/DataView';

type ImageUpdaterRecentUpdatesTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: ImageUpdaterKind;
};

const ImageUpdaterRecentUpdatesTab: React.FC<ImageUpdaterRecentUpdatesTabProps> = ({ obj }) => {
  if (!obj) return null;

  const { t } = useGitOpsTranslation();

  const columnSortConfig = React.useMemo(
    () =>
      ['alias', 'image', 'new-version', 'apps-updated', 'updated-at', 'message'].map((key) => ({
        key,
      })),
    [],
  );

  const { sortBy, direction, getSortParams } = useGitOpsDataViewSort(columnSortConfig);

  const columnsDV = useColumnsDV(getSortParams, t);

  const recentUpdates: ImageUpdaterRecentUpdate[] = obj?.status?.recentUpdates || [];

  const sortedUpdates = React.useMemo(
    () => sortData(recentUpdates, sortBy, direction),
    [recentUpdates, sortBy, direction],
  );

  const rows = useRowsDV(sortedUpdates);

  const empty = (
    <Tbody>
      <Tr key="empty" ouiaId="table-tr-empty">
        <Td colSpan={columnsDV.length}>
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
        <GitOpsDataViewTable
          rows={rows}
          columns={columnsDV}
          emptyState={empty}
          isEmpty={rows.length === 0}
        />
      </PageSection>
    </div>
  );
};

const useRowsDV = (updates: ImageUpdaterRecentUpdate[]): DataViewTr[] => {
  const rows: DataViewTr[] = [];

  updates.forEach((update) => {
    rows.push([
      {
        cell: update.alias || '-',
        id: 'alias',
        dataLabel: 'Alias',
      },
      {
        cell: update.image || '-',
        id: 'image',
        dataLabel: 'Image',
      },
      {
        cell: update.newVersion || '-',
        id: 'new-version',
        dataLabel: 'New Version',
      },
      {
        cell: update.applicationsUpdated != null ? String(update.applicationsUpdated) : '-',
        id: 'apps-updated',
        dataLabel: 'Apps Updated',
      },
      {
        cell: update.updatedAt ? <Timestamp timestamp={update.updatedAt} /> : '-',
        id: 'updated-at',
        dataLabel: 'Updated At',
      },
      {
        cell: update.message || '-',
        id: 'message',
        dataLabel: 'Message',
      },
    ]);
  });

  return rows;
};

const useColumnsDV = (
  getSortParams: (columnIndex: number) => ThProps['sort'],
  t: (key: string) => string,
): DataViewTh[] => {
  return [
    {
      cell: t('Alias'),
      props: { 'aria-label': 'alias', sort: getSortParams(0) },
    },
    {
      cell: t('Image'),
      props: { 'aria-label': 'image', className: 'pf-m-width-20', sort: getSortParams(1) },
    },
    {
      cell: t('New Version'),
      props: { 'aria-label': 'new version', sort: getSortParams(2) },
    },
    {
      cell: t('Apps Updated'),
      props: { 'aria-label': 'apps updated', sort: getSortParams(3) },
    },
    {
      cell: t('Updated At'),
      props: { 'aria-label': 'updated at', className: 'pf-m-width-15', sort: getSortParams(4) },
    },
    {
      cell: t('Message'),
      props: { 'aria-label': 'message', className: 'pf-m-width-30', sort: getSortParams(5) },
    },
  ];
};

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
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

export default ImageUpdaterRecentUpdatesTab;
