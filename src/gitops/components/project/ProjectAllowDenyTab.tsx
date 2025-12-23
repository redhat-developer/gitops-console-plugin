import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  List,
  ListItem,
  PageSection,
  PageSectionVariants,
  Panel,
  Popover,
  Title,
} from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';

import { AppProjectKind } from '../../models/AppProjectModel';
import { ArgoServer, getArgoServerForProject } from '../../utils/gitops';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import { getDisplayValue, isDenyRule } from '../../utils/project-utils';
import { ArgoCDLink } from '../shared/ArgoCDLink/ArgoCDLink';

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
  const [model] = useK8sModel({ group: 'route.openshift.io', version: 'v1', kind: 'Route' });
  const [argoServer, setArgoServer] = React.useState<ArgoServer>({ host: '', protocol: '' });

  React.useEffect(() => {
    if (!obj || !model) return;
    (async () => {
      try {
        const server = await getArgoServerForProject(model, obj);
        setArgoServer(server);
      } catch (err) {
        console.warn('Error while fetching Argo CD Server url:', err);
      }
    })();
  }, [model, obj]);

  if (!obj) return null;

  const spec = obj.spec || {};
  const projectName = obj.metadata?.name;
  const argoCDUrl = argoServer.host
    ? `${argoServer.protocol}://${argoServer.host}/settings/projects/${projectName}?tab=summary`
    : '';

  return (
    <>
      <PageSection variant={PageSectionVariants.default} hasShadowTop={true}>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceBetween' }}
          alignItems={{ default: 'alignItemsCenter' }}
        >
          <FlexItem>
            <Flex alignItems={{ default: 'alignItemsCenter' }}>
              <FlexItem>
                <Title headingLevel="h2" className="co-section-heading">
                  {t('Allowed Sources')}
                </Title>
              </FlexItem>
              <FlexItem>
                <Popover
                  headerContent={<div>{t('Allowed Sources')}</div>}
                  bodyContent={<div>{t('Allowed Sources help')}</div>}
                >
                  <QuestionCircleIcon
                    style={{
                      marginLeft: '8px',
                      cursor: 'pointer',
                      color: 'var(--pf-v5-global--Color--200)',
                    }}
                  />
                </Popover>
              </FlexItem>
            </Flex>
          </FlexItem>
          {argoCDUrl && (
            <FlexItem>
              <ArgoCDLink href={argoCDUrl} />
            </FlexItem>
          )}
        </Flex>
        <Panel className="pf-v5-u-background-color-200 pf-v5-u-p-md">
          <Grid hasGutter>
            <GridItem span={12} md={6}>
              <Card className="pf-v5-u-h-100">
                <CardHeader>
                  <Title headingLevel="h5">{t('Repositories')}</Title>
                </CardHeader>
                <CardBody>{renderStringArray(spec.sourceRepos, t)}</CardBody>
              </Card>
            </GridItem>
            <GridItem span={12} md={6}>
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
        <Flex alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title headingLevel="h2" className="co-section-heading">
              {t('Allowed Destinations')}
            </Title>
          </FlexItem>
          <FlexItem>
            <Popover
              headerContent={<div>{t('Allowed Destinations')}</div>}
              bodyContent={<div>{t('Allowed Destinations help')}</div>}
            >
              <QuestionCircleIcon
                style={{
                  marginLeft: '8px',
                  cursor: 'pointer',
                  color: 'var(--pf-v5-global--Color--200)',
                }}
              />
            </Popover>
          </FlexItem>
        </Flex>
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
        <Flex alignItems={{ default: 'alignItemsCenter' }}>
          <FlexItem>
            <Title headingLevel="h2" className="co-section-heading">
              {t('Resource Allow/Deny Lists')}
            </Title>
          </FlexItem>
          <FlexItem>
            <Popover
              headerContent={<div>{t('Resource Allow/Deny Lists')}</div>}
              bodyContent={<div>{t('Resource Allow/Deny Lists help')}</div>}
            >
              <QuestionCircleIcon
                style={{
                  marginLeft: '8px',
                  cursor: 'pointer',
                  color: 'var(--pf-v5-global--Color--200)',
                }}
              />
            </Popover>
          </FlexItem>
        </Flex>
        <Panel className="pf-v5-u-background-color-200 pf-v5-u-p-md">
          <Grid hasGutter>
            <GridItem span={12} md={6} lg={3}>
              <Card className="pf-v5-u-h-100">
                <CardHeader>
                  <Title headingLevel="h5">{t('Cluster Resource Allow List')}</Title>
                </CardHeader>
                <CardBody>
                  <ResourceAllowDenyList list={spec.clusterResourceWhitelist} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={12} md={6} lg={3}>
              <Card className="pf-v5-u-h-100">
                <CardHeader>
                  <Title headingLevel="h5">{t('Cluster Resource Deny List')}</Title>
                </CardHeader>
                <CardBody>
                  <ResourceAllowDenyList list={spec.clusterResourceBlacklist} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={12} md={6} lg={3}>
              <Card className="pf-v5-u-h-100">
                <CardHeader>
                  <Title headingLevel="h5">{t('Namespace Resource Allow List')}</Title>
                </CardHeader>
                <CardBody>
                  <ResourceAllowDenyList list={spec.namespaceResourceWhitelist} />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={12} md={6} lg={3}>
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
