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

import { ImageUpdaterKind } from '../../models/ImageUpdaterModel';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import { DetailsDescriptionGroup } from '../shared/BaseDetailsSummary/BaseDetailsSummary';
import { AgeCell } from '../shared/dateUtils';

type ImageUpdaterDetailsTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: ImageUpdaterKind;
};

const ImageUpdaterDetailsTab: React.FC<ImageUpdaterDetailsTabProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();

  if (!obj) return null;

  const status = obj.status || {};
  const readyCondition = status.conditions?.find((c) => c.type === 'Ready');
  let readyLabel = '-';
  if (readyCondition) {
    readyLabel = readyCondition.status === 'True' ? t('True') : t('False');
  }

  return (
    <>
      <PageSection
        variant={PageSectionVariants.default}
        className={classNames('co-m-pane__body', { 'co-m-pane__body--section-heading': true })}
      >
        <Flex
          justifyContent={{ default: 'justifyContentSpaceEvenly' }}
          direction={{ default: 'column', lg: 'row' }}
        >
          <Flex flex={{ default: 'flex_2' }}>
            <FlexItem fullWidth={{ default: 'fullWidth' }}>
              <DescriptionList className="pf-v6-c-description-list">
                <DetailsDescriptionGroup
                  title={t('Name')}
                  help={t('Name must be unique within a namespace.')}
                >
                  {obj.metadata?.name}
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Namespace')}
                  help={t('Namespace defines the space within which each name must be unique.')}
                >
                  {obj.metadata?.namespace}
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Age')}
                  help={t('Time since the ImageUpdater was created.')}
                >
                  <AgeCell creationTimestamp={obj.metadata?.creationTimestamp} />
                </DetailsDescriptionGroup>
              </DescriptionList>
            </FlexItem>
          </Flex>
        </Flex>
      </PageSection>

      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
            {t('Controller status')}
        </Title>
        <Flex flex={{ default: 'flex_2' }}>
          <FlexItem fullWidth={{ default: 'fullWidth' }}>
            <DescriptionList className="pf-v6-c-description-list">
              <DetailsDescriptionGroup
                title={t('Applications matched')}
                help={t('Number of applications matched by this ImageUpdater.')}
              >
                {String(status.applicationsMatched ?? '-')}
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup
                title={t('Images managed')}
                help={t('Number of images eligible for update checking.')}
              >
                {String(status.imagesManaged ?? '-')}
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup
                title={t('Last registry check')}
                help={t('When the controller last checked for image updates.')}
              >
                {status.lastCheckedAt ? <Timestamp timestamp={status.lastCheckedAt} /> : '-'}
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup
                title={t('Last update applied')}
                help={t('When the controller last performed an image update.')}
              >
                {status.lastUpdatedAt ? <Timestamp timestamp={status.lastUpdatedAt} /> : '-'}
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup
                title={t('Ready')}
                help={t('Whether the last reconciliation completed without errors.')}
              >
                {readyLabel}
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup
                title={t('Created at')}
                help={t(
                  'Time is a wrapper around time. Time which supports correct marshaling to YAML and JSON.',
                )}
              >
                <Timestamp timestamp={obj?.metadata?.creationTimestamp} />
              </DetailsDescriptionGroup>
            </DescriptionList>
          </FlexItem>
        </Flex>
      </PageSection>
    </>
  );
};

export default ImageUpdaterDetailsTab;
