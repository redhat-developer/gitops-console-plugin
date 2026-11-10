import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useSearchParams } from 'react-router-dom-v5-compat';

import { useArgoServer } from '@gitops/hooks/useArgoServer';
import { ApplicationKind, ApplicationSource } from '@gitops/models/ApplicationModel';
import ExternalLink from '@gitops/utils/components/ExternalLink/ExternalLink';
import { GitIcon } from '@gitops/utils/components/Icons/GitIcon';
import { HelmIcon } from '@gitops/utils/components/Icons/HelmIcon';
import { OciIcon } from '@gitops/utils/components/Icons/OciIcon';
import { ArgoServer, getApplicationArgoUrl } from '@gitops/utils/gitops';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { repoUrl, revisionUrl } from '@gitops/utils/urls';
import {
  EmptyState,
  EmptyStateBody,
  PageSection,
  PageSectionVariants,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon, GithubIcon } from '@patternfly/react-icons';
import { Tbody, Td, Tr } from '@patternfly/react-table';

import {
  APPLICATION_SOURCES_COLUMN_MANAGEMENT_ID,
  getApplicationSourcesManagedColumns,
} from '../shared/applicationSourcesColumns';
import ArgoCDLink from '../shared/ArgoCDLink/ArgoCDLink';
import {
  type GitOpsManagedColumn,
  buildManagedDataViewColumns,
  useGitOpsManagedDataView,
} from '../shared/ColumnManagement';
import { GitOpsDataViewTable, useGitOpsListPagePagination } from '../shared/DataView';
import { GitOpsListPageToolbar } from '../shared/GitOpsListPageToolbar';

type ApplicationDetailsTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: ApplicationKind;
};

interface SourceListProps {
  sources: ApplicationSource[];
  obj?: ApplicationKind;
  argoServer?: ArgoServer;
}

const useColumnsDV = (managedColumns: GitOpsManagedColumn[]) =>
  buildManagedDataViewColumns(managedColumns, {
    type: t('Type'),
    repository: t('Repository'),
    targetRevision: t('Target Revision'),
    path: t('Path / Chart'),
    ref: t('Ref'),
  });

function processPath(path: string) {
  if (path !== null && path !== undefined) {
    if (path === '.') {
      return '(root)';
    }
    return path;
  }
  return '';
}

export const useRowsDV = (
  sources: ApplicationSource[],
  managedColumns: GitOpsManagedColumn[],
): DataViewTr[] => {
  const rows: DataViewTr[] = [];

  sources.forEach((source, index) => {
    const isOci = source?.repoURL?.startsWith('oci://');
    const cellsById: Record<string, any> = {
      type: {
        id: index + '-type',
        cell: (
          // eslint-disable-next-line no-nested-ternary
          <Tooltip content={source.chart ? 'Helm' : isOci ? 'OCI' : 'Git'}>
            <div>
              {/* eslint-disable-next-line no-nested-ternary */}
              {source.chart ? <HelmIcon /> : isOci ? <OciIcon /> : <GitIcon />}
            </div>
          </Tooltip>
        ),
        dataLabel: 'Type',
      },
      repository: {
        id: index + '-repository',
        cell: (
          <div>
            {/* eslint-disable-next-line no-nested-ternary */}
            {source.chart ? (
              <ExternalLink href={source.repoURL}>{source.repoURL}</ExternalLink>
            ) : isOci ? (
              <div>{source.repoURL}</div>
            ) : (
              <ExternalLink href={source.repoURL}>
                {source.repoURL.indexOf('github') > 0 && <GithubIcon />}
                {repoUrl(source.repoURL)}
              </ExternalLink>
            )}
          </div>
        ),
        dataLabel: 'Repository',
      },
      targetRevision: {
        id: index + '-revision',
        cell: <div>{source.targetRevision}</div>,
        dataLabel: 'TargetRevision',
      },
      path: {
        id: index + '-path',
        cell: (
          <div>
            {/* eslint-disable-next-line no-nested-ternary */}
            {source.chart ? (
              source.chart
            ) : // eslint-disable-next-line no-nested-ternary
            source.path ? (
              !isOci ? (
                <ExternalLink
                  href={
                    revisionUrl(source.repoURL, source.targetRevision, true) + '/' + source.path
                  }
                >
                  {source.path}
                </ExternalLink>
              ) : (
                <div>{processPath(source.path)}</div>
              )
            ) : (
              '-'
            )}
          </div>
        ),
        dataLabel: 'Chart / Path',
      },
      ref: {
        id: index + '-ref',
        cell: <div>{source.ref ? source.ref : '-'}</div>,
        dataLabel: 'Ref',
      },
    };

    rows.push(managedColumns.map((column) => cellsById[column.id]));
  });
  return rows;
};

export const SourceList: React.FC<SourceListProps> = ({ sources, obj, argoServer }) => {
  const managedColumns = React.useMemo(() => getApplicationSourcesManagedColumns(t), []);

  const columnsDV = useColumnsDV(managedColumns);
  const [searchParams] = useSearchParams();
  const {
    pagination,
    pagedItems: pagedSources,
    itemCount,
  } = useGitOpsListPagePagination({
    items: sources,
    namespace: obj?.metadata?.namespace,
    searchParams,
  });
  const rows = useRowsDV(pagedSources, managedColumns);
  const {
    columns,
    rows: visibleRows,
    columnManagement,
    tableID,
  } = useGitOpsManagedDataView({
    columnManagementID: APPLICATION_SOURCES_COLUMN_MANAGEMENT_ID,
    managedColumns,
    resourceType: t('Application source'),
    columns: columnsDV,
    rows,
  });

  const argoUrl = getApplicationArgoUrl(argoServer, obj);
  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columns.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText={t('No source')}>
            <EmptyStateBody>
              {t('Error. There must at least one source in the application.')}
            </EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );
  return (
    <>
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
                '&tab=parameters'
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
        isEmpty={sources.length === 0}
        itemCount={itemCount}
        pagination={pagination}
      />
    </>
  );
};

const ApplicationSourcesTab: React.FC<ApplicationDetailsTabProps> = ({ obj }) => {
  const argoServer = useArgoServer(obj);

  let sources: ApplicationSource[];
  if (obj?.spec?.source) {
    sources = [obj?.spec?.source];
  } else if (obj?.spec?.sources) {
    sources = obj.spec.sources;
  } else {
    //Should never fall here since there always has to be a source or sources
    sources = [];
  }

  return (
    <div>
      <PageSection
        variant={PageSectionVariants.default}
        className="co-m-pane__body co-m-pane__body--section-heading"
      >
        <Title headingLevel="h2" className="co-section-heading">
          {t('Application sources')}
        </Title>
        <SourceList sources={sources} obj={obj} argoServer={argoServer} />
      </PageSection>
    </div>
  );
};

export default ApplicationSourcesTab;
