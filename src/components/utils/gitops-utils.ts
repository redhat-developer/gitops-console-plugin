import { TFunction } from 'i18next';
import * as _ from 'lodash-es';

import { consoleFetchJSON } from '@openshift-console/dynamic-plugin-sdk';

import { GitOpsAppGroupData, GitOpsManifestData } from './gitops-types';

export const getManifestURLs = (namespaces: any[]): string[] => {
  const annotation = 'app.openshift.io/vcs-uri';
  return _.uniq(
    namespaces
      .filter((ns) => {
        return !!ns.metadata?.annotations?.[annotation];
      })
      .map((ns) => {
        return ns.metadata?.annotations?.[annotation];
      }),
  );
};

export const getApplicationsListBaseURI = () => {
  return `/api/gitops/applications`;
};

// export const fetchAppGroups = async (
//   baseURL: string,
//   manifestURL: string,
// ): Promise<GitOpsAppGroupData[]> => {
//   let data: GitOpsManifestData;
//   try {
//     const newListApi = getApplicationsListBaseURI();
//     data = await coFetchJSON(`${newListApi}?url=${manifestURL}`);
//   } catch (err) {
//     try {
//       data = await coFetchJSON(`${baseURL}&url=${manifestURL}`);
//     } catch {} // eslint-disable-line no-empty
//   }
//   return data?.applications ?? [];
// };

export class RetryError extends Error {}

export class TimeoutError extends Error {
  constructor(url: any, ms: any, ...params: any[]) {
    super(`Call to ${url} timed out after ${ms}ms.`); //å ...params);
    // Dumb hack to fix `instanceof TimeoutError`
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

const initDefaults = {
  headers: {},
  credentials: 'same-origin',
};

const cookiePrefix = 'csrf-token=';
const getCSRFToken = () =>
  document &&
  document.cookie &&
  document.cookie
    .split(';')
    .map((c) => _.trim(c))
    .filter((c) => c.startsWith(cookiePrefix))
    .map((c) => c.slice(cookiePrefix.length))
    .pop();

export const validateStatus = async (response: Response, url, method, retry) => {
  console.log('VALIDATE STATUS - RESPONSE STATUS IS ' + response.status);
  console.log('VALIDATE STATUS - RESPONSE TEXT IS ' + response.text);
  console.log('VALIDATE STATUS - RESPONSE BODY IS ' + response.body);
  console.log('VALIDATE STATUS - RESPONSE formData IS ' + response.formData);
  if (response.ok) {
    return response;
  }

  // if (retry && response.status === 429) {
  //   throw new RetryError();
  // }

  // if (response.status === 401 && shouldLogout(url)) {
  //   authSvc.logout(window.location.pathname);
  // }

  // const contentType = response.headers.get('content-type');
  // if (!contentType || contentType.indexOf('json') === -1) {
  //   const error = new Error(response.statusText);
  //   error.response = response;
  //   throw error;
  // }

  // if (response.status === 403) {
  //   return response.json().then((json) => {
  //     const error = new Error(json.message || 'Access denied due to cluster policy.');
  //     error.response = response;
  //     error.json = json;
  //     throw error;
  //   });
  // }

  return response.json().then((json) => {
    // retry 409 conflict errors due to ClustResourceQuota / ResourceQuota
    // https://bugzilla.redhat.com/show_bug.cgi?id=1920699
    if (
      retry &&
      method === 'POST' &&
      response.status === 409 &&
      ['resourcequotas', 'clusterresourcequotas'].includes(json.details?.kind)
    ) {
      throw new RetryError();
    }
    const cause = json.details?.causes?.[0];
    let reason;
    if (cause) {
      reason = `Error "${cause.message}" for field "${cause.field}".`;
    }
    if (!reason) {
      reason = json.message;
    }
    if (!reason) {
      reason = json.error;
    }
    if (!reason) {
      reason = response.statusText;
    }
    const error = new Error(reason);
    // error.response = response;
    // error.json = json;
    throw error;
  });
};

export const coFetchInternal = async (url, options, timeout, retry) => {
  const allOptions = _.defaultsDeep({}, initDefaults, options);
  if (allOptions.method !== 'GET') {
    allOptions.headers['X-CSRFToken'] = getCSRFToken();
  }

  // If the URL being requested is absolute (and therefore, not a local request),
  // remove the authorization header to prevent credentials from leaking.
  if (url.indexOf('://') >= 0) {
    delete allOptions.headers.Authorization;
    delete allOptions.headers['X-CSRFToken'];
  }

  const fetchPromise = await fetch(url, allOptions)
    .then((response: Response) => response.json())
    .then(
      (data) => {
        console.log('DATA!!! is ' + data);
        console.log(JSON.stringify(data));
      }, // validateStatus(response, url, allOptions.method, retry),
    );

  // return fetch promise directly if timeout <= 0
  if (timeout < 1) {
    return fetchPromise;
  }

  const timeoutPromise = new Promise((unused, reject) =>
    setTimeout(() => reject(new TimeoutError(url, timeout)), timeout),
  );

  // Initiate both the fetch promise and a timeout promise
  return Promise.race([fetchPromise, timeoutPromise]);
};

export const fetchAppGroups = async (
  baseURL: string,
  manifestURL: string,
): Promise<GitOpsAppGroupData[]> => {
  let data: GitOpsManifestData;
  try {
    const newListApi = getApplicationsListBaseURI();
    console.log('fetching ' + newListApi);
    data = await consoleFetchJSON(`${newListApi}?url=${manifestURL}&method=curl`);
  } catch (err) {
    console.log('ERROR in fetch ' + err);
    try {
      data = await consoleFetchJSON(`${baseURL}&url=${manifestURL}`);
    } catch {} // eslint-disable-line no-empty
    // Ignore and let empty data be handled by fetchAllAppGroups
  }
  return data?.applications ?? [];
};

// export const fetchAppGroups = async (
//   baseURL: string,
//   manifestURL: string,
// ): Promise<GitOpsAppGroupData[]> => {
//   let data: GitOpsManifestData;
//   try {
//     // const newListApi = getApplicationsListBaseURI();
//     // const newListApi = 'https://cluster.openshift-gitops.svc:8080/applications';
//     // const manifestURL = 'https://gitlab.com/keithchong/gitops5.git?ref=main';

//     // let data2 = await Axios.get('http://localhost:9000/api/gitops/applications?url=https://gitlab.com/keithchong/gitops5.git?ref=HEAD');
//     //https://cluster.openshift-gitops.svc:8080/api/gitops/applications');
//     // console.log("****** DATA is " + data);

//     // let url = 'https://cluster.openshift-gitops.svc:8080/applications?url=https://gitlab.com/keithchong/gitops5.git?ref=HEAD';
//     let url = 'api/gitops/applications?url=https://github.com/keithchong/gitops411.git?ref=HEAD';
//     let options = {};
//     let attempt = 0;
//     let timeout = 60000;
//     let response;
//     let retry = true;
//     while (retry) {
//       retry = false;
//       attempt++;
//       try {
//         response = await coFetchInternal(url, options, timeout, attempt < 3);
//         data = await response.json();
//         console.log("DATA!!! is " + data);
//         return data?.applications ?? [];
//       } catch (e) {
//         if (e instanceof RetryError) {
//           retry = true;
//         } else {
//           // throw e;
//         }
//       }
//     }
//     console.log("****** DATA is " + data);
//     // data = await consoleFetchJSON(`${newListApi}?url=${manifestURL}`);
//     // data = await consoleFetchJSON(url, "GET", options, timeout);
//     // console.log("****** DATA is " + stringify(data));

//   } catch (err) {
//     console.log("****** ERROR is " + err);

//     try {
//       // data = await coFetchJSON(`${baseURL}&url=${manifestURL}`);
//     } catch {} // eslint-disable-line no-empty
//   }
//   return data?.applications ?? [];
// };

export const fetchAllAppGroups = async (baseURL: string, manifestURLs: string[], t: TFunction) => {
  let emptyMsg: string = null;
  let allAppGroups: GitOpsAppGroupData[] = null;

  if (baseURL) {
    if (_.isEmpty(manifestURLs)) {
      emptyMsg = t('plugin__gitops-plugin~No GitOps manifest URLs found');
    } else {
      try {
        allAppGroups = _.sortBy(
          _.flatten(
            await Promise.all(
              _.map(manifestURLs, (manifestURL) => fetchAppGroups(baseURL, manifestURL)),
            ),
          ),
          ['name'],
        );
      } catch {
        emptyMsg = t('plugin__gitops-plugin~Error cannot retrieve applications');
        return [allAppGroups, emptyMsg];
      }
      if (_.isEmpty(allAppGroups)) {
        emptyMsg = t('plugin__gitops-plugin~No Application groups found');
      }
    }
  }
  return [allAppGroups, emptyMsg];
};

// TODO
export const getEnvData = async (v2EnvURI: string, envURI: string, env: string, appURI: string) => {
  let data;
  try {
    data = await consoleFetchJSON(`${v2EnvURI}/${env}${appURI}&method=GET`);
  } catch {
    try {
      data = await consoleFetchJSON(`${envURI}/${env}${appURI}&method=GET`);
    } catch (error) {
      console.log('error when getEnvData: ', error);
      throw error;
    }
  }
  return data;
};

export const getArgoCDFilteredAppsURI = (argocdBaseUri: string, appGroupName: string) => {
  return argocdBaseUri && appGroupName
    ? `${argocdBaseUri}/applications?labels=app.kubernetes.io%252Fname%253D${appGroupName}`
    : undefined;
};
