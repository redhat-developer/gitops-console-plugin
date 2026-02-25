import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import classNames from 'classnames';

import {
  ApplicationKind,
  ApplicationModel,
  ApplicationSource,
} from '@gitops/models/ApplicationModel';
import Revision from '@gitops/Revision/Revision';
import HealthStatus from '@gitops/Statuses/HealthStatus';
import { OperationState } from '@gitops/Statuses/OperationState';
import SyncStatus from '@gitops/Statuses/SyncStatus';
import { ArgoServer, getArgoServer, getFriendlyClusterName } from '@gitops/utils/gitops';
import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { useObjectModifyPermissions } from '@gitops/utils/utils';
import {
  k8sUpdate,
  ResourceLink,
  useK8sModel,
  useModal,
} from '@openshift-console/dynamic-plugin-sdk';
import { ModalComponent } from '@openshift-console/dynamic-plugin-sdk/lib/app/modal-support/ModalProvider';
import {
  Button,
  Label as PfLabel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ToggleGroup,
  ToggleGroupItem,
} from '@patternfly/react-core';
import {
  DescriptionList,
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';

import { ArgoCDLink } from '../shared/ArgoCDLink/ArgoCDLink';
import {
  BaseDetailsSummary,
  DetailsDescriptionGroup,
} from '../shared/BaseDetailsSummary/BaseDetailsSummary';

import { ConditionsPopover } from './Conditions/ConditionsPopover';

type ApplicationDetailsTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: ApplicationKind;
};

const ApplicationDetailsTab: React.FC<ApplicationDetailsTabProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();
  const [model] = useK8sModel({ group: 'route.openshift.io', version: 'v1', kind: 'Route' });

  const [canPatch, canUpdate] = useObjectModifyPermissions(obj, ApplicationModel);

  const [argoServer, setArgoServer] = React.useState<ArgoServer>({ host: '', protocol: '' });
  const launchModal = useModal();
  React.useEffect(() => {
    (async () => {
      getArgoServer(model, obj)
        .then((server) => {
          setArgoServer(server);
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    })();
  }, [model, obj]);

  const modalStyle: React.CSSProperties = {
    padding: '1rem 1rem',
    textAlign: 'left',
    zIndex: 9999,
    width: '500px',
  };

  const syncErrorModal: ModalComponent = (props) => {
    return (
      <Modal
        isOpen
        onClose={props?.closeModal}
        style={modalStyle}
        aria-describedby="modal-title-icon-description"
        aria-labelledby="title-icon-modal-title"
      >
        <ModalHeader title="Error" titleIconVariant="danger" labelId="title-icon-modal-title" />
        <ModalBody>
          <span id="modal-title-icon-description">
            Sync policy change failed. Check your application/logs and try again.
          </span>
        </ModalBody>
        <ModalFooter>
          <Button key="cancel" variant="primary" onClick={props?.closeModal}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const onChangeAutomated = (event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent) => {
    const id = event.currentTarget.id;
    switch (id) {
      case 'automated': {
        if (obj.spec.syncPolicy?.automated) {
          obj.spec.syncPolicy = {};
        } else {
          obj.spec.syncPolicy = { automated: {} };
        }
        break;
      }
      case 'self-heal': {
        if (obj.spec.syncPolicy?.automated?.selfHeal) {
          obj.spec.syncPolicy.automated.selfHeal = false;
        } else {
          obj.spec.syncPolicy.automated = {
            ...obj.spec.syncPolicy.automated,
            ...{ selfHeal: true },
          };
        }
        break;
      }
      case 'prune': {
        if (obj.spec.syncPolicy?.automated?.prune) {
          obj.spec.syncPolicy.automated.prune = false;
        } else {
          obj.spec.syncPolicy.automated = { ...obj.spec.syncPolicy.automated, ...{ prune: true } };
        }
        break;
      }
    }
    k8sUpdate({
      model: ApplicationModel,
      data: obj,
    })
      .then(() => {
        // ignore
      })
      .catch((e) => {
        launchModal(syncErrorModal, { errorMessage: e.message });
      });
  };

  let sources: ApplicationSource[];
  let revisions: string[] = [];
  if (obj?.spec?.source) {
    sources = [obj?.spec?.source];
    revisions = [obj.status?.sync?.revision];
  } else if (obj?.spec?.sources) {
    sources = obj.spec.sources;
    revisions = obj.status?.sync?.revisions || [];
  } else {
    sources = [];
    revisions = [];
  }
  return (
    <div>
      <PageSection
        variant={PageSectionVariants.default}
        className={classNames('co-m-pane__body', { 'co-m-pane__body--section-heading': true })}
      >
        <Title headingLevel="h2" className="co-section-heading">
          {t('Application details')}
        </Title>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceEvenly' }}
          direction={{ default: 'column', lg: 'row' }}
        >
          <Flex flex={{ default: 'flex_2' }}>
            <FlexItem fullWidth={{ default: 'fullWidth' }}>
              <BaseDetailsSummary
                obj={obj}
                model={ApplicationModel}
                nameLink={
                  <>
                    <ArgoCDLink
                      href={
                        argoServer.protocol +
                        '://' +
                        argoServer.host +
                        '/applications/' +
                        obj?.metadata?.namespace +
                        '/' +
                        obj?.metadata?.name
                      }
                    />
                  </>
                }
              />
            </FlexItem>
          </Flex>
          <Flex flex={{ default: 'flex_2' }} direction={{ default: 'column' }}>
            <FlexItem>
              <DescriptionList className="pf-c-description-list">
                <DetailsDescriptionGroup
                  title={t('Health Status')}
                  help={t('Health status represents the overall health of the application.')}
                >
                  <HealthStatus status={obj.status?.health?.status || ''} />
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Current Sync Status')}
                  help={t(
                    'Sync status represents the current synchronized state for the application.',
                  )}
                >
                  <Flex>
                    <FlexItem>
                      <SyncStatus status={obj.status?.sync?.status || ''} />
                    </FlexItem>
                    <FlexItem>
                      <PfLabel>
                        <Revision
                          revision={revisions[0] || ''}
                          repoURL={sources[0].repoURL}
                          helm={obj.status?.sourceType == 'Helm' && sources[0].chart ? true : false}
                          revisionExtra={
                            revisions.length > 1 && ' and ' + (revisions.length - 1) + ' more'
                          }
                        />
                      </PfLabel>
                    </FlexItem>
                  </Flex>
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Last Sync Status')}
                  help={t('The result of the last sync status.')}
                >
                  <Flex>
                    {obj?.status?.operationState && (
                      <FlexItem>
                        <OperationState app={obj} />
                      </FlexItem>
                    )}
                    {obj?.status?.conditions && (
                      <FlexItem>
                        <ConditionsPopover conditions={obj.status?.conditions} />
                      </FlexItem>
                    )}
                  </Flex>
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Target Revision')}
                  help={t('The specified revision for the Application.')}
                >
                  {sources[0].targetRevision ? sources[0].targetRevision : 'HEAD'}
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Project')}
                  help={t('The Argo CD Project that this application belongs to.')}
                >
                  {/* TODO - Update to handle App in Any Namespace when controller namespace is in status */}
                  <ResourceLink
                    namespace={obj?.metadata?.namespace}
                    groupVersionKind={{
                      group: 'argoproj.io',
                      version: 'v1alpha1',
                      kind: 'AppProject',
                    }}
                    name={obj?.spec?.project}
                  />
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Destination')}
                  help={t('The cluster and namespace where the application is targeted')}
                >
                  {getFriendlyClusterName(obj?.spec?.destination.server)}/
                  {obj?.spec?.destination.namespace}
                </DetailsDescriptionGroup>

                <DetailsDescriptionGroup
                  title={t('Sync Policy')}
                  help={t('Provides options to determine application synchronization behavior')}
                >
                  <ToggleGroup isCompact areAllGroupsDisabled={!canPatch || !canUpdate}>
                    <ToggleGroupItem
                      text={t('Automated')}
                      buttonId="automated"
                      onChange={onChangeAutomated}
                      isSelected={obj?.spec?.syncPolicy?.automated ? true : false}
                    />
                    <ToggleGroupItem
                      text={t('Prune')}
                      buttonId="prune"
                      onChange={onChangeAutomated}
                      isSelected={
                        obj?.spec?.syncPolicy?.automated && obj?.spec?.syncPolicy?.automated.prune
                      }
                      isDisabled={obj?.spec?.syncPolicy?.automated ? false : true}
                    />
                    <ToggleGroupItem
                      text={t('Self Heal')}
                      buttonId="self-heal"
                      onChange={onChangeAutomated}
                      isSelected={
                        obj?.spec?.syncPolicy?.automated &&
                        obj?.spec?.syncPolicy?.automated.selfHeal
                      }
                      isDisabled={obj?.spec?.syncPolicy?.automated ? false : true}
                    />
                  </ToggleGroup>
                </DetailsDescriptionGroup>
              </DescriptionList>
            </FlexItem>
          </Flex>
        </Flex>
      </PageSection>
    </div>
  );
};

export default ApplicationDetailsTab;
