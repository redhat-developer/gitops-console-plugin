import * as React from 'react';
import { TFunction } from 'react-i18next';
import { Link } from 'react-router-dom-v5-compat';

import { DetailsDescriptionGroup } from '@gitops/components/shared/BaseDetailsSummary/BaseDetailsSummary';
import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { ResourceIcon, ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { Flex, FlexItem } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';

import { RolloutKind } from '../model/RolloutModel';

type CanaryServicesProps = {
  rollout: RolloutKind;
};

const getAnalysisTemplates = (steps, namespace: string, t: TFunction) => {
  const analysisTemplateUrl = '/k8s/ns/' + namespace + '/argoproj.io~v1alpha1~AnalysisTemplate/';
  const clusterAnalysisTemplateUrl = '/k8s/cluster/argoproj.io~v1alpha1~ClusterAnalysisTemplate/';
  const classes = css('co-resource-item', {
    'co-resource-item--inline': true,
    'co-resource-item--truncate': true,
  });
  const analysisTemplates: React.ReactNode[] = [];
  steps.forEach((step, stepIndex) => {
    if (step.analysis?.templates) {
      step.analysis.templates.forEach((template, templateIndex) => {
        if (template?.templateName) {
          analysisTemplates.push(
            <React.Fragment
              key={`step-${stepIndex}-template-${templateIndex}-${template.templateName}`}
            >
              <span className={classes}>
                <ResourceIcon
                  className="co-m-resource-icon argocd-resource-icon"
                  groupVersionKind={{
                    version: 'v1alpha1',
                    kind: template.clusterScope ? 'ClusterAnalysisTemplate' : 'AnalysisTemplate',
                  }}
                />
                <Link
                  className="pf-v5-c-content co-resource-item__resource-name"
                  rel="noopener noreferrer"
                  to={
                    template.clusterScope
                      ? clusterAnalysisTemplateUrl + template.templateName
                      : analysisTemplateUrl + template.templateName
                  }
                  aria-label={
                    template.clusterScope ? t('ClusterAnalysis Template') : t('Analysis Template')
                  }
                >
                  {template.templateName}
                </Link>
              </span>
            </React.Fragment>,
          );
        }
      });
    }
  });
  return analysisTemplates;
};

const CanaryServices: React.FC<CanaryServicesProps> = ({ rollout }) => {
  const { t } = useGitOpsTranslation();

  if (!rollout?.spec?.strategy?.canary) {
    return null;
  }

  const canaryStrategy = rollout.spec.strategy.canary;
  const namespace = rollout.metadata?.namespace || '';
  const analysisTemplates = canaryStrategy.steps
    ? getAnalysisTemplates(canaryStrategy.steps, namespace, t)
    : [];

  return (
    <>
      <DetailsDescriptionGroup title={t('Stable Service')} help={t('The stable service')}>
        {canaryStrategy.stableService ? (
          <ResourceLink
            groupVersionKind={{ version: 'v1', kind: 'Service' }}
            name={canaryStrategy.stableService}
            namespace={namespace}
          />
        ) : (
          '-'
        )}
      </DetailsDescriptionGroup>

      <DetailsDescriptionGroup title={t('Canary Service')} help={t('The canary service')}>
        {canaryStrategy.canaryService ? (
          <ResourceLink
            groupVersionKind={{ version: 'v1', kind: 'Service' }}
            name={canaryStrategy.canaryService}
            namespace={namespace}
          />
        ) : (
          '-'
        )}
      </DetailsDescriptionGroup>

      <DetailsDescriptionGroup
        title={t('Analysis Templates')}
        help={t('The analysis and cluster-scoped analysis templates used for the canary strategy')}
      >
        {canaryStrategy.steps && analysisTemplates.length > 0 ? (
          <Flex>
            <FlexItem>{analysisTemplates}</FlexItem>
          </Flex>
        ) : (
          '-'
        )}
      </DetailsDescriptionGroup>
    </>
  );
};

export default CanaryServices;
