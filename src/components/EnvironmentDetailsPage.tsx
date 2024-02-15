import * as React from 'react';
import * as _ from 'lodash';

import { LoadingBox } from '@patternfly/quickstarts';

import { environmentBaseURI, environmentBaseURIV2, fetchDataFrequency } from '../const';

import EnvironmentDetails from './details/EnvironmentDetails';
import { GitOpsEnvironment } from './utils/gitops-types';
import { getEnvData } from './utils/gitops-utils';
import EnvironmentEmptyState from './EnvironmentEmptyState';

type GitOpsOverviewPageProps = {
  appName?: string,
  customData: {
    emptyStateMsg: string;
    envs: string[];
    applicationBaseURI: string;
    manifestURL: string;
  };
};
type EnvironmentDetailsPageProps = GitOpsOverviewPageProps;

const EnvironmentDetailsPage: React.FC<EnvironmentDetailsPageProps> = (props) => {
  const { emptyStateMsg, envs, applicationBaseURI, manifestURL } = props.customData;
  const  appName  = props.appName;

  const [envsData, setEnvsData] = React.useState<GitOpsEnvironment[]>(null);
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
        if (data && data.length > 0) {
          setEnvsData(data);
        }
      }
    };

    getEnvsData();
    const id = setInterval(getEnvsData, fetchDataFrequency * 1000);
    return () => {
      clearInterval(id);
    };
  }, [applicationBaseURI, envs, error]);

  if (!envsData) {
    return <LoadingBox />;
  } else if (!emptyStateMsg) {
    return (
      <EnvironmentDetails
        envs={envsData}
        appName={appName}
        manifestURL={manifestURL}
        error={error}
      />
    );
  } else {
    return <EnvironmentEmptyState emptyStateMsg={emptyStateMsg} />;
  }
};

export default EnvironmentDetailsPage;
