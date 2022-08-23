import * as _ from 'lodash';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { LoadingBox } from '@patternfly/quickstarts';

import GitOpsDetails from './details/GitOpsDetails';
import GitOpsEmptyState from './GitOpsEmptyState';
import { GitOpsEnvironment } from './utils/gitops-types';
import { getApplicationsBaseURI, getEnvData, getPipelinesBaseURI } from './utils/gitops-utils';
import useDefaultSecret from './utils/useDefaultSecret';
import useEnvDetails from './utils/useEnvDetails';

const GitOpsDetailsPage: React.FC<RouteComponentProps<{ appName?: string }>> = ({ match }) => {
  const { appName } = match.params;
  const [secretNS, secretName] = useDefaultSecret();
  const pipelinesBaseURI = getPipelinesBaseURI(secretNS, secretName);
  const searchParams = new URLSearchParams(location.search);
  const manifestURL = searchParams.get('url');
  const applicationBaseURI = getApplicationsBaseURI(appName, secretNS, secretName, manifestURL);
  const [envs, emptyStateMsg] = useEnvDetails(appName, manifestURL, pipelinesBaseURI);

  const [envsData, setEnvsData] = React.useState<GitOpsEnvironment[]>(null);
  const environmentBaseURI = `/api/gitops/environments`;
  const environmentBaseURIV2 = `/api/gitops/environment`;
  const [error, setError] = React.useState<Error>(null);

  React.useEffect(() => {
    const getEnvsData = async () => {
      if (!_.isEmpty(envs) && applicationBaseURI) {
        let data;
        try {
          data = await Promise.all(
            _.map(envs, (env: string) =>
              getEnvData(environmentBaseURIV2, environmentBaseURI, env, applicationBaseURI),
            ),
          );
        } catch (err) {
          setError(err);
        }
        setEnvsData(data);
      }
    };

    getEnvsData();
  }, [applicationBaseURI, environmentBaseURIV2, environmentBaseURI, envs, error]);

  return (
    <>
      {!envsData ? (
        <LoadingBox />
      ) : !emptyStateMsg ? (
        <GitOpsDetails envs={envsData} appName={appName} manifestURL={manifestURL} error={error} />
      ) : (
        <GitOpsEmptyState emptyStateMsg={emptyStateMsg} />
      )}
    </>
  );
};

export default GitOpsDetailsPage;
