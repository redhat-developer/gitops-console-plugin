import * as React from 'react';
import classNames from 'classnames';

import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { getSelectorSearchURL, kindForReference } from '@gitops/utils/utils';
import { K8sResourceKindReference } from '@openshift-console/dynamic-plugin-sdk';
import { LabelGroup } from '@patternfly/react-core';
import { Label as PfLabel } from '@patternfly/react-core';

type LabelProps = {
  kind: K8sResourceKindReference;
  name: string;
  value: string;
  expand: boolean;
};

const LabelL: React.FC<LabelProps> = ({ kind, name, value, expand }) => {
  const selector = value ? `${name}=${value}` : name;
  const href = getSelectorSearchURL('', kind, selector);
  const kindOf = `co-m-${kindForReference(kind.toLowerCase())}`;
  const klass = classNames(kindOf, { 'co-m-expand': expand }, 'co-label');
  return (
    <>
      <PfLabel className={klass} color={'blue'} href={href}>
        <span className="co-label__key" data-test="label-key">
          {name}
        </span>
        {value && <span className="co-label__eq">=</span>}
        {value && <span className="co-label__value">{value}</span>}
      </PfLabel>
    </>
  );
};

type MetadataLabelsProps = {
  kind: K8sResourceKindReference;
  labels?: { [key: string]: string };
};

export const MetadataLabels: React.FC<MetadataLabelsProps> = ({ kind, labels }) => {
  const { t } = useGitOpsTranslation();
  return labels && Object.keys(labels).length > 0 ? (
    <LabelGroup numLabels={10} className="co-label-group metadata-labels-group">
      {Object.keys(labels || {})?.map((key) => {
        return (
          <LabelL key={key} kind={kind} name={key} value={labels[key]} expand={true}>
            {labels[key] ? `${key}=${labels[key]}` : key}
          </LabelL>
        );
      })}
    </LabelGroup>
  ) : (
    <span className="metadata-labels-no-labels">{t('No labels')}</span>
  );
};

export default MetadataLabels;
