import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import {
  Badge,
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  PageSection,
  Title,
} from '@patternfly/react-core';
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import { ThProps } from '@patternfly/react-table';
import { Tbody, Td, Tr } from '@patternfly/react-table';

import { AppProjectKind, SyncWindow } from '../../models/AppProjectModel';
import { ArgoServer, getArgoServerForProject } from '../../utils/gitops';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import { ArgoCDLink } from '../shared/ArgoCDLink/ArgoCDLink';
import { GitOpsDataViewTable, useGitOpsDataViewSort } from '../shared/DataView';

type ProjectSyncWindowsTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: AppProjectKind;
};

const ProjectSyncWindowsTab: React.FC<ProjectSyncWindowsTabProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();
  const [model] = useK8sModel({ group: 'route.openshift.io', version: 'v1', kind: 'Route' });
  const [argoServer, setArgoServer] = React.useState<ArgoServer>({ host: '', protocol: '' });

  React.useEffect(() => {
    if (!obj || !model) return;
    (async () => {
      try {
        const server = await getArgoServerForProject(model, obj);
        setArgoServer(server);
      } catch (err) {
        console.warn('Error while fetching Argo CD Server url:', err);
      }
    })();
  }, [model, obj]);

  const syncWindows = React.useMemo(() => obj?.spec?.syncWindows || [], [obj?.spec?.syncWindows]);

  const columnSortConfig = React.useMemo(
    () =>
      [
        'kind',
        'schedule',
        'duration',
        'applications',
        'clusters',
        'namespaces',
        'manualSync',
        'timeZone',
      ].map((key) => ({ key })),
    [],
  );

  const { sortBy, direction, getSortParams } = useGitOpsDataViewSort(columnSortConfig);
  const columnsDV = useSyncWindowsColumnsDV(getSortParams, t);
  const sortedSyncWindows = React.useMemo(() => {
    return sortSyncWindowsData(syncWindows, sortBy, direction);
  }, [syncWindows, sortBy, direction]);

  const rows = useSyncWindowsRowsDV(sortedSyncWindows, t);

  if (!obj) return null;

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
          <EmptyState
            headingLevel="h4"
            icon={CubesIcon}
            titleText={t('No sync windows configured')}
          >
            <EmptyStateBody>
              {t('This AppProject does not have any sync windows configured.')}
            </EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );

  const projectName = obj?.metadata?.name;
  const argoCDUrl = argoServer.host
    ? `${argoServer.protocol}://${argoServer.host}/settings/projects/${projectName}?tab=windows`
    : '';

  return (
    <PageSection>
      <Flex
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        alignItems={{ default: 'alignItemsCenter' }}
      >
        <FlexItem>
          <Title headingLevel="h2" className="co-section-heading">
            {t('Sync Windows')}
          </Title>
        </FlexItem>
        {argoCDUrl && (
          <FlexItem>
            <ArgoCDLink href={argoCDUrl} />
          </FlexItem>
        )}
      </Flex>
      <GitOpsDataViewTable
        columns={columnsDV}
        rows={rows}
        isEmpty={syncWindows.length === 0}
        emptyState={empty}
      />
    </PageSection>
  );
};

const parseDurationToMinutes = (duration: string): number => {
  if (!duration) return 0;

  const hourMatch = duration.match(/(\d+)h/i);
  const minuteMatch = duration.match(/(\d+)m/i);
  const secondMatch = duration.match(/(\d+)s/i);

  const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
  const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
  const seconds = secondMatch ? parseInt(secondMatch[1], 10) : 0;

  return hours * 60 + minutes + seconds / 60;
};

const normalizeScheduleForSort = (schedule: string): number => {
  if (!schedule) return 0;

  const parts = schedule.trim().split(/\s+/);

  if (parts.length >= 2) {
    const minute = parseInt(parts[0], 10) || 0;
    const hour = parseInt(parts[1], 10) || 0;
    return hour * 60 + minute;
  }

  return 0;
};

const sortSyncWindowsData = (
  data: SyncWindow[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
) => {
  if (!sortBy || !direction) return data;

  return [...data].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'kind':
        aValue = a.kind || '';
        bValue = b.kind || '';
        break;
      case 'schedule':
        aValue = normalizeScheduleForSort(a.schedule || '');
        bValue = normalizeScheduleForSort(b.schedule || '');
        if (aValue === 0 && bValue === 0) {
          aValue = a.schedule || '';
          bValue = b.schedule || '';
        }
        break;
      case 'duration':
        aValue = parseDurationToMinutes(a.duration || '');
        bValue = parseDurationToMinutes(b.duration || '');
        break;
      case 'applications':
        const aAppsCount = a.applications?.length || 0;
        const bAppsCount = b.applications?.length || 0;
        if (aAppsCount !== bAppsCount) {
          aValue = aAppsCount;
          bValue = bAppsCount;
        } else {
          aValue = a.applications?.[0] || '';
          bValue = b.applications?.[0] || '';
        }
        break;
      case 'clusters':
        const aClustersCount = a.clusters?.length || 0;
        const bClustersCount = b.clusters?.length || 0;
        if (aClustersCount !== bClustersCount) {
          aValue = aClustersCount;
          bValue = bClustersCount;
        } else {
          aValue = a.clusters?.[0] || '';
          bValue = b.clusters?.[0] || '';
        }
        break;
      case 'namespaces':
        const aNamespacesCount = a.namespaces?.length || 0;
        const bNamespacesCount = b.namespaces?.length || 0;
        if (aNamespacesCount !== bNamespacesCount) {
          aValue = aNamespacesCount;
          bValue = bNamespacesCount;
        } else {
          aValue = a.namespaces?.[0] || '';
          bValue = b.namespaces?.[0] || '';
        }
        break;
      case 'manualSync':
        if (a.manualSync !== undefined) {
          aValue = a.manualSync ? 1 : 0;
        } else {
          aValue = -1;
        }
        if (b.manualSync !== undefined) {
          bValue = b.manualSync ? 1 : 0;
        } else {
          bValue = -1;
        }
        break;
      case 'timeZone':
        aValue = a.timeZone || '';
        bValue = b.timeZone || '';
        break;
      default:
        return 0;
    }

    if (direction === 'asc') {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    } else {
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
      return 0;
    }
  });
};

export const useSyncWindowsColumnsDV = (
  getSortParams: (columnIndex: number) => ThProps['sort'],
  t: (key: string) => string,
): DataViewTh[] => {
  const columns: DataViewTh[] = [
    {
      cell: t('Kind'),
      props: {
        'aria-label': 'kind',
        className: 'pf-m-width-10',
        sort: getSortParams(0),
      },
    },
    {
      cell: t('Schedule'),
      props: {
        'aria-label': 'schedule',
        className: 'pf-m-width-15',
        sort: getSortParams(1),
      },
    },
    {
      cell: t('Duration'),
      props: {
        'aria-label': 'duration',
        className: 'pf-m-width-10',
        sort: getSortParams(2),
      },
    },
    {
      cell: t('Applications'),
      props: {
        'aria-label': 'applications',
        className: 'pf-m-width-15',
        sort: getSortParams(3),
      },
    },
    {
      cell: t('Clusters'),
      props: {
        'aria-label': 'clusters',
        className: 'pf-m-width-15',
        sort: getSortParams(4),
      },
    },
    {
      cell: t('Namespaces'),
      props: {
        'aria-label': 'namespaces',
        className: 'pf-m-width-15',
        sort: getSortParams(5),
      },
    },
    {
      cell: t('Manual Sync'),
      props: {
        'aria-label': 'manual sync',
        className: 'pf-m-width-10',
        sort: getSortParams(6),
      },
    },
    {
      cell: t('Time Zone'),
      props: {
        'aria-label': 'time zone',
        className: 'pf-m-width-10',
        sort: getSortParams(7),
      },
    },
  ];

  return columns;
};

const useSyncWindowsRowsDV = (
  syncWindows: SyncWindow[],
  t: (key: string) => string,
): DataViewTr[] => {
  const rows: DataViewTr[] = [];

  syncWindows.forEach((window, index) => {
    rows.push([
      {
        cell: (
          <Badge isRead color="blue">
            {window.kind || '-'}
          </Badge>
        ),
        id: `kind-${index}`,
        dataLabel: t('Kind'),
      },
      {
        cell: window.schedule || '-',
        id: `schedule-${index}`,
        dataLabel: t('Schedule'),
      },
      {
        cell: window.duration || '-',
        id: `duration-${index}`,
        dataLabel: t('Duration'),
      },
      {
        cell:
          window.applications && window.applications.length > 0 ? (
            <div>
              {window.applications.map((app, idx) => (
                <Badge key={idx} isRead color="grey" className="pf-u-mr-sm pf-u-mb-sm">
                  {app}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="pf-u-color-400">{t('All')}</span>
          ),
        id: `applications-${index}`,
        dataLabel: t('Applications'),
      },
      {
        cell:
          window.clusters && window.clusters.length > 0 ? (
            <div>
              {window.clusters.map((cluster, idx) => (
                <Badge key={idx} isRead color="grey" className="pf-u-mr-sm pf-u-mb-sm">
                  {cluster}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="pf-u-color-400">{t('All')}</span>
          ),
        id: `clusters-${index}`,
        dataLabel: t('Clusters'),
      },
      {
        cell:
          window.namespaces && window.namespaces.length > 0 ? (
            <div>
              {window.namespaces.map((ns, idx) => (
                <Badge key={idx} isRead color="grey" className="pf-u-mr-sm pf-u-mb-sm">
                  {ns}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="pf-u-color-400">{t('All')}</span>
          ),
        id: `namespaces-${index}`,
        dataLabel: t('Namespaces'),
      },
      {
        cell:
          window.manualSync !== undefined ? (
            <Badge isRead color={window.manualSync ? 'green' : 'red'}>
              {window.manualSync ? t('Allowed') : t('Denied')}
            </Badge>
          ) : (
            '-'
          ),
        id: `manualSync-${index}`,
        dataLabel: t('Manual Sync'),
      },
      {
        cell: window.timeZone || '-',
        id: `timeZone-${index}`,
        dataLabel: t('Time Zone'),
      },
    ]);
  });

  return rows;
};

export default ProjectSyncWindowsTab;
