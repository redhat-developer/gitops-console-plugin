import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { AgenticRunKind, LightspeedAgenticRunModel } from '@gitops/models/AgenticRunModel';
import { ApplicationKind } from '@gitops/models/ApplicationModel';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import AISparkleFillIcon from '@images/ai-sparkle-fill.svg';
import { useAccessReview, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';

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
  const lightspeedAgenticRunNameAnnotation = 'gitops.openshift.io/lightspeed-agentic-run-name';
  const lightspeedAgenticRunNamespaceAnnotation =
    'gitops.openshift.io/lightspeed-agentic-run-namespace';
  const targetAGRName =
    application?.metadata?.annotations?.[lightspeedAgenticRunNameAnnotation] || undefined;
  const targetAGRNamespace =
    application?.metadata?.annotations?.[lightspeedAgenticRunNamespaceAnnotation] || undefined;

  const [targetAGR, isAGRLoaded, agrError] = useK8sWatchResource<AgenticRunKind>(
    targetAGRName && targetAGRNamespace
      ? {
          isList: false,
          groupVersionKind: {
            group: LightspeedAgenticRunModel.apiGroup,
            kind: LightspeedAgenticRunModel.kind,
            version: LightspeedAgenticRunModel.apiVersion,
          },
          name: targetAGRName,
          namespace: targetAGRNamespace,
        }
      : null,
  );

  // Check if the user can actually 'get' access to the AGR
  const [canGetAccess, isLoadingGetAccess] = useAccessReview({
    group: LightspeedAgenticRunModel.apiGroup,
    resource: LightspeedAgenticRunModel.plural,
    verb: 'get',
    name: targetAGRName,
    namespace: targetAGRNamespace,
  });

  // Just don't render the links if AGRs are not loaded or there is an error
  if (!isAGRLoaded || agrError) {
    return null;
  }

  const link =
    targetAGR && canGetAccess && !isLoadingGetAccess ? (
      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <AISparkleFillIcon fill="currentColor" />
        <Link to={`/lightspeed/runs/${targetAGR.metadata?.namespace}/${targetAGR.metadata?.name}`}>
          {t('Go to AI remediation')}
        </Link>
      </span>
    ) : null;

  return children ? <>{children(link)}</> : link;
};
