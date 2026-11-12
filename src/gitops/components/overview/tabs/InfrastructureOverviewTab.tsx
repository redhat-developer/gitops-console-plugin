import {
  DescriptionList,
  DescriptionListGroup,
  Divider,
  Grid,
  GridItem,
  PageSection,
} from '@patternfly/react-core';

import ApplicationsCard from '../infrastructure/application/ApplicationsCard';
import ApplicationSetsCard from '../infrastructure/appset/ApplicationSetsCard';
import ArgoCDInstancesCard from '../infrastructure/argocd/ArgoCDInstancesCard';
import ImageUpdatersCard from '../infrastructure/imageupdater/ImageUpdatersCard';
import GitOpsOperatorCard from '../infrastructure/operator/GitOpsOperatorCard';
import AppProjectsCard from '../infrastructure/project/AppProjectsCard';
import RolloutsCard from '../infrastructure/rollout/RolloutsCard';
import RolloutManagersCard from '../infrastructure/rollout-manager/RolloutManagersCard';

const InfrastructureOverviewTab: React.FC<{ namespace?: string }> = ({ namespace }) => {
  return (
    <PageSection>
      <Grid
        style={{ margin: '0px', padding: '0px' }}
        hasGutter
        md={2}
        wrap="true"
        className="co-dashboard-body"
      >
        <GridItem span={12} md={12} lg={12} sm={12} rowSpan={1} smRowSpan={1} mdRowSpan={1}>
          <DescriptionList isCompact={false}>
            <DescriptionListGroup>
              <Grid hasGutter md={2} wrap="true">
                <GridItem span={12} md={6} lg={4} rowSpan={1}>
                  <GitOpsOperatorCard namespace={namespace} />
                </GridItem>
                <GridItem span={12} md={6} lg={4} rowSpan={1}>
                  <ArgoCDInstancesCard namespace={namespace} />
                </GridItem>
                <GridItem span={12} md={6} lg={4} rowSpan={1}>
                  <AppProjectsCard namespace={namespace} />
                </GridItem>
                <GridItem span={12} md={6} lg={6} rowSpan={1}>
                  <ApplicationsCard namespace={namespace} />
                </GridItem>
                <GridItem span={12} md={6} lg={6} rowSpan={1}>
                  <ApplicationSetsCard namespace={namespace} />
                </GridItem>
                <GridItem span={12} md={12} lg={12} rowSpan={1}>
                  <Divider
                    orientation={{ default: 'horizontal' }}
                    component="hr"
                    style={{ margin: '5px 0px 5px 0px' }}
                  />
                </GridItem>
                <GridItem span={12} md={6} lg={4} rowSpan={1}>
                  <ImageUpdatersCard namespace={namespace} />
                </GridItem>
                <GridItem span={12} md={6} lg={4} rowSpan={1}>
                  <RolloutManagersCard namespace={namespace} />
                </GridItem>
                <GridItem span={12} md={6} lg={4} rowSpan={1}>
                  <RolloutsCard namespace={namespace} />
                </GridItem>
              </Grid>
            </DescriptionListGroup>
          </DescriptionList>
        </GridItem>
      </Grid>
    </PageSection>
  );
};

export default InfrastructureOverviewTab;
