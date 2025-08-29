import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { ApplicationSetKind } from '../../models/ApplicationSetModel';
import {
  Badge,
  PageSection,
  Title,
  DescriptionList,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import ResourceDetailsAttributes from '../../utils/components/ResourceDetails/ResourceDetailsAttributes';
import './AppSetDetailsTab.scss';

type AppSetDetailsTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: ApplicationSetKind;
  namespace?: string;
  name?: string;
};

const AppSetDetailsTab: React.FC<AppSetDetailsTabProps> = ({ obj }) => {
  if (!obj) return null;

  const metadata = obj.metadata || {};
  const status = obj.status || {};

  return (
    <>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          ApplicationSet details
        </Title>
        <Grid hasGutter={true} span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
          <GridItem>
            <DescriptionList>
              <ResourceDetailsAttributes
                metadata={metadata}
                resource={obj}
                showOwner={true}
                showStatus={true}
                showGeneratedApps={true}
                showGenerators={true}
                showAppProject={true}
                showRepository={true}
              />
            </DescriptionList>
          </GridItem>
        </Grid>
      </PageSection>
      
      {status.conditions && status.conditions.length > 0 && (
        <PageSection>
          <Title headingLevel="h2" className="co-section-heading">
            Conditions
          </Title>
          <div className="application-set-details-page__conditions-table">
            <div className="application-set-details-page__conditions-table-header">
              <div className="application-set-details-page__conditions-table-header-cell application-set-details-page__conditions-table-header-cell--type">Type</div>
              <div className="application-set-details-page__conditions-table-header-cell application-set-details-page__conditions-table-header-cell--status">Status</div>
              <div className="application-set-details-page__conditions-table-header-cell application-set-details-page__conditions-table-header-cell--updated">Updated</div>
              <div className="application-set-details-page__conditions-table-header-cell application-set-details-page__conditions-table-header-cell--reason">Reason</div>
              <div className="application-set-details-page__conditions-table-header-cell application-set-details-page__conditions-table-header-cell--message">Message</div>
            </div>
            {status.conditions.map((condition: any, index: number) => (
              <React.Fragment key={index}>
                <div className="application-set-details-page__conditions-table-row">
                  <div className="application-set-details-page__conditions-table-row-cell application-set-details-page__conditions-table-row-cell--type">{condition.type}</div>
                  <div className="application-set-details-page__conditions-table-row-cell application-set-details-page__conditions-table-row-cell--status">
                    <Badge isRead color={condition.status === 'True' ? 'green' : 'red'}>
                      {condition.status}
                    </Badge>
                  </div>
                  <div className="application-set-details-page__conditions-table-row-cell application-set-details-page__conditions-table-row-cell--updated">
                    <Timestamp timestamp={condition.lastTransitionTime} />
                  </div>
                  <div className="application-set-details-page__conditions-table-row-cell application-set-details-page__conditions-table-row-cell--reason">{condition.reason || ''}</div>
                  <div className="application-set-details-page__conditions-table-row-cell application-set-details-page__conditions-table-row-cell--message">{condition.message || ''}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </PageSection>
      )}
    </>
  );
};

export default AppSetDetailsTab;
