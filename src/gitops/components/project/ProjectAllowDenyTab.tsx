import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  List,
  ListItem,
  PageSection,
  PageSectionVariants,
  Panel,
  Title,
} from '@patternfly/react-core';

import { AppProjectKind } from '../../models/AppProjectModel';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import { getDisplayValue, isDenyRule } from '../../utils/project-utils';

import DestinationsList from './DestinationsList';
import ResourceAllowDenyList from './ResourceAllowDenyList';

const renderStringArray = (items: string[] | undefined, t: (key: string) => string) => {
  if (items && items.length > 0) {
    return (
      <List isPlain className="pf-u-mt-sm">
        {items.map((el, idx) => {
          const denyRule = isDenyRule(el);
          const displayValue = getDisplayValue(el);
          return (
            <ListItem key={idx}>
              {denyRule ? (
                <span>
                  <Badge isRead color="red" className="pf-u-mr-sm">
                    {t('Deny')}
                  </Badge>
                  <code>{displayValue}</code>
                </span>
              ) : (
                <span>
                  <Badge isRead color="green" className="pf-u-mr-sm">
                    {t('Allow')}
                  </Badge>
                  <code>{displayValue}</code>
                </span>
              )}
            </ListItem>
          );
        })}
      </List>
    );
  } else {
    return <div className="pf-u-text-align-center pf-u-mt-sm">{'-'}</div>;
  }
};

type ProjectAllowDenyTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: AppProjectKind;
};

const ProjectAllowDenyTab: React.FC<ProjectAllowDenyTabProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();

  if (!obj) return null;

  const spec = obj.spec || {};

  return (
    <>
      <PageSection variant={PageSectionVariants.default} hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Allowed Sources')}
        </Title>
        <Panel className="pf-v5-u-background-color-200 pf-v5-u-p-md">
          <Grid hasGutter span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
            <GridItem>
              <Card className="pf-v5-u-h-100">
                <CardHeader>
                  <Title headingLevel="h5">{t('Repositories')}</Title>
                </CardHeader>
                <CardBody>{renderStringArray(spec.sourceRepos, t)}</CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card className="pf-v5-u-h-100">
                <CardHeader>
                  <Title headingLevel="h5">{t('Namespaces')}</Title>
                </CardHeader>
                <CardBody>{renderStringArray(spec.sourceNamespaces, t)}</CardBody>
              </Card>
            </GridItem>
          </Grid>
        </Panel>
      </PageSection>

      <PageSection variant={PageSectionVariants.default} hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Allowed Destinations')}
        </Title>
        <Panel className="pf-v5-u-background-color-200 pf-v5-u-p-md">
          <Grid hasGutter>
            <GridItem>
              <Card className="pf-v5-u-h-100">
                <CardBody>
                  <DestinationsList destinations={spec.destinations} />
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </Panel>
      </PageSection>

      <PageSection hasShadowTop={true} variant={PageSectionVariants.default}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Resource Allow/Deny Lists')}
        </Title>
        <Panel className="pf-v5-u-background-color-200 pf-v5-u-p-md">
          <Grid hasGutter span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
            <GridItem>
              <Card className="pf-v5-u-h-100">
                <CardHeader>
                  <Title headingLevel="h5">{t('Cluster Resource Allow List')}</Title>
                </CardHeader>
                <CardBody>
                  <ResourceAllowDenyList list={spec.clusterResourceWhitelist} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card className="pf-v5-u-h-100">
                <CardHeader>
                  <Title headingLevel="h5">{t('Cluster Resource Deny List')}</Title>
                </CardHeader>
                <CardBody>
                  <ResourceAllowDenyList list={spec.clusterResourceBlacklist} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card className="pf-v5-u-h-100">
                <CardHeader>
                  <Title headingLevel="h5">{t('Namespace Resource Allow List')}</Title>
                </CardHeader>
                <CardBody>
                  <ResourceAllowDenyList list={spec.namespaceResourceWhitelist} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem>
              <Card className="pf-v5-u-h-100">
                <CardHeader>
                  <Title headingLevel="h5">{t('Namespace Resource Deny List')}</Title>
                </CardHeader>
                <CardBody>
                  <ResourceAllowDenyList list={spec.namespaceResourceBlacklist} />
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </Panel>
      </PageSection>
    </>
  );
};

export default ProjectAllowDenyTab;
