import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import classNames from 'classnames';

import { Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import {
  DescriptionList,
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';

import { ImageUpdaterKind, ImageUpdaterModel } from '../../models/ImageUpdaterModel';
import { Conditions } from '../../utils/components/Conditions/Conditions';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import BaseDetailsSummary, {
  DetailsDescriptionGroup,
} from '../shared/BaseDetailsSummary/BaseDetailsSummary';

type ImageUpdaterDetailsTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: ImageUpdaterKind;
};

const ImageUpdaterDetailsTab: React.FC<ImageUpdaterDetailsTabProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();

  if (!obj) return null;

  const status = obj.status || {};
  const readyCondition = status.conditions?.find((c) => c.type === 'Ready');
  const readyLabel = readyCondition
    ? readyCondition.status === 'True' ? t('True') : t('False')
    : '-';

  return (
    <>
      <PageSection
        variant={PageSectionVariants.default}
        className={classNames('co-m-pane__body', { 'co-m-pane__body--section-heading': true })}
      >
        <Title headingLevel="h2" className="co-section-heading">
          {t('ImageUpdater details')}
        </Title>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceEvenly' }}
          direction={{ default: 'column', lg: 'row' }}
        >
          <Flex flex={{ default: 'flex_2' }}>
            <FlexItem fullWidth={{ default: 'fullWidth' }}>
              <BaseDetailsSummary obj={obj} model={ImageUpdaterModel} showOwner={false} />
            </FlexItem>
          </Flex>

          <Flex flex={{ default: 'flex_2' }} direction={{ default: 'column' }}>
            <FlexItem>
              <DescriptionList className="pf-c-description-list">
                <DetailsDescriptionGroup
                  title={t('Ready')}
                  help={t('Whether the last reconciliation completed without errors.')}
                >
                  {readyLabel}
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Applications Matched')}
                  help={t('Number of applications matched by this ImageUpdater.')}
                >
                  {String(status.applicationsMatched ?? '-')}
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Images Managed')}
                  help={t('Number of images eligible for update checking.')}
                >
                  {String(status.imagesManaged ?? '-')}
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Last Checked At')}
                  help={t('When the controller last checked for image updates.')}
                >
                  {status.lastCheckedAt ? (
                    <Timestamp timestamp={status.lastCheckedAt} />
                  ) : (
                    '-'
                  )}
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Last Updated At')}
                  help={t('When the controller last performed an image update.')}
                >
                  {status.lastUpdatedAt ? (
                    <Timestamp timestamp={status.lastUpdatedAt} />
                  ) : (
                    '-'
                  )}
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Observed Generation')}
                  help={t('The generation of the resource that was last reconciled.')}
                >
                  {String(status.observedGeneration ?? '-')}
                </DetailsDescriptionGroup>
              </DescriptionList>
            </FlexItem>
          </Flex>
        </Flex>
      </PageSection>

      {status.conditions && status.conditions.length > 0 && (
        <PageSection>
          <Title headingLevel="h2" className="co-section-heading">
            {t('Conditions')}
          </Title>
          <Conditions conditions={status.conditions} />
        </PageSection>
      )}
    </>
  );
};

export default ImageUpdaterDetailsTab;
