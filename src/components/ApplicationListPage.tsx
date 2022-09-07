import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import {
  ListPageBody,
  ListPageHeader,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { LoadingBox } from '@patternfly/quickstarts';

import DevPreviewBadge from './import/badges/DevPreviewBadge';
import ApplicationList from './list/ApplicationList';
import { fetchAllAppGroups, getManifestURLs, getPipelinesBaseURI } from './utils/gitops-utils';
import useDefaultSecret from './utils/useDefaultSecret';

import './ApplicationListPage.scss';

// TODO: check and match the latest code when uncomment out these imports
// import { ProjectModel } from '@console/internal/models';

// const projectRes = { isList: true, kind: ProjectModel.kind, optional: true };
const projectRes = { isList: true, kind: 'Project', optional: true };

const ApplicationListPage: React.FC = () => {
  const [appGroups, setAppGroups] = React.useState(null);
  const [emptyStateMsg, setEmptyStateMsg] = React.useState(null);
  const [namespaces, nsLoaded, nsError] = useK8sWatchResource<any[]>(projectRes);
  const [secretNS, secretName] = useDefaultSecret();
  const baseURL = getPipelinesBaseURI(secretNS, secretName);
  const { t } = useTranslation();

  React.useEffect(() => {
    let ignore = false;

    const getAppGroups = async () => {
      if (nsLoaded) {
        const manifestURLs = (!nsError && getManifestURLs(namespaces)) || [];
        const [allAppGroups, emptyMsg] = await fetchAllAppGroups(baseURL, manifestURLs, t);
        if (ignore) return;
        setAppGroups(allAppGroups);
        setEmptyStateMsg(emptyMsg);
      }
    };

    getAppGroups();

    return () => {
      ignore = true;
    };
  }, [baseURL, namespaces, nsError, nsLoaded, t]);

  return (
    <div className="gitops-plugin__application-list-page">
      <Helmet>
        <title>{t('gitops-plugin~Environments')}</title>
      </Helmet>
      <ListPageHeader title={t('gitops-plugin~Environments')} badge={<DevPreviewBadge />} />
      {!appGroups && !emptyStateMsg ? (
        <LoadingBox />
      ) : (
        <>
          <ListPageBody>
            {t("gitops-plugin~Select an application to view the environment it's deployed in.")}
          </ListPageBody>
          <ApplicationList appGroups={appGroups} emptyStateMsg={emptyStateMsg} />
        </>
      )}
    </div>
  );
};

export default ApplicationListPage;
