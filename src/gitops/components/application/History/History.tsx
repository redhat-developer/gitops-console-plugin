import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  APPLICATION_HISTORY_COLUMN_MANAGEMENT_ID,
  getApplicationHistoryManagedColumns,
} from '@gitops/components/shared/applicationHistoryColumns';
import ArgoCDLink from '@gitops/components/shared/ArgoCDLink/ArgoCDLink';
import {
  type GitOpsManagedColumn,
  buildManagedDataViewColumns,
  useGitOpsManagedDataView,
} from '@gitops/components/shared/ColumnManagement';
import { GitOpsListPageToolbar } from '@gitops/components/shared/GitOpsListPageToolbar';
import { useArgoServer } from '@gitops/hooks/useArgoServer';
import Revision from '@gitops/Revision/Revision';
import ExternalLink from '@gitops/utils/components/ExternalLink/ExternalLink';
import { getApplicationArgoUrl } from '@gitops/utils/gitops';
import { repoUrl } from '@gitops/utils/urls';
import { ApplicationHistory, ApplicationKind } from '@gitops-models/ApplicationModel';
import { Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, ThProps, Tr } from '@patternfly/react-table';

import {
  GitOpsDataViewTable,
  useGitOpsDataViewSort,
  useGitOpsListPagePagination,
} from '../../shared/DataView';

import './History.scss';

interface HistoryListProps {
  history: ApplicationHistory[];
  obj: ApplicationKind;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, obj }) => {
  const { t } = useTranslation('plugin__gitops-plugin');
  const managedColumns = React.useMemo(() => getApplicationHistoryManagedColumns(t), [t]);
  const columnSortConfig = React.useMemo(
    () => managedColumns.map((column) => ({ key: column.id })),
    [managedColumns],
  );

  const { searchParams, sortBy, direction, getSortParams } =
    useGitOpsDataViewSort(columnSortConfig);
  const columnsDV = useColumnsDV(managedColumns, getSortParams, columnSortConfig);

  const displayHistory = React.useMemo(
    () => sortData([...history].reverse(), sortBy, direction),
    [history, sortBy, direction],
  );

  const {
    pagination,
    pagedItems: pagedHistory,
    itemCount,
  } = useGitOpsListPagePagination({
    items: displayHistory,
    namespace: obj?.metadata?.namespace,
    searchParams,
  });

  const rows = useRowsDV(pagedHistory, obj, managedColumns);
  const {
    columns,
    rows: visibleRows,
    columnManagement,
    tableID,
  } = useGitOpsManagedDataView({
    columnManagementID: APPLICATION_HISTORY_COLUMN_MANAGEMENT_ID,
    managedColumns,
    resourceType: t('History'),
    columns: columnsDV,
    rows,
  });

  const argoServer = useArgoServer(obj);
  const argoUrl = getApplicationArgoUrl(argoServer, obj);

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columns.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText={t('No history')}>
            <EmptyStateBody>
              {t('There is no history associated with the application.')}
            </EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );

  return (
    <div>
      <GitOpsListPageToolbar
        filters={
          argoUrl ? (
            <ArgoCDLink
              href={
                argoUrl +
                '?resource=&node=argoproj.io%2FApplication%2F' +
                obj?.metadata?.namespace +
                '%2F' +
                obj?.metadata?.name +
                '%2F' +
                '&view=tree&resource=&operation=false&rollback=0'
              }
            />
          ) : undefined
        }
        columnManagement={columnManagement}
      />
      <GitOpsDataViewTable
        rows={visibleRows}
        columns={columns}
        tableID={tableID}
        emptyState={empty}
        isEmpty={displayHistory.length === 0}
        itemCount={itemCount}
        pagination={pagination}
      />
    </div>
  );
};

const renderRepoUrl = (repoURL?: string) => {
  if (!repoURL) {
    return '-';
  }
  if (repoURL.startsWith('oci://')) {
    return repoURL;
  }
  return <ExternalLink href={repoURL}>{repoUrl(repoURL)}</ExternalLink>;
};

const useRowsDV = (
  history: ApplicationHistory[],
  app: ApplicationKind,
  managedColumns: GitOpsManagedColumn[],
): DataViewTr[] => {
  const rows: DataViewTr[] = [];

  history.forEach((obj) => {
    const initBy = {
      username: obj.initiatedBy?.username,
      automated: obj.initiatedBy?.automated,
    };
    const initByString = initBy.automated
      ? 'Automated'
      : '' + (initBy.username ? initBy.username : '-');

    let revisionValue: React.ReactNode = '-';
    if (obj.revision) {
      const source = obj.source;
      revisionValue = (
        <>
          <Revision
            revision={obj.revision}
            repoURL={source?.repoURL || ''}
            helm={Boolean(source?.helm)}
          />
          <span style={{ marginLeft: '5px' }}>
            {'('}
            {renderRepoUrl(source?.repoURL)}
            {')'}
          </span>
        </>
      );
    } else if (obj.revisions?.length) {
      const historySources = obj.sources?.length ? obj.sources : app.spec?.sources;
      revisionValue = (
        <>
          {obj.revisions.map((revision, index) => {
            const source = historySources?.[index];
            return (
              <React.Fragment key={`${obj.id ?? 'history'}-${index}-${revision}`}>
                <Revision
                  revision={revision || ''}
                  repoURL={source?.repoURL || ''}
                  helm={Boolean(source?.helm && source?.chart)}
                />
                <span style={{ marginLeft: '10px' }}>
                  {'('}
                  {renderRepoUrl(source?.repoURL)}
                  {')'}
                </span>
                <span
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    borderBottom: '1px solid darkgray',
                    marginBottom: '2px',
                  }}
                />
                <br />
              </React.Fragment>
            );
          })}
        </>
      );
    }
    const cellsById = {
      id: {
        cell: obj.id,
        id: 'id',
        dataLabel: 'ID',
      },
      'started-at': {
        cell: <Timestamp timestamp={obj.deployStartedAt} />,
        id: 'started-at',
        dataLabel: 'Deployed Started At',
      },
      'deployed-at': {
        cell: <Timestamp timestamp={obj.deployedAt} />,
        id: 'deployed-at',
        dataLabel: 'Depoyed At',
      },
      'initiated-by': {
        cell: <>{initByString}</>,
        id: 'initiated-by',
        dataLabel: 'Initiated By',
      },
      revision: {
        cell: <>{revisionValue}</>,
        id: 'revision',
        dataLabel: 'Revision',
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
) => {
  const { t } = useTranslation('plugin__gitops-plugin');
  return buildManagedDataViewColumns(
    managedColumns,
    {
      id: t('ID'),
      'started-at': t('Deploy Started At'),
      'deployed-at': t('Deployed At'),
      'initiated-by': t('Initiated By'),
      revision: t('Revision(s) and Source Repo URL(s)'),
    },
    getSortParams,
    columnSortConfig,
    {
      revision: {
        key: 'revision',
        className: 'gitops-plugin__history-id-column',
      },
    },
  );
};

const sortData = (
  data: ApplicationHistory[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
) => {
  if (!sortBy || !direction) return data;

  return [...data].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'id':
        aValue = a.id || '';
        bValue = b.id || '';
        break;
      case 'started-at':
        aValue = a.deployStartedAt || '';
        bValue = b.deployStartedAt || '';
        break;
      case 'deployed-at':
        aValue = a.deployedAt || '';
        bValue = b.deployedAt || '';
        break;
      case 'initiated-by':
        aValue = // eslint-disable-next-line no-nested-ternary
          (a.initiatedBy.automated
            ? 'Automated'
            : '' + a.initiatedBy.username
            ? ' Username: ' + a.initiatedBy.username
            : '') || '';
        bValue = // eslint-disable-next-line no-nested-ternary
          (b.initiatedBy.automated
            ? 'Automated'
            : '' + b.initiatedBy.username
            ? ' Username: ' + b.initiatedBy.username
            : '') || '';
        break;
      case 'revision':
        aValue = a.revision || '';
        bValue = b.revision || '';
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

export default HistoryList;
