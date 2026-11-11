import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { AgenticRunKind } from '@gitops/models/AgentRunModel';
import { ApplicationKind } from '@gitops/models/ApplicationModel';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import AISparkleFillIcon from '@images/ai-sparkle-fill.svg';
import { useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

type AgenticRunLinkProps = {
  application: ApplicationKind;
  namespace?: string;
  children?: (link: React.ReactNode) => React.ReactNode;
};

export const AgenticRunLink: React.FC<AgenticRunLinkProps> = ({
  application,
  namespace, // eslint-disable-line @typescript-eslint/no-unused-vars
  children,
}) => {
  const [agenticRuns, isAGRLoaded, agrError] = useK8sWatchResource<AgenticRunKind[]>({
    isList: true,
    groupVersionKind: {
      group: 'agentic.openshift.io',
      kind: 'AgenticRun',
      version: 'v1alpha1',
    },
  });

  const lightspeedAgenticRunNameAnnotation = 'gitops.openshift.io/lightspeed-agentic-run-name';
  const lightspeedAgenticRunNamespaceAnnotation =
    'gitops.openshift.io/lightspeed-agentic-run-namespace';

  const targetAGRName =
    application?.metadata?.annotations?.[lightspeedAgenticRunNameAnnotation] || undefined;
  const targetAGRNamespace =
    application?.metadata?.annotations?.[lightspeedAgenticRunNamespaceAnnotation] || undefined;

  // Find the AgenticRun that matches the application's annotations
  const targetAGR = React.useMemo(() => {
    const ar = (agenticRuns ?? []).find((c) => {
      const name = (c.metadata as Record<string, string>)?.name ?? '';
      const runNamespace = (c.metadata as Record<string, string>)?.namespace ?? '';
      return name.startsWith(targetAGRName) && runNamespace === targetAGRNamespace;
    });
    if (!ar) return null;
    const meta = ar.metadata;
    return {
      name: meta.name,
      namespace: meta.namespace,
    };
  }, [agenticRuns, targetAGRName, targetAGRNamespace]);

  // Just don't render the links if AGRs are not loaded or there is an error
  if (!isAGRLoaded || agrError) {
    return null;
  }
  const link = targetAGR ? (
    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <AISparkleFillIcon fill="currentColor" />
      <Link to={`/lightspeed/runs/${targetAGR.namespace}/${targetAGR.name}`}>
        {t('Go to AI remediation')}
      </Link>
    </span>
  ) : null;

  return children ? <>{children(link)}</> : link;
};
