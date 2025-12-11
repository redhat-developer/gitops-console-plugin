import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import classNames from 'classnames';

import Conditions from '@gitops/utils/components/Conditions/Conditions';
import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { useObjectModifyPermissions } from '@gitops/utils/utils';
import { k8sUpdate } from '@openshift-console/dynamic-plugin-sdk';
import {
  DescriptionList,
  Flex,
  FlexItem,
  NumberInput,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';

import BaseDetailsSummary, {
  DetailsDescriptionGroup,
} from '../shared/BaseDetailsSummary/BaseDetailsSummary';

import { RolloutModel } from './model/RolloutModel';
import BlueGreenServices from './strategy/BlueGreenServices';
import CanaryServices from './strategy/CanaryServices';
import { topologyLink } from './utils/TopologyLink';
import { RolloutStatusFragment } from './RolloutStatus';

type RolloutDetailsTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: any;
};

const RolloutDetailsTab: React.FC<RolloutDetailsTabProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, canUpdate] = useObjectModifyPermissions(obj, RolloutModel);

  const onReplicaChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    if (obj.spec.replicas == value) return;
    obj.spec.replicas = value;
    k8sUpdate({
      model: RolloutModel,
      data: obj,
    });
  };

  const onReplicaPlus = () => {
    obj.spec.replicas = (obj.spec.replicas || 0) + 1;
    k8sUpdate({
      model: RolloutModel,
      data: obj,
    });
  };

  const onReplicaMinus = () => {
    obj.spec.replicas = (obj.spec.replicas || 0) - 1;
    k8sUpdate({
      model: RolloutModel,
      data: obj,
    });
  };

  const topologyUrl = obj?.metadata?.namespace
    ? '/topology/ns/' + obj?.metadata?.namespace + '?view=graph&selectId=' + obj?.metadata?.uid
    : '/topology/all-namespaces?view=graph&selectId=' + obj?.metadata?.uid;

  return (
    <div>
      <PageSection
        variant={PageSectionVariants.default}
        className={classNames('co-m-pane__body', { 'co-m-pane__body--section-heading': true })}
      >
        <Title headingLevel="h2" className="co-section-heading">
          {t('Rollout details')}
        </Title>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceEvenly' }}
          direction={{ default: 'column', lg: 'row' }}
        >
          <Flex flex={{ default: 'flex_2' }}>
            <FlexItem fullWidth={{ default: 'fullWidth' }}>
              <BaseDetailsSummary
                obj={obj}
                model={RolloutModel}
                nameLink={topologyLink(topologyUrl, t)}
              />
            </FlexItem>
          </Flex>
          <Flex flex={{ default: 'flex_2' }} direction={{ default: 'column' }}>
            <FlexItem>
              <DescriptionList className="pf-c-description-list">
                <DetailsDescriptionGroup
                  title={t('Replicas')}
                  help={t('The number of desired replicas for the rollout')}
                >
                  <NumberInput
                    value={obj.spec.replicas}
                    onChange={onReplicaChange}
                    onPlus={onReplicaPlus}
                    onMinus={onReplicaMinus}
                    inputName="replicas"
                    inputAriaLabel="replicas"
                    minusBtnAriaLabel="minus"
                    plusBtnAriaLabel="plus"
                    min={0}
                    isDisabled={!canUpdate}
                  />
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Status')}
                  help={t('The current status of the rollout')}
                >
                  <Flex>
                    <FlexItem>
                      <RolloutStatusFragment
                        status={obj?.status?.phase}
                        message={obj?.status?.message}
                      />
                    </FlexItem>
                  </Flex>
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Strategy')}
                  help={t('Whether the rollout is using a blue-green or canary strategy')}
                >
                  <Flex>
                    <FlexItem>{obj?.spec?.strategy?.blueGreen ? 'Blue-Green' : 'Canary'}</FlexItem>
                  </Flex>
                </DetailsDescriptionGroup>
                {obj?.spec?.strategy?.blueGreen ? (
                  <BlueGreenServices rollout={obj} />
                ) : (
                  <CanaryServices rollout={obj} />
                )}
              </DescriptionList>
            </FlexItem>
          </Flex>
        </Flex>
      </PageSection>
      <PageSection variant={PageSectionVariants.default} hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Conditions')}
        </Title>
        <Conditions conditions={obj?.status?.conditions} />
      </PageSection>
    </div>
  );
};

export default RolloutDetailsTab;
