import * as React from 'react';
import { useSearchParams } from 'react-router-dom-v5-compat';
import ExternalLink from 'src/components/utils/ExternalLink/ExternalLink';

import ArgoCDLink from '@gitops/components/shared/ArgoCDLink/ArgoCDLink';
import Revision from '@gitops/Revision/Revision';
import { ArgoServer, getArgoServer } from '@gitops/utils/gitops';
import { repoUrl } from '@gitops/utils/urls';
import { ApplicationHistory, ApplicationKind } from '@gitops-models/ApplicationModel';
import { Timestamp, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import DataView, { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import DataViewTable, {
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { useDataViewSort } from '@patternfly/react-data-view/dist/esm/Hooks';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, Tr } from '@patternfly/react-table';

import './History.scss';

interface HistoryListProps {
  history: ApplicationHistory[];
  obj: ApplicationKind;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, obj }) => {
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
  const columnsDV = useColumnsDV(getSortParams);

  const sortedHistory = React.useMemo(() => {
    return sortData(history, sortBy, direction);
  }, [history, sortBy, direction]);

  const rows = useRowsDV(sortedHistory, obj);

  let currentActiveState = null;
  if (rows.length === 0) {
    currentActiveState = DataViewState.empty;
  }

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

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText="No history">
            <EmptyStateBody>There is no history asssociated with the application.</EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );

  return (
    <div>
      <ArgoCDLink
        href={
          argoServer.protocol +
          '://' +
          argoServer.host +
          '/applications/' +
          obj?.metadata?.namespace +
          '/' +
          obj?.metadata?.name +
          '?resource=&node=argoproj.io%2FApplication%2F' +
          obj?.metadata?.namespace +
          '%2F' +
          obj?.metadata?.name +
          '%2F' +
          '&view=tree&resource=&operation=false&rollback=0'
        }
      />
      <DataView activeState={currentActiveState}>
        <DataViewTable rows={rows} columns={columnsDV} bodyStates={empty && { empty }} />
      </DataView>
    </div>
  );
};

const useRowsDV = (history: ApplicationHistory[], app: ApplicationKind): DataViewTr[] => {
  const rows: DataViewTr[] = [];

  history.forEach((obj) => {
    const initBy = {
      username: obj.initiatedBy?.username,
      automated: obj.initiatedBy?.automated,
    };
    const initByString = initBy.automated
      ? 'Automated'
      : '' + (initBy.username ? initBy.username : '-');

    let revisionValue = <>-</>;
    if (obj.revision) {
      revisionValue = (
        <>
          <Revision
            revision={obj.revision || ''}
            repoURL={obj.source.repoURL || ''}
            helm={obj.source.helm ? true : false}
          />
          {' , '}
          <ExternalLink href={obj.source.repoURL}>{repoUrl(obj.source.repoURL)}</ExternalLink>
        </>
      );
    } else if (obj.revisions && app.spec.sources) {
      const rv: React.ReactNode[] = [];
      obj.revisions.forEach((revision, index) => {
        rv.push(
          <>
            <Revision
              revision={revision || ''}
              repoURL={app.spec.sources[index].repoURL || ''}
              helm={app.spec.sources[index].helm && app.spec.sources[index].chart ? true : false}
            />
            <span style={{ marginLeft: '10px' }}>{'('}</span>
            <>
              <ExternalLink href={app.spec.sources[index].repoURL}>
                {repoUrl(app.spec.sources[index].repoURL)}
              </ExternalLink>
              {')'}
            </>
            <span
              style={{
                display: 'inline-block',
                width: '100%',
                borderBottom: '1px solid darkgray',
                marginBottom: '2px',
              }}
            />
            <br />
          </>,
        );
      });
      revisionValue = <>{rv}</>;
    }
    rows.push([
      {
        cell: obj.id,
        id: 'id',
        dataLabel: 'ID',
      },
      {
        cell: <Timestamp timestamp={obj.deployStartedAt} />,
        id: 'deployStartedAt',
        dataLabel: 'Deployed Started At',
      },
      {
        cell: <Timestamp timestamp={obj.deployedAt} />,
        id: 'deployedAt',
        dataLabel: 'Depoyed At',
      },
      {
        cell: <>{initByString}</>,
        id: 'initiated-by',
        dataLabel: 'Initiated By',
      },
      {
        cell: <>{revisionValue}</>,
        id: 'revision',
        dataLabel: 'Revision',
      },
    ]);
  });
  return rows.reverse();
};

const useColumnsDV = (getSortParams) => {
  const columns: DataViewTh[] = [
    {
      id: 'id',
      cell: 'ID',
      props: {
        key: 'id',
        'aria-label': 'ID',
        sort: getSortParams('id', 0),
      },
    },
    {
      cell: 'Deploy Started At',
      id: 'deployStartedAt',
      props: {
        key: `deployStartedAt`,
        className: 'pf-m-width-15',
        sort: getSortParams('deployStartedAt', 1),
      },
    },
    {
      cell: 'Deployed At',
      id: 'deployedAt',
      props: {
        key: 'deployedAt',
        className: 'pf-m-width-15',
        sort: getSortParams('deployedAt', 2),
      },
    },
    {
      cell: 'Initiated By',
      id: 'initiated-by',
      props: {
        key: 'initiated-by',
        className: 'pf-m-width-15',
        sort: getSortParams('initiated-by', 3),
      },
    },
    {
      cell: 'Revision(s) and Source Repo URL(s)',
      id: 'revision',
      props: {
        key: 'revision',
        className: 'gitops-admin-plugin__history-id-column pf-m-width-50',
        sort: getSortParams('revision', 4),
      },
    },
  ];

  return columns;
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
      case 'deployStartedAt':
        aValue = a.deployStartedAt || '';
        bValue = b.deployStartedAt || '';
        break;
      case 'deployedAt':
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
