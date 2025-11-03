import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import ExternalLink from 'src/components/utils/ExternalLink/ExternalLink';

import { ApplicationKind, ApplicationSource } from '@gitops/models/ApplicationModel';
import { GitIcon } from '@gitops/utils/components/Icons/GitIcon';
import { HelmIcon } from '@gitops/utils/components/Icons/HelmIcon';
import { OciIcon } from '@gitops/utils/components/Icons/OciIcon';
import { ArgoServer, getArgoServer } from '@gitops/utils/gitops';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { repoUrl, revisionUrl } from '@gitops/utils/urls';
import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import {
  EmptyState,
  EmptyStateBody,
  PageSection,
  PageSectionVariants,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import DataView, { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import DataViewTable, {
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon, GithubIcon } from '@patternfly/react-icons';
import { Tbody, Td, Tr } from '@patternfly/react-table';

import ArgoCDLink from '../shared/ArgoCDLink/ArgoCDLink';

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

export const useColumnsDV = () => {
  const columns: DataViewTh[] = [
    {
      id: 'type',
      cell: t('Type'),
      props: {
        key: 'type',
        'aria-label': 'type',
        className: 'pf-v6-u-max-width',
        style: { maxWidth: '2ch' },
      },
    },
    {
      cell: t('Repository'),
      id: 'repository',
      props: {
        key: 'repository',
        'aria-label': 'repository',
        className: 'pf-v6-u-max-width',
        style: { maxWidth: '50ch' },
      },
    },
    {
      cell: t('Target Revision'),
      id: 'targetRevision',
      props: {
        key: 'targetRevision',
        'aria-label': 'targetRevision',
        className: 'pf-v6-u-min-width pf-v6-u-max-width',
        style: { minWidth: '20ch', maxWidth: '20ch' },
      },
    },
    {
      cell: t('Path / Chart'),
      id: 'path',
      props: {
        key: 'path',
        'aria-label': 'path',
        className: 'pf-v6-u-min-width pf-v6-u-max-width',
        style: { minWidth: '20ch', maxWidth: '25ch' },
      },
    },
    {
      cell: t('Ref'),
      id: 'ref',
    },
  ];

  return columns;
};

function processPath(path: string) {
  if (path !== null && path !== undefined) {
    if (path === '.') {
      return '(root)';
    }
    return path;
  }
  return '';
}

export const useRowsDV = (sources: ApplicationSource[]): DataViewTr[] => {
  const rows: DataViewTr[] = [];

  sources.forEach((source, index) => {
    const isOci = source?.repoURL?.startsWith('oci://');
    rows.push([
      {
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
      {
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
      {
        id: index + '-revision',
        cell: <div>{source.targetRevision}</div>,
        dataLabel: 'TargetRevision',
      },
      {
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
      {
        id: index + '-ref',
        cell: <div>{source.ref ? source.ref : '-'}</div>,
        dataLabel: 'Ref',
      },
    ]);
  });
  return rows;
};

export const SourceList: React.FC<SourceListProps> = ({ sources, obj, argoServer }) => {
  const columns = useColumnsDV();
  const rows = useRowsDV(sources);
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
  const currentActiveState = rows.length === 0 ? DataViewState.empty : null;
  return (
    <>
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
          '&tab=parameters'
        }
      />
      <DataView activeState={currentActiveState}>
        <DataViewTable rows={rows} columns={columns} bodyStates={empty && { empty }} />
      </DataView>
    </>
  );
};

const ApplicationSourcesTab: React.FC<ApplicationDetailsTabProps> = ({ obj }) => {
  const [model] = useK8sModel({ group: 'route.openshift.io', version: 'v1', kind: 'Route' });

  let sources: ApplicationSource[];
  if (obj?.spec?.source) {
    sources = [obj?.spec?.source];
  } else if (obj?.spec?.sources) {
    sources = obj.spec.sources;
  } else {
    //Should never fall here since there always has to be a source or sources
    sources = [];
  }

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
