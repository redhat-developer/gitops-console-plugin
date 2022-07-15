"use strict";
self["webpackHotUpdateconsole_gitops_plugin"]("exposed-environments",{

/***/ "./components/utils/gitops-utils.ts":
/*!******************************************!*\
  !*** ./components/utils/gitops-utils.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RetryError": () => (/* binding */ RetryError),
/* harmony export */   "TimeoutError": () => (/* binding */ TimeoutError),
/* harmony export */   "coFetchInternal": () => (/* binding */ coFetchInternal),
/* harmony export */   "fetchAllAppGroups": () => (/* binding */ fetchAllAppGroups),
/* harmony export */   "fetchAppGroups": () => (/* binding */ fetchAppGroups),
/* harmony export */   "getApplicationsBaseURI": () => (/* binding */ getApplicationsBaseURI),
/* harmony export */   "getApplicationsListBaseURI": () => (/* binding */ getApplicationsListBaseURI),
/* harmony export */   "getArgoCDFilteredAppsURI": () => (/* binding */ getArgoCDFilteredAppsURI),
/* harmony export */   "getManifestURLs": () => (/* binding */ getManifestURLs),
/* harmony export */   "getPipelinesBaseURI": () => (/* binding */ getPipelinesBaseURI),
/* harmony export */   "validateStatus": () => (/* binding */ validateStatus)
/* harmony export */ });
/* harmony import */ var _openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @openshift-console/dynamic-plugin-sdk */ "webpack/sharing/consume/default/@openshift-console/dynamic-plugin-sdk");
/* harmony import */ var _openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash-es */ "../node_modules/lodash-es/uniq.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash-es */ "../node_modules/lodash-es/trim.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash-es */ "../node_modules/lodash-es/defaultsDeep.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash-es */ "../node_modules/lodash-es/isEmpty.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash-es */ "../node_modules/lodash-es/sortBy.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lodash-es */ "../node_modules/lodash-es/flatten.js");
/* harmony import */ var lodash_es__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lodash-es */ "../node_modules/lodash-es/map.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


const getManifestURLs = (namespaces) => {
    const annotation = 'app.openshift.io/vcs-uri';
    return lodash_es__WEBPACK_IMPORTED_MODULE_1__["default"](namespaces
        .filter((ns) => {
        var _a, _b;
        return !!((_b = (_a = ns.metadata) === null || _a === void 0 ? void 0 : _a.annotations) === null || _b === void 0 ? void 0 : _b[annotation]);
    })
        .map((ns) => {
        var _a, _b;
        return (_b = (_a = ns.metadata) === null || _a === void 0 ? void 0 : _a.annotations) === null || _b === void 0 ? void 0 : _b[annotation];
    }));
};
const getApplicationsListBaseURI = () => {
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
class RetryError extends Error {
}
class TimeoutError extends Error {
    constructor(url, ms, ...params) {
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
const getCSRFToken = () => document &&
    document.cookie &&
    document.cookie
        .split(';')
        .map((c) => lodash_es__WEBPACK_IMPORTED_MODULE_2__["default"](c))
        .filter((c) => c.startsWith(cookiePrefix))
        .map((c) => c.slice(cookiePrefix.length))
        .pop();
const validateStatus = (response, url, method, retry) => __awaiter(void 0, void 0, void 0, function* () {
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
        var _a, _b, _c;
        // retry 409 conflict errors due to ClustResourceQuota / ResourceQuota
        // https://bugzilla.redhat.com/show_bug.cgi?id=1920699
        if (retry &&
            method === 'POST' &&
            response.status === 409 &&
            ['resourcequotas', 'clusterresourcequotas'].includes((_a = json.details) === null || _a === void 0 ? void 0 : _a.kind)) {
            throw new RetryError();
        }
        const cause = (_c = (_b = json.details) === null || _b === void 0 ? void 0 : _b.causes) === null || _c === void 0 ? void 0 : _c[0];
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
});
const coFetchInternal = (url, options, timeout, retry) => __awaiter(void 0, void 0, void 0, function* () {
    const allOptions = lodash_es__WEBPACK_IMPORTED_MODULE_3__["default"]({}, initDefaults, options);
    if (allOptions.method !== 'GET') {
        allOptions.headers['X-CSRFToken'] = getCSRFToken();
    }
    // If the URL being requested is absolute (and therefore, not a local request),
    // remove the authorization header to prevent credentials from leaking.
    if (url.indexOf('://') >= 0) {
        delete allOptions.headers.Authorization;
        delete allOptions.headers['X-CSRFToken'];
    }
    const fetchPromise = yield fetch(url, allOptions)
        .then((response) => response.json())
        .then((data) => {
        console.log('DATA!!! is ' + data);
        console.log(JSON.stringify(data));
    });
    // return fetch promise directly if timeout <= 0
    if (timeout < 1) {
        return fetchPromise;
    }
    const timeoutPromise = new Promise((unused, reject) => setTimeout(() => reject(new TimeoutError(url, timeout)), timeout));
    // Initiate both the fetch promise and a timeout promise
    return Promise.race([fetchPromise, timeoutPromise]);
});
const fetchAppGroups = (baseURL, manifestURL) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let data;
    try {
        const newListApi = getApplicationsListBaseURI();
        console.log('fetching ' + newListApi);
        data = yield (0,_openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_0__.consoleFetchJSON)(`${newListApi}?url=${manifestURL}&method=`);
    }
    catch (err) {
        console.log('ERROR in fetch ' + err);
        try {
            data = yield (0,_openshift_console_dynamic_plugin_sdk__WEBPACK_IMPORTED_MODULE_0__.consoleFetchJSON)(`${baseURL}&url=${manifestURL}`);
        }
        catch (_b) { } // eslint-disable-line no-empty
        // Ignore and let empty data be handled by fetchAllAppGroups
    }
    return (_a = data === null || data === void 0 ? void 0 : data.applications) !== null && _a !== void 0 ? _a : [];
});
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
const fetchAllAppGroups = (baseURL, manifestURLs, t) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('baseURLs: ', baseURL);
    console.log('manifestURLs: ', manifestURLs);
    let emptyMsg = null;
    let allAppGroups = null;
    console.log('Getting app groups ');
    if (baseURL) {
        if (lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](manifestURLs)) {
            emptyMsg = 'No GitOps manifest URLs found'; // t('gitops-plugin~No GitOps manifest URLs found');
        }
        else {
            try {
                allAppGroups = lodash_es__WEBPACK_IMPORTED_MODULE_5__["default"](lodash_es__WEBPACK_IMPORTED_MODULE_6__["default"](yield Promise.all(lodash_es__WEBPACK_IMPORTED_MODULE_7__["default"](manifestURLs, (manifestURL) => fetchAppGroups(baseURL, manifestURL)))), ['name']);
            }
            catch (_c) { } // eslint-disable-line no-empty
            if (lodash_es__WEBPACK_IMPORTED_MODULE_4__["default"](allAppGroups)) {
                emptyMsg = 'gitops-plugin~No Application groups found'; // t('gitops-plugin~No Application groups found');
            }
        }
    }
    return [allAppGroups, emptyMsg];
});
// TODO
// export const getEnvData = async (v2EnvURI: string, envURI: string, env: string, appURI: string) => {
//   let data;
//   try {
//     data = await coFetchJSON(`${v2EnvURI}/${env}${appURI}`);
//   } catch {
//     try {
//       data = await coFetchJSON(`${envURI}/${env}${appURI}`);
//     } catch {} // eslint-disable-line no-empty
//   }
//   return data;
// };
const getPipelinesBaseURI = (secretNS, secretName) => {
    return secretNS && secretName
        ? `/api/gitops/pipelines?secretNS=${secretNS}&secretName=${secretName}`
        : undefined;
};
const getArgoCDFilteredAppsURI = (argocdBaseUri, appGroupName) => {
    return argocdBaseUri && appGroupName
        ? `${argocdBaseUri}/applications?labels=app.kubernetes.io%252Fname%253D${appGroupName}`
        : undefined;
};
const getApplicationsBaseURI = (appName, secretNS, secretName, manifestURL) => {
    return secretNS && secretName
        ? `/application/${appName}?secretNS=${secretNS}&secretName=${secretName}&url=${manifestURL}&app=${appName}`
        : undefined;
};


/***/ })

});
//# sourceMappingURL=exposed-environments.3d9ae67885f4abc75738.hot-update.js.map